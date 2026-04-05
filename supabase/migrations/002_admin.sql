-- ============================================
-- Claude Academy — Admin Role System
-- ============================================
-- Uses Supabase app_metadata for admin flag
-- (cannot be modified by users via client SDK)

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Content management table (admin-managed lessons stored in DB)
-- ============================================

CREATE TABLE public.managed_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  duration INTEGER NOT NULL DEFAULT 15,
  "order" INTEGER NOT NULL DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  content TEXT NOT NULL DEFAULT '',
  quiz_data JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(module_slug, lesson_slug)
);

-- ============================================
-- Site settings table
-- ============================================

CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- Announcements / notifications
-- ============================================

CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'maintenance')),
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- Analytics events table
-- ============================================

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL, -- 'page_view', 'lesson_complete', 'quiz_attempt', 'signup', 'login'
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE public.managed_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Published content is readable by everyone
CREATE POLICY "Published content is public" ON public.managed_content
  FOR SELECT USING (published = true);

-- Only admins can insert/update/delete content
CREATE POLICY "Admins manage content" ON public.managed_content
  FOR ALL USING (public.is_admin());

-- Site settings: admins only
CREATE POLICY "Admins manage settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- Announcements: public read active, admin write
CREATE POLICY "Active announcements are public" ON public.announcements
  FOR SELECT USING (active = true AND (ends_at IS NULL OR ends_at > NOW()));
CREATE POLICY "Admins manage announcements" ON public.announcements
  FOR ALL USING (public.is_admin());

-- Analytics: users insert own, admins read all
CREATE POLICY "Users insert own events" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all events" ON public.analytics_events
  FOR SELECT USING (public.is_admin());

-- ============================================
-- Admin dashboard stats view
-- ============================================

CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_7d,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
  (SELECT COUNT(*) FROM public.user_progress) as total_lesson_completions,
  (SELECT COUNT(*) FROM public.quiz_scores) as total_quiz_attempts,
  (SELECT COUNT(*) FROM public.certificates) as total_certificates,
  (SELECT COUNT(*) FROM public.managed_content WHERE published = true) as published_lessons,
  (SELECT COUNT(*) FROM public.managed_content WHERE published = false) as draft_lessons;
