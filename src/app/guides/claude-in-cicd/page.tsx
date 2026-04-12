"use client";

import {
  GitPullRequest,
  Target,
  Terminal,
  ShieldAlert,
  Lock,
  Lightbulb,
  AlertTriangle,
  Coins,
  Bug,
  CheckCircle2,
  FileText,
  Bot,
  ScrollText,
  Calendar,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Recipe {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  tagline: string;
  whenToUse: string;
  yaml: string;
}

/* ── Data: Recipes ──────────────────────────────────────────────────── */

const RECIPES: Recipe[] = [
  {
    id: "pr-reviewer",
    title: "PR Reviewer",
    icon: <Bug className="h-5 w-5" />,
    color: "#5e9ed6",
    tagline: "Automatic review of every pull request for bugs, security, and perf",
    whenToUse:
      "Every team. This is the 80% win of Claude in CI. Fires on PR open/update, posts line-level comments, never complains about being tired.",
    yaml: `# .github/workflows/claude-review.yml
name: Claude PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Claude review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Review the diff between origin/main and HEAD.
            Call out:
            - Bugs (null handling, off-by-one, race conditions)
            - Security (injection, auth bypass, leaked secrets)
            - Performance (N+1 queries, inefficient loops, blocking I/O)
            - Maintainability (naming, coupling, test coverage gaps)
            Post inline comments on the exact lines. Keep it concise.
            If the diff is clean, say so in one sentence.`,
  },
  {
    id: "dep-audit",
    title: "Nightly Dependency Audit",
    icon: <Calendar className="h-5 w-5" />,
    color: "#d4a053",
    tagline: "Weekly scan for CVEs, outdated packages — files issues with fix plans",
    whenToUse:
      "Teams shipping production code. One workflow that keeps your dependencies honest. Runs off-hours, doesn't block PRs, leaves you a clean inbox of actionable issues.",
    yaml: `# .github/workflows/claude-dep-audit.yml
name: Dependency Audit

on:
  schedule:
    - cron: '0 2 * * 1'   # Mondays at 02:00 UTC
  workflow_dispatch:

permissions:
  contents: read
  issues: write

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --json > audit.json || true

      - name: Claude triages the report
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Read audit.json and package.json.
            For each CVE of severity "high" or "critical":
              1. Identify the impacted transitive dependency
              2. Propose the smallest version bump that fixes it
              3. Flag if a breaking change is required
            Create ONE GitHub issue titled "Weekly dep audit — <date>"
            with a checklist. Label: "security", "maintenance".`,
  },
  {
    id: "docs-sync",
    title: "Docs Sync",
    icon: <FileText className="h-5 w-5" />,
    color: "#5cb870",
    tagline: "Keep README and docs in sync with code changes — automatically",
    whenToUse:
      "Any project where docs have rotted at some point (so, every project). Fires on merges to main, opens a follow-up PR when docs drift.",
    yaml: `# .github/workflows/claude-docs-sync.yml
name: Docs Sync

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Claude detects & fixes docs drift
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Compare HEAD to HEAD~1.
            If any public API, CLI flag, env var, or route changed:
              - Update README.md's relevant section
              - Update docs/ if that section exists
              - Keep tone consistent with the existing doc
              - Do NOT rewrite whole sections; edit surgically
            If nothing changed, exit without opening a PR.
            Otherwise: open a PR titled "docs: sync with <commit>"
            and request review from the CODEOWNERS of the touched files.`,
  },
  {
    id: "test-generator",
    title: "Test Generator",
    icon: <Sparkles className="h-5 w-5" />,
    color: "#a07ed6",
    tagline: "Auto-generate tests for any new source file in a PR",
    whenToUse:
      "Teams with weak baseline coverage. Not a replacement for TDD — it's a safety net for files that arrive untested. Produces draft tests a human must review.",
    yaml: `# .github/workflows/claude-test-gen.yml
name: Test Generator

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: write
  pull-requests: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: List new source files
        id: new_files
        run: |
          git diff --name-only --diff-filter=A origin/main...HEAD \\
            | grep -E '^src/.*\\.(ts|tsx|js)$' \\
            | grep -v '\\.test\\.' \\
            > new_files.txt || true

      - name: Claude writes draft tests
        if: \${{ hashFiles('new_files.txt') != '' }}
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            For each file listed in new_files.txt:
              - Create a colocated .test.ts
              - Use Vitest + the project's existing patterns
              - One describe block per exported function
              - Cover happy path + at least one edge case
              - Mark complex edge cases as .todo() for the human
            Commit with message: "test: draft tests for new modules
            (Claude-generated, please review)"
            Push to the PR branch.`,
  },
  {
    id: "commit-enhancer",
    title: "Commit Message Enhancer",
    icon: <ScrollText className="h-5 w-5" />,
    color: "#d65ea0",
    tagline: "Rewrites weak commit messages with the 'why' before the PR merges",
    whenToUse:
      "Teams that enforce conventional commits but still see 'fix stuff' slip through. Runs before merge, suggests a better message, updates automatically when approved.",
    yaml: `# .github/workflows/claude-commit-enhancer.yml
name: Commit Message Enhancer

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  enhance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Claude suggests better commit messages
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Read all commits between origin/main and HEAD.
            For each commit with a weak message (< 10 chars, all caps,
            no type prefix, or no WHY), suggest a replacement that:
              - Uses the conventional commit format (feat/fix/docs/test/...)
              - Explains WHY the change was made, not what
              - Stays under 72 chars for the subject
            Post a single PR comment with the suggestions in a checklist.
            If all messages are good, say so in one line.`,
  },
];

const HEADLESS_EXAMPLES = [
  {
    title: "Generate a .gitignore",
    cmd: `claude -p "Generate a .gitignore file for Node.js"`,
  },
  {
    title: "Find bugs in a file",
    cmd: `cat src/utils.ts | claude -p "Find potential bugs"`,
  },
  {
    title: "Review a diff for security",
    cmd: `git diff origin/main...HEAD | claude -p "Review this diff for bugs, security issues, performance concerns"`,
  },
  {
    title: "Summarize commit activity",
    cmd: `git log --since="1 week ago" --pretty=format:"%h %s" | claude -p "Summarize this week's work in three bullets"`,
  },
];

const GOOD_USE_CASES = [
  "Nightly report generation",
  "Automated PR review bots",
  "Continuous monitoring scripts",
  "Batch processing jobs on a schedule",
  "Dependency audits weekly",
  "Checking CI failures overnight",
];

const SECURITY = [
  {
    title: "Never hardcode API keys",
    body: "Always reference them via secrets.ANTHROPIC_API_KEY. A leaked key means someone else runs up your Anthropic bill.",
  },
  {
    title: "Grant minimum permissions",
    body: "Only contents: write if Claude pushes commits. Only pull-requests: write if it posts PR comments. Read-only elsewhere. Defaults are a footgun.",
  },
  {
    title: "Scope the action by event",
    body: "Don't give a workflow both 'on: issues' and 'on: pull_request' unless it truly needs both. Tight triggers = less blast radius.",
  },
  {
    title: "Approval gates for writes",
    body: "For anything Claude pushes to main, require a human approval reviewer on the auto-opened PR. Branch protection rules are your friend.",
  },
  {
    title: "Pin the action version",
    body: "Use anthropics/claude-code-action@v1 or a pinned commit SHA. Don't use @main — you'll inherit unreviewed changes.",
  },
  {
    title: "Audit what Claude can see",
    body: "A Claude action has the repo contents in scope. If you check in secrets by accident, they're in Claude's context too. Audit .gitignore and use Dependabot / secret scanning.",
  },
];

const DEBUGGING = [
  {
    title: "Action times out",
    body: "Big repos + long prompts = slow. Increase the job timeout, narrow the prompt (tell Claude which files to read, not 'read the whole repo'), or use --max-turns to cap iterations.",
  },
  {
    title: "Non-determinism",
    body: "Claude's output varies between runs. If a PR review surfaces different bugs each time, that's expected — not a reliability issue for this use case. For deterministic tasks, give very specific instructions and tight output formats.",
  },
  {
    title: "Rate limits",
    body: "On bursty workflows (merge queues, many PRs at once), you can hit per-minute rate limits. Stagger runs with concurrency groups or use a queue.",
  },
  {
    title: "Silent failures",
    body: "If a workflow 'succeeds' but produces nothing, check the run logs. Common cause: exit code 0 even when Claude said 'I can't do that'. Use --verbose and parse stderr.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function ClaudeInCicdPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-claude-in-cicd-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <GitPullRequest className="h-4 w-4" />
            Playbook
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Claude Code in CI/CD: The GitHub Actions Playbook
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Five production workflow recipes, the security rules that keep your
            keys safe, and the debugging playbook for when the run turns red.
            Copy, adapt, ship.
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
                Why run Claude in CI
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                Claude Code in an interactive terminal is productive. Claude
                Code in CI is <em>compounding</em> — it reviews every PR,
                audits dependencies every week, generates tests for every new
                file, keeps docs in sync on every merge. Work that took Monday
                mornings now happens automatically.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                The official GitHub Action is{" "}
                <code className="bg-surface px-1.5 py-0.5 rounded">
                  anthropics/claude-code-action@v1
                </code>
                . Set it up once; reap the returns forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* Setup */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Zap className="h-3.5 w-3.5 mr-1" />
                Setup
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Setting up the Claude Code GitHub Action
              </h2>
              <p className="text-muted">
                One command, one secret, one workflow file. Total time: under
                five minutes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">01</span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Install the GitHub App
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Inside Claude Code, run the install helper. It walks you
                  through connecting the Anthropic GitHub App to your org and
                  storing the API key as a repo secret.
                </p>
                <div className="flex items-center justify-between bg-surface-2 rounded-lg p-3">
                  <code className="text-xs font-mono text-foreground">
                    /install-github-app
                  </code>
                  <CopyButton text="/install-github-app" />
                </div>
              </div>

              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">02</span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Confirm the secret is set
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Go to{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    Repo → Settings → Secrets and variables → Actions
                  </code>
                  . Verify <code className="bg-surface-2 px-1 rounded">
                    ANTHROPIC_API_KEY
                  </code>{" "}
                  exists. Never commit this value to the repo.
                </p>
              </div>

              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">03</span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Drop in your first workflow
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Add a <code className="bg-surface-2 px-1 rounded">
                    .github/workflows/claude-review.yml
                  </code>{" "}
                  (see the PR Reviewer recipe below) and push. Open a test PR —
                  Claude will comment within a minute.
                </p>
              </div>
            </div>
          </section>

          {/* Headless mode */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <Terminal className="h-3.5 w-3.5 mr-1" />
                Headless
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Headless mode CLI reference
              </h2>
              <p className="text-muted">
                The <code className="bg-surface-2 px-1.5 py-0.5 rounded">-p</code>{" "}
                / <code className="bg-surface-2 px-1.5 py-0.5 rounded">--print</code>{" "}
                flag runs Claude one-shot: read stdin, print output, exit. No
                interactive loop. This is the foundation every CI recipe sits
                on top of.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
              {HEADLESS_EXAMPLES.map((e) => (
                <div key={e.title}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted uppercase tracking-wide">
                      {e.title}
                    </span>
                    <CopyButton text={e.cmd} />
                  </div>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-3 rounded-lg overflow-x-auto leading-relaxed border border-border">
                    <code>{e.cmd}</code>
                  </pre>
                </div>
              ))}
              <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    Agent Mode (Automation)
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Inside a workflow, pass a{" "}
                    <code className="bg-surface-2 px-1 rounded">prompt</code>{" "}
                    input to the action and Claude runs headlessly on every
                    matching event — no human mention or interactive trigger
                    required. That&apos;s what powers every recipe below.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Good use cases */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Bot className="h-3.5 w-3.5 mr-1" />
                Fit
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When headless Claude is the right tool
              </h2>
              <p className="text-muted">
                Not every task belongs in CI. These do.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6">
              <div className="grid md:grid-cols-2 gap-3">
                {GOOD_USE_CASES.map((u) => (
                  <div key={u} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                    <span className="text-sm text-muted">{u}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recipes */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Recipes
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Five production workflow recipes
              </h2>
              <p className="text-muted">
                Drop-in YAML. Change the prompt, commit, done.
              </p>
            </div>
            <div className="space-y-6">
              {RECIPES.map((r, i) => (
                <div
                  key={r.id}
                  className="border border-border rounded-2xl bg-surface overflow-hidden"
                >
                  <div className="p-5 sm:p-6 border-b border-border">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                        style={{
                          backgroundColor: `${r.color}15`,
                          color: r.color,
                        }}
                      >
                        {r.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted font-mono mb-1">
                          Recipe #{i + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {r.title}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed mb-2">
                          {r.tagline}
                        </p>
                        <p className="text-xs text-muted italic leading-relaxed">
                          {r.whenToUse}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 bg-surface-2/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted uppercase tracking-wide font-mono">
                        .github/workflows/{r.id}.yml
                      </span>
                      <CopyButton text={r.yaml} />
                    </div>
                    <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border max-h-[500px]">
                      <code>{r.yaml}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <Lock className="h-3.5 w-3.5 mr-1" />
                Security
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Security best practices
              </h2>
              <p className="text-muted">
                An automated Claude with the wrong permissions is a liability.
                Six rules you should treat as non-negotiable.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {SECURITY.map((s, i) => (
                <div
                  key={s.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="h-4 w-4 text-red shrink-0" />
                    <span className="text-xs text-muted font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 border border-orange/30 bg-orange/5 rounded-xl p-5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  The permissions principle
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Grant only what the job needs. A PR reviewer gets{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    pull-requests: write
                  </code>
                  , nothing else. A commit pusher gets{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    contents: write
                  </code>
                  , nothing else. Default deny, explicit allow.
                </p>
              </div>
            </div>
          </section>

          {/* Debugging */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <Bug className="h-3.5 w-3.5 mr-1" />
                Debugging
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Debugging failed runs
              </h2>
            </div>
            <div className="space-y-3">
              {DEBUGGING.map((d, i) => (
                <div
                  key={d.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-accent font-mono text-sm shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {d.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {d.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cost control */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Coins className="h-3.5 w-3.5 mr-1" />
                Cost
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Cost control for automated workflows
              </h2>
              <p className="text-muted">
                CI is where bills go to die if you&apos;re not careful. Four
                levers that keep it predictable.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Use a cheaper model for triage
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Haiku/Sonnet for first-pass review; escalate to Opus only if
                  the PR is complex or the first pass flagged something. Pass{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    model: claude-haiku-4-6
                  </code>{" "}
                  (or whichever tier fits) to the action.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Narrow the context
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Don&apos;t feed the whole repo on every run. For PR reviews,
                  pass only the diff. For audits, pass the audit JSON.
                  Prompting Claude to &quot;read the repo&quot; is the fastest
                  way to burn tokens.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Turn on prompt caching
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  If your CI runs have a big shared system prompt (review
                  guidelines, style guide), cache it. See the prompt caching
                  guide — 90% discount on the reused prefix.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Set concurrency + budgets
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  GitHub&apos;s{" "}
                  <code className="bg-surface-2 px-1 rounded">concurrency</code>{" "}
                  key prevents stacked runs on rapid pushes. Set an Anthropic
                  usage alert and you&apos;ll know before a runaway loop
                  becomes a Monday incident.
                </p>
              </div>
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
                Start with the PR Reviewer recipe — it pays for itself inside a
                week. Add one more recipe per sprint. Pin the action version,
                scope the permissions, cache the system prompt, and set a usage
                alert. Your team&apos;s checklist of &quot;someone should
                really do that&quot; jobs becomes Claude&apos;s problem forever.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
