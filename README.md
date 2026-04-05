# Claude Academy

**Master Claude from Zero to Hero** — an interactive learning website with 74 lessons, quizzes, exercises, and a complete prompt engineering lab.

**Live:** [klaude-academy.netlify.app](https://klaude-academy.netlify.app) | [GitHub Pages](https://khader9jber.github.io/claude-academy/)

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ (tested on 25.6.1)
- [npm](https://www.npmjs.com/) 9+ (tested on 11.9.0)
- [Git](https://git-scm.com/)
- [Supabase](https://supabase.com/) project (free tier) -- optional, for auth and progress sync features

### 1. Clone the repo

```bash
git clone https://github.com/Khader9Jber/claude-academy.git
cd claude-academy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and configure:

```env
# Required — your site URL (localhost for dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional — Google Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional — Supabase (enables auth, progress sync, leaderboard, certificates)
# Get these from: supabase.com → Your Project → Settings → API
# NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** The site works out of the box with just `npm install && npm run dev`. Supabase env vars are optional -- without them, the site runs as a fully static app with localStorage-only progress tracking. Adding Supabase enables authentication, cross-device progress sync, leaderboard, and certificates.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## All Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local development server on port 3000 |
| `npm run build` | Build static production site (outputs to `/out`) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint checks |
| `npm test` | Run unit tests (Vitest, 46 tests) |
| `npm run test:coverage` | Run tests with coverage report (97% statements) |
| `npm run test:e2e` | Run Playwright E2E tests (36 tests, desktop + mobile) |
| `npm run test:e2e:ui` | Open Playwright UI mode for debugging tests |
| `npm run test:all` | Run both unit tests and E2E tests |

---

## Project Structure

```
claude-academy/
├── content/                    # All lesson content
│   ├── modules/               # 13 modules with MDX lessons
│   │   ├── 01-claude-fundamentals/
│   │   │   ├── _module.json   # Module metadata
│   │   │   ├── 01-what-is-claude.mdx
│   │   │   └── ...
│   │   ├── 02-prompt-engineering/
│   │   └── ... (13 modules total)
│   ├── templates/             # Copy-paste template data
│   └── cheatsheet/            # Cheatsheet reference data
├── src/
│   ├── app/                   # Next.js pages (App Router)
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Login and signup pages
│   │   ├── profile/           # User profile page
│   │   ├── leaderboard/       # Public leaderboard page
│   │   ├── certificate/       # Completion certificate pages
│   │   ├── curriculum/        # Curriculum, module, lesson pages
│   │   ├── prompt-lab/        # Interactive prompt engineering
│   │   ├── cheatsheet/        # Searchable command reference
│   │   ├── templates/         # Template library
│   │   └── progress/          # Progress dashboard
│   ├── components/
│   │   ├── ui/                # Button, Badge, Card, ProgressBar
│   │   ├── layout/            # Header, Footer, Sidebar, Breadcrumb
│   │   ├── content/           # CodeBlock, Callout, FileTree, etc.
│   │   ├── interactive/       # Quiz, FillInBlank, TerminalSim, PromptPlayground
│   │   ├── lesson/            # LessonLayout, LessonNav, CompleteButton
│   │   ├── progress/          # Dashboard, Achievements, Streak
│   │   ├── auth/              # Auth-related UI components
│   │   └── search/            # SearchDialog (Cmd+K)
│   ├── lib/
│   │   ├── supabase/          # Supabase client, helpers, types
│   │   └── ...                # Utilities, constants, stores
│   ├── hooks/                 # Custom React hooks (incl. useAuth, useProgressSync)
│   └── types/                 # TypeScript interfaces
├── supabase/
│   └── migrations/            # SQL migration files
│       └── 001_initial.sql    # Initial schema: 7 tables + RLS policies
├── e2e/                       # Playwright E2E tests
│   ├── pages/                 # Page Object Model classes
│   └── *.spec.ts              # Test files
├── docs/                      # Project documentation
│   ├── SRS.md                 # Software Requirements Specification
│   ├── ARCHITECTURE.md        # System architecture
│   ├── TEST_PLAN.md           # Test strategy
│   ├── TEST_SUITES.md         # All test cases (96 unit + 36 E2E)
│   ├── IMPLEMENTATION_PLAN.md # Phase-by-phase build plan
│   ├── GLOSSARY.md            # Term definitions
│   ├── CHANGELOG.md           # What changed and when
│   ├── REFRESHER.md           # Quick refresher — what you built & what's next
│   └── qa-results/            # QA validation reports
├── .github/workflows/         # CI/CD pipelines
│   ├── ci.yml                 # Lint → Type Check → Unit Test → Coverage → E2E
│   ├── security.yml           # Dependency audit + CodeQL + Secret scan
│   ├── deploy.yml             # Deploy to Netlify + GitHub Pages (Vercel as backup)
│   └── pr-preview.yml         # Netlify deploy preview on pull requests
├── TECH_STACK.md              # Full tech stack documentation
├── .env.example               # Environment variable template
├── playwright.config.ts       # Playwright E2E config
├── vitest.config.ts           # Vitest unit test config
└── next.config.ts             # Next.js config (static export)
```

---

## Adding Content

### Add a new lesson

1. Create an MDX file in the appropriate module folder:

```bash
content/modules/01-claude-fundamentals/05-new-lesson.mdx
```

2. Add frontmatter:

```yaml
---
title: "Your Lesson Title"
slug: "new-lesson"
order: 5
difficulty: "beginner"
duration: 15
tags: ["tag1", "tag2"]
objectives:
  - "What the learner will know after this lesson"
quiz:
  - id: "q1"
    question: "Your question?"
    type: "multiple-choice"
    options:
      - "Option A"
      - "Option B"
      - "Option C"
      - "Option D"
    correct: 0
    explanation: "Why this is the right answer."
---

# Your Lesson Title

Your lesson content here in Markdown...
```

3. Push to `main` — the pipeline builds and deploys automatically.

### Add a new module

1. Create a folder: `content/modules/14-your-module/`
2. Add `_module.json`:

```json
{
  "title": "Your Module Title",
  "slug": "your-module",
  "description": "What this module covers",
  "arc": "foundation",
  "order": 14,
  "icon": "BookOpen",
  "color": "#5cb870",
  "estimatedHours": 3,
  "prerequisites": [],
  "lessonCount": 5
}
```

3. Add MDX lesson files (as above)
4. Update `src/lib/constants.ts` — add the slug to `MODULE_ORDER`
5. Push to `main`

---

## Environment Variables

| Variable | Required | Where | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | No | `.env.local` | Site URL for meta tags. Defaults to localhost |
| `NEXT_PUBLIC_GA_ID` | No | `.env.local` | Google Analytics measurement ID |
| `NEXT_PUBLIC_SUPABASE_URL` | No | `.env.local` | Supabase project URL. Get from Settings > API in your Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | `.env.local` | Supabase anonymous key. Get from Settings > API in your Supabase dashboard |
| `DEPLOY_TARGET` | No | CI only | Set to `github-pages` for basePath. Auto-set in pipeline |
| `NETLIFY_AUTH_TOKEN` | CI only | GitHub Secrets | Netlify API token for automated deploys |
| `NETLIFY_SITE_ID` | CI only | GitHub Secrets | Netlify site ID |
| `VERCEL_TOKEN` | CI only | GitHub Secrets | Vercel API token (backup deploys) |
| `VERCEL_ORG_ID` | CI only | GitHub Secrets | Vercel team/org ID (backup deploys) |
| `VERCEL_PROJECT_ID` | CI only | GitHub Secrets | Vercel project ID (backup deploys) |

**Setup:**
```bash
# Local development — just copy the example
cp .env.example .env.local

# CI/CD secrets — already configured in GitHub
# View at: https://github.com/Khader9Jber/claude-academy/settings/secrets/actions
```

> **Security:** Never put real tokens in `.env.example`. It's committed to git. Use `.env.local` (gitignored) for local secrets and GitHub Secrets for CI.

---

## CI/CD Pipeline

Every push to `main` triggers:

```
Push to main
    │
    ├── CI ──────────── Lint → Type Check → Unit Tests (46) → Coverage (97%) → E2E (36)
    │                          All must pass before deploy
    │
    ├── Security ────── npm audit → CodeQL analysis → TruffleHog secret scan
    │                          Also runs weekly on Mondays
    │
    └── Deploy ──────── CI Gate (waits for CI to pass)
                              ├── Netlify       → klaude-academy.netlify.app (primary)
                              ├── GitHub Pages  → khader9jber.github.io/claude-academy
                              └── Vercel        → backup (has deployment protection issues on free plan)

Pull Requests to main
    │
    ├── CI ──────────── Same as above (must pass to merge)
    ├── Security ────── Full scan
    └── PR Preview ──── Netlify deploy preview URL posted as PR comment
```

**Monitor pipeline:** [github.com/Khader9Jber/claude-academy/actions](https://github.com/Khader9Jber/claude-academy/actions)

---

## Testing

### Unit Tests (Vitest)
```bash
npm test                # Run all 46 tests
npm run test:coverage   # With coverage report (97% statements)
npm run test:watch      # Watch mode for development
```

Coverage thresholds (enforced in CI):
- Statements: 90%
- Branches: 70%
- Functions: 90%
- Lines: 90%

### E2E Tests (Playwright)
```bash
npm run test:e2e        # Run all 36 E2E tests (desktop + mobile)
npm run test:e2e:ui     # Open Playwright UI for debugging
```

First time? Install the browser:
```bash
npx playwright install chromium
```

Tests use the **Page Object Model** pattern:
```
e2e/pages/           # Page objects (selectors + actions)
├── base.page.ts     # Shared: header, footer, nav
├── landing.page.ts  # Hero, CTA, arc cards
├── curriculum.page.ts
├── module.page.ts
├── lesson.page.ts
├── prompt-lab.page.ts
├── cheatsheet.page.ts
├── templates.page.ts
├── progress.page.ts
└── index.ts         # Barrel export
```

All selectors use `data-testid` attributes — stable, decoupled from content.

---

## Deployment

### Automatic (recommended)
Push to `main`. The pipeline handles everything:
- Builds with correct config for each platform
- Deploys to Netlify (primary, SSR with full auth support)
- Deploys to GitHub Pages (with `/claude-academy` basePath, static)
- Vercel available as backup (has deployment protection issues on free plan)

### Manual Netlify deploy
```bash
npm run build
npx netlify deploy --prod --site $NETLIFY_SITE_ID
```

### Manual GitHub Pages
Push triggers the workflow automatically. No manual steps needed.

---

## Supabase Setup

Supabase powers authentication, progress sync, leaderboard, and certificates. It is entirely optional -- the site works without it.

### 1. Create a free account

Go to [supabase.com](https://supabase.com) and sign up for a free account.

### 2. Create a new project

Click "New Project", give it a name (e.g., `claude-academy`), set a database password, and choose a region close to your users.

### 3. Copy your API credentials

Go to **Settings > API** in your Supabase dashboard. Copy:
- **Project URL** (e.g., `https://abc123.supabase.co`)
- **anon public key** (starts with `eyJ...`)

### 4. Add to `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the database migration

Go to **SQL Editor** in your Supabase dashboard. Open the file `supabase/migrations/001_initial.sql` from this repo, paste the contents into the SQL Editor, and click **Run**. This creates all 7 tables and RLS policies.

### 6. Configure authentication URLs

Go to **Authentication > URL Configuration** and set:
- **Site URL**: `http://localhost:3000` (or your production URL)
- **Redirect URLs**: add `http://localhost:3000/auth/callback` and your production callback URL

### 7. (Optional) Enable OAuth providers

To enable Google or GitHub login:
- Go to **Authentication > Providers**
- Enable **Google**: add your Google OAuth client ID and secret
- Enable **GitHub**: add your GitHub OAuth app client ID and secret

---

## Authentication

Authentication is fully optional. All lesson content, quizzes, the cheatsheet, templates, and the prompt lab work without any login.

**What login enables:**
- Progress syncs across devices (instead of localStorage only)
- Public leaderboard ranking
- Completion certificates per arc
- User profile with display name

**How it works:**
- Users can sign up with email/password, Google, or GitHub
- The site header shows "Sign In" when logged out, and a user menu when logged in
- Guests use localStorage for progress; logged-in users get dual-write (localStorage + Supabase)
- If Supabase env vars are not set, auth features are hidden and the site runs as a static app

---

## Database Schema

The Supabase PostgreSQL database uses 7 tables, all protected by Row Level Security (RLS):

| Table | Purpose |
|-------|---------|
| `profiles` | User display names and avatars (auto-created on signup via trigger) |
| `user_progress` | Serialized progress state per user (completedLessons, quizScores, streaks) |
| `completed_lessons` | Individual lesson completion records with timestamps |
| `quiz_scores` | Quiz attempt records with score, total, and best score tracking |
| `certificates` | Arc completion certificates with unique certificate IDs |
| `leaderboard` | Materialized view of top users by lessons completed |
| `user_settings` | User preferences (theme, notifications) |

All tables enforce RLS -- users can only read and write their own data. The `leaderboard` view is publicly readable. A database trigger automatically creates a `profiles` row when a new user signs up.

The full schema is in `supabase/migrations/001_initial.sql`.

---

## Snapshots & Reverting

The project uses Git tags as snapshots for major milestones. You can revert to any snapshot if needed.

```bash
git tag -l                    # List all snapshots
git reset --hard v0.1.0       # Revert to static-only version
git push --force              # Push revert (destructive — use with caution)
git tag -a v0.2.0 -m "desc"  # Create a new snapshot
git push origin v0.2.0       # Push snapshot tag
```

**Current snapshots:**

| Tag | Description |
|-----|-------------|
| `v0.1.0` | Static site, no backend, dark mode only |
| `v0.2.0` | Supabase backend + light/dark mode support |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, SSR on Netlify / static on GitHub Pages) |
| Language | TypeScript 5.6+ |
| Styling | Tailwind CSS 4 |
| Content | MDX 3 |
| Syntax highlighting | Shiki |
| State | Zustand + localStorage |
| Backend | Supabase (optional) -- Auth, PostgreSQL, RLS |
| Theme | Light/dark mode (dark default) via next-themes |
| Unit testing | Vitest + React Testing Library |
| E2E testing | Playwright |
| CI/CD | GitHub Actions (4 workflows) |
| Hosting | Netlify (primary) + GitHub Pages + Vercel (backup) |

Full details in [TECH_STACK.md](./TECH_STACK.md).

---

## Documentation

| Document | Description |
|----------|------------|
| [TECH_STACK.md](./TECH_STACK.md) | Complete tech stack with rationale |
| [docs/REFRESHER.md](./docs/REFRESHER.md) | Quick refresher — what you built & what's next |
| [docs/SRS.md](./docs/SRS.md) | Software Requirements Specification |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture |
| [docs/TEST_PLAN.md](./docs/TEST_PLAN.md) | Test strategy and coverage |
| [docs/TEST_SUITES.md](./docs/TEST_SUITES.md) | All test cases (132 total) |
| [docs/IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) | Build phases (all complete) |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md) | What changed and when |
| [docs/GLOSSARY.md](./docs/GLOSSARY.md) | Term definitions |

---

## License

All rights reserved. Built with &#9829; by KK.
