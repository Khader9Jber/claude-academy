# Klaude Academy — Project Briefing

## What This Is
Klaude Academy is an interactive learning website for mastering Claude and Claude Code. 74 lessons across 13 modules, 4 difficulty arcs, with quizzes, exercises, and a complete admin dashboard.

## Live URLs
- **Primary:** https://klaude-academy.netlify.app
- **Static fallback:** https://khader9jber.github.io/claude-academy/
- **Repo:** https://github.com/Khader9Jber/claude-academy
- **Pipeline:** https://github.com/Khader9Jber/claude-academy/actions
- **Supabase:** https://supabase.com/dashboard/project/vgqacstxxwkeftxpuxcn

## Tech Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- Supabase (Auth + PostgreSQL + RLS)
- Zustand + localStorage for progress
- Vitest (unit) + Playwright (E2E)
- Deploy: Netlify (primary) + GitHub Pages (static)

## Key Directories
- `content/modules/` — 13 modules with MDX lessons
- `src/app/` — Pages (curriculum, prompt-lab, cheatsheet, templates, progress, auth, admin, profile, leaderboard, certificate)
- `src/components/` — UI, layout, content, interactive, lesson, progress, search, admin
- `src/lib/` — utils, constants, content loader, progress store, supabase clients, admin helpers
- `src/hooks/` — useAdmin, useSyncedProgress
- `e2e/` — Playwright tests with POM pattern (e2e/pages/)
- `supabase/migrations/` — 001_initial.sql + 002_admin.sql
- `docs/` — SRS, Architecture, Test Plan, Test Suites, Content Plan, Refresher, Changelog, etc.
- `scripts/` — make-admin.ts, validate-content.ts, build-search-index.ts

## Commands
```bash
npm run dev          # Local dev server
npm run build        # Production build
npm test             # 77 unit tests
npm run test:e2e     # Playwright E2E tests
npm run lint         # ESLint
git push             # Auto-deploys via CI/CD
```

## How Content Works
- Lessons are MDX files in `content/modules/XX-name/NN-slug.mdx`
- Module metadata in `content/modules/XX-name/_module.json`
- Module order controlled by `MODULE_ORDER` in `src/lib/constants.ts`
- Admin dashboard at `/admin` can also manage content via Supabase

## Admin Dashboard
- Protected by `app_metadata.role === 'admin'`
- Sections: Dashboard, Content, Users, Analytics, Announcements, Settings
- Make a user admin: `SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx scripts/make-admin.ts user@email.com`

## Database
- Supabase PostgreSQL with RLS
- Tables: profiles, user_progress, quiz_scores, exercise_completions, activity_log, user_achievements, certificates, managed_content, site_settings, announcements, analytics_events
- Migrations: `supabase/migrations/001_initial.sql` and `002_admin.sql`

## CI/CD Pipeline
Push to main triggers: Lint → TypeCheck → Unit Tests → Coverage → E2E → Security Scan → Deploy (Netlify + GitHub Pages)

## Design System
- Dark mode default, light mode via toggle
- Colors in `src/app/globals.css` (:root for light, .dark for dark)
- Fonts: DM Sans (body), JetBrains Mono (code), Instrument Serif (headings)
- Arc colors: Foundation=green, Practitioner=blue, Power User=purple, Expert=gold

## Git Conventions
- `feat: description` — new features
- `fix: description` — bug fixes
- `content: description` — lesson/content changes
- `docs: description` — documentation updates
- `test: description` — test additions
- `ci: description` — pipeline changes

## Snapshots
- `v0.1.0` — Static site, no backend
- `v0.2.0` — Supabase backend + light/dark mode
- Revert: `git reset --hard v0.1.0 && git push --force`

## Important Security Notes
- Never commit .env.local (gitignored)
- Supabase anon key is public (safe in client code)
- Service role key is SECRET (never in client, only in scripts)
- Admin role set via app_metadata (not modifiable by client SDK)
- All tables have Row Level Security enabled

## Docs Reference
See `docs/REFRESHER.md` for a quick overview, `docs/HOW_TO_ADD_CONTENT.md` for content guide, `docs/CONTENT_PLAN.md` for full content strategy.
