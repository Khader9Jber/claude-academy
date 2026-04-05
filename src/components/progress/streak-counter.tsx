"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/store";

export function StreakCounter() {
  const streak = useProgressStore((s) => s.streak);
  const longestStreak = useProgressStore((s) => s.longestStreak);

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-1.5">
        <div className="h-5 w-5 animate-pulse rounded bg-surface" />
        <div className="h-4 w-8 animate-pulse rounded bg-surface" />
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-1.5",
          streak > 0 ? "bg-orange/10" : "bg-surface-2"
        )}
      >
        <Flame
          className={cn(
            "h-5 w-5",
            streak > 0 ? "text-orange" : "text-muted"
          )}
        />
        <span
          className={cn(
            "text-lg font-bold",
            streak > 0 ? "text-orange" : "text-muted"
          )}
        >
          {streak}
        </span>
        <span className="text-sm text-muted">
          day{streak !== 1 ? "s" : ""}
        </span>
      </div>
      {longestStreak > 0 && (
        <span className="text-xs text-muted">
          Longest: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
