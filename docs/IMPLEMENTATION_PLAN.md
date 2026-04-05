# Implementation Plan

## Claude Academy Learning Platform

**Document Version:** 2.0
**Date:** 2026-04-05
**Status:** Active

---

## Table of Contents

1. [Project Timeline](#1-project-timeline)
2. [Phase Details](#2-phase-details)
3. [Tech Stack Summary](#3-tech-stack-summary)
4. [Architecture Decision Records](#4-architecture-decision-records)
5. [Future Backend Migration Plan](#5-future-backend-migration-plan)

---

## 1. Project Timeline

| Phase | Name | Status | Estimated Duration |
|-------|------|--------|--------------------|
| 1 | Project Skeleton + UI Framework | DONE | 1 week |
| 2 | Remaining Pages | DONE | 1 week |
| 3 | Foundation Content (Modules 1-4) | DONE | 2 weeks |
| 4 | Practitioner Content (Modules 5-8) | DONE | 2 weeks |
| 5 | Prompt Lab + Templates + Cheatsheet Data | DONE | 1 week |
| 6 | Advanced + Expert Content (Modules 9-13) | DONE | 3 weeks |
| 7 | QA & Testing | DONE | 1.5 weeks |
| 8 | DevSecOps Pipeline | DONE | 0.5 weeks |
| 9 | Clean Architecture | DONE | 0.5 weeks |
| 10 | Deployment | DONE | 0.5 weeks |
| 11 | Supabase Backend | DONE | 1 week |
| 12 | Light/Dark Mode | DONE | 0.5 weeks |
| 13 | Netlify Migration | DONE | 0.5 weeks |
| 14 | Admin Dashboard | DONE | 1 week |

**Total timeline:** ~15 weeks from project start. All phases complete.

---

## 2. Phase Details

### Phase 1: Project Skeleton + UI Framework (DONE)

**Objective:** Set up the Next.js project with all infrastructure, design system, layout components, and core UI primitives.

**Deliverables:**

- Next.js 16 project initialized with App Router and static export (`output: 'export'`)
- TypeScript strict mode configuration (`tsconfig.json`)
- Tailwind CSS 4 configured with custom color palette via `@theme inline` in `globals.css`
- Dark mode as default with light mode override via `[data-theme="light"]` CSS variables
- Google Fonts loaded: DM Sans (body), JetBrains Mono (code), Instrument Serif (headings)
- Root layout with ThemeProvider, SiteHeader, and SiteFooter
- UI primitive components: Button, Badge, Card, ProgressBar
- Layout components: SiteHeader (with mobile hamburger menu), SiteFooter, Breadcrumb, SidebarNav, ThemeToggle
- Content components: CodeBlock, Callout, FileTree, KeyCombo, ComparisonTable, StepList, CopyButton, TerminalBlock
- Type definitions: `src/types/content.ts`, `src/types/progress.ts`, `src/types/exercise.ts`, `src/types/index.ts`
- Utility functions: `cn()`, `slugify()`, `formatDuration()` in `src/lib/utils.ts`
- Progress store (Zustand with localStorage persist): `src/lib/progress-store.ts` and `src/lib/store.ts`
- Content loader: `src/lib/content.ts` (reads `_module.json` and MDX files from `content/modules/`)
- Constants: `src/lib/constants.ts` (site name, arc definitions, module order, achievements)
- Global CSS with scrollbar styling, focus indicators, prose content styles, and animations
- ESLint configured with `eslint-config-next`

**Files Created:**

```
next.config.ts
tsconfig.json
package.json
postcss.config.mjs
eslint.config.mjs
src/app/layout.tsx
src/app/globals.css
src/app/favicon.ico
src/types/content.ts
src/types/progress.ts
src/types/exercise.ts
src/types/index.ts
src/lib/utils.ts
src/lib/store.ts
src/lib/progress-store.ts
src/lib/content.ts
src/lib/constants.ts
src/components/ui/button.tsx
src/components/ui/badge.tsx
src/components/ui/card.tsx
src/components/ui/progress-bar.tsx
src/components/layout/site-header.tsx
src/components/layout/site-footer.tsx
src/components/layout/sidebar-nav.tsx
src/components/layout/breadcrumb.tsx
src/components/layout/theme-toggle.tsx
src/components/layout/index.ts
src/components/content/code-block.tsx
src/components/content/callout.tsx
src/components/content/file-tree.tsx
src/components/content/key-combo.tsx
src/components/content/comparison-table.tsx
src/components/content/step-list.tsx
src/components/content/copy-button.tsx
src/components/content/terminal-block.tsx
```

**Acceptance Criteria:**

- `npm run dev` starts the development server without errors
- `npm run build` produces a static site in `/out`
- `npm run lint` passes with no errors
- All components render correctly in both dark and light mode
- Responsive layout works from 320px to 2560px
- TypeScript compilation succeeds with zero errors

---

### Phase 2: Remaining Pages (DONE)

**Objective:** Build all page-level components and interactive components.

**Deliverables:**

- Landing page (`src/app/page.tsx`) with hero section, stats bar, arc cards, features grid, and bottom CTA. Framer Motion animations for entrance effects and staggered reveals.
- Curriculum page (`src/app/curriculum/page.tsx`) with all 13 module cards grouped by arc, progress bars per module, difficulty badges, and lesson/hour counts.
- Module page (`src/app/curriculum/[moduleSlug]/page.tsx`) with server-side data loading via `getModule()`, `generateStaticParams()`, prerequisites, learning objectives, lesson list, and module navigation.
- Lesson page (`src/app/curriculum/[moduleSlug]/[lessonSlug]/page.tsx`) with breadcrumb, lesson sidebar, content rendering (simple Markdown-to-HTML fallback), table of contents, mark complete button, and prev/next navigation.
- Cheatsheet page (`src/app/cheatsheet/page.tsx`) with 12 sections, 90+ items, search bar, and category tab filters.
- Templates page (`src/app/templates/page.tsx`) with 15 templates across 5 categories, category filter tabs, and copy-to-clipboard.
- Prompt Lab page (`src/app/prompt-lab/page.tsx`) with 6-layer prompt builder (PromptPlayground), 20+ prompt templates, and 9 before/after comparisons.
- Progress page (`src/app/progress/page.tsx`) with progress dashboard, reset functionality with confirmation dialog.
- Interactive components: Quiz, FillInBlank, TerminalSimulator, PromptPlayground.
- Progress components: ProgressDashboard, AchievementBadge, StreakCounter.
- Search component: SearchDialog with Cmd+K shortcut.
- Module-level client components: ModuleProgressBar, LessonSidebar, MarkCompleteButton.

**Files Created:**

```
src/app/page.tsx
src/app/curriculum/page.tsx
src/app/curriculum/[moduleSlug]/page.tsx
src/app/curriculum/[moduleSlug]/module-progress.tsx
src/app/curriculum/[moduleSlug]/[lessonSlug]/page.tsx
src/app/curriculum/[moduleSlug]/[lessonSlug]/lesson-sidebar.tsx
src/app/curriculum/[moduleSlug]/[lessonSlug]/mark-complete.tsx
src/app/cheatsheet/page.tsx
src/app/templates/page.tsx
src/app/prompt-lab/page.tsx
src/app/progress/page.tsx
src/components/interactive/quiz.tsx
src/components/interactive/fill-in-blank.tsx
src/components/interactive/terminal-simulator.tsx
src/components/interactive/prompt-playground.tsx
src/components/lesson/lesson-layout.tsx
src/components/lesson/lesson-header.tsx
src/components/lesson/lesson-nav.tsx
src/components/lesson/lesson-complete-button.tsx
src/components/progress/progress-dashboard.tsx
src/components/progress/achievement-badge.tsx
src/components/progress/streak-counter.tsx
src/components/search/search-dialog.tsx
```

**Acceptance Criteria:**

- All 8 routes load without errors
- Navigation between all pages works correctly
- Quiz component accepts answers, shows feedback, calculates score, and supports retry
- FillInBlank validates answers case-insensitively and supports multiple correct answers
- TerminalSimulator accepts commands, shows output, and provides hints after 2 wrong attempts
- PromptPlayground assembles prompts from 6 layers and copies to clipboard
- Progress tracking persists across page reloads (localStorage)
- Search dialog opens with Cmd+K, filters results, and navigates on selection
- Theme toggle switches between dark and light mode
- Mobile hamburger menu opens and closes correctly

---

### Phase 3: Foundation Content -- Modules 1-4 (DONE)

**Objective:** Author all lesson content for the Foundation arc.

**Deliverables:**

- Module 1: Claude Fundamentals (4 lessons) -- What is Claude, Claude model family, constitutional AI, using Claude responsibly
- Module 2: Prompt Engineering (7 lessons) -- Anatomy of a prompt, role prompting, few-shot, chain of thought, constraints and formatting, common mistakes, prompt templates
- Module 3: Claude Code Basics (5 lessons) -- Installation, first session, reading and writing files, running commands, project setup
- Module 4: Commands and Navigation (5 lessons) -- Slash commands, keyboard shortcuts, file references, context management, batch operations
- Each lesson includes: YAML frontmatter, prose content, code examples, and at least one interactive element (quiz, fill-in-blank, or terminal exercise)
- Module metadata files (`_module.json`) for all 4 modules

**Files Created:**

```
content/modules/01-claude-fundamentals/_module.json
content/modules/01-claude-fundamentals/*.mdx (4 files)
content/modules/02-prompt-engineering/_module.json
content/modules/02-prompt-engineering/*.mdx (7 files)
content/modules/03-claude-code-basics/_module.json
content/modules/03-claude-code-basics/*.mdx (5 files)
content/modules/04-commands-and-navigation/_module.json
content/modules/04-commands-and-navigation/*.mdx (5 files)
```

**Dependencies:** Phase 1 and Phase 2 must be complete (content loader and MDX rendering pipeline must work).

**Acceptance Criteria:**

- All 21 lessons render correctly on their respective lesson pages
- `getModules()` returns 4 modules with correct lesson counts
- All frontmatter fields are present and valid
- Code blocks render with syntax highlighting (via simpleMarkdownToHtml fallback)
- Navigation between lessons within a module works correctly
- Module overview pages show learning objectives aggregated from lessons

**Risk Factors:**

- MDX parsing errors for complex content (mitigated: using simple Markdown-to-HTML fallback until full MDX pipeline is integrated)
- Content quality requires review cycles (mitigated: content follows a structured template)

---

### Phase 4: Practitioner Content -- Modules 5-8 (DONE)

**Objective:** Author all lesson content for the Practitioner arc.

**Deliverables:**

- Module 5: CLAUDE.md and Configuration (6 lessons) -- CLAUDE.md anatomy, location hierarchy, settings.json, permissions, environment variables, best practices
- Module 6: Session and Context Management (5 lessons) -- Context windows, compact and clear, session history, memory, context optimization
- Module 7: Git and Development Workflows (6 lessons) -- Git integration, commit workflows, PR creation, code review, pair programming, worktrees
- Module 8: MCP Fundamentals (5 lessons) -- What is MCP, transports, adding servers, using MCP tools, building MCP servers
- Each lesson includes interactive elements appropriate to the topic

**Files to Create:**

```
content/modules/05-claude-md-and-config/*.mdx (6 files, 3 remaining)
content/modules/06-session-and-context/_module.json (exists)
content/modules/06-session-and-context/*.mdx (5 files)
content/modules/07-git-and-workflows/_module.json (exists)
content/modules/07-git-and-workflows/*.mdx (6 files)
content/modules/08-mcp-fundamentals/_module.json (exists)
content/modules/08-mcp-fundamentals/*.mdx (5 files)
```

**Dependencies:** Phase 3 complete (Foundation content establishes writing patterns and difficulty progression).

**Acceptance Criteria:**

- All 22 lessons render correctly
- Content difficulty is noticeably higher than Foundation arc
- Terminal simulator exercises use real Claude Code commands
- Configuration templates in lessons match the templates page data

**Risk Factors:**

- Claude Code features may change between authoring and publishing (mitigated: content references specific versions)
- MCP content requires accurate technical details (mitigated: cross-reference with Anthropic documentation)

---

### Phase 5: Prompt Lab + Templates + Cheatsheet Data (DONE)

**Objective:** Populate all reference and tool pages with comprehensive data.

**Deliverables:**

- Cheatsheet: 12 sections with 90+ items covering all Claude Code commands, flags, shortcuts, configuration, hooks, MCP, agents, and in-session syntax
- Template Library: 15 templates across 5 categories (CLAUDE.md, Settings, Hooks, Agents, Custom Commands)
- Prompt Lab: 20+ prompt templates across 5 categories (Coding, Writing, Analysis, Debugging, Claude Code), 9 before/after comparisons, and the 6-layer prompt builder
- All data is embedded directly in page components (no external data files needed for these pages)

**Files Modified:**

```
src/app/cheatsheet/page.tsx (SECTIONS data array)
src/app/templates/page.tsx (TEMPLATES data array)
src/app/prompt-lab/page.tsx (TEMPLATES and BEFORE_AFTER data arrays)
```

**Acceptance Criteria:**

- Cheatsheet search filters items in real-time
- All 8 cheatsheet tabs filter correctly
- All 15 templates copy to clipboard successfully
- All 20+ prompt templates display with correct categories
- All 9 before/after comparisons show with explanations
- Prompt builder assembles and copies prompts correctly

---

### Phase 6: Advanced + Expert Content -- Modules 9-13 (DONE)

**Objective:** Author all lesson content for Power User and Expert arcs.

**Deliverables:**

- Module 9: Hooks and Automation (5 lessons) -- Hook events, PreToolUse/PostToolUse, notification hooks, chaining hooks, automation patterns
- Module 10: Agents and Skills (7 lessons) -- Agent architecture, custom skills, multi-agent setup, agent communication, teammate management, skill development, agent orchestration
- Module 11: Advanced Workflows (7 lessons) -- Workflow design, multi-step tasks, batch operations, worktree parallelism, CI/CD integration, custom commands, workflow templates
- Module 12: Enterprise and Production (7 lessons) -- Security, compliance, team scaling, cost management, monitoring, deployment patterns, governance
- Module 13: Capstone Project (4 lessons) -- Project planning, implementation, testing, deployment and retrospective

**Files to Create:**

```
content/modules/09-hooks-and-automation/*.mdx (5 files)
content/modules/10-agents-and-skills/*.mdx (7 files)
content/modules/11-advanced-workflows/*.mdx (7 files)
content/modules/12-enterprise-and-production/*.mdx (7 files)
content/modules/13-capstone/*.mdx (4 files)
```

**Dependencies:** Phases 3 and 4 complete. Advanced content builds directly on concepts from earlier modules.

**Acceptance Criteria:**

- All 30 lessons render correctly
- Capstone project provides a complete end-to-end guide
- Expert-level content is technically accurate for production use cases
- All modules have functional `_module.json` metadata

**Risk Factors:**

- Enterprise content requires knowledge of organizational Claude deployments (mitigated: research Anthropic enterprise documentation)
- Capstone project must synthesize all prior modules (mitigated: design capstone to reference specific earlier lessons)

---

### Phase 7: QA & Testing (DONE)

**Objective:** Implement comprehensive test suites covering unit, component, and E2E tests.

**Deliverables:**

- Vitest configuration with React Testing Library and jsdom environment
- 46 unit tests covering utility functions (`cn`, `slugify`, `formatDuration`) and progress store (all actions, streak calculation, persistence)
- Playwright E2E test suite with 36 tests across 6 spec files
- Coverage enforcement: 90% statements, 70% branches, 90% functions, 90% lines
- Achieved: 97% statement coverage, 100% function coverage on lib files
- QA validation scripts: content validation, build report, completeness audit

**Files Created:**

```
vitest.config.ts
playwright.config.ts
src/test/setup.ts
src/lib/__tests__/utils.test.ts
src/lib/__tests__/progress-store.test.ts
e2e/navigation.spec.ts (12 tests)
e2e/progress.spec.ts (6 tests)
e2e/prompt-lab.spec.ts (5 tests)
e2e/cheatsheet.spec.ts (4 tests)
e2e/templates.spec.ts (4 tests)
e2e/responsive.spec.ts (5 tests)
scripts/validate-content.ts
scripts/build-report.ts
scripts/completeness-audit.ts
```

**Acceptance Criteria:** All met.

- 46 unit tests passing (zero failures)
- 97% statement coverage on `src/lib/` files (exceeds 90% threshold)
- 100% function coverage on `src/lib/` files (exceeds 90% threshold)
- 36 E2E tests passing on both desktop (Chromium) and mobile (Pixel 7)
- All tests run in CI (GitHub Actions `ci.yml` workflow)

---

### Phase 8: DevSecOps Pipeline (DONE)

**Objective:** Implement a complete CI/CD pipeline with security scanning.

**Deliverables:**

- 4 GitHub Actions workflows:
  - `ci.yml`: Lint, typecheck, unit tests + coverage, E2E tests, build (parallel jobs with dependency graph)
  - `security.yml`: Dependency audit (`npm audit` + `audit-ci`), CodeQL static analysis, secret detection (TruffleHog)
  - `deploy.yml`: CI gate then triple deploy to Netlify (primary) + GitHub Pages + Vercel (backup)
  - `pr-preview.yml`: Netlify preview deploy on PRs with auto-comment
- Artifact uploads: coverage reports (30 days), Playwright reports (30 days), screenshots on failure (7 days), build output (7 days)
- Weekly scheduled security scan (Monday 8am UTC)

**Files Created:**

```
.github/workflows/ci.yml
.github/workflows/security.yml
.github/workflows/deploy.yml
.github/workflows/pr-preview.yml
```

**Acceptance Criteria:** All met.

- CI pipeline runs lint, typecheck, test, E2E, and build on every push to main/develop
- Security workflow scans dependencies and code on every push to main
- Deploy workflow gates on CI passing before deploying
- PR preview deploys automatically and comments the URL on the PR

---

### Phase 9: Clean Architecture (DONE)

**Objective:** Implement clean architecture patterns for maintainable test and component code.

**Deliverables:**

- Page Object Model (POM) for all E2E tests: 9 page objects (BasePage + 8 page-specific classes) in `e2e/pages/`
- Barrel exports via `index.ts` files for clean import paths
- `data-testid` attributes on all key interactive and structural elements across 12 source files
- All E2E spec files refactored to use POM pattern with `page.getByTestId()` locators

**Files Created:**

```
e2e/pages/base.page.ts
e2e/pages/landing.page.ts
e2e/pages/curriculum.page.ts
e2e/pages/module.page.ts
e2e/pages/lesson.page.ts
e2e/pages/prompt-lab.page.ts
e2e/pages/cheatsheet.page.ts
e2e/pages/templates.page.ts
e2e/pages/progress.page.ts
e2e/pages/index.ts (barrel export)
```

**Files Modified (data-testid attributes added):**

```
src/components/layout/site-header.tsx
src/components/layout/site-footer.tsx
src/app/page.tsx
src/app/curriculum/page.tsx
src/app/curriculum/[moduleSlug]/page.tsx
src/app/curriculum/[moduleSlug]/[lessonSlug]/page.tsx
src/app/curriculum/[moduleSlug]/[lessonSlug]/mark-complete.tsx
src/app/cheatsheet/page.tsx
src/app/templates/page.tsx
src/app/prompt-lab/page.tsx
src/app/progress/page.tsx
src/components/progress/progress-dashboard.tsx
```

**Acceptance Criteria:** All met.

- All 36 E2E tests use POM pattern (no raw selectors in spec files)
- All page object locators use `page.getByTestId()` exclusively
- Barrel exports work for all page object imports

---

### Phase 10: Deployment (DONE)

**Objective:** Deploy the application to production on two platforms.

**Deliverables:**

- Netlify production deployment at `https://klaude-academy.netlify.app` (primary)
- GitHub Pages deployment at `https://khader9jber.github.io/claude-academy/`
- Vercel production deployment at `https://claude-academy-course.vercel.app` (backup)
- Automated deployment on push to main via `deploy.yml` workflow
- PR preview deploys via `pr-preview.yml` workflow (Netlify)

**Acceptance Criteria:** All met.

- Netlify site accessible at `https://klaude-academy.netlify.app`
- GitHub Pages site accessible at `https://khader9jber.github.io/claude-academy/`
- Vercel backup site accessible at `https://claude-academy-course.vercel.app`
- All three sites deploy automatically when CI passes
- PR previews deploy on PR creation/update via Netlify

---

### Phase 11: Supabase Backend (DONE)

**Objective:** Add optional Supabase backend for authentication, progress sync, leaderboard, and certificates.

**Deliverables:**

- Supabase client setup in `src/lib/supabase/` (client creation, helpers, types)
- Authentication pages: login (`src/app/auth/login/`), signup (`src/app/auth/signup/`), callback (`src/app/auth/callback/`)
- Auth provider context with `useAuth()` hook for session management across the app
- User profile page (`src/app/profile/`) with editable display name
- Public leaderboard page (`src/app/leaderboard/`) showing top users by lessons completed
- Certificate pages (`src/app/certificate/`) for each arc completion
- Auth-related UI components in `src/components/auth/`
- PostgreSQL schema: 7 tables (`profiles`, `user_progress`, `completed_lessons`, `quiz_scores`, `certificates`, `leaderboard`, `user_settings`) with Row Level Security
- Database migration file: `supabase/migrations/001_initial.sql`
- Auto-profile trigger: creates a `profiles` row on new user signup
- Progress sync hook (`useProgressSync`): dual-write to localStorage + Supabase for authenticated users
- Site header updated: shows "Sign In" when logged out, user menu when logged in
- `next.config.ts` updated: SSR for Netlify/Vercel, static export only when `DEPLOY_TARGET=github-pages`
- Login and signup pages include `data-testid` attributes for E2E testing
- Supabase env vars are optional -- site works without them as a fully static app

**Acceptance Criteria:**

- Users can sign up with email/password, Google, or GitHub
- Logged-in users' progress syncs to Supabase
- Guest users' progress saves to localStorage only (no errors)
- Leaderboard page shows top users ranked by lessons completed
- Certificate pages display arc name, user name, and completion date
- Profile page allows editing display name
- Site works identically when Supabase env vars are not set (auth UI hidden)
- All auth pages have `data-testid` attributes
- Snapshot `v0.1.0` tag preserves the pre-backend state

---

### Phase 12: Light/Dark Mode (DONE)

**Objective:** Add full light mode theme support with dark mode remaining the default.

**Deliverables:**

- Light mode color palette defined as CSS custom property overrides in `src/app/globals.css`
- ThemeProvider switched to class-based theme toggling via next-themes
- Code blocks and terminal components remain dark in both themes for readability
- All pages and components tested in both light and dark mode
- Theme preference persists across sessions via next-themes

**Acceptance Criteria:**

- Theme toggle switches between dark and light mode on all pages
- Code blocks and terminal outputs stay dark in light mode
- All text meets WCAG AA contrast ratios in both themes
- Theme preference persists after page reload
- No flash of wrong theme on page load

---

### Phase 13: Netlify Migration (DONE)

**Objective:** Migrate primary deployment from Vercel to Netlify to resolve deployment protection issues on Vercel's free plan.

**Deliverables:**

- Primary deployment moved to Netlify at `https://klaude-academy.netlify.app`
- Netlify configured for SSR with full auth support (auth callbacks, server-side sessions)
- GitHub Pages remains as secondary static deployment
- Vercel demoted to backup deployment (kept for redundancy)
- CI/CD pipeline updated: `deploy.yml` deploys to Netlify (primary) + GitHub Pages + Vercel (backup)
- PR preview deploys switched from Vercel to Netlify
- New CI/CD secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
- All project documentation updated to reflect new deployment architecture

**Acceptance Criteria:**

- Netlify site accessible at `https://klaude-academy.netlify.app` with SSR and full auth
- GitHub Pages site still accessible at `https://khader9jber.github.io/claude-academy/`
- Vercel backup still accessible at `https://claude-academy-course.vercel.app`
- Deploy pipeline runs all three deployments on push to main
- PR previews deploy to Netlify and comment the preview URL

---

### Phase 14: Admin Dashboard (DONE)

**Objective:** Build a complete admin dashboard for managing content, users, analytics, announcements, and site settings from the browser.

**Deliverables:**

- Admin dashboard at `/admin` with 6 sections:
  - **Dashboard**: Overview stats (total users, lessons, completion rates, recent activity)
  - **Content**: Create, edit, delete lessons with markdown editor, frontmatter fields, and quiz builder. Content preview modal with rendered markdown.
  - **Users**: List, search, view user details (profile, progress, scores), manage roles (promote/revoke admin)
  - **Analytics**: Page view counts, lesson completion rates, quiz performance averages, user growth charts
  - **Announcements**: Create/edit/delete announcements with type badges (info, warning, success, error) and scheduling (start/end dates)
  - **Settings**: Configurable site options as key-value pairs, changes take effect immediately
- Admin auth chain: `app_metadata.role === 'admin'` → `is_admin()` SQL function → `useAdmin()` React hook → `AdminGuard` component
- Database migration `002_admin.sql` adding 4 tables: `managed_content`, `site_settings`, `announcements`, `analytics_events` with RLS policies
- CLI script `scripts/make-admin.ts` for promoting users to admin via service role key
- Admin link in site header (visible only to admin users)
- Content preview modal with markdown rendering

**Files Created:**

```
src/app/admin/page.tsx
src/app/admin/content/page.tsx
src/app/admin/users/page.tsx
src/app/admin/analytics/page.tsx
src/app/admin/announcements/page.tsx
src/app/admin/settings/page.tsx
src/components/admin/AdminGuard.tsx
src/components/admin/ (admin-specific components)
src/lib/admin.ts
src/hooks/useAdmin.ts
scripts/make-admin.ts
supabase/migrations/002_admin.sql
```

**Acceptance Criteria:**

- Admin dashboard accessible at `/admin` only by users with admin role
- Non-admin users see "Access Denied", unauthenticated users redirect to login
- Content CRUD operations work: create, edit, delete lessons with preview
- User list displays with search, role management works (promote/revoke)
- Analytics charts render with real data from `analytics_events` table
- Announcements can be created with type badges and scheduling
- Settings page saves and loads key-value pairs
- `make-admin.ts` script successfully promotes a user to admin
- All 4 admin tables have proper RLS policies
- Admin link appears in header only for admin users

---

## 3. Tech Stack Summary

Full details are documented in `TECH_STACK.md` at the project root. Summary:

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16 | App Router, static export, page generation |
| UI Library | React | 19 | Component rendering |
| Language | TypeScript | 5.6+ | Type safety |
| Styling | Tailwind CSS | 4 | Utility-first CSS |
| Content | MDX 3 (next-mdx-remote) | 6 | Markdown + React components |
| Syntax | Shiki (@shikijs/rehype) | 4 | Code syntax highlighting |
| State | Zustand | 5 | Client-side state management |
| Search | Fuse.js | 7.3 | Fuzzy search |
| Animation | Framer Motion | 12+ | Page transitions and effects |
| Icons | Lucide React | 1.7+ | Icon set |
| Fonts | DM Sans, JetBrains Mono, Instrument Serif | -- | Typography |
| Theme | next-themes | 0.4 | Dark/light mode |

---

## 4. Architecture Decision Records

### ADR-001: Static-First Architecture (No Backend)

**Status:** Accepted

**Context:** The application needs to deliver educational content to users. User data includes progress tracking, quiz scores, and streak information.

**Decision:** Build the application as a fully static site using Next.js with `output: 'export'`. All user data is stored in the browser's localStorage.

**Rationale:**

- Zero hosting cost: static files can be served from free tiers of Netlify, Vercel, or Cloudflare Pages
- Maximum performance: pre-rendered HTML means instant page loads, no server processing delay
- Zero server maintenance: no server to patch, scale, or monitor
- Simplicity: the entire application is a set of files that any web server can host
- Privacy: no user data leaves the browser; no tracking, no accounts, no cookies
- The target audience (learners) does not need cross-device sync for an initial release

**Consequences:**

- Progress data is device-specific and browser-specific. Clearing browser data erases progress.
- No user accounts, no authentication, no social features (comments, leaderboards).
- No server-side analytics (page views, quiz completion rates).
- Adding these features later requires a backend migration (see ADR-006 and Section 5).

**Alternatives Considered:**

- Full-stack Next.js with API routes and database: rejected because it adds complexity, cost, and maintenance burden for features not needed in v1.
- Headless CMS (Sanity, Contentful) for content: rejected because MDX files in the repository are simpler, free, and version-controlled.

---

### ADR-002: MDX for Content

**Status:** Accepted

**Context:** Lesson content needs to include prose text, code blocks, interactive components (quizzes, exercises), and rich formatting.

**Decision:** Use MDX (Markdown + JSX) as the content format, with `next-mdx-remote` for server-side compilation and `gray-matter` for frontmatter parsing.

**Rationale:**

- Authors can write content in familiar Markdown syntax
- React components (Quiz, FillInBlank, TerminalSimulator) can be embedded directly in content
- Frontmatter provides structured metadata (title, difficulty, duration, objectives)
- Content is version-controlled in the Git repository
- No external CMS dependency or API calls
- The remark/rehype plugin ecosystem provides extensibility (GFM tables, auto-linking headings, syntax highlighting)

**Consequences:**

- Content authors must understand basic MDX syntax for embedding components
- Adding new interactive components requires updating the MDX component mapping
- Build time increases with content volume (mitigated by Next.js caching)
- Currently using a simplified Markdown-to-HTML fallback instead of full MDX rendering (to be upgraded)

**Alternatives Considered:**

- Plain Markdown with JSON data files for exercises: rejected because it separates content from its interactive elements, making authoring harder.
- Notion/Google Docs as content source: rejected because it adds API dependency and complex sync logic.
- Contentful/Sanity CMS: rejected because it adds cost, complexity, and removes content from version control.

---

### ADR-003: Zustand Over Redux

**Status:** Accepted

**Context:** The application needs client-side state management for progress tracking, quiz scores, and streaks.

**Decision:** Use Zustand for state management with the `persist` middleware for localStorage serialization.

**Rationale:**

- Zustand is 2KB gzipped vs Redux at 7KB+ (plus Redux Toolkit at 40KB+)
- The state shape is simple: arrays of strings (completed lessons, active days), a record of scores, and a few numbers (streak counts)
- Zustand's `persist` middleware provides localStorage integration in 1 line of configuration
- No boilerplate: no actions, reducers, action types, or middleware configuration
- React 19 compatible out of the box
- Zustand stores are plain JavaScript -- easy to test without React rendering

**Consequences:**

- Team members familiar with Redux will need to learn Zustand's API (minimal: `create`, `set`, `get`)
- Zustand does not provide Redux DevTools integration by default (optional middleware available if needed)
- The store is a single file (`src/lib/progress-store.ts`) which is appropriate for the current state complexity

**Alternatives Considered:**

- Redux Toolkit: rejected as overkill for the simple state shape. Would add 40KB+ and significant boilerplate.
- React Context + useReducer: rejected because it lacks built-in persistence and causes unnecessary re-renders on every context change.
- Jotai: considered as another lightweight option, but Zustand's `persist` middleware and imperative `get()` access were more convenient for the streak calculation logic.

---

### ADR-004: Tailwind CSS 4

**Status:** Accepted

**Context:** The application needs a styling system that supports a custom design system (colors, typography, spacing), dark/light mode, and responsive layouts.

**Decision:** Use Tailwind CSS 4 with the `@theme inline` directive for custom design tokens defined in `src/app/globals.css`.

**Rationale:**

- Utility-first CSS avoids naming collisions and style leakage between components
- Tailwind 4's `@theme inline` allows defining custom colors directly in CSS without `tailwind.config.js`
- Dark mode is handled via CSS custom properties with `[data-theme="light"]` overrides
- The `tailwind-merge` library resolves class conflicts at runtime (via the `cn()` utility)
- Responsive design uses Tailwind's breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- No unused CSS in production (Tailwind scans source files and generates only used classes)

**Consequences:**

- Component markup is longer than traditional CSS due to utility class lists
- Developers must learn Tailwind's class naming conventions
- Custom component styles require the `cn()` utility to properly merge conflicting classes

**Alternatives Considered:**

- CSS Modules: rejected because they require separate `.module.css` files and don't provide a consistent design token system.
- styled-components: rejected because it adds runtime overhead and does not tree-shake as well as Tailwind's static extraction.
- vanilla-extract: considered for its TypeScript-first approach, but Tailwind's ecosystem and familiarity won out.

---

### ADR-005: No UI Component Library (shadcn/ui Approach)

**Status:** Accepted

**Context:** The application needs reusable UI components (Button, Badge, Card, ProgressBar, etc.).

**Decision:** Build all UI components from scratch using Tailwind CSS, following the shadcn/ui philosophy of owning the component code rather than depending on a library.

**Rationale:**

- Full control over component markup, styling, and behavior
- No external dependency version lock-in or breaking change risk
- Components are tailored exactly to the project's design system (colors, radii, spacing)
- The `class-variance-authority` (CVA) library provides typed component variants without a full UI library
- Components are simple enough that a library would add more complexity than it saves

**Consequences:**

- Components must be built and tested manually
- No automatic accessibility features from a library like Radix UI (must implement ARIA attributes manually)
- New component types require development effort rather than importing from a library

**Alternatives Considered:**

- Radix UI + shadcn/ui: considered for accessibility primitives, but the actual shadcn/ui components would need restyling to match the custom design system, negating the time savings.
- Material UI: rejected because it imposes its own design language.
- Headless UI: considered for accessible primitives, may be added later for complex components like Dialog and Listbox.

---

### ADR-006: localStorage for Persistence

**Status:** Accepted (with planned migration path)

**Context:** User progress data needs to persist across browser sessions.

**Decision:** Use the browser's localStorage API via Zustand's `persist` middleware. Data is stored under the key `claude-academy-progress`.

**Rationale:**

- Zero infrastructure cost (no database, no server)
- Instant read/write (no network latency)
- Works offline
- Simple implementation (1 line of Zustand configuration)
- Sufficient for single-device usage, which is the v1 target
- User privacy is maximized (no data transmitted)

**Consequences:**

- Data is lost if the user clears browser data
- Data does not sync across devices or browsers
- localStorage has a ~5MB limit per origin (sufficient for progress data but not for large datasets)
- Private/incognito browsing may restrict localStorage access (the application should handle this gracefully with an in-memory fallback)

**Future Migration Path:**

When user accounts and cross-device sync are needed, the localStorage persistence can be replaced with a Supabase backend. The migration requires:

1. Install `@supabase/supabase-js`
2. Create a Supabase project with a `user_progress` table
3. Add authentication (Supabase Auth: email/password or OAuth)
4. Write a custom Zustand persist storage adapter that reads/writes to Supabase instead of localStorage
5. Remove `output: 'export'` from next.config.ts
6. Deploy as a serverless app instead of static site

The frontend components remain completely unchanged. Only the storage layer in `src/lib/progress-store.ts` changes (approximately 50 lines of code).

---

## 5. Future Backend Migration Plan

### When to Add a Backend

A backend should be added when any of these user needs materialize:

1. **User accounts** -- users want to log in and have a persistent identity
2. **Cross-device sync** -- users want to continue on a different device
3. **Certificates** -- users want verifiable proof of completion
4. **Analytics** -- the team wants to know lesson completion rates and drop-off points
5. **Comments/Q&A** -- users want to discuss lessons with each other
6. **Payments** -- premium content tiers are introduced
7. **Leaderboards** -- users want competitive comparison

### Recommended Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Backend-as-a-Service | Supabase | Free tier supports 50K users, includes Auth + PostgreSQL + Edge Functions, TypeScript SDK, integrates with Next.js in ~50 lines |
| Authentication | Supabase Auth | Email/password, Google, GitHub login built-in. Free. |
| Database | Supabase PostgreSQL | Relational database for structured progress data. Row-level security for multi-user. |
| Edge Functions | Supabase Edge Functions | For server-side logic (certificate generation, analytics aggregation). Deno runtime. |
| Alternative: Self-Hosted | PostgreSQL + Prisma + NextAuth.js | More control, more setup. Recommended only if Supabase limitations are hit. |

### Migration Steps

**Step 1: Remove Static Export**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Remove: output: "export",
  images: { unoptimized: true }, // Can now enable optimization
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};
```

**Step 2: Install Dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

**Step 3: Create Supabase Project**

1. Sign up at supabase.com
2. Create a new project
3. Create the `user_progress` table with columns matching the `ProgressState` interface
4. Enable Row-Level Security (RLS) with policies for authenticated users
5. Copy the project URL and anon key to `.env.local`

**Step 4: Add Auth**

Create login/signup pages using Supabase Auth UI or custom forms. Add auth middleware to protect progress-related API routes.

**Step 5: Swap Storage Adapter**

Replace the Zustand persist middleware's storage from localStorage to a custom Supabase adapter:

```typescript
// Custom storage adapter (approximately 30 lines)
const supabaseStorage = {
  getItem: async (name: string) => {
    const { data } = await supabase
      .from('user_progress')
      .select('state')
      .eq('user_id', userId)
      .single();
    return data?.state ?? null;
  },
  setItem: async (name: string, value: string) => {
    await supabase
      .from('user_progress')
      .upsert({ user_id: userId, state: value });
  },
  removeItem: async (name: string) => {
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', userId);
  },
};
```

**Step 6: Deploy**

Deploy to Netlify as a serverless application (instead of static). The build output changes from `/out` (static files) to the standard Next.js serverless deployment. Vercel is available as a backup.

### Impact Assessment

| What Changes | What Stays the Same |
|-------------|-------------------|
| `next.config.ts` (remove `output: 'export'`) | All page components |
| `src/lib/progress-store.ts` (storage adapter) | All interactive components |
| New: auth pages, auth middleware | All content (MDX files) |
| New: `.env.local` with Supabase credentials | All UI components |
| Deployment target (static -> serverless on Netlify) | All styling (CSS, Tailwind) |
| | Content loader (`src/lib/content.ts`) |
| | Search, cheatsheet, templates |

**Estimated effort:** 2-3 days for a developer familiar with Supabase and Next.js.
