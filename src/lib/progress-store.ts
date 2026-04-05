"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProgressState } from "@/types/progress";

interface ProgressActions {
  markLessonComplete: (lessonId: string) => void;
  saveQuizScore: (
    quizId: string,
    score: number,
    total: number
  ) => void;
  markExerciseComplete: (exerciseId: string) => void;
  recordActivity: () => void;
  isLessonComplete: (lessonId: string) => boolean;
  getModuleProgress: (lessonIds: string[]) => number;
  reset: () => void;
}

type ProgressStore = ProgressState & ProgressActions;

const initialState: ProgressState = {
  completedLessons: [],
  quizScores: {},
  completedExercises: [],
  activeDays: [],
  currentStreak: 0,
  longestStreak: 0,
  unlockedAchievements: [],
  lastVisitedLesson: null,
};

function calculateStreak(activeDays: string[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (activeDays.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...activeDays].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Check if today or yesterday is in the list to start counting
  if (sorted[0] === today || sorted[0] === yesterday) {
    currentStreak = 1;
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i]);
    const next = new Date(sorted[i + 1]);
    const diff = (current.getTime() - next.getTime()) / 86400000;

    if (diff === 1) {
      tempStreak++;
      if (i === 0 || currentStreak > 0) {
        currentStreak = tempStreak;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
      if (currentStreak > 0 && i > 0) {
        // Current streak is broken beyond the first gap
        break;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      markLessonComplete: (lessonId: string) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) return;

        set({
          completedLessons: [...state.completedLessons, lessonId],
          lastVisitedLesson: lessonId,
        });

        // Also record today's activity
        get().recordActivity();
      },

      saveQuizScore: (quizId: string, score: number, total: number) => {
        const state = get();
        const existing = state.quizScores[quizId];
        const bestScore = existing
          ? Math.max(existing.bestScore, score)
          : score;

        set({
          quizScores: {
            ...state.quizScores,
            [quizId]: { score, total, bestScore },
          },
        });

        get().recordActivity();
      },

      markExerciseComplete: (exerciseId: string) => {
        const state = get();
        if (state.completedExercises.includes(exerciseId)) return;

        set({
          completedExercises: [...state.completedExercises, exerciseId],
        });

        get().recordActivity();
      },

      recordActivity: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        if (state.activeDays.includes(today)) return;

        const newActiveDays = [...state.activeDays, today];
        const { currentStreak, longestStreak } =
          calculateStreak(newActiveDays);

        set({
          activeDays: newActiveDays,
          currentStreak,
          longestStreak,
        });
      },

      isLessonComplete: (lessonId: string) => {
        return get().completedLessons.includes(lessonId);
      },

      getModuleProgress: (lessonIds: string[]) => {
        if (lessonIds.length === 0) return 0;
        const completed = get().completedLessons;
        const done = lessonIds.filter((id) => completed.includes(id)).length;
        return Math.round((done / lessonIds.length) * 100);
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "claude-academy-progress",
    }
  )
);
