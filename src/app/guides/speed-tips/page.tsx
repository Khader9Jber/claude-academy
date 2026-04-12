"use client";

import {
  Zap,
  MessageSquare,
  Archive,
  Workflow,
  Repeat,
  Cpu,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Tip {
  number: number;
  title: string;
  explanation: string;
  example: string;
  isCode?: boolean;
}

interface TipCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  intro: string;
  tips: Tip[];
}

/* ── Data ───────────────────────────────────────────────────────────── */

const CATEGORIES: TipCategory[] = [
  {
    id: "prompts",
    label: "Prompt Tips",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "#5e9ed6",
    intro:
      "How you phrase the ask is the single biggest speed lever. Five simple rewrites save hours.",
    tips: [
      {
        number: 1,
        title: "State the outcome, not the process",
        explanation:
          "Tell Claude WHAT you want, not HOW to get there. Claude often knows a faster path than the one you'd suggest. Your process hints become constraints that slow things down.",
        example: `Instead of: "First read the config, then check the schema, then update the types..."
Say: "Sync the types in src/types/db.ts with the current schema in prisma/schema.prisma."`,
      },
      {
        number: 2,
        title: "Include constraints inline",
        explanation:
          "Mention the must-haves and must-not-haves in the same prompt. Every constraint Claude discovers mid-task triggers a re-plan or rework.",
        example: `"Add dark mode. Use CSS variables (don't add a library). Keep the current toggle component. Don't touch existing tests."`,
      },
      {
        number: 3,
        title: "Reference a file Claude should mimic",
        explanation:
          "Pointing at an existing file as a template is faster than explaining the pattern. Claude infers your conventions in one read.",
        example: `"Create src/app/invoices/page.tsx matching the pattern in @src/app/customers/page.tsx — same layout, same data-fetching style."`,
      },
      {
        number: 4,
        title: "Use bullet lists for multi-step work",
        explanation:
          "Bullet lists parse 2x faster than prose. Claude executes them in order and you can check off items. Prose requires Claude to decompose first.",
        example: `"Do these in order:
- Add User.email uniqueness constraint (Prisma)
- Generate migration
- Update signup validator in @src/validators/user.ts
- Add test case for duplicate email"`,
      },
      {
        number: 5,
        title: "End with the test to run",
        explanation:
          "Tell Claude how to verify. It'll run the test, iterate until green, and stop. Without this, you're the verification loop — slower.",
        example: `"Fix the auth bug in @src/lib/auth.ts so that \`npm test -- auth.test.ts\` passes."`,
      },
    ],
  },
  {
    id: "context",
    label: "Context Tips",
    icon: <Archive className="h-5 w-5" />,
    color: "#5cb870",
    intro:
      "Context management is the hidden lever. Most users never touch it; masters obsess over it.",
    tips: [
      {
        number: 6,
        title: "Compact at natural breakpoints",
        explanation:
          "Run `/compact` between major phases (exploration → implementation → testing). Mid-phase compact loses context you still need.",
        example: `"Exploration done. /compact. Now let's implement."`,
        isCode: true,
      },
      {
        number: 7,
        title: "Use .claudeignore aggressively",
        explanation:
          "Exclude everything Claude shouldn't read — node_modules (obvious), dist, coverage, vendor'd files, generated types. Claude picks up .claudeignore automatically.",
        example: `# .claudeignore
node_modules/
dist/
coverage/
.next/
*.generated.ts
__snapshots__/`,
        isCode: true,
      },
      {
        number: 8,
        title: "Reference directories, not files, when exploring",
        explanation:
          "@src/components loads the folder tree (cheap) instead of every file (expensive). Claude reads only what's needed.",
        example: `"Look at @src/features/checkout — where should I add a discount code input?"`,
      },
      {
        number: 9,
        title: "Clear aggressively between unrelated tasks",
        explanation:
          "New feature, new session. Don't carry auth-refactor context into a bug fix. `/clear` costs nothing and gives Claude a fresh mental model.",
        example: `"Finished auth refactor, committed. /clear. Next up: fix the checkout pagination bug."`,
        isCode: true,
      },
      {
        number: 10,
        title: "Front-load context, don't drip-feed",
        explanation:
          "Give Claude all the @ references and constraints up front. Adding context incrementally over 3 messages triples your round-trips.",
        example: `"@src/lib/api.ts @src/types/api.ts @docs/API.md Add a \`rateLimit\` field to the API client config. It should throttle to 10 req/sec by default. Don't change the API surface."`,
      },
    ],
  },
  {
    id: "modes",
    label: "Mode Tips",
    icon: <Workflow className="h-5 w-5" />,
    color: "#a07ed6",
    intro:
      "Modes exist because one-size-fits-all is slow. Picking the right one saves 30-50% per session.",
    tips: [
      {
        number: 11,
        title: "Plan mode for anything touching 3+ files",
        explanation:
          "A 60-second plan prevents 30 minutes of rework. For focused single-file work, skip it.",
        example: `/plan Migrate user sessions from cookies to JWT. Show me the migration path for existing active sessions.`,
        isCode: true,
      },
      {
        number: 12,
        title: "Yolo mode for throwaway scripts",
        explanation:
          "Data exploration, one-off migrations, scratch scripts — yolo mode skips confirmations and runs fast. Never use it for production code.",
        example: `/yolo Write a script to export all users created in Q1 2026 to CSV. Save to tmp/.`,
        isCode: true,
      },
      {
        number: 13,
        title: "Default mode is your daily driver",
        explanation:
          "Small, focused changes. Review each edit. This is 70% of your usage — don't over-think it.",
        example: `"@src/components/Button.tsx Add a 'loading' prop that shows a spinner and disables the button."`,
      },
      {
        number: 14,
        title: "Extended thinking for hard reasoning",
        explanation:
          "When a problem needs multi-step logic (algorithms, architecture, debugging a gnarly race condition), request extended thinking. Slower per prompt, dramatically faster to solution.",
        example: `"Think hard about this: why does the WebSocket disconnect exactly every 60 seconds in production but not staging?"`,
      },
      {
        number: 15,
        title: "Don't switch mid-task without /clear",
        explanation:
          "Changing mode mid-task keeps old context that was shaped by the old mode. If you must switch, /clear first and re-prompt with the new mode.",
        example: `"This bug fix is bigger than I thought. /clear. /plan Let me re-scope as a larger refactor."`,
        isCode: true,
      },
    ],
  },
  {
    id: "workflow",
    label: "Workflow Tips",
    icon: <Repeat className="h-5 w-5" />,
    color: "#d65ea0",
    intro:
      "Habits that compound. Each one is small; combined, they cut your total time in half.",
    tips: [
      {
        number: 16,
        title: "Commit after every Claude 'done'",
        explanation:
          "Micro-commits. Claude finishes a step, you review, commit. You'll thank yourself when `/undo` or `git reset` is needed. Tiny commits are easier to review.",
        example: `"Done." → git diff → git add . → git commit -m "feat: add refresh token"`,
      },
      {
        number: 17,
        title: "Keep a running \"prompts that worked\" file",
        explanation:
          "When a prompt produces great output, save it. You'll reuse it (with tweaks) dozens of times. My file is 40 lines and saves hours/week.",
        example: `# prompts.md
## Add a new API endpoint
Add a \`<METHOD> /<path>\` endpoint in @src/routes/. Follow the layered pattern: route → controller → service → repo. Include zod validation and a test.`,
        isCode: true,
      },
      {
        number: 18,
        title: "Review before you ask follow-ups",
        explanation:
          "Don't pile follow-up asks on top of unreviewed work. Review, merge, then next prompt. Otherwise you're debugging two changes at once when something breaks.",
        example: `"Looks good — committed. Now: add rate limiting to the same endpoint."`,
      },
      {
        number: 19,
        title: "Write CLAUDE.md patterns you keep repeating",
        explanation:
          "If you've written the same instruction in 3+ prompts, it belongs in CLAUDE.md. Your future sessions (and teammates) inherit it for free.",
        example: `Repeated too often → CLAUDE.md:
## Naming
- Tests: colocated \`*.test.ts\`, NOT in /tests folder
- Types: PascalCase interfaces, camelCase type aliases`,
        isCode: true,
      },
      {
        number: 20,
        title: "Stop sessions at a clean state, not mid-thought",
        explanation:
          "End a session with a commit or a clear note. Resuming mid-thought loses 5-10 minutes recalling context. A clean state resumes in 30 seconds.",
        example: `End-of-day: "Committed auth refactor. Next: start on OAuth provider registration. /exit"`,
      },
    ],
  },
  {
    id: "models",
    label: "Model Tips",
    icon: <Cpu className="h-5 w-5" />,
    color: "#d4a053",
    intro:
      "Right model, right task. Getting this wrong makes Claude feel slow and expensive.",
    tips: [
      {
        number: 21,
        title: "Sonnet is your default",
        explanation:
          "Fast, capable, affordable. 90% of daily work runs on Sonnet with no quality compromise. Don't overthink it — Sonnet unless you have a reason.",
        example: `/model sonnet  # start here`,
        isCode: true,
      },
      {
        number: 22,
        title: "Opus only for the hard 10%",
        explanation:
          "Architecture decisions, gnarly debugging, mathematical proofs, complex refactors. Switch to Opus for the hard step, switch back for the rest.",
        example: `/model opus  # hard problem
... prompt ...
/model sonnet  # back to normal`,
        isCode: true,
      },
      {
        number: 23,
        title: "Haiku for bulk simple tasks",
        explanation:
          "Rename across 100 files. Translate 1,000 strings. Reformat 50 configs. Haiku is 30x cheaper and for these tasks just as good.",
        example: `/model haiku
"Rename \`userId\` to \`user_id\` in every file in @src/api/. Don't touch anything else."`,
        isCode: true,
      },
      {
        number: 24,
        title: "Combine models in one session",
        explanation:
          "Start Opus to plan an architecture. Switch to Sonnet to implement. Drop to Haiku for bulk boilerplate. Each step uses the cheapest model that can do the job.",
        example: `/model opus → /plan (architecture)
/model sonnet → implement core
/model haiku → generate the CRUD boilerplate`,
        isCode: true,
      },
      {
        number: 25,
        title: "Prototype with Haiku, finalize with Sonnet",
        explanation:
          "Exploring a design? Ideate with Haiku at 10x speed. Once the direction is clear, switch to Sonnet for the real implementation.",
        example: `/model haiku  # 5 quick proof-of-concepts
... explore ...
/model sonnet  # now build the one that worked`,
        isCode: true,
      },
    ],
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function SpeedTipsPage() {
  const totalTips = CATEGORIES.reduce((sum, c) => sum + c.tips.length, 0);

  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-speed-tips-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Zap className="h-4 w-4" />
            Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            25 Tips to Get Claude to Work Faster
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Five categories, five tips each. Each one stands alone. Stack them
            and you&apos;ll ship 2-3x faster with the same Claude subscription.
            No magic — just better defaults.
          </p>
          <div className="inline-flex items-center gap-6 mt-6 text-sm text-muted">
            <span>
              <strong className="text-foreground">{totalTips}</strong> tips
            </span>
            <span>
              <strong className="text-foreground">{CATEGORIES.length}</strong>{" "}
              categories
            </span>
            <span>
              <strong className="text-foreground">~10 min</strong> read
            </span>
          </div>
        </div>
      </section>

      {/* Category nav */}
      <section className="border-b border-border bg-surface-2/30 sticky top-0 z-10 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-2 text-muted hover:text-foreground hover:bg-surface-3 transition-colors"
                style={{ color: cat.color }}
              >
                {cat.icon}
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-20">
              {/* Category header */}
              <div className="mb-6">
                <Badge
                  className="mb-3 inline-flex items-center gap-1"
                  style={{
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                    borderColor: `${cat.color}30`,
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {cat.label}
                </h2>
                <p className="text-muted leading-relaxed">{cat.intro}</p>
              </div>

              {/* Tips */}
              <div className="space-y-4">
                {cat.tips.map((tip) => (
                  <div
                    key={tip.number}
                    className="border border-border rounded-xl bg-surface p-5 sm:p-6 hover:border-border-accent transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: `${cat.color}20`,
                          color: cat.color,
                        }}
                      >
                        {tip.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed mb-4">
                          {tip.explanation}
                        </p>
                        <div className="bg-surface-2 border border-border rounded-lg p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted uppercase tracking-wide">
                              Example
                            </span>
                            <CopyButton text={tip.example} />
                          </div>
                          <pre className="text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                            <code>{tip.example}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Summary */}
      <section className="border-t border-border py-10 sm:py-14 bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="border border-accent/30 bg-accent/5 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3 font-serif italic">
                  The meta-tip
                </h2>
                <p className="text-muted leading-relaxed mb-3">
                  You won&apos;t remember all 25. Pick ONE per week, drill it
                  into your muscle memory, then add the next. Five weeks = five
                  new habits = 2-3x faster sessions. Month six: pick the next
                  five.
                </p>
                <p className="text-muted leading-relaxed">
                  Start with #1 (state outcome, not process) and #6 (compact at
                  breakpoints). Those two alone will transform how sessions
                  feel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
