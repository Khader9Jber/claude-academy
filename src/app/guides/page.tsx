import Link from "next/link";
import {
  FolderTree,
  Terminal,
  FileCode,
  AlertTriangle,
  Zap,
  Brain,
  BookOpen,
  ArrowRight,
  Webhook,
  GitBranch,
  Plug,
  Coins,
  FlaskConical,
  GitPullRequest,
  Award,
  Sparkles,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Guide {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  icon: React.ReactNode;
  color: string;
  tags: string[];
  date: string;
}

const GUIDES: Guide[] = [
  {
    slug: "project-structures",
    title: "Best Project Structures for Claude Code",
    description:
      "Battle-tested folder structures optimized for how Claude discovers files, navigates code, and generates consistent implementations. Covers Next.js, Django, monorepos, CLIs, and more.",
    readTime: "15 min",
    icon: <FolderTree className="h-5 w-5" />,
    color: "#5e9ed6",
    tags: ["architecture", "organization", "best-practices"],
    date: "2026-04-11",
  },
  {
    slug: "daily-commands",
    title: "Top 10 Commands in Daily Claude Use",
    description:
      "The commands you'll reach for dozens of times a day. Beyond the basics — the exact workflows, when to use each, and the tiny tricks that save hours.",
    readTime: "12 min",
    icon: <Terminal className="h-5 w-5" />,
    color: "#5cb870",
    tags: ["commands", "workflow", "productivity"],
    date: "2026-04-11",
  },
  {
    slug: "claude-md-guide",
    title: "The Complete CLAUDE.md Guide",
    description:
      "Everything that belongs in a CLAUDE.md file, everything that doesn't, and the exact patterns top teams use to make Claude dramatically more effective.",
    readTime: "18 min",
    icon: <FileCode className="h-5 w-5" />,
    color: "#a07ed6",
    tags: ["claude-md", "configuration", "context"],
    date: "2026-04-11",
  },
  {
    slug: "common-mistakes",
    title: "15 Common Mistakes That Ruin Claude Sessions",
    description:
      "The traps every new Claude user falls into. Each mistake, why it happens, what it costs you, and exactly how to avoid it.",
    readTime: "14 min",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "#d6885e",
    tags: ["mistakes", "troubleshooting", "debugging"],
    date: "2026-04-11",
  },
  {
    slug: "speed-tips",
    title: "25 Tips to Get Claude to Work Faster",
    description:
      "Every trick we know for speeding up Claude sessions — from shorter prompts to mode selection to context management. Cut your task time in half.",
    readTime: "13 min",
    icon: <Zap className="h-5 w-5" />,
    color: "#d4a053",
    tags: ["speed", "performance", "efficiency"],
    date: "2026-04-11",
  },
  {
    slug: "model-selection",
    title: "Which Claude Model Should You Use? A Decision Guide",
    description:
      "Opus vs Sonnet vs Haiku — when to pick which. Real scenarios, real cost differences, and the one rule that decides it 90% of the time.",
    readTime: "10 min",
    icon: <Brain className="h-5 w-5" />,
    color: "#5ec4c4",
    tags: ["models", "cost", "decision"],
    date: "2026-04-11",
  },
  {
    slug: "hooks-cookbook",
    title: "Claude Code Hooks: Complete Automation Cookbook",
    description:
      "Ten production-ready hooks that turn Claude Code into a self-correcting, self-auditing teammate. Auto-format, guardrails, notifications, audit logs, TDD enforcement — copy, paste, commit.",
    readTime: "20 min",
    icon: <Webhook className="h-5 w-5" />,
    color: "#d65ea0",
    tags: ["hooks", "automation", "production"],
    date: "2026-04-11",
  },
  {
    slug: "parallel-development",
    title: "Parallel Development: Worktrees and Sub-Agents",
    description:
      "Run three agents at once without them stomping on each other. The exact rules for when parallelism works, how to set up worktree isolation, and the pitfalls that kill your speedup.",
    readTime: "15 min",
    icon: <GitBranch className="h-5 w-5" />,
    color: "#5cb870",
    tags: ["agents", "worktrees", "parallel"],
    date: "2026-04-11",
  },
  {
    slug: "mcp-gallery",
    title: "MCP Server Gallery: 20+ Servers Worth Installing",
    description:
      "The Model Context Protocol servers that actually earn their keep. Install commands, use cases, and the five we install on every new machine.",
    readTime: "18 min",
    icon: <Plug className="h-5 w-5" />,
    color: "#5e9ed6",
    tags: ["mcp", "integration", "reference"],
    date: "2026-04-11",
  },
  {
    slug: "prompt-caching",
    title: "Prompt Caching: Cut Your Claude API Costs by 90%",
    description:
      "The exact pricing math, when caching saves money and when it doesn't, and the single rule that makes the difference — static first, dynamic last.",
    readTime: "17 min",
    icon: <Coins className="h-5 w-5" />,
    color: "#d4a053",
    tags: ["api", "cost", "optimization"],
    date: "2026-04-11",
  },
  {
    slug: "tdd-with-claude",
    title: "Test-Driven Development with Claude Code",
    description:
      "Claude wants to write implementation first. TDD requires the inverse. The exact prompts, the CLAUDE.md, and the hooks that keep the discipline from falling apart.",
    readTime: "16 min",
    icon: <FlaskConical className="h-5 w-5" />,
    color: "#a07ed6",
    tags: ["testing", "tdd", "discipline"],
    date: "2026-04-11",
  },
  {
    slug: "claude-in-cicd",
    title: "Claude Code in CI/CD: The GitHub Actions Playbook",
    description:
      "Five production workflow recipes — PR reviewer, nightly dep audit, docs sync, test generator, commit enhancer. Plus the security rules and cost controls to keep it safe.",
    readTime: "19 min",
    icon: <GitPullRequest className="h-5 w-5" />,
    color: "#e06c75",
    tags: ["ci-cd", "github-actions", "automation"],
    date: "2026-04-11",
  },
  {
    slug: "anthropic-best-practices",
    title: "The 20 Claude Code Best Practices from Anthropic",
    description:
      "The official Anthropic playbook for Claude Code — the patterns that work and the failure modes to avoid. Distilled from Anthropic's docs.",
    readTime: "22 min",
    icon: <Award className="h-5 w-5" />,
    color: "#d4a053",
    tags: ["official", "best-practices", "reference"],
    date: "2026-04-11",
  },
  {
    slug: "advanced-prompting",
    title: "Advanced Prompting Techniques from Anthropic's Docs",
    description:
      "Every official prompting technique — XML structure, long context tricks, adaptive thinking, and the migration path away from prefilled responses.",
    readTime: "18 min",
    icon: <Sparkles className="h-5 w-5" />,
    color: "#5e9ed6",
    tags: ["prompting", "official", "api"],
    date: "2026-04-11",
  },
  {
    slug: "explore-plan-implement",
    title: "Explore → Plan → Implement → Commit",
    description:
      "Anthropic's highest-leverage workflow for complex Claude Code tasks. When to use it, when to skip it, and how each phase compounds.",
    readTime: "15 min",
    icon: <Compass className="h-5 w-5" />,
    color: "#a07ed6",
    tags: ["workflow", "plan-mode", "official"],
    date: "2026-04-11",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background" data-testid="guides-page">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent mb-6">
            <BookOpen className="h-4 w-4" />
            Guides & Deep Dives
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-serif italic mb-4">
            Practical Guides for Real Claude Users
          </h1>
          <p className="text-muted max-w-3xl mx-auto text-lg">
            Opinionated, battle-tested guides on specific topics. Each one is
            the article we wish we&apos;d read when we started. No fluff, just
            what works.
          </p>
        </div>
      </section>

      {/* Guide cards */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group"
              >
                <article
                  className={cn(
                    "h-full rounded-2xl border border-border bg-surface p-6",
                    "hover:border-border-accent hover:bg-surface-2",
                    "transition-all duration-300 cursor-pointer"
                  )}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                    style={{
                      backgroundColor: `${guide.color}15`,
                      color: guide.color,
                    }}
                  >
                    {guide.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {guide.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted border-t border-border pt-4">
                    <span>{guide.readTime} read</span>
                    <span className="inline-flex items-center gap-1 text-accent group-hover:gap-2 transition-all">
                      Read guide
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
