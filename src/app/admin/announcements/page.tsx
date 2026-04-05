"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Wrench,
} from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/admin";

/* ── Types ─────────────────────────────────────────────────────────── */

type AnnouncementType = Announcement["type"];

interface FormData {
  title: string;
  content: string;
  type: AnnouncementType;
  active: boolean;
  starts_at: string;
  ends_at: string;
}

const EMPTY_FORM: FormData = {
  title: "",
  content: "",
  type: "info",
  active: true,
  starts_at: new Date().toISOString().slice(0, 10),
  ends_at: "",
};

/* ── Demo data ─────────────────────────────────────────────────────── */

const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome to Claude Academy!",
    content:
      "We are excited to launch Claude Academy. Start your learning journey today with our comprehensive curriculum.",
    type: "info",
    active: true,
    starts_at: "2025-09-01T00:00:00Z",
    ends_at: null,
    created_at: "2025-09-01T00:00:00Z",
    created_by: null,
  },
  {
    id: "ann-2",
    title: "Scheduled Maintenance",
    content:
      "We will be performing scheduled maintenance on Saturday from 2:00 AM to 6:00 AM UTC. The platform may be briefly unavailable.",
    type: "maintenance",
    active: true,
    starts_at: "2026-04-05T02:00:00Z",
    ends_at: "2026-04-05T06:00:00Z",
    created_at: "2026-04-02T10:00:00Z",
    created_by: null,
  },
  {
    id: "ann-3",
    title: "New Module: Agent Workflows",
    content:
      "Our latest module on building AI agent workflows is now live. Check it out in the curriculum!",
    type: "success",
    active: false,
    starts_at: "2026-03-15T00:00:00Z",
    ends_at: "2026-03-31T00:00:00Z",
    created_at: "2026-03-14T12:00:00Z",
    created_by: null,
  },
];

/* ── Badge variant mapping ─────────────────────────────────────────── */

const TYPE_VARIANT: Record<AnnouncementType, "blue" | "orange" | "green" | "red"> = {
  info: "blue",
  warning: "orange",
  success: "green",
  maintenance: "red",
};

const TYPE_ICON: Record<AnnouncementType, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  maintenance: Wrench,
};

/* ── Component ─────────────────────────────────────────────────────── */

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ── Fetch announcements ──────────────────────────────────────── */

  const fetchAnnouncements = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setAnnouncements(DEMO_ANNOUNCEMENTS);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setAnnouncements(DEMO_ANNOUNCEMENTS);
      } else {
        setAnnouncements((data as Announcement[]) ?? []);
      }
    } catch {
      setAnnouncements(DEMO_ANNOUNCEMENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!adminLoading) fetchAnnouncements();
  }, [adminLoading, fetchAnnouncements]);

  /* ── Redirect non-admins ──────────────────────────────────────── */

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, adminLoading, router]);

  /* ── Form handlers ────────────────────────────────────────────── */

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setForm({
      title: ann.title,
      content: ann.content,
      type: ann.type,
      active: ann.active,
      starts_at: ann.starts_at.slice(0, 10),
      ends_at: ann.ends_at?.slice(0, 10) ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type,
      active: form.active,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
    };

    if (!isSupabaseConfigured()) {
      // Demo mode: update local state
      if (editingId) {
        setAnnouncements((prev) =>
          prev.map((a) =>
            a.id === editingId
              ? { ...a, ...payload }
              : a
          )
        );
      } else {
        const newAnn: Announcement = {
          id: `ann-${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
          created_by: null,
        };
        setAnnouncements((prev) => [newAnn, ...prev]);
      }
      closeForm();
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();

      if (editingId) {
        await supabase
          .from("announcements")
          .update(payload)
          .eq("id", editingId);
      } else {
        await supabase.from("announcements").insert(payload);
      }

      await fetchAnnouncements();
      closeForm();
    } catch {
      // Silently fail — form stays open
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle active ────────────────────────────────────────────── */

  const handleToggleActive = async (ann: Announcement) => {
    const newActive = !ann.active;

    if (!isSupabaseConfigured()) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === ann.id ? { ...a, active: newActive } : a
        )
      );
      return;
    }

    try {
      const supabase = createClient();
      await supabase
        .from("announcements")
        .update({ active: newActive })
        .eq("id", ann.id);
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === ann.id ? { ...a, active: newActive } : a
        )
      );
    } catch {
      // Silently fail
    }
  };

  /* ── Delete ───────────────────────────────────────────────────── */

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    if (!isSupabaseConfigured()) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirm(null);
      return;
    }

    try {
      const supabase = createClient();
      await supabase.from("announcements").delete().eq("id", id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // Silently fail
    } finally {
      setDeleteConfirm(null);
    }
  };

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
            data-testid="admin-announcements-heading"
            className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4"
          >
            Announcements
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Create and manage site-wide announcements displayed to all users.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Create button */}
          <div className="flex justify-end">
            <Button
              data-testid="admin-announcements-create"
              onClick={openCreate}
            >
              <Plus className="h-4 w-4" />
              Create Announcement
            </Button>
          </div>

          {/* Inline form */}
          {showForm && (
            <div
              data-testid="admin-announcements-form"
              className="rounded-xl border border-border bg-surface p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingId ? "Edit Announcement" : "New Announcement"}
                </h2>
                <button
                  data-testid="admin-announcements-form-close"
                  onClick={closeForm}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="ann-title"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Title
                </label>
                <input
                  id="ann-title"
                  data-testid="admin-announcements-title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className={cn(
                    "w-full rounded-lg border border-border bg-surface-2 px-4 py-2",
                    "text-sm text-foreground placeholder:text-muted/60",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                    "transition-colors"
                  )}
                  placeholder="Announcement title..."
                />
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="ann-content"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Content
                </label>
                <textarea
                  id="ann-content"
                  data-testid="admin-announcements-content"
                  rows={4}
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  className={cn(
                    "w-full rounded-lg border border-border bg-surface-2 px-4 py-2",
                    "text-sm text-foreground placeholder:text-muted/60",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                    "transition-colors resize-y"
                  )}
                  placeholder="Write your announcement..."
                />
              </div>

              {/* Type selector + Active toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ann-type"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Type
                  </label>
                  <select
                    id="ann-type"
                    data-testid="admin-announcements-type"
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        type: e.target.value as AnnouncementType,
                      }))
                    }
                    className={cn(
                      "w-full rounded-lg border border-border bg-surface-2 px-4 py-2",
                      "text-sm text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                      "transition-colors"
                    )}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-sm font-medium text-foreground">
                      Active
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.active}
                      data-testid="admin-announcements-active-toggle"
                      onClick={() =>
                        setForm((f) => ({ ...f, active: !f.active }))
                      }
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        form.active ? "bg-accent" : "bg-surface-3"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                          form.active ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </label>
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ann-start"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Start Date
                  </label>
                  <input
                    id="ann-start"
                    data-testid="admin-announcements-start-date"
                    type="date"
                    value={form.starts_at}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, starts_at: e.target.value }))
                    }
                    className={cn(
                      "w-full rounded-lg border border-border bg-surface-2 px-4 py-2",
                      "text-sm text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                      "transition-colors"
                    )}
                  />
                </div>
                <div>
                  <label
                    htmlFor="ann-end"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    End Date{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    id="ann-end"
                    data-testid="admin-announcements-end-date"
                    type="date"
                    value={form.ends_at}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ends_at: e.target.value }))
                    }
                    className={cn(
                      "w-full rounded-lg border border-border bg-surface-2 px-4 py-2",
                      "text-sm text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                      "transition-colors"
                    )}
                  />
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  data-testid="admin-announcements-cancel"
                  variant="ghost"
                  onClick={closeForm}
                >
                  Cancel
                </Button>
                <Button
                  data-testid="admin-announcements-save"
                  onClick={handleSave}
                  disabled={
                    saving || !form.title.trim() || !form.content.trim()
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update"
                      : "Create"}
                </Button>
              </div>
            </div>
          )}

          {/* Announcements list */}
          {announcements.length === 0 ? (
            <div className="text-center py-16">
              <Megaphone className="h-12 w-12 mx-auto text-muted mb-4" />
              <p className="text-muted">No announcements yet.</p>
              <p className="text-sm text-muted/60 mt-2">
                Create your first announcement to communicate with users.
              </p>
            </div>
          ) : (
            <div
              data-testid="admin-announcements-list"
              className="space-y-4"
            >
              {announcements.map((ann) => {
                const Icon = TYPE_ICON[ann.type];
                return (
                  <div
                    key={ann.id}
                    data-testid={`admin-announcement-${ann.id}`}
                    className={cn(
                      "rounded-xl border bg-surface p-5 transition-colors",
                      ann.active
                        ? "border-border"
                        : "border-border/50 opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <Icon
                          className={cn(
                            "h-5 w-5 mt-0.5 shrink-0",
                            `text-${TYPE_VARIANT[ann.type]}`
                          )}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-sm font-semibold text-foreground">
                              {ann.title}
                            </h3>
                            <Badge variant={TYPE_VARIANT[ann.type]}>
                              {ann.type}
                            </Badge>
                            {ann.active ? (
                              <Badge variant="green">Active</Badge>
                            ) : (
                              <Badge variant="default">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted line-clamp-2 mb-2">
                            {ann.content}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(ann.starts_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                              {ann.ends_at && (
                                <>
                                  {" "}
                                  &mdash;{" "}
                                  {new Date(ann.ends_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Active toggle */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={ann.active}
                          data-testid={`admin-announcement-toggle-${ann.id}`}
                          onClick={() => handleToggleActive(ann)}
                          className={cn(
                            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors mr-2",
                            ann.active ? "bg-accent" : "bg-surface-3"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-3 w-3 rounded-full bg-white transition-transform",
                              ann.active
                                ? "translate-x-5"
                                : "translate-x-1"
                            )}
                          />
                        </button>

                        <Button
                          data-testid={`admin-announcement-edit-${ann.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(ann)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          data-testid={`admin-announcement-delete-${ann.id}`}
                          variant={
                            deleteConfirm === ann.id
                              ? "destructive"
                              : "ghost"
                          }
                          size="sm"
                          onClick={() => handleDelete(ann.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {deleteConfirm === ann.id && (
                          <Button
                            data-testid={`admin-announcement-delete-cancel-${ann.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
