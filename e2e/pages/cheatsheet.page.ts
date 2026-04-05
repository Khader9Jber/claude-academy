import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheatsheetPage extends BasePage {
  readonly searchInput: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.searchInput = page.getByTestId('cheatsheet-search');
  }

  categoryTab(id: string): Locator {
    return this.page.getByTestId(`cheatsheet-tab-${id}`);
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async selectTab(id: string) {
    await this.categoryTab(id).click();
  }
}
