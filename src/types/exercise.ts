export interface CodeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  moduleSlug: string;
  lessonSlug: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  validationRules: ValidationRule[];
  language: "prompt" | "markdown" | "json" | "yaml" | "bash";
}

export interface ValidationRule {
  type: "contains" | "not-contains" | "regex" | "exact" | "length-min" | "length-max";
  value: string;
  message: string;
}

export interface FillInBlank {
  id: string;
  title: string;
  description: string;
  moduleSlug: string;
  lessonSlug: string;
  template: string; // text with {{blank}} placeholders
  blanks: BlankSlot[];
}

export interface BlankSlot {
  id: string;
  correctAnswers: string[]; // multiple accepted answers
  hint: string;
  caseSensitive: boolean;
}

export interface TerminalStep {
  id: string;
  instruction: string;
  expectedCommand: string;
  alternativeCommands: string[];
  output: string;
  explanation: string;
}

export interface TerminalExercise {
  id: string;
  title: string;
  description: string;
  moduleSlug: string;
  lessonSlug: string;
  steps: TerminalStep[];
  initialDirectory: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  moduleSlug: string;
  timeLimit: number; // minutes
  objectives: string[];
  starterPrompt: string;
  evaluationCriteria: EvaluationCriterion[];
  bonusObjectives: string[];
}

export interface EvaluationCriterion {
  label: string;
  description: string;
  points: number;
}
