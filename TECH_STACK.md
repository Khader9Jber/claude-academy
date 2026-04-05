# Claude Academy — Technical Architecture

## Project Overview

Claude Academy is a comprehensive interactive learning website for mastering Claude and Claude Code. It is built as a static-first Next.js application with plans for a future backend.

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

### Design System

Colors extracted from the Claude cheatsheet branding:
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

Arc color coding:
- Foundation → Green (#5cb870)
- Practitioner → Blue (#5e9ed6)
- Power User → Purple (#a07ed6)
- Expert → Gold (#d4a053)

### Backend

**None currently.** The site is fully static (`output: 'export'` in next.config.ts). The build step generates plain HTML/CSS/JS files. No server runs in production.

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
| Vercel (primary) | Zero-config for Next.js, free tier sufficient, automatic deploys on git push |
| Netlify (alternative) | Static hosting, similar to Vercel |
| Cloudflare Pages (alternative) | Free, fast global CDN |
| Any static host | The build output is just HTML/CSS/JS files — works anywhere |

---

## Future Architecture (Phase 2 — With Backend)

When the project needs user accounts, cross-device progress sync, certificates, analytics, or payments, here is the planned backend stack. All technologies are JavaScript/TypeScript to keep a single-language stack.

### Backend Framework

| Technology | Purpose |
|-----------|---------|
| Next.js API Routes | Server-side endpoints — stays within the same Next.js project, no separate server needed |
| OR Express.js / Fastify | Standalone Node.js server — if we want to separate backend from frontend |

When adding a backend, we remove `output: 'export'` from next.config.ts and deploy to Vercel as a serverless app instead of a static site. The frontend stays exactly the same.

### Database

| Technology | Purpose |
|-----------|---------|
| Supabase | Backend-as-a-service — provides PostgreSQL database + Auth + Edge Functions. Free tier supports 50K users. JS/TS SDK. |
| OR PostgreSQL + Prisma | Self-hosted database with Prisma ORM (TypeScript). More control, more setup. |
| OR MongoDB + Mongoose | Document database — flexible schema, good for user profiles and progress data. JS/TS native. |

**Recommended: Supabase** — fastest path, free tier is generous, built-in auth, TypeScript SDK, integrates with Next.js in ~50 lines of code.

### Authentication

| Technology | Purpose |
|-----------|---------|
| Supabase Auth | Email/password, Google, GitHub login — built into Supabase, free |
| OR NextAuth.js (Auth.js) | Flexible auth library for Next.js — supports 50+ providers |
| OR Clerk | Drop-in auth UI components — premium but fastest to implement |

### What the Backend Would Handle

| Feature | Implementation |
|---------|---------------|
| User accounts | Supabase Auth — signup, login, sessions |
| Progress sync | Save Zustand state to Supabase PostgreSQL instead of localStorage |
| Certificates | Generate PDF certificates on lesson completion (server-side) |
| Analytics | Track lesson views, quiz pass rates, drop-off points |
| Comments / Q&A | Store and display user discussions per lesson |
| Payments | Stripe (JS SDK) for premium content tiers |
| Leaderboards | Query top users by completion %, streak, quiz scores |
| Admin panel | Dashboard to manage content, view analytics, moderate comments |

### Migration Path (localStorage → Supabase)

The current Zustand store in `src/lib/progress-store.ts` uses localStorage persist middleware. Migrating to Supabase requires:

1. Remove `output: 'export'` from next.config.ts
2. Install `@supabase/supabase-js`
3. Create Supabase project (free at supabase.com)
4. Add auth routes (login/signup pages)
5. Swap the Zustand persist middleware from localStorage to a custom Supabase adapter
6. Deploy to Vercel as serverless instead of static

The frontend components, pages, and content remain **completely unchanged**. Only the storage layer changes.

### Estimated backend addition: ~50-100 lines of new code + Supabase setup

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
Files deployed to Vercel/Netlify/any host
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
claude-academy/
├── content/              # All lesson content (MDX + JSON)
│   ├── modules/          # 13 module folders, each with _module.json + lesson MDX files
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

6. **Dark-mode default**: Matches Claude's brand identity. Light mode available via toggle.

7. **Progressive enhancement**: The site works as pure HTML content. JavaScript adds interactivity (quizzes, progress) on top. If JS fails to load, users can still read lessons.
