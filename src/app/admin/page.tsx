"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  BookOpen,
  Brain,
  Award,
  FileText,
  Plus,
  ArrowRight,
  Bell,
  Settings,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  testId: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  signedUpAt: string;
}

interface RecentCompletion {
  id: string;
  userName: string;
  lessonTitle: string;
  completedAt: string;
}

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  testId: string;
}

// ── Demo / placeholder data ─────────────────────────────────────────────

const DEMO_STATS: StatCard[] = [
  {
    label: "Total Users",
    value: 1_247,
    icon: Users,
    color: "text-blue",
    testId: "stat-total-users",
  },
  {
    label: "New Users (7d)",
    value: 89,
    icon: UserPlus,
    color: "text-green",
    testId: "stat-new-users",
  },
  {
    label: "Lessons Completed",
    value: 4_583,
    icon: BookOpen,
    color: "text-purple",
    testId: "stat-lessons-completed",
  },
  {
    label: "Quiz Attempts",
    value: 2_341,
    icon: Brain,
    color: "text-orange",
    testId: "stat-quiz-attempts",
  },
  {
    label: "Certificates Issued",
    value: 312,
    icon: Award,
    color: "text-accent",
    testId: "stat-certificates",
  },
  {
    label: "Published Lessons",
    value: 48,
    icon: FileText,
    color: "text-cyan",
    testId: "stat-published-lessons",
  },
];

const DEMO_RECENT_USERS: RecentUser[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    signedUpAt: "2026-04-04T14:32:00Z",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "m.johnson@example.com",
    signedUpAt: "2026-04-04T11:15:00Z",
  },
  {
    id: "3",
    name: "Amira Osman",
    email: "amira.o@example.com",
    signedUpAt: "2026-04-03T22:48:00Z",
  },
  {
    id: "4",
    name: "Lucas Weber",
    email: "l.weber@example.com",
    signedUpAt: "2026-04-03T18:05:00Z",
  },
  {
    id: "5",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    signedUpAt: "2026-04-03T09:22:00Z",
  },
];

const DEMO_RECENT_COMPLETIONS: RecentCompletion[] = [
  {
    id: "1",
    userName: "Sarah Chen",
    lessonTitle: "Introduction to Claude",
    completedAt: "2026-04-04T15:10:00Z",
  },
  {
    id: "2",
    userName: "Marcus Johnson",
    lessonTitle: "Prompt Engineering Basics",
    completedAt: "2026-04-04T13:45:00Z",
  },
  {
    id: "3",
    userName: "Amira Osman",
    lessonTitle: "Advanced Prompt Patterns",
    completedAt: "2026-04-04T10:30:00Z",
  },
  {
    id: "4",
    userName: "Lucas Weber",
    lessonTitle: "Working with Claude Code",
    completedAt: "2026-04-03T20:15:00Z",
  },
  {
    id: "5",
    userName: "Priya Sharma",
    lessonTitle: "Building AI Agents",
    completedAt: "2026-04-03T16:00:00Z",
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Create New Lesson",
    description: "Add a new lesson to the curriculum",
    href: "/admin/content/new",
    icon: Plus,
    testId: "quick-action-new-lesson",
  },
  {
    label: "View All Users",
    description: "Manage user accounts and roles",
    href: "/admin/users",
    icon: Users,
    testId: "quick-action-users",
  },
  {
    label: "Site Announcements",
    description: "Post updates for all learners",
    href: "/admin/announcements",
    icon: Bell,
    testId: "quick-action-announcements",
  },
  {
    label: "Site Settings",
    description: "Configure site preferences",
    href: "/admin/settings",
    icon: Settings,
    testId: "quick-action-settings",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Component ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatCard[]>(DEMO_STATS);
  const [recentUsers, setRecentUsers] =
    useState<RecentUser[]>(DEMO_RECENT_USERS);
  const [recentCompletions, setRecentCompletions] = useState<
    RecentCompletion[]
  >(DEMO_RECENT_COMPLETIONS);
  const [dataSource, setDataSource] = useState<"demo" | "live">("demo");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    async function fetchLiveData() {
      try {
        const supabase = createClient();

        // Fetch total users count
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch new users in last 7 days
        const sevenDaysAgo = new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();
        const { count: newUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo);

        // Fetch lesson completions
        const { count: lessonsCompleted } = await supabase
          .from("lesson_completions")
          .select("*", { count: "exact", head: true });

        // Fetch quiz attempts
        const { count: quizAttempts } = await supabase
          .from("quiz_attempts")
          .select("*", { count: "exact", head: true });

        // Fetch certificates
        const { count: certificates } = await supabase
          .from("certificates")
          .select("*", { count: "exact", head: true });

        // Fetch published lessons
        const { count: publishedLessons } = await supabase
          .from("lessons")
          .select("*", { count: "exact", head: true })
          .eq("published", true);

        // Only update if we got at least some data
        if (totalUsers !== null) {
          setStats([
            { ...DEMO_STATS[0], value: totalUsers ?? 0 },
            { ...DEMO_STATS[1], value: newUsers ?? 0 },
            { ...DEMO_STATS[2], value: lessonsCompleted ?? 0 },
            { ...DEMO_STATS[3], value: quizAttempts ?? 0 },
            { ...DEMO_STATS[4], value: certificates ?? 0 },
            { ...DEMO_STATS[5], value: publishedLessons ?? 0 },
          ]);
          setDataSource("live");
        }

        // Fetch recent signups
        const { data: recentSignups } = await supabase
          .from("profiles")
          .select("id, full_name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentSignups && recentSignups.length > 0) {
          setRecentUsers(
            recentSignups.map((u) => ({
              id: u.id,
              name: u.full_name ?? "Unknown",
              email: u.email ?? "",
              signedUpAt: u.created_at,
            }))
          );
        }

        // Fetch recent completions
        const { data: recentCompletionData } = await supabase
          .from("lesson_completions")
          .select("id, user_id, lesson_title, completed_at, profiles(full_name)")
          .order("completed_at", { ascending: false })
          .limit(5);

        if (recentCompletionData && recentCompletionData.length > 0) {
          setRecentCompletions(
            recentCompletionData.map((c) => ({
              id: c.id,
              userName:
                (c.profiles as unknown as { full_name: string })?.full_name ??
                "Unknown",
              lessonTitle: c.lesson_title ?? "Unknown Lesson",
              completedAt: c.completed_at,
            }))
          );
        }
      } catch {
        // Supabase tables not set up yet — keep demo data
      }
    }

    fetchLiveData();
  }, []);

  return (
    <div data-testid="admin-dashboard" className="space-y-8">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="mt-1 text-sm text-muted">
          {dataSource === "live"
            ? "Showing live data from Supabase"
            : "Showing demo data — connect Supabase to see live stats"}
        </p>
      </div>

      {/* Stats grid */}
      <div
        data-testid="admin-stats-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.testId}
              data-testid={stat.testId}
              className={cn(
                "rounded-xl border border-border bg-surface p-5",
                "transition-colors hover:border-accent/50"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Activity tables */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent signups */}
        <div
          data-testid="admin-recent-users"
          className="rounded-xl border border-border bg-surface"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Signups
            </h3>
            <Link
              href="/admin/users"
              data-testid="admin-recent-users-view-all"
              className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {formatRelativeTime(user.signedUpAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent completions */}
        <div
          data-testid="admin-recent-completions"
          className="rounded-xl border border-border bg-surface"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Lesson Completions
            </h3>
            <Link
              href="/admin/analytics"
              data-testid="admin-recent-completions-view-all"
              className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCompletions.map((completion) => (
              <div
                key={completion.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {completion.lessonTitle}
                  </p>
                  <p className="text-xs text-muted truncate">
                    by {completion.userName}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {formatRelativeTime(completion.completedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Quick Actions
        </h3>
        <div
          data-testid="admin-quick-actions"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.testId}
                href={action.href}
                data-testid={action.testId}
                className={cn(
                  "group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5",
                  "transition-colors hover:border-accent/50"
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {action.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Go</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
