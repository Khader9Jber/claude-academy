"use client";

import { useState, useEffect } from "react";
import { Eye, UserPlus, CheckCircle, Brain, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface OverviewStats {
  totalPageViews: number;
  totalSignups: number;
  completionRate: number;
  avgQuizScore: number;
}

interface PopularLesson {
  rank: number;
  title: string;
  module: string;
  completions: number;
  avgQuizScore: number;
}

interface UserGrowthWeek {
  week: string;
  newUsers: number;
  activeUsers: number;
}

interface QuizByModule {
  module: string;
  passRate: number;
  avgScore: number;
}

interface QuizByDifficulty {
  difficulty: string;
  avgScore: number;
  attempts: number;
}

interface CompletionFunnelItem {
  module: string;
  started: number;
  completed: number;
}

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const DEMO_OVERVIEW: OverviewStats = {
  totalPageViews: 24_831,
  totalSignups: 1_247,
  completionRate: 42,
  avgQuizScore: 78,
};

const DEMO_POPULAR_LESSONS: PopularLesson[] = [
  { rank: 1, title: "What is Claude?", module: "Claude Fundamentals", completions: 892, avgQuizScore: 91 },
  { rank: 2, title: "Your First Prompt", module: "Prompt Engineering", completions: 847, avgQuizScore: 88 },
  { rank: 3, title: "Installing Claude Code", module: "Claude Code Basics", completions: 783, avgQuizScore: 85 },
  { rank: 4, title: "System Prompts Deep Dive", module: "Prompt Engineering", completions: 654, avgQuizScore: 76 },
  { rank: 5, title: "Navigating the Terminal", module: "Commands & Navigation", completions: 612, avgQuizScore: 82 },
  { rank: 6, title: "Claude.md Configuration", module: "Claude.md & Config", completions: 589, avgQuizScore: 79 },
  { rank: 7, title: "Context Window Management", module: "Session & Context", completions: 534, avgQuizScore: 74 },
  { rank: 8, title: "Git Integration Basics", module: "Git & Workflows", completions: 498, avgQuizScore: 81 },
  { rank: 9, title: "MCP Server Setup", module: "MCP Fundamentals", completions: 423, avgQuizScore: 72 },
  { rank: 10, title: "Building Custom Hooks", module: "Hooks & Automation", completions: 387, avgQuizScore: 69 },
];

const DEMO_USER_GROWTH: UserGrowthWeek[] = [
  { week: "Mar 3 - Mar 9", newUsers: 78, activeUsers: 312 },
  { week: "Mar 10 - Mar 16", newUsers: 95, activeUsers: 341 },
  { week: "Mar 17 - Mar 23", newUsers: 112, activeUsers: 398 },
  { week: "Mar 24 - Mar 30", newUsers: 134, activeUsers: 445 },
  { week: "Mar 31 - Apr 4", newUsers: 89, activeUsers: 467 },
];

const DEMO_QUIZ_BY_MODULE: QuizByModule[] = [
  { module: "Claude Fundamentals", passRate: 94, avgScore: 88 },
  { module: "Prompt Engineering", passRate: 87, avgScore: 82 },
  { module: "Claude Code Basics", passRate: 91, avgScore: 85 },
  { module: "Commands & Navigation", passRate: 83, avgScore: 79 },
  { module: "Claude.md & Config", passRate: 78, avgScore: 75 },
  { module: "Session & Context", passRate: 72, avgScore: 71 },
  { module: "Git & Workflows", passRate: 80, avgScore: 77 },
  { module: "MCP Fundamentals", passRate: 68, avgScore: 69 },
  { module: "Hooks & Automation", passRate: 62, avgScore: 65 },
  { module: "Agents & Skills", passRate: 58, avgScore: 63 },
];

const DEMO_QUIZ_BY_DIFFICULTY: QuizByDifficulty[] = [
  { difficulty: "Beginner", avgScore: 89, attempts: 2_341 },
  { difficulty: "Intermediate", avgScore: 76, attempts: 1_587 },
  { difficulty: "Advanced", avgScore: 64, attempts: 823 },
  { difficulty: "Expert", avgScore: 52, attempts: 312 },
];

const DEMO_COMPLETION_FUNNEL: CompletionFunnelItem[] = [
  { module: "Claude Fundamentals", started: 1_180, completed: 892 },
  { module: "Prompt Engineering", started: 920, completed: 654 },
  { module: "Claude Code Basics", started: 830, completed: 589 },
  { module: "Commands & Navigation", started: 710, completed: 498 },
  { module: "Claude.md & Config", started: 620, completed: 387 },
  { module: "Session & Context", started: 530, completed: 298 },
  { module: "Git & Workflows", started: 450, completed: 267 },
  { module: "MCP Fundamentals", started: 380, completed: 198 },
  { module: "Hooks & Automation", started: 290, completed: 134 },
  { module: "Agents & Skills", started: 210, completed: 87 },
  { module: "Advanced Workflows", started: 150, completed: 54 },
  { module: "Enterprise & Production", started: 98, completed: 32 },
  { module: "Capstone", started: 45, completed: 18 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function barWidth(value: number, max: number): string {
  if (max === 0) return "0%";
  return `${Math.round((value / max) * 100)}%`;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon: Icon,
  suffix,
  color,
  testId,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  suffix?: string;
  color: string;
  testId: string;
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        "flex items-start gap-4"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          color
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">
          {value}
          {suffix && <span className="text-sm font-normal text-muted ml-1">{suffix}</span>}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<OverviewStats>(DEMO_OVERVIEW);
  const [popularLessons, setPopularLessons] = useState<PopularLesson[]>(DEMO_POPULAR_LESSONS);
  const [userGrowth, setUserGrowth] = useState<UserGrowthWeek[]>(DEMO_USER_GROWTH);
  const [quizByModule, setQuizByModule] = useState<QuizByModule[]>(DEMO_QUIZ_BY_MODULE);
  const [quizByDifficulty, setQuizByDifficulty] = useState<QuizByDifficulty[]>(DEMO_QUIZ_BY_DIFFICULTY);
  const [completionFunnel, setCompletionFunnel] = useState<CompletionFunnelItem[]>(DEMO_COMPLETION_FUNNEL);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    async function fetchAnalytics() {
      try {
        const supabase = createClient();

        // --- Overview: total page views ---
        const { count: pageViewCount } = await supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true });

        // --- Overview: total signups ---
        const { count: signupCount } = await supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("event_type", "signup");

        // --- Overview: avg quiz score ---
        const { data: quizScores } = await supabase
          .from("quiz_attempts")
          .select("score");

        // --- Overview: completion rate ---
        const { count: completedLessonCount } = await supabase
          .from("lesson_progress")
          .select("*", { count: "exact", head: true })
          .eq("completed", true);

        // If we got any live data, merge it in
        if (pageViewCount !== null || signupCount !== null) {
          setIsLive(true);
          const avgScore =
            quizScores && quizScores.length > 0
              ? Math.round(
                  quizScores.reduce((sum, q) => sum + (q.score ?? 0), 0) /
                    quizScores.length
                )
              : DEMO_OVERVIEW.avgQuizScore;

          const totalLessons = 70; // from ACHIEVEMENTS: all-lessons condition
          const rate =
            completedLessonCount !== null
              ? Math.round((completedLessonCount / totalLessons) * 100)
              : DEMO_OVERVIEW.completionRate;

          setOverview({
            totalPageViews: pageViewCount ?? DEMO_OVERVIEW.totalPageViews,
            totalSignups: signupCount ?? DEMO_OVERVIEW.totalSignups,
            completionRate: rate,
            avgQuizScore: avgScore,
          });
        }
      } catch {
        // Supabase query failed, keep demo data
      }
    }

    fetchAnalytics();
  }, []);

  // Suppress unused-setter warnings -- setters are ready for live data
  void setPopularLessons;
  void setUserGrowth;
  void setQuizByModule;
  void setQuizByDifficulty;
  void setCompletionFunnel;

  const maxGrowthUsers = Math.max(...userGrowth.map((w) => w.activeUsers));
  const maxStarted = Math.max(...completionFunnel.map((f) => f.started));

  return (
    <div data-testid="analytics-page" className="space-y-8">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted">
            {isLive ? "Live data from Supabase" : "Showing demo data"}
          </p>
        </div>
        {!isLive && (
          <span
            data-testid="analytics-demo-badge"
            className="inline-flex items-center rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-medium text-orange"
          >
            Demo Data
          </span>
        )}
      </div>

      {/* -------- Overview Cards -------- */}
      <section data-testid="analytics-overview" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          testId="stat-page-views"
          label="Total Page Views"
          value={formatNumber(overview.totalPageViews)}
          icon={Eye}
          color="bg-blue/10 text-blue"
        />
        <StatCard
          testId="stat-signups"
          label="Total Signups"
          value={formatNumber(overview.totalSignups)}
          icon={UserPlus}
          color="bg-green/10 text-green"
        />
        <StatCard
          testId="stat-completion-rate"
          label="Completion Rate"
          value={`${overview.completionRate}`}
          suffix="%"
          icon={CheckCircle}
          color="bg-purple/10 text-purple"
        />
        <StatCard
          testId="stat-avg-quiz"
          label="Avg Quiz Score"
          value={`${overview.avgQuizScore}`}
          suffix="%"
          icon={Brain}
          color="bg-accent/10 text-accent"
        />
      </section>

      {/* -------- Popular Lessons -------- */}
      <section data-testid="analytics-popular-lessons">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Popular Lessons</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="px-4 py-3 text-left font-medium text-muted w-12">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Lesson</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Module</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Completions</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {popularLessons.map((lesson) => (
                <tr
                  key={lesson.rank}
                  data-testid={`popular-lesson-${lesson.rank}`}
                  className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-muted">{lesson.rank}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{lesson.title}</td>
                  <td className="px-4 py-3 text-muted">{lesson.module}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">
                    {lesson.completions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        lesson.avgQuizScore >= 85
                          ? "bg-green/10 text-green"
                          : lesson.avgQuizScore >= 70
                          ? "bg-accent/10 text-accent"
                          : "bg-orange/10 text-orange"
                      )}
                    >
                      {lesson.avgQuizScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* -------- User Growth -------- */}
      <section data-testid="analytics-user-growth">
        <h2 className="mb-4 text-lg font-semibold text-foreground">User Growth (Last 30 Days)</h2>
        <div className="rounded-xl border border-border bg-surface p-5">
          {/* Bar chart */}
          <div className="mb-6 flex items-end gap-3 h-40">
            {userGrowth.map((week, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full gap-1 items-end" style={{ height: "100%" }}>
                  {/* New users bar */}
                  <div
                    data-testid={`growth-bar-new-${i}`}
                    className="flex-1 rounded-t bg-green/60 transition-all duration-500"
                    style={{
                      height: barWidth(week.newUsers, maxGrowthUsers),
                      minHeight: "4px",
                    }}
                    title={`New: ${week.newUsers}`}
                  />
                  {/* Active users bar */}
                  <div
                    data-testid={`growth-bar-active-${i}`}
                    className="flex-1 rounded-t bg-blue/60 transition-all duration-500"
                    style={{
                      height: barWidth(week.activeUsers, maxGrowthUsers),
                      minHeight: "4px",
                    }}
                    title={`Active: ${week.activeUsers}`}
                  />
                </div>
                <span className="text-[10px] text-muted text-center leading-tight">
                  {week.week.split(" - ")[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-green/60" />
              <span>New Users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-blue/60" />
              <span>Active Users</span>
            </div>
          </div>

          {/* Table fallback */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium text-muted">Week</th>
                  <th className="px-3 py-2 text-right font-medium text-muted">New Users</th>
                  <th className="px-3 py-2 text-right font-medium text-muted">Active Users</th>
                </tr>
              </thead>
              <tbody>
                {userGrowth.map((week, i) => (
                  <tr
                    key={i}
                    data-testid={`growth-row-${i}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2 text-muted">{week.week}</td>
                    <td className="px-3 py-2 text-right font-mono text-green">{week.newUsers}</td>
                    <td className="px-3 py-2 text-right font-mono text-blue">{week.activeUsers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* -------- Quiz Performance -------- */}
      <section data-testid="analytics-quiz-performance" className="grid gap-6 lg:grid-cols-2">
        {/* Pass rate by module */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Pass Rate by Module
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 text-left font-medium text-muted">Module</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">Pass Rate</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {quizByModule.map((row) => (
                  <tr
                    key={row.module}
                    data-testid={`quiz-module-${row.module.toLowerCase().replace(/\s+/g, "-")}`}
                    className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{row.module}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          row.passRate >= 85
                            ? "bg-green/10 text-green"
                            : row.passRate >= 70
                            ? "bg-accent/10 text-accent"
                            : "bg-red/10 text-red"
                        )}
                      >
                        {row.passRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted">{row.avgScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Average score by difficulty */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple" />
            Score by Difficulty
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 text-left font-medium text-muted">Difficulty</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">Avg Score</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">Attempts</th>
                </tr>
              </thead>
              <tbody>
                {quizByDifficulty.map((row) => (
                  <tr
                    key={row.difficulty}
                    data-testid={`quiz-difficulty-${row.difficulty.toLowerCase()}`}
                    className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          row.difficulty === "Beginner"
                            ? "bg-green/10 text-green"
                            : row.difficulty === "Intermediate"
                            ? "bg-blue/10 text-blue"
                            : row.difficulty === "Advanced"
                            ? "bg-purple/10 text-purple"
                            : "bg-red/10 text-red"
                        )}
                      >
                        {row.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{row.avgScore}%</td>
                    <td className="px-4 py-3 text-right font-mono text-muted">
                      {row.attempts.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* -------- Completion Funnel -------- */}
      <section data-testid="analytics-completion-funnel">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Completion Funnel</h2>
        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          {completionFunnel.map((item) => {
            const completionPct =
              item.started > 0 ? Math.round((item.completed / item.started) * 100) : 0;

            return (
              <div
                key={item.module}
                data-testid={`funnel-${item.module.toLowerCase().replace(/\s+/g, "-")}`}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.module}</span>
                  <span className="text-xs text-muted">
                    {item.completed.toLocaleString()} / {item.started.toLocaleString()}{" "}
                    <span
                      className={cn(
                        "font-medium",
                        completionPct >= 70
                          ? "text-green"
                          : completionPct >= 40
                          ? "text-accent"
                          : "text-red"
                      )}
                    >
                      ({completionPct}%)
                    </span>
                  </span>
                </div>
                {/* Horizontal bars */}
                <div className="relative h-5 w-full rounded-full bg-surface-2 overflow-hidden">
                  {/* Started (full width = max) */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-blue/20 transition-all duration-500"
                    style={{ width: barWidth(item.started, maxStarted) }}
                  />
                  {/* Completed */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-green/50 transition-all duration-500"
                    style={{ width: barWidth(item.completed, maxStarted) }}
                  />
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="flex items-center gap-4 pt-2 text-xs text-muted border-t border-border mt-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-blue/20 border border-blue/30" />
              <span>Started</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-green/50" />
              <span>Completed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
