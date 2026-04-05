import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LessonPage extends BasePage {
  readonly lessonTitle: Locator;
  readonly markCompleteBtn: Locator;
  readonly completedIndicator: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.lessonTitle = page.getByTestId('lesson-title');
    this.markCompleteBtn = page.getByTestId('mark-complete-btn');
    this.completedIndicator = page.getByTestId('lesson-completed');
  }

  async markAsComplete() {
    await this.markCompleteBtn.click();
  }

  async isCompleted() {
    return this.completedIndicator.isVisible();
  }

  async getTitle() {
    return this.lessonTitle.textContent();
  }
}
