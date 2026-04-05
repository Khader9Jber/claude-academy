# Changelog

All notable changes to Claude Academy are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

- Enrich lessons 50-100 with more specific examples and code snippets
- Add Sandpack code exercises to Practitioner and Advanced modules
- Arabic language support (RTL layout)
- Accessibility audit (WCAG 2.1 AA compliance)
- Fuse.js search integration (currently hardcoded search data)
- OG images for social sharing

---

## [0.2.1] - 2026-04-04

### Changed

- Primary deployment moved from Vercel to Netlify (https://klaude-academy.netlify.app)
- Vercel demoted to backup deployment (has deployment protection issues on free plan)
- Deployment is now triple-platform: Netlify (primary, SSR + full auth) + GitHub Pages (static) + Vercel (backup)
- Updated all documentation to reflect new deployment architecture
- Added `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` to CI/CD environment variables

### Fixed

- Deployment protection issues on Vercel free plan resolved by switching primary to Netlify

---

## [0.2.0] - 2026-04-05

### Added

- Supabase backend integration (auth, database, RLS)
- User authentication: email/password + Google + GitHub OAuth
- Login and signup pages with data-testid attributes
- User profile page with editable display name
- Public leaderboard (top users by lessons completed)
- Certificate pages for each arc
- PostgreSQL schema: 7 tables with Row Level Security
- Progress sync hook (dual-write: localStorage + Supabase)
- Auth provider context with useAuth() hook
- Light mode theme support (dark mode remains default)
- Code blocks and terminals stay dark in both themes
- Snapshot v0.1.0 tag for reverting to pre-backend state

### Changed

- next.config.ts: SSR for Vercel, static export only for GitHub Pages
- Site header: shows auth state (Sign In / user menu)
- ThemeProvider: switched to class-based theme toggling

---

## [0.1.0] - 2026-04-05

### Added

- Clean architecture: Page Object Model (POM) for E2E tests with 9 page objects (`e2e/pages/`), barrel exports for components
- `data-testid` attributes on all key UI elements across 12 source files for stable E2E selectors
- Playwright E2E test suite: 36 tests across 6 spec files (navigation, progress, prompt lab, cheatsheet, templates, responsive)
- DevSecOps CI/CD pipeline with 4 GitHub Actions workflows:
  - `ci.yml`: lint, typecheck, unit tests + coverage, E2E tests, build (parallel jobs with dependency graph)
  - `security.yml`: dependency audit, CodeQL analysis, secret detection (TruffleHog), weekly cron scan
  - `deploy.yml`: CI gate then dual deploy to GitHub Pages + Vercel production with clean alias
  - `pr-preview.yml`: Vercel preview deploy on PRs with auto-comment
- Dual deployment:
  - GitHub Pages: `https://khader9jber.github.io/claude-academy/`
  - Vercel Production: `https://claude-academy-course.vercel.app`
- Vercel team (`claude-academy-org`) for clean URL aliasing
- Test coverage enforcement: 90% statements threshold, 70% branches threshold
- Achieved coverage: 97% statements, 100% functions on `src/lib/` files
- 74 MDX lesson files across 13 modules (4 arcs: Foundation, Practitioner, Power User, Expert)
- 294 quiz questions embedded in lesson frontmatter
- 46 unit tests (Vitest) covering utility functions and progress store
- 36 E2E tests (Playwright) covering all pages and critical user flows on desktop + mobile
- 6 project documents: SRS, Test Plan, Test Suites, Architecture, Implementation Plan, Glossary
- QA validation suite: content validation script, build report script, completeness audit script
- Interactive components: Quiz, FillInBlank, TerminalSimulator, PromptPlayground
- Content components: CodeBlock, Callout, FileTree, KeyCombo, ComparisonTable, StepList, CopyButton, TerminalBlock
- 8 pages: Landing, Curriculum, Module, Lesson, Prompt Lab, Cheatsheet, Templates, Progress
- Dark-mode-first design system based on Claude brand colors (gold accent, green/blue/purple/gold arc colors)
- Light mode with appropriate color inversions
- Zustand progress store with localStorage persistence (`claude-academy-progress` key)
- Next.js 16 static site with App Router (`output: 'export'`)
- Searchable cheatsheet with 12 sections, 90+ items, real-time search, and 8 category tabs
- Template library with 15 templates across 5 categories with copy-to-clipboard
- Prompt Lab with 6-layer prompt builder, 20+ prompt templates across 5 categories, and 9 before/after comparisons
- Progress dashboard with completion percentage, module breakdowns, streak counter, and achievement badges
- Global search dialog (Cmd+K / Ctrl+K) with real-time filtering
- Responsive layout from 320px to 2560px with mobile hamburger menu
- Green heart footer: "Built with heart by KK"
- Three custom fonts: DM Sans (body), JetBrains Mono (code), Instrument Serif (headings)
