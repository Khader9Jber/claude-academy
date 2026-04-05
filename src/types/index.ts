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
