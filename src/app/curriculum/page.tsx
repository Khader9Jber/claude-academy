"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  PenTool,
  Terminal,
  Command,
  FileCog,
  Layers,
  GitBranch,
  Plug,
  Webhook,
  Bot,
  Workflow,
  Building2,
  Trophy,
  Clock,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ARC_DEFINITIONS, MODULE_ORDER } from "@/lib/constants";
import { useProgressStore } from "@/lib/progress-store";
import { Breadcrumb } from "@/components/layout";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="h-5 w-5" />,
  "pen-tool": <PenTool className="h-5 w-5" />,
  terminal: <Terminal className="h-5 w-5" />,
  command: <Command className="h-5 w-5" />,
  "file-cog": <FileCog className="h-5 w-5" />,
  layers: <Layers className="h-5 w-5" />,
  "git-branch": <GitBranch className="h-5 w-5" />,
  plug: <Plug className="h-5 w-5" />,
  webhook: <Webhook className="h-5 w-5" />,
  bot: <Bot className="h-5 w-5" />,
  workflow: <Workflow className="h-5 w-5" />,
  "building-2": <Building2 className="h-5 w-5" />,
  trophy: <Trophy className="h-5 w-5" />,
};

interface ModuleMeta {
  title: string;
  slug: string;
  description: string;
  arc: string;
  order: number;
  icon: string;
  color: string;
  estimatedHours: number;
  prerequisites: string[];
  lessonCount: number;
}

// Static module data (matches _module.json files)
const MODULES: ModuleMeta[] = [
  { title: "Claude Fundamentals", slug: "claude-fundamentals", description: "Understand what Claude is, who built it, how it thinks, and the core concepts behind large language models.", arc: "foundation", order: 1, icon: "brain", color: "#5cb870", estimatedHours: 2, prerequisites: [], lessonCount: 4 },
  { title: "Prompt Engineering", slug: "prompt-engineering", description: "Master the art and science of writing effective prompts, from basic instructions to advanced techniques.", arc: "foundation", order: 2, icon: "pen-tool", color: "#5cb870", estimatedHours: 4, prerequisites: ["claude-fundamentals"], lessonCount: 7 },
  { title: "Claude Code Basics", slug: "claude-code-basics", description: "Get up and running with Claude Code, Anthropic's official CLI for Claude.", arc: "foundation", order: 3, icon: "terminal", color: "#5cb870", estimatedHours: 3, prerequisites: ["claude-fundamentals"], lessonCount: 5 },
  { title: "Commands & Navigation", slug: "commands-and-navigation", description: "Learn every slash command, keyboard shortcut, and navigation pattern in Claude Code.", arc: "foundation", order: 4, icon: "command", color: "#5cb870", estimatedHours: 2, prerequisites: ["claude-code-basics"], lessonCount: 5 },
  { title: "CLAUDE.md & Configuration", slug: "claude-md-and-config", description: "Master the CLAUDE.md file and project configuration for persistent instructions.", arc: "practitioner", order: 5, icon: "file-cog", color: "#5e9ed6", estimatedHours: 3, prerequisites: ["commands-and-navigation"], lessonCount: 6 },
  { title: "Session & Context Management", slug: "session-and-context", description: "Understand how Claude Code manages context windows, session history, and memory.", arc: "practitioner", order: 6, icon: "layers", color: "#5e9ed6", estimatedHours: 3, prerequisites: ["claude-md-and-config"], lessonCount: 5 },
  { title: "Git & Development Workflows", slug: "git-and-workflows", description: "Integrate Claude Code into your Git workflow for commits, PRs, and pair programming.", arc: "practitioner", order: 7, icon: "git-branch", color: "#5e9ed6", estimatedHours: 4, prerequisites: ["session-and-context"], lessonCount: 6 },
  { title: "MCP Fundamentals", slug: "mcp-fundamentals", description: "Learn the Model Context Protocol and how to extend Claude with external integrations.", arc: "practitioner", order: 8, icon: "plug", color: "#5e9ed6", estimatedHours: 3, prerequisites: ["claude-code-basics"], lessonCount: 5 },
  { title: "Hooks & Automation", slug: "hooks-and-automation", description: "Automate repetitive tasks with pre-tool, post-tool, and notification hooks.", arc: "power-user", order: 9, icon: "webhook", color: "#a07ed6", estimatedHours: 3, prerequisites: ["claude-md-and-config", "mcp-fundamentals"], lessonCount: 5 },
  { title: "Agents & Skills", slug: "agents-and-skills", description: "Build and use Claude Code agents, custom skills, and multi-agent architectures.", arc: "power-user", order: 10, icon: "bot", color: "#a07ed6", estimatedHours: 5, prerequisites: ["hooks-and-automation"], lessonCount: 7 },
  { title: "Advanced Workflows", slug: "advanced-workflows", description: "Combine everything into powerful multi-step workflows for complex tasks.", arc: "power-user", order: 11, icon: "workflow", color: "#a07ed6", estimatedHours: 5, prerequisites: ["agents-and-skills", "git-and-workflows"], lessonCount: 7 },
  { title: "Enterprise & Production", slug: "enterprise-and-production", description: "Deploy Claude in production with security, compliance, and team scaling strategies.", arc: "expert", order: 12, icon: "building-2", color: "#d4a053", estimatedHours: 5, prerequisites: ["advanced-workflows"], lessonCount: 7 },
  { title: "Capstone Project", slug: "capstone", description: "Plan, build, and ship a real project end-to-end using Claude Code.", arc: "expert", order: 13, icon: "trophy", color: "#d4a053", estimatedHours: 8, prerequisites: ["enterprise-and-production"], lessonCount: 4 },
];

function DifficultyBadge({ arc }: { arc: string }) {
  const labels: Record<string, string> = {
    foundation: "Beginner",
    practitioner: "Intermediate",
    "power-user": "Advanced",
    expert: "Expert",
  };

  const colors: Record<string, string> = {
    foundation: "bg-green/10 text-green border-green/20",
    practitioner: "bg-blue/10 text-blue border-blue/20",
    "power-user": "bg-purple/10 text-purple border-purple/20",
    expert: "bg-accent/10 text-accent border-accent/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        colors[arc]
      )}
    >
      {labels[arc]}
    </span>
  );
}

export default function CurriculumPage() {
  const { completedLessons } = useProgressStore();

  const arcGroups = ARC_DEFINITIONS.map((arc) => ({
    ...arc,
    modules: MODULES.filter((m) => m.arc === arc.id),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Curriculum" }]} className="mb-8" />

      {/* Page header */}
      <div className="mb-12">
        <h1 className="font-serif italic text-4xl sm:text-5xl mb-4">
          Curriculum
        </h1>
        <p className="text-lg text-muted max-w-3xl">
          13 modules organized into 4 skill arcs. Start from the beginning or
          jump to the topic you need. Each module builds on the last, taking you
          from fundamentals to production-grade expertise.
        </p>
      </div>

      {/* Arc sections */}
      <div className="space-y-16">
        {arcGroups.map((arc) => (
          <motion.section
            key={arc.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            {/* Arc header */}
            <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="h-1 w-8 rounded-full"
                  style={{ backgroundColor: arc.color }}
                />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: arc.color }}
                >
                  {arc.name}
                </h2>
                <span className="text-sm text-muted">{arc.range}</span>
              </div>
              <p className="text-muted max-w-2xl">{arc.description}</p>
            </motion.div>

            {/* Module cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {arc.modules.map((mod) => {
                // Simple progress calculation based on completed lessons containing this module slug
                const completedInModule = completedLessons.filter((l) =>
                  l.startsWith(`${mod.slug}/`)
                ).length;
                const progress =
                  mod.lessonCount > 0
                    ? Math.round(
                        (completedInModule / mod.lessonCount) * 100
                      )
                    : 0;

                return (
                  <motion.div
                    key={mod.slug}
                    variants={fadeUp}
                    transition={{ duration: 0.35 }}
                  >
                    <Link
                      href={`/curriculum/${mod.slug}`}
                      className={cn(
                        "group flex flex-col h-full rounded-xl p-5",
                        "bg-surface border border-border",
                        "hover:border-border-accent hover:bg-surface-2",
                        "transition-all duration-200"
                      )}
                    >
                      {/* Icon and order */}
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${mod.color}15`,
                            color: mod.color,
                          }}
                        >
                          {iconMap[mod.icon] ?? (
                            <BookOpen className="h-5 w-5" />
                          )}
                        </div>
                        <span className="text-xs text-muted font-mono">
                          {String(mod.order).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title and description */}
                      <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                        {mod.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 text-xs text-muted mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {mod.lessonCount} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {mod.estimatedHours}h
                        </span>
                        <DifficultyBadge arc={mod.arc} />
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: mod.color,
                          }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
