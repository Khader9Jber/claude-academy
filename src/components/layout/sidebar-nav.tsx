"use client";

import Link from "next/link";
import { CheckCircle, Circle, ChevronLeft } from "lucide-react";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
import type { Module } from "@/types/content";

interface SidebarNavProps {
  module: Module;
  currentLessonSlug: string;
}

export function SidebarNav({ module, currentLessonSlug }: SidebarNavProps) {
  const { isLessonComplete } = useProgressStore();

  return (
    <aside className="w-full">
      {/* Back to module link */}
      <Link
        href={`/curriculum/${module.slug}`}
        className={cn(
          "flex items-center gap-1.5 text-sm text-muted hover:text-foreground",
          "mb-4 transition-colors"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>{module.title}</span>
      </Link>

      {/* Lesson list */}
      <nav className="flex flex-col gap-0.5">
        {module.lessons.map((lesson) => {
          const isCurrent = lesson.slug === currentLessonSlug;
          const isComplete = isLessonComplete(
            `${module.slug}/${lesson.slug}`
          );

          return (
            <Link
              key={lesson.slug}
              href={`/curriculum/${module.slug}/${lesson.slug}`}
              className={cn(
                "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm",
                "transition-colors duration-200",
                isCurrent
                  ? "bg-surface-2 text-foreground border border-border-accent"
                  : "text-muted hover:text-foreground hover:bg-surface-2 border border-transparent"
              )}
            >
              {/* Completion icon */}
              <span className="mt-0.5 shrink-0">
                {isComplete ? (
                  <CheckCircle className="h-4 w-4 text-green" />
                ) : (
                  <Circle
                    className={cn(
                      "h-4 w-4",
                      isCurrent ? "text-accent" : "text-border-accent"
                    )}
                  />
                )}
              </span>

              {/* Lesson info */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className={cn(
                    "font-medium leading-tight truncate",
                    isCurrent && "text-foreground"
                  )}
                >
                  {lesson.order}. {lesson.title}
                </span>
                <span className="text-xs text-muted">
                  {formatDuration(lesson.duration)}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
