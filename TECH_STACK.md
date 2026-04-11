# Klaude Academy — Technical Architecture

## Project Overview

Klaude Academy is a comprehensive interactive learning website for mastering Claude and Claude Code. It is built as a static-first Next.js application with plans for a future backend.

---

## Current Architecture (Phase 1 — Static)

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI component library — everything the user sees and interacts with |
| Next.js | 16 (App Router) | React framework — handles routing, page generation, and builds the static site |
| TypeScript | 5.6+ | Language — adds type safety on top of JavaScript, catches bugs at build time |
| Tailwind CSS | 4 | Styling — utility-first CSS framework, dark-mode-first, configured via `@theme inline` in CSS |
| MDX | 3 (via next-mdx-remote) | Content format — Markdown that can embed React components (quizzes, exercises) |
| Framer Motion | 12+ | Animations — smooth page transitions, entrance effects on landing page |
| Lucide React | 1.7+ | Icons — clean, consistent icon set used across all components |

### Content & Syntax

| Technology | Purpose |
|-----------|---------|
| MDX 3 | Lesson content authored as Markdown with embedded React components |
| Shiki (@shikijs/rehype) | Syntax highlighting for code blocks — same engine VS Code uses |
| gray-matter | Parses YAML frontmatter from MDX files (title, difficulty, quiz data) |
| remark-gfm | GitHub-flavored Markdown support (tables, task lists, strikethrough) |
| rehype-slug | Auto-generates IDs for headings (for table of contents links) |
| rehype-autolink-headings | Adds anchor links to headings |

### State Management & Storage

| Technology | Purpose |
|-----------|---------|
| Zustand | Lightweight state management (2KB) — manages progress, quiz scores, streaks |
| localStorage | Browser-based persistence — progress stays on the user's device |

### Search

| Technology | Purpose |
|-----------|---------|
| Fuse.js | Client-side fuzzy search — pre-built index at build time, searches lessons and commands |

### Interactive Features

| Technology | Purpose |
|-----------|---------|
| Sandpack (planned) | CodeSandbox's embeddable code editor — runs code in-browser for exercises |
| Custom components | Quiz, FillInBlank, TerminalSimulator, PromptPlayground — all built from scratch in React |

### Fonts

| Font | Usage |
|------|-------|
| DM Sans | Body text, UI elements |
| JetBrains Mono | Code blocks, terminal output, monospace content |
| Instrument Serif | Large headings, hero text, decorative typography |

### Theme — Light/Dark Mode

| Technology | Purpose |
|-----------|---------|
| next-themes | Theme management — class-based toggling, persists preference across sessions |
| CSS custom properties | Theme tokens — colors swap between dark and light via `[data-theme]` overrides |

Dark mode is the default. Light mode uses warm, high-contrast colors. Code blocks and terminal components stay dark in both themes for readability.

### Design System

Colors extracted from the Claude cheatsheet branding:

**Dark theme (default):**
```
Background:    #0a0a0d
Surface:       #121218
Surface 2:     #1a1a22
Surface 3:     #22222d
Border:        #28283a
Border Accent: #3a3a50
Text:          #e8e6e3
Muted:         #8a8a9a
Accent (gold): #d4a053
Green:         #5cb870
Blue:          #5e9ed6
Red:           #d65e5e
Purple:        #a07ed6
Cyan:          #5ec4c4
Orange:        #d6885e
Pink:          #d65ea0
```

**Light theme:**
```
Background:    #fafaf9
Surface:       #ffffff
Surface 2:     #f5f5f4
Surface 3:     #e7e5e4
Border:        #d6d3d1
Border Accent: #a8a29e
Text:          #1c1917
Muted:         #78716c
Accent (gold): #b8860b
```

Arc color coding:
- Foundation → Green (#5cb870)
- Practitioner → Blue (#5e9ed6)
- Power User → Purple (#a07ed6)
- Expert → Gold (#d4a053)

### Backend — Supabase (Optional)

| Technology | Purpose |
|-----------|---------|
| Supabase | Backend-as-a-service — provides PostgreSQL database, Auth, and Row Level Security. Free tier supports 50K users. |
| Supabase Auth | User authentication — email/password, Google OAuth, GitHub OAuth |
| Supabase PostgreSQL | Relational database — 7 tables for profiles, progress, scores, certificates, leaderboard, settings |
| Row Level Security (RLS) | Database security — users can only read/write their own data |
| @supabase/supabase-js | JavaScript/TypeScript SDK for client-side Supabase access |
| @supabase/ssr | Server-side helpers for Supabase auth in Next.js |

The backend is optional. Without Supabase env vars, the site runs as a fully static app with localStorage-only progress. With Supabase configured, users can sign up, sync progress across devices, appear on the leaderboard, and earn certificates. On Netlify, the site uses SSR for auth callbacks. On GitHub Pages, it deploys as a static export. Vercel is kept as a backup deployment target.

### Testing (Planned — Phase 7)

| Tool | Type | What It Tests |
|------|------|---------------|
| Vitest | Unit tests | Utility functions, progress store logic, content loader |
| React Testing Library | Component tests | Quiz scoring, exercise validation, progress tracking |
| Playwright | End-to-end tests | Full user flows — navigate, learn, quiz, complete, track progress |
| ESLint | Linting | Code quality, Next.js best practices |
| TypeScript (tsc) | Type checking | Build-time type safety — already active |

### Hosting & Deployment

| Option | Notes |
|--------|-------|
| Netlify (primary) | SSR support, full auth, automatic deploys on git push — https://klaude-academy.netlify.app |
| GitHub Pages (secondary) | Static hosting, free, tied to repo — https://khader9jber.github.io/klaude-academy/ |
| Vercel (backup) | Has deployment protection issues on free plan — kept as fallback |
| Any static host | The build output is just HTML/CSS/JS files — works anywhere |

---

## Current Backend Architecture (Supabase)

The backend was added in v0.2.0. It uses Supabase as a backend-as-a-service, keeping the entire stack in JavaScript/TypeScript.

### Backend Stack

| Technology | Purpose |
|-----------|---------|
| Supabase | Backend-as-a-service — PostgreSQL database + Auth + Row Level Security |
| Supabase Auth | Email/password, Google OAuth, GitHub OAuth — built-in, free |
| Supabase PostgreSQL | Relational database for user data, progress, scores, certificates |
| @supabase/supabase-js | Client-side SDK for database and auth operations |
| @supabase/ssr | Server-side auth helpers for Next.js (cookie-based sessions) |

### What the Backend Handles

| Feature | Status | Implementation |
|---------|--------|---------------|
| User accounts | DONE | Supabase Auth — signup, login, sessions via email/Google/GitHub |
| Progress sync | DONE | Dual-write: localStorage + Supabase for logged-in users |
| Certificates | DONE | Per-arc completion certificates with unique IDs |
| Leaderboards | DONE | Public leaderboard view sorted by lessons completed |
| User profiles | DONE | Editable display name, auto-created on signup |
| Analytics | Future | Track lesson views, quiz pass rates, drop-off points |
| Comments / Q&A | Future | Store and display user discussions per lesson |
| Payments | Future | Stripe (JS SDK) for premium content tiers |
| Admin panel | Future | Dashboard to manage content, view analytics, moderate comments |

### Database Schema Summary

| Table | Purpose |
|-------|---------|
| `profiles` | User display names and avatars (auto-created via trigger) |
| `user_progress` | Serialized progress state per user |
| `completed_lessons` | Individual lesson completion records with timestamps |
| `quiz_scores` | Quiz attempt records with score tracking |
| `certificates` | Arc completion certificates with unique IDs |
| `leaderboard` | Materialized view — top users by lessons completed |
| `user_settings` | User preferences (theme, notifications) |

### Deployment Model

| Platform | Mode | Auth Support |
|----------|------|-------------|
| Netlify (primary) | SSR (serverless) | Full auth with callbacks via `src/app/auth/callback/` |
| GitHub Pages | Static export | Auth features hidden, localStorage only |
| Vercel (backup) | SSR (serverless) | Full auth — has deployment protection issues on free plan |

The `next.config.ts` conditionally sets `output: 'export'` when `DEPLOY_TARGET=github-pages`. On Netlify (and Vercel), it runs as a standard SSR app.

---

## How the Build Pipeline Works

```
Developer writes code
    ↓
TypeScript compiles (catches type errors)
    ↓
Next.js builds (reads MDX, generates pages)
    ↓
Static HTML/CSS/JS files are output to /out
    ↓
Files deployed to Netlify/GitHub Pages/any host
    ↓
User opens site → browser loads HTML
    ↓
React hydrates interactive components (quizzes, progress)
    ↓
Zustand manages state → persists to localStorage
```

### Build Commands

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build (generates static site)
npm run start        # Serve production build locally
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check without building
```

---

## Project Structure Summary

```
klaude-academy/
├── content/              # All lesson content (MDX + JSON)
│   ├── modules/          # 15 module folders, each with _module.json + lesson MDX files
│   ├── templates/        # Copy-paste template library data
│   └── cheatsheet/       # Parsed cheatsheet reference data
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   │   ├── ui/           # Primitives (Button, Badge, Card, ProgressBar)
│   │   ├── layout/       # SiteHeader, SiteFooter, Sidebar, Breadcrumb
│   │   ├── lesson/       # LessonLayout, LessonHeader, LessonNav
│   │   ├── interactive/  # Quiz, FillInBlank, TerminalSim, PromptPlayground
│   │   ├── content/      # CodeBlock, Callout, FileTree, KeyCombo
│   │   ├── progress/     # Dashboard, Achievements, Streak
│   │   └── search/       # SearchDialog (Cmd+K)
│   ├── lib/              # Utilities, constants, stores, content loader
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript interfaces
├── public/               # Static assets (images, icons)
├── scripts/              # Build-time scripts (search index, OG images)
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

---

## Key Design Decisions

1. **Static-first**: No backend = zero hosting cost, instant page loads, no server to maintain. Backend added only when real user needs demand it.

2. **MDX for content**: Lessons are Markdown files with embedded React components. This means non-developers can edit lesson text, while interactive features (quizzes, exercises) are seamlessly embedded.

3. **Single language stack (TypeScript)**: Frontend, backend (future), build tools, tests — everything is TypeScript. One language to learn, one ecosystem to maintain.

4. **Zustand over Redux**: The state is simple (arrays of completed slugs, quiz scores). Zustand is 2KB and has built-in localStorage persistence. Redux would be overkill.

5. **No UI component library (shadcn/ui approach)**: Components are built from scratch with Tailwind, copied into the project (not installed as a dependency). Full control, no version lock-in.

6. **Dark-mode default, light mode supported**: Matches Claude's brand identity. Full light mode via toggle using class-based theming. Code blocks stay dark in both themes.

7. **Progressive enhancement**: The site works as pure HTML content. JavaScript adds interactivity (quizzes, progress) on top. If JS fails to load, users can still read lessons.
