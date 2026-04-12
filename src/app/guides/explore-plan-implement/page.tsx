"use client";

import {
  Compass,
  Search,
  ClipboardList,
  Hammer,
  GitCommit,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MessageCircleQuestion,
  Users,
  Layers,
  FileText,
  Sparkles,
  Keyboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Helpers ──────────────────────────────────────────────────────── */

function CodeBlock({
  label,
  body,
}: {
  label: string;
  body: string;
}) {
  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-border">
        <span className="text-xs text-muted font-mono">{label}</span>
        <CopyButton text={body} />
      </div>
      <pre className="text-xs text-foreground/90 font-mono p-4 overflow-x-auto leading-relaxed">
        <code>{body}</code>
      </pre>
    </div>
  );
}

function TipBox({
  kind = "tip",
  title,
  children,
}: {
  kind?: "tip" | "warn" | "info";
  title: string;
  children: React.ReactNode;
}) {
  const styles =
    kind === "tip"
      ? "border-green/30 bg-green/5"
      : kind === "warn"
        ? "border-red/30 bg-red/5"
        : "border-accent/30 bg-accent/5";
  const Icon =
    kind === "tip" ? Lightbulb : kind === "warn" ? AlertTriangle : Target;
  const color =
    kind === "tip"
      ? "text-green"
      : kind === "warn"
        ? "text-red"
        : "text-accent";
  return (
    <div className={cn("border rounded-lg p-4 flex items-start gap-3", styles)}>
      <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", color)} />
      <div>
        <div className="text-xs font-semibold text-foreground mb-1">
          {title}
        </div>
        <div className="text-sm text-muted leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ── Phase metadata ───────────────────────────────────────────────── */

const PHASES = [
  {
    n: 1,
    key: "explore",
    title: "Explore",
    mode: "Plan Mode",
    icon: <Search className="h-5 w-5" />,
    color: "#5e9ed6",
    tag: "cyan" as const,
  },
  {
    n: 2,
    key: "plan",
    title: "Plan",
    mode: "Plan Mode",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "#a07ed6",
    tag: "purple" as const,
  },
  {
    n: 3,
    key: "implement",
    title: "Implement",
    mode: "Normal Mode",
    icon: <Hammer className="h-5 w-5" />,
    color: "#5cb870",
    tag: "green" as const,
  },
  {
    n: 4,
    key: "commit",
    title: "Commit",
    mode: "Normal Mode",
    icon: <GitCommit className="h-5 w-5" />,
    color: "#d4a053",
    tag: "orange" as const,
  },
];

/* ── Page ─────────────────────────────────────────────────────────── */

export default function ExplorePlanImplementPage() {
  const explorePrompt = `Plan mode. I want you to understand the area of the code
that handles webhook ingestion.

Read everything relevant — routes, handlers, background
jobs, the database models, the tests. Do not make any
changes. When you're done, tell me:

1. Files you read and what each one does
2. How requests flow from HTTP to persisted state
3. Anything confusing, inconsistent, or risky you noticed
4. Questions you have before we decide anything

Be thorough. Take as long as you need.`;

  const planPrompt = `Still plan mode. Based on what you explored, write a
detailed plan to add a new Stripe webhook handler.

The plan must include:
- New files to create (with purpose)
- Existing files to modify (with the shape of the change)
- Database migrations required
- Tests to add (unit + E2E) with example cases
- Rollout steps
- Risks and how we'll mitigate them
- Explicit "not in scope" list

When the plan is ready, pause. I will open it in my editor
with Ctrl+G, edit it directly, and tell you when to proceed.`;

  const implementPrompt = `Normal mode. Execute the plan we agreed on.

Rules:
- Follow the plan step by step — don't improvise
- After each meaningful step, verify against the plan and
  tell me what's done
- If a step turns out to be wrong or incomplete, stop and
  propose a plan amendment instead of silently deviating
- Run the tests as you go, not just at the end`;

  const commitPrompt = `Write a commit message that describes:
- What changed
- Why (reference the ticket or the user-facing outcome)
- Any migration or deploy steps a reviewer needs to know

Then open a PR with gh pr create. The PR description should
link back to the plan, list the testing done, and call out
anything left deliberately out of scope.`;

  const interviewPrompt = `I want to build X. Interview me in detail using the
AskUserQuestion tool. Ask about technical implementation,
UI/UX, edge cases, concerns, and tradeoffs. Keep
interviewing until we've covered everything, then write a
complete spec to SPEC.md.`;

  const freshSessionPrompt = `/clear

Read SPEC.md thoroughly. Then run the full Explore → Plan →
Implement → Commit workflow to build what it describes.

Start in plan mode. Confirm you've read the spec and ask
any questions before exploring the code.`;

  const reviewerPrompt = `You are a code reviewer working with a fresh context.
You have not seen how the code was written — only the
final diff and the spec.

Read:
- SPEC.md (the intent)
- The diff on the current branch (the implementation)
- Our security checklist at docs/SECURITY_CHECKLIST.md

Produce a review with:
- Summary (one paragraph)
- Findings (severity, file, line, recommendation)
- Questions for the author

Do not edit code. Report only.`;

  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-explore-plan-implement-page"
    >
      {/* Hero */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Compass className="h-4 w-4" />
            Anthropic&apos;s recommended workflow
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Explore → Plan → Implement → Commit
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg mb-8">
            The 4-phase workflow Anthropic teaches as the highest-leverage
            pattern for complex Claude Code tasks. When to use it, when to
            skip it, and how each phase compounds.
          </p>

          {/* Phase pill diagram */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PHASES.map((p, idx) => (
              <div key={p.key} className="flex items-center gap-2">
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
                  style={{
                    backgroundColor: `${p.color}15`,
                    color: p.color,
                    borderColor: `${p.color}40`,
                  }}
                >
                  {p.icon}
                  <span>
                    {p.n}. {p.title}
                  </span>
                </div>
                {idx < PHASES.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this exists */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted mb-1">
                Why this workflow exists
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                The problem with jumping straight to code
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                Ask Claude to &quot;add a webhook handler&quot; cold and
                you&apos;ll get plausible code that imports the wrong helper,
                misses three existing patterns, and breaks two tests you
                didn&apos;t know about. Not because Claude is bad — because
                it had no chance to look first.
              </p>
              <p className="text-sm text-muted leading-relaxed mb-3">
                The four phases separate <em>reading</em> from{" "}
                <em>deciding</em> from <em>writing</em> from <em>shipping</em>.
                Each one has its own mindset, its own success criteria, and
                its own output. Skip a phase and the next one suffers — plan
                without exploring, and the plan is fiction. Implement without
                planning, and the implementation wanders.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Anthropic calls this the highest-leverage pattern for
                complex tasks, and it&apos;s the one most teams feel an
                immediate difference from adopting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-14">
          {/* Phase 1: Explore */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <Search className="h-3.5 w-3.5 mr-1" />
                Phase 1 · Plan Mode
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Explore
              </h2>
              <p className="text-muted leading-relaxed">
                Claude reads files and answers questions without making any
                changes. The goal is a shared map of the territory — you and
                Claude both know what&apos;s there before anyone proposes a
                route.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="text-xs uppercase tracking-wide text-muted mb-2">
                    What Claude does
                  </div>
                  <ul className="text-sm text-muted space-y-2 leading-relaxed">
                    <li>- Reads relevant files, top to bottom</li>
                    <li>- Traces call graphs and data flow</li>
                    <li>- Flags inconsistencies or risks</li>
                    <li>- Asks clarifying questions</li>
                    <li>- Makes no code changes</li>
                  </ul>
                </div>
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="text-xs uppercase tracking-wide text-muted mb-2">
                    What you do
                  </div>
                  <ul className="text-sm text-muted space-y-2 leading-relaxed">
                    <li>- Answer Claude&apos;s questions</li>
                    <li>- Correct wrong assumptions early</li>
                    <li>- Point to patterns Claude missed</li>
                    <li>- Decide if exploration is deep enough</li>
                  </ul>
                </div>
              </div>

              <CodeBlock label="Example explore prompt" body={explorePrompt} />

              <TipBox kind="tip" title="Ask for a summary, not a transcript">
                If Claude reads twenty files, you don&apos;t want twenty
                file dumps — you want the ten sentences that matter. End
                the prompt with &quot;give me the shortest summary that
                would let someone else plan this change.&quot;
              </TipBox>
            </div>
          </section>

          {/* Phase 2: Plan */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <ClipboardList className="h-3.5 w-3.5 mr-1" />
                Phase 2 · Plan Mode
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">Plan</h2>
              <p className="text-muted leading-relaxed">
                Still in Plan Mode. Now Claude turns exploration into a
                concrete plan — files, tests, migrations, rollout, risks.
                The deliverable is a document both of you can agree to
                before any code gets written.
              </p>
            </div>
            <div className="space-y-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="text-xs uppercase tracking-wide text-muted mb-2">
                  What a good plan contains
                </div>
                <ul className="text-sm text-muted space-y-2 leading-relaxed">
                  <li>
                    - <span className="text-foreground">New files</span> with
                    a one-line purpose each
                  </li>
                  <li>
                    - <span className="text-foreground">Modified files</span>{" "}
                    with the shape of the change, not just the name
                  </li>
                  <li>
                    - <span className="text-foreground">Tests</span> with
                    example cases — not just &quot;add tests&quot;
                  </li>
                  <li>
                    - <span className="text-foreground">Migrations</span> and
                    rollout steps in order
                  </li>
                  <li>
                    - <span className="text-foreground">Risks</span> and
                    mitigations, named
                  </li>
                  <li>
                    - An explicit{" "}
                    <span className="text-foreground">not-in-scope</span> list
                    so the plan doesn&apos;t creep
                  </li>
                </ul>
              </div>

              <CodeBlock label="Example plan prompt" body={planPrompt} />

              <div className="border border-border rounded-xl bg-surface p-5 flex items-start gap-3">
                <Keyboard className="h-5 w-5 text-accent shrink-0 mt-1" />
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">
                    Edit the plan directly with Ctrl+G
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    When Claude produces a plan in Plan Mode, press{" "}
                    <code className="bg-surface-2 px-1 rounded">Ctrl+G</code>{" "}
                    to open it in your editor. Strike sections, reorder
                    steps, tighten wording, add constraints. When you save
                    and return, Claude treats your edits as the agreed
                    plan. Editing the plan is cheaper than arguing with
                    Claude about every revision.
                  </p>
                </div>
              </div>

              <TipBox kind="warn" title="Don't let plan mode drift into code">
                If Claude starts proposing implementation details
                (&quot;then we&apos;ll write this function like
                this...&quot;), pull back. Plan mode should describe the
                <em> shape </em> of the change — the code comes after
                you&apos;ve signed off.
              </TipBox>
            </div>
          </section>

          {/* Phase 3: Implement */}
          <section>
            <div className="mb-6">
              <Badge variant="green" className="mb-3">
                <Hammer className="h-3.5 w-3.5 mr-1" />
                Phase 3 · Normal Mode
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Implement
              </h2>
              <p className="text-muted leading-relaxed">
                Leave plan mode. Claude executes the plan, step by step,
                verifying each step against what you agreed to. The plan
                becomes the scoreboard — if the code drifts, you and Claude
                both see it.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock
                label="Example implement prompt"
                body={implementPrompt}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <TipBox kind="tip" title="Verify against the plan as you go">
                  After each meaningful step, have Claude check what was
                  done against the plan. You catch deviations at step 3
                  instead of step 12 — where the fix is cheap.
                </TipBox>
                <TipBox kind="tip" title="Run tests as you write them">
                  Writing all tests at the end invites bugs. Have Claude
                  run the tests for each step as it finishes — the
                  verification loop is the whole point.
                </TipBox>
              </div>

              <TipBox kind="warn" title="If reality diverges, amend the plan">
                When Claude discovers the plan was wrong — a file
                didn&apos;t exist, a migration clashed — stop. Tell Claude
                to propose a plan amendment and wait for your sign-off
                before continuing. Silent deviation is how good plans
                become bad code.
              </TipBox>
            </div>
          </section>

          {/* Phase 4: Commit */}
          <section>
            <div className="mb-6">
              <Badge variant="orange" className="mb-3">
                <GitCommit className="h-3.5 w-3.5 mr-1" />
                Phase 4 · Normal Mode
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Commit
              </h2>
              <p className="text-muted leading-relaxed">
                The last phase is the one most people rush. A good commit
                message and a well-framed PR do the work of onboarding
                every future reader — including future-you at 2am, six
                months from now.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock label="Example commit prompt" body={commitPrompt} />

              <div className="overflow-x-auto border border-border rounded-xl bg-surface">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2 text-left">
                    <tr>
                      <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                        Include
                      </th>
                      <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                        Why
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="align-top">
                      <td className="p-4 font-medium text-foreground whitespace-nowrap">
                        What changed
                      </td>
                      <td className="p-4 text-muted leading-relaxed">
                        One-line subject line, specific enough to skim in a
                        git log six months later.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-4 font-medium text-foreground whitespace-nowrap">
                        Why it changed
                      </td>
                      <td className="p-4 text-muted leading-relaxed">
                        Reference the ticket, the user-facing outcome, the
                        bug the change fixes. Future readers don&apos;t
                        care how; they care why.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-4 font-medium text-foreground whitespace-nowrap">
                        Migration / deploy notes
                      </td>
                      <td className="p-4 text-muted leading-relaxed">
                        Any env var, migration, order-of-operations thing
                        a reviewer needs to know. Not in the diff, so put
                        it in the message.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-4 font-medium text-foreground whitespace-nowrap">
                        Link to the plan
                      </td>
                      <td className="p-4 text-muted leading-relaxed">
                        Paste or link the plan document in the PR. The
                        plan + the diff together are the full story.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <TipBox kind="tip" title="Let Claude open the PR">
                With{" "}
                <code className="bg-surface-2 px-1 rounded">gh</code>{" "}
                installed, Claude can run{" "}
                <code className="bg-surface-2 px-1 rounded">
                  gh pr create
                </code>{" "}
                itself. Give it the title shape you want
                (&quot;feat: ...&quot;, &quot;fix: ...&quot;) and the
                description structure, then read what it writes before
                approving.
              </TipBox>
            </div>
          </section>

          {/* When to skip */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <XCircle className="h-3.5 w-3.5 mr-1" />
                When to skip
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When this workflow is overkill
              </h2>
              <p className="text-muted leading-relaxed">
                The workflow is powerful but not free — it takes time. For
                small, localized, well-understood changes, skip it and go
                straight to implementing.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red" />
                  <span className="text-sm font-semibold text-foreground">
                    Typos
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  &quot;Fix the typo in the login page heading&quot;.
                  There&apos;s nothing to explore and nothing to plan.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red" />
                  <span className="text-sm font-semibold text-foreground">
                    Log lines
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Adding a{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    console.log
                  </code>{" "}
                  or structured log field. Trivial and reversible.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red" />
                  <span className="text-sm font-semibold text-foreground">
                    Renames
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Local variable or parameter renames that don&apos;t
                  cross file boundaries.
                </p>
              </div>
            </div>
          </section>

          {/* When to use */}
          <section>
            <div className="mb-6">
              <Badge variant="green" className="mb-3">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                When to use
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When the full workflow pays off
              </h2>
              <p className="text-muted leading-relaxed">
                Any task where you couldn&apos;t confidently describe the
                change in three sentences before reading the code. If
                you&apos;re even slightly unsure about approach, run the
                four phases.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border border-green/30 bg-green/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  <span className="text-sm font-semibold text-foreground">
                    Unfamiliar code
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Anywhere you can&apos;t already picture the file tree.
                  Exploration is a prerequisite for any change you&apos;d
                  trust.
                </p>
              </div>
              <div className="border border-green/30 bg-green/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  <span className="text-sm font-semibold text-foreground">
                    Multi-file changes
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Whenever the blast radius crosses more than one or two
                  files. Plans prevent accidental refactors from leaking
                  across the repo.
                </p>
              </div>
              <div className="border border-green/30 bg-green/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  <span className="text-sm font-semibold text-foreground">
                    Uncertain approach
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  When you&apos;d have to hand-wave if a teammate asked
                  &quot;so how are you doing this?&quot;, run plan mode
                  first.
                </p>
              </div>
            </div>
          </section>

          {/* Interview me pattern */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <MessageCircleQuestion className="h-3.5 w-3.5 mr-1" />
                Extension
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                The &quot;interview me&quot; pattern
              </h2>
              <p className="text-muted leading-relaxed">
                For features large enough that even exploration feels
                premature, Anthropic recommends letting Claude interview
                you first. Claude uses the AskUserQuestion tool to pull the
                spec out of your head, writes it to{" "}
                <code className="bg-surface-2 px-1 rounded">SPEC.md</code>,
                and then the four phases run against the spec in a fresh
                session.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock
                label="The official interview prompt (verbatim)"
                body={interviewPrompt}
              />

              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="text-xs uppercase tracking-wide text-muted mb-2">
                  What a good interview covers
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      Technical implementation
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      Stack, integration points, data model, auth
                      surface.
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      UI / UX
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      User flows, states, empty states, error cases,
                      analytics events.
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      Edge cases
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      Concurrency, partial failures, permissions, rate
                      limits, offline.
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      Concerns &amp; tradeoffs
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      Performance vs simplicity, build vs buy, ship-now
                      vs ship-right.
                    </p>
                  </div>
                </div>
              </div>

              <TipBox kind="tip" title="Run the SPEC.md in a fresh session">
                When the interview is done, the transcript is long and
                discursive — exactly the kind of thing you don&apos;t
                want in your implementation context. Start a new session
                and hand it only the clean{" "}
                <code className="bg-surface-2 px-1 rounded">SPEC.md</code>.
                Much better signal density.
              </TipBox>

              <CodeBlock
                label="Starting the fresh session against the spec"
                body={freshSessionPrompt}
              />
            </div>
          </section>

          {/* Integrating with sessions and subagents */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Integrations
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Integrating with sessions and subagents
              </h2>
              <p className="text-muted leading-relaxed">
                The workflow compounds with two other Claude Code patterns:
                running the spec in a fresh session, and using a subagent
                for code review after implementation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">
                    Fresh session per spec
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-2">
                  An interview is dozens of exchanges. A plan run from
                  that session inherits all of it — including the
                  tangents. Run{" "}
                  <code className="bg-surface-2 px-1 rounded">/clear</code>{" "}
                  and hand the next session only{" "}
                  <code className="bg-surface-2 px-1 rounded">SPEC.md</code>.
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  Same trick on the other end: if a session gets polluted
                  mid-implementation, checkpoint, clear, and resume from
                  the plan.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">
                    Subagent for review
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-2">
                  After Phase 3, have a subagent review the diff against
                  the spec with no knowledge of how the code got written.
                  Fresh eyes catch what the writer-self rationalizes.
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  Ship only after the review passes. Cheap insurance.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <CodeBlock
                label="Subagent review prompt"
                body={reviewerPrompt}
              />
            </div>
          </section>

          {/* Closing */}
          <section>
            <div
              className={cn(
                "border border-accent/30 bg-accent/5 rounded-2xl p-6 sm:p-8"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-accent shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-foreground font-serif italic">
                  The one-line summary
                </h2>
              </div>
              <p className="text-muted leading-relaxed">
                Read before deciding, decide before writing, write before
                shipping. The four phases are just that rule, applied
                deliberately, with tools for each step. Skip them on
                trivial changes. Run them on everything else — the
                compounding is enormous.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
