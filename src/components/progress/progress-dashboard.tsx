"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  Flame,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/lib/store";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AchievementBadge } from "./achievement-badge";

export function ProgressDashboard() {
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const quizScores = useProgressStore((s) => s.quizScores);
  const streak = useProgressStore((s) => s.streak);
  const modules = useProgressStore((s) => s.modules);
  const achievements = useProgressStore((s) => s.achievements);

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 rounded-xl bg-surface" />
        <div className="h-48 rounded-xl bg-surface" />
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.totalLessons, 0);
  const totalCompleted = completedLessons.length;
  const overallPercentage = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const quizCount = Object.keys(quizScores).length;

  return (
    <div className="space-y-8">
      {/* Overall progress */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-6 text-xl font-bold text-text">Your Progress</h2>

        <div className="mb-6 flex items-center gap-6">
          {/* Circular-ish progress display */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-accent bg-accent/10">
            <span className="text-2xl font-bold text-accent">
              {overallPercentage}%
            </span>
          </div>

          <div className="flex-1">
            <ProgressBar
              value={totalCompleted}
              max={totalLessons}
              color="bg-accent"
              showLabel
              label="Overall Completion"
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-blue" />}
            label="Lessons"
            value={`${totalCompleted}/${totalLessons}`}
          />
          <StatCard
            icon={<Brain className="h-5 w-5 text-purple" />}
            label="Quizzes"
            value={String(quizCount)}
          />
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange" />}
            label="Streak"
            value={`${streak} day${streak !== 1 ? "s" : ""}`}
          />
          <StatCard
            icon={<Trophy className="h-5 w-5 text-accent" />}
            label="Achievements"
            value={`${achievements.filter((a) => a.unlocked).length}/${achievements.length}`}
          />
        </div>
      </div>

      {/* Module breakdown */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="mb-4 text-lg font-semibold text-text">Modules</h3>
        <div className="space-y-4">
          {modules.map((mod) => (
            <ProgressBar
              key={mod.moduleId}
              value={mod.completedLessons}
              max={mod.totalLessons}
              color="bg-accent"
              showLabel
              label={mod.moduleName}
            />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="mb-4 text-lg font-semibold text-text">Achievements</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {achievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              unlocked={achievement.unlocked}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3 text-center">
      <div className="mb-1 flex justify-center">{icon}</div>
      <div className="text-lg font-bold text-text">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
