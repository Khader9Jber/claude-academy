"use client";

import {
  GitBranch,
  Layers,
  Users,
  Target,
  Workflow,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  GitMerge,
  Trash2,
  Split,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Data ───────────────────────────────────────────────────────────── */

const ENABLE_METHODS = [
  {
    title: "CLI launch flag",
    subtitle: "Per-session, temporary",
    code: "claude --worktree",
    body: "Start Claude Code with worktree mode on. Every sub-agent the main agent dispatches runs in its own checkout. Great for one-off parallel runs where you don't want to commit any config.",
  },
  {
    title: "Sub-agent frontmatter",
    subtitle: "Per-agent, permanent",
    code: `---
name: backend-refactor
isolation: worktree
---
You are a backend refactor specialist.`,
    body: "Add isolation: worktree to any custom sub-agent's markdown definition. This agent always runs isolated, even when the parent session isn't in worktree mode. Best for agents you use repeatedly in parallel.",
  },
  {
    title: "Just tell Claude",
    subtitle: "Ad-hoc, conversational",
    code: `"Use worktrees for your sub-agents when you dispatch them."`,
    body: "The simplest path. The orchestrating agent picks up the instruction and sets isolation when spawning children. No config, no flags — works fine for most sessions.",
  },
];

const PARALLEL_RULES = [
  {
    title: "3+ unrelated tasks",
    body: "Below this threshold the coordination overhead eats the speedup. One or two tasks? Do them sequentially — faster end-to-end.",
  },
  {
    title: "No shared state",
    body: "If two tasks read or write the same module, you'll get merge pain. True independence is non-negotiable.",
  },
  {
    title: "Clear file boundaries",
    body: "Frontend agent touches only src/app/, backend agent touches only src/api/. Any overlap, anywhere, breaks parallelism.",
  },
  {
    title: "Independent verification",
    body: "Each task must be testable in isolation (its own test file or tsc pass). If you can only verify by running the whole app, parallelism won't save you time.",
  },
];

const SEQ_VS_PAR = [
  {
    mode: "Sequential",
    icon: <Workflow className="h-4 w-4" />,
    color: "text-blue",
    when: [
      "Tasks depend on each other (A's output is B's input)",
      "Shared files or overlapping modules",
      "Quality matters more than speed — review each step",
      "Single reviewer, single merge queue",
      "Small or exploratory changes",
    ],
  },
  {
    mode: "Parallel",
    icon: <Split className="h-4 w-4" />,
    color: "text-green",
    when: [
      "Three or more genuinely independent tasks",
      "Clear domain boundaries (frontend vs backend vs db)",
      "Exploration: try three approaches, pick the winner",
      "Large refactor that splits cleanly by file path",
      "You can afford to throw away 2 of 3 worktrees",
    ],
  },
];

const PITFALLS = [
  {
    title: "Shared state sneaks in",
    body: "Two agents both import from src/lib/utils.ts. Both 'independently' edit it. Merge conflict. Audit your imports before splitting — if more than one agent will touch a file, keep them sequential.",
  },
  {
    title: "Env setup is not free",
    body: "Each worktree is a fresh checkout. node_modules, .venv, .env.local — none of it carries over. Budget 30-60s per worktree for installs, or script a setup step the agents run first.",
  },
  {
    title: "Lockfiles drift",
    body: "If two parallel agents add dependencies, you'll hit lockfile conflicts at merge time. Either pre-install everything upfront, or limit dep changes to one worktree.",
  },
  {
    title: "Database migrations collide",
    body: "Never run parallel agents that generate migrations — timestamp collisions and ordering bugs are nearly guaranteed. Migrations are sequential by nature.",
  },
  {
    title: "Silent environment drift",
    body: "Worktree A has NODE_ENV=test from a previous run, worktree B has NODE_ENV=development. Tests pass in one, fail in the other. Always snapshot env at setup.",
  },
  {
    title: "Orphan worktrees pile up",
    body: "Clean worktrees auto-delete, but any worktree with changes persists by design (for review). Periodically git worktree list and prune stale ones.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function ParallelDevelopmentPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-parallel-development-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <GitBranch className="h-4 w-4" />
            Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Parallel Development: Worktrees and Sub-Agents
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Run three agents at once without them stepping on each other. The
            exact rules, the setup, and the pitfalls — so parallelism actually
            saves you time instead of creating merge chaos.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Why this matters
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                A single Claude agent is fast. Three agents working in separate
                worktrees on independent domains are three times faster — if you
                structure the work correctly. If you don&apos;t, they stomp on
                each other&apos;s files, the merge is a nightmare, and you spend
                the savings fixing conflicts.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                This guide is about when parallelism is actually worth it and
                how to wire it up so it works.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* What is a worktree */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Foundations
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What a git worktree is (and why agents love it)
              </h2>
              <p className="text-muted">
                A worktree is a second, third, or tenth checkout of the same
                repository — each pointing at a different branch, each in its
                own directory, each with its own index and working tree.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
              <p className="text-sm text-muted leading-relaxed">
                Git itself has supported this since 2.5 via{" "}
                <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground">
                  git worktree add
                </code>
                . Claude Code wires it up automatically. When worktree isolation
                is on, every sub-agent gets:
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                  <span>
                    A dedicated directory outside your main checkout so edits
                    don&apos;t collide
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                  <span>A new branch, typically named after the task</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                  <span>
                    Its own independent git index — commits don&apos;t interfere
                    with yours
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                  <span>
                    Shared object database with the main repo — cheap, fast, no
                    full re-clone
                  </span>
                </li>
              </ul>
              <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    Pro tip
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Without worktrees, parallel agents editing the same
                    filesystem is a race condition. With worktrees, each agent
                    has its own universe — you merge the winning branch at the
                    end and discard the rest.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3 ways to enable */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <Zap className="h-3.5 w-3.5 mr-1" />
                Enable
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Three ways to turn on worktree isolation
              </h2>
              <p className="text-muted">
                Same outcome, different blast radius. Pick based on how
                permanent you want it.
              </p>
            </div>
            <div className="space-y-4">
              {ENABLE_METHODS.map((m, i) => (
                <div
                  key={m.title}
                  className="border border-border rounded-xl bg-surface overflow-hidden"
                >
                  <div className="p-5 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted font-mono">
                            #{i + 1}
                          </span>
                          <h3 className="text-base font-semibold text-foreground">
                            {m.title}
                          </h3>
                        </div>
                        <div className="text-xs text-muted mb-2 italic">
                          {m.subtitle}
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                          {m.body}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-2 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted uppercase tracking-wide">
                        Example
                      </span>
                      <CopyButton text={m.code} />
                    </div>
                    <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border">
                      <code>{m.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Parallel rules */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Users className="h-3.5 w-3.5 mr-1" />
                Rules
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When to dispatch in parallel
              </h2>
              <p className="text-muted">
                All four conditions must be true. If any one fails, run the work
                sequentially — it will be faster end-to-end.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {PARALLEL_RULES.map((r, i) => (
                <div
                  key={r.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent font-mono text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {r.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 border border-red/30 bg-red/5 rounded-xl p-5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  The critical rule
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Parallel only works when agents touch{" "}
                  <strong className="text-foreground">different files</strong>.
                  Not &quot;probably different&quot;. Not &quot;mostly
                  different&quot;. Different. If two agents edit the same file,
                  one of their branches is going to be thrown away.
                </p>
              </div>
            </div>
          </section>

          {/* Sequential vs Parallel table */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <Workflow className="h-3.5 w-3.5 mr-1" />
                Decision
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Sequential vs parallel: pick the right shape
              </h2>
              <p className="text-muted">
                Parallel is flashy but sequential is usually faster. Here&apos;s
                the call.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {SEQ_VS_PAR.map((col) => (
                <div
                  key={col.mode}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn("flex items-center gap-1.5", col.color)}>
                      {col.icon}
                      <span className="text-base font-semibold">
                        {col.mode}
                      </span>
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted">
                    {col.when.map((w) => (
                      <li key={w} className="flex gap-2">
                        <span className={cn("shrink-0 mt-1", col.color)}>•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Real example */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Split className="h-3.5 w-3.5 mr-1" />
                Example
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Parallel refactor: three agents, one merge
              </h2>
              <p className="text-muted">
                A realistic scenario — migrating a Next.js app from Pages Router
                to App Router, split by domain.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-border">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  The prompt
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Given to the main orchestrating agent in a session launched
                  with <code className="bg-surface-2 px-1 rounded">--worktree</code>:
                </p>
                <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
                  <code>{`Migrate this Next.js app from Pages Router to App Router.
Split the work into three parallel sub-agents using worktrees:

1. frontend-agent   → migrate pages under src/pages/(marketing)/
2. dashboard-agent  → migrate pages under src/pages/dashboard/
3. api-agent        → migrate API routes from src/pages/api/ to src/app/api/

Each agent:
- Runs npm install in its worktree
- Creates a feature branch: migrate/<domain>
- Runs tests before declaring done
- Does NOT touch shared files (src/lib/, src/components/ui/)

If an agent needs to change a shared file, flag it and I will do it
sequentially after merge.`}</code>
                </pre>
              </div>

              <div className="p-5 sm:p-6 bg-surface-2/30 space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  What happens on disk
                </h3>
                <pre className="text-xs text-foreground/90 font-mono bg-surface p-4 rounded-lg overflow-x-auto leading-relaxed border border-border">
                  <code>{`my-app/                              # main checkout, your HEAD
../my-app-frontend-agent/            # worktree on branch migrate/marketing
../my-app-dashboard-agent/           # worktree on branch migrate/dashboard
../my-app-api-agent/                 # worktree on branch migrate/api

$ git worktree list
/work/my-app                 abc123 [main]
/work/my-app-frontend-agent  def456 [migrate/marketing]
/work/my-app-dashboard-agent 789abc [migrate/dashboard]
/work/my-app-api-agent       12def3 [migrate/api]`}</code>
                </pre>

                <p className="text-sm text-muted leading-relaxed">
                  Three branches advance independently. Each agent installs
                  deps, runs tests, and commits inside its worktree. Your main
                  checkout is untouched — you can keep working on something
                  else in it while this happens.
                </p>
              </div>
            </div>
          </section>

          {/* Domain routing */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Pattern
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Domain-based agent routing
              </h2>
              <p className="text-muted">
                The cleanest way to split parallel work: one agent owns one
                domain, full stop.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6">
              <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
                <code>{`Agent            Domain                  Files it can touch
─────────────────────────────────────────────────────────────────
frontend-agent   React components        src/components/**
                                         src/app/**/page.tsx
                                         src/app/**/layout.tsx

backend-agent    API & business logic    src/app/api/**
                                         src/lib/services/**

database-agent   Schema & migrations     prisma/schema.prisma
                                         prisma/migrations/**
                                         src/lib/db/**

Shared (SEQUENTIAL, handled by orchestrator after merges):
                                         src/lib/utils.ts
                                         src/types/**
                                         package.json`}</code>
              </pre>
              <div className="mt-5 border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    Pro tip
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Put this table in your CLAUDE.md. The orchestrator reads it
                    and refuses to cross lanes — you get fewer merge conflicts
                    for free.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Merge strategy */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <GitMerge className="h-3.5 w-3.5 mr-1" />
                Merge
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Picking the winning branch
              </h2>
              <p className="text-muted">
                When you dispatch multiple agents on the SAME problem (not
                different domains — same problem, different approaches), the
                merge strategy is different.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
              <div className="space-y-3 text-sm text-muted leading-relaxed">
                <p>
                  <strong className="text-foreground">Exploration mode.</strong>{" "}
                  You ask three agents to implement the same feature three
                  different ways. Each one ends up in its own worktree with its
                  own branch.
                </p>
                <p>
                  <strong className="text-foreground">The review.</strong> You
                  read all three diffs, run all three test suites, and pick the
                  one you like best. Merge its branch. Throw away the other two
                  worktrees.
                </p>
                <p>
                  <strong className="text-foreground">
                    The free cleanup.
                  </strong>{" "}
                  Worktrees with no changes are auto-deleted by Claude Code.
                  Worktrees with changes persist for review. So the &quot;bad&quot;
                  attempts stick around until you explicitly discard them —
                  exactly what you want.
                </p>
              </div>
              <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
                <code>{`# After picking the winner
git merge migrate/api-approach-2

# Discard the losing worktrees
git worktree remove ../my-app-api-approach-1
git worktree remove ../my-app-api-approach-3
git branch -D migrate/api-approach-1 migrate/api-approach-3`}</code>
              </pre>
            </div>
          </section>

          {/* Cleanup */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Cleanup
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Auto-cleanup behavior
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-green/30 bg-green/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  Worktrees with NO changes
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Automatically cleaned up when the agent finishes. No disk
                  bloat, no stale branches. If a sub-agent did nothing useful,
                  it disappears — as if it never ran.
                </p>
              </div>
              <div className="border border-orange/30 bg-orange/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange" />
                  Worktrees WITH changes
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Persist on purpose, so you can review. They stay until you
                  explicitly{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    git worktree remove
                  </code>{" "}
                  them. Periodically list and prune so your filesystem
                  doesn&apos;t fill up with abandoned agent runs.
                </p>
              </div>
            </div>
            <div className="mt-5 border border-border rounded-xl bg-surface p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted uppercase tracking-wide">
                  Housekeeping commands
                </span>
                <CopyButton
                  text={`# List every worktree
git worktree list

# Prune stale worktree metadata (safe)
git worktree prune

# Force-remove a worktree you're done with
git worktree remove ../my-app-api-agent --force

# Nuke the branch too
git branch -D migrate/api`}
                />
              </div>
              <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed border border-border">
                <code>{`# List every worktree
git worktree list

# Prune stale worktree metadata (safe)
git worktree prune

# Force-remove a worktree you're done with
git worktree remove ../my-app-api-agent --force

# Nuke the branch too
git branch -D migrate/api`}</code>
              </pre>
            </div>
          </section>

          {/* Pitfalls */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Pitfalls
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Things that break parallel development
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {PITFALLS.map((p) => (
                <div
                  key={p.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final callout */}
          <section>
            <div
              className={cn(
                "border border-accent/30 bg-accent/5 rounded-2xl p-6 sm:p-8"
              )}
            >
              <h2 className="text-xl font-bold text-foreground mb-3 font-serif italic">
                The one-line summary
              </h2>
              <p className="text-muted leading-relaxed">
                Parallelism is a coordination tax. It pays off only with three
                or more truly independent tasks, clean file boundaries, and
                per-worktree env setup. Default to sequential. Reach for
                worktrees when the split is obvious.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
