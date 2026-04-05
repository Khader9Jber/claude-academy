/**
 * Compatibility wrapper — re-exports the canonical progress store
 * with aliases used by some components.
 *
 * The real implementation lives in ./progress-store.ts
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  totalLessons: number;
  completedLessons: number;
}

interface ProgressState {
  completedLessons: string[];
  quizScores: Record<string, number>;
  streak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  achievements: Achievement[];
  modules: ModuleProgress[];

  completeLesson: (slug: string) => void;
  saveQuizScore: (quizId: string, score: number) => void;
  updateStreak: () => void;
  unlockAchievement: (id: string) => void;
  resetProgress: () => void;
  isLessonComplete: (slug: string) => boolean;
}

const defaultModules: ModuleProgress[] = [
  { moduleId: "claude-fundamentals", moduleName: "Claude Fundamentals", totalLessons: 4, completedLessons: 0 },
  { moduleId: "prompt-engineering", moduleName: "Prompt Engineering", totalLessons: 8, completedLessons: 0 },
  { moduleId: "claude-code-basics", moduleName: "Claude Code Basics", totalLessons: 5, completedLessons: 0 },
  { moduleId: "commands-and-navigation", moduleName: "Commands & Navigation", totalLessons: 5, completedLessons: 0 },
  { moduleId: "claude-md-and-config", moduleName: "CLAUDE.md & Config", totalLessons: 6, completedLessons: 0 },
  { moduleId: "session-and-context", moduleName: "Session & Context", totalLessons: 5, completedLessons: 0 },
  { moduleId: "git-and-workflows", moduleName: "Git & Workflows", totalLessons: 6, completedLessons: 0 },
  { moduleId: "mcp-fundamentals", moduleName: "MCP Fundamentals", totalLessons: 5, completedLessons: 0 },
  { moduleId: "hooks-and-automation", moduleName: "Hooks & Automation", totalLessons: 5, completedLessons: 0 },
  { moduleId: "agents-and-skills", moduleName: "Agents & Skills", totalLessons: 7, completedLessons: 0 },
  { moduleId: "advanced-workflows", moduleName: "Advanced Workflows", totalLessons: 7, completedLessons: 0 },
  { moduleId: "enterprise-and-production", moduleName: "Enterprise & Production", totalLessons: 7, completedLessons: 0 },
  { moduleId: "capstone", moduleName: "Capstone", totalLessons: 4, completedLessons: 0 },
];

const defaultAchievements: Achievement[] = [
  { id: "first-lesson", title: "First Steps", description: "Complete your first lesson", icon: "BookOpen", unlocked: false },
  { id: "five-lessons", title: "Quick Learner", description: "Complete 5 lessons", icon: "Zap", unlocked: false },
  { id: "first-quiz", title: "Quiz Taker", description: "Complete your first quiz", icon: "Brain", unlocked: false },
  { id: "perfect-score", title: "Perfect Score", description: "Score 100% on a quiz", icon: "Trophy", unlocked: false },
  { id: "week-streak", title: "On Fire", description: "7-day learning streak", icon: "Flame", unlocked: false },
  { id: "foundation-done", title: "Foundation Built", description: "Complete all Foundation modules", icon: "Award", unlocked: false },
  { id: "practitioner-done", title: "Practitioner", description: "Complete all Practitioner modules", icon: "Code", unlocked: false },
  { id: "power-user-done", title: "Power User", description: "Complete all Power User modules", icon: "Rocket", unlocked: false },
  { id: "expert-done", title: "Expert", description: "Complete all Expert modules", icon: "Crown", unlocked: false },
  { id: "prompt-master", title: "Prompt Master", description: "Complete the Prompt Engineering module", icon: "Lightbulb", unlocked: false },
  { id: "mcp-explorer", title: "MCP Explorer", description: "Complete the MCP module", icon: "Plug", unlocked: false },
  { id: "full-stack", title: "Claude Master", description: "Complete all 13 modules", icon: "GraduationCap", unlocked: false },
];

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      quizScores: {},
      streak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      achievements: defaultAchievements,
      modules: defaultModules,

      completeLesson: (slug: string) => {
        const state = get();
        if (state.completedLessons.includes(slug)) return;
        set({ completedLessons: [...state.completedLessons, slug] });
        get().updateStreak();
      },

      saveQuizScore: (quizId: string, score: number) => {
        set((state) => ({
          quizScores: { ...state.quizScores, [quizId]: score },
        }));
        get().updateStreak();
      },

      updateStreak: () => {
        const today = getTodayStr();
        const state = get();
        if (state.lastActivityDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = 1;
        if (state.lastActivityDate === yesterdayStr) {
          newStreak = state.streak + 1;
        }

        set({
          streak: newStreak,
          longestStreak: Math.max(newStreak, state.longestStreak),
          lastActivityDate: today,
        });
      },

      unlockAchievement: (id: string) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: getTodayStr() } : a
          ),
        }));
      },

      resetProgress: () => {
        set({
          completedLessons: [],
          quizScores: {},
          streak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          achievements: defaultAchievements,
          modules: defaultModules,
        });
      },

      isLessonComplete: (slug: string) => {
        return get().completedLessons.includes(slug);
      },
    }),
    { name: "claude-academy-progress" }
  )
);
