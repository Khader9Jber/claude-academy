"use client";

import { CheckCircle, Circle } from "lucide-react";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

interface MarkCompleteButtonProps {
  lessonId: string;
  color: string;
}

export function MarkCompleteButton({ lessonId, color }: MarkCompleteButtonProps) {
  const { isLessonComplete, markLessonComplete } = useProgressStore();
  const completed = isLessonComplete(lessonId);

  return (
    <button
      onClick={() => {
        if (!completed) {
          markLessonComplete(lessonId);
        }
      }}
      disabled={completed}
      className={cn(
        "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold",
        "transition-all duration-200 border",
        completed
          ? "bg-green/10 border-green/30 text-green cursor-default"
          : "border-border hover:border-border-accent text-foreground hover:bg-surface-2 cursor-pointer"
      )}
      style={
        !completed
          ? { borderColor: `${color}40`, backgroundColor: `${color}08` }
          : undefined
      }
    >
      {completed ? (
        <>
          <CheckCircle className="h-5 w-5" />
          Lesson Complete
        </>
      ) : (
        <>
          <Circle className="h-5 w-5" />
          Mark as Complete
        </>
      )}
    </button>
  );
}
