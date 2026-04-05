export interface Module {
  slug: string;
  title: string;
  description: string;
  arc: "foundation" | "practitioner" | "power-user" | "expert";
  order: number;
  icon: string;
  color: string;
  estimatedHours: number;
  prerequisites: string[];
  lessons: Lesson[];
}

export interface Lesson {
  slug: string;
  moduleSlug: string;
  title: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  duration: number; // minutes
  tags: string[];
  objectives: string[];
  content: string; // MDX content
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "multiple-select" | "true-false";
  options: string[];
  correct: number | number[];
  explanation: string;
}
