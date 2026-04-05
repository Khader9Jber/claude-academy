# Project Glossary

## Claude Academy Learning Platform

**Document Version:** 1.0
**Date:** 2026-04-04

This glossary defines every term a developer joining the Claude Academy project needs to understand. Terms are organized alphabetically within categories.

---

## Table of Contents

1. [Claude and Anthropic](#1-claude-and-anthropic)
2. [Claude Code](#2-claude-code)
3. [Web Technologies](#3-web-technologies)
4. [React and Next.js](#4-react-and-nextjs)
5. [Styling and Design](#5-styling-and-design)
6. [Content and Markdown](#6-content-and-markdown)
7. [State Management and Storage](#7-state-management-and-storage)
8. [Testing](#8-testing)
9. [Project-Specific Terms](#9-project-specific-terms)

---

## 1. Claude and Anthropic

### Anthropic

The AI safety company that builds Claude. Founded in 2021 by former OpenAI researchers. Headquartered in San Francisco. Anthropic focuses on building safe, steerable AI systems.

### Claude

Anthropic's family of large language models (LLMs). Claude is the AI assistant that powers the learning content in this project. Users of Claude Academy are learning how to use Claude effectively.

### Claude Code

Anthropic's official command-line interface (CLI) for interacting with Claude in a development environment. Claude Code runs in the terminal and can read files, write code, run commands, and assist with software development tasks. It is the primary subject matter of the Claude Academy curriculum.

### Constitutional AI (CAI)

Anthropic's alignment technique for training Claude. Instead of relying solely on human feedback, Constitutional AI uses a set of principles (a "constitution") to guide the model's behavior. The model critiques and revises its own outputs against these principles during training.

### Context Window

The maximum amount of text (measured in tokens) that Claude can process in a single conversation. Larger context windows allow Claude to read more code, documentation, or conversation history at once. Claude's context window sizes vary by model (e.g., 200K tokens for Claude Sonnet).

### Effort Levels

A Claude Code setting that controls how much reasoning the model applies to a task. Levels are `low` (quick answers), `medium` (balanced, default), `high` (thorough), and `max` (maximum depth). The keyword `ultrathink` in a prompt triggers extended thinking beyond `max`.

### Haiku

The smallest and fastest model in the Claude family. Optimized for speed and cost efficiency. Best for simple tasks like classification, short answers, and quick lookups.

### Model Context Protocol (MCP)

An open protocol for connecting Claude to external tools and data sources. MCP servers provide "tools" that Claude can call during a conversation (e.g., querying a database, searching the web, interacting with APIs). MCP uses transports like `stdio` (local processes), HTTP (remote servers), and SSE (legacy streaming).

### Opus

The most capable model in the Claude family. Best for complex analysis, creative writing, multi-step reasoning, and tasks requiring deep understanding. Slower and more expensive than Sonnet.

### Sonnet

The balanced model in the Claude family. Good trade-off between capability and speed. The default model for most Claude Code interactions.

### Tokens

The units that Claude uses to process text. Roughly, 1 token is approximately 4 characters or 0.75 words in English. Both input (what you send to Claude) and output (what Claude generates) consume tokens from the context window.

---

## 2. Claude Code

### Agents

In Claude Code, agents are autonomous Claude instances that can work on tasks independently. Agents can be given specific instructions, tools, and constraints. Multiple agents can work as "teammates" on different parts of a project simultaneously.

### Batch

A Claude Code feature (`/batch`) that runs the same prompt across multiple files. Useful for applying repetitive changes like adding headers, updating imports, or formatting code across an entire project.

### Hooks (Claude Code Hooks)

Lifecycle callbacks in Claude Code that run custom scripts when specific events occur. Hook events include `PreToolUse` (before Claude uses a tool), `PostToolUse` (after a tool completes), `Notification` (when Claude sends a notification), `SessionStart`, `TaskCompleted`, and others. Hooks are configured in `.claude/settings.json`. **Note:** These are distinct from React hooks (see below).

### Loop

A Claude Code feature (`/loop`) that runs a slash command on a recurring interval (e.g., `/loop 5m /compact` runs `/compact` every 5 minutes).

### REPL

Read-Eval-Print Loop. Claude Code's default interactive mode where you type prompts and see responses in a continuous conversation. Started by running `claude` with no arguments.

### Skills

Predefined capabilities in Claude Code that can be triggered with slash commands. Skills are more structured than raw prompts -- they have specific input formats and expected behaviors. Examples: `/commit` (create a git commit), `/review-pr` (review a pull request).

### Worktrees

A Git feature used by Claude Code (`claude -w` or `--worktree`) to create isolated working directories. Worktrees allow parallel work: Claude can work in one worktree while the developer works in another, without conflicts.

---

## 3. Web Technologies

### API (Application Programming Interface)

A set of defined methods for communication between software components. In this project's context, API refers to: (a) the Anthropic API for sending requests to Claude, (b) Next.js API routes (server-side endpoints, planned for future backend), or (c) browser APIs like localStorage and Clipboard.

### CDN (Content Delivery Network)

A geographically distributed network of servers that caches and serves static files close to users. When Claude Academy is deployed, its HTML/CSS/JS files are served from a CDN (via Vercel, Netlify, or Cloudflare) for fast global access.

### CLI (Command-Line Interface)

A text-based interface for interacting with software by typing commands in a terminal. Claude Code is a CLI tool. This project is also managed via CLI commands (`npm run dev`, `npm run build`, etc.).

### CSR (Client-Side Rendering)

A rendering strategy where the browser downloads a minimal HTML shell and then JavaScript builds the full page content. In Claude Academy, pages like the landing page, curriculum, and cheatsheet are effectively CSR because they are marked `"use client"` and build their content in the browser.

### ISR (Incremental Static Regeneration)

A Next.js rendering strategy that rebuilds individual static pages on demand after deployment, without rebuilding the entire site. Not currently used in Claude Academy (the site uses full static export), but relevant to the future backend architecture.

### SDK (Software Development Kit)

A collection of tools, libraries, and documentation for building applications with a specific platform. The Supabase SDK (`@supabase/supabase-js`) and the Anthropic SDK (`@anthropic-ai/sdk`) are examples relevant to the project's future.

### SSG (Static Site Generation)

A rendering strategy where all pages are pre-rendered to HTML at build time. Claude Academy uses SSG via Next.js `output: 'export'`. The build step produces a directory of static files that can be served by any web server. No server-side computation happens at request time.

### SSR (Server-Side Rendering)

A rendering strategy where pages are rendered on the server for each request. Not currently used in Claude Academy, but would be needed if a backend is added (e.g., for user-specific progress pages).

---

## 4. React and Next.js

### App Router

Next.js's file-system-based routing system (introduced in Next.js 13, used in this project). Routes are defined by the directory structure under `src/app/`. A `page.tsx` file in a directory creates a route. Dynamic segments use bracket notation: `[moduleSlug]`.

### Client Component

A React component that runs in the browser. Marked with the `"use client"` directive at the top of the file. Client components can use React hooks (useState, useEffect, etc.), event handlers, and browser APIs. In Claude Academy, interactive components (Quiz, SearchDialog, SiteHeader) are client components.

### generateStaticParams

A Next.js function exported from dynamic route pages that tells the build system which parameter values to pre-render. In Claude Academy, `generateStaticParams()` generates all module slug and lesson slug combinations so that every lesson page has a pre-rendered HTML file.

### Hooks (React Hooks)

Functions in React that let you use state and lifecycle features in functional components. Common hooks: `useState` (local state), `useEffect` (side effects), `useCallback` (memoized functions), `useMemo` (memoized values), `useRef` (DOM references). **Note:** These are distinct from Claude Code hooks (see above).

### Hydration

The process where React attaches JavaScript event handlers and state management to server-rendered (or statically generated) HTML in the browser. When a page loads, the HTML is visible immediately, then React "hydrates" interactive elements to make them functional. Hydration mismatches (server HTML differs from client render) can cause warnings.

### Server Component

A React component that runs only at build time (in the SSG context) or on the server. Server components can read from the filesystem, access databases, and perform other server-side operations. They cannot use React hooks or browser APIs. In Claude Academy, the module page and lesson page outer shells are server components.

### ThemeProvider

A component from the `next-themes` library that manages dark/light mode. It sets the `data-theme` attribute on the `<html>` element, which CSS custom properties respond to. Wraps the entire application in `src/app/layout.tsx`.

---

## 5. Styling and Design

### CVA (Class Variance Authority)

A utility library for creating typed component variants with Tailwind CSS. Used in the Button and Badge components to define multiple visual variants (default, outline, ghost, destructive) with TypeScript type safety.

### Framer Motion

A React animation library used for page entrance effects on the landing page and curriculum page. Provides `motion.div` components with `initial`, `animate`, and `whileInView` props for declarative animations.

### Lucide React

An icon library providing clean, consistent SVG icons as React components. Used throughout the application for navigation icons, feature icons, and UI indicators. Icons are imported individually (tree-shakable).

### Shiki

A syntax highlighting engine that uses the same TextMate grammar files as VS Code. Used via `@shikijs/rehype` to syntax-highlight code blocks in MDX content at build time. Produces pre-highlighted HTML that requires no client-side JavaScript.

### Tailwind CSS

A utility-first CSS framework. Instead of writing custom CSS classes, you apply small utility classes directly in HTML/JSX (e.g., `text-sm font-bold px-4 py-2 rounded-lg`). Tailwind CSS 4 (used in this project) supports the `@theme inline` directive for defining custom design tokens directly in CSS.

### tailwind-merge

A utility library that intelligently merges Tailwind CSS classes, resolving conflicts. For example, `twMerge("px-4 px-6")` returns `"px-6"` because `px-6` overrides `px-4`. Used via the `cn()` utility function in `src/lib/utils.ts`.

### shadcn/ui

A collection of beautifully designed, accessible React components built with Tailwind CSS and Radix UI. Claude Academy follows the shadcn/ui philosophy: components are copied into the project (not installed as a dependency), giving full ownership and customization control. The project does not use shadcn/ui directly but builds components in the same style.

---

## 6. Content and Markdown

### Frontmatter

YAML metadata at the top of an MDX file, delimited by `---` markers. Frontmatter defines structured data about a lesson (title, slug, difficulty, duration, tags, objectives) that is parsed separately from the content body using the `gray-matter` library.

### gray-matter

A Node.js library that parses YAML frontmatter from Markdown and MDX files. It splits a file into `data` (the parsed YAML as a JavaScript object) and `content` (the remaining Markdown body). Used in `src/lib/content.ts`.

### MDX

A content format that extends Markdown with JSX (JavaScript XML). MDX files look like regular Markdown but can embed React components directly in the content. For example, a lesson written in MDX can include a `<Quiz>` component between paragraphs of text. MDX 3 is used via the `next-mdx-remote` library.

### next-mdx-remote

A library for rendering MDX content that is loaded from external sources (files, databases, APIs) rather than being imported as modules. It compiles MDX to React components at runtime (or build time in the case of SSG). Supports custom component mapping, remark plugins, and rehype plugins.

### rehype

A plugin ecosystem for processing HTML. Rehype plugins transform HTML syntax trees. This project uses `rehype-slug` (adds IDs to headings for anchor links) and `rehype-autolink-headings` (adds clickable links to headings).

### remark

A plugin ecosystem for processing Markdown. Remark plugins transform Markdown syntax trees before they become HTML. This project uses `remark-gfm` which adds support for GitHub-Flavored Markdown features: tables, task lists, strikethrough text, and autolinked URLs.

### remark-gfm

A remark plugin that adds GitHub-Flavored Markdown support. Enables syntax for tables (`| col | col |`), task lists (`- [x] done`), strikethrough (`~~deleted~~`), and automatic URL linking.

---

## 7. State Management and Storage

### localStorage

A browser API that stores key-value pairs (strings) persistently on the user's device. Data survives page reloads and browser restarts. Each origin (domain) has ~5MB of storage. Claude Academy stores all progress data in localStorage under the key `claude-academy-progress`.

### Persist Middleware

A Zustand middleware that automatically serializes the store state to a storage backend (localStorage by default) on every state change, and deserializes (rehydrates) it when the store is initialized. Configured with a single `name` option that sets the storage key.

### Rehydration

The process of restoring persisted state from localStorage back into the Zustand store when the application loads. During rehydration, there is a brief moment where the store has its initial default values before the persisted data is loaded. This can cause a "flash" of incorrect UI, which is handled by hydration guards (checking a `mounted` state variable).

### Zustand

A small (2KB gzipped), fast state management library for React. Creates stores as plain functions with `create()`. State is accessed via hooks (`useStore(selector)`) and updated via `set()`. Zustand does not use reducers, action types, or middleware chains like Redux. The `persist` middleware adds localStorage integration.

---

## 8. Testing

### axe-core

An accessibility testing engine that checks web pages for WCAG compliance. Used via `@axe-core/playwright` to run automated accessibility audits in E2E tests. Checks for issues like missing alt text, insufficient color contrast, missing form labels, and improper ARIA attributes.

### E2E (End-to-End) Testing

Testing that simulates real user behavior across the full application stack. E2E tests navigate between pages, click buttons, fill forms, and verify that the entire system works together. Claude Academy uses Playwright for E2E testing.

### Lighthouse

An open-source tool by Google for auditing web page quality. Measures Performance (load speed, interactivity), Accessibility (WCAG compliance), Best Practices (security headers, console errors), and SEO (meta tags, crawlability). Scores range from 0-100. Claude Academy targets 95+ on all metrics.

### Playwright

A cross-browser E2E testing framework by Microsoft. Supports Chromium, Firefox, and WebKit. Tests run in real browsers and can simulate user interactions, viewport sizes, and keyboard input. Claude Academy uses Playwright for page navigation tests, interaction tests, and accessibility audits.

### React Testing Library

A testing utility library that encourages testing React components the way users interact with them. Instead of testing implementation details (state values, method calls), tests query the DOM for visible text, labels, and roles. Works with Vitest as the test runner.

### Vitest

A fast unit test framework built on Vite. ESM-native, compatible with Jest's API (`describe`, `it`, `expect`). Used for unit tests (utility functions, store logic) and component tests (with React Testing Library). Supports TypeScript out of the box.

---

## 9. Project-Specific Terms

### Arc

A grouping of related modules that represents a skill level in the Claude Academy curriculum. There are 4 arcs: Foundation (Modules 1-4, green), Practitioner (Modules 5-8, blue), Power User (Modules 9-11, purple), and Expert (Modules 12-13, gold). Each arc has a distinct color used throughout the UI.

### Capstone Project

Module 13, the final module in the curriculum. A guided project where students plan, build, test, and deploy a real application end-to-end using Claude Code. Synthesizes all skills learned in previous modules.

### Cheatsheet

The `/cheatsheet` page. A searchable, filterable reference of all Claude Code commands, flags, slash commands, keyboard shortcuts, configuration options, hook events, MCP transports, effort levels, environment variables, and permission patterns. Contains 12 sections and 90+ items.

### Content Loader

The module at `src/lib/content.ts` that reads module metadata (`_module.json`) and lesson files (`.mdx`) from the filesystem at build time. Provides functions like `getModules()`, `getModule(slug)`, `getLesson(moduleSlug, lessonSlug)`, and `getAllLessons()`.

### Lesson

A single educational unit within a module. Each lesson is an MDX file with frontmatter (title, slug, difficulty, duration, objectives) and content body. Lessons are ordered by their `order` field and can contain embedded interactive components.

### Module

A collection of related lessons organized under a common topic. Each module has metadata (title, slug, arc, order, icon, color, prerequisites) defined in `_module.json`. There are 13 modules total.

### Prompt Lab

The `/prompt-lab` page. An interactive workspace with three sections: a 6-layer prompt builder (Role, Context, Task, Constraints, Format, Examples), a template library of 20+ ready-to-use prompts, and a before/after gallery showing how to transform vague prompts into specific ones.

### Progress Store

The Zustand store(s) that manage user progress state. Tracks completed lessons, quiz scores, exercise completions, active days, streaks, and achievements. Persists to localStorage. Located at `src/lib/progress-store.ts` (primary) and `src/lib/store.ts` (secondary).

### Template Library

The `/templates` page. A collection of 15 copy-paste configuration templates for CLAUDE.md files, settings.json configurations, hook setups, agent definitions, and custom slash commands. Each template includes a title, description, category, and full code with a copy button.

### cn()

The primary utility function at `src/lib/utils.ts`. Combines `clsx` (conditional class name joining) with `tailwind-merge` (Tailwind class conflict resolution). Used throughout the codebase to compose CSS class strings: `cn("base-class", isActive && "active-class", "px-4")`.

### slugify()

A utility function at `src/lib/utils.ts` that converts a string into a URL-safe slug: lowercase, spaces to hyphens, special characters removed. Used for generating heading IDs and URL segments.

### formatDuration()

A utility function at `src/lib/utils.ts` that converts a number of minutes into a human-readable string: `5` becomes `"5 min"`, `90` becomes `"1h 30m"`, `120` becomes `"2h"`. Used on lesson cards and lesson headers.
