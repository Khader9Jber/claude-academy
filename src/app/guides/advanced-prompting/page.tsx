"use client";

import {
  Sparkles,
  Target,
  BookText,
  ListOrdered,
  Code2,
  UserCircle2,
  FileText,
  Quote,
  Wand2,
  Wrench,
  Brain,
  Clock,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Helpers ──────────────────────────────────────────────────────── */

interface Snippet {
  label: string;
  language?: string;
  body: string;
}

function CodeBlock({ snippet }: { snippet: Snippet }) {
  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-b border-border">
        <span className="text-xs text-muted font-mono">{snippet.label}</span>
        <CopyButton text={snippet.body} />
      </div>
      <pre className="text-xs text-foreground/90 font-mono p-4 overflow-x-auto leading-relaxed">
        <code>{snippet.body}</code>
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

function BeforeAfter({ bad, good }: { bad: string; good: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border border-red/30 bg-red/5 rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-red/10 border-b border-red/30 flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red" />
          <span className="text-xs font-semibold text-red uppercase tracking-wide">
            Before
          </span>
        </div>
        <pre className="text-xs text-foreground/90 font-mono p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">
          <code>{bad}</code>
        </pre>
      </div>
      <div className="border border-green/30 bg-green/5 rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-green/10 border-b border-green/30 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green" />
          <span className="text-xs font-semibold text-green uppercase tracking-wide">
            After
          </span>
        </div>
        <pre className="text-xs text-foreground/90 font-mono p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">
          <code>{good}</code>
        </pre>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function AdvancedPromptingPage() {
  const adaptiveThinking = `from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[
        {
            "role": "user",
            "content": "Design a rate limiter for a multi-tenant API.",
        }
    ],
)

print(response.content[0].text)`;

  const rolePrompt = `from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    system=(
        "You are a senior Python backend engineer specializing in "
        "distributed systems. You prefer async code, strict typing, "
        "and small pure functions. When unsure, you ask for the "
        "exact interface before writing an implementation."
    ),
    messages=[
        {
            "role": "user",
            "content": "Sketch the API for a retry-with-backoff helper.",
        }
    ],
)`;

  const xmlDocs = `<documents>
  <document index="1">
    <source>onboarding-handbook.md</source>
    <document_content>
    ... full document text ...
    </document_content>
  </document>
  <document index="2">
    <source>2025-q4-roadmap.pdf</source>
    <document_content>
    ... full document text ...
    </document_content>
  </document>
</documents>

<instructions>
First, pull out every passage relevant to the question
below. Place each passage in a <quotes> tag with the
source filename.

Then, and only then, answer the question. Ground every
claim in a specific quote from the documents above.
</instructions>

<question>
What is our stated policy on remote work for engineering
roles, and how has it changed between Q3 and Q4?
</question>`;

  const fewShot = `Classify each bug report into one of:
severity=critical | severity=major | severity=minor

<example>
<report>Payment page returns 500 on every attempt. No orders going through.</report>
<classification>severity=critical</classification>
</example>

<example>
<report>Dashboard graph shows yesterday's data until the user refreshes.</report>
<classification>severity=minor</classification>
</example>

<example>
<report>Some OAuth providers fail on mobile Safari, login works on Chrome.</report>
<classification>severity=major</classification>
</example>

<report>Checkout succeeds but the confirmation email is sometimes missing.</report>
<classification>`;

  const parallelTools = `You have access to Read, Grep, and Bash tools. When the
user asks a question that needs information from multiple
independent sources:

- Issue all Read/Grep calls for independent files IN
  PARALLEL in a single tool-use block
- Only serialize calls when the output of one is required
  as input to the next
- Prefer parallel reads over sequential ones; the user
  is waiting`;

  const continuationMigration = `// Deprecated in 4.6 — prefilled assistant turn
const resp = await client.messages.create({
  model: "claude-opus-4-6",
  messages: [
    { role: "user", content: "Continue the story." },
    { role: "assistant", content: "Once upon a time," }, // DEPRECATED
  ],
});

// Migration — move the continuation into the user turn
const resp = await client.messages.create({
  model: "claude-opus-4-6",
  messages: [
    {
      role: "user",
      content:
        "Your previous response was interrupted and ended with " +
        "'Once upon a time,'. Continue from exactly that point.",
    },
  ],
});`;

  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-advanced-prompting-page"
    >
      {/* Hero */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Sparkles className="h-4 w-4" />
            Prompting techniques from Anthropic&apos;s docs
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Advanced Prompting Techniques from Anthropic&apos;s Docs
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Every official technique — clarity, context, examples, XML
            structure, roles, long-context patterns, and the new adaptive
            thinking API on Claude 4.6. Pulled straight from Anthropic&apos;s
            prompting guide.
          </p>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-14">
          {/* Foundation */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Target className="h-3.5 w-3.5 mr-1" />
                Foundation
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Be clear and direct
              </h2>
              <p className="text-muted leading-relaxed">
                Anthropic&apos;s framing: <em>think of Claude as a brilliant
                but new employee who lacks context.</em> Specific output format.
                Sequential steps. If a colleague would be confused by your
                prompt, Claude will be too.
              </p>
            </div>
            <div className="space-y-4">
              <BeforeAfter
                bad={`Summarize this document.`}
                good={`Summarize this document for a busy product manager.

Requirements:
- 5 bullet points, each one sentence
- Lead with the decision, not the context
- Flag any numbers that look stale
- End with one "what I'd ask next" question

Write in a neutral, professional tone.`}
              />
              <TipBox kind="tip" title="The golden rule">
                Before you send a prompt, read it as if you were a new hire on
                your first day. If you&apos;d need to ask a clarifying
                question, add the answer to the prompt.
              </TipBox>
            </div>
          </section>

          {/* Context */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <BookText className="h-3.5 w-3.5 mr-1" />
                Context
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Add context to improve performance
              </h2>
              <p className="text-muted leading-relaxed">
                Don&apos;t just tell Claude what to do — tell it <em>why</em>.
                A reason turns a rule Claude might fumble into a constraint it
                can reason about.
              </p>
            </div>
            <div className="space-y-4">
              <BeforeAfter
                bad={`NEVER use ellipses in your response.`}
                good={`Your response will be read aloud by a text-to-speech
engine, so never use ellipses — the TTS can't pronounce
them and they come out as awkward silences.`}
              />
              <TipBox kind="info" title="Why the reason matters">
                With no reason, Claude treats the rule as one of a thousand
                arbitrary preferences and sometimes drifts. With a reason,
                Claude generalizes — avoiding not just ellipses but any
                symbol a TTS would stumble on.
              </TipBox>
            </div>
          </section>

          {/* Few-shot */}
          <section>
            <div className="mb-6">
              <Badge variant="green" className="mb-3">
                <ListOrdered className="h-3.5 w-3.5 mr-1" />
                Examples
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Use examples effectively (few-shot / multishot)
              </h2>
              <p className="text-muted leading-relaxed">
                Three to five examples typically outperforms any amount of
                abstract instruction. Wrap them in <code>&lt;example&gt;</code>
                {" "}tags. Make them relevant, diverse, and structurally
                identical to what you want back.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock
                snippet={{
                  label: "Few-shot classification prompt",
                  body: fewShot,
                }}
              />
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="border border-border rounded-xl bg-surface p-4">
                  <div className="text-xs uppercase tracking-wide text-muted mb-1">
                    Relevant
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Examples should mirror the real inputs — same domain,
                    same length, same vocabulary.
                  </p>
                </div>
                <div className="border border-border rounded-xl bg-surface p-4">
                  <div className="text-xs uppercase tracking-wide text-muted mb-1">
                    Diverse
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Cover the edges — not just easy cases. Three near-duplicate
                    examples teach nothing the first one didn&apos;t.
                  </p>
                </div>
                <div className="border border-border rounded-xl bg-surface p-4">
                  <div className="text-xs uppercase tracking-wide text-muted mb-1">
                    Structured
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Use XML tags to separate input from output. Claude
                    mimics whatever shape you show.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* XML tags */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Code2 className="h-3.5 w-3.5 mr-1" />
                Structure
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Structure prompts with XML tags
              </h2>
              <p className="text-muted leading-relaxed">
                Anthropic&apos;s docs recommend XML over Markdown for anything
                complex. Tags like{" "}
                <code className="bg-surface-2 px-1 rounded">
                  &lt;instructions&gt;
                </code>
                ,{" "}
                <code className="bg-surface-2 px-1 rounded">
                  &lt;context&gt;
                </code>
                , and{" "}
                <code className="bg-surface-2 px-1 rounded">&lt;input&gt;</code>{" "}
                separate concerns cleanly and nest naturally.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock
                snippet={{
                  label: "XML-structured prompt",
                  body: `<instructions>
You are reviewing the pull request below. Focus on
correctness, security, and test coverage. Ignore style
unless it obscures meaning.

Return your review in a <review> tag with:
- <summary> (one paragraph)
- <findings> (list, each <finding> with severity + line ref)
- <questions> (things that need the author's input)
</instructions>

<context>
Our project uses TypeScript strict mode, ESLint airbnb
config, and Vitest for tests. All database access must
go through src/lib/db.ts.
</context>

<input>
<pr_title>Add user search endpoint</pr_title>
<pr_diff>
...unified diff here...
</pr_diff>
</input>`,
                }}
              />
              <TipBox kind="tip" title="Nest naturally">
                Wrap a list of documents in{" "}
                <code className="bg-surface-2 px-1 rounded">
                  &lt;documents&gt;
                </code>
                , each one in{" "}
                <code className="bg-surface-2 px-1 rounded">
                  &lt;document index=&quot;n&quot;&gt;
                </code>{" "}
                with{" "}
                <code className="bg-surface-2 px-1 rounded">
                  &lt;document_content&gt;
                </code>{" "}
                and{" "}
                <code className="bg-surface-2 px-1 rounded">&lt;source&gt;</code>
                {" "}
                children. Claude picks up the structure immediately.
              </TipBox>
            </div>
          </section>

          {/* Role */}
          <section>
            <div className="mb-6">
              <Badge variant="cyan" className="mb-3">
                <UserCircle2 className="h-3.5 w-3.5 mr-1" />
                Role
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Give Claude a role
              </h2>
              <p className="text-muted leading-relaxed">
                The system prompt is Claude&apos;s standing orders for the
                conversation. A well-chosen role sharpens defaults you&apos;d
                otherwise have to repeat in every message.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock
                snippet={{
                  label: "System prompt with a specific role",
                  language: "python",
                  body: rolePrompt,
                }}
              />
              <TipBox kind="info" title="What to include">
                Specialty (&quot;distributed systems&quot;), preferences
                (&quot;async, strict typing&quot;), and decision rules
                (&quot;ask for the interface first&quot;). Skip fluff like
                &quot;you are helpful&quot; — Claude already is.
              </TipBox>
            </div>
          </section>

          {/* Long context */}
          <section>
            <div className="mb-6">
              <Badge variant="orange" className="mb-3">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Long context (20k+ tokens)
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Long context prompting
              </h2>
              <p className="text-muted leading-relaxed">
                Three rules compound into the biggest quality wins in
                Anthropic&apos;s docs: <strong>put longform data at the
                top</strong>, <strong>structure with XML</strong>, and{" "}
                <strong>ground responses in quotes</strong>.
              </p>
            </div>
            <div className="space-y-5">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">
                      Data at the top
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Place long documents <em>above</em> the query,
                    instructions, and examples. Anthropic reports up to{" "}
                    <span className="text-foreground font-semibold">
                      30% quality improvement
                    </span>{" "}
                    on complex multi-document inputs.
                  </p>
                </div>
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">
                      XML structure
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Wrap each document in{" "}
                    <code className="bg-surface-2 px-1 rounded">
                      &lt;document&gt;
                    </code>{" "}
                    tags with{" "}
                    <code className="bg-surface-2 px-1 rounded">
                      &lt;document_content&gt;
                    </code>{" "}
                    and{" "}
                    <code className="bg-surface-2 px-1 rounded">
                      &lt;source&gt;
                    </code>
                    .
                  </p>
                </div>
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Quote className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">
                      Ground in quotes
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Ask Claude to pull relevant passages into{" "}
                    <code className="bg-surface-2 px-1 rounded">
                      &lt;quotes&gt;
                    </code>{" "}
                    tags <em>before</em> answering. Cuts hallucination
                    substantially.
                  </p>
                </div>
              </div>

              <CodeBlock
                snippet={{
                  label: "Full long-context template",
                  body: xmlDocs,
                }}
              />

              <TipBox kind="tip" title="Order matters more than you'd think">
                If you only change one thing about a long-context prompt,
                move the documents above the question. Instructions after,
                data before — that&apos;s the shape that wins.
              </TipBox>
            </div>
          </section>

          {/* Output formatting */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <Wand2 className="h-3.5 w-3.5 mr-1" />
                Output formatting
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Control output formatting
              </h2>
              <p className="text-muted leading-relaxed">
                Four habits from the official guide: tell Claude what to do
                rather than what <em>not</em> to do, use XML format
                indicators, match your prompt style to the desired output,
                and give detailed formatting instructions when needed.
              </p>
            </div>
            <div className="space-y-4">
              <BeforeAfter
                bad={`Don't use bullet points.
Don't be verbose.
Avoid hedging language.`}
                good={`Write in <smoothly_flowing_prose_paragraphs>.
Each paragraph should be 2–4 sentences.
Use concrete, specific claims — no "it depends" or
"various factors".`}
              />
              <TipBox kind="info" title="Style as signal">
                A formal, structured prompt produces formal, structured
                output. A chatty prompt produces a chatty answer. If you
                want Markdown, use Markdown in your prompt. If you want
                prose, write in prose.
              </TipBox>
            </div>
          </section>

          {/* Tool usage */}
          <section>
            <div className="mb-6">
              <Badge variant="blue" className="mb-3">
                <Wrench className="h-3.5 w-3.5 mr-1" />
                Tools
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tool usage and parallel calls
              </h2>
              <p className="text-muted leading-relaxed">
                Two practical habits: be explicit about acting (not
                suggesting), and tell Claude to run independent tools in
                parallel when they don&apos;t depend on each other.
              </p>
            </div>
            <div className="space-y-4">
              <BeforeAfter
                bad={`Can you look at the codebase and suggest some improvements
to the auth module?`}
                good={`Make the following edits to src/lib/auth.ts:

1. Change the session cookie to SameSite=Strict
2. Add a 5-minute skew tolerance to JWT verification
3. Write a Vitest test for each change in auth.test.ts

Run the tests after to confirm they pass.`}
              />
              <CodeBlock
                snippet={{
                  label: "System-prompt fragment for parallel tool calls",
                  body: parallelTools,
                }}
              />
              <TipBox kind="tip" title="Parallel by default">
                Any time you ask Claude to gather information from multiple
                independent places — files, endpoints, databases — spell
                out that you want parallel calls. It&apos;s a latency win
                on every turn.
              </TipBox>
            </div>
          </section>

          {/* Adaptive thinking */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Brain className="h-3.5 w-3.5 mr-1" />
                Adaptive thinking (Claude 4.6)
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Use adaptive thinking — not extended thinking with budgets
              </h2>
              <p className="text-muted leading-relaxed">
                Claude 4.6 ships <strong>adaptive thinking</strong>: the model
                decides how much to think based on the request. You no longer
                set{" "}
                <code className="bg-surface-2 px-1 rounded">budget_tokens</code>
                {" "}directly — you pass an{" "}
                <code className="bg-surface-2 px-1 rounded">effort</code>{" "}
                signal (<code>low</code>, <code>medium</code>,{" "}
                <code>high</code>, <code>max</code>) and adaptive thinking
                handles the rest.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock
                snippet={{
                  label: "Adaptive thinking — Python SDK",
                  language: "python",
                  body: adaptiveThinking,
                }}
              />

              <div className="overflow-x-auto border border-border rounded-xl bg-surface">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2 text-left">
                    <tr>
                      <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                        effort
                      </th>
                      <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                        When to use
                      </th>
                      <th className="p-4 text-xs uppercase tracking-wide text-muted font-medium">
                        Trade-off
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="align-top">
                      <td className="p-4 font-mono text-foreground">low</td>
                      <td className="p-4 text-muted">
                        Classification, extraction, simple formatting. Fast
                        answers from well-scoped prompts.
                      </td>
                      <td className="p-4 text-muted">
                        Lowest latency, cheapest, may miss nuance.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-4 font-mono text-foreground">medium</td>
                      <td className="p-4 text-muted">
                        General coding, drafting, summarization,
                        conversational workflows. Sensible default.
                      </td>
                      <td className="p-4 text-muted">
                        Balanced. Good latency-to-quality ratio for most
                        tasks.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-4 font-mono text-foreground">high</td>
                      <td className="p-4 text-muted">
                        Multi-step reasoning, architectural design, debugging
                        that needs deep inspection.
                      </td>
                      <td className="p-4 text-muted">
                        Slower, more tokens — but noticeably better on
                        hard problems.
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-4 font-mono text-foreground">max</td>
                      <td className="p-4 text-muted">
                        The hardest problems — research, long derivations,
                        tasks where quality dominates cost.
                      </td>
                      <td className="p-4 text-muted">
                        Highest latency and cost. Reserve for tasks that
                        justify it.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <TipBox kind="warn" title="Don't use budget_tokens on 4.6">
                Extended thinking with{" "}
                <code className="bg-surface-2 px-1 rounded">budget_tokens</code>{" "}
                was the 3.7 / 4.0 pattern. On 4.6, adaptive thinking is the
                default and the model chooses its own depth. Pair{" "}
                <code className="bg-surface-2 px-1 rounded">
                  thinking: {"{ type: 'adaptive' }"}
                </code>{" "}
                with an{" "}
                <code className="bg-surface-2 px-1 rounded">
                  output_config.effort
                </code>{" "}
                level and let it work.
              </TipBox>
            </div>
          </section>

          {/* Prefilled deprecation */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Migration
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Migrating away from prefilled responses
              </h2>
              <p className="text-muted leading-relaxed">
                Prefilled responses on the last assistant turn are{" "}
                <strong>deprecated starting with Claude 4.6 models</strong>.
                Three migration paths cover every previous use case.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="text-xs uppercase tracking-wide text-muted mb-2">
                    Controlling format
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Use Structured Outputs
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Previously prefilling{" "}
                    <code className="bg-surface-2 px-1 rounded">{"{"}</code> to
                    force JSON? Switch to Anthropic&apos;s Structured Outputs
                    feature — schema in, guaranteed-shape response out.
                  </p>
                </div>
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="text-xs uppercase tracking-wide text-muted mb-2">
                    Skipping preambles
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Ask directly in the system prompt
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Add a line: <em>&quot;Respond directly without
                    preamble&quot;</em>. Replaces the old trick of
                    prefilling a single character to suppress &quot;Sure,
                    here&apos;s...&quot;.
                  </p>
                </div>
                <div className="border border-border rounded-xl bg-surface p-5">
                  <div className="text-xs uppercase tracking-wide text-muted mb-2">
                    Continuations
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Move into the user turn
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Instead of resuming a truncated assistant message,
                    instruct: <em>&quot;Your previous response ended with
                    [X]. Continue from exactly that point.&quot;</em>
                  </p>
                </div>
              </div>
              <CodeBlock
                snippet={{
                  label: "TypeScript — before and after",
                  body: continuationMigration,
                }}
              />
              <TipBox kind="warn" title="Silently deprecated, loudly expensive">
                Old prefill calls may still return responses on 4.6, but
                behavior is undefined and can change. Migrate now — the
                three replacement patterns are all simpler than the
                prefill trick they replace.
              </TipBox>
            </div>
          </section>

          {/* Avoid hallucinations */}
          <section>
            <div className="mb-6">
              <Badge variant="green" className="mb-3">
                <Quote className="h-3.5 w-3.5 mr-1" />
                Grounding
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Avoid hallucinations
              </h2>
              <p className="text-muted leading-relaxed">
                The most effective anti-hallucination instruction in the
                official guide is also the simplest: forbid speculation about
                unopened code.
              </p>
            </div>
            <div className="space-y-4">
              <CodeBlock
                snippet={{
                  label: "Anti-hallucination system-prompt fragment",
                  body: `Never speculate about code you have not opened. If the
user references a specific file, you MUST read the file
before answering. If a file does not exist, say so plainly
instead of guessing what it might contain.

When summarizing documents, quote the exact passages you
relied on inside <quotes> tags before writing the summary.`,
                }}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <TipBox kind="tip" title="Quote-then-answer">
                  Forcing a{" "}
                  <code className="bg-surface-2 px-1 rounded">
                    &lt;quotes&gt;
                  </code>{" "}
                  block before the answer gives you an audit trail — you
                  can see whether the source actually supported the claim.
                </TipBox>
                <TipBox kind="tip" title={`"I don't know" is a valid answer`}>
                  Explicitly tell Claude it&apos;s allowed to say &quot;not
                  in the provided context&quot;. Without that permission,
                  Claude fills gaps with plausible-sounding guesses.
                </TipBox>
              </div>
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
                <Layers className="h-5 w-5 text-accent shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-foreground font-serif italic">
                  The whole thing in one paragraph
                </h2>
              </div>
              <p className="text-muted leading-relaxed">
                Tell Claude exactly what you want and why. Show examples of
                the shape you want back. Put long documents at the top and
                wrap them in XML. Ask for quotes before conclusions.
                Structure output by describing it positively, not by listing
                bans. On 4.6, use adaptive thinking with an effort level,
                migrate off prefilled responses, and lean on Structured
                Outputs for format guarantees. Everything else is a
                variation on those themes.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
