import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CurriculumPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page);
  }

  moduleCard(slug: string): Locator {
    return this.page.getByTestId(`module-card-${slug}`);
  }

  arcSection(id: string): Locator {
    return this.page.getByTestId(`arc-${id}`);
  }

  async clickModule(slug: string) {
    await this.moduleCard(slug).click();
  }

  async isModuleVisible(slug: string) {
    return this.moduleCard(slug).isVisible();
  }

  getModuleCards(): Locator {
    return this.page.locator('[data-testid^="module-card-"]');
  }
}
