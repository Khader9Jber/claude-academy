# Master Test Plan

## Claude Academy Learning Platform

**Document Version:** 3.0
**Date:** 2026-04-05
**Status:** Active (Phase 7 Complete + v0.2.0 Feature Coverage)

---

## Table of Contents

1. [Test Strategy](#1-test-strategy)
2. [Test Scope](#2-test-scope)
3. [Entry and Exit Criteria](#3-entry-and-exit-criteria)
4. [Risk Assessment](#4-risk-assessment)
5. [Test Environment](#5-test-environment)
6. [Defect Management](#6-defect-management)
7. [E2E Testing Strategy](#7-e2e-testing-strategy)
8. [Testing Standards](#8-testing-standards)
9. [CI Integration](#9-ci-integration)

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

---

## 7. E2E Testing Strategy

### 7.1 Overview

End-to-end tests are implemented with Playwright and validate complete user flows across the application. The E2E suite covers 36 tests across 6 test files, running on both desktop (Chromium) and mobile (Pixel 7) viewports.

### 7.2 Page Object Model (POM)

All E2E tests use the Page Object Model pattern. Each page in the application has a corresponding page object class in `e2e/pages/` that encapsulates:

- **Locators**: Element selectors defined as class properties using `page.getByTestId()`
- **Actions**: Methods that perform user interactions (e.g., `clickStartLearning()`, `markAsComplete()`)
- **Assertions**: Helper methods for common checks (e.g., `isHeroVisible()`)

**Why POM?**

1. **Maintainability**: When the UI changes, only the page object needs updating -- not every test that uses that element
2. **Reusability**: Multiple tests share the same page object, reducing duplication
3. **Readability**: Tests read like user stories (`landing.clickStartLearning()` instead of `page.click('[data-testid="start-learning-btn"]')`)

**Class hierarchy:**

```
BasePage (shared: header, footer, logo, navigation methods, theme toggle, auth state)
├── LandingPage (hero, stats, arc cards, CTA)
├── CurriculumPage (module cards, arc sections)
├── ModulePage (module title, lesson items)
├── LessonPage (lesson title, mark complete, completed indicator)
├── PromptLabPage (heading, templates, category filters)
├── CheatsheetPage (search input, category tabs)
├── TemplatesPage (template cards, code blocks)
├── ProgressPage (heading, stats, reset, confirm)
├── LeaderboardPage (heading, ranking table/list)
├── CertificatePage (arc title, locked/unlocked state, download)
└── ProfilePage (display name, avatar, settings)
```

All page objects are re-exported through a barrel file (`e2e/pages/index.ts`) for clean imports in test files.

### 7.3 Test Suite Summary

| Suite | File | Tests | Coverage |
|-------|------|-------|----------|
| Navigation E2E | `e2e/navigation.spec.ts` | 12 | Landing page, curriculum, module, lesson, header nav, footer |
| Progress Tracking E2E | `e2e/progress.spec.ts` | 6 | Mark complete, persistence, dashboard, reset |
| Prompt Lab E2E | `e2e/prompt-lab.spec.ts` | 5 | Page load, templates, category filters, before/after |
| Cheatsheet E2E | `e2e/cheatsheet.spec.ts` | 4 | Search, category tabs |
| Templates E2E | `e2e/templates.spec.ts` | 4 | Template cards, copy buttons, category filters, code blocks |
| Responsive Design E2E | `e2e/responsive.spec.ts` | 5 | Mobile landing, hamburger menu, tablet curriculum, desktop lesson, mobile scrolling |
| Auth Pages E2E | `e2e/auth.spec.ts` | 6 | Login form, signup form, OAuth buttons, header sign-in state |
| Leaderboard E2E | `e2e/leaderboard.spec.ts` | 4 | Page load, heading, ranking structure, public access |
| Certificate E2E | `e2e/certificate.spec.ts` | 6 | All 5 arc certificate pages load, locked state display |
| Theme E2E | `e2e/theme.spec.ts` | 4 | Default dark mode, toggle visibility, class switching, persistence |
| Profile E2E | `e2e/profile.spec.ts` | 1 | Unauthenticated redirect to login |
| **Total** | **11 files** | **57** | **All pages, critical user flows, and v0.2.0 features** |

### 7.4 Viewport Strategy

Tests run on two Playwright projects:

| Project | Device | Viewport | Tests |
|---------|--------|----------|-------|
| `chromium` | Desktop Chrome | 1280x720 | All 36 tests |
| `mobile` | Pixel 7 | 412x915 | All 36 tests (some skipped when not applicable, e.g., desktop-only nav) |

The responsive test suite (`responsive.spec.ts`) explicitly sets viewports to test at 375px (mobile), 768px (tablet), and 1280px (desktop).

---

## 8. Testing Standards

### 8.1 data-testid Convention

All key interactive and structural elements have `data-testid` attributes. This is the primary locator strategy for E2E tests.

**Rules:**

- Every element that an E2E test needs to interact with or assert on must have a `data-testid`
- Use kebab-case: `data-testid="hero-heading"`
- Use dynamic suffixes for collections: `data-testid={`module-card-${slug}`}`
- Page object locators use `page.getByTestId()` exclusively
- `data-testid` attributes exist solely for testing and must not be used for styling

**Benefits over other selector strategies:**

| Strategy | Stability | Decoupling | Clarity |
|----------|-----------|------------|---------|
| CSS class selectors | Low (break on redesign) | Low | Medium |
| Text selectors | Low (break on copy changes) | Low | High |
| XPath | Low (break on DOM restructure) | Low | Low |
| **data-testid** | **High** | **High** | **High** |

### 8.2 Coverage Thresholds

Coverage enforcement is configured in `vitest.config.ts` with the following thresholds for `src/lib/` files:

| Metric | Threshold | Current |
|--------|-----------|---------|
| Statements | 90% | 97% |
| Branches | 70% | Passing |
| Functions | 90% | 100% |
| Lines | 90% | 97% |

Coverage is measured by the `v8` provider and reported in text, JSON summary, and HTML formats. The `coverage/` directory is uploaded as a CI artifact.

**Files under coverage enforcement:**

- `src/lib/utils.ts`
- `src/lib/progress-store.ts`

### 8.3 Test Naming Conventions

- Unit tests: `describe('functionName')` > `it('should do expected behavior')`
- E2E tests: `test.describe('Feature Area')` > `test('user-facing behavior description')`
- Test files: `*.test.ts(x)` for unit/component, `*.spec.ts` for E2E

---

## 9. CI Integration

### 9.1 Pipeline Position

E2E tests run as part of the CI workflow (`.github/workflows/ci.yml`) after lint, typecheck, and unit tests pass:

```
lint ──────────┐
typecheck ─────┼──► E2E Tests (Playwright) ──► Build
unit tests ────┘
```

### 9.2 CI Configuration

- **Browser**: Chromium only (installed via `npx playwright install chromium --with-deps`)
- **Retries**: 2 retries in CI (`process.env.CI ? 2 : 0`)
- **Workers**: 1 worker in CI for deterministic results
- **Reporter**: HTML report (open: never) + GitHub reporter for inline annotations
- **Screenshots**: Captured on failure only
- **Traces**: Captured on first retry

### 9.3 Artifacts Uploaded

| Artifact | Condition | Retention | Path |
|----------|-----------|-----------|------|
| `playwright-report` | Always | 30 days | `playwright-report/` |
| `e2e-screenshots` | On failure | 7 days | `test-results/` |
| `coverage-report` | Always | 30 days | `coverage/` |

### 9.4 Deploy Gate

The deploy workflow (`.github/workflows/deploy.yml`) includes a CI gate job that runs lint, typecheck, and unit tests before allowing deployment. E2E tests run in the CI workflow but are not a direct blocker for deployment (they run in parallel via the `ci.yml` workflow). Both workflows trigger on push to `main`, ensuring E2E failures are visible before the next deploy cycle.

---

## 10. Authentication Testing Strategy

### 10.1 Overview

Authentication testing covers the Supabase Auth integration, including email/password login, OAuth redirects, session persistence, and graceful degradation when Supabase is not configured.

### 10.2 Login Flow Testing

| Test Case | Type | What to Test |
|-----------|------|-------------|
| Email/password login | E2E | Enter valid credentials, verify redirect to home, verify user menu appears in header |
| Email/password signup | E2E | Enter new email/password, verify account creation, verify auto-profile creation |
| Invalid credentials | E2E | Enter wrong password, verify error message displayed, verify no redirect |
| Empty form submission | E2E | Submit login form with empty fields, verify validation errors |
| Login page rendering | E2E | Verify login form elements present via `data-testid` attributes |
| Signup page rendering | E2E | Verify signup form elements present via `data-testid` attributes |

### 10.3 OAuth Redirect Testing

| Test Case | Type | What to Test |
|-----------|------|-------------|
| Google OAuth button | E2E | Click Google button, verify redirect to Google OAuth URL |
| GitHub OAuth button | E2E | Click GitHub button, verify redirect to GitHub OAuth URL |
| OAuth callback | Integration | Verify `/auth/callback` route processes the code and creates a session |
| OAuth error handling | E2E | Verify graceful error display when OAuth fails or is cancelled |

### 10.4 Session Persistence Testing

| Test Case | Type | What to Test |
|-----------|------|-------------|
| Session survives refresh | E2E | Log in, refresh page, verify user is still logged in (header shows user menu) |
| Session survives navigation | E2E | Log in, navigate to multiple pages, verify session persists |
| Sign out | E2E | Click sign out, verify redirect to home, verify "Sign In" button reappears |
| Expired session | Integration | Verify expired session redirects to login gracefully |

### 10.5 Graceful Degradation Testing

| Test Case | Type | What to Test |
|-----------|------|-------------|
| No Supabase env vars | Unit | Remove Supabase env vars, verify site loads without errors |
| Auth UI hidden without Supabase | E2E | Without Supabase env vars, verify "Sign In" button is not rendered |
| Guest progress works | E2E | Without auth, verify lesson completion saves to localStorage |
| Content accessible without login | E2E | Verify all content pages load for unauthenticated users |

---

## 11. Database Testing Strategy

### 11.1 Overview

Database testing validates Row Level Security (RLS) policies, data isolation between users, and correct behavior of database triggers and views.

### 11.2 RLS Policy Testing

| Test Case | Table | What to Test |
|-----------|-------|-------------|
| User reads own progress | `user_progress` | Authenticated user can SELECT their own row |
| User cannot read other progress | `user_progress` | Authenticated user gets empty result when querying another user's ID |
| User writes own progress | `user_progress` | Authenticated user can INSERT/UPDATE their own row |
| User cannot write other progress | `user_progress` | Authenticated user gets RLS error when inserting with a different user_id |
| User reads own profile | `profiles` | Authenticated user can SELECT their own profile |
| User updates own profile | `profiles` | Authenticated user can UPDATE their own display_name |
| User cannot update other profile | `profiles` | Authenticated user gets RLS error when updating another user's profile |
| User reads own certificates | `certificates` | Authenticated user can SELECT their own certificates |
| User cannot delete other certificates | `certificates` | Authenticated user gets RLS error when deleting another user's certificate |
| Leaderboard is publicly readable | `leaderboard` | Unauthenticated request can SELECT from leaderboard view |
| Anonymous cannot write | All tables | Anonymous user gets RLS error on INSERT/UPDATE/DELETE |

### 11.3 Data Isolation Testing

| Test Case | What to Test |
|-----------|-------------|
| User A's progress invisible to User B | Create progress for User A, query as User B, verify empty result |
| User A's scores invisible to User B | Create quiz scores for User A, query as User B, verify empty result |
| Profile auto-creation | Create a new auth user, verify `profiles` row is auto-created via trigger |
| Cascade delete | Delete an auth user, verify all related rows in `user_progress`, `completed_lessons`, `quiz_scores`, `certificates`, and `user_settings` are deleted |

### 11.4 Leaderboard View Testing

| Test Case | What to Test |
|-----------|-------------|
| Correct ranking | Create multiple users with different lesson counts, verify leaderboard sorts by total completed |
| New completions reflected | User completes a lesson, verify leaderboard updates |
| Display name shown | User sets display name, verify it appears in leaderboard |

---

## 12. Authentication Testing

### 12.1 Overview

Authentication testing validates the full Supabase Auth integration at both unit and E2E levels. Tests cover the Supabase client configuration, the AuthProvider React context, login/signup page rendering, OAuth button presence, and header auth state.

### 12.2 Unit Coverage

| Area | Suite | Test Count | What Is Tested |
|------|-------|------------|----------------|
| Supabase Client | Suite 19 | 4 | `isSupabaseConfigured()` with and without env vars, `createClient()` success and graceful failure |
| Auth Provider | Suite 21 | 4 | Renders children, provides null user when unauthenticated, loading state, `useAuth()` hook shape |

### 12.3 E2E Coverage

| Area | Suite | Test Count | What Is Tested |
|------|-------|------------|----------------|
| Auth Pages | Suite 23 | 6 | Login form fields, signup form fields, OAuth buttons, cross-links between login/signup, header "Sign In" button |
| Profile | Suite 27 | 1 | Unauthenticated redirect to login |

### 12.4 Graceful Degradation

When Supabase environment variables are not configured, the site operates as a fully static application. Suite 19 (TC-SC-001, TC-SC-004) explicitly validates that missing env vars do not cause crashes. E2E tests for content pages (Suites 10-15) implicitly verify that all content remains accessible without authentication.

---

## 13. Theme Testing

### 13.1 Overview

Theme testing covers the light/dark mode toggle introduced in v0.2.0. The application defaults to dark mode and supports class-based theme switching via `next-themes`.

### 13.2 Component Coverage

| Area | Suite | Test Count | What Is Tested |
|------|-------|------------|----------------|
| ThemeToggle | Suite 22 | 2 | Renders without crashing, shows correct icon per theme |

### 13.3 E2E Coverage

| Area | Suite | Test Count | What Is Tested |
|------|-------|------------|----------------|
| Theme Toggling | Suite 26 | 4 | Default dark mode, toggle button visibility, html class switching, localStorage persistence |

### 13.4 Theme Invariants

Code blocks and terminal components remain dark-themed in both light and dark modes. This is validated by visual inspection rather than automated tests, as the CSS is scoped to those components independently.

---

## 14. New Feature Coverage (v0.2.0)

### 14.1 Summary

v0.2.0 introduced 6 major features. The following table maps each feature to its test suites:

| Feature | Unit Suites | Component Suites | E2E Suites | Total Tests |
|---------|-------------|------------------|------------|-------------|
| Supabase Auth | Suite 19 (4) | Suite 21 (4) | Suite 23 (6) | 14 |
| Light/Dark Mode | -- | Suite 22 (2) | Suite 26 (4) | 6 |
| Leaderboard | -- | -- | Suite 24 (4) | 4 |
| Profile | -- | -- | Suite 27 (1) | 1 |
| Certificates | -- | -- | Suite 25 (6) | 6 |
| Constants Validation | Suite 20 (5) | -- | -- | 5 |
| **Totals** | **9** | **6** | **21** | **36** |

### 14.2 Files Under Test

| Source File | Test Suite(s) |
|-------------|---------------|
| `src/lib/supabase/client.ts` | Suite 19 |
| `src/lib/constants.ts` | Suite 20 |
| `src/components/auth/auth-provider.tsx` | Suite 21 |
| `src/components/layout/theme-toggle.tsx` | Suite 22 |
| `src/app/auth/login/page.tsx` | Suite 23 |
| `src/app/auth/signup/page.tsx` | Suite 23 |
| `src/app/leaderboard/page.tsx` | Suite 24 |
| `src/app/certificate/[type]/page.tsx` | Suite 25 |
| `src/app/profile/page.tsx` | Suite 27 |

### 14.3 Overall Test Count

| Version | Unit | Component | E2E | Total |
|---------|------|-----------|-----|-------|
| v0.1.0 | 46 (Suites 1-3) | 0 (Suites 4-9 planned) | 36 (Suites 10-15) | 82 |
| v0.2.0 additions | 9 (Suites 19-20) | 6 (Suites 21-22) | 21 (Suites 23-27) | 36 |
| **Combined** | **55** | **6** | **57** | **118** |
