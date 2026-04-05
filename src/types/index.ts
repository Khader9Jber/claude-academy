// ── Component-facing types ──────────────────────────────────────────
// These lightweight interfaces are consumed by UI/interactive components.
// The richer content-model types live in ./content.ts and ./exercise.ts.

export interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
  highlight?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correct: number;
  explanation: string;
}

export interface BlankDefinition {
  id: number;
  answer: string | string[];
  hint?: string;
}

export interface TerminalStep {
  prompt: string;
  expectedInput: string | string[];
  output: string;
  hint: string;
}

export interface LessonMeta {
  slug: string;
  title: string;
  module: string;
  type: "lesson" | "quiz" | "exercise";
  completed: boolean;
}

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

// ── Re-exports from dedicated type modules ──────────────────────────
export type { Module, Lesson } from "./content";
export type {
  QuizQuestion as ContentQuizQuestion,
} from "./content";
export type { ProgressState } from "./progress";
export type { Achievement as ProgressAchievement } from "./progress";
export type {
  CodeExercise,
  ValidationRule,
  FillInBlank,
  BlankSlot,
  TerminalStep as ExerciseTerminalStep,
  TerminalExercise,
  Challenge,
  EvaluationCriterion,
} from "./exercise";
