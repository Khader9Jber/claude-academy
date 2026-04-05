import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LandingPage extends BasePage {
  readonly heroHeading: Locator;
  readonly startLearningBtn: Locator;
  readonly arcCards: Locator;
  readonly statsBar: Locator;
  readonly footerCredit: Locator;
  readonly mobileMenuBtn: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.heroHeading = page.getByTestId('hero-heading');
    this.startLearningBtn = page.getByTestId('start-learning-btn').first();
    this.arcCards = page.getByTestId('arc-cards');
    this.statsBar = page.getByTestId('stats-bar');
    this.footerCredit = page.getByTestId('footer-credit');
    this.mobileMenuBtn = page.getByTestId('mobile-menu-btn');
  }

  async clickStartLearning() {
    await this.startLearningBtn.click();
  }

  async isHeroVisible() {
    return this.heroHeading.isVisible();
  }

  async getStatsText() {
    return this.statsBar.textContent();
  }
}
