# Implementation Plan

## Claude Academy Learning Platform

**Document Version:** 1.0
**Date:** 2026-04-04
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
| 4 | Practitioner Content (Modules 5-8) | IN PROGRESS | 2 weeks |
| 5 | Prompt Lab + Templates + Cheatsheet Data | DONE | 1 week |
| 6 | Advanced + Expert Content (Modules 9-13) | IN PROGRESS | 3 weeks |
| 7 | QA, Testing, Test Automation | NOT STARTED | 2 weeks |
| 8 | Polish + Deploy | NOT STARTED | 1 week |

**Total estimated timeline:** 13 weeks from project start.

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

### Phase 4: Practitioner Content -- Modules 5-8 (IN PROGRESS)

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

### Phase 6: Advanced + Expert Content -- Modules 9-13 (IN PROGRESS)

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

### Phase 7: QA, Testing, Test Automation (NOT STARTED)

**Objective:** Implement comprehensive test suites and fix all identified issues.

**Deliverables:**

- Vitest configuration with React Testing Library
- Unit tests for utility functions (`cn`, `slugify`, `formatDuration`)
- Unit tests for progress store (all actions, streak calculation, persistence)
- Unit tests for content loader (module/lesson retrieval, sorting, frontmatter parsing)
- Component tests for Quiz, FillInBlank, TerminalSimulator, PromptPlayground
- Component tests for navigation (Breadcrumb, LessonNav, SidebarNav)
- Component tests for progress components (ProgressBar, AchievementBadge, ProgressDashboard)
- Component tests for search (SearchDialog)
- Playwright E2E tests for critical user flows
- Accessibility audit (axe-core integration)
- Performance audit (Lighthouse CI)
- Bug fixes for all issues found during testing

**Files to Create:**

```
vitest.config.ts
playwright.config.ts
src/__tests__/lib/utils.test.ts
src/__tests__/lib/progress-store.test.ts
src/__tests__/lib/content.test.ts
src/__tests__/components/interactive/quiz.test.tsx
src/__tests__/components/interactive/fill-in-blank.test.tsx
src/__tests__/components/interactive/terminal-simulator.test.tsx
src/__tests__/components/layout/breadcrumb.test.tsx
src/__tests__/components/layout/sidebar-nav.test.tsx
src/__tests__/components/progress/progress-dashboard.test.tsx
src/__tests__/components/search/search-dialog.test.tsx
e2e/landing.spec.ts
e2e/curriculum.spec.ts
e2e/lesson.spec.ts
e2e/cheatsheet.spec.ts
e2e/progress.spec.ts
e2e/accessibility.spec.ts
e2e/performance.spec.ts
```

**Dependencies:**

- Phase 6 complete (all content must exist for E2E tests)
- Vitest, @testing-library/react, @testing-library/jest-dom, Playwright, and axe-core installed as dev dependencies

**Acceptance Criteria:**

- Unit test coverage >= 80%
- Component test coverage >= 70%
- All E2E critical path tests pass
- Zero WCAG AA accessibility violations (axe-core)
- Lighthouse scores >= 95 on all metrics
- All tests run in CI (GitHub Actions workflow)

**Risk Factors:**

- Zustand store testing requires mocking localStorage (mitigated: Zustand provides testing utilities)
- MDX content testing may require mocking the file system (mitigated: content loader can be tested with fixture files)
- Playwright tests may be flaky with animations (mitigated: disable Framer Motion in test environment)

---

### Phase 8: Polish + Deploy (NOT STARTED)

**Objective:** Final polish, optimization, and production deployment.

**Deliverables:**

- SEO optimization: meta tags, Open Graph images, sitemap.xml, robots.txt
- Performance optimization: image compression, font subsetting, CSS purging
- 404 page with helpful navigation
- OG image generation script for social sharing
- Vercel deployment configuration
- Custom domain setup
- Analytics integration (privacy-respecting: Plausible or Umami)
- Final content review and proofreading
- README.md update with project overview and contribution guide
- Changelog for v1.0 release

**Files to Create/Modify:**

```
public/sitemap.xml
public/robots.txt
src/app/not-found.tsx
scripts/generate-og-images.ts
scripts/generate-search-index.ts
vercel.json (if needed)
```

**Dependencies:** Phase 7 complete (all tests pass, no critical bugs).

**Acceptance Criteria:**

- Site deploys to Vercel without errors
- All routes return 200 status
- OG images display correctly when shared on social media
- Search engines can crawl all pages (verify with Google Search Console)
- Lighthouse performance score >= 95
- No console errors in production build

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

- Zero hosting cost: static files can be served from free tiers of Vercel, Netlify, or Cloudflare Pages
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

Deploy to Vercel as a serverless application (instead of static). The build output changes from `/out` (static files) to the standard Next.js serverless deployment.

### Impact Assessment

| What Changes | What Stays the Same |
|-------------|-------------------|
| `next.config.ts` (remove `output: 'export'`) | All page components |
| `src/lib/progress-store.ts` (storage adapter) | All interactive components |
| New: auth pages, auth middleware | All content (MDX files) |
| New: `.env.local` with Supabase credentials | All UI components |
| Deployment target (static -> serverless) | All styling (CSS, Tailwind) |
| | Content loader (`src/lib/content.ts`) |
| | Search, cheatsheet, templates |

**Estimated effort:** 2-3 days for a developer familiar with Supabase and Next.js.
