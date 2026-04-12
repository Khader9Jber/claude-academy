"use client";

import {
  Plug,
  Server,
  Database,
  Cloud,
  MessageSquare,
  PencilRuler,
  BarChart3,
  GitBranch,
  Globe,
  Brain,
  FolderSearch,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Wrench,
  Target,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/content/copy-button";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */

type ServerCategory =
  | "Essential"
  | "Database"
  | "DevOps"
  | "Communication"
  | "Design"
  | "Analytics"
  | "Automation"
  | "Web";

interface McpServer {
  name: string;
  category: ServerCategory;
  source: "official" | "community" | "vendor";
  blurb: string;
  install: string;
  useCases: string[];
}

const CATEGORY_META: Record<
  ServerCategory,
  { icon: React.ReactNode; color: string }
> = {
  Essential: { icon: <Sparkles className="h-4 w-4" />, color: "#d4a053" },
  Database: { icon: <Database className="h-4 w-4" />, color: "#5e9ed6" },
  DevOps: { icon: <Cloud className="h-4 w-4" />, color: "#5cb870" },
  Communication: {
    icon: <MessageSquare className="h-4 w-4" />,
    color: "#d65ea0",
  },
  Design: { icon: <PencilRuler className="h-4 w-4" />, color: "#a07ed6" },
  Analytics: { icon: <BarChart3 className="h-4 w-4" />, color: "#5ec4c4" },
  Automation: { icon: <Wrench className="h-4 w-4" />, color: "#d6885e" },
  Web: { icon: <Globe className="h-4 w-4" />, color: "#e06c75" },
};

/* ── Data: Servers ──────────────────────────────────────────────────── */

const ESSENTIAL: McpServer[] = [
  {
    name: "Filesystem",
    category: "Essential",
    source: "official",
    blurb:
      "Secure file operations with configurable access controls. The reference server for reading, writing, and searching files outside the current repo.",
    install: "claude mcp add filesystem",
    useCases: [
      "Read config from another directory on your machine",
      "Aggregate notes from your Obsidian vault into a summary",
      "Sync generated docs into a company knowledge folder",
    ],
  },
  {
    name: "Git",
    category: "Essential",
    source: "official",
    blurb:
      "Read, search, and manipulate any Git repository. Goes beyond Claude Code's built-in Bash tool — structured access to history, blame, and refs.",
    install: "claude mcp add git",
    useCases: [
      "Ask Claude to bisect a regression across 100 commits",
      "Produce a blame-based ownership map for a legacy file",
      "Cherry-pick commits across repos without context switching",
    ],
  },
  {
    name: "GitHub (official)",
    category: "Essential",
    source: "official",
    blurb:
      "Anthropic's official GitHub integration. Repo search, file reads, PR operations, issue management, and commit history. The single most useful MCP server in a dev workflow.",
    install: "claude mcp add github",
    useCases: [
      "Open, review, and merge PRs from inside Claude Code",
      "Triage issues and auto-label them based on content",
      "Generate release notes from the last 50 merged PRs",
    ],
  },
  {
    name: "Fetch",
    category: "Essential",
    source: "official",
    blurb:
      "Pulls web content and converts it to clean markdown for LLM consumption. Solves the 'I need Claude to read this URL' problem without screen scraping.",
    install: "claude mcp add fetch",
    useCases: [
      "Have Claude read your blog post and suggest edits",
      "Turn a docs page into a CLAUDE.md snippet",
      "Summarize an RFC URL in-session",
    ],
  },
  {
    name: "Memory",
    category: "Essential",
    source: "official",
    blurb:
      "Knowledge graph-based persistent memory that survives across sessions. Unlike CLAUDE.md (static), memory learns and updates itself.",
    install: "claude mcp add memory",
    useCases: [
      "Remember user preferences ('always use pnpm, never npm')",
      "Track long-running project decisions without re-explaining them",
      "Build a personal 'second brain' that Claude can query",
    ],
  },
];

const DATABASE: McpServer[] = [
  {
    name: "PostgreSQL",
    category: "Database",
    source: "community",
    blurb:
      "Query and explore Postgres databases directly. Schema introspection, read queries, and guarded write access depending on config.",
    install: "claude mcp add postgres",
    useCases: [
      "Ask Claude to profile a slow query and suggest indexes",
      "Generate a migration from 'add a users.last_login column'",
      "Explore a database you've never seen before",
    ],
  },
  {
    name: "MongoDB",
    category: "Database",
    source: "vendor",
    blurb:
      "Official MongoDB/Atlas integration with auth, structured queries, and role-based access control. The native way to let Claude touch a Mongo cluster.",
    install: "claude mcp add mongodb",
    useCases: [
      "Run aggregation pipelines in natural language",
      "Validate document schemas against a production collection",
      "Migrate a collection shape with Claude in the loop",
    ],
  },
  {
    name: "Supabase",
    category: "Database",
    source: "vendor",
    blurb:
      "Backend-as-a-service integration — Postgres, auth, storage, edge functions. Especially useful for projects already on Supabase.",
    install: "claude mcp add supabase",
    useCases: [
      "Apply RLS policies to a new table",
      "Generate typed client code from the live schema",
      "Deploy an edge function without leaving the chat",
    ],
  },
  {
    name: "Redis",
    category: "Database",
    source: "community",
    blurb:
      "Key-value cache operations. Read, set, expire, scan. Useful for debugging cache-related bugs in a running app.",
    install: "claude mcp add redis",
    useCases: [
      "Inspect why a specific user sees stale data",
      "Flush a pattern of keys after a deploy",
      "Profile memory usage of a cache namespace",
    ],
  },
  {
    name: "dbt",
    category: "Database",
    source: "vendor",
    blurb:
      "Semantic layer, project graph, and CLI commands. The analytics engineer's MCP — lineage, metrics, model materialization.",
    install: "claude mcp add dbt",
    useCases: [
      "Trace the lineage of a dashboard metric back to raw sources",
      "Refactor a dbt model and preview the downstream impact",
      "Generate tests for a new model based on semantic definitions",
    ],
  },
];

const DEVOPS: McpServer[] = [
  {
    name: "Cloudflare",
    category: "DevOps",
    source: "vendor",
    blurb:
      "Workers, Pages, KV, R2, edge rules. Automate CDN config, deploy workers, inspect analytics — all from chat.",
    install: "claude mcp add cloudflare",
    useCases: [
      "Create a new Worker with custom routes in one prompt",
      "Audit DNS records across zones for a domain migration",
      "Sync static assets to R2 from a build pipeline",
    ],
  },
  {
    name: "AWS (Bedrock AgentCore)",
    category: "DevOps",
    source: "vendor",
    blurb:
      "Enterprise context management for AWS resources. Designed for large orgs that need audit trails and fine-grained access to Bedrock-backed tooling.",
    install: "claude mcp add aws-bedrock-agentcore",
    useCases: [
      "Pull IAM policies and summarize over-permissioned roles",
      "Discover orphaned EC2 instances and estimate monthly cost",
      "Generate CloudFormation from a described architecture",
    ],
  },
  {
    name: "Vercel",
    category: "DevOps",
    source: "vendor",
    blurb:
      "Deployments, domains, env vars, analytics. If your app lives on Vercel, this MCP removes the dashboard from your workflow.",
    install: "claude mcp add vercel",
    useCases: [
      "Roll back to the last known good deployment",
      "Update env vars across preview and prod from a single prompt",
      "Diagnose a failed build by pulling the exact logs",
    ],
  },
  {
    name: "Docker",
    category: "DevOps",
    source: "community",
    blurb:
      "Container lifecycle operations — list, start, stop, exec, logs. Handy for debugging a local cluster Claude doesn't otherwise see.",
    install: "claude mcp add docker",
    useCases: [
      "Tail logs from the backend container while Claude reads them",
      "Exec a shell into a misbehaving container and poke around",
      "Clean up stopped containers and dangling images",
    ],
  },
  {
    name: "Kubernetes",
    category: "DevOps",
    source: "community",
    blurb:
      "Cluster operations — pods, services, deployments, events. Kubeconfig-scoped so it only sees contexts you've exposed.",
    install: "claude mcp add kubernetes",
    useCases: [
      "Investigate why a pod is CrashLooping without leaving chat",
      "Scale a deployment based on current metrics",
      "Write a NetworkPolicy from a described intent",
    ],
  },
];

const COMMUNICATION: McpServer[] = [
  {
    name: "Slack",
    category: "Communication",
    source: "community",
    blurb:
      "Post messages, read channels, manage DMs and threads. Ship reports from CI, ask Claude to summarize an incident channel, etc.",
    install: "claude mcp add slack",
    useCases: [
      "Post a PR summary to #engineering when CI goes green",
      "Summarize a 400-message incident thread into a doc",
      "Send yourself a DM when a scheduled task completes",
    ],
  },
  {
    name: "Linear",
    category: "Communication",
    source: "vendor",
    blurb:
      "Issue tracking integration. Create, read, update, move — great for converting Claude's TODOs into real tickets with one prompt.",
    install: "claude mcp add linear",
    useCases: [
      "Turn your session's TODOs into tickets in the correct project",
      "Auto-label bugs by component based on file paths",
      "Pull the current sprint and plan the day's work",
    ],
  },
  {
    name: "Notion",
    category: "Communication",
    source: "vendor",
    blurb:
      "Workspace integration — pages, databases, search. Perfect for teams that document in Notion and want Claude to read/write there.",
    install: "claude mcp add notion",
    useCases: [
      "Draft an ADR into the team's engineering Notion",
      "Query a 'Who does what' database to tag the right reviewer",
      "Pull meeting notes and turn them into Linear issues",
    ],
  },
];

const DESIGN_ANALYTICS: McpServer[] = [
  {
    name: "Figma",
    category: "Design",
    source: "vendor",
    blurb:
      "Design context for developers. Pulls frames, components, and tokens so Claude can translate Figma into code accurately.",
    install: "claude mcp add figma",
    useCases: [
      "Generate a React component from a specific Figma frame",
      "Extract design tokens (colors, spacing) into CSS variables",
      "Detect drift between Figma components and shipped code",
    ],
  },
  {
    name: "Sentry",
    category: "Analytics",
    source: "vendor",
    blurb:
      "Error tracking and performance telemetry access. Pull the top errors of the week, read stack traces, and patch the offending code in-session.",
    install: "claude mcp add sentry",
    useCases: [
      "'What's our #1 error right now?' → get top issue + file it belongs to",
      "Read a stack trace and generate a unit test that reproduces it",
      "Correlate a performance regression with a specific release",
    ],
  },
  {
    name: "Stripe",
    category: "Analytics",
    source: "vendor",
    blurb:
      "Payment operations — products, prices, customers, subscriptions. Useful for devs shipping billing changes or investigating support tickets.",
    install: "claude mcp add stripe",
    useCases: [
      "Set up a new pricing plan end-to-end without the dashboard",
      "Investigate why a customer's subscription didn't renew",
      "Generate a test scenario against the Stripe CLI",
    ],
  },
];

const AUTOMATION_WEB: McpServer[] = [
  {
    name: "Puppeteer / Browser",
    category: "Automation",
    source: "community",
    blurb:
      "Web scraping and browser automation. Open pages, click, type, screenshot. The Swiss army knife for anything that requires a real browser.",
    install: "claude mcp add puppeteer",
    useCases: [
      "Scrape a vendor page that has no API",
      "Reproduce a UI bug from a description",
      "Capture a screenshot of a deployed preview for PR review",
    ],
  },
  {
    name: "Playwright",
    category: "Automation",
    source: "vendor",
    blurb:
      "End-to-end test automation. Generate Playwright scripts from natural language, debug flaky tests, and run headless in CI.",
    install: "claude mcp add playwright",
    useCases: [
      "Generate a full login E2E spec from 'test that login works'",
      "Auto-generate selectors for a page Claude has never seen",
      "Debug a flaky test by inspecting live DOM state",
    ],
  },
  {
    name: "Next.js",
    category: "Web",
    source: "vendor",
    blurb:
      "Next.js-specific dev tools for AI assistants. Route introspection, build diagnostics, and app-aware suggestions for Next.js projects.",
    install: "claude mcp add nextjs",
    useCases: [
      "Surface slow server components in a live dev build",
      "Suggest App Router migrations for a Pages Router project",
      "Identify missing 'use client' boundaries automatically",
    ],
  },
  {
    name: "Everything (reference)",
    category: "Web",
    source: "official",
    blurb:
      "Anthropic's reference/test server. Not for production — it demonstrates every MCP capability (prompts, resources, tools). Great for learning.",
    install: "claude mcp add everything",
    useCases: [
      "Learn MCP by inspecting a fully-featured implementation",
      "Test your Claude Code config against known-good endpoints",
      "Benchmark latency and response sizes against a reference",
    ],
  },
  {
    name: "Sequential Thinking",
    category: "Web",
    source: "official",
    blurb:
      "Dynamic, reflective problem-solving. Explicit scaffolding for multi-step reasoning — Claude works through problems out loud with checkpoints.",
    install: "claude mcp add sequential-thinking",
    useCases: [
      "Force a step-by-step breakdown on tricky algorithm problems",
      "Scaffold architectural decisions with explicit trade-off lists",
      "Debug with a visible chain of hypotheses and tests",
    ],
  },
];

const ALL_TIERS: { title: string; desc: string; servers: McpServer[] }[] = [
  {
    title: "Tier 1 — Essential for everyone",
    desc: "The five servers we install on every new machine. Each one solves a problem you will hit within your first week.",
    servers: ESSENTIAL,
  },
  {
    title: "Database",
    desc: "Pick whichever matches your stack. Each exposes schema introspection and query execution — the two things you actually need.",
    servers: DATABASE,
  },
  {
    title: "DevOps & Cloud",
    desc: "Automate the boring console work. If you spend more than 10 minutes a week in AWS/Vercel/Cloudflare, the MCP pays for itself immediately.",
    servers: DEVOPS,
  },
  {
    title: "Communication & Ticketing",
    desc: "Close the loop between 'Claude did a thing' and 'the team knows about it' without you playing messenger.",
    servers: COMMUNICATION,
  },
  {
    title: "Design & Analytics",
    desc: "Bring non-code context — designs, errors, revenue — into Claude's sight line so the answers match the real product.",
    servers: DESIGN_ANALYTICS,
  },
  {
    title: "Automation & Web",
    desc: "Browsers, frameworks, and meta-MCPs. Niche tools that are magical in the right context.",
    servers: AUTOMATION_WEB,
  },
];

const TROUBLESHOOT = [
  {
    title: "Server fails to start",
    body: "Check `claude mcp list` — if it shows status: error, run with `--verbose` to see the stderr from the server process. Nine times out of ten it's a missing env var or a Node/Python version mismatch.",
  },
  {
    title: "Claude doesn't see the tools",
    body: "Run `claude mcp restart <name>` and then ask Claude 'what MCP tools do you have?'. If the server is up but tools aren't listed, the server's tool manifest is likely malformed — check its logs.",
  },
  {
    title: "Auth errors",
    body: "MCP servers usually read secrets from env vars. Put them in your shell profile or in `~/.claude/env` (a dot-env file Claude Code loads on launch). Never put secrets in settings.json — it's often committed.",
  },
  {
    title: "Slow tool calls",
    body: "Some servers (especially browser-based ones) spawn heavyweight subprocesses on every call. If latency is bad, run the server in long-lived mode (set `keepAlive: true` if supported) so the subprocess stays warm.",
  },
  {
    title: "Tool name collisions",
    body: "Two servers both expose a tool called `search`. Use the fully-qualified name (`<server>.search`) in prompts, or disable the one you don't need with `claude mcp disable <name>`.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────── */

export default function McpGalleryPage() {
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="guide-mcp-gallery-page"
    >
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <Plug className="h-4 w-4" />
            Reference
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            MCP Server Gallery: 20+ Servers Worth Installing
          </h1>
          <p className="text-muted max-w-3xl mx-auto text-lg">
            The Model Context Protocol servers that actually earn their keep.
            Install commands, use cases, and the five we install before anything
            else.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-border bg-surface-2/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-accent shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                What MCP is, in one paragraph
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-3">
                The Model Context Protocol is a standard way for tools and data
                sources to plug into AI agents. An MCP &quot;server&quot; is a
                small program that exposes a set of tools (read-file, run-query,
                post-message) to Claude. You install it once, Claude gets the
                tools forever. No custom integration code.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                The mental model: MCP is the USB-C of AI tooling. Think of each
                server as a capability pack you hot-plug into Claude.
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
          {/* How to install */}
          <section>
            <div className="mb-6">
              <Badge variant="accent" className="mb-3">
                <FolderSearch className="h-3.5 w-3.5 mr-1" />
                Install
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                How to install any MCP server
              </h2>
              <p className="text-muted">
                Two paths — CLI (easier) or manual edit (more control). Both end
                up writing to <code className="bg-surface-2 px-1.5 py-0.5 rounded">
                  .claude/settings.json
                </code>{" "}
                or the global equivalent.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="text-xs uppercase tracking-wide text-muted mb-1">
                    CLI
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    claude mcp add
                  </h3>
                </div>
                <div className="bg-surface-2 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted">
                      Shell
                    </span>
                    <CopyButton
                      text={`# Install a server
claude mcp add <server-name>

# List what's configured
claude mcp list

# Restart a running server
claude mcp restart <server-name>

# Remove one
claude mcp remove <server-name>`}
                    />
                  </div>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border">
                    <code>{`# Install a server
claude mcp add <server-name>

# List what's configured
claude mcp list

# Restart a running server
claude mcp restart <server-name>

# Remove one
claude mcp remove <server-name>`}</code>
                  </pre>
                </div>
              </div>
              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="text-xs uppercase tracking-wide text-muted mb-1">
                    Manual
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Edit settings.json
                  </h3>
                </div>
                <div className="bg-surface-2 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted">
                      .claude/settings.json
                    </span>
                    <CopyButton
                      text={`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}`}
                    />
                  </div>
                  <pre className="text-xs text-foreground/90 font-mono bg-surface p-3 rounded-lg overflow-x-auto leading-relaxed border border-border">
                    <code>{`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="mt-5 border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-foreground mb-1">
                  Registries
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  The canonical lists:{" "}
                  <a
                    href="https://modelcontextprotocol.io/examples"
                    className="text-accent hover:underline inline-flex items-center gap-1"
                  >
                    modelcontextprotocol.io/examples
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  (official),{" "}
                  <a
                    href="https://github.com/modelcontextprotocol/servers"
                    className="text-accent hover:underline inline-flex items-center gap-1"
                  >
                    github.com/modelcontextprotocol/servers
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  (all open-source reference servers), and{" "}
                  <a
                    href="https://mcpservers.org/"
                    className="text-accent hover:underline inline-flex items-center gap-1"
                  >
                    mcpservers.org
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  (community gallery with a richer long tail).
                </p>
              </div>
            </div>
          </section>

          {/* Tier sections */}
          {ALL_TIERS.map((tier) => (
            <section key={tier.title}>
              <div className="mb-6">
                <Badge variant="blue" className="mb-3">
                  <Server className="h-3.5 w-3.5 mr-1" />
                  Gallery
                </Badge>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {tier.title}
                </h2>
                <p className="text-muted">{tier.desc}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {tier.servers.map((s) => {
                  const meta = CATEGORY_META[s.category];
                  return (
                    <div
                      key={s.name}
                      className="border border-border rounded-2xl bg-surface overflow-hidden flex flex-col"
                    >
                      <div className="p-5 border-b border-border">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                              style={{
                                backgroundColor: `${meta.color}15`,
                                color: meta.color,
                              }}
                            >
                              {meta.icon}
                            </div>
                            <h3 className="text-base font-semibold text-foreground">
                              {s.name}
                            </h3>
                          </div>
                          <span
                            className={cn(
                              "text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-mono",
                              s.source === "official" &&
                                "bg-accent/10 text-accent",
                              s.source === "vendor" &&
                                "bg-blue/10 text-blue",
                              s.source === "community" &&
                                "bg-purple/10 text-purple"
                            )}
                          >
                            {s.source}
                          </span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                          {s.blurb}
                        </p>
                      </div>
                      <div className="p-4 bg-surface-2/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-muted uppercase tracking-wide">
                            Install
                          </span>
                          <CopyButton text={s.install} />
                        </div>
                        <code className="block text-xs font-mono text-foreground bg-surface border border-border rounded-lg px-3 py-2 mb-4 overflow-x-auto">
                          {s.install}
                        </code>
                        <div className="text-[10px] text-muted uppercase tracking-wide mb-2">
                          Use cases
                        </div>
                        <ul className="space-y-1.5">
                          {s.useCases.map((u) => (
                            <li
                              key={u}
                              className="text-xs text-muted leading-relaxed flex gap-2"
                            >
                              <span className="text-accent shrink-0">→</span>
                              <span>{u}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Troubleshooting */}
          <section>
            <div className="mb-6">
              <Badge variant="red" className="mb-3">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Troubleshooting
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When MCP breaks
              </h2>
              <p className="text-muted">
                The five failure modes you&apos;ll hit in practice, ordered by
                how often we see them.
              </p>
            </div>
            <div className="space-y-3">
              {TROUBLESHOOT.map((t, i) => (
                <div
                  key={t.title}
                  className="border border-border rounded-xl bg-surface p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-accent font-mono text-sm shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {t.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {t.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Build your own */}
          <section>
            <div className="mb-6">
              <Badge variant="purple" className="mb-3">
                <Brain className="h-3.5 w-3.5 mr-1" />
                Roll your own
              </Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                When nothing fits, build your own
              </h2>
            </div>
            <div className="border border-border rounded-2xl bg-surface p-5 sm:p-6 space-y-3">
              <p className="text-sm text-muted leading-relaxed">
                Writing an MCP server takes about an hour for a useful first
                version. The SDK handles the protocol plumbing — you write a
                few tool definitions and the functions that back them. If your
                internal system has an API, it can have an MCP server by lunch.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                The canonical starting point is the TypeScript SDK at{" "}
                <a
                  href="https://github.com/modelcontextprotocol/servers"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  github.com/modelcontextprotocol/servers
                  <ExternalLink className="h-3 w-3" />
                </a>
                . Clone one of the reference servers (filesystem is simplest),
                rename, rewire the tools, and publish to your internal registry.
              </p>
              <div className="border border-accent/30 bg-accent/5 rounded-lg p-4 flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">
                    Pro tip
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    Start with a read-only server. Give Claude the ability to
                    query your internal tooling before you let it change
                    anything. Add write tools once you&apos;ve watched it
                    behave.
                  </p>
                </div>
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
                Install the five Tier 1 servers today. Add one more from the
                list each week until your stack is covered. The second your
                CLAUDE.md mentions a tool you use daily, there should be an MCP
                server for it — or you should be writing one.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                <GitBranch className="h-4 w-4" />
                Ready to build your own? See the &quot;Building an MCP
                Server&quot; lesson in the curriculum.
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
