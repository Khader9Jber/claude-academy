# Test Suites and Test Cases

## Claude Academy Learning Platform

**Document Version:** 1.0
**Date:** 2026-04-04
**Status:** Draft (all test cases at "Not Run")

---

## Table of Contents

1. [Suite 1: Utility Functions (Unit)](#suite-1-utility-functions-unit)
2. [Suite 2: Progress Store (Unit)](#suite-2-progress-store-unit)
3. [Suite 3: Content Loader (Unit)](#suite-3-content-loader-unit)
4. [Suite 4: Quiz Component (Component)](#suite-4-quiz-component-component)
5. [Suite 5: FillInBlank Component (Component)](#suite-5-fillinblank-component-component)
6. [Suite 6: TerminalSimulator Component (Component)](#suite-6-terminalsimulator-component-component)
7. [Suite 7: Navigation (Component)](#suite-7-navigation-component)
8. [Suite 8: Progress Components (Component)](#suite-8-progress-components-component)
9. [Suite 9: Search (Component)](#suite-9-search-component)
10. [Suite 10: Pages (E2E)](#suite-10-pages-e2e)
11. [Suite 11: Accessibility (E2E)](#suite-11-accessibility-e2e)
12. [Suite 12: Performance (E2E)](#suite-12-performance-e2e)

---

## Suite 1: Utility Functions (Unit)

**File:** `src/__tests__/lib/utils.test.ts`
**Target:** `src/lib/utils.ts`
**Tool:** Vitest

### TC-U-001: cn() merges class names correctly

| Field | Value |
|-------|-------|
| **ID** | TC-U-001 |
| **Description** | The `cn()` function merges multiple class name strings into a single string |
| **Preconditions** | None |
| **Steps** | 1. Call `cn("text-sm", "font-bold")` |
| **Expected Result** | Returns `"text-sm font-bold"` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-U-002: cn() handles conditional classes

| Field | Value |
|-------|-------|
| **ID** | TC-U-002 |
| **Description** | The `cn()` function includes classes conditionally based on boolean values |
| **Preconditions** | None |
| **Steps** | 1. Call `cn("base", true && "active", false && "hidden")` |
| **Expected Result** | Returns `"base active"` (the `false` condition is excluded) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-U-003: cn() resolves Tailwind conflicts via tailwind-merge

| Field | Value |
|-------|-------|
| **ID** | TC-U-003 |
| **Description** | The `cn()` function uses `tailwind-merge` to resolve conflicting Tailwind classes, with later classes taking precedence |
| **Preconditions** | None |
| **Steps** | 1. Call `cn("px-4 py-2", "px-6")` |
| **Expected Result** | Returns `"py-2 px-6"` (px-4 is overridden by px-6) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-U-004: slugify() converts "Hello World" to "hello-world"

| Field | Value |
|-------|-------|
| **ID** | TC-U-004 |
| **Description** | The `slugify()` function converts a normal string to a URL-safe lowercase slug |
| **Preconditions** | None |
| **Steps** | 1. Call `slugify("Hello World")` |
| **Expected Result** | Returns `"hello-world"` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-U-005: slugify() handles special characters

| Field | Value |
|-------|-------|
| **ID** | TC-U-005 |
| **Description** | The `slugify()` function removes special characters and normalizes whitespace |
| **Preconditions** | None |
| **Steps** | 1. Call `slugify("What is Claude? (An Overview)")` |
| **Expected Result** | Returns `"what-is-claude-an-overview"` |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-U-006: slugify() handles empty string

| Field | Value |
|-------|-------|
| **ID** | TC-U-006 |
| **Description** | The `slugify()` function returns an empty string when given an empty string |
| **Preconditions** | None |
| **Steps** | 1. Call `slugify("")` |
| **Expected Result** | Returns `""` |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-U-007: formatDuration() formats 5 minutes

| Field | Value |
|-------|-------|
| **ID** | TC-U-007 |
| **Description** | The `formatDuration()` function formats a duration under 60 minutes as "X min" |
| **Preconditions** | None |
| **Steps** | 1. Call `formatDuration(5)` |
| **Expected Result** | Returns `"5 min"` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-U-008: formatDuration() formats 90 minutes

| Field | Value |
|-------|-------|
| **ID** | TC-U-008 |
| **Description** | The `formatDuration()` function formats a duration of 90 minutes as hours and remaining minutes |
| **Preconditions** | None |
| **Steps** | 1. Call `formatDuration(90)` |
| **Expected Result** | Returns `"1h 30m"` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-U-009: formatDuration() formats 0 minutes

| Field | Value |
|-------|-------|
| **ID** | TC-U-009 |
| **Description** | The `formatDuration()` function formats zero minutes correctly |
| **Preconditions** | None |
| **Steps** | 1. Call `formatDuration(0)` |
| **Expected Result** | Returns `"0 min"` |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-U-010: formatDuration() formats exact hours

| Field | Value |
|-------|-------|
| **ID** | TC-U-010 |
| **Description** | The `formatDuration()` function formats an exact hour value without remaining minutes |
| **Preconditions** | None |
| **Steps** | 1. Call `formatDuration(120)` |
| **Expected Result** | Returns `"2h"` |
| **Priority** | P2 |
| **Status** | Not Run |

---

## Suite 2: Progress Store (Unit)

**File:** `src/__tests__/lib/progress-store.test.ts`
**Target:** `src/lib/progress-store.ts`
**Tool:** Vitest

### TC-PS-001: Initial state has empty completedLessons

| Field | Value |
|-------|-------|
| **ID** | TC-PS-001 |
| **Description** | A fresh progress store has an empty `completedLessons` array |
| **Preconditions** | Store is freshly created (no localStorage data) |
| **Steps** | 1. Create a new store instance 2. Access `completedLessons` |
| **Expected Result** | `completedLessons` is `[]` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-002: markLessonComplete adds lesson slug to completedLessons

| Field | Value |
|-------|-------|
| **ID** | TC-PS-002 |
| **Description** | Calling `markLessonComplete` with a lesson ID adds it to the `completedLessons` array |
| **Preconditions** | Store is in initial state |
| **Steps** | 1. Call `markLessonComplete("claude-fundamentals/what-is-claude")` 2. Check `completedLessons` |
| **Expected Result** | `completedLessons` contains `["claude-fundamentals/what-is-claude"]` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-003: markLessonComplete does not duplicate already-completed lessons

| Field | Value |
|-------|-------|
| **ID** | TC-PS-003 |
| **Description** | Calling `markLessonComplete` with an already-completed lesson ID does not add a duplicate |
| **Preconditions** | Store has `completedLessons: ["mod/lesson"]` |
| **Steps** | 1. Call `markLessonComplete("mod/lesson")` again 2. Check `completedLessons` |
| **Expected Result** | `completedLessons` still contains exactly `["mod/lesson"]` (length 1) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-004: saveQuizScore stores score with correct quizId

| Field | Value |
|-------|-------|
| **ID** | TC-PS-004 |
| **Description** | Calling `saveQuizScore` stores the score, total, and bestScore for the given quiz |
| **Preconditions** | Store is in initial state |
| **Steps** | 1. Call `saveQuizScore("quiz-01", 80, 100)` 2. Check `quizScores["quiz-01"]` |
| **Expected Result** | `quizScores["quiz-01"]` is `{ score: 80, total: 100, bestScore: 80 }` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-005: saveQuizScore updates bestScore when new score is higher

| Field | Value |
|-------|-------|
| **ID** | TC-PS-005 |
| **Description** | Calling `saveQuizScore` with a higher score updates `bestScore` to the new value |
| **Preconditions** | Store has `quizScores["quiz-01"]: { score: 60, total: 100, bestScore: 60 }` |
| **Steps** | 1. Call `saveQuizScore("quiz-01", 90, 100)` 2. Check `quizScores["quiz-01"].bestScore` |
| **Expected Result** | `bestScore` is `90` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-006: saveQuizScore keeps bestScore when new score is lower

| Field | Value |
|-------|-------|
| **ID** | TC-PS-006 |
| **Description** | Calling `saveQuizScore` with a lower score keeps `bestScore` at its previous value |
| **Preconditions** | Store has `quizScores["quiz-01"]: { score: 90, total: 100, bestScore: 90 }` |
| **Steps** | 1. Call `saveQuizScore("quiz-01", 70, 100)` 2. Check `quizScores["quiz-01"]` |
| **Expected Result** | `score` is `70` but `bestScore` remains `90` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-007: markExerciseComplete adds exercise to completedExercises

| Field | Value |
|-------|-------|
| **ID** | TC-PS-007 |
| **Description** | Calling `markExerciseComplete` adds the exercise ID to the array |
| **Preconditions** | Store is in initial state |
| **Steps** | 1. Call `markExerciseComplete("exercise-01")` 2. Check `completedExercises` |
| **Expected Result** | `completedExercises` contains `["exercise-01"]` |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-PS-008: recordActivity adds today's date to activeDays

| Field | Value |
|-------|-------|
| **ID** | TC-PS-008 |
| **Description** | Calling `recordActivity` adds today's ISO date string to `activeDays` |
| **Preconditions** | Store is in initial state with empty `activeDays` |
| **Steps** | 1. Call `recordActivity()` 2. Check `activeDays` |
| **Expected Result** | `activeDays` contains today's date in `YYYY-MM-DD` format |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-009: recordActivity calculates currentStreak correctly for consecutive days

| Field | Value |
|-------|-------|
| **ID** | TC-PS-009 |
| **Description** | When activity is recorded on consecutive days, `currentStreak` increments correctly |
| **Preconditions** | Store has `activeDays` containing yesterday's date and today's date |
| **Steps** | 1. Pre-populate `activeDays` with yesterday and the day before 2. Call `recordActivity()` for today 3. Check `currentStreak` |
| **Expected Result** | `currentStreak` is `3` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-010: recordActivity resets currentStreak after a gap day

| Field | Value |
|-------|-------|
| **ID** | TC-PS-010 |
| **Description** | When activity is recorded after a gap of 2+ days, `currentStreak` resets to 1 |
| **Preconditions** | Store has `activeDays` containing a date from 3 days ago (gap of 2 days) |
| **Steps** | 1. Pre-populate `activeDays` with a date from 3 days ago 2. Call `recordActivity()` for today 3. Check `currentStreak` |
| **Expected Result** | `currentStreak` is `1` (gap breaks the streak) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-011: recordActivity updates longestStreak when current exceeds longest

| Field | Value |
|-------|-------|
| **ID** | TC-PS-011 |
| **Description** | When `currentStreak` exceeds `longestStreak`, `longestStreak` is updated |
| **Preconditions** | Store has `longestStreak: 2` and today is the 3rd consecutive day |
| **Steps** | 1. Set up state with 2-day streak 2. Record activity on the 3rd consecutive day 3. Check `longestStreak` |
| **Expected Result** | `longestStreak` is `3` |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-PS-012: reset clears all state to initial values

| Field | Value |
|-------|-------|
| **ID** | TC-PS-012 |
| **Description** | Calling `reset()` returns all state fields to their initial values |
| **Preconditions** | Store has non-empty completedLessons, quizScores, streaks, etc. |
| **Steps** | 1. Populate store with various data 2. Call `reset()` 3. Check all state fields |
| **Expected Result** | `completedLessons: []`, `quizScores: {}`, `completedExercises: []`, `activeDays: []`, `currentStreak: 0`, `longestStreak: 0`, `unlockedAchievements: []`, `lastVisitedLesson: null` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-013: State persists to localStorage on change

| Field | Value |
|-------|-------|
| **ID** | TC-PS-013 |
| **Description** | When state changes, the new state is serialized to localStorage under the key `claude-academy-progress` |
| **Preconditions** | localStorage is available and empty |
| **Steps** | 1. Call `markLessonComplete("mod/lesson")` 2. Read `localStorage.getItem("claude-academy-progress")` 3. Parse the JSON |
| **Expected Result** | The parsed JSON contains `completedLessons` with `["mod/lesson"]` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PS-014: State rehydrates from localStorage on page load

| Field | Value |
|-------|-------|
| **ID** | TC-PS-014 |
| **Description** | When a new store instance is created with existing localStorage data, it rehydrates from that data |
| **Preconditions** | localStorage contains serialized state with `completedLessons: ["mod/lesson"]` |
| **Steps** | 1. Pre-populate localStorage with serialized state 2. Create a new store instance 3. Check `completedLessons` |
| **Expected Result** | `completedLessons` is `["mod/lesson"]` (rehydrated from storage) |
| **Priority** | P1 |
| **Status** | Not Run |

---

## Suite 3: Content Loader (Unit)

**File:** `src/__tests__/lib/content.test.ts`
**Target:** `src/lib/content.ts`
**Tool:** Vitest

### TC-CL-001: getModules() returns array of 13 modules

| Field | Value |
|-------|-------|
| **ID** | TC-CL-001 |
| **Description** | `getModules()` reads all module directories and returns exactly 13 modules |
| **Preconditions** | All 13 module directories exist with valid `_module.json` files |
| **Steps** | 1. Call `getModules()` 2. Check the length of the returned array |
| **Expected Result** | Array length is 13 |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-CL-002: getModules() returns modules sorted by order

| Field | Value |
|-------|-------|
| **ID** | TC-CL-002 |
| **Description** | The array returned by `getModules()` is sorted by the `order` field (1 through 13) |
| **Preconditions** | All 13 module directories exist |
| **Steps** | 1. Call `getModules()` 2. Extract the `order` field from each module 3. Verify the array is `[1, 2, 3, ..., 13]` |
| **Expected Result** | Orders are strictly ascending from 1 to 13 |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-CL-003: getModule() returns correct module by slug

| Field | Value |
|-------|-------|
| **ID** | TC-CL-003 |
| **Description** | `getModule("claude-fundamentals")` returns the module with that slug |
| **Preconditions** | Module `claude-fundamentals` exists |
| **Steps** | 1. Call `getModule("claude-fundamentals")` 2. Check the returned object |
| **Expected Result** | Returns a Module with `slug: "claude-fundamentals"`, `title: "Claude Fundamentals"`, `arc: "foundation"`, `order: 1` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-CL-004: getModule() returns null for non-existent slug

| Field | Value |
|-------|-------|
| **ID** | TC-CL-004 |
| **Description** | `getModule("does-not-exist")` returns null |
| **Preconditions** | No module with slug "does-not-exist" exists |
| **Steps** | 1. Call `getModule("does-not-exist")` |
| **Expected Result** | Returns `null` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-CL-005: getLesson() returns lesson with parsed frontmatter

| Field | Value |
|-------|-------|
| **ID** | TC-CL-005 |
| **Description** | `getLesson()` returns a Lesson object with all frontmatter fields correctly parsed |
| **Preconditions** | At least one lesson exists in the claude-fundamentals module |
| **Steps** | 1. Call `getLesson("claude-fundamentals", "what-is-claude")` 2. Check the returned object |
| **Expected Result** | Returns a Lesson with `slug`, `moduleSlug`, `title`, `order`, `difficulty`, `duration`, `tags`, and `objectives` fields populated from frontmatter |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-CL-006: getLesson() returns MDX content body

| Field | Value |
|-------|-------|
| **ID** | TC-CL-006 |
| **Description** | The `content` field of the returned Lesson contains the MDX body (everything after frontmatter) |
| **Preconditions** | The target lesson file has both frontmatter and content body |
| **Steps** | 1. Call `getLesson("claude-fundamentals", "what-is-claude")` 2. Check `content` is a non-empty string |
| **Expected Result** | `content` is a non-empty string containing Markdown/MDX content |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-CL-007: getAllLessons() returns flat array of all lessons

| Field | Value |
|-------|-------|
| **ID** | TC-CL-007 |
| **Description** | `getAllLessons()` returns every lesson from every module as a flat array |
| **Preconditions** | Content modules exist with lessons |
| **Steps** | 1. Call `getAllLessons()` 2. Verify the length matches the sum of all module lesson counts |
| **Expected Result** | Array contains one entry per lesson file across all modules |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-CL-008: Module metadata includes required fields

| Field | Value |
|-------|-------|
| **ID** | TC-CL-008 |
| **Description** | Every module returned by `getModules()` has all required fields: `title`, `slug`, `arc`, `order`, `description`, `icon`, `color`, `estimatedHours`, `prerequisites`, `lessons` |
| **Preconditions** | All modules exist |
| **Steps** | 1. Call `getModules()` 2. For each module, assert all required fields are present and non-null |
| **Expected Result** | All fields are present on every module |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-CL-009: Lesson frontmatter includes required fields

| Field | Value |
|-------|-------|
| **ID** | TC-CL-009 |
| **Description** | Every lesson returned has required fields: `title`, `slug`, `order`, `difficulty` |
| **Preconditions** | At least one module with lessons exists |
| **Steps** | 1. Call `getAllLessons()` 2. For each lesson, assert `title`, `slug`, `order`, and `difficulty` are present |
| **Expected Result** | All required fields are present on every lesson |
| **Priority** | P1 |
| **Status** | Not Run |

---

## Suite 4: Quiz Component (Component)

**File:** `src/__tests__/components/interactive/quiz.test.tsx`
**Target:** `src/components/interactive/quiz.tsx`
**Tool:** Vitest + React Testing Library

### TC-QZ-001: Quiz renders first question on mount

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-001 |
| **Description** | When the Quiz component mounts, it displays the first question's text |
| **Preconditions** | A `questions` array with at least 2 questions is provided |
| **Steps** | 1. Render `<Quiz questions={testQuestions} quizId="test-quiz" />` 2. Query for the question text |
| **Expected Result** | The first question's text is visible on screen |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-002: Quiz displays all answer options

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-002 |
| **Description** | All answer options for the current question are displayed as clickable buttons |
| **Preconditions** | Quiz is rendered with a question that has 4 options |
| **Steps** | 1. Render the Quiz 2. Query for all option buttons |
| **Expected Result** | 4 option buttons are visible, each showing the option text and a letter (A, B, C, D) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-003: Clicking correct answer shows green highlight

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-003 |
| **Description** | Clicking the correct answer option highlights it with green styling |
| **Preconditions** | Quiz is rendered, question has `correct: 2` (option C) |
| **Steps** | 1. Click the correct option (index 2) 2. Check the option's CSS classes |
| **Expected Result** | The clicked option has `border-green` and `bg-green/10` classes, and shows a CheckCircle icon |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-004: Clicking incorrect answer shows red highlight

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-004 |
| **Description** | Clicking an incorrect answer option highlights it with red styling and also shows the correct answer in green |
| **Preconditions** | Quiz is rendered, question has `correct: 2`, user clicks option 0 |
| **Steps** | 1. Click option 0 (incorrect) 2. Check CSS classes of clicked option and correct option |
| **Expected Result** | Option 0 has `border-red` and `bg-red/10` with XCircle icon. Option 2 has `border-green` and `bg-green/10` with CheckCircle icon. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-005: After answering, explanation text is revealed

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-005 |
| **Description** | After selecting any answer, the explanation for the question is shown |
| **Preconditions** | Quiz is rendered with a question that has `explanation: "The correct answer is..."` |
| **Steps** | 1. Click any option 2. Query for text "Explanation:" |
| **Expected Result** | An element containing "Explanation:" and the explanation text is visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-006: "Next" button appears after answering

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-006 |
| **Description** | After answering a question (not the last), a "Next Question" button appears |
| **Preconditions** | Quiz has 3 questions, currently on question 1 |
| **Steps** | 1. Click an option 2. Query for button with text "Next Question" |
| **Expected Result** | A button with text "Next Question" is visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-007: Quiz progresses through all questions

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-007 |
| **Description** | Clicking "Next Question" advances to the next question |
| **Preconditions** | Quiz has 3 questions, question 1 is answered |
| **Steps** | 1. Answer question 1 2. Click "Next Question" 3. Verify question 2 text is displayed 4. Check the progress indicator shows "Question 2 of 3" |
| **Expected Result** | Question 2 text and "Question 2 of 3" are visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-008: Quiz shows score summary after last question

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-008 |
| **Description** | After answering the last question and clicking "See Results", the score summary screen is displayed |
| **Preconditions** | Quiz has 2 questions, both are answered correctly |
| **Steps** | 1. Answer question 1 correctly, click "Next Question" 2. Answer question 2 correctly, click "See Results" 3. Query for "Quiz Complete" text |
| **Expected Result** | Score summary screen is visible with "Quiz Complete" heading and percentage display |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-009: Score shows "X out of Y correct"

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-009 |
| **Description** | The score summary shows the exact count of correct answers out of total |
| **Preconditions** | Quiz with 3 questions, user got 2 correct |
| **Steps** | 1. Complete the quiz with 2 correct answers 2. Check score summary text |
| **Expected Result** | Text "You got 2 out of 3 questions correct." is visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-010: "Retry" button resets quiz to first question

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-010 |
| **Description** | Clicking the "Retry Quiz" button on the score summary returns to the first question with a clean state |
| **Preconditions** | Quiz is showing score summary screen |
| **Steps** | 1. Click "Retry Quiz" 2. Verify first question text is displayed 3. Verify "Question 1 of N" indicator 4. Verify score is 0 |
| **Expected Result** | First question is displayed, score reads 0, all answers are unselected |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-011: Quiz saves score to progress store on completion

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-011 |
| **Description** | When the quiz finishes, `saveQuizScore` is called on the progress store with the correct quizId and percentage |
| **Preconditions** | Progress store is mocked or observed |
| **Steps** | 1. Complete a quiz with known score 2. Verify `saveQuizScore` was called with the quizId and computed percentage |
| **Expected Result** | `saveQuizScore` is called once with the correct arguments |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-QZ-012: Options are disabled after answering

| Field | Value |
|-------|-------|
| **ID** | TC-QZ-012 |
| **Description** | After selecting an answer, all option buttons become disabled to prevent changing the answer |
| **Preconditions** | Quiz is rendered with a question |
| **Steps** | 1. Click an option 2. Verify all options have the `disabled` attribute |
| **Expected Result** | All option buttons are disabled after an answer is selected |
| **Priority** | P2 |
| **Status** | Not Run |

---

## Suite 5: FillInBlank Component (Component)

**File:** `src/__tests__/components/interactive/fill-in-blank.test.tsx`
**Target:** `src/components/interactive/fill-in-blank.tsx`
**Tool:** Vitest + React Testing Library

### TC-FB-001: Renders template text with input fields at blank positions

| Field | Value |
|-------|-------|
| **ID** | TC-FB-001 |
| **Description** | The component renders the template text with `<input>` elements replacing `{{N}}` placeholders |
| **Preconditions** | Template is `"The command {{1}} starts a session"` with one blank |
| **Steps** | 1. Render the component 2. Verify text "The command" is visible 3. Verify an input element exists 4. Verify text "starts a session" is visible |
| **Expected Result** | Template text is rendered with an input field where `{{1}}` was |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-FB-002: Input accepts text entry

| Field | Value |
|-------|-------|
| **ID** | TC-FB-002 |
| **Description** | Users can type into the blank input fields |
| **Preconditions** | Component is rendered with one blank |
| **Steps** | 1. Find the input element 2. Type "claude" into it |
| **Expected Result** | Input value is "claude" |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-FB-003: "Check" validates correct answers with green checkmark

| Field | Value |
|-------|-------|
| **ID** | TC-FB-003 |
| **Description** | Clicking "Check" with the correct answer shows a green checkmark icon next to the input |
| **Preconditions** | Component has blank with `answer: "claude"`, user typed "claude" |
| **Steps** | 1. Type "claude" 2. Click "Check" button 3. Look for green checkmark icon |
| **Expected Result** | A Check icon (green) appears next to the input. Input has green border styling. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-FB-004: "Check" validates incorrect answers with red X

| Field | Value |
|-------|-------|
| **ID** | TC-FB-004 |
| **Description** | Clicking "Check" with an incorrect answer shows a red X icon next to the input |
| **Preconditions** | Component has blank with `answer: "claude"`, user typed "wrong" |
| **Steps** | 1. Type "wrong" 2. Click "Check" button 3. Look for red X icon |
| **Expected Result** | An X icon (red) appears next to the input. Input has red border styling. Error message "Some answers are incorrect" is visible. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-FB-005: Validation is case-insensitive

| Field | Value |
|-------|-------|
| **ID** | TC-FB-005 |
| **Description** | The answer check is case-insensitive: "Claude", "claude", "CLAUDE" all match |
| **Preconditions** | Component has blank with `answer: "claude"` |
| **Steps** | 1. Type "CLAUDE" 2. Click "Check" |
| **Expected Result** | Answer is marked as correct (green checkmark) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-FB-006: Accepts any of multiple valid answers

| Field | Value |
|-------|-------|
| **ID** | TC-FB-006 |
| **Description** | When a blank has multiple accepted answers, any of them is accepted |
| **Preconditions** | Component has blank with `answer: ["claude", "claude code"]` |
| **Steps** | 1. Type "claude code" 2. Click "Check" |
| **Expected Result** | Answer is marked as correct |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-FB-007: "Show Answers" reveals correct answers

| Field | Value |
|-------|-------|
| **ID** | TC-FB-007 |
| **Description** | Clicking "Show Answers" fills all inputs with the correct answer and marks them as correct |
| **Preconditions** | Component is rendered with blanks |
| **Steps** | 1. Click "Show Answers" button 2. Check input values and result indicators |
| **Expected Result** | All inputs contain the correct answer. All indicators show green checkmarks. Inputs are disabled. |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-FB-008: Hints display as input placeholders

| Field | Value |
|-------|-------|
| **ID** | TC-FB-008 |
| **Description** | When a blank has a `hint` property, it is shown as the input's placeholder text |
| **Preconditions** | Component has blank with `hint: "starts with 'c'"` |
| **Steps** | 1. Render the component 2. Check the input's placeholder attribute |
| **Expected Result** | Input placeholder is "starts with 'c'" |
| **Priority** | P2 |
| **Status** | Not Run |

---

## Suite 6: TerminalSimulator Component (Component)

**File:** `src/__tests__/components/interactive/terminal-simulator.test.tsx`
**Target:** `src/components/interactive/terminal-simulator.tsx`
**Tool:** Vitest + React Testing Library

### TC-TS-001: Renders terminal with prompt ($)

| Field | Value |
|-------|-------|
| **ID** | TC-TS-001 |
| **Description** | The terminal simulator displays a green `$` prompt character with an active input field |
| **Preconditions** | Component is rendered with at least one step |
| **Steps** | 1. Render `<TerminalSimulator steps={testSteps} />` 2. Look for `$` text and an input element |
| **Expected Result** | A `$` prompt and a text input are visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-TS-002: Accepts user input in command field

| Field | Value |
|-------|-------|
| **ID** | TC-TS-002 |
| **Description** | The user can type text into the command input field |
| **Preconditions** | Terminal is rendered and focused |
| **Steps** | 1. Type "claude --help" into the input 2. Check input value |
| **Expected Result** | Input value is "claude --help" |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-TS-003: Correct command shows simulated output

| Field | Value |
|-------|-------|
| **ID** | TC-TS-003 |
| **Description** | Submitting the correct command displays the step's simulated output |
| **Preconditions** | Step expects `"claude"` and has output `"Starting Claude Code..."` |
| **Steps** | 1. Type "claude" 2. Press Enter 3. Look for output text |
| **Expected Result** | "Starting Claude Code..." is visible in the terminal history |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-TS-004: Incorrect command shows error feedback

| Field | Value |
|-------|-------|
| **ID** | TC-TS-004 |
| **Description** | Submitting an incorrect command shows an error message in red |
| **Preconditions** | Step expects `"claude"`, user enters `"wrong"` |
| **Steps** | 1. Type "wrong" 2. Press Enter 3. Look for error text |
| **Expected Result** | "Command not recognized. Try again." is visible in red |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-TS-005: Hint appears after 2 wrong attempts

| Field | Value |
|-------|-------|
| **ID** | TC-TS-005 |
| **Description** | After 2 incorrect submissions on the same step, a hint is displayed in accent color |
| **Preconditions** | Step has `hint: "Try 'claude'"` |
| **Steps** | 1. Submit wrong command 2. Submit wrong command again 3. Look for hint text |
| **Expected Result** | "Hint: Try 'claude'" is visible in accent color |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-TS-006: Progresses to next step after correct command

| Field | Value |
|-------|-------|
| **ID** | TC-TS-006 |
| **Description** | After a correct command, the simulator advances to the next step and shows its prompt |
| **Preconditions** | 2 steps are provided |
| **Steps** | 1. Complete step 1 with the correct command 2. Check that step 2's instruction is displayed 3. Check the step counter shows "Step 2 / 2" |
| **Expected Result** | Step 2 instruction is visible, step counter reads "Step 2 / 2" |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-TS-007: Shows completion message after all steps

| Field | Value |
|-------|-------|
| **ID** | TC-TS-007 |
| **Description** | After completing the last step, a completion message is displayed and the input is removed |
| **Preconditions** | Simulator has 2 steps, both completed |
| **Steps** | 1. Complete all steps 2. Look for completion message 3. Verify input field is gone |
| **Expected Result** | "All steps completed! Great work." is visible. No input field is present. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-TS-008: Accepts command variations (case-insensitive match)

| Field | Value |
|-------|-------|
| **ID** | TC-TS-008 |
| **Description** | The terminal accepts alternative command spellings and case variations |
| **Preconditions** | Step expects `"claude"`, alternatives include `"Claude"` |
| **Steps** | 1. Type "Claude" (capitalized) 2. Press Enter |
| **Expected Result** | Command is accepted as correct (case-insensitive matching) |
| **Priority** | P2 |
| **Status** | Not Run |

---

## Suite 7: Navigation (Component)

**File:** `src/__tests__/components/layout/navigation.test.tsx`
**Target:** Multiple layout components
**Tool:** Vitest + React Testing Library

### TC-NAV-001: Breadcrumb renders correct path segments

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-001 |
| **Description** | The Breadcrumb component renders all provided path segments with separators |
| **Preconditions** | Breadcrumb items: `[{ label: "Curriculum", href: "/curriculum" }, { label: "Module 1" }]` |
| **Steps** | 1. Render `<Breadcrumb items={items} />` 2. Check for "Curriculum" and "Module 1" text |
| **Expected Result** | Both labels are visible with a separator between them |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-NAV-002: Breadcrumb last item is not a link

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-002 |
| **Description** | The last breadcrumb item is rendered as plain text, not as a link |
| **Preconditions** | Breadcrumb items: `[{ label: "Curriculum", href: "/curriculum" }, { label: "Module 1" }]` |
| **Steps** | 1. Render the breadcrumb 2. Verify "Curriculum" is an anchor tag 3. Verify "Module 1" is NOT an anchor tag |
| **Expected Result** | "Curriculum" is a link, "Module 1" is plain text |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-NAV-003: LessonNav shows "Previous" link when available

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-003 |
| **Description** | When there is a previous lesson, the lesson navigation shows a "Previous Lesson" link with the lesson title |
| **Preconditions** | Current lesson is not the first in the module |
| **Steps** | 1. Render lesson page for the second lesson 2. Check for "Previous Lesson" text and a link |
| **Expected Result** | "Previous Lesson" label and previous lesson title are visible as a link |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-NAV-004: LessonNav shows "Next" link when available

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-004 |
| **Description** | When there is a next lesson, the lesson navigation shows a "Next Lesson" link with the lesson title |
| **Preconditions** | Current lesson is not the last in the module |
| **Steps** | 1. Render lesson page for a middle lesson 2. Check for "Next Lesson" text and a link |
| **Expected Result** | "Next Lesson" label and next lesson title are visible as a link |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-NAV-005: LessonNav shows "Back to Module" for first lesson

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-005 |
| **Description** | When the current lesson is the first in the module, the left nav shows "Back to Module" instead of a previous lesson |
| **Preconditions** | Current lesson is the first lesson (order: 1) |
| **Steps** | 1. Render the lesson page for the first lesson 2. Check the left navigation element |
| **Expected Result** | "Back to Module" text is visible (not "Previous Lesson") |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-NAV-006: SidebarNav lists all lessons in current module

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-006 |
| **Description** | The sidebar navigation lists every lesson title in the current module |
| **Preconditions** | Module has 5 lessons |
| **Steps** | 1. Render the lesson sidebar for the module 2. Count the lesson links |
| **Expected Result** | 5 lesson links are visible, each with the correct lesson title |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-NAV-007: SidebarNav highlights current lesson

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-007 |
| **Description** | The currently active lesson is visually highlighted in the sidebar |
| **Preconditions** | Sidebar rendered for a module, current lesson slug provided |
| **Steps** | 1. Render the sidebar with `currentLessonSlug` 2. Check the corresponding item's CSS classes |
| **Expected Result** | The current lesson item has distinct styling (accent color or background) compared to other items |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-NAV-008: SidebarNav shows completion checkmarks for completed lessons

| Field | Value |
|-------|-------|
| **ID** | TC-NAV-008 |
| **Description** | Lessons that are marked complete in the progress store show a checkmark icon in the sidebar |
| **Preconditions** | Progress store has one lesson completed |
| **Steps** | 1. Set up progress store with a completed lesson 2. Render the sidebar 3. Check for checkmark icon on the completed lesson |
| **Expected Result** | The completed lesson shows a checkmark icon; others show an empty circle or no icon |
| **Priority** | P2 |
| **Status** | Not Run |

---

## Suite 8: Progress Components (Component)

**File:** `src/__tests__/components/progress/progress.test.tsx`
**Target:** Multiple progress components
**Tool:** Vitest + React Testing Library

### TC-PR-001: ProgressBar renders with correct fill width

| Field | Value |
|-------|-------|
| **ID** | TC-PR-001 |
| **Description** | The ProgressBar inner fill has a width style matching the value/max ratio |
| **Preconditions** | None |
| **Steps** | 1. Render `<ProgressBar value={3} max={10} />` 2. Check the inner bar's style |
| **Expected Result** | Inner bar has `width: 30%` style |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PR-002: ProgressBar shows label when showLabel is true

| Field | Value |
|-------|-------|
| **ID** | TC-PR-002 |
| **Description** | When `showLabel` is true, the ProgressBar displays the label text |
| **Preconditions** | None |
| **Steps** | 1. Render `<ProgressBar value={5} max={10} showLabel label="Module 1" />` 2. Check for "Module 1" text |
| **Expected Result** | "Module 1" is visible |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-PR-003: LessonCompleteButton shows "Mark as Complete" when incomplete

| Field | Value |
|-------|-------|
| **ID** | TC-PR-003 |
| **Description** | When the lesson is not yet completed, the button shows "Mark as Complete" |
| **Preconditions** | Lesson is not in `completedLessons` |
| **Steps** | 1. Render the MarkCompleteButton for an incomplete lesson 2. Check button text |
| **Expected Result** | Button text is "Mark as Complete" (or similar) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PR-004: LessonCompleteButton shows completed state when already complete

| Field | Value |
|-------|-------|
| **ID** | TC-PR-004 |
| **Description** | When the lesson is already completed, the button shows a "Completed" state with checkmark |
| **Preconditions** | Lesson is in `completedLessons` |
| **Steps** | 1. Set up progress store with the lesson completed 2. Render the button 3. Check button text |
| **Expected Result** | Button shows "Completed" with a checkmark icon |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PR-005: Clicking LessonCompleteButton calls markLessonComplete

| Field | Value |
|-------|-------|
| **ID** | TC-PR-005 |
| **Description** | Clicking the "Mark as Complete" button calls the store's `markLessonComplete` action |
| **Preconditions** | Lesson is incomplete, store action is observed |
| **Steps** | 1. Click the button 2. Verify `markLessonComplete` was called with the correct lessonId |
| **Expected Result** | `markLessonComplete` is called once with `"moduleSlug/lessonSlug"` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PR-006: StreakCounter displays current streak number

| Field | Value |
|-------|-------|
| **ID** | TC-PR-006 |
| **Description** | The streak counter displays the current streak value from the store |
| **Preconditions** | Progress store has `streak: 5` (or `currentStreak: 5`) |
| **Steps** | 1. Set up store with a streak of 5 2. Render StreakCounter 3. Check for number "5" |
| **Expected Result** | The number "5" is visible in the streak display |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-PR-007: AchievementBadge shows locked state (grayscale)

| Field | Value |
|-------|-------|
| **ID** | TC-PR-007 |
| **Description** | When an achievement is not unlocked, the badge displays in a muted/grayscale style |
| **Preconditions** | Achievement `unlocked: false` |
| **Steps** | 1. Render `<AchievementBadge unlocked={false} ... />` 2. Check CSS classes |
| **Expected Result** | Badge has grayscale or muted opacity styling |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-PR-008: AchievementBadge shows unlocked state (colored)

| Field | Value |
|-------|-------|
| **ID** | TC-PR-008 |
| **Description** | When an achievement is unlocked, the badge displays in full color |
| **Preconditions** | Achievement `unlocked: true` |
| **Steps** | 1. Render `<AchievementBadge unlocked={true} ... />` 2. Check CSS classes |
| **Expected Result** | Badge has full color styling (no grayscale) |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-PR-009: ProgressDashboard shows overall completion percentage

| Field | Value |
|-------|-------|
| **ID** | TC-PR-009 |
| **Description** | The dashboard displays the overall completion percentage based on completed lessons vs total |
| **Preconditions** | Store has some completed lessons |
| **Steps** | 1. Set up store with 5 completed lessons (total available: 23) 2. Render ProgressDashboard 3. Check for percentage display |
| **Expected Result** | A percentage value is visible (e.g., "22%") |
| **Priority** | P1 |
| **Status** | Not Run |

---

## Suite 9: Search (Component)

**File:** `src/__tests__/components/search/search-dialog.test.tsx`
**Target:** `src/components/search/search-dialog.tsx`
**Tool:** Vitest + React Testing Library

### TC-SR-001: SearchDialog opens on Cmd+K (Mac)

| Field | Value |
|-------|-------|
| **ID** | TC-SR-001 |
| **Description** | Pressing Cmd+K fires the keyboard shortcut and opens the search dialog |
| **Preconditions** | SearchDialog is rendered (mounted in DOM but hidden) |
| **Steps** | 1. Dispatch a keydown event with `metaKey: true` and `key: "k"` 2. Check if the dialog is visible |
| **Expected Result** | The search dialog overlay and input field are visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-SR-002: SearchDialog opens on Ctrl+K (Windows/Linux)

| Field | Value |
|-------|-------|
| **ID** | TC-SR-002 |
| **Description** | Pressing Ctrl+K fires the keyboard shortcut and opens the search dialog |
| **Preconditions** | SearchDialog is rendered |
| **Steps** | 1. Dispatch a keydown event with `ctrlKey: true` and `key: "k"` 2. Check if the dialog is visible |
| **Expected Result** | The search dialog overlay and input field are visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-SR-003: SearchDialog closes on Escape

| Field | Value |
|-------|-------|
| **ID** | TC-SR-003 |
| **Description** | Pressing Escape closes an open search dialog |
| **Preconditions** | Search dialog is open |
| **Steps** | 1. Open the dialog 2. Dispatch a keydown event with `key: "Escape"` 3. Check if the dialog is hidden |
| **Expected Result** | The search dialog is no longer visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-SR-004: SearchDialog closes on click outside

| Field | Value |
|-------|-------|
| **ID** | TC-SR-004 |
| **Description** | Clicking the backdrop (outside the dialog box) closes the dialog |
| **Preconditions** | Search dialog is open |
| **Steps** | 1. Open the dialog 2. Click the backdrop element (the semi-transparent overlay) |
| **Expected Result** | The search dialog is no longer visible |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-SR-005: Typing filters results in real-time

| Field | Value |
|-------|-------|
| **ID** | TC-SR-005 |
| **Description** | As the user types in the search input, results are filtered in real-time |
| **Preconditions** | Search dialog is open |
| **Steps** | 1. Type "claude" in the search input 2. Check the results list |
| **Expected Result** | Only results containing "claude" in their title or module name are displayed |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-SR-006: Results show lesson title and module name

| Field | Value |
|-------|-------|
| **ID** | TC-SR-006 |
| **Description** | Each search result displays the lesson title and its module name |
| **Preconditions** | Search dialog is open with a matching query |
| **Steps** | 1. Type a query that matches a known result 2. Check the result item |
| **Expected Result** | The result shows both the lesson title (in bold/medium weight) and the module name (in muted text) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-SR-007: Clicking a result navigates to the lesson

| Field | Value |
|-------|-------|
| **ID** | TC-SR-007 |
| **Description** | Clicking a search result navigates to the corresponding lesson URL |
| **Preconditions** | Search dialog is open with results visible |
| **Steps** | 1. Click a result 2. Verify `router.push` was called with the result's href |
| **Expected Result** | Navigation is triggered to the result's URL. The search dialog closes. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-SR-008: Empty query shows no results

| Field | Value |
|-------|-------|
| **ID** | TC-SR-008 |
| **Description** | When the search input is empty, no results are displayed |
| **Preconditions** | Search dialog is open, input is empty |
| **Steps** | 1. Open the search dialog without typing anything 2. Check the results area |
| **Expected Result** | The results area is empty (no result items visible) |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-SR-009: No-match query shows "No results found"

| Field | Value |
|-------|-------|
| **ID** | TC-SR-009 |
| **Description** | When the query matches nothing, a "No results found" message is displayed |
| **Preconditions** | Search dialog is open |
| **Steps** | 1. Type "xyznonexistent" in the search input 2. Check the results area |
| **Expected Result** | Text 'No results found for "xyznonexistent"' is visible |
| **Priority** | P2 |
| **Status** | Not Run |

---

## Suite 10: Pages (E2E -- Playwright)

**File:** `e2e/pages.spec.ts`
**Target:** All page routes
**Tool:** Playwright

### TC-E2E-001: Landing page loads and shows hero section

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-001 |
| **Description** | The landing page at `/` loads successfully and displays the hero section with heading and CTA |
| **Preconditions** | Application is built and served |
| **Steps** | 1. Navigate to `/` 2. Wait for page load 3. Check for heading "Master Claude" 4. Check for "Start Learning" button |
| **Expected Result** | "Master Claude" heading and "Start Learning" button are visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-002: Landing page "Start Learning" button navigates to curriculum

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-002 |
| **Description** | Clicking "Start Learning" navigates to `/curriculum` |
| **Preconditions** | Landing page is loaded |
| **Steps** | 1. Click "Start Learning" button 2. Wait for navigation 3. Check current URL |
| **Expected Result** | URL is `/curriculum` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-003: Curriculum page shows all 13 module cards

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-003 |
| **Description** | The curriculum page displays a card for each of the 13 modules |
| **Preconditions** | All 13 modules have `_module.json` files |
| **Steps** | 1. Navigate to `/curriculum` 2. Count module card elements |
| **Expected Result** | 13 module cards are visible |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-004: Clicking a module card navigates to module page

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-004 |
| **Description** | Clicking a module card navigates to the module's detail page |
| **Preconditions** | Curriculum page is loaded |
| **Steps** | 1. Click the "Claude Fundamentals" module card 2. Wait for navigation 3. Check URL and page heading |
| **Expected Result** | URL is `/curriculum/claude-fundamentals`, heading shows "Claude Fundamentals" |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-005: Module page lists all lessons with correct count

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-005 |
| **Description** | The module page lists all lessons belonging to that module |
| **Preconditions** | Module has lessons (e.g., Claude Fundamentals has 4) |
| **Steps** | 1. Navigate to `/curriculum/claude-fundamentals` 2. Count lesson list items |
| **Expected Result** | 4 lesson items are visible (matching `_module.json` lesson count) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-006: Clicking a lesson navigates to lesson page

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-006 |
| **Description** | Clicking a lesson in the module page navigates to the lesson detail page |
| **Preconditions** | Module page is loaded with lessons |
| **Steps** | 1. Click the first lesson 2. Wait for navigation 3. Check URL pattern |
| **Expected Result** | URL matches `/curriculum/claude-fundamentals/<lesson-slug>` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-007: Lesson page renders content with headings

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-007 |
| **Description** | The lesson page renders the MDX content with visible headings |
| **Preconditions** | Lesson has content with h2/h3 headings |
| **Steps** | 1. Navigate to a lesson page 2. Check for h1 (lesson title), h2, or h3 elements |
| **Expected Result** | At least the lesson title heading is visible. If content exists, h2/h3 headings are present. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-008: Lesson page shows difficulty badge and duration

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-008 |
| **Description** | The lesson header displays the difficulty badge and estimated duration |
| **Preconditions** | Lesson has `difficulty: "beginner"` and `duration: 15` |
| **Steps** | 1. Navigate to a lesson page 2. Check for difficulty badge text and duration text |
| **Expected Result** | "beginner" badge and "15 min" (or similar) duration are visible |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-E2E-009: Lesson prev/next navigation works correctly

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-009 |
| **Description** | The previous/next lesson navigation at the bottom of the lesson page works |
| **Preconditions** | Current lesson is not the first or last |
| **Steps** | 1. Navigate to a middle lesson 2. Click "Next Lesson" 3. Verify URL changed 4. Click "Previous Lesson" 5. Verify URL returned |
| **Expected Result** | Navigation moves between lessons correctly |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-010: Marking lesson complete updates sidebar checkmark

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-010 |
| **Description** | Clicking "Mark as Complete" on a lesson updates the sidebar to show a completion indicator |
| **Preconditions** | Lesson is incomplete, sidebar is visible (desktop viewport) |
| **Steps** | 1. Navigate to a lesson page at >= 1024px width 2. Click "Mark as Complete" 3. Check the sidebar for a checkmark on that lesson |
| **Expected Result** | The sidebar shows a completion indicator (checkmark) for the completed lesson |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-011: Progress persists after page reload

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-011 |
| **Description** | After marking a lesson complete and reloading the page, the completion state persists |
| **Preconditions** | A lesson has been marked complete |
| **Steps** | 1. Mark a lesson complete 2. Reload the page 3. Check if the lesson still shows as completed |
| **Expected Result** | The lesson remains marked as completed after reload |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-012: Cheatsheet search filters sections correctly

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-012 |
| **Description** | Typing in the cheatsheet search bar filters the displayed sections and items |
| **Preconditions** | Cheatsheet page is loaded |
| **Steps** | 1. Navigate to `/cheatsheet` 2. Type "compact" in the search bar 3. Verify only matching items are shown |
| **Expected Result** | Only the `/compact` command item is visible. Sections without matching items are hidden. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-013: Templates page copies template to clipboard

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-013 |
| **Description** | Clicking the copy button on a template copies the template code to the clipboard |
| **Preconditions** | Templates page is loaded |
| **Steps** | 1. Navigate to `/templates` 2. Click the copy button on the first template 3. Verify the button shows "Copied" state |
| **Expected Result** | Button text changes to "Copied" for approximately 2 seconds |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-E2E-014: Prompt Lab prompt builder assembles prompt correctly

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-014 |
| **Description** | Typing into the prompt builder layers produces the assembled prompt in the preview pane |
| **Preconditions** | Prompt Lab page is loaded |
| **Steps** | 1. Navigate to `/prompt-lab` 2. Type "You are an expert" in the Role textarea 3. Type "Write a function" in the Task textarea 4. Check the preview pane |
| **Expected Result** | Preview pane shows `## Role\nYou are an expert\n\n## Task\nWrite a function` |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-015: Progress dashboard shows completion after completing a lesson

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-015 |
| **Description** | After completing a lesson, the progress dashboard reflects the updated count |
| **Preconditions** | A lesson has been marked complete |
| **Steps** | 1. Navigate to a lesson, mark it complete 2. Navigate to `/progress` 3. Check the completed lessons count |
| **Expected Result** | The completed lessons count is 1 (or incremented by 1) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-016: Theme toggle switches between dark and light mode

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-016 |
| **Description** | Clicking the theme toggle changes the `data-theme` attribute on the HTML element |
| **Preconditions** | Default theme is dark |
| **Steps** | 1. Click the theme toggle button 2. Check `html` element's `data-theme` attribute 3. Verify background color changed |
| **Expected Result** | `data-theme` changes from "dark" to "light". Background color changes from dark to light. |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-E2E-017: Mobile layout collapses sidebar into hamburger menu

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-017 |
| **Description** | At mobile viewport, the header navigation collapses into a hamburger menu |
| **Preconditions** | None |
| **Steps** | 1. Set viewport to 375px width 2. Navigate to any page 3. Verify the hamburger menu icon is visible 4. Click it 5. Verify navigation links appear |
| **Expected Result** | Desktop nav links are hidden. Hamburger icon is visible. Clicking it reveals the navigation links. |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-E2E-018: Cmd+K opens search dialog

| Field | Value |
|-------|-------|
| **ID** | TC-E2E-018 |
| **Description** | Pressing Cmd+K (or Ctrl+K) on any page opens the global search dialog |
| **Preconditions** | Any page is loaded |
| **Steps** | 1. Press Cmd+K (or Ctrl+K) 2. Verify the search dialog is visible 3. Verify the search input is focused |
| **Expected Result** | Search dialog overlay and input are visible. Input has focus. |
| **Priority** | P1 |
| **Status** | Not Run |

---

## Suite 11: Accessibility (E2E)

**File:** `e2e/accessibility.spec.ts`
**Target:** All pages
**Tool:** Playwright + @axe-core/playwright

### TC-A11Y-001: All pages pass axe-core audit with zero violations

| Field | Value |
|-------|-------|
| **ID** | TC-A11Y-001 |
| **Description** | Each page passes the axe-core accessibility audit with no WCAG AA violations |
| **Preconditions** | Application is built and served |
| **Steps** | 1. For each page route: navigate to the page, run `new AxeBuilder({ page }).analyze()`, assert no violations |
| **Expected Result** | Every page has 0 accessibility violations |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-A11Y-002: All interactive elements are keyboard accessible

| Field | Value |
|-------|-------|
| **ID** | TC-A11Y-002 |
| **Description** | All buttons, links, inputs, and other interactive elements can be reached and activated via keyboard |
| **Preconditions** | Landing page is loaded |
| **Steps** | 1. Tab through the page 2. Verify focus reaches all interactive elements in order 3. Verify Enter/Space activates buttons and links |
| **Expected Result** | Every interactive element receives focus and can be activated |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-A11Y-003: Focus order follows visual order

| Field | Value |
|-------|-------|
| **ID** | TC-A11Y-003 |
| **Description** | The tab order of focusable elements matches the visual reading order (left-to-right, top-to-bottom) |
| **Preconditions** | Any page is loaded |
| **Steps** | 1. Tab through all focusable elements 2. Record the order 3. Compare to visual layout |
| **Expected Result** | Focus order matches visual order with no unexpected jumps |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-A11Y-004: Images have alt text

| Field | Value |
|-------|-------|
| **ID** | TC-A11Y-004 |
| **Description** | All `<img>` elements have meaningful alt text or are marked as decorative (`alt=""`) |
| **Preconditions** | Pages with images are loaded |
| **Steps** | 1. Query all `<img>` elements 2. Verify each has an `alt` attribute |
| **Expected Result** | No `<img>` elements lack the `alt` attribute |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-A11Y-005: Color contrast meets WCAG AA (4.5:1 for text)

| Field | Value |
|-------|-------|
| **ID** | TC-A11Y-005 |
| **Description** | Text color and background color combinations meet WCAG AA minimum contrast ratios |
| **Preconditions** | Both dark and light themes |
| **Steps** | 1. Run axe-core color-contrast rule on all pages in both themes |
| **Expected Result** | No contrast violations (4.5:1 for normal text, 3:1 for large text) |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-A11Y-006: Quiz questions are navigable with keyboard only

| Field | Value |
|-------|-------|
| **ID** | TC-A11Y-006 |
| **Description** | A user can complete a quiz using only the keyboard (Tab, Enter, Space) |
| **Preconditions** | A lesson page with a quiz is loaded |
| **Steps** | 1. Tab to the first quiz option 2. Press Enter to select it 3. Tab to "Next Question" button 4. Press Enter 5. Repeat until quiz is complete |
| **Expected Result** | The entire quiz flow is completable with keyboard only |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-A11Y-007: Search dialog traps focus correctly

| Field | Value |
|-------|-------|
| **ID** | TC-A11Y-007 |
| **Description** | When the search dialog is open, focus is trapped within it (Tab does not move focus to elements behind the dialog) |
| **Preconditions** | Search dialog is open |
| **Steps** | 1. Open search dialog 2. Tab through all focusable elements in the dialog 3. Verify focus wraps back to the first element (or stays within the dialog) |
| **Expected Result** | Focus never escapes the dialog while it is open |
| **Priority** | P2 |
| **Status** | Not Run |

---

## Suite 12: Performance (E2E)

**File:** `e2e/performance.spec.ts`
**Target:** Key pages
**Tool:** Lighthouse CI

### TC-PERF-001: Landing page LCP under 2.5 seconds

| Field | Value |
|-------|-------|
| **ID** | TC-PERF-001 |
| **Description** | The Largest Contentful Paint for the landing page is under 2.5 seconds |
| **Preconditions** | Application is built and served in production mode |
| **Steps** | 1. Run Lighthouse on `/` 2. Check the LCP metric |
| **Expected Result** | LCP < 2500ms |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PERF-002: Lesson page FCP under 1.2 seconds

| Field | Value |
|-------|-------|
| **ID** | TC-PERF-002 |
| **Description** | The First Contentful Paint for a lesson page is under 1.2 seconds |
| **Preconditions** | A lesson page exists and is built |
| **Steps** | 1. Run Lighthouse on `/curriculum/claude-fundamentals/what-is-claude` 2. Check the FCP metric |
| **Expected Result** | FCP < 1200ms |
| **Priority** | P1 |
| **Status** | Not Run |

### TC-PERF-003: Total page JS bundle under 200KB per page

| Field | Value |
|-------|-------|
| **ID** | TC-PERF-003 |
| **Description** | The total JavaScript transferred for any single page is under 200KB (compressed) |
| **Preconditions** | Application is built in production mode |
| **Steps** | 1. Analyze the build output 2. Check the JS size for the heaviest page route |
| **Expected Result** | No page route loads more than 200KB of JavaScript |
| **Priority** | P2 |
| **Status** | Not Run |

### TC-PERF-004: All pages achieve Lighthouse 95+ score

| Field | Value |
|-------|-------|
| **ID** | TC-PERF-004 |
| **Description** | All pages achieve a Lighthouse score of 95 or above on Performance, Accessibility, Best Practices, and SEO |
| **Preconditions** | Application is built and served in production mode |
| **Steps** | 1. Run Lighthouse on `/`, `/curriculum`, `/cheatsheet`, `/templates`, `/prompt-lab`, `/progress` 2. Check all four metrics |
| **Expected Result** | All metrics are >= 95 on every page |
| **Priority** | P1 |
| **Status** | Not Run |
