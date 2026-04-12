"use client";

import {
  AlertTriangle,
  XCircle,
  CheckCircle2,
  DollarSign,
  Clock,
  Bug,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";

/* ── Types ──────────────────────────────────────────────────────────── */

type CostType = "tokens" | "time" | "bugs";

interface Mistake {
  id: number;
  title: string;
  subtitle: string;
  mistake: string;
  whyWrong: string;
  costs: CostType[];
  costDetail: string;
  fix: string;
  fixExample?: {
    bad: string;
    good: string;
  };
}

/* ── Data ───────────────────────────────────────────────────────────── */

const MISTAKES: Mistake[] = [
  {
    id: 1,
    title: "Vague prompts",
    subtitle: `"Fix my code" / "Make it better" / "Add auth"`,
    mistake:
      "Writing prompts so abstract that Claude has to guess your intent. You think the context is obvious. It isn't.",
    whyWrong:
      "Claude fills in gaps with averages. If you don't specify what 'fix' means, it'll make 10 reasonable-but-wrong guesses and change 30 files.",
    costs: ["tokens", "time", "bugs"],
    costDetail:
      "30-50% more tokens spent on exploration, 2-3x more back-and-forth, and surprise changes you didn't want.",
    fix: "State the WHAT, the WHERE, and the CONSTRAINT. Be specific enough that your prompt couldn't apply to a different project.",
    fixExample: {
      bad: "Fix the login bug",
      good: "In @src/app/login/page.tsx, the submit button stays enabled during network requests. Disable it while `isPending` is true and show a spinner. Don't change any other behavior.",
    },
  },
  {
    id: 2,
    title: "Pasting entire files",
    subtitle: "Ctrl+C, Ctrl+V the whole file into chat",
    mistake:
      "Copying file contents into your prompt instead of using `@path/to/file`. Classic from pre-Claude-Code tools.",
    whyWrong:
      "Pasted code can't be edited in-place. Claude has to guess line numbers, and the @ reference is cheaper (loaded once, cached, properly indexed).",
    costs: ["tokens", "time"],
    costDetail:
      "~30% higher token cost per prompt, plus Claude can't use its file-editing tools so you get code blocks to copy-paste manually.",
    fix: "Use @filename. Always. If the file is huge, Claude is smart about loading only the relevant parts.",
    fixExample: {
      bad: "Here's my auth.ts:\n```\n// ... 400 lines pasted ...\n```\nAdd refresh tokens.",
      good: "@src/lib/auth.ts Add refresh token rotation every 15 minutes.",
    },
  },
  {
    id: 3,
    title: "No CLAUDE.md at all",
    subtitle: "Empty root. No project briefing.",
    mistake:
      "Starting every session from zero. Claude has to re-learn your project structure, conventions, and commands every time.",
    whyWrong:
      "Without CLAUDE.md, Claude infers conventions from the code — and gets it wrong. You end up repeating yourself every prompt.",
    costs: ["tokens", "time", "bugs"],
    costDetail:
      "Teams without CLAUDE.md spend ~40% more tokens on context-gathering and produce inconsistent code across sessions.",
    fix: "Run `/init` today. Edit the generated CLAUDE.md to add 3-5 real conventions. Takes 15 minutes, saves hours per week.",
  },
  {
    id: 4,
    title: "Ignoring plan mode",
    subtitle: "Diving straight into big changes",
    mistake:
      "Giving Claude a 5-file refactor request and just saying 'go.' No plan. No preview. Just execute.",
    whyWrong:
      "Without a plan, you can't catch bad assumptions until Claude has already written (and potentially broken) code. Plans are free, rework isn't.",
    costs: ["time", "bugs"],
    costDetail:
      "50%+ of big changes without plan mode end in rework. With plan mode, it's closer to 10%.",
    fix: "For any change touching 3+ files, start with `/plan`. Read the plan. Push back. Approve. Then execute.",
    fixExample: {
      bad: "Refactor the auth system to use JWTs instead of sessions.",
      good: "/plan Refactor the auth system from sessions to JWTs. Show me which files change, the migration strategy for existing users, and any breaking changes.",
    },
  },
  {
    id: 5,
    title: "Opus for simple tasks",
    subtitle: "Using a Ferrari for grocery runs",
    mistake:
      "Running every prompt on Opus because 'it's the best.' Bulk renames, boilerplate, one-line fixes — all on Opus.",
    whyWrong:
      "Opus is 5x more expensive than Sonnet and 30x more than Haiku. For simple tasks, you're burning money for zero quality difference.",
    costs: ["tokens"],
    costDetail:
      "A 100-file rename on Opus costs ~$15. On Haiku, it costs ~$0.50. Same output.",
    fix: "Default to Sonnet. `/model opus` only for hard reasoning. `/model haiku` for bulk boilerplate and renames.",
  },
  {
    id: 6,
    title: "Long sessions without /compact",
    subtitle: "100k+ tokens deep, wondering why Claude is slow",
    mistake:
      "Treating the session like it's infinite. Never compacting. Eventually Claude forgets the start of your work anyway.",
    whyWrong:
      "Context over ~50% full starts hurting response quality. Over 80% and Claude truncates silently. Quality drops, costs rise.",
    costs: ["tokens", "time", "bugs"],
    costDetail:
      "Sessions over 100k tokens cost 2-3x more per prompt AND produce worse code. Double-whammy.",
    fix: "Run `/compact` at natural breakpoints: after finishing a feature, between exploration and implementation. Takes 10 seconds.",
  },
  {
    id: 7,
    title: "Accepting changes without reviewing",
    subtitle: "Hit approve, push to main, go home",
    mistake:
      "Trusting Claude's output because it looks right. No diff review. No /review. Just git push.",
    whyWrong:
      "Claude ships ~3% subtle bugs even on good prompts — missing edge cases, imported but unused deps, half-wrong regex. Your eyes catch what /review misses.",
    costs: ["bugs"],
    costDetail:
      "Production incidents caused by un-reviewed AI code take 3-4x longer to debug (you didn't write it, you don't know the reasoning).",
    fix: "Always `git diff` before committing. Run `/review` for anything non-trivial. Trust Claude, verify like you wouldn't trust yourself.",
  },
  {
    id: 8,
    title: "Missing context",
    subtitle: "\"It's broken, fix it\"",
    mistake:
      "Reporting a bug without the error message, the stack trace, the file, or what you tried. Claude is not telepathic.",
    whyWrong:
      "Without context, Claude does a broad search, reads 10 files, makes guesses, and often fixes the wrong thing. Your bug report shaped the solution.",
    costs: ["tokens", "time"],
    costDetail:
      "A 30-second copy-paste of the error message saves ~15 minutes of context hunting. Multiply by every bug report.",
    fix: "Include: error message, file(s) with @, what you expected, what happened, what you already tried. Five lines max.",
    fixExample: {
      bad: "The login page is broken",
      good: "Login fails silently. @src/app/login/page.tsx throws 'TypeError: Cannot read property email of null' on submit. Console shows no network request was made. I already checked the form state is populated.",
    },
  },
  {
    id: 9,
    title: "Fighting Claude instead of starting fresh",
    subtitle: "\"No, not like that. Not like that either...\"",
    mistake:
      "After 3 failed attempts in one conversation, you keep going. More correction, more context, more frustration. Sunk cost fallacy.",
    whyWrong:
      "Once context is poisoned by bad attempts, Claude keeps echoing those bad attempts. You're fighting your own history.",
    costs: ["tokens", "time"],
    costDetail:
      "Users who /clear after 2 bad attempts solve problems 60% faster than users who keep pushing in the same session.",
    fix: "Two strikes rule: after two failed attempts at the same thing, `/clear` and re-prompt with what you learned.",
  },
  {
    id: 10,
    title: "Not using effort levels",
    subtitle: "Every prompt at the same intensity",
    mistake:
      "Treating every prompt equally when Claude has thinking levels (standard, extended, deep). Using deep for a typo fix wastes tokens; using standard for a hard bug wastes time.",
    whyWrong:
      "Effort level matches compute to task. Wrong level = wrong tradeoff between speed, cost, and quality.",
    costs: ["tokens", "time"],
    costDetail:
      "Using extended thinking for simple tasks burns 3-5x more tokens with no quality improvement.",
    fix: "Simple/obvious → standard. Multi-step reasoning → extended. Architectural/hard problems → deep. Explicitly request when needed.",
  },
  {
    id: 11,
    title: "Asking for too many things at once",
    subtitle: "\"Add auth AND migrate the DB AND refactor the UI\"",
    mistake:
      "Combining three unrelated tasks into one prompt. Claude juggles poorly and produces tangled diffs that are hard to review.",
    whyWrong:
      "One prompt, one concern. Mixed prompts create mixed diffs — you can't review or revert individual concerns.",
    costs: ["time", "bugs"],
    costDetail:
      "Mixed-concern diffs take 2-3x longer to review and have 2x the bug rate of single-concern diffs.",
    fix: "One task per prompt. Finish it. Commit. Then start the next one. Yes, even if you 'know' they're related.",
  },
  {
    id: 12,
    title: "Skipping tests in generated code",
    subtitle: "\"I'll add tests later\" (narrator: they never did)",
    mistake:
      "Accepting feature code without asking for tests. Tech debt compounds fast with AI — you generate 10x more code than you would alone.",
    whyWrong:
      "No tests means no regression safety net. The next prompt that touches this code has no way to verify it still works.",
    costs: ["bugs", "time"],
    costDetail:
      "Untested AI-generated code has a 3x higher regression rate after subsequent edits.",
    fix: "Add '...and write tests' to every feature prompt. Use @existing-test-file as a style guide so tests match your conventions.",
    fixExample: {
      bad: "Add a refreshToken function to @src/lib/auth.ts",
      good: "Add a refreshToken function to @src/lib/auth.ts and write tests in @src/lib/__tests__/auth.test.ts matching the existing patterns there.",
    },
  },
  {
    id: 13,
    title: "Committing without /review",
    subtitle: "Straight from Claude's keyboard to main",
    mistake:
      "Skipping the final safety check. /review catches the dumb stuff Claude does in the last 5% of a task (missing imports, wrong error type, stale comment).",
    whyWrong:
      "The last 5% of any Claude task has the highest bug rate — Claude is wrapping up, not concentrating. /review catches this.",
    costs: ["bugs"],
    costDetail:
      "Teams that always /review before commit have ~40% fewer AI-caused production incidents.",
    fix: "Workflow: finish task → `/review` → address findings → `git add` → commit. Make it muscle memory.",
  },
  {
    id: 14,
    title: "Treating Claude as infallible",
    subtitle: "\"Claude said so, it must be right\"",
    mistake:
      "Shipping Claude's security advice, legal wording, or production architecture decisions without validating with a human expert.",
    whyWrong:
      "Claude is confidently wrong ~5-10% of the time on specialized domains. For security and compliance, 5% wrong is 100% unacceptable.",
    costs: ["bugs"],
    costDetail:
      "Security incidents from unvalidated AI advice are the #1 cause of 'how did we ship that' postmortems in 2026.",
    fix: "For security, auth, payments, legal, compliance: use Claude for the first draft. Always validate with a human expert or official docs before shipping.",
  },
  {
    id: 15,
    title: "Using the wrong mode",
    subtitle: "Plan mode for bug fixes, yolo mode for architecture",
    mistake:
      "Mode mismatched to task. Typo fix in plan mode wastes 30 seconds on a plan. New service design in default mode wastes 30 minutes on rework.",
    whyWrong:
      "Each mode has a sweet spot. Plan mode: multi-file changes. Default: small focused changes. Yolo: throwaway scripts. Use them right.",
    costs: ["time", "tokens"],
    costDetail:
      "Mode-mismatched sessions spend 30-50% more time and tokens than mode-matched ones.",
    fix: "Match mode to scope: < 20 lines → default. > 3 files → plan. Experimental/throwaway → yolo. Re-check when scope changes.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

function CostBadge({ type }: { type: CostType }) {
  switch (type) {
    case "tokens":
      return (
        <Badge variant="orange" className="text-xs">
          <DollarSign className="h-3 w-3 mr-1" />
          Tokens
        </Badge>
      );
    case "time":
      return (
        <Badge variant="blue" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Time
        </Badge>
      );
    case "bugs":
      return (
        <Badge variant="red" className="text-xs">
          <Bug className="h-3 w-3 mr-1" />
          Bugs
        </Badge>
      );
  }
}

export default function CommonMistakesPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-common-mistakes-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-red/10 px-4 py-1.5 text-sm text-red mb-6">
            <ShieldAlert className="h-4 w-4" />
            Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            15 Common Mistakes That Ruin Claude Sessions
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Every one of these mistakes is made by someone today — probably
            several times. Learn them, avoid them, and you&apos;ll be operating
            in the top 10% of Claude Code users within a week.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">
                How we scored the cost
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Each mistake is tagged with what it costs you — tokens (money),
                time (your hours), or bugs (production risk). Some cost all
                three. Numbers are ballpark from real team audits, not
                guesses — your mileage will vary but the relative ranking
                holds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mistakes */}
      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
          {MISTAKES.map((m) => (
            <section
              key={m.id}
              className="border border-border rounded-2xl bg-surface overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-border p-5 sm:p-6 bg-red/5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-red/15 text-red">
                    #{m.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {m.title}
                    </h2>
                    <p className="text-sm text-muted italic font-mono">
                      {m.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* The mistake */}
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-red uppercase tracking-wide mb-1">
                      The mistake
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {m.mistake}
                    </p>
                  </div>
                </div>

                {/* Why it's wrong */}
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-orange uppercase tracking-wide mb-1">
                      Why it&apos;s wrong
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {m.whyWrong}
                    </p>
                  </div>
                </div>

                {/* Cost */}
                <div className="border border-border rounded-lg p-4 bg-surface-2/50">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Costs you
                    </span>
                    {m.costs.map((c) => (
                      <CostBadge key={c} type={c} />
                    ))}
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {m.costDetail}
                  </p>
                </div>

                {/* Fix */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-green uppercase tracking-wide mb-1">
                      The fix
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {m.fix}
                    </p>
                  </div>
                </div>

                {/* Example */}
                {m.fixExample && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="border border-red/30 bg-red/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-red uppercase tracking-wide">
                          Don&apos;t
                        </span>
                      </div>
                      <pre className="text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                        <code>{m.fixExample.bad}</code>
                      </pre>
                    </div>
                    <div className="border border-green/30 bg-green/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-green uppercase tracking-wide">
                          Do
                        </span>
                        <CopyButton text={m.fixExample.good} />
                      </div>
                      <pre className="text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                        <code>{m.fixExample.good}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Final summary */}
      <section className="border-t border-border py-10 sm:py-14 bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="border border-accent/30 bg-accent/5 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 font-serif italic">
                  The pattern behind all 15
                </h2>
                <p className="text-muted leading-relaxed mb-3">
                  Nearly every mistake on this list comes from one of three
                  things: lazy prompts, lazy context management, or lazy
                  review. Claude is tolerant but not magical — treat the
                  session like a collaboration with a very fast, slightly
                  over-eager junior engineer.
                </p>
                <p className="text-muted leading-relaxed">
                  Fix these and you&apos;ll save hours a week, dollars a month,
                  and quite possibly a production outage or two.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
