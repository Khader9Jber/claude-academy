import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ModulePage extends BasePage {
  readonly moduleTitle: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.moduleTitle = page.getByTestId('module-title');
  }

  lessonItem(slug: string): Locator {
    return this.page.getByTestId(`lesson-item-${slug}`);
  }

  async clickLesson(slug: string) {
    await this.lessonItem(slug).click();
  }

  async isLessonListed(slug: string) {
    return this.lessonItem(slug).isVisible();
  }

  async getLessonCount() {
    return this.page.locator('[data-testid^="lesson-item-"]').count();
  }
}
