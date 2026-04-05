"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  BookOpen,
  Layers,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";
import { useProgressStore } from "@/lib/store";

export default function ProgressPage() {
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BarChart3 className="h-5 w-5" />
            </div>
            <Badge variant="accent">Dashboard</Badge>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4">
            Your Progress
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Track your learning journey through Claude Academy. Complete lessons,
            ace quizzes, and earn achievements as you master Claude from zero to hero.
          </p>

          {/* Stats summary */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            <div className="rounded-lg border border-border bg-surface p-4 text-center">
              <div className="flex justify-center mb-1">
                <BookOpen className="h-5 w-5 text-blue" />
              </div>
              <div className="text-2xl font-bold text-foreground">70</div>
              <div className="text-xs text-muted">Total Lessons</div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 text-center">
              <div className="flex justify-center mb-1">
                <Layers className="h-5 w-5 text-purple" />
              </div>
              <div className="text-2xl font-bold text-foreground">13</div>
              <div className="text-xs text-muted">Modules</div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 text-center">
              <div className="flex justify-center mb-1">
                <BarChart3 className="h-5 w-5 text-green" />
              </div>
              <div className="text-2xl font-bold text-foreground">4</div>
              <div className="text-xs text-muted">Skill Arcs</div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 text-center">
              <div className="flex justify-center mb-1">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">200+</div>
              <div className="text-xs text-muted">Exercises</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProgressDashboard />

          {/* Reset section */}
          <div className="mt-12 rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Reset Progress</h3>
                <p className="text-sm text-muted">
                  Clear all completed lessons, quiz scores, and achievements. This action
                  cannot be undone.
                </p>
              </div>

              {!showConfirm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(true)}
                  className="shrink-0 border-red/30 text-red hover:bg-red/10 hover:border-red/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset All
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-red">
                    <AlertTriangle className="h-4 w-4" />
                    Are you sure?
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleReset}
                  >
                    Yes, Reset
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
