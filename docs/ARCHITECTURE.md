# System Architecture Document

## Claude Academy Learning Platform

**Document Version:** 2.0
**Date:** 2026-04-05
**Status:** Active

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Content Pipeline](#2-content-pipeline)
3. [State Management](#3-state-management)
4. [Component Architecture](#4-component-architecture)
5. [Routing Structure](#5-routing-structure)
6. [Design System](#6-design-system)
7. [DevSecOps Pipeline Architecture](#7-devsecops-pipeline-architecture)
8. [E2E Test Architecture](#8-e2e-test-architecture)
9. [Barrel Export Structure](#9-barrel-export-structure)
10. [Deployment Architecture](#10-deployment-architecture)
11. [data-testid Convention](#11-data-testid-convention)
12. [Authentication Architecture](#12-authentication-architecture)
13. [Database Architecture](#13-database-architecture)
14. [Progress Sync Architecture](#14-progress-sync-architecture)

---

## 1. High-Level Architecture

### 1.1 System Overview

Claude Academy is a static-first web application. The entire site is pre-rendered at build time into HTML, CSS, and JavaScript files. There is no server-side rendering at request time, no database, and no backend API. All interactivity (quizzes, progress tracking, search) runs in the user's browser.

### 1.2 Architecture Diagram

```
+-------------------------------------------------------------------+
|                         BUILD TIME                                |
|                                                                   |
|  content/modules/         src/                  next.config.ts    |
|  ├── _module.json    ├── app/                  (output: 'export') |
|  └── *.mdx           ├── components/                              |
|        │              ├── lib/                                     |
|        │              └── types/                                   |
|        ▼                    │                                      |
|  gray-matter (parse)        │                                      |
|  fs.readFileSync            ▼                                      |
|        │              Next.js Build (next build)                   |
|        └──────────────────► │                                      |
|                             ▼                                      |
|                      /out/ directory                               |
|                      (static HTML/CSS/JS)                          |
+-------------------------------------------------------------------+
                              │
                              ▼
+-------------------------------------------------------------------+
|                        DEPLOY TIME                                |
|                                                                   |
|  /out/ files ──────► CDN (Vercel / Netlify / Cloudflare)          |
+-------------------------------------------------------------------+
                              │
                              ▼
+-------------------------------------------------------------------+
|                        RUNTIME (Browser)                          |
|                                                                   |
|  Browser loads HTML    React hydrates     Zustand manages state   |
|        │               interactive         │                      |
|        ▼               components          ▼                      |
|  Static content           │            localStorage               |
|  is visible            User interacts   (claude-academy-progress) |
|  immediately           with quizzes,                              |
|                        exercises,                                  |
|                        search, etc.                                |
+-------------------------------------------------------------------+
```

### 1.3 Build-Time vs Runtime Behavior

| Behavior | Build Time | Runtime (Browser) |
|----------|-----------|-------------------|
| **Content parsing** | MDX frontmatter parsed by `gray-matter`, content extracted | Content already rendered as HTML |
| **Page generation** | `generateStaticParams()` creates all route permutations | Pages served as pre-rendered HTML |
| **Routing** | Static paths generated for all modules and lessons | Client-side navigation via Next.js Link |
| **Syntax highlighting** | Shiki processes code blocks (when full MDX pipeline is active) | Code blocks pre-highlighted in HTML |
| **State initialization** | None (no state exists at build time) | Zustand store created, rehydrated from localStorage |
| **Search index** | Planned: Fuse.js index generated from content | Fuzzy search runs against pre-built index |
| **Interactive components** | Server components rendered to HTML, client components marked for hydration | Client components hydrate and become interactive |

### 1.4 Component Hierarchy (High-Level)

```
html (lang="en", data-theme="dark")
└── body
    └── ThemeProvider (next-themes)
        ├── SiteHeader
        │   ├── Logo (Link to /)
        │   ├── DesktopNav (hidden on mobile)
        │   │   ├── Link: Curriculum
        │   │   ├── Link: Prompt Lab
        │   │   ├── Link: Cheatsheet
        │   │   └── Link: Templates
        │   ├── SearchButton
        │   ├── ThemeToggle
        │   └── MobileMenuButton (hidden on desktop)
        ├── <main>
        │   └── {Page Component}
        ├── SiteFooter
        └── SearchDialog (overlay, global)
```

---

## 2. Content Pipeline

### 2.1 Content Authoring

Content is authored as MDX files in the `content/modules/` directory. Each module has its own subdirectory with a `_module.json` metadata file and one or more `.mdx` lesson files.

**Directory structure:**

```
content/
└── modules/
    ├── 01-claude-fundamentals/
    │   ├── _module.json
    │   ├── 01-what-is-claude.mdx
    │   ├── 02-claude-model-family.mdx
    │   ├── 03-constitutional-ai.mdx
    │   └── 04-using-claude-responsibly.mdx
    ├── 02-prompt-engineering/
    │   ├── _module.json
    │   ├── 01-anatomy-of-a-prompt.mdx
    │   └── ...
    └── 13-capstone/
        ├── _module.json
        └── ...
```

### 2.2 Module Metadata (`_module.json`)

```json
{
  "title": "Claude Fundamentals",
  "slug": "claude-fundamentals",
  "description": "Understand what Claude is, who built it...",
  "arc": "foundation",
  "order": 1,
  "icon": "brain",
  "color": "#5cb870",
  "estimatedHours": 2,
  "prerequisites": [],
  "lessonCount": 4
}
```

### 2.3 Lesson Frontmatter

```yaml
---
title: "What is Claude?"
slug: "what-is-claude"
order: 1
difficulty: "beginner"
duration: 15
tags: ["claude", "ai", "introduction"]
objectives:
  - "Understand what Claude is and who built it"
  - "Learn the different Claude model variants"
---
```

### 2.4 Content Processing Flow

```
_module.json ──────────► JSON.parse() ──────────► ModuleMetadata object
                                                        │
                                                        ▼
                                                  getModules()
                                                  (sorted by order)
                                                        │
                                                        ▼
*.mdx files ──────────► gray-matter ──────────► { data: frontmatter,
                         (parse)                  content: mdx_body }
                                                        │
                                                        ▼
                                                  Lesson object
                                                  (slug, title, order,
                                                   difficulty, duration,
                                                   tags, objectives,
                                                   content)
```

### 2.5 Content Loader Functions

The content loader (`src/lib/content.ts`) provides these functions:

| Function | Input | Output | Used By |
|----------|-------|--------|---------|
| `getModules()` | None | `Module[]` (sorted by order) | Curriculum page, `generateStaticParams` |
| `getModule(slug)` | Module slug string | `Module \| null` | Module page, lesson page |
| `getLesson(moduleSlug, lessonSlug)` | Two slug strings | `Lesson \| null` | Lesson page |
| `getAllLessons()` | None | `Lesson[]` (flat array) | Search index generation |
| `getModuleSlugs()` | None | `string[]` | Static param generation |
| `getLessonSlugs(moduleSlug)` | Module slug string | `string[]` | Static param generation |

All functions read from the filesystem using `fs.readFileSync` at build time. They are called from server components and `generateStaticParams` functions, never from client components.

### 2.6 MDX Rendering

The current implementation uses a simplified Markdown-to-HTML converter (`simpleMarkdownToHtml` in the lesson page) as a fallback. The full MDX pipeline using `next-mdx-remote` is planned and will support:

- Custom component mapping (Quiz, FillInBlank, TerminalSimulator, Callout, CodeBlock, etc.)
- Remark plugins: `remark-gfm` (GitHub-flavored Markdown tables, task lists, strikethrough)
- Rehype plugins: `rehype-slug` (heading IDs), `rehype-autolink-headings` (anchor links), `@shikijs/rehype` (syntax highlighting)

**Future MDX component mapping:**

```typescript
const components = {
  Quiz: Quiz,
  FillInBlank: FillInBlank,
  TerminalSimulator: TerminalSimulator,
  Callout: Callout,
  CodeBlock: CodeBlock,
  FileTree: FileTree,
  KeyCombo: KeyCombo,
  ComparisonTable: ComparisonTable,
  StepList: StepList,
};
```

---

## 3. State Management

### 3.1 Zustand Store Architecture

The application uses two Zustand stores:

**Primary store** (`src/lib/progress-store.ts`):

Used by module pages, lesson pages, and the progress dashboard. This is the canonical store with the full `ProgressState` interface.

**Secondary store** (`src/lib/store.ts`):

Used by the curriculum page and the progress page. Has a slightly different interface optimized for those views (flat quiz scores, module progress arrays, achievement objects with unlock state).

Both stores persist to localStorage under the same key (`claude-academy-progress`) and share core state (completed lessons, quiz scores, streak).

### 3.2 State Shape

```typescript
// Primary store state (src/lib/progress-store.ts)
{
  completedLessons: string[],        // ["claude-fundamentals/what-is-claude", ...]
  quizScores: {
    [quizId: string]: {
      score: number,                  // Most recent score (percentage)
      total: number,                  // Total questions
      bestScore: number               // Highest ever score
    }
  },
  completedExercises: string[],      // ["exercise-01", ...]
  activeDays: string[],              // ["2026-04-01", "2026-04-02", ...]
  currentStreak: number,             // e.g., 3
  longestStreak: number,             // e.g., 7
  unlockedAchievements: string[],    // ["first-lesson", "five-lessons", ...]
  lastVisitedLesson: string | null   // "claude-fundamentals/what-is-claude"
}
```

### 3.3 Actions

| Action | Trigger | Side Effects |
|--------|---------|-------------|
| `markLessonComplete(id)` | User clicks "Mark as Complete" | Adds to `completedLessons` (if not duplicate), sets `lastVisitedLesson`, calls `recordActivity()` |
| `saveQuizScore(quizId, score, total)` | Quiz completion | Updates `quizScores[quizId]` with score, total, and max bestScore. Calls `recordActivity()` |
| `markExerciseComplete(id)` | Exercise validation passes | Adds to `completedExercises` (if not duplicate). Calls `recordActivity()` |
| `recordActivity()` | Called by other actions | Adds today's date to `activeDays` (if not duplicate). Recalculates `currentStreak` and `longestStreak` |
| `isLessonComplete(id)` | Sidebar rendering, button rendering | Read-only: returns boolean |
| `getModuleProgress(lessonIds)` | Module card rendering | Read-only: returns percentage |
| `reset()` | User clicks "Reset All" + confirms | Resets all state to initial values |

### 3.4 localStorage Persistence Flow

```
State Change (e.g., markLessonComplete)
    │
    ▼
Zustand set() updates state in memory
    │
    ▼
Zustand persist middleware:
    1. Serializes entire state to JSON
    2. Calls localStorage.setItem("claude-academy-progress", jsonString)
    │
    ▼
On next page load:
    1. Zustand persist middleware reads localStorage.getItem("claude-academy-progress")
    2. Parses JSON string
    3. Merges with initial state (rehydration)
    4. Components re-render with persisted state
```

### 3.5 Streak Calculation Algorithm

The streak calculation in `calculateStreak()` works as follows:

1. Sort all `activeDays` in reverse chronological order.
2. Check if the most recent day is today or yesterday (to start counting).
3. Iterate through sorted days, counting consecutive 1-day gaps.
4. When a gap greater than 1 day is found, the streak breaks.
5. Track `longestStreak` as the maximum of all consecutive runs.

```
activeDays: ["2026-04-01", "2026-04-02", "2026-04-03", "2026-04-04"]
Today: 2026-04-04

Sorted (reverse): ["2026-04-04", "2026-04-03", "2026-04-02", "2026-04-01"]
Consecutive gaps: 1, 1, 1 → currentStreak = 4
longestStreak = max(4, previous_longest)
```

---

## 4. Component Architecture

### 4.1 Component Categories

Components are organized into 7 categories under `src/components/`:

| Category | Directory | Purpose | Examples |
|----------|-----------|---------|---------|
| **UI** | `src/components/ui/` | Generic, reusable UI primitives with no domain knowledge | Button, Badge, Card, ProgressBar |
| **Layout** | `src/components/layout/` | Page-level structural components | SiteHeader, SiteFooter, Breadcrumb, SidebarNav, ThemeToggle |
| **Content** | `src/components/content/` | Components for rendering rich content within lessons | CodeBlock, Callout, FileTree, KeyCombo, ComparisonTable, StepList, CopyButton, TerminalBlock |
| **Interactive** | `src/components/interactive/` | Components for interactive learning exercises | Quiz, FillInBlank, TerminalSimulator, PromptPlayground |
| **Lesson** | `src/components/lesson/` | Components specific to the lesson page layout | LessonLayout, LessonHeader, LessonNav, LessonCompleteButton |
| **Progress** | `src/components/progress/` | Components for displaying progress and achievements | ProgressDashboard, AchievementBadge, StreakCounter |
| **Search** | `src/components/search/` | Global search components | SearchDialog |

### 4.2 Component Dependency Graph

```
UI Components (no dependencies on other component categories)
    Button ← used by: Progress, Interactive, Layout
    Badge ← used by: pages (Cheatsheet, Templates, Prompt Lab, Progress)
    Card ← used by: pages (Curriculum)
    ProgressBar ← used by: Progress (ProgressDashboard), pages (Module)

Layout Components (depend on: UI)
    SiteHeader ← uses: ThemeToggle, cn()
    SiteFooter ← uses: cn()
    Breadcrumb ← used by: all subpages
    SidebarNav ← used by: Lesson page
    ThemeToggle ← uses: next-themes

Content Components (depend on: UI)
    CodeBlock ← uses: CopyButton
    CopyButton ← used by: CodeBlock, Templates page
    Callout ← standalone
    FileTree ← standalone
    KeyCombo ← standalone
    ComparisonTable ← standalone
    StepList ← standalone
    TerminalBlock ← standalone

Interactive Components (depend on: UI, Zustand store)
    Quiz ← uses: cn(), useProgressStore (saveQuizScore)
    FillInBlank ← uses: cn()
    TerminalSimulator ← uses: cn()
    PromptPlayground ← uses: cn()

Progress Components (depend on: UI, Zustand store)
    ProgressDashboard ← uses: ProgressBar, AchievementBadge, useProgressStore
    AchievementBadge ← standalone
    StreakCounter ← uses: useProgressStore

Search Components (depend on: Next.js router)
    SearchDialog ← uses: cn(), useRouter
```

### 4.3 Server vs Client Components

| Component Type | Rendering | Indicator | Examples |
|---------------|-----------|-----------|---------|
| **Server Component** | Rendered at build time to static HTML | No `"use client"` directive | Module page, Lesson page (outer shell) |
| **Client Component** | Hydrated in the browser for interactivity | Has `"use client"` at top of file | Quiz, FillInBlank, TerminalSimulator, SearchDialog, SiteHeader, CurriculumPage, CheatsheetPage, TemplatesPage, PromptLabPage, ProgressPage |

The lesson page (`src/app/curriculum/[moduleSlug]/[lessonSlug]/page.tsx`) is a server component that renders the outer layout and static content. Interactive sub-components (LessonSidebar, MarkCompleteButton) are separate client components imported into the server component.

### 4.4 Props Flow Patterns

**Top-down data flow:**

```
Server Component (Module Page)
    │ props: { moduleSlug }
    │ data: getModule(moduleSlug) → Module object
    │
    ├── ModuleProgressBar (Client)
    │   props: { moduleSlug, lessonSlugs, color }
    │   reads: useProgressStore
    │
    └── Lesson Link Cards (Server-rendered)
        props: { lesson, moduleColor }
```

**Store-connected pattern:**

```
Client Component (Quiz)
    │ props: { questions, quizId }
    │ local state: currentIndex, selectedAnswer, score, finished
    │
    └── on completion: useProgressStore.saveQuizScore(quizId, score)
```

---

## 5. Routing Structure

### 5.1 App Router File-Based Routing

Next.js App Router maps the file system to URL routes:

```
src/app/
├── layout.tsx                    → Root layout (wraps all pages)
├── page.tsx                      → /
├── curriculum/
│   ├── page.tsx                  → /curriculum
│   └── [moduleSlug]/
│       ├── page.tsx              → /curriculum/:moduleSlug
│       ├── module-progress.tsx   → Client component (not a route)
│       └── [lessonSlug]/
│           ├── page.tsx          → /curriculum/:moduleSlug/:lessonSlug
│           ├── lesson-sidebar.tsx → Client component (not a route)
│           └── mark-complete.tsx → Client component (not a route)
├── cheatsheet/
│   └── page.tsx                  → /cheatsheet
├── templates/
│   └── page.tsx                  → /templates
├── prompt-lab/
│   └── page.tsx                  → /prompt-lab
└── progress/
    └── page.tsx                  → /progress
```

### 5.2 Dynamic Routes

| Dynamic Segment | Source | Count |
|----------------|--------|-------|
| `[moduleSlug]` | `getModules().map(m => m.slug)` | 13 values |
| `[lessonSlug]` | `module.lessons.map(l => l.slug)` for each module | ~70 values total |

### 5.3 generateStaticParams

Both dynamic route pages implement `generateStaticParams()` to pre-render all possible paths:

**Module page:**

```typescript
export async function generateStaticParams() {
  const modules = getModules();
  return modules.map((m) => ({ moduleSlug: m.slug }));
}
// Generates: /curriculum/claude-fundamentals, /curriculum/prompt-engineering, ...
```

**Lesson page:**

```typescript
export async function generateStaticParams() {
  const modules = getModules();
  const allParams = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      allParams.push({ moduleSlug: mod.slug, lessonSlug: lesson.slug });
    }
  }
  return allParams;
}
// Generates: /curriculum/claude-fundamentals/what-is-claude, ...
```

### 5.4 Route Summary Table

| Route | Method | Component | Data Source | Client/Server |
|-------|--------|-----------|-------------|---------------|
| `/` | GET | `HomePage` | None (static data in component) | Client |
| `/curriculum` | GET | `CurriculumPage` | Static `MODULES` array in component | Client |
| `/curriculum/[moduleSlug]` | GET | `ModulePage` | `getModule(slug)` from filesystem | Server (SSG) |
| `/curriculum/[moduleSlug]/[lessonSlug]` | GET | `LessonPage` | `getModule()` + `getLesson()` from filesystem | Server (SSG) |
| `/cheatsheet` | GET | `CheatsheetPage` | Static `SECTIONS` array in component | Client |
| `/templates` | GET | `TemplatesPage` | Static `TEMPLATES` array in component | Client |
| `/prompt-lab` | GET | `PromptLabPage` | Static `TEMPLATES` + `BEFORE_AFTER` arrays in component | Client |
| `/progress` | GET | `ProgressPage` | `useProgressStore` (localStorage) | Client |

---

## 6. Design System

### 6.1 Color Palette

All colors are defined as CSS custom properties in `src/app/globals.css` and mapped to Tailwind tokens via `@theme inline`.

#### Dark Theme (Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0a0a0d` | Page background, body |
| `--surface` | `#121218` | Cards, sections, elevated surfaces |
| `--surface-2` | `#1a1a22` | Hover states, secondary surfaces, input backgrounds |
| `--surface-3` | `#22222d` | Tertiary surfaces, progress bar tracks |
| `--border` | `#28283a` | Default borders on cards, sections, inputs |
| `--border-accent` | `#3a3a50` | Hover borders, scrollbar thumbs |
| `--foreground` | `#e8e6e3` | Primary text color |
| `--muted` | `#8a8a9a` | Secondary text, descriptions, metadata |
| `--accent` | `#d4a053` | Primary accent -- CTAs, active states, links, branding |
| `--green` | `#5cb870` | Success states, correct answers, Foundation arc |
| `--blue` | `#5e9ed6` | Info states, Practitioner arc |
| `--red` | `#d65e5e` | Error states, incorrect answers, destructive actions |
| `--purple` | `#a07ed6` | Quiz badges, Power User arc |
| `--cyan` | `#5ec4c4` | Supplementary accent |
| `--orange` | `#d6885e` | Streak counter, warm accents |
| `--pink` | `#d65ea0` | Supplementary accent |

#### Light Theme

| Token | Hex | Notes |
|-------|-----|-------|
| `--background` | `#fafaf9` | Light warm background |
| `--surface` | `#ffffff` | Pure white surfaces |
| `--surface-2` | `#f5f5f4` | Light gray surfaces |
| `--surface-3` | `#e7e5e4` | Darker light gray |
| `--border` | `#d6d3d1` | Light gray borders |
| `--border-accent` | `#a8a29e` | Darker borders for hover |
| `--foreground` | `#1c1917` | Near-black text |
| `--muted` | `#78716c` | Gray muted text |
| `--accent` | `#b8860b` | Darker gold for light backgrounds |

#### Arc Colors

| Arc | Color | Hex | CSS Variable |
|-----|-------|-----|-------------|
| Foundation | Green | `#5cb870` | `--green` |
| Practitioner | Blue | `#5e9ed6` | `--blue` |
| Power User | Purple | `#a07ed6` | `--purple` |
| Expert | Gold | `#d4a053` | `--accent` |

### 6.2 Typography

| Font | Variable | Usage | Weight |
|------|----------|-------|--------|
| **DM Sans** | `--font-dm-sans` | Body text, UI elements, paragraphs, buttons | 400, 500, 600, 700 |
| **JetBrains Mono** | `--font-jetbrains-mono` | Code blocks, terminal output, inline code, monospace content | 400, 500, 700 |
| **Instrument Serif** | `--font-instrument-serif` | Large headings, hero text, decorative page titles | 400 (normal + italic) |

**Tailwind mapping:**

```css
--font-sans: var(--font-dm-sans);     /* font-sans */
--font-mono: var(--font-jetbrains-mono); /* font-mono */
--font-serif: var(--font-instrument-serif); /* font-serif */
```

**Typography scale (prose content):**

| Element | Size | Weight | Margins |
|---------|------|--------|---------|
| h1 | 2rem (32px) | 600 | top: 0, bottom: 1rem |
| h2 | 1.5rem (24px) | 600 | top: 2.5rem, bottom: 0.75rem (border-bottom) |
| h3 | 1.25rem (20px) | 600 | top: 2rem, bottom: 0.5rem |
| p | 1rem (16px) | 400 | top: 0, bottom: 1rem (line-height: 1.75) |
| code (inline) | 0.875em | 400 | Padding: 0.15em 0.35em |
| code (block) | 0.875rem (14px) | 400 | Padding: 1rem (line-height: 1.7) |

### 6.3 Spacing and Layout Patterns

**Page container:**

```
max-w-7xl (1280px max width)
px-4 sm:px-6 lg:px-8 (responsive horizontal padding)
py-8 sm:py-12 (vertical padding)
```

**Card pattern:**

```
rounded-xl (12px border radius)
border border-border
bg-surface
p-5 or p-6
hover:border-border-accent hover:bg-surface-2
transition-all duration-200
```

**Section spacing:**

```
py-20 sm:py-28 (major sections on landing page)
py-16 (sub-sections)
mb-6 to mb-12 (between section header and content)
space-y-6 to space-y-8 (between repeated elements)
```

### 6.4 Component Design Tokens

**Button variants (via CVA in `src/components/ui/button.tsx`):**

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| default | `bg-accent` | `text-background` | none |
| outline | `bg-transparent` | `text-foreground` | `border-border` |
| ghost | `bg-transparent` | `text-muted` | none |
| destructive | `bg-red` | `text-white` | none |

**Badge variants (via CVA in `src/components/ui/badge.tsx`):**

| Variant | Background | Text |
|---------|-----------|------|
| default | `bg-surface-2` | `text-muted` |
| accent | `bg-accent/15` | `text-accent` |
| green | `bg-green/15` | `text-green` |
| blue | `bg-blue/15` | `text-blue` |
| purple | `bg-purple/15` | `text-purple` |
| red | `bg-red/15` | `text-red` |
| orange | `bg-orange/15` | `text-orange` |

### 6.5 Focus and Interaction Styles

```css
/* Global focus style */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Link/button transitions */
a, button {
  transition: color 0.15s ease, background-color 0.15s ease,
    border-color 0.15s ease, opacity 0.15s ease;
}

/* Text selection */
::selection {
  background-color: var(--accent);
  color: var(--background);
}
```

### 6.6 Responsive Breakpoints

| Breakpoint | Width | Tailwind Prefix | Layout Changes |
|-----------|-------|-----------------|---------------|
| Default | < 640px | (none) | Single column, hamburger menu, no sidebars |
| sm | >= 640px | `sm:` | Two-column grids, larger text on hero |
| md | >= 768px | `md:` | Desktop navigation visible, hamburger hidden |
| lg | >= 1024px | `lg:` | Lesson left sidebar visible, 3-4 column grids |
| xl | >= 1280px | `xl:` | Lesson right sidebar (TOC) visible |
| 2xl | >= 1536px | `2xl:` | Maximum content width container |

---

## 7. DevSecOps Pipeline Architecture

### 7.1 Pipeline Overview

The project uses 4 GitHub Actions workflows that together form a complete DevSecOps CI/CD pipeline. The pipeline enforces code quality, security scanning, and automated deployment on every push to `main`.

```
Push to main / PR opened
        │
        ├── ci.yml (parallel jobs)
        │   ├── Lint (ESLint)
        │   ├── Type Check (tsc --noEmit)
        │   ├── Unit Tests + Coverage (Vitest)
        │   │       └── Upload coverage artifact
        │   ├── E2E Tests (Playwright) ← depends on lint + typecheck + test
        │   │       └── Upload playwright-report + screenshots on failure
        │   └── Build (next build) ← depends on all above
        │           └── Upload build output artifact
        │
        ├── security.yml (parallel jobs)
        │   ├── Dependency Audit (npm audit + audit-ci)
        │   ├── CodeQL Analysis (JavaScript/TypeScript)
        │   └── Secret Detection (TruffleHog)
        │
        ├── deploy.yml (sequential)
        │   ├── CI Gate (lint + typecheck + test)
        │   ├── Netlify Production deploy ← depends on CI Gate (primary)
        │   ├── GitHub Pages deploy ← depends on CI Gate
        │   └── Vercel Production deploy ← depends on CI Gate (backup)
        │
        └── pr-preview.yml
            └── Netlify Preview Deploy + PR comment with URL
```

### 7.2 Workflow Files

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **CI** | `.github/workflows/ci.yml` | Push to `main`/`develop`, PRs to `main` | Lint, typecheck, unit tests, coverage, E2E tests, build |
| **Security** | `.github/workflows/security.yml` | Push to `main`, PRs to `main`, weekly cron (Monday 8am UTC) | Dependency audit, CodeQL static analysis, secret scanning |
| **Deploy** | `.github/workflows/deploy.yml` | Push to `main`, manual dispatch | CI gate then triple deploy to Netlify (primary) + GitHub Pages + Vercel (backup) |
| **PR Preview** | `.github/workflows/pr-preview.yml` | PRs to `main` | Netlify preview deploy, auto-comments PR with preview URL |

### 7.3 CI Job Dependency Graph

```
ci.yml:
  lint ──────────┐
  typecheck ─────┼──► e2e ──► build
  test (unit) ───┘

deploy.yml:
  ci-gate ──┬──► deploy-netlify (primary)
            ├──► deploy-github-pages
            └──► deploy-vercel (backup)

security.yml:
  dependency-audit ─── (parallel)
  codeql ──────────── (parallel)
  secrets-scan ────── (parallel)
```

### 7.4 Artifacts

| Artifact | Workflow | Retention | Contents |
|----------|----------|-----------|----------|
| `coverage-report` | ci.yml | 30 days | Vitest coverage output (`coverage/`) |
| `playwright-report` | ci.yml | 30 days | Playwright HTML report |
| `e2e-screenshots` | ci.yml (on failure) | 7 days | Failure screenshots from `test-results/` |
| `build-output` | ci.yml | 7 days | Static site output (`out/`) |

---

## 8. E2E Test Architecture

### 8.1 Page Object Model (POM) Pattern

E2E tests use the Page Object Model pattern to decouple test logic from page structure. Each page in the application has a corresponding page object class in `e2e/pages/`.

```
e2e/
├── pages/
│   ├── index.ts               ← Barrel export (re-exports all page objects)
│   ├── base.page.ts           ← BasePage: shared header, footer, logo, nav helpers
│   ├── landing.page.ts        ← LandingPage extends BasePage
│   ├── curriculum.page.ts     ← CurriculumPage extends BasePage
│   ├── module.page.ts         ← ModulePage extends BasePage
│   ├── lesson.page.ts         ← LessonPage extends BasePage
│   ├── prompt-lab.page.ts     ← PromptLabPage extends BasePage
│   ├── cheatsheet.page.ts     ← CheatsheetPage extends BasePage
│   ├── templates.page.ts      ← TemplatesPage extends BasePage
│   └── progress.page.ts       ← ProgressPage extends BasePage
├── navigation.spec.ts          ← 12 tests: site navigation flows
├── progress.spec.ts            ← 6 tests: progress tracking flows
├── prompt-lab.spec.ts          ← 5 tests: prompt lab features
├── cheatsheet.spec.ts          ← 4 tests: cheatsheet search and tabs
├── templates.spec.ts           ← 4 tests: template library
└── responsive.spec.ts          ← 5 tests: responsive layout at various viewports
```

### 8.2 POM Class Hierarchy

```
BasePage (base.page.ts)
├── Locators: header, footer, logo
├── Methods: navigateTo(), goToCurriculum(), goToPromptLab(), goToCheatsheet(), goToTemplates()
│
├── LandingPage extends BasePage
│   Locators: heroHeading, startLearningBtn, arcCards, statsBar, footerCredit, mobileMenuBtn
│   Methods: clickStartLearning(), isHeroVisible(), getStatsText()
│
├── CurriculumPage extends BasePage
│   Locators: moduleCard(slug), arcSection(arc)
│   Methods: clickModule(slug)
│
├── ModulePage extends BasePage
│   Locators: moduleTitle, lessonItem(slug)
│   Methods: clickLesson(slug)
│
├── LessonPage extends BasePage
│   Locators: lessonTitle, markCompleteBtn, completedIndicator
│   Methods: markAsComplete()
│
├── PromptLabPage extends BasePage
│   Locators: heading, templateCards
│   Methods: filterByCategory(cat)
│
├── CheatsheetPage extends BasePage
│   Locators: searchInput, categoryTab(tab)
│   Methods: search(query), selectTab(tab)
│
├── TemplatesPage extends BasePage
│   Locators: templateCards, codeBlocks
│
└── ProgressPage extends BasePage
    Locators: heading, statLessons, statQuizzes, statStreak, statAchievements, confirmResetBtn
    Methods: clickReset()
```

### 8.3 Locator Strategy

All page object locators use `page.getByTestId()` to select elements by their `data-testid` attribute. This provides:

- **Stability**: Selectors do not break when CSS classes, text content, or DOM hierarchy change
- **Decoupling**: Tests are independent of visual design and layout changes
- **Clarity**: Test IDs are self-documenting (e.g., `data-testid="hero-heading"`)

### 8.4 Test Execution

Tests run on two browser projects via Playwright:

| Project | Device | Viewport | Purpose |
|---------|--------|----------|---------|
| `chromium` | Desktop Chrome | 1280x720 | Desktop layout testing |
| `mobile` | Pixel 7 | 412x915 | Mobile layout testing |

Configuration is in `playwright.config.ts`. Tests run against a local dev server (`npm run dev`) with auto-start. In CI, retries are set to 2 and workers to 1 for deterministic results.

---

## 9. Barrel Export Structure

### 9.1 Overview

The project uses barrel exports (re-export files named `index.ts`) to provide clean import paths. Instead of importing from deep file paths, consumers import from the barrel.

### 9.2 Barrel Files

| Barrel | Location | Exports |
|--------|----------|---------|
| **Layout components** | `src/components/layout/index.ts` | SiteHeader, SiteFooter, SidebarNav, Breadcrumb, ThemeToggle |
| **E2E Page Objects** | `e2e/pages/index.ts` | BasePage, LandingPage, CurriculumPage, ModulePage, LessonPage, PromptLabPage, CheatsheetPage, TemplatesPage, ProgressPage |

### 9.3 Import Pattern

```typescript
// Without barrel exports (verbose):
import { LandingPage } from './pages/landing.page';
import { CurriculumPage } from './pages/curriculum.page';
import { ModulePage } from './pages/module.page';

// With barrel exports (clean):
import { LandingPage, CurriculumPage, ModulePage } from './pages';
```

This pattern is used consistently in all 6 E2E spec files and in layout component imports.

---

## 10. Deployment Architecture

### 10.1 Triple Deployment Strategy

The project deploys to three platforms for redundancy and different audiences:

```
git push main
    │
    ▼
deploy.yml workflow
    │
    ├──► Netlify (primary)
    │    URL: https://klaude-academy.netlify.app
    │    Method: netlify deploy --prod
    │    Mode: SSR with full auth support
    │
    ├──► GitHub Pages
    │    URL: https://khader9jber.github.io/claude-academy/
    │    Method: actions/upload-pages-artifact + actions/deploy-pages
    │    Environment variable: DEPLOY_TARGET=github-pages
    │
    └──► Vercel (backup)
         URL: https://claude-academy-course.vercel.app
         Note: Has deployment protection issues on free plan
```

### 10.2 Deployment Details

| Platform | URL | Mode | Method | CI Gate |
|----------|-----|------|--------|---------|
| **Netlify (primary)** | `https://klaude-academy.netlify.app` | SSR (serverless) | `netlify deploy --prod` | lint + typecheck + test must pass |
| **GitHub Pages** | `https://khader9jber.github.io/claude-academy/` | Static export | `actions/deploy-pages@v4` | lint + typecheck + test must pass |
| **Vercel (backup)** | `https://claude-academy-course.vercel.app` | SSR (serverless) | `vercel deploy --prod` | Has deployment protection issues on free plan |
| **Netlify Preview** (PRs) | Dynamic URL per PR | SSR | `netlify deploy` (non-prod) | Build must succeed |

**SSR vs Static**: Netlify runs the site as an SSR app, which supports auth callbacks (`/auth/callback`) and server-side session management. GitHub Pages uses static export (`output: 'export'`), which does not support auth features -- the site runs in guest-only mode on GitHub Pages. Vercel is available as a backup but has deployment protection issues on the free plan.

### 10.3 Netlify Configuration

- **Site name**: `klaude-academy`
- **URL**: `https://klaude-academy.netlify.app`
- **Secrets required**: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

### 10.4 Vercel Configuration (Backup)

- **Team/Org**: `claude-academy-org`
- **URL**: `https://claude-academy-course.vercel.app`
- **Secrets required**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- **Note**: Has deployment protection issues on free plan -- use Netlify as primary

### 10.5 PR Preview Flow

```
PR opened/updated
    │
    ▼
pr-preview.yml
    │
    ├── Build (npm run build)
    ├── Deploy to Netlify (non-prod)
    └── Comment on PR with preview URL
```

---

## 11. data-testid Convention

### 11.1 Purpose

All key interactive and structural elements in the application have `data-testid` attributes. These attributes serve as stable selectors for Playwright E2E tests via the Page Object Model.

### 11.2 Naming Convention

Test IDs follow a kebab-case pattern that describes the element's role:

```
data-testid="<component>-<element>"
```

### 11.3 Complete data-testid Map

| data-testid | File | Element |
|-------------|------|---------|
| `site-header` | `src/components/layout/site-header.tsx` | `<header>` wrapper |
| `site-footer` | `src/components/layout/site-footer.tsx` | `<footer>` wrapper |
| `site-logo` | `src/components/layout/site-header.tsx` | Logo link in header |
| `nav-curriculum` | `src/components/layout/site-header.tsx` | Curriculum nav link |
| `nav-prompt-lab` | `src/components/layout/site-header.tsx` | Prompt Lab nav link |
| `nav-cheatsheet` | `src/components/layout/site-header.tsx` | Cheatsheet nav link |
| `nav-templates` | `src/components/layout/site-header.tsx` | Templates nav link |
| `mobile-menu-btn` | `src/components/layout/site-header.tsx` | Mobile hamburger button |
| `footer-credit` | `src/components/layout/site-footer.tsx` | "Built with heart by KK" text |
| `hero-heading` | `src/app/page.tsx` | Hero section heading |
| `start-learning-btn` | `src/app/page.tsx` | Start Learning CTA button |
| `arc-cards` | `src/app/page.tsx` | Arc cards section |
| `stats-bar` | `src/app/page.tsx` | Stats bar section |
| `module-card-{slug}` | `src/app/curriculum/page.tsx` | Individual module card |
| `arc-section-{arc}` | `src/app/curriculum/page.tsx` | Arc section wrapper |
| `module-title` | `src/app/curriculum/[moduleSlug]/page.tsx` | Module page title |
| `lesson-item-{slug}` | `src/app/curriculum/[moduleSlug]/page.tsx` | Lesson list item |
| `lesson-title` | `src/app/curriculum/[moduleSlug]/[lessonSlug]/page.tsx` | Lesson page title |
| `mark-complete-btn` | `src/app/curriculum/[moduleSlug]/[lessonSlug]/mark-complete.tsx` | Mark as Complete button |
| `completed-indicator` | `src/app/curriculum/[moduleSlug]/[lessonSlug]/mark-complete.tsx` | Completed state indicator |
| `progress-heading` | `src/app/progress/page.tsx` | Progress page heading |
| `stat-lessons` | `src/components/progress/progress-dashboard.tsx` | Lessons completed stat |
| `stat-quizzes` | `src/components/progress/progress-dashboard.tsx` | Quizzes taken stat |
| `stat-streak` | `src/components/progress/progress-dashboard.tsx` | Current streak stat |
| `stat-achievements` | `src/components/progress/progress-dashboard.tsx` | Achievements unlocked stat |
| `reset-progress-btn` | `src/app/progress/page.tsx` | Reset progress button |
| `confirm-reset-btn` | `src/app/progress/page.tsx` | Confirm reset button |
| `prompt-lab-heading` | `src/app/prompt-lab/page.tsx` | Prompt Lab page heading |
| `template-card` | `src/app/prompt-lab/page.tsx` | Prompt template cards |
| `category-filter-{cat}` | `src/app/prompt-lab/page.tsx` | Category filter buttons |
| `cheatsheet-search` | `src/app/cheatsheet/page.tsx` | Search input on cheatsheet |
| `category-tab-{tab}` | `src/app/cheatsheet/page.tsx` | Category tab buttons |
| `template-card` | `src/app/templates/page.tsx` | Template library cards |

### 11.4 Guidelines for Adding New data-testid Attributes

1. Use kebab-case: `data-testid="my-component-element"`
2. Use dynamic suffixes for collections: `data-testid={`module-card-${slug}`}`
3. Only add `data-testid` to elements that E2E tests need to interact with or assert on
4. Corresponding page object locators should use `page.getByTestId('...')`
5. Do not use `data-testid` for styling or non-test purposes

---

## 12. Authentication Architecture

### 12.1 Overview

Authentication is powered by Supabase Auth and is entirely optional. The site functions fully without it. When Supabase env vars are configured, auth features become available.

### 12.2 Auth Flow

```
User visits site
    │
    ├── Not logged in → Anonymous mode
    │   └── Progress stored in localStorage only
    │   └── No leaderboard, no certificates
    │
    └── Logged in → Authenticated mode
        │
        ├── Supabase Auth session managed via proxy.ts (cookie-based)
        ├── Progress dual-written to localStorage + Supabase
        ├── Cross-device access enabled
        ├── Leaderboard ranking active
        └── Arc certificates available
```

### 12.3 Supported Auth Providers

| Provider | Type | Notes |
|----------|------|-------|
| Email/Password | Native | Built-in Supabase Auth, email confirmation optional |
| Google | OAuth | Requires Google OAuth client ID/secret in Supabase dashboard |
| GitHub | OAuth | Requires GitHub OAuth app client ID/secret in Supabase dashboard |

### 12.4 Session Management

Sessions are managed via `@supabase/ssr` using cookie-based storage. The auth callback route (`src/app/auth/callback/`) handles the OAuth redirect flow. The `proxy.ts` helper manages Supabase client creation with proper cookie handling for both server and client components.

### 12.5 Auth UI

- **Site header**: shows "Sign In" button when logged out, user menu (profile, sign out) when logged in
- **Login page** (`src/app/auth/login/`): email/password form + OAuth buttons, `data-testid` attributes for E2E testing
- **Signup page** (`src/app/auth/signup/`): registration form + OAuth buttons
- **Auth context**: `useAuth()` hook provides session, user, loading state, and sign-out function across the app

### 12.6 Auth Gating

Content is never gated behind auth. All lessons, quizzes, cheatsheet, templates, and prompt lab work without login. Auth only unlocks:
- Progress sync to Supabase
- Leaderboard participation
- Arc completion certificates
- User profile with display name

---

## 13. Database Architecture

### 13.1 Overview

The database uses Supabase PostgreSQL with 7 tables. All tables are protected by Row Level Security (RLS). The schema is defined in `supabase/migrations/001_initial.sql`.

### 13.2 Tables

| Table | Purpose | RLS Policy |
|-------|---------|-----------|
| `profiles` | User display names and avatars | Users can read/update own profile. Public read for leaderboard. |
| `user_progress` | Serialized ProgressState JSON per user | Users can read/write own progress only |
| `completed_lessons` | Individual lesson completion records with timestamps | Users can read/write own records only |
| `quiz_scores` | Quiz attempts with score, total, bestScore | Users can read/write own scores only |
| `certificates` | Arc completion certificates with unique certificate IDs | Users can read own certificates. Public read for verification. |
| `leaderboard` | Materialized view of top users by lessons completed | Public read |
| `user_settings` | User preferences (theme, notification settings) | Users can read/write own settings only |

### 13.3 Auto-Profile Trigger

A PostgreSQL trigger automatically creates a `profiles` row when a new user signs up via Supabase Auth:

```sql
-- Trigger on auth.users insert → create profiles row
-- Sets default display_name from email prefix
```

### 13.4 Leaderboard View

The leaderboard is a database view that joins `profiles` with `completed_lessons` to rank users by total lessons completed. It is publicly readable (no auth required to view the leaderboard page).

### 13.5 RLS Policies

All tables enforce Row Level Security. The general pattern:
- **SELECT**: `auth.uid() = user_id` (users see only their own data)
- **INSERT**: `auth.uid() = user_id` (users can only insert their own data)
- **UPDATE**: `auth.uid() = user_id` (users can only update their own data)
- **DELETE**: `auth.uid() = user_id` (users can only delete their own data)

Exceptions: `leaderboard` view and certificate verification are publicly readable.

---

## 14. Progress Sync Architecture

### 14.1 Dual-Write Pattern

Progress is stored using a dual-write strategy:

```
User Action (e.g., markLessonComplete)
    │
    ▼
Zustand set() ──────────► UI updates immediately
    │
    ├── Guest user:
    │   └── Write to localStorage only
    │
    └── Logged-in user:
        ├── Write to localStorage (instant, offline-capable)
        └── Write to Supabase (async, non-blocking)
            ├── Success: done
            └── Failure: localStorage has the data, retry on next action
```

### 14.2 Why Dual-Write?

- **Instant feedback**: localStorage writes are synchronous, so the UI updates immediately
- **Offline resilience**: if the network is down, progress is preserved locally
- **Graceful degradation**: if Supabase is unreachable, the site still works
- **Migration path**: guest users who later sign up can have their localStorage progress merged

### 14.3 useProgressSync Hook

The `useProgressSync` hook handles the dual-write logic:
1. Subscribes to Zustand store changes
2. On each change, writes to localStorage (via Zustand persist middleware)
3. If user is authenticated, also writes to Supabase `user_progress` table
4. On page load for authenticated users, fetches from Supabase and merges with local state

### 14.4 Deployment Modes

| Platform | Mode | Auth | Progress Storage |
|----------|------|------|-----------------|
| Netlify (primary) | SSR | Full (email, Google, GitHub) | localStorage + Supabase |
| GitHub Pages | Static export | None (auth features hidden) | localStorage only |
| Vercel (backup) | SSR | Full (email, Google, GitHub) | localStorage + Supabase |

The `next.config.ts` conditionally applies `output: 'export'` when `DEPLOY_TARGET=github-pages`. On Netlify (and Vercel), it runs as a standard Next.js SSR app with full auth support.
