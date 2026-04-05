# System Architecture Document

## Claude Academy Learning Platform

**Document Version:** 1.0
**Date:** 2026-04-04
**Status:** Active

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Content Pipeline](#2-content-pipeline)
3. [State Management](#3-state-management)
4. [Component Architecture](#4-component-architecture)
5. [Routing Structure](#5-routing-structure)
6. [Design System](#6-design-system)
7. [Future Architecture (with Backend)](#7-future-architecture-with-backend)

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

## 7. Future Architecture (with Backend)

### 7.1 Supabase Integration Points

When a backend is added, Supabase integrates at the following points:

```
+-------------------------------------------------------------------+
|                     CURRENT (Static)                              |
|                                                                   |
|  Browser → Static Files → Zustand → localStorage                  |
+-------------------------------------------------------------------+
                              │
                              ▼ (migration)
+-------------------------------------------------------------------+
|                     FUTURE (With Backend)                         |
|                                                                   |
|  Browser → Next.js (SSR) → Supabase SDK                          |
|                                │                                  |
|                    ┌───────────┼───────────┐                      |
|                    ▼           ▼           ▼                      |
|              Supabase Auth  Supabase DB  Supabase Edge Functions  |
|              (login/signup) (PostgreSQL)  (certificates, etc.)    |
+-------------------------------------------------------------------+
```

### 7.2 Auth Flow

```
User visits site
    │
    ├── Not logged in → Anonymous mode (current behavior, localStorage)
    │
    └── Logged in → Authenticated mode
        │
        ├── Supabase Auth session token in httpOnly cookie
        ├── Progress synced to PostgreSQL
        ├── Cross-device access enabled
        └── Achievements and certificates unlocked
```

### 7.3 Data Sync Architecture

**Optimistic sync strategy:**

1. User actions update the Zustand store immediately (optimistic update).
2. The custom storage adapter asynchronously writes to Supabase.
3. If the write fails, the local state is preserved and retried on next action.
4. On page load, state is fetched from Supabase and merged with any pending local changes.

```
User Action
    │
    ▼
Zustand set() ──────────► UI updates immediately
    │
    ▼
Custom Storage Adapter
    │
    ├── Write to Supabase (async, non-blocking)
    │   └── Success: done
    │   └── Failure: queue for retry
    │
    └── Also write to localStorage (fallback)
```

### 7.4 Database Schema (Planned)

```sql
-- Users (managed by Supabase Auth)
-- auth.users table is built-in

-- User progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state JSONB NOT NULL,  -- Serialized ProgressState
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Row-Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### 7.5 API Route Structure (Planned)

If Next.js API routes are used instead of direct Supabase client access:

```
src/app/api/
├── auth/
│   ├── login/route.ts       → POST /api/auth/login
│   ├── signup/route.ts      → POST /api/auth/signup
│   └── logout/route.ts      → POST /api/auth/logout
├── progress/
│   ├── route.ts             → GET, PUT /api/progress
│   └── reset/route.ts       → POST /api/progress/reset
├── certificates/
│   └── [courseId]/route.ts   → GET /api/certificates/:courseId
└── analytics/
    └── route.ts              → POST /api/analytics (event tracking)
```

### 7.6 Migration Impact Summary

| Layer | Changes Required | Effort |
|-------|-----------------|--------|
| Content (MDX files) | None | 0 |
| UI Components | None | 0 |
| Page Components | None (or minimal auth-gating) | Minimal |
| State Management | Replace persist storage adapter | Small (~50 lines) |
| Configuration | Remove `output: 'export'`, add env vars | Small |
| New Code | Auth pages, Supabase setup, storage adapter | Medium (~200-400 lines) |
| Deployment | Switch from static to serverless | Small (Vercel config change) |
| **Total estimated effort** | | **2-3 developer days** |
