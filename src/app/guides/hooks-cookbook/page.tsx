"use client";

import {
  Webhook,
  ShieldAlert,
  Bell,
  TestTube2,
  ScrollText,
  FileClock,
  GitCommit,
  Sparkles,
  Ban,
  FileStack,
  Lightbulb,
  AlertTriangle,
  Lock,
  Target,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */

interface Hook {
  id: string;
  title: string;
  event: "PreToolUse" | "PostToolUse" | "SessionStart" | "SessionEnd" | "Notification";
  matcher?: string;
  icon: React.ReactNode;
  color: string;
  why: string;
  config: string;
  script?: { path: string; body: string };
  test: string;
}

/* ── Data: Hook events ──────────────────────────────────────────────── */

const EVENTS = [
  {
    name: "PreToolUse",
    color: "text-orange",
    desc: "Fires BEFORE any tool call. Can block the call by exiting non-zero. Use for guardrails: dangerous commands, forbidden files, git main-branch protection.",
  },
  {
    name: "PostToolUse",
    color: "text-blue",
    desc: "Fires AFTER a tool call. Gets the output. Use for side effects: formatting, linting, tests, logging, notifications on specific tool results.",
  },
  {
    name: "SessionStart",
    color: "text-green",
    desc: "Fires once when a Claude Code session opens. Use to warm caches, sync env, show a welcome banner, or pre-load context into CLAUDE.md.",
  },
  {
    name: "SessionEnd",
    color: "text-purple",
    desc: "Fires when the session closes. Use for summaries, log rotation, commit reminders, cleanup of scratch files.",
  },
  {
    name: "Notification",
    color: "text-cyan",
    desc: "Fires when Claude needs user input or attention. Use for desktop notifications (macOS osascript, Linux notify-send), Slack pings, or sounds.",
  },
];

/* ── Data: Hooks ────────────────────────────────────────────────────── */

const HOOKS: Hook[] = [
  {
    id: "auto-format",
    title: "Auto-format with Prettier on every edit",
    event: "PostToolUse",
    matcher: "Edit|Write",
    icon: <Sparkles className="h-5 w-5" />,
    color: "#5e9ed6",
    why: "Eliminates the 'please format this' round-trip. Every file Claude touches comes out formatted to your project's Prettier config. Zero manual steps.",
    config: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \\"$CLAUDE_FILE\\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}`,
    test: "Ask Claude to add a poorly formatted function. Watch Prettier silently fix it. Run `git diff` — only the logical change should show, not whitespace churn.",
  },
  {
    id: "block-dangerous",
    title: "Block dangerous bash commands",
    event: "PreToolUse",
    matcher: "Bash",
    icon: <Ban className="h-5 w-5" />,
    color: "#e06c75",
    why: "`rm -rf /`, `git push --force` on main, `sudo` in agent context — all catastrophic. A tiny shell guard rejects these before they run. Exit non-zero = Claude gets the error back and tries something safer.",
    config: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/block-dangerous.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/block-dangerous.sh",
      body: `#!/usr/bin/env bash
# Read the proposed command from stdin (JSON)
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Patterns that are always rejected
DANGEROUS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \\*"
  ":(){ :|:& };:"            # fork bomb
  "mkfs\\."
  "dd if=.*of=/dev/"
  "sudo "
  "chmod -R 777 /"
  "> /dev/sda"
  "git push --force.*(main|master)"
  "git push -f.*(main|master)"
)

for pat in "\${DANGEROUS[@]}"; do
  if [[ "$CMD" =~ $pat ]]; then
    echo "BLOCKED by hook: command matches dangerous pattern '$pat'" >&2
    exit 2
  fi
done

exit 0`,
    },
    test: "Ask Claude: 'run rm -rf / to clean up'. The hook blocks it, Claude sees the stderr message, and apologizes instead of nuking your disk.",
  },
  {
    id: "desktop-notify",
    title: "Desktop notification when Claude needs input",
    event: "Notification",
    icon: <Bell className="h-5 w-5" />,
    color: "#d4a053",
    why: "Long-running agent sessions leave you watching a terminal. With this hook, your laptop pings you the moment Claude is blocked waiting. You work on something else in peace.",
    config: `{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/notify.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/notify.sh",
      body: `#!/usr/bin/env bash
# Cross-platform desktop notification
MSG=$(cat | jq -r '.message // "Claude needs your attention"')
TITLE="Claude Code"

case "$(uname -s)" in
  Darwin)
    osascript -e "display notification \\"$MSG\\" with title \\"$TITLE\\" sound name \\"Glass\\""
    ;;
  Linux)
    notify-send "$TITLE" "$MSG" --urgency=normal --icon=dialog-information
    ;;
  *)
    printf '\\a'   # terminal bell as fallback
    ;;
esac

exit 0`,
    },
    test: "Start a long task, tab away, keep working. When Claude asks a question, you get a native notification. No more babysitting the terminal.",
  },
  {
    id: "auto-tests",
    title: "Auto-run tests after code changes",
    event: "PostToolUse",
    matcher: "Edit|Write",
    icon: <TestTube2 className="h-5 w-5" />,
    color: "#5cb870",
    why: "Tight feedback loop. Every edit to a `.ts` or `.py` file triggers the related test in the background. Claude sees the result in the next turn and can self-correct before moving on.",
    config: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/run-related-tests.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/run-related-tests.sh",
      body: `#!/usr/bin/env bash
FILE="$CLAUDE_FILE"

# Only react to source files
case "$FILE" in
  *.test.*|*.spec.*) exit 0 ;;
  *.ts|*.tsx|*.js|*.jsx)
    TEST="\${FILE%.*}.test.\${FILE##*.}"
    if [[ -f "$TEST" ]]; then
      npx vitest run "$TEST" --reporter=basic 2>&1 | tail -n 20
    fi
    ;;
  *.py)
    TEST="tests/\${FILE#src/}"
    TEST="\${TEST%.py}_test.py"
    if [[ -f "$TEST" ]]; then
      pytest "$TEST" -q 2>&1 | tail -n 20
    fi
    ;;
esac

exit 0`,
    },
    test: "Ask Claude to change a pure function. Within seconds you'll see Vitest/pytest output. Break the function on purpose — Claude reads the failure and fixes it in the next turn.",
  },
  {
    id: "audit-log",
    title: "Log all bash commands for audit",
    event: "PostToolUse",
    matcher: "Bash",
    icon: <ScrollText className="h-5 w-5" />,
    color: "#a07ed6",
    why: "Compliance, debugging, and peace of mind. Every command Claude runs in your repo ends up in an append-only log with timestamp and exit code. Great for 'what did the agent do at 3am?'",
    config: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/audit-bash.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/audit-bash.sh",
      body: `#!/usr/bin/env bash
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""')
EXIT=$(echo "$INPUT" | jq -r '.tool_response.exit_code // "?"')
CWD=$(pwd)
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p .claude/logs
printf '[%s] exit=%s cwd=%s cmd=%q\\n' "$TS" "$EXIT" "$CWD" "$CMD" \\
  >> .claude/logs/bash-audit.log

exit 0`,
    },
    test: "Run any session with bash tool use. `tail -f .claude/logs/bash-audit.log` shows a timestamped record. Add the log dir to `.gitignore`.",
  },
  {
    id: "session-summary",
    title: "Session summary at end",
    event: "SessionEnd",
    icon: <FileStack className="h-5 w-5" />,
    color: "#5ec4c4",
    why: "A fresh markdown summary every time you end a session — files touched, commands run, duration. Drop it into your daily note, Linear ticket, or PR description with one copy.",
    config: `{
  "hooks": {
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/session-summary.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/session-summary.sh",
      body: `#!/usr/bin/env bash
mkdir -p .claude/summaries
TS=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
OUT=".claude/summaries/session-$TS.md"

{
  echo "# Claude session — $TS"
  echo ""
  echo "## Files changed"
  git diff --name-only 2>/dev/null || echo "(no git repo)"
  echo ""
  echo "## Recent commands (last 20)"
  tail -n 20 .claude/logs/bash-audit.log 2>/dev/null || echo "(no audit log)"
  echo ""
  echo "## Uncommitted diff stats"
  git diff --stat 2>/dev/null || true
} > "$OUT"

echo "Session summary written to $OUT" >&2
exit 0`,
    },
    test: "Close a session (Ctrl+D or `/exit`). Check `.claude/summaries/` — you'll have a fresh markdown file you can paste anywhere.",
  },
  {
    id: "commit-reminder",
    title: "Git commit reminder after too many changes",
    event: "PostToolUse",
    matcher: "Edit|Write",
    icon: <GitCommit className="h-5 w-5" />,
    color: "#d65ea0",
    why: "Claude loves making 40 edits in a row without committing. When the uncommitted diff crosses a threshold, this hook nudges both you and Claude to create a checkpoint.",
    config: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/commit-reminder.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/commit-reminder.sh",
      body: `#!/usr/bin/env bash
CHANGED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
LINES=$(git diff --shortstat 2>/dev/null | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+' || echo 0)

# Threshold: 10 files OR 300 added lines
if [[ "$CHANGED" -ge 10 || "$LINES" -ge 300 ]]; then
  echo "REMINDER: $CHANGED files changed, $LINES insertions uncommitted." >&2
  echo "Consider making a checkpoint commit before continuing." >&2
fi

exit 0`,
    },
    test: "Ask Claude to refactor something large. Once the threshold hits, you'll see the reminder in stderr and Claude will offer to commit.",
  },
  {
    id: "lint-on-save",
    title: "Lint on save (ESLint / Ruff)",
    event: "PostToolUse",
    matcher: "Edit|Write",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "#d4a053",
    why: "Runs the project's linter on the edited file only (not the whole repo). Claude sees errors immediately and fixes them before moving on — no more 'push, CI fails, fix, push again'.",
    config: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/lint-file.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/lint-file.sh",
      body: `#!/usr/bin/env bash
FILE="$CLAUDE_FILE"

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx)
    npx eslint --fix "$FILE" 2>&1 | tail -n 30
    ;;
  *.py)
    npx -y ruff check --fix "$FILE" 2>&1 | tail -n 30
    ;;
esac

exit 0   # never block on lint — just report`,
    },
    test: "Have Claude introduce an unused import. The hook reports it and (if fix is safe) auto-removes it. Your diff stays clean.",
  },
  {
    id: "protect-main",
    title: "Prevent commits directly to main/master",
    event: "PreToolUse",
    matcher: "Bash",
    icon: <Lock className="h-5 w-5" />,
    color: "#e06c75",
    why: "One careless agent + a branch you forgot to check = a commit landing on `main` without review. This hook rejects `git commit` when HEAD is on a protected branch and suggests branching off instead.",
    config: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/protect-main.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/protect-main.sh",
      body: `#!/usr/bin/env bash
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Only care about git commit / push
if [[ ! "$CMD" =~ git[[:space:]]+(commit|push) ]]; then
  exit 0
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
PROTECTED=("main" "master" "production" "release")

for p in "\${PROTECTED[@]}"; do
  if [[ "$BRANCH" == "$p" ]]; then
    echo "BLOCKED by hook: current branch is protected ($BRANCH)." >&2
    echo "Create a feature branch first: git checkout -b feat/your-change" >&2
    exit 2
  fi
done

exit 0`,
    },
    test: "`git checkout main`. Ask Claude to commit something. The hook blocks it and Claude creates a branch first. Switch to a feature branch — commits flow normally.",
  },
  {
    id: "changelog-update",
    title: "Auto-update CHANGELOG.md on significant changes",
    event: "SessionEnd",
    icon: <FileClock className="h-5 w-5" />,
    color: "#5cb870",
    why: "Keeps the CHANGELOG current without you ever touching it. At session end, if there are meaningful diffs, this hook appends a dated entry with commit subjects.",
    config: `{
  "hooks": {
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/update-changelog.sh"
          }
        ]
      }
    ]
  }
}`,
    script: {
      path: ".claude/hooks/update-changelog.sh",
      body: `#!/usr/bin/env bash
# Skip if no new commits since last changelog update
LAST=$(grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' CHANGELOG.md 2>/dev/null | head -1)
TODAY=$(date -u +"%Y-%m-%d")
[[ "$LAST" == "$TODAY" ]] && exit 0

# Collect commit subjects since yesterday
ENTRIES=$(git log --since="24 hours ago" --pretty=format:"- %s" 2>/dev/null)
[[ -z "$ENTRIES" ]] && exit 0

TMP=$(mktemp)
{
  echo "# Changelog"
  echo ""
  echo "## [$TODAY]"
  echo ""
  echo "$ENTRIES"
  echo ""
  # Append rest of existing changelog below the first heading
  tail -n +2 CHANGELOG.md 2>/dev/null
} > "$TMP"

mv "$TMP" CHANGELOG.md
echo "CHANGELOG.md updated for $TODAY" >&2
exit 0`,
    },
    test: "Work a session, make a couple of commits, then exit. Your CHANGELOG.md gets a fresh dated section with subjects. Review, tweak, commit it.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function HooksCookbookPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-hooks-cookbook-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Webhook className="h-4 w-4" />
            Cookbook
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Claude Code Hooks: Complete Automation Cookbook
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Ten production-ready hooks that turn Claude Code from a smart
            assistant into a self-correcting, self-auditing, self-documenting
            teammate. Copy, paste, commit.
          </p>
        </div>
      </section>

      {/* Why hooks */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Why hooks matter
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                Hooks are shell commands the harness runs at specific points in
                Claude&apos;s loop. They execute on your machine, not inside
                Claude&apos;s thinking — which means they can enforce invariants
                Claude can&apos;t ignore. Formatting, guardrails, logging,
                notifications, tests: all free, all deterministic, all invisible
                to your token budget.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                The rule of thumb: if you ever type the same reminder to Claude
                twice (&quot;format this&quot;, &quot;run the tests&quot;,
                &quot;don&apos;t touch main&quot;), stop typing it and write a
                hook.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* Events */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Events
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                The five hook events
              </h2>
              <p className="text-muted">
                Everything in this cookbook hangs off one of these five lifecycle
                points. Pick the one that matches <em>when</em> you want your
                logic to run.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {EVENTS.map((e) => (
                <div
                  key={e.name}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <code
                      className={cn(
                        "text-sm font-mono font-semibold",
                        e.color
                      )}
                    >
                      {e.name}
                    </code>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Config location */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <FileStack className="h-3.5 w-3.5 mr-1" />
                Setup
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Where hooks live
              </h2>
              <p className="text-muted">
                Two scopes. Pick based on whether the hook is yours or the
                project&apos;s.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="text-xs uppercase tracking-wide text-muted mb-2">
                  Global (your machine)
                </div>
                <code className="text-sm font-mono text-foreground block mb-3">
                  ~/.claude/settings.json
                </code>
                <p className="text-sm text-muted leading-relaxed">
                  Applies to every repo you open. Great for personal quality of
                  life: notifications, audit logs, session summaries.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <div className="text-xs uppercase tracking-wide text-muted mb-2">
                  Project (committed to repo)
                </div>
                <code className="text-sm font-mono text-foreground block mb-3">
                  .claude/settings.json
                </code>
                <p className="text-sm text-muted leading-relaxed">
                  Applies to everyone who works on this repo. Use for team-wide
                  guardrails: formatters, linters, branch protection, test
                  runners.
                </p>
              </div>
            </div>
            <div className="mt-5 border border-orange/30 bg-orange/5 rounded-xl p-5 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-orange shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  Security: project hooks require approval
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  The first time Claude Code sees a project-level hook, it asks
                  you to approve it. This is by design — anyone with commit
                  access could modify the hook. Read the command before
                  approving, especially in repos with external contributors.
                </p>
              </div>
            </div>
          </section>

          {/* Minimal example */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Minimal example
              </h2>
              <p className="text-muted">
                The smallest useful hook — autoformat on every edit. This is the
                shape every other hook follows.
              </p>
            </div>
            <div className="border border-border rounded-xl bg-surface overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-border">
                <span className="text-xs text-muted font-mono">
                  .claude/settings.json
                </span>
                <CopyButton
                  text={`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $CLAUDE_FILE"
          }
        ]
      }
    ]
  }
}`}
                />
              </div>
              <pre className="text-xs text-foreground/90 font-mono p-4 overflow-x-auto leading-relaxed">
                <code>{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $CLAUDE_FILE"
          }
        ]
      }
    ]
  }
}`}</code>
              </pre>
            </div>
            <div className="mt-4 border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-foreground mb-1">
                  Anatomy
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  <code className="bg-surface-2 px-1 rounded">matcher</code> is
                  a regex matched against the tool name (here, Edit OR Write).
                  <code className="bg-surface-2 px-1 rounded ml-1">command</code>
                  is shell — use absolute paths or let Claude Code set cwd to
                  the repo root. <code className="bg-surface-2 px-1 rounded">
                    $CLAUDE_FILE
                  </code>{" "}
                  and related env vars are injected for you.
                </p>
              </div>
            </div>
          </section>

          {/* Hooks */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Webhook className="h-3.5 w-3.5 mr-1" />
                Ten production hooks
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                The cookbook
              </h2>
              <p className="text-muted">
                Each hook includes the full settings.json snippet, the supporting
                shell script when needed, when to use it, and how to test it.
              </p>
            </div>
            <div className="space-y-6">
              {HOOKS.map((h, idx) => (
                <div
                  key={h.id}
                  className="border border-border rounded-2xl bg-surface overflow-hidden"
                >
                  <div className="p-5 sm:p-6 border-b border-border">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                        style={{
                          backgroundColor: `${h.color}15`,
                          color: h.color,
                        }}
                      >
                        {h.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 text-xs text-muted">
                          <span className="font-mono">#{idx + 1}</span>
                          <span>·</span>
                          <code className="font-mono">{h.event}</code>
                          {h.matcher && (
                            <>
                              <span>·</span>
                              <code className="font-mono">
                                matcher: {h.matcher}
                              </code>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {h.title}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">
                          {h.why}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 bg-surface-2/30 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted uppercase tracking-wide">
                          settings.json
                        </span>
                        <CopyButton text={h.config} />
                      </div>
                      <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border">
                        <code>{h.config}</code>
                      </pre>
                    </div>

                    {h.script && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted uppercase tracking-wide font-mono">
                            {h.script.path} (chmod +x)
                          </span>
                          <CopyButton text={h.script.body} />
                        </div>
                        <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border max-h-80">
                          <code>{h.script.body}</code>
                        </pre>
                      </div>
                    )}

                    <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
                      <TestTube2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-foreground mb-1">
                          How to test
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                          {h.test}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gotchas */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Gotchas
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Things that will bite you
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Forgetting chmod +x
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Script hooks fail silently with &quot;permission denied&quot;
                  if not executable. After writing a hook script, always{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    chmod +x .claude/hooks/*.sh
                  </code>
                  .
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Blocking too aggressively
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Exit code 2 from a PreToolUse hook BLOCKS the tool. Use it
                  only for real dangers. For warnings, exit 0 and write to
                  stderr instead.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Slow hooks choke the loop
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Every hook runs synchronously in Claude&apos;s turn. A
                  30-second test suite on every edit will crush your velocity.
                  Run narrowly scoped tests, or move heavy work to SessionEnd.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Matcher regex surprises
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  The matcher is anchored/partial based on the harness. When in
                  doubt, use explicit alternation (e.g.{" "}
                  <code className="bg-surface-2 px-1 rounded">Edit|Write</code>)
                  rather than clever patterns.
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
                Anything you type to Claude more than twice is a hook waiting to
                be written. Start with autoformat and a dangerous-command guard,
                then add notifications, then grow from there. Every hook you
                write is one less thing you have to remember.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
