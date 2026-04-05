"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { Badge } from "@/components/ui";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ManagedContent {
  id: string;
  module_slug: string;
  lesson_slug: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  duration: number;
  order: number;
  published: boolean;
  updated_at: string;
}

type TabFilter = "all" | "published" | "drafts";

const DIFFICULTY_BADGE: Record<
  string,
  "green" | "blue" | "purple" | "orange"
> = {
  beginner: "green",
  intermediate: "blue",
  advanced: "purple",
  expert: "orange",
};

const MODULE_LABELS: Record<string, string> = {
  "claude-fundamentals": "Claude Fundamentals",
  "prompt-engineering": "Prompt Engineering",
  "claude-code-basics": "Claude Code Basics",
  "commands-and-navigation": "Commands & Navigation",
  "claude-md-and-config": "CLAUDE.md & Configuration",
  "session-and-context": "Session & Context",
  "git-and-workflows": "Git & Workflows",
  "mcp-fundamentals": "MCP Fundamentals",
  "hooks-and-automation": "Hooks & Automation",
  "agents-and-skills": "Agents & Skills",
  "advanced-workflows": "Advanced Workflows",
  "enterprise-and-production": "Enterprise & Production",
  capstone: "Capstone Project",
};

export default function ContentListPage() {
  const [content, setContent] = useState<ManagedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabFilter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }
    fetchContent();
  }, [supabaseReady]);

  async function fetchContent() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("managed_content")
      .select(
        "id, module_slug, lesson_slug, title, difficulty, duration, order, published, updated_at"
      )
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setContent(data as ManagedContent[]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("managed_content")
      .delete()
      .eq("id", id);
    if (!error) {
      setContent((prev) => prev.filter((c) => c.id !== id));
    }
    setDeleteId(null);
  }

  const filtered = content.filter((item) => {
    if (tab === "published") return item.published;
    if (tab === "drafts") return !item.published;
    return true;
  });

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "drafts", label: "Drafts" },
  ];

  return (
    <AdminGuard>
      <div data-testid="content-list-page" className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Content Management
          </h1>
          <Link
            href="/admin/content/new"
            data-testid="create-lesson-button"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
              "bg-accent text-background hover:bg-accent/90",
              "transition-colors duration-200"
            )}
          >
            <Plus className="h-4 w-4" />
            Create New Lesson
          </Link>
        </div>

        {/* Tabs */}
        <div
          data-testid="content-tab-filters"
          className="flex gap-1 rounded-lg bg-surface-2 p-1"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              data-testid={`content-tab-${t.key}`}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent" />
          </div>
        ) : !supabaseReady ? (
          <EmptyState
            message="Supabase is not configured"
            description="Admin content management requires Supabase. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables to get started."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            message="No managed content yet"
            description="Create your first lesson to start building content through the admin dashboard."
            showCta
          />
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table
                data-testid="content-table"
                className="w-full text-sm"
              >
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="px-4 py-3 text-left font-medium text-muted">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted">
                      Module
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted">
                      Difficulty
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      data-testid={`content-row-${item.id}`}
                      className="border-b border-border last:border-b-0 hover:bg-surface-2/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {item.title}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {MODULE_LABELS[item.module_slug] ?? item.module_slug}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={DIFFICULTY_BADGE[item.difficulty]}
                          data-testid={`difficulty-badge-${item.id}`}
                        >
                          {item.difficulty}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={item.published ? "green" : "orange"}
                          data-testid={`status-badge-${item.id}`}
                        >
                          {item.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(item.updated_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/content/${item.id}/edit`}
                            data-testid={`edit-button-${item.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface-2 border border-transparent hover:border-border transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <button
                            data-testid={`delete-button-${item.id}`}
                            onClick={() => setDeleteId(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-red hover:bg-red/10 border border-transparent hover:border-red/30 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Delete confirmation dialog */}
        {deleteId && (
          <div
            data-testid="delete-confirm-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div
              data-testid="delete-confirm-dialog"
              className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Delete Lesson
              </h3>
              <p className="mt-2 text-sm text-muted">
                Are you sure you want to delete this lesson? This action cannot
                be undone.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  data-testid="delete-cancel-button"
                  onClick={() => setDeleteId(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-2 border border-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  data-testid="delete-confirm-button"
                  onClick={() => handleDelete(deleteId)}
                  className="rounded-lg bg-red px-4 py-2 text-sm font-medium text-white hover:bg-red/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

function EmptyState({
  message,
  description,
  showCta = false,
}: {
  message: string;
  description: string;
  showCta?: boolean;
}) {
  return (
    <div
      data-testid="content-empty-state"
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 px-6 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
        <FileText className="h-6 w-6 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{message}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {showCta && (
        <Link
          href="/admin/content/new"
          data-testid="empty-state-create-button"
          className={cn(
            "mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
            "bg-accent text-background hover:bg-accent/90",
            "transition-colors duration-200"
          )}
        >
          <Plus className="h-4 w-4" />
          Create New Lesson
        </Link>
      )}
    </div>
  );
}
