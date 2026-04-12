"use client";

import {
  Terminal,
  AtSign,
  RefreshCw,
  Minimize2,
  Eye,
  Rocket,
  HelpCircle,
  BrainCircuit,
  Undo2,
  Layers,
  LogOut,
  Lightbulb,
  AlertTriangle,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Command {
  rank: number;
  name: string;
  trigger: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  what: string;
  when: string[];
  example: {
    input: string;
    output: string;
  };
  tip: {
    kind: "pro" | "warn" | "mistake";
    text: string;
  };
  related: string[];
}

/* ── Data ───────────────────────────────────────────────────────────── */

const COMMANDS: Command[] = [
  {
    rank: 1,
    name: "File references",
    trigger: "@filename",
    tagline: "The single most important command in Claude Code.",
    icon: <AtSign className="h-5 w-5" />,
    color: "#5e9ed6",
    what:
      "Inject the contents of a file into your prompt without pasting it. Claude loads the file, reads it, and uses it as context. Works with directories too (@src/components loads the whole folder tree).",
    when: [
      "Asking Claude to edit or refactor a file — always reference it with @ instead of pasting",
      "Pointing to a related file Claude should mimic (@src/components/Button.tsx — match this style)",
      "Feeding config or schema files so Claude writes consistent code (@prisma/schema.prisma)",
    ],
    example: {
      input: "@src/lib/auth.ts Add a refreshToken function that rotates JWTs every 15 minutes.",
      output: `● Read(src/lib/auth.ts)
  ⎿  Found existing session management logic

● Edit(src/lib/auth.ts)
  + export async function refreshToken(oldToken: string) {
  +   const decoded = await verifyJWT(oldToken);
  +   if (Date.now() - decoded.iat > 15 * 60 * 1000) {
  +     return signJWT({ ...decoded, iat: Date.now() });
  +   }
  +   return oldToken;
  + }`,
    },
    tip: {
      kind: "pro",
      text:
        "Use @ liberally — it's cheaper than pasting (Claude only loads what it needs) and keeps your prompt readable. Reference 3-5 files in one prompt and Claude will connect them.",
    },
    related: ["/clear (when too many files loaded)", "/compact (shrink old @ loads)"],
  },
  {
    rank: 2,
    name: "Clear context",
    trigger: "/clear",
    tagline: "Your reset button. Use it more than you think.",
    icon: <RefreshCw className="h-5 w-5" />,
    color: "#e06c75",
    what:
      "Wipes the entire conversation context and starts fresh. Claude forgets everything from the previous session — files loaded, decisions made, code written. Essential when you're stuck in a bad path or switching tasks.",
    when: [
      "Claude keeps making the same mistake after 2-3 corrections — context is poisoned, start over",
      "You finished a feature and are moving to an unrelated task",
      "Your context window is full (you'll see the warning) and /compact isn't enough",
    ],
    example: {
      input: "/clear",
      output: `● Context cleared. Starting fresh session.

  Previous: 47,823 tokens used across 23 messages
  New session: 0 tokens, ready for your next prompt.`,
    },
    tip: {
      kind: "mistake",
      text:
        "Most users wait too long to /clear. If Claude has been going in circles for more than 2 back-and-forths, clear and re-prompt with sharper context. You'll save tokens AND get better results.",
    },
    related: ["/compact (preserve history while shrinking)", "/init (for fresh project work)"],
  },
  {
    rank: 3,
    name: "Compact context",
    trigger: "/compact",
    tagline: "Compress the conversation without losing the thread.",
    icon: <Minimize2 className="h-5 w-5" />,
    color: "#5cb870",
    what:
      "Claude summarizes the current conversation into a compact form, preserving key decisions and code while dropping verbose tool output. You keep working in the same session with way more headroom.",
    when: [
      "You're 40%+ through your context window but want to keep going",
      "Finished a big exploration phase and now want to build — compact first, then implement",
      "Between major milestones in a long refactor",
    ],
    example: {
      input: "/compact",
      output: `● Compacting conversation...

  Before: 132,450 tokens (66% of window)
  After:   28,120 tokens (14% of window)

  Preserved: 4 file edits, 2 design decisions, current task
  Dropped: intermediate tool output, redundant diffs`,
    },
    tip: {
      kind: "pro",
      text:
        "Run /compact between natural breakpoints, not mid-thought. Finish the current change, commit mentally, then compact — otherwise the summary may lose important in-flight context.",
    },
    related: ["/clear (full reset)", "/review (use after compact to verify nothing was lost)"],
  },
  {
    rank: 4,
    name: "Pre-commit review",
    trigger: "/review",
    tagline: "Never commit code Claude wrote without this.",
    icon: <Eye className="h-5 w-5" />,
    color: "#a07ed6",
    what:
      "Claude reads its own changes with fresh eyes, checks for bugs, missing error handling, security issues, and style inconsistencies. Think of it as a self-review before you push.",
    when: [
      "After Claude completes a multi-file feature — always review before committing",
      "Before pushing to a branch others will see",
      "When you're tired and don't trust your own review",
    ],
    example: {
      input: "/review",
      output: `● Reviewing recent changes...

  ✓ src/lib/auth.ts — refreshToken looks good
  ⚠ src/api/users.ts — missing try/catch around db.update
  ⚠ src/components/Login.tsx — password field missing autocomplete="current-password"
  ✗ src/lib/db.ts — SQL query vulnerable to injection (line 42)

  2 warnings, 1 critical. Want me to fix them?`,
    },
    tip: {
      kind: "warn",
      text:
        "/review catches ~70% of bugs Claude introduces. The other 30% need human eyes or tests. Don't treat /review as a test replacement — it's a second look, not a guarantee.",
    },
    related: ["/compact (before review on long sessions)", "git diff (complementary human review)"],
  },
  {
    rank: 5,
    name: "Bootstrap a project",
    trigger: "/init",
    tagline: "Starts Claude on a new project the right way.",
    icon: <Rocket className="h-5 w-5" />,
    color: "#d4a053",
    what:
      "Scans your repo, generates a CLAUDE.md with build commands, conventions, and architecture notes, and gives Claude a mental model of your codebase. Run this once per project.",
    when: [
      "First time using Claude Code in a repo",
      "After a major refactor that changed folder structure",
      "When you onboard a new CLAUDE.md and want Claude to regenerate recommendations",
    ],
    example: {
      input: "/init",
      output: `● Scanning project...

  Detected: Next.js 15, TypeScript, Tailwind, Prisma, Vitest
  Found: 127 components, 23 routes, 4 API endpoints

● Created CLAUDE.md with:
  - Build commands (npm run dev, build, test)
  - File conventions (colocated _components/)
  - Import alias (@/ → src/)
  - Testing pattern (Vitest + Playwright)

  Edit CLAUDE.md to add project-specific rules.`,
    },
    tip: {
      kind: "pro",
      text:
        "Always edit the generated CLAUDE.md before your first real prompt. Add your team's conventions, known quirks, and the ONE thing Claude always gets wrong. This 5-minute edit saves hours later.",
    },
    related: ["/help (see what Claude detected)", "CLAUDE.md guide"],
  },
  {
    rank: 6,
    name: "Show every command",
    trigger: "/help",
    tagline: "The cheat sheet baked into the tool.",
    icon: <HelpCircle className="h-5 w-5" />,
    color: "#5ec4c4",
    what:
      "Lists every slash command available with a one-line description. Updated with each Claude Code release, so it's always current — unlike blog posts.",
    when: [
      "You forgot the exact name of a command",
      "After a Claude Code update (new commands added regularly)",
      "Onboarding a teammate — pair them with /help first",
    ],
    example: {
      input: "/help",
      output: `● Available commands:

  /clear      Reset context
  /compact    Compress conversation
  /review     Review recent changes
  /init       Bootstrap CLAUDE.md
  /plan       Enter planning mode
  /model      Switch model
  /undo       Revert last change
  /exit       End session
  ... and 12 more. Type /help <command> for details.`,
    },
    tip: {
      kind: "pro",
      text:
        "Run /help monthly — Anthropic ships new commands often and they don't always appear in release notes. You'll discover features that slot into your workflow.",
    },
    related: ["/init (new project)", "Updates page (what's new)"],
  },
  {
    rank: 7,
    name: "Plan mode",
    trigger: "/plan",
    tagline: "Think before you code. Always worth it.",
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "#d65ea0",
    what:
      "Puts Claude in read-only mode where it analyzes, proposes a plan, and waits for your approval before writing any code. No files changed until you say go.",
    when: [
      "Any change touching 3+ files — plan first, execute second",
      "Architecture decisions (new endpoint, schema migration, auth changes)",
      "When the task is ambiguous — plan surfaces the assumptions",
    ],
    example: {
      input: "/plan Add Google OAuth to the existing auth system.",
      output: `● Planning mode. Read-only until approved.

  Proposed changes:
  1. Install next-auth/google-provider
  2. Add GOOGLE_CLIENT_ID/SECRET to .env.example
  3. Update src/lib/auth.ts to register provider
  4. Add /api/auth/callback/google route
  5. Add "Sign in with Google" button to Login.tsx
  6. Migrate profiles table: add google_id column

  Risks: existing JWT sessions won't invalidate.
  Time estimate: 45 min. Approve? (y/n)`,
    },
    tip: {
      kind: "pro",
      text:
        "Plan mode is the #1 way to avoid 'Claude did too much.' If you find yourself rejecting 50% of Claude's output, you skipped plan mode. Use it liberally — plans are cheap, rework is expensive.",
    },
    related: ["/review (after execution)", "/undo (if plan went sideways)"],
  },
  {
    rank: 8,
    name: "Undo last change",
    trigger: "/undo",
    tagline: "Revert Claude's last edit without touching git.",
    icon: <Undo2 className="h-5 w-5" />,
    color: "#d6885e",
    what:
      "Reverts Claude's most recent file changes in one command. Works even when you haven't committed yet. Like Cmd+Z but for AI-made changes.",
    when: [
      "Claude over-edited and went beyond your ask",
      "You approved a plan but the execution missed the mark",
      "Experimenting — try something, /undo, try differently",
    ],
    example: {
      input: "/undo",
      output: `● Reverting last change...

  ✓ src/lib/auth.ts — 23 lines restored
  ✓ src/api/users.ts — 8 lines restored
  ✓ tests/auth.test.ts — file deleted (was created)

  3 files reverted. Your working tree matches the state before Claude's last edit.`,
    },
    tip: {
      kind: "warn",
      text:
        "/undo only reverts Claude's changes — not yours. If you manually edited between Claude's changes, /undo won't touch those. Commit your own work before Claude touches files to keep /undo safe.",
    },
    related: ["git reset (deeper rollback)", "/plan (avoid needing /undo)"],
  },
  {
    rank: 9,
    name: "Switch model",
    trigger: "/model",
    tagline: "Match the model to the task mid-session.",
    icon: <Layers className="h-5 w-5" />,
    color: "#5cb870",
    what:
      "Switch between Opus, Sonnet, and Haiku without leaving the session. Useful when you start with Sonnet for most work but need Opus for a hard reasoning step, or Haiku for bulk rename operations.",
    when: [
      "Hit a hard architectural problem — switch from Sonnet to Opus for that prompt",
      "Doing repetitive refactors — drop to Haiku to save 90% on tokens",
      "Context is short and you want speed — Haiku finishes in 2s vs Sonnet's 8s",
    ],
    example: {
      input: "/model opus",
      output: `● Switched to claude-opus-4-6
  Previous: claude-sonnet-4-5
  Context preserved (28k tokens)

  Costs per 1M tokens:
    Sonnet: $3 in / $15 out
    Opus:   $15 in / $75 out (5x more)

  Switch back with: /model sonnet`,
    },
    tip: {
      kind: "pro",
      text:
        "Start every session with Sonnet. Only bump to Opus for the specific prompt that needs deep reasoning, then /model sonnet back. You'll keep 90% of Opus quality at Sonnet prices.",
    },
    related: ["/help (see current model)", "Model selection guide"],
  },
  {
    rank: 10,
    name: "Exit and session management",
    trigger: "/exit",
    tagline: "End cleanly — your sessions are saved.",
    icon: <LogOut className="h-5 w-5" />,
    color: "#a07ed6",
    what:
      "Ends the current session with an option to save. Claude Code keeps a history of sessions so you can resume where you left off with claude --resume. Cleaner than Ctrl+C.",
    when: [
      "Done for the day and want to resume tomorrow",
      "Switching projects — exit cleanly, then cd into the new project",
      "Before closing your laptop — /exit writes the session log",
    ],
    example: {
      input: "/exit",
      output: `● Session saved to ~/.claude/sessions/2026-04-11-auth-refactor.json

  Summary:
    Duration: 2h 14m
    Messages: 47
    Files changed: 12
    Tokens used: 184,320
    Est. cost: $2.43

  Resume anytime with: claude --resume 2026-04-11-auth-refactor
  Goodbye!`,
    },
    tip: {
      kind: "pro",
      text:
        "Name your sessions when they're non-trivial (claude --name auth-refactor). Future-you will thank present-you when you need to resume a week later and can't remember which session had that tricky migration logic.",
    },
    related: ["claude --resume (restart)", "claude --list (see all sessions)"],
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

function TipIcon({ kind }: { kind: "pro" | "warn" | "mistake" }) {
  switch (kind) {
    case "pro":
      return <Lightbulb className="h-4 w-4 text-accent" />;
    case "warn":
      return <AlertTriangle className="h-4 w-4 text-orange" />;
    case "mistake":
      return <AlertTriangle className="h-4 w-4 text-red" />;
  }
}

function tipLabel(kind: "pro" | "warn" | "mistake"): string {
  switch (kind) {
    case "pro":
      return "Pro tip";
    case "warn":
      return "Watch out";
    case "mistake":
      return "Common mistake";
  }
}

function tipClass(kind: "pro" | "warn" | "mistake"): string {
  switch (kind) {
    case "pro":
      return "border-accent/30 bg-accent/5";
    case "warn":
      return "border-orange/30 bg-orange/5";
    case "mistake":
      return "border-red/30 bg-red/5";
  }
}

export default function DailyCommandsPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-daily-commands-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Terminal className="h-4 w-4" />
            Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Top 10 Commands in Daily Claude Use
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            The commands that separate Claude Code tourists from full-time
            residents. Learn these ten, use them without thinking, and you&apos;ll
            ship 2-3x faster with half the back-and-forth.
          </p>
        </div>
      </section>

      {/* Intro callout */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">
                How to use this guide
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Ranked by real-world daily usage, not by Anthropic&apos;s docs
                order. #1 (@filename) is used in 80%+ of prompts. #10 (/exit)
                might be used twice a day. Skim the whole list, then pick the
                ONE you&apos;re not using yet and drill it this week. Habits
                compound.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commands */}
      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
          {COMMANDS.map((cmd) => (
            <section
              key={cmd.rank}
              className="border border-border rounded-2xl bg-surface overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-border p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: `${cmd.color}20`,
                      color: cmd.color,
                    }}
                  >
                    #{cmd.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        className="text-xs inline-flex items-center gap-1"
                        style={{
                          backgroundColor: `${cmd.color}15`,
                          color: cmd.color,
                          borderColor: `${cmd.color}30`,
                        }}
                      >
                        {cmd.icon}
                        {cmd.trigger}
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {cmd.name}
                    </h2>
                    <p className="text-muted italic">{cmd.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 space-y-6">
                {/* What it does */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    What it does
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {cmd.what}
                  </p>
                </div>

                {/* When to use */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    When to use it
                  </h3>
                  <ul className="space-y-2">
                    {cmd.when.map((scenario, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted leading-relaxed flex gap-2"
                      >
                        <span className="text-accent shrink-0">→</span>
                        <span>{scenario}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Example */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Example
                    </h3>
                    <CopyButton text={cmd.example.input} />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-surface-2 border border-border rounded-lg p-3">
                      <div className="text-xs text-muted mb-1">You</div>
                      <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">
                        <code>{cmd.example.input}</code>
                      </pre>
                    </div>
                    <div className="bg-surface-2 border border-border rounded-lg p-3">
                      <div className="text-xs text-muted mb-1">Claude</div>
                      <pre className="text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                        <code>{cmd.example.output}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Tip */}
                <div
                  className={cn(
                    "border rounded-lg p-4 flex items-start gap-3",
                    tipClass(cmd.tip.kind)
                  )}
                >
                  <TipIcon kind={cmd.tip.kind} />
                  <div>
                    <div className="text-xs font-semibold text-foreground mb-1">
                      {tipLabel(cmd.tip.kind)}
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {cmd.tip.text}
                    </p>
                  </div>
                </div>

                {/* Related */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                  <Link2 className="h-3.5 w-3.5 text-muted/50" />
                  <span className="text-xs text-muted">Related:</span>
                  {cmd.related.map((rel) => (
                    <span
                      key={rel}
                      className="text-xs text-muted/80 bg-surface-2 px-2 py-0.5 rounded"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Summary */}
      <section className="border-t border-border py-10 sm:py-14 bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center font-serif italic">
            The cheat sheet
          </h2>
          <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">
                Copy-paste this to your notes
              </span>
              <CopyButton
                text={COMMANDS.map(
                  (c) => `${c.trigger.padEnd(14)} — ${c.tagline}`
                ).join("\n")}
              />
            </div>
            <pre className="text-xs sm:text-sm text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
              <code>
                {COMMANDS.map(
                  (c) => `${c.trigger.padEnd(14)} — ${c.tagline}`
                ).join("\n")}
              </code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
