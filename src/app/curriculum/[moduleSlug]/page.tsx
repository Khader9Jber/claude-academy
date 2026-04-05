import Link from "next/link";
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
  CheckCircle,
  Circle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
import { getModules, getModule } from "@/lib/content";
import { Breadcrumb } from "@/components/layout";
import { ModuleProgressBar } from "./module-progress";

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="h-8 w-8" />,
  "pen-tool": <PenTool className="h-8 w-8" />,
  terminal: <Terminal className="h-8 w-8" />,
  command: <Command className="h-8 w-8" />,
  "file-cog": <FileCog className="h-8 w-8" />,
  layers: <Layers className="h-8 w-8" />,
  "git-branch": <GitBranch className="h-8 w-8" />,
  plug: <Plug className="h-8 w-8" />,
  webhook: <Webhook className="h-8 w-8" />,
  bot: <Bot className="h-8 w-8" />,
  workflow: <Workflow className="h-8 w-8" />,
  "building-2": <Building2 className="h-8 w-8" />,
  trophy: <Trophy className="h-8 w-8" />,
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-green/10 text-green border-green/20",
  intermediate: "bg-blue/10 text-blue border-blue/20",
  advanced: "bg-purple/10 text-purple border-purple/20",
  expert: "bg-accent/10 text-accent border-accent/20",
};

export async function generateStaticParams() {
  const modules = getModules();
  return modules.map((m) => ({ moduleSlug: m.slug }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const mod = getModule(moduleSlug);

  if (!mod) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Module not found</h1>
        <Link href="/curriculum" className="text-accent hover:underline">
          Back to Curriculum
        </Link>
      </div>
    );
  }

  const allModules = getModules();
  const currentIndex = allModules.findIndex((m) => m.slug === moduleSlug);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < allModules.length - 1
      ? allModules[currentIndex + 1]
      : null;

  const arcLabels: Record<string, string> = {
    foundation: "Foundation",
    practitioner: "Practitioner",
    "power-user": "Power User",
    expert: "Expert",
  };

  // Gather all unique objectives from lessons
  const allObjectives = mod.lessons.flatMap((l) => l.objectives);
  const uniqueObjectives = [...new Set(allObjectives)].slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: mod.title },
        ]}
        className="mb-8"
      />

      {/* Module header */}
      <div className="mb-10">
        <div className="flex items-start gap-5 mb-6">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: `${mod.color}15`,
              color: mod.color,
            }}
          >
            {iconMap[mod.icon] ?? <BookOpen className="h-8 w-8" />}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: mod.color }}
              >
                {arcLabels[mod.arc]} Arc
              </span>
              <span className="text-xs text-muted font-mono">
                Module {String(mod.order).padStart(2, "0")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {mod.title}
            </h1>
          </div>
        </div>

        <p className="text-lg text-muted max-w-3xl leading-relaxed mb-6">
          {mod.description}
        </p>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {mod.lessons.length} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            ~{mod.estimatedHours} hours
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
              difficultyColors[
                mod.arc === "foundation"
                  ? "beginner"
                  : mod.arc === "practitioner"
                    ? "intermediate"
                    : mod.arc === "power-user"
                      ? "advanced"
                      : "expert"
              ]
            )}
          >
            {mod.arc === "foundation"
              ? "Beginner"
              : mod.arc === "practitioner"
                ? "Intermediate"
                : mod.arc === "power-user"
                  ? "Advanced"
                  : "Expert"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <ModuleProgressBar moduleSlug={mod.slug} lessonSlugs={mod.lessons.map((l) => `${mod.slug}/${l.slug}`)} color={mod.color} />
        </div>
      </div>

      {/* Prerequisites */}
      {mod.prerequisites.length > 0 && (
        <div className="mb-10 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            Prerequisites
          </h2>
          <div className="flex flex-wrap gap-2">
            {mod.prerequisites.map((prereq) => {
              const prereqModule = allModules.find((m) => m.slug === prereq);
              return (
                <Link
                  key={prereq}
                  href={`/curriculum/${prereq}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm",
                    "bg-surface-2 border border-border text-muted",
                    "hover:text-foreground hover:border-border-accent transition-colors"
                  )}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {prereqModule?.title ?? prereq}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Learning objectives */}
      {uniqueObjectives.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">
            What you&apos;ll learn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {uniqueObjectives.map((obj) => (
              <div
                key={obj}
                className="flex items-start gap-2.5 text-sm text-muted"
              >
                <CheckCircle
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: mod.color }}
                />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson list */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Lessons</h2>
        <div className="space-y-2">
          {mod.lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/curriculum/${mod.slug}/${lesson.slug}`}
              className={cn(
                "group flex items-center gap-4 rounded-xl p-4",
                "bg-surface border border-border",
                "hover:border-border-accent hover:bg-surface-2",
                "transition-all duration-200"
              )}
            >
              {/* Lesson number */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: `${mod.color}10`,
                  color: mod.color,
                }}
              >
                {String(lesson.order).padStart(2, "0")}
              </div>

              {/* Lesson info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground group-hover:text-accent transition-colors truncate">
                  {lesson.title}
                </h3>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted">
                  <span>{formatDuration(lesson.duration)}</span>
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-xs border",
                      difficultyColors[lesson.difficulty]
                    )}
                  >
                    {lesson.difficulty}
                  </span>
                </div>
              </div>

              {/* Status */}
              <Circle className="h-5 w-5 shrink-0 text-border-accent group-hover:text-muted transition-colors" />
            </Link>
          ))}

          {/* If no lessons exist yet, show placeholders based on lesson count from metadata */}
          {mod.lessons.length === 0 && (
            <div className="text-center py-12 text-muted">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">Lessons coming soon</p>
              <p className="text-sm mt-1">
                This module will have content added in upcoming updates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Module navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {prevModule ? (
          <Link
            href={`/curriculum/${prevModule.slug}`}
            className={cn(
              "flex items-center gap-2 text-sm text-muted hover:text-foreground",
              "transition-colors"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            <div className="text-left">
              <span className="text-xs text-muted block">Previous</span>
              <span className="font-medium">{prevModule.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextModule ? (
          <Link
            href={`/curriculum/${nextModule.slug}`}
            className={cn(
              "flex items-center gap-2 text-sm text-muted hover:text-foreground",
              "transition-colors"
            )}
          >
            <div className="text-right">
              <span className="text-xs text-muted block">Next</span>
              <span className="font-medium">{nextModule.title}</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
