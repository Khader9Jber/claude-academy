import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProgressStore } from '../progress-store'
import { act } from '@testing-library/react'

// Reset the store before each test
beforeEach(() => {
  // Clear localStorage safely
  try {
    window.localStorage.clear()
  } catch {
    // If localStorage is not available, create a simple mock
    const store: Record<string, string> = {}
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { Object.keys(store).forEach(k => delete store[k]) },
        get length() { return Object.keys(store).length },
        key: (i: number) => Object.keys(store)[i] ?? null,
      },
      writable: true,
      configurable: true,
    })
  }
  // Reset the Zustand store to initial state
  const { reset } = useProgressStore.getState()
  act(() => {
    reset()
  })
})

describe('Progress Store — Initial State', () => {
  it('TC-PS-001: initial state has empty completedLessons', () => {
    const state = useProgressStore.getState()
    expect(state.completedLessons).toEqual([])
  })

  it('initial state has empty quizScores', () => {
    const state = useProgressStore.getState()
    expect(state.quizScores).toEqual({})
  })

  it('initial state has empty completedExercises', () => {
    const state = useProgressStore.getState()
    expect(state.completedExercises).toEqual([])
  })

  it('initial state has empty activeDays', () => {
    const state = useProgressStore.getState()
    expect(state.activeDays).toEqual([])
  })

  it('initial state has zero streaks', () => {
    const state = useProgressStore.getState()
    expect(state.currentStreak).toBe(0)
    expect(state.longestStreak).toBe(0)
  })

  it('initial state has null lastVisitedLesson', () => {
    const state = useProgressStore.getState()
    expect(state.lastVisitedLesson).toBeNull()
  })
})

describe('Progress Store — markLessonComplete', () => {
  it('TC-PS-002: adds lesson slug to completedLessons', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('claude-fundamentals/what-is-claude')
    })
    const state = useProgressStore.getState()
    expect(state.completedLessons).toContain('claude-fundamentals/what-is-claude')
  })

  it('TC-PS-003: does not duplicate already-completed lessons', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('mod/lesson')
      useProgressStore.getState().markLessonComplete('mod/lesson')
    })
    const state = useProgressStore.getState()
    expect(state.completedLessons).toEqual(['mod/lesson'])
    expect(state.completedLessons.length).toBe(1)
  })

  it('updates lastVisitedLesson', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('mod/lesson-a')
    })
    expect(useProgressStore.getState().lastVisitedLesson).toBe('mod/lesson-a')
  })

  it('also records activity when marking complete', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('mod/lesson-a')
    })
    const today = new Date().toISOString().split('T')[0]
    expect(useProgressStore.getState().activeDays).toContain(today)
  })
})

describe('Progress Store — saveQuizScore', () => {
  it('TC-PS-004: stores score with correct quizId', () => {
    act(() => {
      useProgressStore.getState().saveQuizScore('quiz-01', 80, 100)
    })
    const scores = useProgressStore.getState().quizScores
    expect(scores['quiz-01']).toEqual({ score: 80, total: 100, bestScore: 80 })
  })

  it('TC-PS-005: updates bestScore when new score is higher', () => {
    act(() => {
      useProgressStore.getState().saveQuizScore('quiz-01', 60, 100)
      useProgressStore.getState().saveQuizScore('quiz-01', 90, 100)
    })
    const scores = useProgressStore.getState().quizScores
    expect(scores['quiz-01'].bestScore).toBe(90)
  })

  it('TC-PS-006: keeps bestScore when new score is lower', () => {
    act(() => {
      useProgressStore.getState().saveQuizScore('quiz-01', 90, 100)
      useProgressStore.getState().saveQuizScore('quiz-01', 70, 100)
    })
    const scores = useProgressStore.getState().quizScores
    expect(scores['quiz-01'].score).toBe(70)
    expect(scores['quiz-01'].bestScore).toBe(90)
  })
})

describe('Progress Store — markExerciseComplete', () => {
  it('TC-PS-007: adds exercise to completedExercises', () => {
    act(() => {
      useProgressStore.getState().markExerciseComplete('exercise-01')
    })
    expect(useProgressStore.getState().completedExercises).toContain('exercise-01')
  })

  it('does not duplicate already-completed exercises', () => {
    act(() => {
      useProgressStore.getState().markExerciseComplete('exercise-01')
      useProgressStore.getState().markExerciseComplete('exercise-01')
    })
    expect(useProgressStore.getState().completedExercises).toEqual(['exercise-01'])
  })
})

describe('Progress Store — recordActivity & Streak', () => {
  it('TC-PS-008: adds today\'s date to activeDays', () => {
    act(() => {
      useProgressStore.getState().recordActivity()
    })
    const today = new Date().toISOString().split('T')[0]
    expect(useProgressStore.getState().activeDays).toContain(today)
  })

  it('does not duplicate today if already recorded', () => {
    act(() => {
      useProgressStore.getState().recordActivity()
      useProgressStore.getState().recordActivity()
    })
    const today = new Date().toISOString().split('T')[0]
    const days = useProgressStore.getState().activeDays
    expect(days.filter((d: string) => d === today).length).toBe(1)
  })

  it('TC-PS-009: calculates currentStreak for consecutive days', () => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 86400000)
    const dayBefore = new Date(today.getTime() - 2 * 86400000)

    // Pre-populate activeDays with two previous consecutive days
    useProgressStore.setState({
      activeDays: [
        dayBefore.toISOString().split('T')[0],
        yesterday.toISOString().split('T')[0],
      ],
      currentStreak: 2,
      longestStreak: 2,
    })

    act(() => {
      useProgressStore.getState().recordActivity()
    })

    expect(useProgressStore.getState().currentStreak).toBe(3)
  })

  it('TC-PS-010: resets streak after a gap day', () => {
    const today = new Date()
    const threeDaysAgo = new Date(today.getTime() - 3 * 86400000)

    useProgressStore.setState({
      activeDays: [threeDaysAgo.toISOString().split('T')[0]],
      currentStreak: 1,
      longestStreak: 1,
    })

    act(() => {
      useProgressStore.getState().recordActivity()
    })

    expect(useProgressStore.getState().currentStreak).toBe(1)
  })

  it('TC-PS-011: updates longestStreak when current exceeds longest', () => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 86400000)
    const dayBefore = new Date(today.getTime() - 2 * 86400000)

    useProgressStore.setState({
      activeDays: [
        dayBefore.toISOString().split('T')[0],
        yesterday.toISOString().split('T')[0],
      ],
      currentStreak: 2,
      longestStreak: 2,
    })

    act(() => {
      useProgressStore.getState().recordActivity()
    })

    expect(useProgressStore.getState().longestStreak).toBe(3)
  })
})

describe('Progress Store — reset', () => {
  it('TC-PS-012: clears all state to initial values', () => {
    // Populate store with data
    act(() => {
      useProgressStore.getState().markLessonComplete('mod/lesson-1')
      useProgressStore.getState().markLessonComplete('mod/lesson-2')
      useProgressStore.getState().saveQuizScore('quiz-01', 80, 100)
      useProgressStore.getState().markExerciseComplete('exercise-01')
    })

    // Verify state is non-empty
    expect(useProgressStore.getState().completedLessons.length).toBeGreaterThan(0)

    // Reset
    act(() => {
      useProgressStore.getState().reset()
    })

    const state = useProgressStore.getState()
    expect(state.completedLessons).toEqual([])
    expect(state.quizScores).toEqual({})
    expect(state.completedExercises).toEqual([])
    expect(state.activeDays).toEqual([])
    expect(state.currentStreak).toBe(0)
    expect(state.longestStreak).toBe(0)
    expect(state.unlockedAchievements).toEqual([])
    expect(state.lastVisitedLesson).toBeNull()
  })
})

describe('Progress Store — localStorage persistence', () => {
  it('TC-PS-013: state persists to localStorage on change', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('mod/lesson')
    })

    const stored = localStorage.getItem('claude-academy-progress')
    expect(stored).not.toBeNull()

    const parsed = JSON.parse(stored!)
    // Zustand persist wraps state in a `state` key
    const stateData = parsed.state || parsed
    expect(stateData.completedLessons).toContain('mod/lesson')
  })
})

describe('Progress Store — getModuleProgress', () => {
  it('returns 0 when no lessons completed', () => {
    const progress = useProgressStore.getState().getModuleProgress(['a', 'b', 'c'])
    expect(progress).toBe(0)
  })

  it('returns correct percentage when some lessons completed', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('a')
      useProgressStore.getState().markLessonComplete('b')
    })
    const progress = useProgressStore.getState().getModuleProgress(['a', 'b', 'c', 'd'])
    expect(progress).toBe(50)
  })

  it('returns 100 when all lessons completed', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('a')
      useProgressStore.getState().markLessonComplete('b')
    })
    const progress = useProgressStore.getState().getModuleProgress(['a', 'b'])
    expect(progress).toBe(100)
  })

  it('returns 0 for empty lesson list', () => {
    const progress = useProgressStore.getState().getModuleProgress([])
    expect(progress).toBe(0)
  })
})

describe('Progress Store — isLessonComplete', () => {
  it('returns false for incomplete lesson', () => {
    expect(useProgressStore.getState().isLessonComplete('mod/lesson')).toBe(false)
  })

  it('returns true for completed lesson', () => {
    act(() => {
      useProgressStore.getState().markLessonComplete('mod/lesson')
    })
    expect(useProgressStore.getState().isLessonComplete('mod/lesson')).toBe(true)
  })
})
