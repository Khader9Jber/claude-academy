/** A lesson stored in the database, managed via the admin panel. */
export interface ManagedContent {
  id: string;
  module_slug: string;
  lesson_slug: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  duration: number;
  order: number;
  tags: string[];
  objectives: string[];
  content: string;
  quiz_data: unknown[];
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

/** A key-value site setting row. */
export interface SiteSettings {
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
}

/** A user-facing announcement / notification banner. */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "maintenance";
  active: boolean;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  created_by: string | null;
}

/** A single analytics event row. */
export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

/** Aggregated stats returned by the admin_stats view. */
export interface AdminStats {
  total_users: number;
  new_users_7d: number;
  new_users_30d: number;
  total_lesson_completions: number;
  total_quiz_attempts: number;
  total_certificates: number;
  published_lessons: number;
  draft_lessons: number;
}
