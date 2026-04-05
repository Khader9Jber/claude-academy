"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Shield,
  Globe,
  Lock,
  BookOpen,
  Monitor,
  Save,
  CheckCircle,
} from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────── */

interface SettingsState {
  general: {
    site_name: string;
    site_description: string;
  };
  auth: {
    require_email_confirmation: boolean;
    oauth_enabled: boolean;
  };
  content: {
    default_difficulty: "beginner" | "intermediate" | "advanced" | "expert";
    default_duration: number;
  };
  display: {
    show_leaderboard: boolean;
    show_certificates: boolean;
  };
}

const DEFAULT_SETTINGS: SettingsState = {
  general: {
    site_name: "Claude Academy",
    site_description:
      "Master Claude from zero to hero. A free, comprehensive learning path.",
  },
  auth: {
    require_email_confirmation: true,
    oauth_enabled: true,
  },
  content: {
    default_difficulty: "beginner",
    default_duration: 15,
  },
  display: {
    show_leaderboard: true,
    show_certificates: true,
  },
};

type SectionKey = keyof SettingsState;

/* ── Component ─────────────────────────────────────────────────────── */

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);
  const [savedSection, setSavedSection] = useState<SectionKey | null>(null);

  /* ── Load settings ────────────────────────────────────────────── */

  const fetchSettings = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (error || !data) {
        setSettings(DEFAULT_SETTINGS);
        setLoading(false);
        return;
      }

      const map: Record<string, unknown> = {};
      for (const row of data) {
        map[row.key] = row.value;
      }

      setSettings({
        general: {
          site_name:
            (map["site_name"] as string) ?? DEFAULT_SETTINGS.general.site_name,
          site_description:
            (map["site_description"] as string) ??
            DEFAULT_SETTINGS.general.site_description,
        },
        auth: {
          require_email_confirmation:
            (map["require_email_confirmation"] as boolean) ??
            DEFAULT_SETTINGS.auth.require_email_confirmation,
          oauth_enabled:
            (map["oauth_enabled"] as boolean) ??
            DEFAULT_SETTINGS.auth.oauth_enabled,
        },
        content: {
          default_difficulty:
            (map["default_difficulty"] as SettingsState["content"]["default_difficulty"]) ??
            DEFAULT_SETTINGS.content.default_difficulty,
          default_duration:
            (map["default_duration"] as number) ??
            DEFAULT_SETTINGS.content.default_duration,
        },
        display: {
          show_leaderboard:
            (map["show_leaderboard"] as boolean) ??
            DEFAULT_SETTINGS.display.show_leaderboard,
          show_certificates:
            (map["show_certificates"] as boolean) ??
            DEFAULT_SETTINGS.display.show_certificates,
        },
      });
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!adminLoading) fetchSettings();
  }, [adminLoading, fetchSettings]);

  /* ── Redirect non-admins ──────────────────────────────────────── */

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, adminLoading, router]);

  /* ── Save section ─────────────────────────────────────────────── */

  const saveSection = async (section: SectionKey) => {
    setSavingSection(section);
    setSavedSection(null);

    const entries = Object.entries(settings[section]) as [string, unknown][];

    if (!isSupabaseConfigured()) {
      // Demo mode: just show saved feedback
      await new Promise((r) => setTimeout(r, 400));
      setSavingSection(null);
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 3000);
      return;
    }

    try {
      const supabase = createClient();

      for (const [key, value] of entries) {
        await supabase
          .from("site_settings")
          .upsert(
            { key, value, updated_at: new Date().toISOString() },
            { onConflict: "key" }
          );
      }

      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 3000);
    } catch {
      // Silently fail
    } finally {
      setSavingSection(null);
    }
  };

  /* ── Helpers ──────────────────────────────────────────────────── */

  const updateGeneral = (field: keyof SettingsState["general"], value: string) => {
    setSettings((s) => ({
      ...s,
      general: { ...s.general, [field]: value },
    }));
  };

  const updateAuth = (field: keyof SettingsState["auth"], value: boolean) => {
    setSettings((s) => ({
      ...s,
      auth: { ...s.auth, [field]: value },
    }));
  };

  const updateContent = (
    field: keyof SettingsState["content"],
    value: string | number
  ) => {
    setSettings((s) => ({
      ...s,
      content: { ...s.content, [field]: value },
    }));
  };

  const updateDisplay = (field: keyof SettingsState["display"], value: boolean) => {
    setSettings((s) => ({
      ...s,
      display: { ...s.display, [field]: value },
    }));
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

  /* ── Render helpers ───────────────────────────────────────────── */

  const SaveButton = ({ section }: { section: SectionKey }) => (
    <Button
      data-testid={`admin-settings-save-${section}`}
      size="sm"
      onClick={() => saveSection(section)}
      disabled={savingSection === section}
    >
      {savedSection === section ? (
        <>
          <CheckCircle className="h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          {savingSection === section ? "Saving..." : "Save"}
        </>
      )}
    </Button>
  );

  const Toggle = ({
    checked,
    onChange,
    testId,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    testId: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-testid={testId}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-accent" : "bg-surface-3"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );

  const inputClass = cn(
    "w-full rounded-lg border border-border bg-surface-2 px-4 py-2",
    "text-sm text-foreground placeholder:text-muted/60",
    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
    "transition-colors"
  );

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
            data-testid="admin-settings-heading"
            className="font-serif italic text-4xl sm:text-5xl text-foreground mb-4"
          >
            Site Settings
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Configure global settings for Claude Academy.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* ── General ──────────────────────────────────────────── */}
          <div
            data-testid="admin-settings-general"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue" />
                <h2 className="text-lg font-semibold text-foreground">
                  General
                </h2>
              </div>
              <SaveButton section="general" />
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="site-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Site Name
                </label>
                <input
                  id="site-name"
                  data-testid="admin-settings-site-name"
                  type="text"
                  value={settings.general.site_name}
                  onChange={(e) => updateGeneral("site_name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="site-description"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Site Description
                </label>
                <textarea
                  id="site-description"
                  data-testid="admin-settings-site-description"
                  rows={3}
                  value={settings.general.site_description}
                  onChange={(e) =>
                    updateGeneral("site_description", e.target.value)
                  }
                  className={cn(inputClass, "resize-y")}
                />
              </div>
            </div>
          </div>

          {/* ── Authentication ───────────────────────────────────── */}
          <div
            data-testid="admin-settings-auth"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-orange" />
                <h2 className="text-lg font-semibold text-foreground">
                  Authentication
                </h2>
              </div>
              <SaveButton section="auth" />
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Require Email Confirmation
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Users must verify their email before accessing the platform.
                  </p>
                </div>
                <Toggle
                  checked={settings.auth.require_email_confirmation}
                  onChange={(v) =>
                    updateAuth("require_email_confirmation", v)
                  }
                  testId="admin-settings-email-confirmation"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    OAuth Providers
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Allow sign-in via Google, GitHub, etc. Configure providers in the
                    Supabase dashboard.
                  </p>
                </div>
                <Toggle
                  checked={settings.auth.oauth_enabled}
                  onChange={(v) => updateAuth("oauth_enabled", v)}
                  testId="admin-settings-oauth"
                />
              </div>
            </div>
          </div>

          {/* ── Content ──────────────────────────────────────────── */}
          <div
            data-testid="admin-settings-content"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-green" />
                <h2 className="text-lg font-semibold text-foreground">
                  Content
                </h2>
              </div>
              <SaveButton section="content" />
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="default-difficulty"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Default Difficulty
                </label>
                <select
                  id="default-difficulty"
                  data-testid="admin-settings-default-difficulty"
                  value={settings.content.default_difficulty}
                  onChange={(e) =>
                    updateContent("default_difficulty", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="default-duration"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Default Lesson Duration{" "}
                  <span className="text-muted font-normal">(minutes)</span>
                </label>
                <input
                  id="default-duration"
                  data-testid="admin-settings-default-duration"
                  type="number"
                  min={1}
                  max={120}
                  value={settings.content.default_duration}
                  onChange={(e) =>
                    updateContent(
                      "default_duration",
                      parseInt(e.target.value, 10) || 15
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ── Display ──────────────────────────────────────────── */}
          <div
            data-testid="admin-settings-display"
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-purple" />
                <h2 className="text-lg font-semibold text-foreground">
                  Display
                </h2>
              </div>
              <SaveButton section="display" />
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Show Leaderboard
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Display the public leaderboard page for all users.
                  </p>
                </div>
                <Toggle
                  checked={settings.display.show_leaderboard}
                  onChange={(v) => updateDisplay("show_leaderboard", v)}
                  testId="admin-settings-show-leaderboard"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Show Certificates
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Allow users to view and download completion certificates.
                  </p>
                </div>
                <Toggle
                  checked={settings.display.show_certificates}
                  onChange={(v) => updateDisplay("show_certificates", v)}
                  testId="admin-settings-show-certificates"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
