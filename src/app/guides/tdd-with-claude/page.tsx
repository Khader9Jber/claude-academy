"use client";

import {
  FlaskConical,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  CircleDot,
  CircleCheckBig,
  Sparkles,
  ShieldAlert,
  Layers,
  GitBranch,
  FileCode,
  Webhook,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Data ───────────────────────────────────────────────────────────── */

const PROMPTS = [
  {
    phase: "RED",
    color: "text-red",
    bg: "bg-red/10",
    icon: <CircleDot className="h-4 w-4" />,
    title: "Write a failing test",
    prompt: `Write a FAILING test for [feature]. Do NOT write implementation yet.
Stop after the test runs and fails. Show me the red output.`,
    why: "This is the single most important prompt in the guide. Without the explicit 'do NOT write implementation', Claude writes both and you've already lost the discipline.",
  },
  {
    phase: "GREEN",
    color: "text-green",
    bg: "bg-green/10",
    icon: <CircleCheckBig className="h-4 w-4" />,
    title: "Write the minimum to pass",
    prompt: `The test is failing. Now write the MINIMUM code to make ONLY this test pass.
Do not add any code that isn't required by this test. No speculative helpers.
No extra branches. Just enough to turn the test green.`,
    why: "'Minimum' is load-bearing. Without it Claude writes production-grade code with extra cases, and you lose the conversation between test and implementation.",
  },
  {
    phase: "REFACTOR",
    color: "text-blue",
    bg: "bg-blue/10",
    icon: <Sparkles className="h-4 w-4" />,
    title: "Clean up (only after green)",
    prompt: `All tests pass. Now refactor: remove duplication, improve names, extract
helpers — WITHOUT adding new behavior. If any test breaks, you changed behavior,
revert and try again.`,
    why: "Refactor is where TDD pays off long-term. Locking Claude to 'no new behavior' keeps the safety net tight.",
  },
];

const FAILURES = [
  {
    title: "Mock implementations",
    body: "Claude writes a function that returns a hardcoded value that happens to make the test pass. Always review what Claude wrote before moving on. Add a second test with different input — if the hardcoded value stops passing, you caught it.",
  },
  {
    title: "Skipping RED",
    body: "Claude writes the test AND the implementation in one turn. The test is green from the start — the whole point is gone. Prevention: prompt for the failing test first, run it, confirm red, THEN ask for implementation.",
  },
  {
    title: "Over-implementing",
    body: "You ask for minimum code, Claude writes the whole feature including edge cases you haven't tested yet. The 'untested' code is a liability. Prompt harder: 'remove any code not required by THIS test.'",
  },
  {
    title: "Testing the implementation, not the behavior",
    body: "Claude writes tests that mirror internal structure (private methods, specific calls). Refactoring breaks them even when behavior is fine. Ask for behavior tests — 'test what it does, not how it does it.'",
  },
  {
    title: "Context pollution",
    body: "In a single session, Claude saw the implementation plan, so its tests are biased toward what it's about to write. Solution: separate sessions (or sub-agents) for test-writer and implementer.",
  },
  {
    title: "One test, many assertions",
    body: "Claude packs 8 assertions into one test. When it fails, you can't tell which assertion broke. Convention: one logical assertion per test, descriptive name.",
  },
];

const WHEN_NOT = [
  {
    title: "Exploratory prototypes",
    body: "You don't know what you're building yet. Tests codify intent — you can't codify what you haven't decided. Prototype first, then TDD the keeper.",
  },
  {
    title: "UI / visual work",
    body: "Assertions about pixels and layouts are brittle and expensive. Use TDD for logic that drives the UI; verify the UI by looking at it.",
  },
  {
    title: "Throwaway scripts",
    body: "A 20-line script you'll run once. TDD costs more than just writing and running it.",
  },
  {
    title: "Learning / spiking a library",
    body: "You're learning how an API works. Tests assume you know the expected output. First, play; then, TDD.",
  },
];

const TDD_CLAUDE_MD = `# Project: Test-Driven [Service Name]

## TDD Conventions

### Discipline
- ALWAYS write a failing test BEFORE implementation
- Write the MINIMUM code to pass one test at a time
- No speculative helpers, no extra branches, no unused code
- Refactor only while green (all tests passing)

### Test Structure
- Follow AAA: Arrange · Act · Assert (separated by blank lines)
- One logical assertion per test — fail messages should be unambiguous
- Test names describe behavior in plain English:
  - \`should_return_empty_when_no_items\`
  - \`should_reject_negative_amounts\`
  - \`should_emit_event_when_state_changes\`

### File Layout
- Unit tests colocate with source: \`src/order.ts\` ↔ \`src/order.test.ts\`
- Integration tests in \`tests/integration/\` with fixtures in \`tests/fixtures/\`
- Run one test: \`npm test -- -t "should return empty"\`

### What NOT To Do
- Do NOT write implementation first and then tests that pass against it
- Do NOT assert on private fields or internal calls — test behavior
- Do NOT have multiple tests depend on shared mutable state
- Do NOT mock what you own; fake external I/O only

### Red-Green-Refactor Rhythm
1. Write ONE failing test. Run it. Confirm RED.
2. Write the MINIMUM code to turn it green. Nothing else.
3. Once green, look for duplication/clarity. Refactor without changing behavior.
4. Loop.

### Running Tests
- All: \`npm test\`
- Watch: \`npm test -- --watch\`
- Single file: \`npm test -- order.test.ts\`
- Coverage: \`npm test -- --coverage\`
`;

/* ── Page ───────────────────────────────────────────────────────────── */

export default function TddWithClaudePage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-tdd-with-claude-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <FlaskConical className="h-4 w-4" />
            Discipline
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Test-Driven Development with Claude Code
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Claude wants to write implementation first. TDD requires the
            inverse. Here&apos;s the exact prompt pattern, the CLAUDE.md, and
            the hooks that keep the discipline from falling apart.
          </p>
        </div>
      </section>

      {/* Core problem */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                The core problem
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                Ask Claude for a feature, and its default move is{" "}
                <em>implementation first, tests second</em>. The tests it then
                writes are calibrated to pass against the implementation it
                just produced. This is not TDD — it&apos;s test-after, which
                gives you a false sense of coverage without the design
                benefits.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                To get real TDD out of Claude, you have to invert the default
                explicitly, every time, with the right prompt and the right
                guardrails. This guide is the whole playbook.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* Why it defaults wrong */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Why it breaks
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Why Claude defaults to implementation first
              </h2>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-3">
              <p className="text-sm text-muted leading-relaxed">
                Training data leans heavily toward code that was shipped to
                GitHub. In that data, tests exist alongside (or after) their
                implementations. The statistically-natural response to
                &quot;write a function that does X&quot; is: write the
                function, then maybe add tests. Without explicit redirection,
                Claude follows that gradient.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                The symptom is subtle. Tests pass immediately. Coverage looks
                fine. But the tests never drove design — they validated what
                was already written. You get tests that:
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red shrink-0 mt-0.5" />
                  <span>
                    Hard-code the exact values the implementation happens to
                    return
                  </span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red shrink-0 mt-0.5" />
                  <span>
                    Mirror internal structure instead of testing behavior
                  </span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red shrink-0 mt-0.5" />
                  <span>
                    Miss edge cases the design never considered
                  </span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red shrink-0 mt-0.5" />
                  <span>
                    Pass today, break tomorrow on any minor refactor
                  </span>
                </li>
              </ul>
              <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3 mt-3">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    The fix
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Explicit, repeated, template-style prompts that force the
                    RED phase first. Combined with CLAUDE.md conventions and a
                    PostToolUse hook that runs tests automatically. Details
                    below.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The 3 prompts */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Prompts
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                The three prompts that enforce TDD
              </h2>
              <p className="text-muted">
                One per phase. Say them out loud — they&apos;re short on
                purpose. The wording matters.
              </p>
            </div>
            <div className="space-y-4">
              {PROMPTS.map((p, i) => (
                <div
                  key={p.phase}
                  className="border border-border rounded-2xl bg-surface overflow-hidden"
                >
                  <div className="p-5 border-b border-border">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
                          p.bg,
                          p.color
                        )}
                      >
                        {p.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted font-mono">
                            Phase {i + 1}
                          </span>
                          <span className="text-xs text-muted">·</span>
                          <span
                            className={cn(
                              "text-xs font-semibold uppercase tracking-wide",
                              p.color
                            )}
                          >
                            {p.phase}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {p.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-2 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted uppercase tracking-wide">
                        Prompt
                      </span>
                      <CopyButton text={p.prompt} />
                    </div>
                    <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg border border-border overflow-x-auto leading-relaxed whitespace-pre-wrap">
                      <code>{p.prompt}</code>
                    </pre>
                    <div className="mt-3 text-xs text-muted leading-relaxed italic">
                      {p.why}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Red-Green-Refactor walkthrough */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Walkthrough
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Red-Green-Refactor in practice
              </h2>
              <p className="text-muted">
                A realistic session building a price calculator the TDD way.
              </p>
            </div>
            <div className="space-y-4">
              <div className="border border-red/30 rounded-xl bg-surface overflow-hidden">
                <div className="px-5 py-3 bg-red/10 border-b border-red/30 flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-red" />
                  <span className="text-sm font-semibold text-foreground">
                    Step 1 — RED
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted leading-relaxed">
                    <strong className="text-foreground">You:</strong> Write a
                    failing test for a function that calculates the total price
                    of a cart with no items. It should return 0. Do NOT write
                    the implementation yet.
                  </p>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-3 rounded-lg overflow-x-auto leading-relaxed">
                    <code>{`// src/cart.test.ts
import { describe, it, expect } from "vitest";
import { totalPrice } from "./cart";

describe("totalPrice", () => {
  it("should return 0 when cart is empty", () => {
    expect(totalPrice([])).toBe(0);
  });
});`}</code>
                  </pre>
                  <p className="text-sm text-muted leading-relaxed">
                    Run <code className="bg-surface-2 px-1 rounded">npm test</code>. Result: <strong className="text-red">RED</strong> — <code className="bg-surface-2 px-1 rounded">totalPrice</code> doesn&apos;t exist yet. Good.
                  </p>
                </div>
              </div>

              <div className="border border-green/30 rounded-xl bg-surface overflow-hidden">
                <div className="px-5 py-3 bg-green/10 border-b border-green/30 flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-green" />
                  <span className="text-sm font-semibold text-foreground">
                    Step 2 — GREEN
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted leading-relaxed">
                    <strong className="text-foreground">You:</strong> Now write
                    the MINIMUM code to make ONLY this test pass.
                  </p>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-3 rounded-lg overflow-x-auto leading-relaxed">
                    <code>{`// src/cart.ts
export function totalPrice(items: unknown[]): number {
  return 0;
}`}</code>
                  </pre>
                  <p className="text-sm text-muted leading-relaxed">
                    Yes, it hardcodes 0. That&apos;s correct for TDD — we write
                    the absolute minimum. Tests: <strong className="text-green">GREEN</strong>. Next test will force generalization.
                  </p>
                </div>
              </div>

              <div className="border border-red/30 rounded-xl bg-surface overflow-hidden">
                <div className="px-5 py-3 bg-red/10 border-b border-red/30 flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-red" />
                  <span className="text-sm font-semibold text-foreground">
                    Step 3 — next RED
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted leading-relaxed">
                    <strong className="text-foreground">You:</strong> Add a
                    failing test for a single item in the cart. No
                    implementation yet.
                  </p>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-3 rounded-lg overflow-x-auto leading-relaxed">
                    <code>{`it("should return the price when cart has one item", () => {
  expect(totalPrice([{ price: 10 }])).toBe(10);
});`}</code>
                  </pre>
                  <p className="text-sm text-muted leading-relaxed">
                    Red again. <code className="bg-surface-2 px-1 rounded">totalPrice([{"{"} price: 10 {"}"}])</code> returns 0, not 10.
                  </p>
                </div>
              </div>

              <div className="border border-green/30 rounded-xl bg-surface overflow-hidden">
                <div className="px-5 py-3 bg-green/10 border-b border-green/30 flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4 text-green" />
                  <span className="text-sm font-semibold text-foreground">
                    Step 4 — GREEN again
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-3 rounded-lg overflow-x-auto leading-relaxed">
                    <code>{`export function totalPrice(items: { price: number }[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}`}</code>
                  </pre>
                  <p className="text-sm text-muted leading-relaxed">
                    Both tests pass. Design emerged from the tests, not the
                    other way around.
                  </p>
                </div>
              </div>

              <div className="border border-blue/30 rounded-xl bg-surface overflow-hidden">
                <div className="px-5 py-3 bg-blue/10 border-b border-blue/30 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue" />
                  <span className="text-sm font-semibold text-foreground">
                    Step 5 — REFACTOR
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted leading-relaxed">
                    All tests green. If duplication exists, clean it up{" "}
                    <em>without changing behavior</em>. In this small example
                    there&apos;s nothing to refactor yet. Keep adding tests
                    (multiple items, discounts, tax) — the refactor opportunity
                    will arrive naturally.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CLAUDE.md template */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <FileCode className="h-3.5 w-3.5 mr-1" />
                Template
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                CLAUDE.md for a TDD project
              </h2>
              <p className="text-muted">
                Drop this into your repo. Adjust the commands and language, keep
                the discipline rules verbatim.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-border">
                <span className="text-xs text-muted font-mono">CLAUDE.md</span>
                <CopyButton text={TDD_CLAUDE_MD} />
              </div>
              <pre className="text-xs text-foreground/90 font-mono p-4 overflow-x-auto leading-relaxed max-h-[500px]">
                <code>{TDD_CLAUDE_MD}</code>
              </pre>
            </div>
          </section>

          {/* Multi-agent */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <GitBranch className="h-3.5 w-3.5 mr-1" />
                Advanced
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Multi-agent TDD to avoid context pollution
              </h2>
              <p className="text-muted">
                The single-context problem: once Claude has planned the
                implementation, its tests are biased toward that plan. A clean
                fix is to use two agents.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
              <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
                <code>{`Test-Writer agent         Implementer agent
─────────────────         ─────────────────
Reads: spec, interface    Reads: tests only
Writes: failing test      Writes: minimum code
Cannot see: impl          Cannot see: spec

                  ↓
          Main agent orchestrates:
     "test-writer: add a test for X"
     → test runs, fails
     "implementer: make this test pass"
     → test runs, passes
     loop`}</code>
              </pre>
              <p className="text-sm text-muted leading-relaxed">
                With two agents, the implementer literally can&apos;t write
                tests that mirror its own implementation — it doesn&apos;t see
                the spec. The test-writer can&apos;t write implementation that
                matches its own tests — it doesn&apos;t see the code. You get
                the exact decoupling TDD wants in theory.
              </p>
              <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    Worktrees make this easy
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Combined with worktree isolation, each agent has its own
                    checkout. The test-writer can&apos;t accidentally peek at
                    the implementer&apos;s files because they live in a
                    different directory. See the parallel development guide.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Hooks */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Webhook className="h-3.5 w-3.5 mr-1" />
                Enforcement
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Hooks to enforce TDD automatically
              </h2>
              <p className="text-muted">
                Two hooks turn TDD from a discipline you have to remember into
                a workflow that runs itself.
              </p>
            </div>
            <div className="space-y-4">
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    1. Run related test after every edit
                  </h3>
                  <p className="text-xs text-muted">
                    PostToolUse + Edit|Write. Claude gets immediate feedback;
                    it can&apos;t forget to run the tests.
                  </p>
                </div>
                <div className="bg-surface-2 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted">
                      .claude/settings.json
                    </span>
                    <CopyButton
                      text={`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "npx vitest related --run \\"$CLAUDE_FILE\\" 2>&1 | tail -20"
        }]
      }
    ]
  }
}`}
                    />
                  </div>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border">
                    <code>{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "npx vitest related --run \\"$CLAUDE_FILE\\" 2>&1 | tail -20"
        }]
      }
    ]
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    2. Reject implementation if no failing test exists
                  </h3>
                  <p className="text-xs text-muted">
                    PreToolUse. Before Claude edits a non-test file, the hook
                    checks that a related test file exists and that it has a
                    recently failing assertion. If not, blocks the edit.
                  </p>
                </div>
                <div className="bg-surface-2 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted font-mono">
                      .claude/hooks/require-red-first.sh
                    </span>
                    <CopyButton
                      text={`#!/usr/bin/env bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

# Only guard source files
case "$FILE" in
  *.test.*|*.spec.*|*.md|*.json) exit 0 ;;
esac

TEST="\${FILE%.*}.test.\${FILE##*.}"
if [[ ! -f "$TEST" ]]; then
  echo "BLOCKED: no test file exists for $FILE." >&2
  echo "Create $TEST with a failing test first." >&2
  exit 2
fi

# Did the related test fail recently?
if ! npx vitest run "$TEST" --reporter=json 2>/dev/null \\
   | jq -e '.testResults[].testResults[] | select(.status=="failed")' >/dev/null; then
  echo "BLOCKED: $TEST has no failing test." >&2
  echo "Add a failing test before writing implementation." >&2
  exit 2
fi

exit 0`}
                    />
                  </div>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border max-h-80">
                    <code>{`#!/usr/bin/env bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""')

# Only guard source files
case "$FILE" in
  *.test.*|*.spec.*|*.md|*.json) exit 0 ;;
esac

TEST="\${FILE%.*}.test.\${FILE##*.}"
if [[ ! -f "$TEST" ]]; then
  echo "BLOCKED: no test file exists for $FILE." >&2
  echo "Create $TEST with a failing test first." >&2
  exit 2
fi

# Did the related test fail recently?
if ! npx vitest run "$TEST" --reporter=json 2>/dev/null \\
   | jq -e '.testResults[].testResults[] | select(.status=="failed")' >/dev/null; then
  echo "BLOCKED: $TEST has no failing test." >&2
  echo "Add a failing test before writing implementation." >&2
  exit 2
fi

exit 0`}</code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="mt-5 border border-orange/30 bg-orange/5 rounded-xl p-5 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-orange shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  Use hook #2 sparingly
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  The enforcement hook is strict. It makes TDD mechanically
                  impossible to skip — but also blocks legitimate cases (new
                  project scaffolding, prototype spikes). Enable it on mature
                  codebases with well-established test patterns, not greenfield
                  work.
                </p>
              </div>
            </div>
          </section>

          {/* Failure modes */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Failure modes
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Common ways Claude breaks TDD
              </h2>
              <p className="text-muted">
                Spot these fast, correct them harder, move on. None of them are
                fatal if you catch them.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {FAILURES.map((f) => (
                <div
                  key={f.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {f.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* When not */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Pragmatism
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When NOT to use TDD with Claude
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {WHEN_NOT.map((w) => (
                <div
                  key={w.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {w.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{w.body}</p>
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
                Claude will write implementation first unless you stop it.
                Prompt for the failing test first, put the TDD rules in
                CLAUDE.md, add a hook to run tests on every edit, and consider
                splitting test-writer from implementer for high-stakes work.
                Discipline encoded in tools always beats discipline you have to
                remember.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
