# Master Test Plan

## Claude Academy Learning Platform

**Document Version:** 1.0
**Date:** 2026-04-04
**Status:** Draft (Phase 7 not yet started)

---

## Table of Contents

1. [Test Strategy](#1-test-strategy)
2. [Test Scope](#2-test-scope)
3. [Entry and Exit Criteria](#3-entry-and-exit-criteria)
4. [Risk Assessment](#4-risk-assessment)
5. [Test Environment](#5-test-environment)
6. [Defect Management](#6-defect-management)

---

## 1. Test Strategy

### 1.1 Testing Levels

The testing strategy employs seven levels of testing, each targeting a different layer of the application:

| Level | Tool | Target | Coverage Goal |
|-------|------|--------|---------------|
| **Unit** | Vitest | Utility functions, store logic, content loader | 80% line coverage |
| **Component** | Vitest + React Testing Library | Individual React components in isolation | 70% line coverage |
| **Integration** | Vitest + React Testing Library | Component interactions (e.g., Quiz updates progress store) | Critical paths covered |
| **End-to-End** | Playwright | Full user flows across pages | All critical paths covered |
| **Visual** | Playwright screenshots | Layout consistency across viewports | Spot-checked per release |
| **Accessibility** | axe-core (via @axe-core/playwright) | WCAG 2.1 AA compliance | Zero violations |
| **Performance** | Lighthouse CI | Page load metrics | 95+ score on all metrics |

### 1.2 Testing Tools

| Tool | Version | Purpose | Configuration File |
|------|---------|---------|-------------------|
| **Vitest** | Latest | Unit and component test runner. Fast, ESM-native, compatible with Jest API. | `vitest.config.ts` |
| **React Testing Library** | Latest | Component rendering and interaction testing. Encourages testing behavior, not implementation. | Imported in test files |
| **@testing-library/jest-dom** | Latest | Custom DOM matchers (toBeVisible, toHaveTextContent, etc.) | Setup file in vitest config |
| **Playwright** | Latest | Cross-browser E2E testing. Headless Chrome, Firefox, WebKit. | `playwright.config.ts` |
| **@axe-core/playwright** | Latest | Automated accessibility auditing within Playwright tests. | Imported in accessibility test files |
| **Lighthouse CI** | Latest | Automated performance auditing. Runs Lighthouse in CI and asserts score thresholds. | `.lighthouserc.json` |

### 1.3 Test File Conventions

- Unit/component tests: `src/__tests__/<path-mirroring-src>/<filename>.test.ts(x)`
- E2E tests: `e2e/<feature>.spec.ts`
- Test fixtures: `src/__tests__/fixtures/`
- Test utilities: `src/__tests__/utils/`

### 1.4 Test Execution

- **Local development:** `npm test` runs Vitest in watch mode. `npx playwright test` runs E2E tests.
- **CI (GitHub Actions):** All tests run on every push to `main` and on every pull request.
- **Pre-commit:** ESLint and TypeScript type checking run as pre-commit hooks. Unit tests are not run pre-commit to keep commits fast.

### 1.5 CI Pipeline

```
Push / PR opened
    |
    v
Install dependencies (npm ci)
    |
    v
TypeScript type check (npx tsc --noEmit)
    |
    v
ESLint (npm run lint)
    |
    v
Unit + Component tests (npx vitest run --coverage)
    |
    v
Build (npm run build)
    |
    v
E2E tests (npx playwright test)
    |
    v
Accessibility tests (subset of E2E with axe-core)
    |
    v
Lighthouse CI (lighthouse-ci autorun)
    |
    v
Report results (coverage report, test results, Lighthouse scores)
```

---

## 2. Test Scope

### 2.1 What Is Tested

#### Utility Functions (Unit)

| Function | File | What to Test |
|----------|------|-------------|
| `cn()` | `src/lib/utils.ts` | Class name merging, conditional classes, Tailwind conflict resolution |
| `slugify()` | `src/lib/utils.ts` | String conversion, special characters, empty string, whitespace handling |
| `formatDuration()` | `src/lib/utils.ts` | Minutes-only format, hours-only format, mixed format, zero input |

#### Progress Store (Unit)

| Action | File | What to Test |
|--------|------|-------------|
| `markLessonComplete` | `src/lib/progress-store.ts` | Adds lesson, prevents duplicates, triggers `recordActivity` |
| `saveQuizScore` | `src/lib/progress-store.ts` | Stores score, updates bestScore, keeps bestScore when lower |
| `markExerciseComplete` | `src/lib/progress-store.ts` | Adds exercise, prevents duplicates |
| `recordActivity` | `src/lib/progress-store.ts` | Adds today, skips duplicate, calculates streak, updates longestStreak |
| `isLessonComplete` | `src/lib/progress-store.ts` | Returns true/false correctly |
| `getModuleProgress` | `src/lib/progress-store.ts` | Calculates percentage, handles empty arrays |
| `reset` | `src/lib/progress-store.ts` | Clears all state to initial values |
| Persistence | `src/lib/progress-store.ts` | State serializes to localStorage, rehydrates on load |

#### Content Loader (Unit)

| Function | File | What to Test |
|----------|------|-------------|
| `getModules()` | `src/lib/content.ts` | Returns all modules, sorted by order, with correct lesson counts |
| `getModule()` | `src/lib/content.ts` | Returns correct module by slug, returns null for non-existent slug |
| `getLesson()` | `src/lib/content.ts` | Returns lesson with parsed frontmatter and content body |
| `getAllLessons()` | `src/lib/content.ts` | Returns flat array of all lessons across all modules |
| `getModuleSlugs()` | `src/lib/content.ts` | Returns array of all module slugs |
| `getLessonSlugs()` | `src/lib/content.ts` | Returns lesson slugs for a given module |

#### Interactive Components (Component)

| Component | File | What to Test |
|-----------|------|-------------|
| `Quiz` | `src/components/interactive/quiz.tsx` | Question rendering, answer selection, feedback display, score calculation, retry, progress store integration |
| `FillInBlank` | `src/components/interactive/fill-in-blank.tsx` | Template rendering with input fields, answer validation (case-insensitive, multiple answers), show answers, result messages |
| `TerminalSimulator` | `src/components/interactive/terminal-simulator.tsx` | Command input, correct/incorrect command handling, hint after 2 wrong attempts, step progression, completion message |
| `PromptPlayground` | `src/components/interactive/prompt-playground.tsx` | Layer inputs, live preview assembly, copy to clipboard, before/after comparison mode |

#### Content Components (Component)

| Component | File | What to Test |
|-----------|------|-------------|
| `CodeBlock` | `src/components/content/code-block.tsx` | Code rendering, language label, copy button |
| `Callout` | `src/components/content/callout.tsx` | Variant rendering (info, warning, tip, danger), icon display, content rendering |
| `Breadcrumb` | `src/components/layout/breadcrumb.tsx` | Path segments, last item not a link, separator rendering |
| `CopyButton` | `src/components/content/copy-button.tsx` | Copy to clipboard, "Copied" confirmation state |

#### Layout Components (Component)

| Component | File | What to Test |
|-----------|------|-------------|
| `SiteHeader` | `src/components/layout/site-header.tsx` | Logo link, navigation links, mobile menu toggle, search button, theme toggle |
| `SidebarNav` | `src/components/layout/sidebar-nav.tsx` | Lesson list rendering, current lesson highlight, completion indicators |
| `ThemeToggle` | `src/components/layout/theme-toggle.tsx` | Toggle click changes theme attribute |

#### Progress Components (Component)

| Component | File | What to Test |
|-----------|------|-------------|
| `ProgressBar` | `src/components/ui/progress-bar.tsx` | Fill width percentage, label display |
| `ProgressDashboard` | `src/components/progress/progress-dashboard.tsx` | Overall stats, module breakdown, achievement display, hydration guard |
| `AchievementBadge` | `src/components/progress/achievement-badge.tsx` | Locked state (grayscale), unlocked state (colored) |
| `StreakCounter` | `src/components/progress/streak-counter.tsx` | Current streak display |

#### Search Component (Component)

| Component | File | What to Test |
|-----------|------|-------------|
| `SearchDialog` | `src/components/search/search-dialog.tsx` | Keyboard shortcut open/close, query filtering, result navigation, result selection, empty state, no-results state |

#### Page Navigation Flows (E2E)

| Flow | Pages Involved | What to Test |
|------|---------------|-------------|
| Browse curriculum | Landing -> Curriculum -> Module -> Lesson | Full navigation chain |
| Complete a lesson | Lesson page | Mark complete, verify sidebar update, verify progress persistence |
| Take a quiz | Lesson page with embedded quiz | Answer questions, see score, retry |
| Use cheatsheet | Cheatsheet page | Search, tab filter, result display |
| Use templates | Templates page | Category filter, copy to clipboard |
| Use prompt lab | Prompt Lab page | Builder, template copy, before/after display |
| Track progress | Progress page | Dashboard display, reset with confirmation |
| Search | Any page -> Search dialog | Open, search, navigate to result |

#### Responsive Layouts (E2E)

| Viewport | What to Test |
|----------|-------------|
| 375px (mobile) | Hamburger menu, single-column layouts, hidden sidebars |
| 768px (tablet) | Two-column layouts where applicable |
| 1024px (desktop) | Lesson sidebar visible, full navigation |
| 1280px (wide desktop) | Right-side TOC visible on lesson pages |

#### Accessibility (E2E)

| Area | What to Test |
|------|-------------|
| axe-core audit | Zero violations on all pages |
| Keyboard navigation | Tab through all interactive elements, correct focus order |
| Focus indicators | Visible focus outlines on all focusable elements |
| Color contrast | WCAG AA ratios (4.5:1 text, 3:1 large text) |
| Screen reader | Proper heading hierarchy, ARIA labels, alt text |

### 2.2 What Is NOT Tested

| Exclusion | Rationale |
|-----------|-----------|
| **Third-party library internals** (Next.js routing, Tailwind CSS compilation, Zustand state propagation, Framer Motion animation timing) | These are tested by their respective maintainers. We test our usage of them, not their internals. |
| **Browser rendering engine behavior** (CSS layout algorithms, font rendering, scroll behavior) | Not within our control. We test visual output through Playwright screenshots and manual review. |
| **Network conditions** (latency, offline mode, slow connections) | The application is a static site with no runtime network requests. Once loaded, it works offline. |
| **Server-side rendering** | The application uses `output: 'export'` (static site generation). There is no SSR. Server components are rendered at build time only. |
| **Content correctness** (factual accuracy of lesson text, technical accuracy of Claude Code commands) | Content review is a manual editorial process, not an automated test. |
| **Build tool configuration** (PostCSS, ESLint internals, TypeScript compiler behavior) | These tools are well-tested by their maintainers. We verify they work by running `npm run build` and `npm run lint`. |

---

## 3. Entry and Exit Criteria

### 3.1 Entry Criteria

Testing can begin when all of the following are true:

- [ ] TypeScript compilation succeeds with zero errors (`npx tsc --noEmit`)
- [ ] Production build succeeds without errors (`npm run build`)
- [ ] ESLint passes with no errors (`npm run lint`)
- [ ] Development server starts and all routes load (`npm run dev`)
- [ ] All test dependencies are installed (Vitest, React Testing Library, Playwright)
- [ ] Test configuration files are in place (`vitest.config.ts`, `playwright.config.ts`)
- [ ] All content for the module under test exists (MDX files and `_module.json`)

### 3.2 Exit Criteria

Testing is complete when all of the following are true:

- [ ] All unit tests pass (zero failures)
- [ ] Unit test line coverage >= 80% for `src/lib/` files
- [ ] All component tests pass (zero failures)
- [ ] Component test line coverage >= 70% for `src/components/` files
- [ ] All E2E critical path tests pass (zero failures)
- [ ] All E2E accessibility tests pass (zero axe-core violations)
- [ ] Lighthouse scores >= 95 on Performance, Accessibility, Best Practices, and SEO
- [ ] No P1 (critical) or P2 (high) bugs remain open
- [ ] All P3 (medium) bugs are either fixed or documented with rationale for deferral
- [ ] Test results are documented and archived

### 3.3 Suspension and Resumption Criteria

**Suspension:** Testing is paused if:

- A blocker bug prevents the build from completing
- A dependency upgrade introduces breaking changes requiring code modifications
- Content changes invalidate a significant number of test fixtures

**Resumption:** Testing resumes when:

- The blocking issue is resolved
- The codebase builds and all previously passing tests still pass
- Test fixtures are updated to reflect content changes

---

## 4. Risk Assessment

### 4.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| **localStorage unavailable** (private browsing, storage quota exceeded, user disabled storage) | Medium | Medium | Implement a fallback to in-memory state. The application should function without persistence; progress is simply not saved. Zustand's `persist` middleware has error handling for storage failures. |
| **MDX parsing errors** (malformed frontmatter, unsupported syntax, component import failures) | Low | High | All MDX content is parsed at build time. Parsing errors fail the build, preventing deployment. A CI build step catches these errors before they reach production. |
| **Large content files slowing build** (70+ MDX files with embedded data) | Low | Low | Next.js supports incremental builds. Content files are typically under 50KB each. Total content volume is under 5MB. Build caching mitigates repeat builds. |
| **Zustand hydration mismatch** (server-rendered HTML differs from client state) | Medium | Low | Client-only components (those using the progress store) are marked with `"use client"` and use hydration guards (`mounted` state). The ProgressDashboard component shows a loading skeleton until hydration completes. |
| **Framer Motion animation interference with tests** | Medium | Medium | Disable Framer Motion's `LazyMotion` in test environment by mocking the `framer-motion` module to render children immediately without animation. |
| **Playwright flaky tests** (timing-dependent assertions, animation delays) | Medium | Medium | Use Playwright's built-in auto-waiting. Avoid hard `waitForTimeout` calls. Use `toBeVisible()` and `toHaveText()` assertions that auto-retry. Set reasonable timeout values. |
| **Search index stale** (hardcoded LESSON_DATA array in SearchDialog does not match actual content) | High | Low | The current search uses a hardcoded array. Future implementation should generate the search index at build time from actual content. For now, tests verify the search UI behavior, not content accuracy. |
| **Browser compatibility** (CSS custom properties, CSS Nesting, newer APIs) | Low | Medium | The tech stack targets Chrome 90+, Firefox 90+, Safari 15+, Edge 90+. All CSS features used (custom properties, flexbox, grid, logical properties) are well-supported. Playwright tests run on Chromium, Firefox, and WebKit. |

### 4.2 Process Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| **Content changes invalidate tests** | High | Medium | E2E tests should assert on structure (headings exist, links work) not specific content text. Content-specific assertions should use data-testid attributes where possible. |
| **Test maintenance burden** | Medium | Medium | Follow testing best practices: test behavior not implementation, use page object models for Playwright, keep test utilities DRY. |
| **Missing test coverage for edge cases** | Medium | Low | Use coverage reports to identify untested code paths. Prioritize testing error handling and boundary conditions. |

---

## 5. Test Environment

### 5.1 Local Development

- **OS:** macOS 14+ (primary), Linux (CI), Windows (secondary support)
- **Node.js:** 20 LTS
- **Package Manager:** npm (as specified in `package-lock.json`)
- **Browsers (Playwright):** Chromium (latest), Firefox (latest), WebKit (latest)
- **Resolution:** Tests run at default viewport (1280x720) unless a specific viewport is specified

### 5.2 CI Environment (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npx vitest run --coverage
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            coverage/
            playwright-report/
            test-results/
```

### 5.3 Test Data

- **Content fixtures:** Minimal `_module.json` and `.mdx` files in `src/__tests__/fixtures/content/` for testing the content loader without depending on actual content.
- **Store fixtures:** Pre-populated Zustand state objects for testing store actions with known starting conditions.
- **Quiz fixtures:** Sample `QuizQuestion[]` arrays for testing the Quiz component.
- **Terminal fixtures:** Sample `TerminalStep[]` arrays for testing the TerminalSimulator component.

---

## 6. Defect Management

### 6.1 Severity Levels

| Level | Name | Definition | Example |
|-------|------|-----------|---------|
| P1 | Critical | Application crashes or a core feature is completely broken. No workaround. | Build fails, lesson pages 404, progress data lost |
| P2 | High | A major feature does not work correctly but a workaround exists. | Quiz scoring incorrect, search returns wrong results |
| P3 | Medium | A minor feature does not work or a cosmetic issue affects usability. | Breadcrumb shows wrong path, animation jitters on mobile |
| P4 | Low | Cosmetic issue with no impact on functionality. | Slight misalignment, color slightly off from spec |

### 6.2 Defect Workflow

1. **Discovered** -- Tester finds the bug and creates an issue with: steps to reproduce, expected behavior, actual behavior, severity, screenshots/recordings if applicable.
2. **Triaged** -- Developer reviews and assigns severity. P1/P2 bugs block release; P3/P4 can be deferred.
3. **Fixed** -- Developer implements the fix and writes a regression test.
4. **Verified** -- Tester confirms the fix works and the regression test passes.
5. **Closed** -- Issue is closed after verification.

### 6.3 Regression Testing

When a bug is fixed, a corresponding test case is added to prevent regression. The test is named to describe the bug scenario (e.g., "quiz score should not count unanswered questions as correct"). All regression tests run as part of the regular test suite.
