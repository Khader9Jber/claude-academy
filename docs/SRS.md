# Software Requirements Specification

## Klaude Academy Learning Platform

**Document Version:** 2.0
**Date:** 2026-04-05
**Status:** Active

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Specific Requirements](#3-specific-requirements)
4. [Data Model](#4-data-model)
5. [System Architecture](#5-system-architecture)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for **Klaude Academy**, an interactive learning website that teaches users how to use Claude and Claude Code from beginner to expert level. This document serves as the authoritative reference for developers, testers, and stakeholders throughout the project lifecycle. It follows the IEEE 830 standard for software requirements specification.

### 1.2 Scope

Klaude Academy is a free, open-source, static-first web application that delivers a structured curriculum of 15 modules organized into 4 skill arcs: Foundation, Practitioner, Power User, and Expert. The platform provides interactive lessons written in MDX, embedded quizzes and exercises, progress tracking with gamification features (streaks, achievements), a searchable cheatsheet for Claude Code commands, a template library for configuration files, and a Prompt Engineering Lab with an interactive 6-layer prompt builder.

The system is built with Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS 4, and Zustand for client-side state management. All data persistence uses the browser's localStorage API. There is no backend, no authentication, and no server-side logic in the current phase.

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|-----------|
| **Claude** | Anthropic's family of large language models (Opus, Sonnet, Haiku) |
| **Claude Code** | Anthropic's official CLI tool for interacting with Claude in a development environment |
| **MCP** | Model Context Protocol -- a standard for extending Claude with external tool integrations |
| **MDX** | Markdown with JSX -- a content format that allows embedding React components in Markdown files |
| **SSG** | Static Site Generation -- pre-rendering pages to HTML at build time |
| **SSR** | Server-Side Rendering -- rendering pages on the server per request |
| **ISR** | Incremental Static Regeneration -- rebuilding individual static pages on demand |
| **CSR** | Client-Side Rendering -- rendering pages in the browser with JavaScript |
| **REPL** | Read-Eval-Print Loop -- an interactive programming environment (Claude Code's interactive mode) |
| **CVA** | Class Variance Authority -- a utility for creating typed component variants |
| **Zustand** | A lightweight state management library for React (2KB gzipped) |
| **Shiki** | A syntax highlighting engine that uses the same grammar files as VS Code |
| **Fuse.js** | A lightweight client-side fuzzy search library |
| **gray-matter** | A library for parsing YAML frontmatter from Markdown/MDX files |
| **App Router** | Next.js routing system based on the file system under `src/app/` |
| **Arc** | A grouping of related modules representing a skill level (Foundation, Practitioner, Power User, Expert) |
| **Frontmatter** | YAML metadata at the top of an MDX file (title, slug, difficulty, etc.) |
| **Hydration** | The process of attaching JavaScript event handlers to server-rendered HTML |

### 1.4 References

| Reference | URL |
|-----------|-----|
| Next.js Documentation | https://nextjs.org/docs |
| Tailwind CSS 4 Documentation | https://tailwindcss.com/docs |
| Anthropic Claude Documentation | https://docs.anthropic.com |
| Claude Code Documentation | https://docs.anthropic.com/en/docs/claude-code |
| MDX Documentation | https://mdxjs.com |
| Zustand Documentation | https://docs.pmnd.rs/zustand |
| React 19 Documentation | https://react.dev |
| IEEE 830-1998 Standard | IEEE Recommended Practice for Software Requirements Specifications |

---

## 2. Overall Description

### 2.1 Product Perspective

Klaude Academy is a standalone web application that operates entirely in the user's browser. It is not a component of a larger system. The site is generated at build time as a collection of static HTML, CSS, and JavaScript files that can be deployed to any static hosting provider (Vercel, Netlify, Cloudflare Pages, or any web server).

The application has no external dependencies at runtime. It does not make network requests after the initial page load (beyond fetching its own static assets). All interactive features -- quizzes, progress tracking, search -- run entirely client-side.

A future phase may introduce a backend (Supabase) for user accounts, cross-device progress sync, and certificates, but the current system is designed to be fully functional without one.

### 2.2 Product Functions

The system provides the following major function groups:

1. **Curriculum Delivery** -- Structured display of 15 modules across 4 arcs, with individual lesson pages rendering MDX content that includes prose, code blocks, callouts, file trees, comparison tables, and step lists.

2. **Interactive Learning** -- Multiple-choice and true/false quiz components with scoring and feedback, fill-in-the-blank exercises with multi-answer validation, a terminal simulator for practicing Claude Code commands, code exercise blocks with starter code and validation, and a prompt playground with a 6-layer prompt builder.

3. **Progress Tracking** -- Lesson completion tracking with persistent state, quiz score recording with best-score retention, daily learning streak calculation, achievement badges with milestone-based unlocking, and a progress dashboard with overall statistics.

4. **Cheatsheet** -- A searchable, tab-filtered reference of all Claude Code commands, CLI flags, slash commands, keyboard shortcuts, configuration files, hook events, MCP transports, effort levels, environment variables, permission patterns, and in-session syntax. Contains 12 categories and 90+ items.

5. **Template Library** -- Copy-paste templates for CLAUDE.md files (Node.js, React, Python, Full-Stack, Mobile), settings.json configurations (permissive, locked-down, CI/CD), hook configurations (auto-format, notification, Slack), agent definitions (security reviewer, test writer, documentation generator), and custom slash commands (fix-issue, deploy, PR review).

6. **Prompt Engineering Lab** -- An interactive 6-layer prompt builder (Role, Context, Task, Constraints, Format, Examples) with live preview and copy-to-clipboard, a template library of 20+ prompt templates across 5 categories (Coding, Writing, Analysis, Debugging, Claude Code), and a before/after gallery with 9 transformation examples showing vague prompts improved to specific ones.

7. **Search** -- Global search accessible via Cmd+K / Ctrl+K keyboard shortcut, with real-time filtering across lessons, quizzes, and exercises, keyboard navigation of results, and direct navigation to selected items.

8. **Theme** -- Dark mode (default) and light mode toggle, persisted across sessions via next-themes.

### 2.3 User Classes

| User Class | Description | Needs |
|-----------|-------------|-------|
| **Beginner** | No experience with Claude or AI assistants. May not have a technical background. | Clear explanations of fundamental concepts, step-by-step guidance, simple exercises with hints. |
| **Intermediate** | Has used ChatGPT or similar tools casually. Understands basic prompting. May be a developer. | Deeper techniques (prompt engineering, structured output), practical workflows, command reference. |
| **Advanced** | Developer who wants to master Claude Code specifically. Comfortable with CLI tools and Git. | Configuration mastery, MCP integrations, hooks, agents, multi-step workflows, production deployment patterns. |

All user classes share the same interface. Content difficulty is indicated by badges (beginner, intermediate, advanced, expert) and organized by arc to guide users through an appropriate learning path.

### 2.4 Operating Environment

- **Browsers:** Google Chrome 90+, Mozilla Firefox 90+, Apple Safari 15+, Microsoft Edge 90+
- **Devices:** Desktop computers, laptops, tablets, and mobile phones
- **Viewports:** Responsive layout from 320px to 2560px width
- **JavaScript:** Required for interactive features (quizzes, progress, search). Core lesson content is readable without JavaScript.
- **Network:** Initial page load requires network access. After loading, all features work offline (service worker not currently implemented but static assets are cached by the browser).

### 2.5 Constraints

| Constraint | Description |
|-----------|-------------|
| **No Backend** | The current architecture uses `output: 'export'` in next.config.ts, producing a fully static site. There are no server-side endpoints, no database, and no authentication system. |
| **localStorage** | All user state (progress, quiz scores, streaks, achievements) is stored in the browser's localStorage under the key `klaude-academy-progress`. Data is device-specific and cannot sync across browsers or devices. |
| **Client-Side Only** | All computation (search indexing, quiz scoring, progress calculation, streak tracking) happens in the browser. |
| **Content at Build Time** | MDX lesson content is parsed and rendered at build time via `generateStaticParams`. Adding or modifying content requires a new build. |
| **No External API Calls** | The application makes no runtime network requests to external APIs. There is no integration with the Anthropic API or any other service. |
| **Static Images** | Next.js Image Optimization is disabled (`images: { unoptimized: true }`) because the static export does not support the image optimization server. |

### 2.6 Assumptions and Dependencies

- Users have a modern web browser with JavaScript enabled.
- Users have sufficient localStorage space (the progress data is under 50KB for a complete learning journey).
- The hosting provider serves static files with appropriate cache headers.
- Build-time content processing (MDX parsing, frontmatter extraction) completes without errors for all content files.
- The `gray-matter` library correctly parses all YAML frontmatter variants used in lesson files.
- The `next-mdx-remote` library correctly compiles all MDX content with the configured remark/rehype plugins.

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### FR-01 to FR-10: Curriculum and Navigation

| ID | Requirement | Priority |
|----|------------|----------|
| **FR-01** | The system shall display 15 modules organized into 4 arcs: Foundation (Modules 1-4), Practitioner (Modules 5-8, 14), Power User (Modules 9-11, 15), and Expert (Modules 12-13). | P1 |
| **FR-02** | The system shall display lessons within each module, sorted by their `order` field from the lesson frontmatter. Each lesson card shows the lesson title, duration, and difficulty badge. | P1 |
| **FR-03** | The system shall render MDX content with embedded interactive components (Quiz, FillInBlank, TerminalSimulator, CodeBlock, Callout, FileTree, KeyCombo, ComparisonTable, StepList). Content is parsed at build time using `gray-matter` for frontmatter and rendered with `next-mdx-remote`. | P1 |
| **FR-04** | The system shall provide previous/next navigation between lessons within a module. The first lesson shows a "Back to Module" link instead of "Previous"; the last lesson shows a "Module Complete" link instead of "Next". Navigation links display the target lesson title. | P1 |
| **FR-05** | The system shall display breadcrumb navigation on all subpages. Lesson pages show: Home > Curriculum > Module Title > Lesson Title. Module pages show: Home > Curriculum > Module Title. The last breadcrumb item is plain text (not a link). | P1 |
| **FR-06** | The system shall display a module overview page for each module, including: module icon with arc-colored background, module title and description, arc label and module number, lesson count, estimated hours, difficulty badge, prerequisites as linked chips, learning objectives aggregated from lessons (up to 8), and a list of all lessons with order number, title, duration, and difficulty. | P1 |
| **FR-07** | The system shall display a lesson sidebar on the left side of lesson pages (visible on screens >= 1024px / `lg` breakpoint) listing all lessons in the current module. The current lesson is visually highlighted. | P1 |
| **FR-08** | The system shall generate a table of contents from h2 and h3 headings in the lesson content. The TOC is displayed in a right sidebar on screens >= 1280px (`xl` breakpoint). Each heading links to its anchor within the page. h3 headings are indented relative to h2 headings. | P2 |
| **FR-09** | The system shall support responsive layout across mobile (320px-767px), tablet (768px-1023px), and desktop (1024px+) viewports. The site header collapses navigation links into a hamburger menu on screens below 768px (`md` breakpoint). Lesson sidebars are hidden on smaller screens. | P1 |
| **FR-10** | The system shall provide a curriculum roadmap page (`/curriculum`) displaying all 15 modules grouped by arc, each as a card showing: module icon, order number, title, description, lesson count, estimated hours, difficulty badge, and a progress bar. | P1 |

#### FR-11 to FR-20: Interactive Learning

| ID | Requirement | Priority |
|----|------------|----------|
| **FR-11** | The system shall render multiple-choice quiz questions. Each question displays the question text, lettered answer options (A, B, C, D), and a progress indicator showing "Question X of Y" with a visual progress bar. | P1 |
| **FR-12** | The system shall provide immediate visual feedback when a quiz answer is selected. Correct answers are highlighted with a green border and green background with a checkmark icon. Incorrect answers are highlighted with a red border and red background with an X icon. Unselected incorrect options are dimmed to 50% opacity. | P1 |
| **FR-13** | The system shall display an explanation panel after each quiz question is answered. The explanation appears in a bordered box below the answer options and includes the text "Explanation:" in bold followed by the explanation content from the question data. | P1 |
| **FR-14** | The system shall calculate and display quiz scores. After the final question, a score summary screen shows: a circular percentage indicator (green if >= 70%, red otherwise), "Quiz Complete" heading, "You got X out of Y questions correct" text, and a contextual message (>= 90%: "Excellent work!", >= 70%: "Good job! Keep learning.", < 70%: "Review the material and try again."). | P1 |
| **FR-15** | The system shall provide a "Retry Quiz" button on the score summary screen. Clicking it resets the quiz to the first question with score at 0 and all answers cleared. | P1 |
| **FR-16** | The system shall render fill-in-the-blank exercises. The template text contains `{{N}}` placeholder tokens that are replaced with inline text input fields. Each input field is 128px wide with monospace font and centered text. | P2 |
| **FR-17** | The system shall validate fill-in-the-blank answers case-insensitively. Each blank can accept multiple valid answers (defined as an array in the blank definition). Correct answers show a green border with green checkmark icon. Incorrect answers show a red border with red X icon. A "Show Answers" button reveals the first correct answer for each blank. | P2 |
| **FR-18** | The system shall provide a terminal simulator component for practicing Claude Code commands. The simulator displays: a title bar with terminal icon and step counter, a scrollable terminal body (256px height) with monospace font, a command prompt (`$` in green), and an input field that accepts text commands. Correct commands produce simulated output and advance to the next step. Incorrect commands show an error message. After 2 wrong attempts on the same step, a hint is displayed in accent color. The simulator shows "All steps completed! Great work." after all steps are finished. | P2 |
| **FR-19** | The system shall render code exercise blocks with starter code. Each exercise includes: title, description, difficulty level, starter code in a code block, hints (revealed on request), and validation rules that check the user's solution against criteria (contains, not-contains, regex, exact match, length constraints). | P3 |
| **FR-20** | The system shall provide a prompt playground with a 6-layer builder. The layers are: Role, Context, Task, Constraints, Format, and Examples. Each layer has a text area with a label, help text, and placeholder. The right panel shows a live preview of the assembled prompt. A copy button copies the assembled prompt to the clipboard. An optional before/after comparison mode shows a "Before" prompt (red badge) and the assembled "After" prompt (green badge). | P1 |

#### FR-21 to FR-30: Progress Tracking

| ID | Requirement | Priority |
|----|------------|----------|
| **FR-21** | The system shall track lesson completion status. A lesson is identified by the composite key `{moduleSlug}/{lessonSlug}`. Once marked complete, a lesson cannot be un-completed (only a full reset clears it). | P1 |
| **FR-22** | The system shall persist all progress data across browser sessions using localStorage. The Zustand store uses the `persist` middleware with the storage key `klaude-academy-progress`. Data is serialized to JSON and deserialized on page load (rehydration). | P1 |
| **FR-23** | The system shall calculate module completion percentage as: `Math.round((completedLessonsInModule / totalLessonsInModule) * 100)`. This percentage is displayed on module cards in the curriculum page and on the module overview page as a colored progress bar. | P1 |
| **FR-24** | The system shall track daily learning streaks. When the user performs an activity (completing a lesson, finishing a quiz, completing an exercise), today's date is added to the `activeDays` array (if not already present). The `currentStreak` is calculated by counting consecutive days backwards from today/yesterday. The `longestStreak` is the maximum of all consecutive day runs in the history. | P2 |
| **FR-25** | The system shall award achievement badges when milestone conditions are met. Achievements are defined in `src/lib/constants.ts` and include: First Steps (1 lesson), Getting Warmed Up (5 lessons), Dedicated Learner (10 lessons), Knowledge Seeker (25 lessons), Completionist (all ~70 lessons), Foundation Built (all Foundation arc), Practitioner Unlocked (all Practitioner arc), Power Unleashed (all Power User arc), Quiz Ace (100% on any quiz), Three Day Streak, Week Warrior (7 days), Monthly Master (30 days). | P2 |
| **FR-26** | The system shall display a progress dashboard at `/progress` showing: overall completion percentage in a circular indicator, progress bar with completed/total lessons, statistics grid (lessons completed, quizzes taken, current streak, achievements unlocked), per-module progress bars, and achievement badges (locked shown in grayscale, unlocked shown in color). | P1 |
| **FR-27** | The system shall provide a "Mark as Complete" button on each lesson page. Clicking the button records the lesson as complete in the Zustand store and also triggers `recordActivity()` to update streak data. Once complete, the button changes to show a "Completed" state with a checkmark. | P1 |
| **FR-28** | The system shall track quiz best scores. The `quizScores` record stores `{ score, total, bestScore }` for each quiz. When a new score is saved, `bestScore` is updated to `Math.max(existingBestScore, newScore)`. The most recent score is also stored separately. | P2 |
| **FR-29** | The system shall provide a reset progress button on the progress page. Clicking "Reset All" shows a confirmation dialog with "Are you sure?" text, a red warning icon, a "Yes, Reset" destructive button, and a "Cancel" button. Confirming resets all state to initial values: empty `completedLessons`, empty `quizScores`, zero streaks, empty `activeDays`, empty `unlockedAchievements`, and null `lastVisitedLesson`. | P2 |
| **FR-30** | The system shall display a skill radar chart (planned). This feature will visualize the user's proficiency across different skill areas based on quiz scores and exercise completions within each arc. | P3 |

#### FR-31 to FR-40: Reference and Tools

| ID | Requirement | Priority |
|----|------------|----------|
| **FR-31** | The system shall provide a searchable cheatsheet page at `/cheatsheet` containing all Claude Code commands, shortcuts, and configuration options. The search input filters items in real-time by matching against both `command` and `description` fields (case-insensitive substring match). | P1 |
| **FR-32** | The system shall support filtering the cheatsheet by category tabs: All, CLI, Commands, Config, MCP, Agents, Hooks, and Shortcuts. Each tab shows an icon and label. The "All" tab shows every section. Selecting a tab filters sections to only those matching the tab's identifier. Tab and search filters are applied simultaneously. | P1 |
| **FR-33** | The system shall provide copy-to-clipboard functionality for templates. Each template in the template library has a copy button. Clicking it copies the template code to the clipboard using `navigator.clipboard.writeText()` with a fallback to `document.execCommand('copy')` for older browsers. The button shows a "Copied" confirmation state for 2 seconds. | P1 |
| **FR-34** | The system shall display a prompt templates library on the Prompt Lab page with 20+ templates organized into 5 categories: Coding, Writing, Analysis, Debugging, and Claude Code. Each template card shows: title, category badge (color-coded), short preview text, and a copy button. Category filter buttons show the count for each category. | P1 |
| **FR-35** | The system shall show a before/after prompt comparison gallery on the Prompt Lab page. Each comparison shows: a topic label, the "Before" prompt (bad, vague) with a red badge and red-tinted background, the "After" prompt (good, specific) with a green badge and green-tinted background, and an explanation of what makes the improved version effective. The gallery contains 9 examples covering: fixing code, writing content, getting explanations, writing tests, code review, database queries, refactoring, DevOps tasks, and writing regex. | P2 |
| **FR-36** | The system shall provide a configuration template library at `/templates` with templates for: CLAUDE.md files (Node.js API, React Frontend, Python Data Science, Full-Stack Monorepo, Mobile App), settings.json (Permissive Development, Locked-Down Production, CI/CD Pipeline), hook configurations (Auto-Format, Desktop Notification, Slack Webhook), agent definitions (Security Reviewer, Test Writer, Documentation Generator), and custom slash commands (Fix Issue, Deploy Pipeline, PR Review). Each template shows title, category badge, description, and full code with copy button. | P1 |
| **FR-37** | The system shall support Cmd+K (macOS) / Ctrl+K (Windows/Linux) as a global keyboard shortcut to open the search dialog. The shortcut works from any page. Pressing the shortcut again or pressing Escape closes the dialog. | P1 |
| **FR-38** | The system shall provide search across lessons and commands. The current implementation uses substring matching on lesson titles and module names. A future implementation will use Fuse.js for fuzzy search with a pre-built index generated at build time. Results are limited to 8 items and show: type icon (lesson, quiz, exercise), title, module name, and a color-coded type badge. | P2 |
| **FR-39** | The system shall support dark mode (default) and light mode. The theme is controlled via `next-themes` with `data-theme` attribute on the HTML element. Dark mode uses a dark background (#0a0a0d) with light text (#e8e6e3). Light mode uses a light background (#fafaf9) with dark text (#1c1917). The accent color shifts from #d4a053 (dark) to #b8860b (light). The theme toggle is accessible from the site header. | P1 |
| **FR-40** | The system shall support keyboard navigation. All interactive elements (buttons, links, inputs) are focusable and operable via keyboard. Focus is indicated with a 2px accent-colored outline with 2px offset. The search dialog supports arrow key navigation through results and Enter to select. Quiz options can be tabbed to and activated. | P2 |

#### FR-41 to FR-46: DevSecOps Pipeline and Testing Infrastructure

| ID | Requirement | Priority |
|----|------------|----------|
| **FR-41** | The system shall have a CI workflow (`.github/workflows/ci.yml`) that runs on every push to `main` or `develop` and on every PR to `main`. The workflow shall execute lint (ESLint), type checking (`tsc --noEmit`), unit tests with coverage (Vitest), E2E tests (Playwright), and production build (`next build`) as separate jobs with a dependency graph: E2E depends on lint, typecheck, and test; build depends on all four. | P1 |
| **FR-42** | The system shall have a security workflow (`.github/workflows/security.yml`) that runs on every push to `main`, on PRs to `main`, and on a weekly schedule (Monday 8am UTC). The workflow shall perform dependency auditing (`npm audit --audit-level=high` + `audit-ci`), CodeQL static analysis for JavaScript/TypeScript, and secret detection using TruffleHog with `--only-verified` flag. | P1 |
| **FR-43** | The system shall have a deploy workflow (`.github/workflows/deploy.yml`) that runs on push to `main` and manual dispatch. The workflow shall include a CI gate job (lint + typecheck + test) that must pass before deployment. On success, it shall deploy to both GitHub Pages (via `actions/deploy-pages@v4`) and Vercel production (via `vercel deploy --prod` with alias to `klaude-academy-course.vercel.app`). | P1 |
| **FR-44** | The system shall have a PR preview workflow (`.github/workflows/pr-preview.yml`) that runs on PRs to `main`. The workflow shall build the site, deploy a preview to Vercel (non-production), and comment on the PR with the preview URL. | P2 |
| **FR-45** | The CI workflow shall upload artifacts: coverage report (30-day retention), Playwright HTML report (30-day retention), E2E failure screenshots (7-day retention on failure only), and build output (7-day retention). | P2 |
| **FR-46** | All key interactive and structural elements in the application shall have `data-testid` attributes following kebab-case naming convention. These attributes serve as stable selectors for E2E tests and must be present on: site header, site footer, site logo, navigation links, hero heading, Start Learning button, arc cards, stats bar, module cards, arc sections, module title, lesson items, lesson title, mark complete button, completed indicator, progress heading, progress stats, reset button, prompt lab heading, template cards, category filters, cheatsheet search input, and category tabs. | P1 |

#### FR-47 to FR-54: Authentication, Backend, and Theme

| ID | Requirement | Priority |
|----|------------|----------|
| **FR-47** | The system shall support user registration with email and password via Supabase Auth. The signup page (`/auth/signup`) shall include email and password fields with validation, and a link to the login page. On successful registration, a profile row shall be auto-created in the `profiles` table via a database trigger. | P1 |
| **FR-48** | The system shall support OAuth login with Google and GitHub via Supabase Auth. The login page (`/auth/login`) shall display OAuth buttons for each configured provider alongside the email/password form. OAuth redirects are handled via the `/auth/callback` route. | P1 |
| **FR-49** | The system shall provide a user profile page (`/profile`) where authenticated users can view and edit their display name. The display name is stored in the `profiles` table and shown on the leaderboard. | P2 |
| **FR-50** | The system shall sync progress to Supabase for authenticated users using a dual-write pattern. On every progress action (lesson complete, quiz score, exercise complete), the state is written to both localStorage (instant) and Supabase (async). On page load, authenticated users' state is fetched from Supabase and merged with local state. Guest users use localStorage only. | P1 |
| **FR-51** | The system shall provide a public leaderboard page (`/leaderboard`) displaying the top users sorted by total lessons completed. The leaderboard is a database view joining `profiles` and `completed_lessons`. It is publicly readable without authentication. | P2 |
| **FR-52** | The system shall generate completion certificates for each arc (Foundation, Practitioner, Power User, Expert). Certificates are stored in the `certificates` table with a unique certificate ID. Certificate pages (`/certificate/[id]`) display the user's name, arc name, and completion date. | P2 |
| **FR-53** | The system shall make all content accessible without authentication. Lessons, quizzes, cheatsheet, templates, and prompt lab shall function identically for guest users and authenticated users. Authentication only enables progress sync, leaderboard, certificates, and user profile. | P1 |
| **FR-54** | The system shall support a light mode / dark mode toggle with dark mode as the default. Theme switching uses class-based toggling via next-themes. Code blocks and terminal components shall remain dark-themed in both modes for readability. The theme preference persists across sessions. | P1 |

#### FR-55 to FR-65: Admin Dashboard

| ID | Requirement | Priority |
|----|------------|----------|
| **FR-55** | The system shall provide an admin dashboard at `/admin` accessible only to users with `app_metadata.role === 'admin'`. Non-admin users shall see an "Access Denied" message. Unauthenticated users shall be redirected to the login page. The admin check uses the `useAdmin()` hook and `AdminGuard` component. | P1 |
| **FR-56** | The admin dashboard overview page shall display summary statistics: total users, total lessons, overall completion rate, and recent activity feed. Data is fetched from Supabase using admin helper functions in `src/lib/admin.ts`. | P2 |
| **FR-57** | The admin content management section (`/admin/content`) shall allow admins to create new lessons with a markdown editor, edit existing lessons, and delete lessons. Lesson data is stored in the `managed_content` Supabase table. The editor shall support frontmatter fields (title, slug, difficulty, duration, tags, objectives) and a quiz builder for adding quiz questions. | P1 |
| **FR-58** | The admin content section shall include a content preview modal that renders the markdown content as it would appear to learners, allowing admins to verify formatting before saving. | P2 |
| **FR-59** | The admin user management section (`/admin/users`) shall display a list of all registered users with search and filtering capabilities. Admins shall be able to view user details (profile, progress, quiz scores) and manage user roles (promote to admin or revoke admin). | P1 |
| **FR-60** | The admin analytics section (`/admin/analytics`) shall display charts and metrics including: page view counts, lesson completion rates, quiz performance averages, and user growth over time. Analytics data is stored in the `analytics_events` table and aggregated for display. | P2 |
| **FR-61** | The admin announcements section (`/admin/announcements`) shall allow admins to create, edit, and delete announcements. Each announcement has a type (info, warning, success, error) displayed as a badge, a message body, and optional scheduling (start date, end date). Announcements are stored in the `announcements` table. | P2 |
| **FR-62** | The admin settings section (`/admin/settings`) shall provide configurable site options stored as key-value pairs in the `site_settings` table. Settings changes take effect immediately without requiring a redeployment. | P3 |
| **FR-63** | The system shall provide an admin link in the site header that is visible only to authenticated users with admin role. The link navigates to `/admin`. | P1 |
| **FR-64** | The system shall provide a CLI script (`scripts/make-admin.ts`) to promote a user to admin role. The script requires the `SUPABASE_SERVICE_ROLE_KEY` environment variable and accepts an email address as argument. It sets `app_metadata.role = 'admin'` using the Supabase admin API. | P1 |
| **FR-65** | The admin database migration (`supabase/migrations/002_admin.sql`) shall create 4 tables (`managed_content`, `site_settings`, `announcements`, `analytics_events`) with Row Level Security policies. Admin tables shall allow admin write access and public read access. The migration shall also create an `is_admin()` SQL function used in RLS policies. | P1 |

### 3.2 Non-Functional Requirements

| ID | Category | Requirement | Metric |
|----|---------|------------|--------|
| **NFR-01** | Performance | The system shall achieve a Lighthouse score of 95 or above on Performance, Accessibility, Best Practices, and SEO metrics for all pages. | Lighthouse audit score >= 95 |
| **NFR-02** | Performance | The system shall achieve First Contentful Paint (FCP) under 1.2 seconds on a standard broadband connection (10 Mbps). | FCP < 1200ms |
| **NFR-03** | Performance | The system shall achieve Time to Interactive (TTI) under 2.5 seconds on a standard broadband connection. | TTI < 2500ms |
| **NFR-04** | Performance | The total JavaScript bundle per page shall not exceed 200KB (compressed, after code-splitting). Next.js automatic code-splitting ensures only the JavaScript needed for the current page is loaded. | JS bundle < 200KB per route |
| **NFR-05** | Accessibility | The system shall comply with WCAG 2.1 Level AA accessibility guidelines. This includes: sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text), keyboard navigability, screen reader compatibility, and proper ARIA attributes. | Zero WCAG AA violations |
| **NFR-06** | Accessibility | All interactive elements (buttons, links, form inputs, quiz options, search dialog) shall be fully operable using keyboard alone. Tab order follows visual reading order. Focus indicators are visible on all elements. | All interactions keyboard-accessible |
| **NFR-07** | Compatibility | The system shall function correctly on Chrome 90+, Firefox 90+, Safari 15+, and Edge 90+. Core content (lesson text) shall be readable on any browser that supports HTML and CSS. | Tested on all target browsers |
| **NFR-08** | Compatibility | The system shall render correctly on viewports from 320px to 2560px width. Layouts adapt at breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px). | Responsive from 320px to 2560px |
| **NFR-09** | Security | The system shall make no external API calls at runtime. No user data is transmitted over the network. All user state remains in the browser's localStorage. No cookies are set beyond what Next.js requires for theme preference. | Zero external network requests |
| **NFR-10** | Reliability | The system, as a static site deployed to a CDN, shall maintain 99.9% or higher uptime. There are no server-side components that can fail. | Uptime >= 99.9% |
| **NFR-11** | Maintainability | The codebase shall use TypeScript in strict mode with no `any` types in production code. ESLint shall be configured with the `eslint-config-next` ruleset. All components use named exports. | TypeScript strict, ESLint clean |
| **NFR-12** | Scalability | The system, as a statically generated site, shall handle unlimited concurrent users without performance degradation. Each user loads pre-built files from a CDN; there is no shared server resource. | Unlimited concurrent users |
| **NFR-13** | Deployment | The CI pipeline (lint, typecheck, unit tests) must pass before any deployment to production. The deploy workflow includes a CI gate job that blocks deployment on failure. No code reaches GitHub Pages or Vercel production without passing the gate. | CI gate pass required |
| **NFR-14** | Testing | E2E tests must pass on both desktop (Chromium, 1280x720) and mobile (Pixel 7, 412x915) viewports. The Playwright configuration defines two projects (`chromium` and `mobile`) and all 36 E2E tests run on both. Tests that are viewport-specific (e.g., desktop-only nav links) skip gracefully on the inapplicable viewport. | E2E pass on desktop + mobile |
| **NFR-15** | Security | All user data stored in Supabase shall be protected by Row Level Security (RLS). Each table's RLS policies shall ensure that authenticated users can only read and write their own data. The leaderboard view and certificate verification are the only publicly readable data. No user can access, modify, or delete another user's progress, scores, or profile. | Zero RLS bypass vulnerabilities |
| **NFR-16** | Graceful Degradation | The Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) shall be optional. When not set, the system shall function as a fully static site with localStorage-only persistence. Auth-related UI elements (Sign In button, user menu) shall be hidden. No errors shall occur due to missing Supabase configuration. | Site fully functional without Supabase |

---

## 4. Data Model

### 4.1 Core TypeScript Interfaces

The following interfaces define the data structures used throughout the application. They are located in `src/types/`.

#### Module

```typescript
// src/types/content.ts
interface Module {
  slug: string;              // URL-safe identifier, e.g. "claude-fundamentals"
  title: string;             // Display name, e.g. "Claude Fundamentals"
  description: string;       // One-paragraph module description
  arc: "foundation" | "practitioner" | "power-user" | "expert";
  order: number;             // 1-13, determines display order
  icon: string;              // Lucide icon name, e.g. "brain"
  color: string;             // Hex color for arc theming, e.g. "#5cb870"
  estimatedHours: number;    // Estimated time to complete module
  prerequisites: string[];   // Array of module slugs required before this one
  lessons: Lesson[];         // Array of lessons belonging to this module
}
```

#### Lesson

```typescript
// src/types/content.ts
interface Lesson {
  slug: string;              // URL-safe identifier, e.g. "what-is-claude"
  moduleSlug: string;        // Parent module slug
  title: string;             // Display name
  order: number;             // Position within module
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  duration: number;          // Estimated minutes to complete
  tags: string[];            // Topic tags for search/filtering
  objectives: string[];      // Learning objectives displayed at top of lesson
  content: string;           // Raw MDX content body (after frontmatter)
}
```

#### QuizQuestion

```typescript
// src/types/content.ts
interface QuizQuestion {
  id: string;                // Unique identifier
  question: string;          // Question text
  type: "multiple-choice" | "multiple-select" | "true-false";
  options: string[];         // Array of answer option strings
  correct: number | number[];// Index(es) of correct answer(s)
  explanation: string;       // Explanation shown after answering
}
```

#### ProgressState

```typescript
// src/types/progress.ts
interface ProgressState {
  completedLessons: string[];     // Array of "moduleSlug/lessonSlug" identifiers
  quizScores: Record<string, {    // Keyed by quizId
    score: number;                // Most recent score (percentage)
    total: number;                // Total questions
    bestScore: number;            // Highest score achieved
  }>;
  completedExercises: string[];   // Array of exercise identifiers
  activeDays: string[];           // Array of ISO date strings (YYYY-MM-DD)
  currentStreak: number;          // Consecutive days of activity ending today/yesterday
  longestStreak: number;          // Maximum streak ever achieved
  unlockedAchievements: string[]; // Array of achievement IDs
  lastVisitedLesson: string | null; // Most recently visited lesson identifier
}
```

#### Achievement

```typescript
// src/types/progress.ts
interface Achievement {
  id: string;                // Unique identifier, e.g. "first-lesson"
  title: string;             // Display name, e.g. "First Steps"
  description: string;       // What the user did to earn it
  icon: string;              // Lucide icon name
  condition: string;         // Human-readable condition expression
}
```

#### CodeExercise

```typescript
// src/types/exercise.ts
interface CodeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  moduleSlug: string;
  lessonSlug: string;
  starterCode: string;        // Pre-filled code in the editor
  solutionCode: string;       // Reference solution
  hints: string[];            // Progressive hints
  validationRules: ValidationRule[];
  language: "prompt" | "markdown" | "json" | "yaml" | "bash";
}

interface ValidationRule {
  type: "contains" | "not-contains" | "regex" | "exact" | "length-min" | "length-max";
  value: string;
  message: string;            // Error message if rule fails
}
```

#### FillInBlank

```typescript
// src/types/exercise.ts
interface FillInBlank {
  id: string;
  title: string;
  description: string;
  moduleSlug: string;
  lessonSlug: string;
  template: string;           // Text with {{N}} placeholders
  blanks: BlankSlot[];
}

interface BlankSlot {
  id: string;
  correctAnswers: string[];   // Multiple accepted answers
  hint: string;
  caseSensitive: boolean;
}
```

#### TerminalStep and TerminalExercise

```typescript
// src/types/exercise.ts
interface TerminalStep {
  id: string;
  instruction: string;        // What the user should do
  expectedCommand: string;    // Primary correct command
  alternativeCommands: string[]; // Other accepted variations
  output: string;             // Simulated terminal output
  explanation: string;        // Why this command works
}

interface TerminalExercise {
  id: string;
  title: string;
  description: string;
  moduleSlug: string;
  lessonSlug: string;
  steps: TerminalStep[];
  initialDirectory: string;   // Simulated working directory
}
```

### 4.2 State Persistence

The Zustand store uses the `persist` middleware with the following configuration:

```typescript
persist(storeCreator, {
  name: "klaude-academy-progress", // localStorage key
})
```

The serialized state is a JSON string stored under the key `klaude-academy-progress` in the browser's localStorage. The persist middleware handles serialization on every state change and deserialization (rehydration) on initial page load.

### 4.3 Content Files

Module metadata is stored in `_module.json` files within each module directory:

```
content/modules/01-claude-fundamentals/_module.json
```

Lesson content is stored as `.mdx` files in the same directory:

```
content/modules/01-claude-fundamentals/01-what-is-claude.mdx
```

Each MDX file begins with YAML frontmatter:

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

---

## 5. System Architecture

### 5.1 Static Site Generation Flow

```
content/modules/**/*.mdx     content/modules/**/_module.json
         │                              │
         ▼                              ▼
    gray-matter                    JSON.parse()
  (frontmatter +                  (module metadata)
   content body)                        │
         │                              │
         ▼                              ▼
  src/lib/content.ts ──────── getModules(), getLesson()
         │
         ▼
  generateStaticParams() in page.tsx files
         │
         ▼
  Next.js Build (next build)
         │
         ▼
  Static HTML/CSS/JS files in /out directory
         │
         ▼
  Deploy to CDN (Vercel / Netlify / Cloudflare)
```

### 5.2 Client-Side State Management

```
User Action (click "Mark Complete")
         │
         ▼
  React Component calls store action
         │
         ▼
  Zustand store updates state
         │
         ▼
  persist middleware serializes to localStorage
         │
         ▼
  React re-renders subscribed components
```

### 5.3 Component Hierarchy

```
RootLayout (src/app/layout.tsx)
├── ThemeProvider (next-themes)
│   ├── SiteHeader
│   │   ├── Logo (Link to /)
│   │   ├── Nav links (Curriculum, Prompt Lab, Cheatsheet, Templates)
│   │   ├── Search button
│   │   ├── ThemeToggle
│   │   └── Mobile hamburger menu
│   ├── <main> (page content)
│   │   ├── HomePage (/)
│   │   ├── CurriculumPage (/curriculum)
│   │   ├── ModulePage (/curriculum/[moduleSlug])
│   │   │   └── ModuleProgressBar
│   │   ├── LessonPage (/curriculum/[moduleSlug]/[lessonSlug])
│   │   │   ├── LessonSidebar
│   │   │   ├── Breadcrumb
│   │   │   ├── MarkCompleteButton
│   │   │   └── Lesson content (MDX → HTML)
│   │   │       ├── Quiz
│   │   │       ├── FillInBlank
│   │   │       ├── TerminalSimulator
│   │   │       ├── CodeBlock
│   │   │       ├── Callout
│   │   │       ├── FileTree
│   │   │       └── KeyCombo
│   │   ├── CheatsheetPage (/cheatsheet)
│   │   ├── TemplatesPage (/templates)
│   │   ├── PromptLabPage (/prompt-lab)
│   │   │   └── PromptPlayground
│   │   └── ProgressPage (/progress)
│   │       └── ProgressDashboard
│   │           ├── ProgressBar
│   │           ├── AchievementBadge
│   │           └── StreakCounter
│   └── SiteFooter
└── SearchDialog (global overlay, opened by Cmd+K)
```

### 5.4 Routing Structure

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/` | `src/app/page.tsx` | Client | Landing page with hero, arcs, features, CTA |
| `/curriculum` | `src/app/curriculum/page.tsx` | Client | All 15 modules grouped by arc |
| `/curriculum/[moduleSlug]` | `src/app/curriculum/[moduleSlug]/page.tsx` | Server + SSG | Module overview with lesson list |
| `/curriculum/[moduleSlug]/[lessonSlug]` | `src/app/curriculum/[moduleSlug]/[lessonSlug]/page.tsx` | Server + SSG | Individual lesson content |
| `/cheatsheet` | `src/app/cheatsheet/page.tsx` | Client | Searchable command reference |
| `/templates` | `src/app/templates/page.tsx` | Client | Configuration template library |
| `/prompt-lab` | `src/app/prompt-lab/page.tsx` | Client | Prompt builder, templates, before/after |
| `/progress` | `src/app/progress/page.tsx` | Client | Progress dashboard with reset |

Dynamic routes use `generateStaticParams()` to pre-render all module and lesson pages at build time. The module page generates params from `getModules()` (13 entries). The lesson page generates params from all module-lesson combinations.
