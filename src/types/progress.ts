export interface ProgressState {
  completedLessons: string[];
  quizScores: Record<
    string,
    { score: number; total: number; bestScore: number }
  >;
  completedExercises: string[];
  activeDays: string[];
  currentStreak: number;
  longestStreak: number;
  unlockedAchievements: string[];
  lastVisitedLesson: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
}
