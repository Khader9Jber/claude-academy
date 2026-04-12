"use client";

import {
  Award,
  Target,
  Compass,
  FileCode,
  ShieldCheck,
  Terminal,
  Plug,
  Webhook,
  Sparkles,
  Users,
  Puzzle,
  BookOpen,
  MessageCircleQuestion,
  Undo2,
  Layers,
  GitBranch,
  RefreshCw,
  Zap,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  FileStack,
  Rewind,
  Bot,
  FlaskConical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Data: The 20 best practices ──────────────────────────────────── */

interface Practice {
  n: number;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  why: string;
  example: { label: string; body: string };
  note: { kind: "tip" | "warn"; title: string; body: string };
}

const FOUNDATIONS: Practice[] = [
  {
    n: 1,
    title: "Give Claude a way to verify its work",
    tagline:
      "The single highest-leverage thing you can do, according to Anthropic.",
    icon: <FlaskConical className="h-5 w-5" />,
    why: "Without a verification loop, Claude produces plausible code that doesn't actually run. With one — a failing test, a screenshot, an expected output — Claude iterates until the loop closes. This is the difference between a first draft and a working change.",
    example: {
      label: "Bug fix with a verification target",
      body: `Fix the login redirect bug.

Symptom: after a successful POST /api/login, users stay on /login instead
of being redirected to /dashboard.

Location: src/app/(auth)/login/page.tsx, handleSubmit callback.

Fix criteria:
- After login, user lands on /dashboard
- The E2E test e2e/auth.spec.ts "logs in and reaches dashboard" passes
- No new console errors in the browser

Run the E2E test yourself and only report done when it's green.`,
    },
    note: {
      kind: "tip",
      title: "Pattern: symptom + location + criteria",
      body: "Anthropic's docs describe this triple as the minimum viable bug prompt. Give Claude what's wrong, where it lives, and how you'll know it's fixed.",
    },
  },
  {
    n: 2,
    title: "Explore first, then plan, then code",
    tagline: "The 4-phase workflow: Explore → Plan → Implement → Commit.",
    icon: <Compass className="h-5 w-5" />,
    why: "Jumping straight to code on unfamiliar territory is how you get refactors that break three other files. The recommended flow separates reading from deciding from writing. Each phase has its own mindset, and each feeds the next.",
    example: {
      label: "Running the full workflow",
      body: `# 1. Explore (Plan Mode)
"Read everything relevant to adding a Stripe webhook handler.
Do not write code. Tell me what you found."

# 2. Plan (Plan Mode)
"Now write a detailed plan: files to add, files to change,
tests to write, migration steps, risks."
# Press Ctrl+G to open the plan in your editor and edit it directly.

# 3. Implement (Normal Mode)
"Execute the plan. Verify each step against it."

# 4. Commit
"Write a descriptive commit message and open a PR."`,
    },
    note: {
      kind: "tip",
      title: "When to skip it",
      body: "Typos, one-line log additions, variable renames. If the change is obvious and localized, the workflow is overhead. Anything multi-file or unfamiliar — run all four phases.",
    },
  },
  {
    n: 3,
    title: "Provide specific context in your prompts",
    tagline: "Scope. Sources. Patterns. Symptoms.",
    icon: <Target className="h-5 w-5" />,
    why: "Claude, like a new employee, does its best work when you tell it what you've already considered, where to look first, and which existing patterns to match. Vague prompts get vague code; specific prompts get code that fits.",
    example: {
      label: "From vague to specific",
      body: `# Bad
"Add a settings page."

# Good
"Add a /settings page modeled on src/app/profile/page.tsx.
- Fields: email, display name, timezone
- Use the same Card/Form primitives from src/components/ui
- Save through the existing updateProfile() in src/lib/api.ts
- Write a Vitest test next to the page file
- Keep the dark/light mode tokens consistent"`,
    },
    note: {
      kind: "tip",
      title: "The four levers",
      body: "@ references to files, pasted images, URLs, and piped data. Use whichever brings the relevant signal closest to the prompt.",
    },
  },
  {
    n: 4,
    title: "Write an effective CLAUDE.md",
    tagline: "Short. Human-readable. Ruthlessly pruned.",
    icon: <FileCode className="h-5 w-5" />,
    why: "CLAUDE.md is the context every session inherits. It pays for itself on every turn, but every line competes for attention. Anthropic's test: 'Would removing this line cause Claude to make mistakes?' If no, delete it.",
    example: {
      label: "Generate a starter, then prune",
      body: `# Let Claude draft it
/init

# Then edit it down. Keep:
- Bash commands Claude can't guess
- Code style that differs from language defaults
- Testing instructions
- Repository etiquette
- Architectural decisions
- Environment quirks

# Delete:
- Anything obvious from the code itself
- Standard conventions ("use camelCase in JS")
- Long API docs (link to them instead)
- File-by-file descriptions`,
    },
    note: {
      kind: "warn",
      title: "The over-specified CLAUDE.md trap",
      body: "A 500-line CLAUDE.md buries the three lines that actually matter. Prune after every session where Claude ignored a rule — that's the signal the rule was drowning in noise.",
    },
  },
  {
    n: 5,
    title: "Configure permissions",
    tagline: "Three escalating layers. Pick the one that fits the task.",
    icon: <ShieldCheck className="h-5 w-5" />,
    why: "The permission model decides what Claude can do without asking. Wrong settings produce either endless prompts (too restrictive) or catastrophic actions (too open). Anthropic ships three models designed to fit different risk profiles.",
    example: {
      label: "The three modes",
      body: `# 1. Auto mode — a classifier reviews each command
claude --permission-mode auto

# 2. Permission allowlist — explicit list of safe tools
# In .claude/settings.json
{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(npm run lint)"]
  }
}

# 3. Sandboxing — OS-level isolation of filesystem/network
# For autonomous sessions on untrusted changes`,
    },
    note: {
      kind: "tip",
      title: "Default to allowlists",
      body: "Auto mode is great for solo work. Allowlists are better for teams — the file is checked in, reviewed in PRs, and survives machine changes.",
    },
  },
];

const ENVIRONMENT: Practice[] = [
  {
    n: 6,
    title: "Use CLI tools",
    tagline: "gh, aws, gcloud, sentry-cli — the most context-efficient bridges.",
    icon: <Terminal className="h-5 w-5" />,
    why: "Asking Claude to hit a REST API burns tokens on JSON parsing and auth. CLI tools ship with paging, filtering, and sane defaults already. One gh pr view is worth ten API calls.",
    example: {
      label: "Prefer CLI over HTTP",
      body: `# Good — one command, scoped output
gh pr view 123 --json title,body,files

# Bad — Claude writes curl, handles auth, parses JSON
curl -H "Authorization: Bearer $GITHUB_TOKEN" \\
  https://api.github.com/repos/owner/repo/pulls/123`,
    },
    note: {
      kind: "tip",
      title: "Install the obvious ones",
      body: "gh for GitHub, aws/gcloud for cloud, sentry-cli for errors, vercel/netlify for deploys. Each one saves you context on every run.",
    },
  },
  {
    n: 7,
    title: "Connect MCP servers",
    tagline: "External tools Claude can call like function calls.",
    icon: <Plug className="h-5 w-5" />,
    why: "MCP (Model Context Protocol) gives Claude first-class access to Notion, Figma, databases, and more — without you copy-pasting data. Once connected, Claude reads and writes like it's a native tool.",
    example: {
      label: "Adding an MCP server",
      body: `# Add a server via the CLI
claude mcp add notion <server-command-or-url>

# Add a local Postgres MCP
claude mcp add postgres "npx postgres-mcp-server \\
  --connection-string=$DATABASE_URL"

# List what's connected
claude mcp list`,
    },
    note: {
      kind: "tip",
      title: "Start with one",
      body: "MCP servers compete for context like CLAUDE.md does. Install the one that maps to your biggest copy-paste friction point first — usually Notion or your database.",
    },
  },
  {
    n: 8,
    title: "Set up hooks",
    tagline: "Deterministic. Invisible to tokens. Non-negotiable.",
    icon: <Webhook className="h-5 w-5" />,
    why: "CLAUDE.md is advisory — Claude can forget it. Hooks are deterministic: the harness runs them, not Claude. Anything you want to happen every single time (format, lint, test, block dangerous commands) belongs in a hook.",
    example: {
      label: "Let Claude write the hook",
      body: `"Write a PostToolUse hook that runs 'npm run lint:fix'
on any file Claude edits. Put it in .claude/settings.json
and create the script in .claude/hooks/ if needed."`,
    },
    note: {
      kind: "tip",
      title: "The trigger rule",
      body: "If you type the same reminder to Claude more than twice, stop typing it and write a hook. That's where the leverage is.",
    },
  },
  {
    n: 9,
    title: "Create skills",
    tagline:
      "Reusable domain knowledge at .claude/skills/SKILL.md. Auto-invoked or on demand.",
    icon: <Sparkles className="h-5 w-5" />,
    why: "Skills encode the playbook for recurring tasks — 'how we write migration scripts', 'our deploy checklist'. Claude can auto-invoke them when it recognizes the pattern, or you can trigger them explicitly with disable-model-invocation: true.",
    example: {
      label: "Minimal skill shape",
      body: `# .claude/skills/migrations/SKILL.md
---
name: write-migration
description: How we author Supabase migrations
disable-model-invocation: false
---

## When this applies
Any task that adds, modifies, or drops a database table.

## Our rules
- One migration per PR
- File named NNN_description.sql in supabase/migrations/
- Always include a corresponding down migration comment
- Run locally with 'supabase db reset' before committing`,
    },
    note: {
      kind: "tip",
      title: "Skills > CLAUDE.md for domain knowledge",
      body: "CLAUDE.md is for the whole repo. Skills scope knowledge to specific tasks, keeping the global context lean.",
    },
  },
  {
    n: 10,
    title: "Create custom subagents",
    tagline: "Their own context. Their own tools. Their own focus.",
    icon: <Users className="h-5 w-5" />,
    why: "A subagent runs in an isolated context window with a scoped tool set and a focused prompt. Perfect for code review, investigation, or anything that would pollute your main thread.",
    example: {
      label: "Using a code-review subagent",
      body: `# .claude/agents/code-reviewer.md defines it
# Then invoke it naturally

"Use a subagent to review this code against our
security checklist. Report findings only — no edits."`,
    },
    note: {
      kind: "tip",
      title: "Writer/Reviewer pattern",
      body: "One Claude writes, a fresh subagent reviews with no memory of the writing. Catches things the writer missed because it wasn't invested in the implementation.",
    },
  },
  {
    n: 11,
    title: "Install plugins",
    tagline: "Bundles of skills, hooks, subagents, and MCP servers.",
    icon: <Puzzle className="h-5 w-5" />,
    why: "A plugin is a curated kit — everything a team or workflow needs, versioned together. Install one and you get the whole stack: skills, hooks, subagents, MCP. Much easier than wiring each piece yourself.",
    example: {
      label: "Installing a plugin",
      body: `/plugin

# Browse, install, and manage plugins from inside Claude Code.
# Plugins can ship skills, hooks, subagents, MCP servers —
# all in one install.`,
    },
    note: {
      kind: "tip",
      title: "Write your own for your team",
      body: "If you find yourself copying the same .claude/ config across repos, that's a plugin. Package it once and share.",
    },
  },
];

const COMMUNICATE: Practice[] = [
  {
    n: 12,
    title: "Ask codebase questions",
    tagline: "Claude Code is a read-eval-explain loop, not just a codegen loop.",
    icon: <BookOpen className="h-5 w-5" />,
    why: "The best use of a senior engineer's time isn't typing — it's answering the right questions. Claude Code plays the same role for codebases you don't know yet. Ask first, code second.",
    example: {
      label: "Onboarding prompts that work",
      body: `"Explain the authentication flow end to end, starting
from the login form and ending at the session cookie.
Link each hop to the file and line."

"What are the three biggest risks in this service
if we add a new tenant?"

"Map every call site of the deprecated
legacyEncrypt() function and tell me which are safe
to leave and which need migration."`,
    },
    note: {
      kind: "tip",
      title: "Treat it like a senior engineer",
      body: "The same question you'd ask a teammate over coffee — ask Claude. You'll get an answer that references the code, not a stale README.",
    },
  },
  {
    n: 13,
    title: "Let Claude interview you",
    tagline: "The AskUserQuestion tool turns a vague idea into a complete SPEC.md.",
    icon: <MessageCircleQuestion className="h-5 w-5" />,
    why: "You don't know what you don't know about a feature until someone asks. Anthropic ships this as a first-class pattern for larger features: have Claude interview you, write the spec, then execute it in a fresh session.",
    example: {
      label: "The official interview prompt",
      body: `I want to build X. Interview me in detail using the
AskUserQuestion tool. Ask about technical
implementation, UI/UX, edge cases, concerns, and
tradeoffs. Keep interviewing until we've covered
everything, then write a complete spec to SPEC.md.`,
    },
    note: {
      kind: "tip",
      title: "Run the spec in a new session",
      body: "When the interview is done, /clear and open the SPEC.md in a new session. Fresh context, zero pollution from the interview transcript.",
    },
  },
];

const SESSION: Practice[] = [
  {
    n: 14,
    title: "Course-correct early and often",
    tagline: "Esc to stop, Esc+Esc to rewind, /clear to reset.",
    icon: <Undo2 className="h-5 w-5" />,
    why: "A wrong direction detected in 30 seconds is a course correction. A wrong direction detected in 20 minutes is a rewrite. The controls are built for the first case — use them.",
    example: {
      label: "The controls",
      body: `# Stop Claude mid-action, preserve context
Esc

# Open the rewind menu: restore conversation/code,
# or summarize from a message
Esc+Esc    (or: /rewind)

# Revert the last changes
"Undo that"

# Reset context between unrelated tasks
/clear`,
    },
    note: {
      kind: "warn",
      title: "The two-correction rule",
      body: "If you've corrected Claude more than twice on the same issue, the context is polluted. /clear and restart with a better prompt. Continuing to correct just teaches Claude to keep apologizing.",
    },
  },
  {
    n: 15,
    title: "Manage context aggressively",
    tagline: "/clear, /compact, Esc+Esc summarize, /btw.",
    icon: <Layers className="h-5 w-5" />,
    why: "Context is the single most important variable in a session. Too little and Claude guesses. Too much and the relevant signal drowns. Every advanced workflow is really a context-management workflow.",
    example: {
      label: "The four-tool kit",
      body: `# Reset between unrelated tasks
/clear

# Partial summarization with custom instructions
/compact preserve the modified files list and test commands

# Condense from a specific message
Esc+Esc → "Summarize from here"

# Ask something without polluting history
/btw what does this curl command do?`,
    },
    note: {
      kind: "tip",
      title: "Customize compaction in CLAUDE.md",
      body: "Add a line: 'When compacting, always preserve the modified files list, test commands, and unresolved decisions.' Every compact downstream respects it.",
    },
  },
  {
    n: 16,
    title: "Use subagents for investigation",
    tagline: "Fresh context. Scoped output. No pollution.",
    icon: <Bot className="h-5 w-5" />,
    why: "An unscoped 'explore the codebase' can burn 100k tokens and leave you with a polluted context for the actual work. A subagent investigates in its own window and reports back a summary — your main thread stays lean.",
    example: {
      label: "Investigation prompts",
      body: `"Use a subagent to investigate how we handle
rate limiting across all three services. Return
a summary of patterns, divergences, and the
single file I should read next."

"Use a subagent to find every place we call
sendEmail() and tell me which ones bypass
our notification preferences."`,
    },
    note: {
      kind: "tip",
      title: "Always ask for a summary, not a transcript",
      body: "A subagent's value is compression. Tell it what shape of output you want — bullet list, table, ranked findings — and it will compress accordingly.",
    },
  },
  {
    n: 17,
    title: "Rewind with checkpoints",
    tagline: "Every action creates one. They persist across sessions.",
    icon: <Rewind className="h-5 w-5" />,
    why: "Checkpoints are the safety net that makes bold exploration cheap. Try a refactor, if it's bad, rewind. They survive /exit and persist to tomorrow. You can't break anything you can't rewind from.",
    example: {
      label: "Using the rewind menu",
      body: `# Any time you want to go back
Esc+Esc    (or: /rewind)

# You get options:
#  - Restore conversation to this point
#  - Restore code to this point
#  - Restore both
#  - Summarize from this point forward`,
    },
    note: {
      kind: "tip",
      title: "Rewind beats 'undo'",
      body: "'Undo that' only walks back the last change. Rewind lets you pick any earlier state — including hours ago or yesterday.",
    },
  },
  {
    n: 18,
    title: "Resume conversations",
    tagline: "--continue, --resume, /rename.",
    icon: <RefreshCw className="h-5 w-5" />,
    why: "Work is rarely finished at the end of a day. Resuming the exact session — with its context, its plan, its momentum — is cheaper than reconstructing it from a commit message.",
    example: {
      label: "Resume and name sessions",
      body: `# Pick up the last session
claude --continue

# Pick from all past sessions
claude --resume

# Inside a session, give it a descriptive name
/rename stripe-webhook-handler`,
    },
    note: {
      kind: "tip",
      title: "Rename multi-day sessions immediately",
      body: "Default names are timestamps. Rename anything you plan to come back to — 'fix-auth-redirect' beats '2026-04-09-14-32'.",
    },
  },
];

const AUTOMATE: Practice[] = [
  {
    n: 19,
    title: "Run non-interactive mode",
    tagline: "claude -p for CI, pre-commit hooks, and scripts.",
    icon: <Terminal className="h-5 w-5" />,
    why: "Interactive Claude is for exploration. Non-interactive Claude is for automation — fitting into pipelines that can't answer prompts. Same model, completely different shape.",
    example: {
      label: "Non-interactive patterns",
      body: `# Simple one-shot
claude -p "review src/auth.ts for security issues"

# Structured output for piping into other tools
claude -p "list all TODOs in src/" \\
  --output-format json

# Streaming JSON for long tasks
claude -p "refactor this module" \\
  --output-format stream-json`,
    },
    note: {
      kind: "tip",
      title: "Pair with --allowedTools",
      body: "In CI, scope tools aggressively. --allowedTools Read,Grep gives Claude eyes without hands.",
    },
  },
  {
    n: 20,
    title: "Run multiple Claude sessions",
    tagline: "Desktop app, Claude Code on the web, Agent Teams, writer/reviewer.",
    icon: <Layers className="h-5 w-5" />,
    why: "One session is one stream of thought. Multiple sessions are parallel streams — sometimes cooperating, sometimes critiquing each other. The desktop app and web UI make coordination visual.",
    example: {
      label: "The writer/reviewer pattern",
      body: `# Session 1 (writer)
"Implement the retry logic in src/lib/fetch.ts
following the spec in SPEC.md."

# Session 2 (reviewer, fresh context)
"Read src/lib/fetch.ts and SPEC.md. Review the
retry logic against the spec and against our
security checklist. Report findings only."`,
    },
    note: {
      kind: "tip",
      title: "Teams > solo for complex features",
      body: "Agent Teams coordinate multiple sessions with a team lead. Great for features that split naturally into frontend/backend/tests.",
    },
  },
  {
    n: 21,
    title: "Fan out across files",
    tagline: "Loop claude -p per file. Scope with --allowedTools.",
    icon: <GitBranch className="h-5 w-5" />,
    why: "Some tasks are N small, independent jobs — migrate 40 test files, add a JSDoc to every export, convert class components to hooks. A bash loop with claude -p runs them in parallel-ish, each in a fresh context.",
    example: {
      label: "Fan-out loop",
      body: `#!/usr/bin/env bash
for f in src/**/*.test.ts; do
  claude -p "Convert $f from Jest to Vitest. Keep
behavior identical. Run 'npx vitest run $f' to verify." \\
    --allowedTools Read,Edit,Bash
done`,
    },
    note: {
      kind: "warn",
      title: "Fresh context per file is a feature",
      body: "Running all 40 files in one session would pollute context by file 5. A loop gives each file its own clean slate.",
    },
  },
  {
    n: 22,
    title: "Run autonomously with auto mode",
    tagline: "claude --permission-mode auto — classifier-guarded autonomy.",
    icon: <Zap className="h-5 w-5" />,
    why: "Auto mode lets Claude work without asking for every tool call, while a classifier model watches for risky operations. Perfect for long, boring cleanups you don't want to babysit.",
    example: {
      label: "An autonomous cleanup",
      body: `claude --permission-mode auto -p "fix all lint errors
across the repo. Commit in batches of 10 files with
descriptive messages. Don't touch main.gitignored
directories. Stop and ask if you see a lint rule you
don't understand."`,
    },
    note: {
      kind: "warn",
      title: "Scope the job narrowly",
      body: "Autonomy amplifies ambiguity. 'Fix bugs' under auto mode is terrifying. 'Fix all lint errors' is fine. Be specific about what counts as done.",
    },
  },
];

/* ── Failure patterns ─────────────────────────────────────────────── */

const FAILURES = [
  {
    name: "The kitchen sink session",
    symptom:
      "One session, five unrelated tasks. By task three Claude is referencing files from task one and the plan has drifted.",
    fix: "/clear between tasks. If a task is going to take more than 20 minutes, it deserves its own session.",
  },
  {
    name: "Correcting over and over",
    symptom:
      "You've said 'no, not like that' three times. Claude keeps apologizing and missing the mark.",
    fix: "Stop correcting. /clear. Restart with a better prompt that encodes the lesson from those corrections. Context pollution only compounds.",
  },
  {
    name: "Over-specified CLAUDE.md",
    symptom:
      "CLAUDE.md is 400 lines. Claude still forgets the three rules that matter most.",
    fix: "Prune ruthlessly. For each line, ask 'would removing this cause mistakes?' If no, delete. Move domain-specific knowledge into skills.",
  },
  {
    name: "The trust-then-verify gap",
    symptom:
      "The diff looks right. You merge. It breaks in production because nobody actually ran the code.",
    fix: "Always provide a verification target up front — a test, a command, an expected output. Make running it part of the definition of done.",
  },
  {
    name: "Infinite exploration",
    symptom:
      "An hour in, Claude is still reading files, still mapping dependencies. The main thread is 80k tokens deep with nothing to show.",
    fix: "Two options. Either narrow the scope of the exploration, or delegate it to a subagent that reports back a summary. Main thread stays clean.",
  },
];

/* ── Group metadata ───────────────────────────────────────────────── */

const GROUPS = [
  {
    title: "The 5 Foundations",
    subtitle: "Practices 1–5. If you only adopt five things, adopt these.",
    color: "accent" as const,
    icon: <Award className="h-3.5 w-3.5 mr-1" />,
    practices: FOUNDATIONS,
  },
  {
    title: "Configure Your Environment",
    subtitle:
      "Practices 6–11. The pieces that make every session more capable.",
    color: "blue" as const,
    icon: <Plug className="h-3.5 w-3.5 mr-1" />,
    practices: ENVIRONMENT,
  },
  {
    title: "Communicate Effectively",
    subtitle: "Practices 12–13. Get more out of Claude by asking better.",
    color: "green" as const,
    icon: <MessageCircleQuestion className="h-3.5 w-3.5 mr-1" />,
    practices: COMMUNICATE,
  },
  {
    title: "Manage Your Session",
    subtitle: "Practices 14–18. Keep the context clean. Keep the thread alive.",
    color: "purple" as const,
    icon: <Layers className="h-3.5 w-3.5 mr-1" />,
    practices: SESSION,
  },
  {
    title: "Automate and Scale",
    subtitle: "Practices 19–22. From one interactive session to many.",
    color: "orange" as const,
    icon: <Zap className="h-3.5 w-3.5 mr-1" />,
    practices: AUTOMATE,
  },
];

/* ── Page ─────────────────────────────────────────────────────────── */

export default function AnthropicBestPracticesPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-anthropic-best-practices-page"
    >
      {/* Hero */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Award className="h-4 w-4" />
            Official best practices
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            The 20 Claude Code Best Practices from Anthropic
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            The official Anthropic playbook for Claude Code, distilled — the
            patterns that work, and the failure modes to avoid. Taken straight
            from Anthropic&apos;s current docs and reorganized for practical
            use.
          </p>
        </div>
      </section>

      {/* Core principle */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted mb-1">
                Core principle
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Manage context aggressively
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                Every practice in this guide is really a context-management
                practice in disguise. Verification targets narrow the context
                Claude has to hold. The 4-phase workflow sequences context
                deliberately. CLAUDE.md preloads it. Hooks, skills, and
                subagents scope it. /clear and /compact keep it clean.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Once you see it, the rest of these practices stop feeling
                like a checklist and start feeling like the same idea viewed
                from twenty angles: put the right signal in front of Claude
                at the right time, and keep the noise out.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-14">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <div className="mb-6">
                <Badge variant={group.color} className="mb-3">
                  {group.icon}
                  {group.title}
                </Badge>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {group.title}
                </h2>
                <p className="text-muted">{group.subtitle}</p>
              </div>
              <div className="space-y-6">
                {group.practices.map((p) => (
                  <div
                    key={p.n}
                    className="border border-border rounded-2xl bg-surface overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 border-b border-border">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-accent/10 text-accent">
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 text-xs text-muted">
                            <span className="font-mono">#{p.n}</span>
                            <span>·</span>
                            <span>{p.tagline}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {p.title}
                          </h3>
                          <p className="text-sm text-muted leading-relaxed">
                            {p.why}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 bg-surface-2/30 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted uppercase tracking-wide">
                            {p.example.label}
                          </span>
                          <CopyButton text={p.example.body} />
                        </div>
                        <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border">
                          <code>{p.example.body}</code>
                        </pre>
                      </div>

                      <div
                        className={cn(
                          "border rounded-lg p-4 flex items-start gap-3",
                          p.note.kind === "tip"
                            ? "border-green/30 bg-green/5"
                            : "border-red/30 bg-red/5"
                        )}
                      >
                        {p.note.kind === "tip" ? (
                          <Lightbulb className="h-4 w-4 text-green shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="text-xs font-semibold text-foreground mb-1">
                            {p.note.title}
                          </div>
                          <p className="text-sm text-muted leading-relaxed">
                            {p.note.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Failure patterns */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Common failure patterns
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Avoid these five modes
              </h2>
              <p className="text-muted">
                Anthropic&apos;s docs call these out explicitly. If a session
                feels like it&apos;s going sideways, it&apos;s almost always
                one of these.
              </p>
            </div>
            <div className="overflow-x-auto border border-border rounded-xl bg-surface">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-left">
                  <tr>
                    <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                      Pattern
                    </th>
                    <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                      Symptom
                    </th>
                    <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                      Fix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {FAILURES.map((f) => (
                    <tr key={f.name} className="align-top">
                      <td className="p-4 font-medium text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red shrink-0" />
                          {f.name}
                        </div>
                      </td>
                      <td className="p-4 text-muted leading-relaxed">
                        {f.symptom}
                      </td>
                      <td className="p-4 text-muted leading-relaxed">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                          <span>{f.fix}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Develop your intuition */}
          <section>
            <div
              className={cn(
                "border border-accent/30 bg-accent/5 rounded-2xl p-6 sm:p-8"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <FileStack className="h-5 w-5 text-accent shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-foreground font-serif italic">
                  Develop your intuition
                </h2>
              </div>
              <p className="text-muted leading-relaxed mb-3">
                These twenty practices aren&apos;t rules to memorize. They&apos;re
                shapes you start recognizing in your own sessions — the moment
                you realize you&apos;ve corrected Claude three times and should
                have cleared, the moment you notice a prompt would go better
                with a verification target, the moment you feel your
                CLAUDE.md growing fat.
              </p>
              <p className="text-muted leading-relaxed mb-3">
                Anthropic&apos;s recommendation is to pick two or three at a
                time. Internalize them until they&apos;re automatic. Then add
                the next two. Forcing all twenty at once is how you end up
                doing none of them well.
              </p>
              <p className="text-muted leading-relaxed">
                Start with verification targets and the 4-phase workflow.
                Everything else compounds from there.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
