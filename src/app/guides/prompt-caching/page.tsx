"use client";

import {
  Coins,
  Target,
  Calculator,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Zap,
  TrendingDown,
  GitFork,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Data ───────────────────────────────────────────────────────────── */

const PRICING = [
  {
    label: "Base input token",
    multiplier: "1.0×",
    color: "text-foreground",
    note: "Standard price — what you pay without caching.",
  },
  {
    label: "Cache write (5-min TTL)",
    multiplier: "1.25×",
    color: "text-orange",
    note: "25% premium to write the cache. Pays off after 1 read.",
  },
  {
    label: "Cache write (1-hour TTL)",
    multiplier: "2.0×",
    color: "text-red",
    note: "2× premium for the longer TTL. Pays off after 2 reads.",
  },
  {
    label: "Cache read",
    multiplier: "0.1×",
    color: "text-green",
    note: "90% discount. Same price for 5-min and 1-hour reads.",
  },
];

const CACHE_THIS = [
  {
    title: "System prompts",
    body: "Your 10k-token role/behavior brief. Same for every user turn — perfect cache target.",
  },
  {
    title: "Tool definitions",
    body: "A full JSON schema for your tools is often 1-2k tokens and never changes during a conversation.",
  },
  {
    title: "Documents you're chatting over",
    body: "The 50-page PDF or the codebase dump you uploaded once. Cache it; reuse for 20 follow-up questions.",
  },
  {
    title: "Few-shot examples",
    body: "Your 5 example inputs/outputs. Static, reusable, great cache candidate.",
  },
  {
    title: "Long instructions or style guides",
    body: "Anything that reads like a constitution — company voice, legal disclaimers, formatting rules.",
  },
];

const DONT_CACHE = [
  {
    title: "The user's current message",
    body: "By definition different every turn. Put it LAST, uncached. The prefix up to it is what gets cached.",
  },
  {
    title: "Timestamps and current time",
    body: "A single 'Current time: 14:32:07' byte change breaks the prefix. Either don't inject it, or inject it AFTER cached content.",
  },
  {
    title: "Unique IDs in every call",
    body: "Request IDs, trace IDs, user session tokens. Same problem — they destroy the prefix match.",
  },
  {
    title: "Short prompts",
    body: "Below the minimum cacheable size, the system skips caching entirely (no error, just no savings).",
  },
  {
    title: "One-off calls",
    body: "If you'll only make this exact request once, the 25% write premium is wasted. Cache pays off on REPEAT reads.",
  },
];

const PLACEMENT_RULES = [
  {
    title: "Static first",
    body: "System prompt, tool definitions, long documents — all at the top. These are your cache prefix.",
  },
  {
    title: "Dynamic last",
    body: "User message, recent conversation history — at the bottom. These change turn to turn.",
  },
  {
    title: "Put the cache_control at the boundary",
    body: "Mark the last block of the STATIC section with cache_control. Everything before it gets cached; everything after is dynamic.",
  },
  {
    title: "Don't intersperse",
    body: "If you have [static A, dynamic X, static B], you can't cache static B — the prefix match breaks at X.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function PromptCachingPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-prompt-caching-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Coins className="h-4 w-4" />
            API Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Prompt Caching: Cut Your Claude API Costs by 90%
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            The exact pricing math, when caching actually saves money, when it
            doesn&apos;t, and the single rule that makes the difference — static
            first, dynamic last.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                The pitch
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                Cached prompts can reduce input token costs by up to{" "}
                <strong className="text-foreground">90%</strong> and cut response
                times by up to <strong className="text-foreground">85%</strong>{" "}
                for long prompts. If you&apos;re running a chatbot over a fixed
                corpus, an agent with a big system prompt, or any RAG pattern
                that reuses context, caching is free money.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Turned on correctly, your bill drops overnight and your
                latencies improve at the same time. Turned on incorrectly, you
                pay a 25% premium for nothing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* Pricing */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Calculator className="h-3.5 w-3.5 mr-1" />
                Economics
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                The exact pricing math
              </h2>
              <p className="text-muted">
                All multipliers are relative to base input token price on the
                same model. Output tokens are unaffected.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Token class
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Price vs base
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.map((p) => (
                    <tr
                      key={p.label}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 text-muted">{p.label}</td>
                      <td
                        className={cn(
                          "px-4 py-3 font-mono font-semibold",
                          p.color
                        )}
                      >
                        {p.multiplier}
                      </td>
                      <td className="px-4 py-3 text-muted">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 grid md:grid-cols-2 gap-4">
              <div className="border border-green/30 bg-green/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green" />
                  <h3 className="text-sm font-semibold text-foreground">
                    5-minute TTL breakeven
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Pays off after <strong className="text-foreground">1
                  read</strong>. If the cached prefix is used even once more
                  within 5 minutes, you&apos;re already saving money.
                </p>
              </div>
              <div className="border border-blue/30 bg-blue/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue" />
                  <h3 className="text-sm font-semibold text-foreground">
                    1-hour TTL breakeven
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Pays off after <strong className="text-foreground">2
                  reads</strong>. Use when your traffic is bursty or
                  predictable only over longer windows.
                </p>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Mechanics
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                How caching actually works
              </h2>
              <p className="text-muted">
                Caching is <em>prefix-based</em>. Understand this one word and
                everything else falls into place.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-4">
              <p className="text-sm text-muted leading-relaxed">
                Claude&apos;s cache keys on the{" "}
                <strong className="text-foreground">
                  hash of the prefix of your prompt
                </strong>{" "}
                up to a marked breakpoint. On your first request, Claude
                computes the hash, stores the intermediate state of the model
                after processing that prefix, and charges you a 25% write
                premium. On subsequent requests with the{" "}
                <em>exact same prefix</em>, Claude recognizes the hash, loads
                the saved state instantly, and only processes the new tokens —
                charging you 10% of normal rates for the reused prefix.
              </p>
              <pre className="text-xs text-foreground/90 font-mono bg-surface-2 p-4 rounded-lg overflow-x-auto leading-relaxed">
                <code>{`Request 1:  [SYSTEM PROMPT (10k)] [TOOLS (2k)] [CACHE BREAKPOINT] [USER: "Hi"]
            └────────── hashed & cached ──────────┘
            Cost: 12k × 1.25  +  1 × 1.0  =  15k tokens worth

Request 2:  [SYSTEM PROMPT (10k)] [TOOLS (2k)] [CACHE BREAKPOINT] [USER: "Summarize"]
            └──── cache HIT, load state ──────────┘
            Cost: 12k × 0.1   +  1 × 1.0  =  1.2k tokens worth

                                                        Saved: 13.8k tokens`}</code>
              </pre>
              <div className="border border-red/30 bg-red/5 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    One character changes the prefix → cache miss
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Change the system prompt by one word, inject a timestamp at
                    the top, or reorder your tool definitions — the hash
                    changes and you pay the 25% write premium all over again.
                    Keep prefixes bit-for-bit stable.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Two approaches */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <GitFork className="h-3.5 w-3.5 mr-1" />
                Approaches
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Automatic vs explicit caching
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Automatic (one breakpoint)
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Put a single{" "}
                  <code className="bg-surface-2 px-1 rounded">cache_control</code>{" "}
                  at the top level. The system applies the breakpoint to the
                  last cacheable block and <em>moves it forward</em> as the
                  conversation grows. Simple, near-optimal for chat.
                </p>
                <ul className="text-xs text-muted space-y-1">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                    <span>Best for chatbots and long-running assistants</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                    <span>Minimal code change</span>
                  </li>
                </ul>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Explicit (per-block breakpoints)
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Place{" "}
                  <code className="bg-surface-2 px-1 rounded">cache_control</code>{" "}
                  on individual content blocks. Gives you fine-grained control
                  — cache the system prompt separately from the document, etc.
                </p>
                <ul className="text-xs text-muted space-y-1">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                    <span>Best for RAG over changing document sets</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                    <span>Granular control over what gets cached</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cache this / Don't */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="border border-green/30 bg-green/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green" />
                Cache this
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                {CACHE_THIS.map((c) => (
                  <li key={c.title} className="flex gap-2">
                    <span className="text-green shrink-0 mt-0.5">✓</span>
                    <span>
                      <strong className="text-foreground">{c.title}</strong> —{" "}
                      {c.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-red/30 bg-red/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red" />
                Don&apos;t cache this
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                {DONT_CACHE.map((d) => (
                  <li key={d.title} className="flex gap-2">
                    <span className="text-red shrink-0 mt-0.5">✗</span>
                    <span>
                      <strong className="text-foreground">{d.title}</strong> —{" "}
                      {d.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Placement rules */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Structure
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                The one structural rule: static first, dynamic last
              </h2>
              <p className="text-muted">
                Get this right and caching just works. Get it wrong and no
                amount of tweaking helps.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {PLACEMENT_RULES.map((r, i) => (
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
          </section>

          {/* Code example */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Zap className="h-3.5 w-3.5 mr-1" />
                Code
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Real example: Python SDK
              </h2>
              <p className="text-muted">
                The smallest program that demonstrates correct caching. Copy,
                run, watch your bill drop.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-border">
                <span className="text-xs text-muted font-mono">
                  caching_example.py
                </span>
                <CopyButton
                  text={`from anthropic import Anthropic

client = Anthropic()

LONG_SYSTEM_PROMPT = open("system_prompt.md").read()   # e.g. 10,000 tokens

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LONG_SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "Summarize the latest quarterly report."}
    ]
)

# After the first call, the same system prompt will be served from cache
# for the next 5 minutes at 10% of the input price.
print(response.usage)
# UsageBlock(
#   input_tokens=12,
#   cache_creation_input_tokens=10_000,  # first call pays 1.25x on these
#   cache_read_input_tokens=0,           # ...then 0.1x on subsequent calls
#   output_tokens=342
# )`}
                />
              </div>
              <pre className="text-xs text-foreground/90 font-mono p-4 overflow-x-auto leading-relaxed">
                <code>{`from anthropic import Anthropic

client = Anthropic()

LONG_SYSTEM_PROMPT = open("system_prompt.md").read()   # e.g. 10,000 tokens

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LONG_SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "Summarize the latest quarterly report."}
    ]
)

# After the first call, the same system prompt will be served from cache
# for the next 5 minutes at 10% of the input price.
print(response.usage)
# UsageBlock(
#   input_tokens=12,
#   cache_creation_input_tokens=10_000,  # first call pays 1.25x on these
#   cache_read_input_tokens=0,           # ...then 0.1x on subsequent calls
#   output_tokens=342
# )`}</code>
              </pre>
            </div>
            <div className="mt-5 border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-foreground mb-1">
                  Watch the usage object
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Claude returns{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    cache_creation_input_tokens
                  </code>{" "}
                  on the first call, and{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    cache_read_input_tokens
                  </code>{" "}
                  on every hit after that. If you&apos;re not seeing cache
                  reads grow, your prefix is drifting — log the first 1k
                  characters of your prompt and diff them across calls.
                </p>
              </div>
            </div>
          </section>

          {/* Cost comparison table */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
                Savings
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Cost comparison: 100k-token system prompt, 1000 requests
              </h2>
              <p className="text-muted">
                Token math only — actual $ depends on model. The savings ratio
                holds regardless.
              </p>
            </div>
            <div className="border border-border rounded-2xl bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Scenario
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">
                      Billable input tokens
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">
                      vs no cache
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 text-muted">
                      <strong className="text-foreground">No caching</strong>
                      <div className="text-xs">
                        100k × 1.0 × 1000 requests
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      100,000,000
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted">
                      —
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 text-muted">
                      <strong className="text-foreground">
                        5-min cache, 1 write + 999 reads
                      </strong>
                      <div className="text-xs">
                        100k × 1.25 + 100k × 0.1 × 999
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green">
                      10,025,000
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green font-semibold">
                      −89.98%
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 text-muted">
                      <strong className="text-foreground">
                        5-min cache, 100 writes + 900 reads
                      </strong>
                      <div className="text-xs">
                        Cache expires every ~10 requests (bursty traffic)
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green">
                      21,500,000
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green font-semibold">
                      −78.5%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted">
                      <strong className="text-foreground">
                        1-hour cache, 10 writes + 990 reads
                      </strong>
                      <div className="text-xs">
                        Steady hourly traffic
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green">
                      11,900,000
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green font-semibold">
                      −88.1%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-3 italic">
              Even pessimistic scenarios save 70-80%. The only way to lose is a
              broken prefix (writes every request).
            </p>
          </section>

          {/* When caching hurts */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Anti-patterns
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When caching actually costs you money
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Infrequent traffic
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Requests spaced more than 5 minutes apart never hit the cache.
                  You pay 25% extra on every request and save nothing. Either
                  bump to 1-hour TTL or don&apos;t cache at all.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Short prompts
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Below the minimum cacheable size, the system skips caching —
                  no write premium charged, but no savings either. Don&apos;t
                  bother adding cache_control to tiny prompts.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Constantly changing prefix
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Injecting the current timestamp or a random request ID at the
                  top means every request is a cache write. You pay the premium
                  forever, never read. Move dynamic content to the END.
                </p>
              </div>
              <div className="border border-border rounded-xl bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Over-fragmented breakpoints
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Too many explicit breakpoints means too many tiny caches, each
                  paying its own write premium. If in doubt, use automatic
                  caching with a single top-level breakpoint.
                </p>
              </div>
            </div>
          </section>

          {/* TTL decision */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Decision
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                5-minute vs 1-hour TTL
              </h2>
            </div>
            <div className="border border-border rounded-2xl bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Use the 5-minute TTL when...
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Use the 1-hour TTL when...
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 text-muted">
                      Traffic is continuous (chatbot, live agent)
                    </td>
                    <td className="px-4 py-3 text-muted">
                      Traffic is bursty but predictable (batch jobs hourly)
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 text-muted">
                      You&apos;ll hit the cache within a minute
                    </td>
                    <td className="px-4 py-3 text-muted">
                      Multi-turn conversations span dozens of minutes
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted">
                      Cheap to re-warm the cache
                    </td>
                    <td className="px-4 py-3 text-muted">
                      System prompt is huge and expensive to re-write
                    </td>
                  </tr>
                </tbody>
              </table>
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
                Static first, dynamic last, one{" "}
                <code className="bg-surface-2 px-1.5 py-0.5 rounded text-foreground">
                  cache_control
                </code>{" "}
                at the boundary. If your system prompt is over a few thousand
                tokens and you make more than one call within 5 minutes, turn
                caching on today and watch your bill fall off a cliff.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
