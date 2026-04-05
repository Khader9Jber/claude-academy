"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Trophy,
  Flame,
  Award,
  Shield,
  ShieldOff,
  RotateCcw,
  Calendar,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────── */

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

interface LessonProgress {
  id: string;
  lesson_slug: string;
  module_slug: string;
  completed_at: string;
}

interface QuizScore {
  id: string;
  quiz_slug: string;
  score: number;
  total: number;
  attempted_at: string;
}

interface Certificate {
  id: string;
  type: string;
  issued_at: string;
}

/* ── Demo data ─────────────────────────────────────────────────────── */

const DEMO_PROFILE: UserProfile = {
  id: "demo-1",
  display_name: "Alice Johnson",
  avatar_url: null,
  email: "alice@example.com",
  role: "admin",
  created_at: "2025-09-01T10:00:00Z",
};

const DEMO_PROGRESS: LessonProgress[] = [
  {
    id: "lp-1",
    lesson_slug: "what-is-claude",
    module_slug: "getting-started",
    completed_at: "2025-09-02T14:00:00Z",
  },
  {
    id: "lp-2",
    lesson_slug: "first-prompt",
    module_slug: "getting-started",
    completed_at: "2025-09-03T10:30:00Z",
  },
  {
    id: "lp-3",
    lesson_slug: "prompt-engineering-basics",
    module_slug: "prompt-engineering",
    completed_at: "2025-09-05T09:00:00Z",
  },
  {
    id: "lp-4",
    lesson_slug: "system-prompts",
    module_slug: "prompt-engineering",
    completed_at: "2025-09-07T16:20:00Z",
  },
  {
    id: "lp-5",
    lesson_slug: "claude-api-intro",
    module_slug: "api-integration",
    completed_at: "2025-09-10T11:45:00Z",
  },
];

const DEMO_QUIZ_SCORES: QuizScore[] = [
  {
    id: "qs-1",
    quiz_slug: "getting-started-quiz",
    score: 9,
    total: 10,
    attempted_at: "2025-09-04T12:00:00Z",
  },
  {
    id: "qs-2",
    quiz_slug: "prompt-engineering-quiz",
    score: 7,
    total: 10,
    attempted_at: "2025-09-08T14:30:00Z",
  },
  {
    id: "qs-3",
    quiz_slug: "api-basics-quiz",
    score: 10,
    total: 10,
    attempted_at: "2025-09-11T10:00:00Z",
  },
];

const DEMO_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    type: "Getting Started",
    issued_at: "2025-09-04T12:30:00Z",
  },
  {
    id: "cert-2",
    type: "Prompt Engineering",
    issued_at: "2025-09-08T15:00:00Z",
  },
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  /* ── Fetch user data ──────────────────────────────────────────── */

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured() || userId.startsWith("demo-")) {
      setProfile(DEMO_PROFILE);
      setProgress(DEMO_PROGRESS);
      setQuizScores(DEMO_QUIZ_SCORES);
      setCertificates(DEMO_CERTIFICATES);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const [profileRes, progressRes, quizRes, certRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, display_name, avatar_url, email, role, created_at")
          .eq("id", userId)
          .single(),
        supabase
          .from("user_progress")
          .select("id, lesson_slug, module_slug, completed_at")
          .eq("user_id", userId)
          .order("completed_at", { ascending: false }),
        supabase
          .from("quiz_scores")
          .select("id, quiz_slug, score, total, attempted_at")
          .eq("user_id", userId)
          .order("attempted_at", { ascending: false }),
        supabase
          .from("certificates")
          .select("id, type, issued_at")
          .eq("user_id", userId)
          .order("issued_at", { ascending: false }),
      ]);

      if (profileRes.error || !profileRes.data) {
        setProfile(DEMO_PROFILE);
        setProgress(DEMO_PROGRESS);
        setQuizScores(DEMO_QUIZ_SCORES);
        setCertificates(DEMO_CERTIFICATES);
      } else {
        setProfile({
          ...profileRes.data,
          role:
            profileRes.data.role === "admin" ? "admin" : "user",
        } as UserProfile);
        setProgress((progressRes.data as LessonProgress[]) ?? []);
        setQuizScores((quizRes.data as QuizScore[]) ?? []);
        setCertificates((certRes.data as Certificate[]) ?? []);
      }
    } catch {
      setProfile(DEMO_PROFILE);
      setProgress(DEMO_PROGRESS);
      setQuizScores(DEMO_QUIZ_SCORES);
      setCertificates(DEMO_CERTIFICATES);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!adminLoading) fetchData();
  }, [adminLoading, fetchData]);

  /* ── Redirect non-admins ──────────────────────────────────────── */

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, adminLoading, router]);

  /* ── Actions ──────────────────────────────────────────────────── */

  const handleToggleRole = () => {
    setActionMsg(
      "Role changes require updating app_metadata via the Supabase service role. " +
        "Run the following CLI command:\n\n" +
        `npx supabase functions invoke set-role --body '{"user_id":"${userId}","role":"${profile?.role === "admin" ? "user" : "admin"}"}'` +
        "\n\nOr use the Supabase dashboard to update the user's app_metadata.role."
    );
  };

  const handleResetProgress = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }

    if (!isSupabaseConfigured() || userId.startsWith("demo-")) {
      setProgress([]);
      setQuizScores([]);
      setCertificates([]);
      setResetConfirm(false);
      setActionMsg("Progress has been reset (demo mode).");
      return;
    }

    try {
      const supabase = createClient();
      await Promise.all([
        supabase.from("user_progress").delete().eq("user_id", userId),
        supabase.from("quiz_scores").delete().eq("user_id", userId),
        supabase.from("certificates").delete().eq("user_id", userId),
      ]);
      setProgress([]);
      setQuizScores([]);
      setCertificates([]);
      setActionMsg("All progress has been reset for this user.");
    } catch {
      setActionMsg("Failed to reset progress. Please try again.");
    } finally {
      setResetConfirm(false);
    }
  };

  /* ── Derived stats ────────────────────────────────────────────── */

  const lessonsCompleted = progress.length;
  const quizzesTaken = quizScores.length;
  const currentStreak = calculateStreak(progress);
  const achievementsCount = certificates.length;

  /* ── Loading / guard ──────────────────────────────────────────── */

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!isAdmin || !profile) return null;

  const userInitial =
    profile.display_name?.[0]?.toUpperCase() ??
    profile.email[0]?.toUpperCase() ??
    "?";
  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ── Render ───────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <button
            data-testid="admin-user-back"
            onClick={() => router.push("/admin/users")}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </button>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            {profile.avatar_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.avatar_url}
                alt=""
                data-testid="admin-user-avatar"
                className="h-20 w-20 rounded-full border-2 border-border shrink-0"
              />
            ) : (
              <div
                data-testid="admin-user-avatar-placeholder"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/30 text-accent text-2xl font-bold shrink-0"
              >
                {userInitial}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1
                  data-testid="admin-user-name"
                  className="font-serif italic text-3xl sm:text-4xl text-foreground"
                >
                  {profile.display_name ?? "Anonymous"}
                </h1>
                <Badge
                  data-testid="admin-user-role"
                  variant={profile.role === "admin" ? "accent" : "default"}
                >
                  {profile.role === "admin" ? "Admin" : "User"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                <span
                  data-testid="admin-user-email"
                  className="inline-flex items-center gap-1.5"
                >
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </span>
                <span
                  data-testid="admin-user-joined"
                  className="inline-flex items-center gap-1.5"
                >
                  <Calendar className="h-4 w-4" />
                  Joined {joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              data-testid="admin-user-stat-lessons"
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <BookOpen className="h-5 w-5 mx-auto mb-1 text-blue" />
              <div className="text-2xl font-bold text-foreground">
                {lessonsCompleted}
              </div>
              <div className="text-xs text-muted">Lessons Completed</div>
            </div>
            <div
              data-testid="admin-user-stat-quizzes"
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <Trophy className="h-5 w-5 mx-auto mb-1 text-accent" />
              <div className="text-2xl font-bold text-foreground">
                {quizzesTaken}
              </div>
              <div className="text-xs text-muted">Quizzes Taken</div>
            </div>
            <div
              data-testid="admin-user-stat-streak"
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <Flame className="h-5 w-5 mx-auto mb-1 text-orange" />
              <div className="text-2xl font-bold text-foreground">
                {currentStreak}
              </div>
              <div className="text-xs text-muted">Day Streak</div>
            </div>
            <div
              data-testid="admin-user-stat-achievements"
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <Award className="h-5 w-5 mx-auto mb-1 text-purple" />
              <div className="text-2xl font-bold text-foreground">
                {achievementsCount}
              </div>
              <div className="text-xs text-muted">Achievements</div>
            </div>
          </div>

          {/* Action message */}
          {actionMsg && (
            <div
              data-testid="admin-user-action-msg"
              className="rounded-lg border border-blue/30 bg-blue/10 px-4 py-3 text-sm text-foreground whitespace-pre-wrap"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue mt-0.5 shrink-0" />
                <div>{actionMsg}</div>
              </div>
              <button
                className="mt-2 text-xs text-muted hover:text-accent underline"
                onClick={() => setActionMsg(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Admin actions */}
          <div
            data-testid="admin-user-actions"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Admin Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button
                data-testid="admin-user-toggle-role"
                variant="outline"
                onClick={handleToggleRole}
              >
                {profile.role === "admin" ? (
                  <>
                    <ShieldOff className="h-4 w-4" />
                    Remove Admin
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Make Admin
                  </>
                )}
              </Button>
              <Button
                data-testid="admin-user-reset-progress"
                variant={resetConfirm ? "destructive" : "outline"}
                onClick={handleResetProgress}
              >
                <RotateCcw className="h-4 w-4" />
                {resetConfirm
                  ? "Confirm Reset -- Click again"
                  : "Reset Progress"}
              </Button>
              {resetConfirm && (
                <Button
                  data-testid="admin-user-reset-cancel"
                  variant="ghost"
                  size="sm"
                  onClick={() => setResetConfirm(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Progress timeline */}
          <div
            data-testid="admin-user-progress-timeline"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Progress Timeline
            </h2>
            {progress.length === 0 ? (
              <p className="text-sm text-muted">
                No lessons completed yet.
              </p>
            ) : (
              <div className="space-y-3">
                {progress.map((p) => (
                  <div
                    key={p.id}
                    data-testid={`admin-user-progress-${p.id}`}
                    className="flex items-center gap-3 text-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-green shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground">
                        {formatSlug(p.lesson_slug)}
                      </span>
                      <span className="text-muted">
                        {" "}
                        in {formatSlug(p.module_slug)}
                      </span>
                    </div>
                    <span className="text-muted flex items-center gap-1 shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(p.completed_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz scores */}
          <div
            data-testid="admin-user-quiz-scores"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quiz Scores
            </h2>
            {quizScores.length === 0 ? (
              <p className="text-sm text-muted">
                No quizzes attempted yet.
              </p>
            ) : (
              <div className="space-y-3">
                {quizScores.map((q) => {
                  const pct = Math.round((q.score / q.total) * 100);
                  return (
                    <div
                      key={q.id}
                      data-testid={`admin-user-quiz-${q.id}`}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Trophy className="h-4 w-4 text-accent shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground">
                          {formatSlug(q.quiz_slug)}
                        </span>
                      </div>
                      <Badge
                        variant={
                          pct >= 80
                            ? "green"
                            : pct >= 50
                              ? "orange"
                              : "red"
                        }
                      >
                        {q.score}/{q.total} ({pct}%)
                      </Badge>
                      <span className="text-muted flex items-center gap-1 shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(q.attempted_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Certificates */}
          <div
            data-testid="admin-user-certificates"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Certificates Earned
            </h2>
            {certificates.length === 0 ? (
              <p className="text-sm text-muted">
                No certificates earned yet.
              </p>
            ) : (
              <div className="space-y-3">
                {certificates.map((c) => (
                  <div
                    key={c.id}
                    data-testid={`admin-user-cert-${c.id}`}
                    className="flex items-center gap-3 text-sm"
                  >
                    <FileText className="h-4 w-4 text-purple shrink-0" />
                    <span className="font-medium text-foreground flex-1">
                      {c.type}
                    </span>
                    <span className="text-muted flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(c.issued_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function calculateStreak(progress: LessonProgress[]): number {
  if (progress.length === 0) return 0;

  const days = new Set(
    progress.map((p) =>
      new Date(p.completed_at).toISOString().slice(0, 10)
    )
  );
  const sorted = [...days].sort().reverse();

  let streak = 0;
  const today = new Date();
  const checkDate = new Date(today.toISOString().slice(0, 10));

  for (const day of sorted) {
    const d = new Date(day);
    const diff = Math.floor(
      (checkDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
