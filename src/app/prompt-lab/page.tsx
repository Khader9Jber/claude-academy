"use client";

import { useState, useMemo } from "react";
import {
  FlaskConical,
  Layers,
  Copy,
  Check,
  Code2,
  PenLine,
  BarChart3,
  Bug,
  Terminal,
  FileText,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PromptPlayground } from "@/components/interactive/prompt-playground";
import { CopyButton } from "@/components/content/copy-button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TemplateCategory = "Coding" | "Writing" | "Analysis" | "Debugging" | "Claude Code";

interface PromptTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  preview: string;
  prompt: string;
}

interface BeforeAfter {
  id: string;
  topic: string;
  bad: string;
  good: string;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Category color mapping
// ---------------------------------------------------------------------------

const categoryBadgeVariant: Record<TemplateCategory, "blue" | "purple" | "green" | "red" | "accent"> = {
  Coding: "blue",
  Writing: "purple",
  Analysis: "green",
  Debugging: "red",
  "Claude Code": "accent",
};

const categoryIcons: Record<TemplateCategory, React.ReactNode> = {
  Coding: <Code2 className="h-4 w-4" />,
  Writing: <PenLine className="h-4 w-4" />,
  Analysis: <BarChart3 className="h-4 w-4" />,
  Debugging: <Bug className="h-4 w-4" />,
  "Claude Code": <Terminal className="h-4 w-4" />,
};

// ---------------------------------------------------------------------------
// Template data (20+ templates)
// ---------------------------------------------------------------------------

const TEMPLATES: PromptTemplate[] = [
  {
    id: "debug-error",
    title: "Debug This Error",
    category: "Debugging",
    preview: "Identify root cause, explain why it happens, and provide the fix.",
    prompt: `You are an expert debugger. I'm getting this error:

[paste error message here]

The relevant code is:

[paste code here]

Identify the root cause, explain why it happens, and provide the fix. Show the corrected code with comments highlighting what changed.`,
  },
  {
    id: "code-review",
    title: "Code Review",
    category: "Coding",
    preview: "Review code for security, performance, style, and edge cases.",
    prompt: `Review this code for:
1) Security vulnerabilities
2) Performance issues
3) Code style and best practices
4) Edge cases and error handling

Be specific about line numbers and suggest fixes for each issue found. Rate severity as low/medium/high.

\`\`\`
[paste code here]
\`\`\``,
  },
  {
    id: "write-tests",
    title: "Write Tests",
    category: "Coding",
    preview: "Write comprehensive tests covering happy path, edge cases, and errors.",
    prompt: `Write comprehensive tests for this function using [framework, e.g. Jest/pytest/Go testing].

Cover:
- Happy path (normal inputs)
- Edge cases (empty, null, boundary values)
- Error handling (invalid inputs, exceptions)
- Boundary values (min/max, overflow)

Use descriptive test names that explain the scenario. Group related tests together.

\`\`\`
[paste function here]
\`\`\``,
  },
  {
    id: "explain-code",
    title: "Explain This Code",
    category: "Coding",
    preview: "Break down complex code with line-by-line explanation.",
    prompt: `You are a patient, expert programming teacher. Explain the following code to someone who understands basic programming but is unfamiliar with this specific pattern/library.

Break it down:
1. What it does at a high level (2-3 sentences)
2. Line-by-line walkthrough of the important parts
3. Why this approach was chosen over alternatives
4. Any gotchas or common mistakes related to this pattern

\`\`\`
[paste code here]
\`\`\``,
  },
  {
    id: "refactor",
    title: "Refactor for Readability",
    category: "Coding",
    preview: "Improve code structure while maintaining functionality.",
    prompt: `Refactor this code to improve readability and maintainability. The refactored code must maintain identical functionality.

Guidelines:
- Improve variable/function names to be self-documenting
- Extract magic numbers into named constants
- Break long functions into smaller, focused ones
- Add appropriate error handling
- Follow [language] conventions and idioms

Show the refactored code, then list each change and why it improves the code.

\`\`\`
[paste code here]
\`\`\``,
  },
  {
    id: "api-design",
    title: "Design a REST API",
    category: "Coding",
    preview: "Design RESTful API endpoints with request/response schemas.",
    prompt: `Design a RESTful API for [describe the feature/resource].

For each endpoint, provide:
- HTTP method and path
- Request body/params (with types)
- Response body (with types)
- Status codes and error responses
- Authentication requirements

Follow REST conventions. Use consistent naming. Include pagination for list endpoints. Provide a summary table at the end.`,
  },
  {
    id: "blog-post",
    title: "Write a Blog Post",
    category: "Writing",
    preview: "Structured blog post with hook, sections, and actionable conclusion.",
    prompt: `Write a 1200-word blog post about [topic] for [target audience, e.g. junior developers].

Tone: Conversational but authoritative. Use "you" language.

Structure:
- Hook: Start with a relatable problem or surprising stat
- 3-4 sections with descriptive subheadings (not generic like "Introduction")
- Include at least 2 code examples or concrete illustrations
- Actionable conclusion with 3 clear next steps

Avoid: jargon without explanation, filler phrases, overly formal language.`,
  },
  {
    id: "technical-docs",
    title: "Write Technical Documentation",
    category: "Writing",
    preview: "Clear technical docs with examples, parameters, and edge cases.",
    prompt: `Write technical documentation for [function/API/feature].

Include:
1. **Overview** — What it does in 1-2 sentences
2. **Installation/Setup** — Prerequisites and setup steps
3. **API Reference** — Parameters, return values, types
4. **Usage Examples** — At least 3 examples from simple to complex
5. **Common Pitfalls** — Mistakes developers often make
6. **FAQ** — 3-5 frequently asked questions

Use code blocks with syntax highlighting. Keep language clear and direct.`,
  },
  {
    id: "email-draft",
    title: "Draft a Professional Email",
    category: "Writing",
    preview: "Craft a clear, professional email with the right tone.",
    prompt: `Draft a professional email for this situation:

Purpose: [what you want to achieve]
Recipient: [who they are, your relationship]
Tone: [formal/friendly/urgent]
Key points to include: [list them]

Keep it concise (under 200 words). Use a clear subject line. End with a specific call to action. Provide 2 variations: one more formal, one more casual.`,
  },
  {
    id: "commit-messages",
    title: "Write Commit Messages",
    category: "Writing",
    preview: "Generate conventional commit messages from a diff.",
    prompt: `You are a senior developer. Write a commit message for the following diff using Conventional Commits format.

Rules:
- Type: feat, fix, docs, style, refactor, test, chore
- Scope: optional, in parentheses
- Subject: imperative mood, no period, under 50 chars
- Body: explain WHY, not WHAT (the diff shows what)
- Footer: reference issues if applicable

Diff:
\`\`\`
[paste diff here]
\`\`\``,
  },
  {
    id: "data-analysis",
    title: "Analyze This Data",
    category: "Analysis",
    preview: "Extract insights, patterns, and actionable recommendations from data.",
    prompt: `Analyze the following data and provide insights:

[paste data here — CSV, JSON, or describe the dataset]

Provide:
1. **Summary Statistics** — Key numbers at a glance
2. **Trends** — What patterns do you see over time?
3. **Anomalies** — Anything unusual or unexpected?
4. **Correlations** — What factors seem related?
5. **Recommendations** — 3 actionable next steps based on the data

Present numbers with context (e.g., "23% increase" not just "23%"). Use tables where helpful.`,
  },
  {
    id: "compare-options",
    title: "Compare Technical Options",
    category: "Analysis",
    preview: "Side-by-side comparison of technical choices with recommendation.",
    prompt: `Compare [Option A] vs [Option B] for [use case].

Evaluate on these dimensions:
1. Performance
2. Developer experience
3. Ecosystem and community
4. Learning curve
5. Cost (if applicable)
6. Scalability

For each dimension, give a rating (1-5) and brief explanation. End with:
- A comparison table
- Your recommendation with reasoning
- When you would choose the other option instead`,
  },
  {
    id: "architecture-review",
    title: "Architecture Review",
    category: "Analysis",
    preview: "Evaluate system architecture for scalability and reliability.",
    prompt: `Review this system architecture:

[describe the architecture or paste a diagram description]

Evaluate:
1. **Scalability** — Will it handle 10x/100x growth?
2. **Reliability** — Single points of failure? Recovery strategy?
3. **Security** — Authentication, authorization, data protection
4. **Performance** — Bottlenecks, caching strategy, latency
5. **Maintainability** — How easy to modify and debug?
6. **Cost** — Is it cost-efficient at current and projected scale?

Provide specific, actionable recommendations for each concern.`,
  },
  {
    id: "root-cause",
    title: "Root Cause Analysis",
    category: "Debugging",
    preview: "Systematic investigation to find the real source of a bug.",
    prompt: `Help me perform a root cause analysis for this bug:

**Symptoms:** [what's happening]
**Expected behavior:** [what should happen]
**Environment:** [OS, language version, framework version]
**Steps to reproduce:** [how to trigger the bug]
**What I've tried:** [debugging steps already taken]

Walk me through a systematic investigation:
1. List the most likely causes (ranked by probability)
2. For each cause, suggest a diagnostic step to confirm or rule it out
3. Once we identify the root cause, explain the fix`,
  },
  {
    id: "performance-debug",
    title: "Performance Debugging",
    category: "Debugging",
    preview: "Identify and fix performance bottlenecks in code.",
    prompt: `This code is running too slowly. Help me identify and fix performance bottlenecks.

**Current performance:** [e.g., takes 5 seconds for 1000 items]
**Target performance:** [e.g., under 200ms for 1000 items]
**Constraints:** [memory limits, can't change the API, etc.]

\`\`\`
[paste code here]
\`\`\`

For each bottleneck found:
1. Explain why it's slow
2. Provide the optimized version
3. Estimate the improvement
4. Note any tradeoffs`,
  },
  {
    id: "regex-debug",
    title: "Fix This Regex",
    category: "Debugging",
    preview: "Debug and explain regex patterns with test cases.",
    prompt: `This regex isn't working as expected:

Pattern: \`[paste regex]\`
Language: [JavaScript/Python/etc.]

**Should match:** [list examples]
**Should NOT match:** [list examples]
**Currently matching incorrectly:** [what's going wrong]

Provide:
1. Explanation of what the current regex does (step by step)
2. The corrected regex
3. Explanation of the fix
4. Test it against all the examples above`,
  },
  {
    id: "claude-code-task",
    title: "Claude Code Task Prompt",
    category: "Claude Code",
    preview: "Structure a complex task for Claude Code to execute.",
    prompt: `I need you to [describe the high-level task].

Context:
- This is a [language/framework] project
- The relevant files are in [directory path]
- We follow [coding conventions]

Requirements:
1. [Specific requirement 1]
2. [Specific requirement 2]
3. [Specific requirement 3]

Constraints:
- Don't modify [files/patterns to avoid]
- Follow existing patterns in the codebase
- Add tests for any new functionality
- Update documentation if needed

Start by reading the relevant files, then implement the changes step by step.`,
  },
  {
    id: "claude-md-prompt",
    title: "Write a CLAUDE.md",
    category: "Claude Code",
    preview: "Generate a project-specific CLAUDE.md for Claude Code.",
    prompt: `Generate a CLAUDE.md file for my project with these details:

Project: [name and description]
Language/Framework: [e.g., TypeScript + Next.js]
Package manager: [npm/yarn/pnpm/bun]

Include sections for:
1. Build & test commands (dev, build, test, lint, typecheck)
2. Code style rules (formatting, naming conventions, import order)
3. Project structure overview
4. Key patterns to follow (state management, error handling, etc.)
5. Things to avoid (anti-patterns, deprecated APIs)
6. Testing conventions

Keep it concise — under 80 lines. Focus on what an AI assistant needs to know.`,
  },
  {
    id: "pr-review-prompt",
    title: "PR Review Assistant",
    category: "Claude Code",
    preview: "Use Claude Code to review a pull request thoroughly.",
    prompt: `Review this pull request thoroughly.

Focus areas:
1. **Correctness** — Does the code do what the PR description says?
2. **Security** — Any vulnerabilities introduced?
3. **Performance** — Any regressions or missed optimizations?
4. **Testing** — Are changes adequately tested?
5. **Style** — Does it follow project conventions?

For each issue:
- Classify as: blocker, suggestion, or nit
- Reference the specific file and line
- Explain why it matters
- Suggest a fix

End with an overall assessment: approve, request changes, or needs discussion.`,
  },
  {
    id: "migration-guide",
    title: "Create Migration Guide",
    category: "Claude Code",
    preview: "Plan and execute a codebase migration step by step.",
    prompt: `I need to migrate [what] from [old version/tool] to [new version/tool].

Current setup:
[describe current state]

Target:
[describe desired end state]

Create a step-by-step migration plan:
1. List all files/components that need changes
2. Order the changes to minimize breakage
3. For each step, show the before/after code
4. Include rollback instructions for each step
5. Add verification steps to confirm each stage works

Prioritize backward compatibility during the migration.`,
  },
  {
    id: "security-audit",
    title: "Security Audit",
    category: "Analysis",
    preview: "Scan code for common security vulnerabilities.",
    prompt: `Perform a security audit on this code. Check for:

1. **Injection** — SQL injection, XSS, command injection
2. **Authentication** — Weak auth, missing checks, token handling
3. **Authorization** — Privilege escalation, IDOR
4. **Data Exposure** — Sensitive data in logs, responses, errors
5. **Configuration** — Hardcoded secrets, debug mode, CORS
6. **Dependencies** — Known vulnerable patterns

\`\`\`
[paste code here]
\`\`\`

For each finding: severity (critical/high/medium/low), description, affected line(s), and remediation.`,
  },
  {
    id: "convert-code",
    title: "Convert Between Languages",
    category: "Coding",
    preview: "Translate code from one language to another idiomatically.",
    prompt: `Convert this [source language] code to idiomatic [target language].

Don't just translate syntax 1:1 — use the target language's:
- Standard library equivalents
- Idiomatic patterns and conventions
- Type system features
- Error handling patterns
- Naming conventions

\`\`\`
[paste code here]
\`\`\`

After the converted code, list the key differences and why each choice was made.`,
  },
];

// ---------------------------------------------------------------------------
// Before / After gallery data (8+ examples)
// ---------------------------------------------------------------------------

const BEFORE_AFTER: BeforeAfter[] = [
  {
    id: "ba-fix-code",
    topic: "Fixing Code",
    bad: "fix my code",
    good: `Debug this Python function that should return the sum of even numbers in a list but returns 0 for [2, 4, 6]. Here's the code:

def sum_evens(nums):
    total = 0
    for n in nums:
        if n % 2 == 0:
            total += n
        return total`,
    explanation:
      "The good prompt specifies the language, the expected vs actual behavior, provides a concrete failing input, and includes the code. Claude can immediately identify that the return is inside the loop.",
  },
  {
    id: "ba-blog",
    topic: "Writing Content",
    bad: "write a blog post",
    good: `Write a 1200-word blog post about React Server Components for mid-level frontend developers. Tone: conversational but technical. Structure: intro hook with a pain point, 3 sections with descriptive subheadings, 2 code examples showing before/after, actionable conclusion with next steps.`,
    explanation:
      "The good prompt defines topic, audience, length, tone, structure, and concrete deliverables. This eliminates multiple rounds of revision.",
  },
  {
    id: "ba-explain",
    topic: "Getting Explanations",
    bad: "explain kubernetes",
    good: `Explain Kubernetes to a backend developer who uses Docker but hasn't worked with orchestration. Cover: what problems it solves, core concepts (pods, services, deployments), and a minimal example of deploying a Node.js app. Skip the history and comparison with Docker Swarm.`,
    explanation:
      "The good prompt establishes the reader's existing knowledge, scopes what to cover AND what to skip, and asks for a practical example. This avoids a generic Wikipedia-style answer.",
  },
  {
    id: "ba-test",
    topic: "Writing Tests",
    bad: "write tests for my function",
    good: `Write Jest tests for this TypeScript function that validates email addresses. Cover: valid emails (user@domain.com), edge cases (plus addressing, subdomains), and invalid inputs (missing @, spaces, empty string). Use describe/it blocks with clear test names.

export function isValidEmail(email: string): boolean { ... }`,
    explanation:
      "The good prompt specifies the testing framework, language, types of test cases, and preferred test structure. It also provides the function signature for context.",
  },
  {
    id: "ba-review",
    topic: "Code Review",
    bad: "review this code",
    good: `Review this Express.js authentication middleware for: 1) Security vulnerabilities (especially JWT handling) 2) Error cases that return 500 instead of proper status codes 3) Race conditions with the database call. The code handles ~10K requests/minute in production.`,
    explanation:
      "The good prompt focuses the review on specific concerns, mentions the technology stack, and provides production context (scale) that affects the recommendations.",
  },
  {
    id: "ba-sql",
    topic: "Database Queries",
    bad: "write me a SQL query",
    good: `Write a PostgreSQL query to find the top 10 customers by total order value in the last 30 days. Tables: customers (id, name, email), orders (id, customer_id, total, created_at). Include customers with no orders as $0. Format the output as: name, email, total_spent (descending).`,
    explanation:
      "The good prompt specifies the database, the exact result needed, provides the schema, handles the edge case (no orders), and defines the output format and sort order.",
  },
  {
    id: "ba-refactor",
    topic: "Refactoring",
    bad: "make this code better",
    good: `Refactor this React component to: 1) Extract the fetch logic into a custom hook 2) Replace the nested ternaries with early returns 3) Add proper TypeScript types (currently using 'any' in 4 places) 4) Memoize the expensive filter operation. Keep the component's behavior identical.`,
    explanation:
      "The good prompt lists specific refactoring targets, explains what to preserve, and calls out exact issues. 'Make it better' could mean anything; this is actionable.",
  },
  {
    id: "ba-deploy",
    topic: "DevOps Tasks",
    bad: "help me deploy my app",
    good: `Create a GitHub Actions workflow to deploy a Next.js 14 app to AWS EC2. Requirements: run on push to main, build with Node 20, run tests first, SSH deploy to ec2-user@my-server, use PM2 for process management, send Slack notification on success/failure. Our secrets are in GitHub Secrets.`,
    explanation:
      "The good prompt specifies the CI/CD platform, framework, infrastructure, Node version, deployment method, process manager, and notification requirements. Every choice is made explicit.",
  },
  {
    id: "ba-regex",
    topic: "Writing Regex",
    bad: "write a regex for phone numbers",
    good: `Write a JavaScript regex to validate US phone numbers. Must accept: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, +1 123 456 7890. Must reject: 123-45-6789 (too few digits), letters, numbers with country codes other than +1. Return named capture groups for area code, prefix, and line number.`,
    explanation:
      "The good prompt lists exact formats to match and reject, specifies the language (JS regex flavor matters), and asks for capture groups. This eliminates guesswork about edge cases.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ALL_CATEGORIES: TemplateCategory[] = ["Coding", "Writing", "Analysis", "Debugging", "Claude Code"];

export default function PromptLabPage() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "All">("All");

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "All") return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <FlaskConical className="h-5 w-5" />
            </div>
            <Badge variant="accent">Interactive</Badge>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4">
            Prompt Engineering Lab
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Build better prompts with the interactive builder, browse ready-to-use templates,
            and study before/after transformations that show what makes a great prompt.
          </p>
        </div>
      </section>

      {/* Section A: Prompt Builder */}
      <section className="py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Prompt Builder</h2>
            </div>
            <p className="text-muted max-w-3xl leading-relaxed mb-6">
              Great prompts follow a layered structure. The 6-layer framework helps you write
              prompts that get consistent, high-quality results from Claude every time.
            </p>

            {/* 6-layer explanation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {[
                { num: 1, label: "Role", desc: "Who Claude should be", color: "text-blue" },
                { num: 2, label: "Context", desc: "Background information", color: "text-green" },
                { num: 3, label: "Task", desc: "What to accomplish", color: "text-accent" },
                { num: 4, label: "Constraints", desc: "Rules and limits", color: "text-red" },
                { num: 5, label: "Format", desc: "Output structure", color: "text-purple" },
                { num: 6, label: "Examples", desc: "Show, don't tell", color: "text-cyan" },
              ].map((layer) => (
                <div
                  key={layer.num}
                  className="rounded-lg border border-border bg-surface p-3 text-center"
                >
                  <div className={cn("text-2xl font-bold mb-1", layer.color)}>
                    {layer.num}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{layer.label}</div>
                  <div className="text-xs text-muted mt-0.5">{layer.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <PromptPlayground />
        </div>
      </section>

      {/* Section B: Template Library */}
      <section className="py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Template Library</h2>
            </div>
            <p className="text-muted max-w-3xl leading-relaxed">
              Ready-to-use prompt templates. Click any template to copy it, then customize
              the bracketed placeholders for your use case.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("All")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === "All"
                  ? "bg-accent text-background"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-accent"
              )}
            >
              All ({TEMPLATES.length})
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const count = TEMPLATES.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeCategory === cat
                      ? "bg-accent text-background"
                      : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-accent"
                  )}
                >
                  {categoryIcons[cat]}
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>

      {/* Section C: Before/After Gallery */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Before / After Gallery</h2>
            </div>
            <p className="text-muted max-w-3xl leading-relaxed">
              See how vague prompts become powerful ones. Each pair shows the transformation
              with an explanation of what makes the improved version work.
            </p>
          </div>

          <div className="space-y-8">
            {BEFORE_AFTER.map((item) => (
              <BeforeAfterCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TemplateCard({ template }: { template: PromptTemplate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = template.prompt;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-accent">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1.5">{template.title}</h3>
          <Badge variant={categoryBadgeVariant[template.category]}>
            {template.category}
          </Badge>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            copied
              ? "bg-green/15 text-green"
              : "bg-surface-2 text-muted hover:text-foreground"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-muted leading-relaxed">{template.preview}</p>
    </div>
  );
}

function BeforeAfterCard({ item }: { item: BeforeAfter }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-surface-2">
        <span className="text-sm font-semibold text-foreground">{item.topic}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Bad prompt */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-full bg-red/15 px-2.5 py-0.5 text-xs font-medium text-red border border-red/30">
              Before
            </span>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg border border-red/20 bg-red/5 p-4 font-mono text-sm text-foreground leading-relaxed">
            {item.bad}
          </pre>
        </div>

        {/* Good prompt */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-full bg-green/15 px-2.5 py-0.5 text-xs font-medium text-green border border-green/30">
              After
            </span>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg border border-green/20 bg-green/5 p-4 font-mono text-sm text-foreground leading-relaxed">
            {item.good}
          </pre>
        </div>
      </div>

      {/* Explanation */}
      <div className="px-5 py-4 border-t border-border bg-surface-2">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-muted leading-relaxed">{item.explanation}</p>
        </div>
      </div>
    </div>
  );
}
