"use client";

import {
  Brain,
  Sparkles,
  Zap,
  GaugeCircle,
  Wallet,
  GitBranch,
  ArrowRight,
  Lightbulb,
  Layers,
  CheckCircle2,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";

/* ── Types ──────────────────────────────────────────────────────────── */

type ModelId = "opus" | "sonnet" | "haiku";

interface ModelSpec {
  id: ModelId;
  name: string;
  tagline: string;
  color: string;
  icon: React.ReactNode;
  reasoning: string;
  speed: string;
  inputCost: string;
  outputCost: string;
  tokensPerSec: string;
  useFor: string[];
  avoidFor: string[];
  realWorldExample: string;
  scenarios: string[];
}

/* ── Data ───────────────────────────────────────────────────────────── */

const MODELS: ModelSpec[] = [
  {
    id: "opus",
    name: "Claude Opus 4.6",
    tagline: "The heavyweight. Use when reasoning matters more than speed.",
    color: "#a07ed6",
    icon: <Brain className="h-5 w-5" />,
    reasoning: "Best-in-class",
    speed: "Slowest (~35 tok/sec)",
    inputCost: "$15 / 1M tokens",
    outputCost: "$75 / 1M tokens",
    tokensPerSec: "~35",
    useFor: [
      "Architecture decisions with multiple tradeoffs",
      "Debugging gnarly production issues (race conditions, memory leaks)",
      "Complex refactors touching many systems",
      "Mathematical, algorithmic, or formal-logic problems",
      "Code reviews for security-sensitive changes",
    ],
    avoidFor: [
      "Simple CRUD work",
      "Bulk renames or formatting",
      "Boilerplate generation",
      "One-line fixes",
    ],
    realWorldExample:
      "Designing a distributed lock mechanism with exactly-once semantics across 3 regions.",
    scenarios: [
      "Your API is losing requests and you can't find why — Opus will reason through the whole request lifecycle",
      "You need to split a 5,000-line service into microservices without breaking consumers",
      "Designing a caching strategy that balances consistency, latency, and cost",
      "Writing a security review for an OAuth implementation",
      "Debugging a flaky test that fails 1% of the time in CI",
    ],
  },
  {
    id: "sonnet",
    name: "Claude Sonnet 4.5",
    tagline: "The daily driver. The default. 90% of your work runs here.",
    color: "#5cb870",
    icon: <Sparkles className="h-5 w-5" />,
    reasoning: "Excellent",
    speed: "Fast (~75 tok/sec)",
    inputCost: "$3 / 1M tokens",
    outputCost: "$15 / 1M tokens",
    tokensPerSec: "~75",
    useFor: [
      "Feature development (most common case)",
      "Bug fixes and small refactors",
      "Writing tests",
      "Code review for typical PRs",
      "Documentation and examples",
    ],
    avoidFor: [
      "Problems that genuinely need multi-step reasoning (upgrade to Opus)",
      "Pure boilerplate where Haiku would be 5x cheaper and equally good",
    ],
    realWorldExample:
      "Adding a new API endpoint with validation, service layer, and tests — standard feature work.",
    scenarios: [
      "Implementing a new REST endpoint following your existing patterns",
      "Fixing a bug where you know the file but not the exact cause",
      "Writing Playwright E2E tests for a checkout flow",
      "Refactoring a component to use a new design system primitive",
      "Translating requirements into a Prisma schema migration",
    ],
  },
  {
    id: "haiku",
    name: "Claude Haiku 4",
    tagline: "The sprinter. Cheap, fast, perfect for bulk simple tasks.",
    color: "#5e9ed6",
    icon: <Zap className="h-5 w-5" />,
    reasoning: "Good (for simple tasks)",
    speed: "Blazing (~160 tok/sec)",
    inputCost: "$0.80 / 1M tokens",
    outputCost: "$4 / 1M tokens",
    tokensPerSec: "~160",
    useFor: [
      "Bulk rename across many files",
      "Batch translation or localization",
      "Reformatting configs or JSON/YAML",
      "Simple boilerplate (CRUD shells, DTOs)",
      "Explaining small code snippets",
    ],
    avoidFor: [
      "Anything requiring deep context awareness",
      "Architecture or design decisions",
      "Security-sensitive code",
      "Multi-file reasoning with subtle dependencies",
    ],
    realWorldExample:
      "Renaming `userId` to `user_id` across 200 TypeScript files and updating all imports.",
    scenarios: [
      "Translating 1,500 strings in your i18n JSON to a new language",
      "Adding boilerplate headers to every file in a legacy codebase",
      "Generating repetitive DTOs from a schema",
      "Reformatting ESLint output into a GitHub comment",
      "Explaining what a 20-line function does to a teammate",
    ],
  },
];

const COST_EXAMPLES = [
  {
    task: "Add a new feature (5 files touched, ~30k tokens)",
    opus: "$0.90",
    sonnet: "$0.18",
    haiku: "$0.05",
    recommendation: "Sonnet",
  },
  {
    task: "Debug a memory leak (deep reasoning, ~50k tokens)",
    opus: "$1.50",
    sonnet: "$0.30",
    haiku: "$0.08",
    recommendation: "Opus (Sonnet may miss subtleties)",
  },
  {
    task: "Rename a symbol across 100 files (~200k tokens)",
    opus: "$6.00",
    sonnet: "$1.20",
    haiku: "$0.32",
    recommendation: "Haiku (identical result, 20x cheaper)",
  },
  {
    task: "Write 50 unit tests following an existing pattern (~80k tokens)",
    opus: "$2.40",
    sonnet: "$0.48",
    haiku: "$0.13",
    recommendation: "Sonnet or Haiku",
  },
  {
    task: "Full architecture review of a microservice (~150k tokens)",
    opus: "$4.50",
    sonnet: "$0.90",
    haiku: "$0.24",
    recommendation: "Opus (quality justifies the cost)",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function ModelSelectionPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-model-selection-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <GaugeCircle className="h-4 w-4" />
            Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Which Claude Model Should You Use?
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Opus, Sonnet, or Haiku — each has a sweet spot. Pick right and
            you&apos;ll save 5-20x on bills without sacrificing quality. Pick
            wrong and you&apos;re either slow or bankrupt.
          </p>
        </div>
      </section>

      {/* One rule */}
      <section className="border-b border-border bg-accent/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="border border-accent/30 bg-accent/10 rounded-2xl p-6 sm:p-8">
            <Badge variant="accent" className="mb-3">
              The one rule
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-serif italic">
              &quot;Start with Sonnet. Upgrade to Opus for complex reasoning.
              Drop to Haiku for bulk simple tasks.&quot;
            </h2>
            <p className="text-muted leading-relaxed">
              That single sentence decides the right model for 90% of real-world
              tasks. The rest of this guide is detail, but if you remember only
              one thing, remember this.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6">
            <Badge variant="blue" className="mb-3">
              <Layers className="h-3.5 w-3.5 mr-1" />
              At a glance
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              The three models
            </h2>
            <p className="text-muted">
              Capabilities, speed, and cost side-by-side.
            </p>
          </div>
          <div className="border border-border rounded-2xl bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-left p-4 font-semibold text-foreground">
                      Capability
                    </th>
                    {MODELS.map((m) => (
                      <th
                        key={m.id}
                        className="text-left p-4 font-semibold"
                        style={{ color: m.color }}
                      >
                        <div className="flex items-center gap-2">
                          {m.icon}
                          {m.name.replace("Claude ", "")}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted">Reasoning</td>
                    {MODELS.map((m) => (
                      <td key={m.id} className="p-4 text-foreground">
                        {m.reasoning}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted">Speed</td>
                    {MODELS.map((m) => (
                      <td key={m.id} className="p-4 text-foreground">
                        {m.speed}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted">Input cost</td>
                    {MODELS.map((m) => (
                      <td key={m.id} className="p-4 text-foreground font-mono">
                        {m.inputCost}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 text-muted">Output cost</td>
                    {MODELS.map((m) => (
                      <td key={m.id} className="p-4 text-foreground font-mono">
                        {m.outputCost}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-muted">Best for</td>
                    {MODELS.map((m) => (
                      <td key={m.id} className="p-4 text-foreground italic">
                        {m.tagline.split(".")[0]}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Decision framework */}
      <section className="border-t border-border bg-surface-2/30 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6">
            <Badge variant="purple" className="mb-3">
              <GitBranch className="h-3.5 w-3.5 mr-1" />
              Decision framework
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              The 30-second flowchart
            </h2>
            <p className="text-muted">
              Four questions, one answer. Works every time.
            </p>
          </div>
          <div className="border border-border rounded-2xl bg-surface p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
                Q1
              </div>
              <div className="flex-1">
                <p className="text-foreground font-medium mb-2">
                  Is the task repetitive or purely mechanical?
                </p>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>If YES</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                  <Badge
                    style={{
                      backgroundColor: "#5e9ed615",
                      color: "#5e9ed6",
                      borderColor: "#5e9ed630",
                    }}
                  >
                    Haiku
                  </Badge>
                </div>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
                Q2
              </div>
              <div className="flex-1">
                <p className="text-foreground font-medium mb-2">
                  Does it require deep reasoning across multiple systems?
                </p>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>If YES</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                  <Badge
                    style={{
                      backgroundColor: "#a07ed615",
                      color: "#a07ed6",
                      borderColor: "#a07ed630",
                    }}
                  >
                    Opus
                  </Badge>
                </div>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
                Q3
              </div>
              <div className="flex-1">
                <p className="text-foreground font-medium mb-2">
                  Is it security-, legal-, or payments-critical?
                </p>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>If YES</span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                  <Badge
                    style={{
                      backgroundColor: "#a07ed615",
                      color: "#a07ed6",
                      borderColor: "#a07ed630",
                    }}
                  >
                    Opus
                  </Badge>
                  <span className="text-muted/70">
                    (quality justifies the cost)
                  </span>
                </div>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
                Q4
              </div>
              <div className="flex-1">
                <p className="text-foreground font-medium mb-2">
                  Otherwise — default.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Badge
                    style={{
                      backgroundColor: "#5cb87015",
                      color: "#5cb870",
                      borderColor: "#5cb87030",
                    }}
                  >
                    Sonnet
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Per-model deep dives */}
      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
          {MODELS.map((m) => (
            <section
              key={m.id}
              className="border border-border rounded-2xl bg-surface overflow-hidden"
            >
              <div
                className="border-b border-border p-5 sm:p-6"
                style={{ backgroundColor: `${m.color}08` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${m.color}20`,
                      color: m.color,
                    }}
                  >
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {m.name}
                    </h2>
                    <p className="text-muted italic">{m.tagline}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                {/* When to use */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green" />
                    When to use {m.name.replace("Claude ", "")}
                  </h3>
                  <ul className="space-y-2">
                    {m.useFor.map((use, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted leading-relaxed flex gap-2"
                      >
                        <span className="text-green shrink-0">→</span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Scenarios */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    5 concrete scenarios
                  </h3>
                  <div className="space-y-2">
                    {m.scenarios.map((s, i) => (
                      <div
                        key={i}
                        className="bg-surface-2 border border-border rounded-lg p-3 text-sm text-muted leading-relaxed"
                      >
                        <span
                          className="font-mono font-bold mr-2"
                          style={{ color: m.color }}
                        >
                          {i + 1}.
                        </span>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-world example */}
                <div
                  className="border rounded-lg p-4 flex items-start gap-3"
                  style={{
                    borderColor: `${m.color}40`,
                    backgroundColor: `${m.color}08`,
                  }}
                >
                  <Lightbulb
                    className="h-4 w-4 shrink-0 mt-0.5"
                    style={{ color: m.color }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-foreground mb-1">
                      Real-world example
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {m.realWorldExample}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* Cost comparison */}
      <section className="border-t border-border bg-surface-2/30 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6">
            <Badge variant="orange" className="mb-3">
              <Wallet className="h-3.5 w-3.5 mr-1" />
              Real costs
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Cost comparison (real numbers)
            </h2>
            <p className="text-muted">
              Same task, three prices. Pick wrong and you&apos;re overpaying 5-20x.
            </p>
          </div>
          <div className="border border-border rounded-2xl bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-left p-4 font-semibold text-foreground">
                      Task
                    </th>
                    <th
                      className="text-left p-4 font-semibold"
                      style={{ color: "#a07ed6" }}
                    >
                      Opus
                    </th>
                    <th
                      className="text-left p-4 font-semibold"
                      style={{ color: "#5cb870" }}
                    >
                      Sonnet
                    </th>
                    <th
                      className="text-left p-4 font-semibold"
                      style={{ color: "#5e9ed6" }}
                    >
                      Haiku
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Best pick
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COST_EXAMPLES.map((row) => (
                    <tr
                      key={row.task}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="p-4 text-muted">{row.task}</td>
                      <td className="p-4 text-foreground font-mono">
                        {row.opus}
                      </td>
                      <td className="p-4 text-foreground font-mono">
                        {row.sonnet}
                      </td>
                      <td className="p-4 text-foreground font-mono">
                        {row.haiku}
                      </td>
                      <td className="p-4 text-foreground">
                        {row.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-muted/70 mt-3 italic">
            Prices are estimates based on public pricing as of April 2026. Actual
            costs vary with prompt length, tool use, and thinking budget.
          </p>
        </div>
      </section>

      {/* Switching */}
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6">
            <Badge variant="cyan" className="mb-3">
              <Workflow className="h-3.5 w-3.5 mr-1" />
              Switching
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Switching models mid-session
            </h2>
            <p className="text-muted">
              You don&apos;t have to pick one and suffer. Use{" "}
              <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground text-sm">
                /model
              </code>{" "}
              to swap on the fly.
            </p>
          </div>
          <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Commands
              </span>
              <CopyButton
                text={`/model sonnet   # default
/model opus      # bump up for hard reasoning
/model haiku     # drop down for bulk tasks
/model           # show current model`}
              />
            </div>
            <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
              <code>{`/model sonnet   # default
/model opus      # bump up for hard reasoning
/model haiku     # drop down for bulk tasks
/model           # show current model`}</code>
            </pre>
            <p className="text-sm text-muted leading-relaxed">
              Context persists across switches. You keep all your loaded files,
              decisions, and conversation history. Only the model doing the next
              response changes.
            </p>
          </div>
        </div>
      </section>

      {/* Combining models */}
      <section className="border-t border-border bg-surface-2/30 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6">
            <Badge variant="green" className="mb-3">
              <Layers className="h-3.5 w-3.5 mr-1" />
              Combined workflow
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Combining models in one workflow
            </h2>
            <p className="text-muted">
              The pros don&apos;t use one model — they orchestrate all three.
            </p>
          </div>
          <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
            <p className="text-sm text-muted leading-relaxed">
              Here&apos;s a real workflow for building a new feature end-to-end:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge
                  style={{
                    backgroundColor: "#a07ed615",
                    color: "#a07ed6",
                    borderColor: "#a07ed630",
                  }}
                  className="shrink-0"
                >
                  1. Opus
                </Badge>
                <div className="text-sm text-muted leading-relaxed">
                  <strong className="text-foreground">Plan the architecture.</strong>{" "}
                  <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground/80 text-xs">
                    /model opus
                  </code>{" "}
                  then{" "}
                  <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground/80 text-xs">
                    /plan
                  </code>{" "}
                  — spend 5-10 minutes getting the design right. Output: a plan.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge
                  style={{
                    backgroundColor: "#5cb87015",
                    color: "#5cb870",
                    borderColor: "#5cb87030",
                  }}
                  className="shrink-0"
                >
                  2. Sonnet
                </Badge>
                <div className="text-sm text-muted leading-relaxed">
                  <strong className="text-foreground">
                    Implement the core logic.
                  </strong>{" "}
                  <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground/80 text-xs">
                    /model sonnet
                  </code>{" "}
                  — build the non-trivial parts of the feature, the parts needing
                  judgment. Output: working code.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge
                  style={{
                    backgroundColor: "#5e9ed615",
                    color: "#5e9ed6",
                    borderColor: "#5e9ed630",
                  }}
                  className="shrink-0"
                >
                  3. Haiku
                </Badge>
                <div className="text-sm text-muted leading-relaxed">
                  <strong className="text-foreground">
                    Generate the boilerplate.
                  </strong>{" "}
                  <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground/80 text-xs">
                    /model haiku
                  </code>{" "}
                  — DTOs, form fields, repetitive tests. Cheap and fast. Output:
                  30+ files of plumbing.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge
                  style={{
                    backgroundColor: "#5cb87015",
                    color: "#5cb870",
                    borderColor: "#5cb87030",
                  }}
                  className="shrink-0"
                >
                  4. Sonnet
                </Badge>
                <div className="text-sm text-muted leading-relaxed">
                  <strong className="text-foreground">
                    Review and tie it together.
                  </strong>{" "}
                  <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground/80 text-xs">
                    /review
                  </code>{" "}
                  — catch inconsistencies introduced during the Haiku phase.
                  Output: a PR-ready change.
                </div>
              </div>
            </div>
            <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3 mt-4">
              <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted leading-relaxed">
                <strong className="text-foreground">Savings:</strong> same feature
                on Opus-only costs ~$6. Orchestrated workflow costs ~$1.20. Same
                quality, 5x cheaper. Over a month, that&apos;s the difference
                between a $40 and a $200 bill.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final summary */}
      <section className="border-t border-border py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="border border-accent/30 bg-accent/5 rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3 font-serif italic">
              TL;DR
            </h2>
            <p className="text-lg text-muted leading-relaxed mb-4">
              Sonnet by default. Opus when reasoning is the bottleneck. Haiku
              when speed and volume matter more than nuance.
            </p>
            <p className="text-sm text-muted/70 leading-relaxed">
              Don&apos;t optimize model choice before you&apos;ve optimized your
              prompts. A bad prompt on Opus loses to a good prompt on Sonnet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
