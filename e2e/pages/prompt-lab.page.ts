import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class PromptLabPage extends BasePage {
  readonly heading: Locator;
  readonly templateCards: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.heading = page.getByTestId('prompt-lab-heading');
    this.templateCards = page.getByTestId('template-card');
  }

  filterBtn(category: string): Locator {
    return this.page.getByTestId(`filter-${category}`);
  }

  async filterByCategory(category: string) {
    await this.filterBtn(category).click();
  }

  async getTemplateCount() {
    return this.templateCards.count();
  }
}
