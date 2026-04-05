import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class TemplatesPage extends BasePage {
  readonly templateCards: Locator;
  readonly codeBlocks: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.templateCards = page.getByTestId('template-card');
    this.codeBlocks = page.locator('pre');
  }

  async getTemplateCount() {
    return this.templateCards.count();
  }
}
