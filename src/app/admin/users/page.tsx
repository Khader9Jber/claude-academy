"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
} from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────── */

interface UserRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string;
  role: "admin" | "user";
  created_at: string;
  lessons_completed: number;
}

/* ── Demo data (when Supabase is not configured) ───────────────────── */

const DEMO_USERS: UserRow[] = [
  {
    id: "demo-1",
    display_name: "Alice Johnson",
    avatar_url: null,
    email: "alice@example.com",
    role: "admin",
    created_at: "2025-09-01T10:00:00Z",
    lessons_completed: 24,
  },
  {
    id: "demo-2",
    display_name: "Bob Smith",
    avatar_url: null,
    email: "bob@example.com",
    role: "user",
    created_at: "2025-10-15T08:30:00Z",
    lessons_completed: 12,
  },
  {
    id: "demo-3",
    display_name: "Clara Reyes",
    avatar_url: null,
    email: "clara@example.com",
    role: "user",
    created_at: "2025-11-20T14:00:00Z",
    lessons_completed: 7,
  },
  {
    id: "demo-4",
    display_name: "David Kim",
    avatar_url: null,
    email: "david.k@example.com",
    role: "user",
    created_at: "2026-01-05T09:15:00Z",
    lessons_completed: 18,
  },
  {
    id: "demo-5",
    display_name: "Emilia Torres",
    avatar_url: null,
    email: "emilia.t@example.com",
    role: "user",
    created_at: "2026-02-14T16:45:00Z",
    lessons_completed: 3,
  },
  {
    id: "demo-6",
    display_name: null,
    avatar_url: null,
    email: "anonymous@example.com",
    role: "user",
    created_at: "2026-03-01T11:00:00Z",
    lessons_completed: 0,
  },
];

const PAGE_SIZE = 10;

/* ── Component ─────────────────────────────────────────────────────── */

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ── Fetch users ──────────────────────────────────────────────── */

  useEffect(() => {
    async function fetchUsers() {
      if (!isSupabaseConfigured()) {
        setUsers(DEMO_USERS);
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        // Fetch profiles with joined progress counts
        const { data: profiles, error: profileErr } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url, email, role, created_at");

        if (profileErr) {
          setUsers(DEMO_USERS);
          setLoading(false);
          return;
        }

        // Fetch lesson completion counts per user
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("user_id");

        const countMap: Record<string, number> = {};
        if (progressData) {
          for (const row of progressData) {
            countMap[row.user_id] = (countMap[row.user_id] ?? 0) + 1;
          }
        }

        const rows: UserRow[] = (profiles ?? []).map((p) => ({
          id: p.id,
          display_name: p.display_name,
          avatar_url: p.avatar_url,
          email: p.email ?? "",
          role: p.role === "admin" ? "admin" : "user",
          created_at: p.created_at,
          lessons_completed: countMap[p.id] ?? 0,
        }));

        setUsers(rows);
      } catch {
        setError("Failed to load users.");
        setUsers(DEMO_USERS);
      } finally {
        setLoading(false);
      }
    }

    if (!adminLoading) {
      fetchUsers();
    }
  }, [adminLoading]);

  /* ── Redirect non-admins ──────────────────────────────────────── */

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, adminLoading, router]);

  /* ── Filtered & paginated data ────────────────────────────────── */

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.display_name?.toLowerCase().includes(q) ?? false) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ── Loading / guard ──────────────────────────────────────────── */

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  /* ── Render ───────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Shield className="h-5 w-5" />
            </div>
            <Badge variant="accent">Admin</Badge>
          </div>
          <h1
            data-testid="admin-users-heading"
            className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4"
          >
            User Management
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            View and manage all registered users, track progress, and assign
            roles.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                data-testid="admin-users-search"
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-border bg-surface-2 pl-10 pr-4 py-2",
                  "text-sm text-foreground placeholder:text-muted/60",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                  "transition-colors"
                )}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
              {error}
            </div>
          )}

          {/* Table */}
          <div
            data-testid="admin-users-table"
            className="rounded-xl border border-border bg-surface overflow-hidden"
          >
            {/* Header */}
            <div className="hidden sm:grid grid-cols-[3rem_1fr_1fr_6rem_7rem_6rem_5rem] gap-4 px-4 py-3 border-b border-border bg-surface-2 text-xs font-medium text-muted uppercase tracking-wider">
              <div />
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Joined</div>
              <div className="text-center">Lessons</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Rows */}
            {paginated.length === 0 ? (
              <div className="px-4 py-12 text-center text-muted">
                <Users className="h-10 w-10 mx-auto mb-3 text-muted/50" />
                <p>No users found.</p>
              </div>
            ) : (
              paginated.map((user) => (
                <div
                  key={user.id}
                  data-testid={`admin-user-row-${user.id}`}
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-[3rem_1fr_1fr_6rem_7rem_6rem_5rem] gap-2 sm:gap-4 px-4 py-3 items-center",
                    "border-b border-border last:border-b-0",
                    "hover:bg-surface-2/50 transition-colors"
                  )}
                >
                  {/* Avatar */}
                  <div className="hidden sm:flex items-center justify-center">
                    {user.avatar_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full border border-border"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 border border-border text-sm font-medium text-muted">
                        {user.display_name?.[0]?.toUpperCase() ??
                          user.email[0]?.toUpperCase() ??
                          "?"}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-sm font-medium text-foreground truncate">
                    {user.display_name ?? "Anonymous"}
                  </div>

                  {/* Email */}
                  <div className="text-sm text-muted truncate">{user.email}</div>

                  {/* Role badge */}
                  <div>
                    <Badge
                      data-testid={`admin-user-role-${user.id}`}
                      variant={user.role === "admin" ? "accent" : "default"}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                  </div>

                  {/* Joined */}
                  <div className="text-sm text-muted">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* Lessons completed */}
                  <div className="text-sm font-medium text-foreground text-center">
                    {user.lessons_completed}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center">
                    <Button
                      data-testid={`admin-user-view-${user.id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/users/${user.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              data-testid="admin-users-pagination"
              className="flex items-center justify-between mt-6"
            >
              <p className="text-sm text-muted">
                Showing {(page - 1) * PAGE_SIZE + 1}&ndash;
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  data-testid="admin-users-prev"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="text-sm text-muted px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  data-testid="admin-users-next"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
