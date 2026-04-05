"use client";

import { useState, useCallback, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/store";

interface LessonCompleteButtonProps {
  lessonSlug: string;
}

const PARTICLE_COLORS = [
  "bg-accent",
  "bg-green",
  "bg-blue",
  "bg-purple",
  "bg-orange",
  "bg-cyan",
];

export function LessonCompleteButton({ lessonSlug }: LessonCompleteButtonProps) {
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const isLessonComplete = useProgressStore((s) => s.isLessonComplete);

  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sync with store on mount (handles hydration)
  useEffect(() => {
    setIsComplete(isLessonComplete(lessonSlug));
  }, [isLessonComplete, lessonSlug]);

  const handleComplete = useCallback(() => {
    if (isComplete) return;

    completeLesson(lessonSlug);
    setIsComplete(true);
    setShowConfetti(true);

    setTimeout(() => setShowConfetti(false), 1000);
  }, [isComplete, completeLesson, lessonSlug]);

  if (isComplete) {
    return (
      <div className="mt-8 flex justify-center">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-6 py-3 text-green",
            showConfetti && "animate-confetti-pop"
          )}
        >
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Completed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-8 flex justify-center">
      {/* Confetti particles */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "absolute h-2 w-2 rounded-full animate-confetti-particle",
                PARTICLE_COLORS[i % PARTICLE_COLORS.length]
              )}
              style={{
                left: `${50 + (Math.random() - 0.5) * 60}%`,
                top: `${50 + (Math.random() - 0.5) * 40}%`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleComplete}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-green px-8 py-3 font-semibold text-white transition-all hover:bg-green/90 hover:scale-[1.02] active:scale-[0.98]",
          showConfetti && "animate-confetti-pop"
        )}
      >
        <CheckCircle className="h-5 w-5" />
        Mark as Complete
      </button>
    </div>
  );
}
