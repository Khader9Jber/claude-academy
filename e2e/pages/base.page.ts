import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('site-header');
    this.footer = page.getByTestId('site-footer');
    this.logo = page.getByTestId('site-logo');
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  // Navigation helpers using data-testid
  async goToCurriculum() { await this.page.getByTestId('nav-curriculum').click(); }
  async goToPromptLab() { await this.page.getByTestId('nav-prompt-lab').click(); }
  async goToCheatsheet() { await this.page.getByTestId('nav-cheatsheet').click(); }
  async goToTemplates() { await this.page.getByTestId('nav-templates').click(); }
}
