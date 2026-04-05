import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProgressPage extends BasePage {
  readonly heading: Locator;
  readonly statLessons: Locator;
  readonly statQuizzes: Locator;
  readonly statStreak: Locator;
  readonly statAchievements: Locator;
  readonly resetBtn: Locator;
  readonly confirmResetBtn: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.heading = page.getByTestId('progress-heading');
    this.statLessons = page.getByTestId('stat-lessons');
    this.statQuizzes = page.getByTestId('stat-quizzes');
    this.statStreak = page.getByTestId('stat-streak');
    this.statAchievements = page.getByTestId('stat-achievements');
    this.resetBtn = page.getByTestId('reset-progress-btn');
    this.confirmResetBtn = page.getByTestId('confirm-reset-btn');
  }

  async clickReset() {
    await this.resetBtn.click();
  }

  async confirmReset() {
    await this.confirmResetBtn.click();
  }

  isStatVisible(name: 'lessons' | 'quizzes' | 'streak' | 'achievements') {
    const statMap = {
      lessons: this.statLessons,
      quizzes: this.statQuizzes,
      streak: this.statStreak,
      achievements: this.statAchievements,
    };
    return statMap[name].isVisible();
  }
}
