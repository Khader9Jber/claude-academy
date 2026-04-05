"use client";

import { useProgressStore } from "@/lib/progress-store";

interface ModuleProgressBarProps {
  moduleSlug: string;
  lessonSlugs: string[];
  color: string;
}

export function ModuleProgressBar({
  lessonSlugs,
  color,
}: ModuleProgressBarProps) {
  const { getModuleProgress } = useProgressStore();
  const progress = getModuleProgress(lessonSlugs);

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-muted">Progress</span>
        <span className="font-medium text-foreground">{progress}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
