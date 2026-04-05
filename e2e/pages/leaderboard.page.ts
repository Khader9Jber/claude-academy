import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LeaderboardPage extends BasePage {
  readonly heading: Locator;
  readonly table: Locator;
  readonly loading: Locator;
  readonly empty: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('leaderboard-heading');
    this.table = page.getByTestId('leaderboard-table');
    this.loading = page.getByTestId('leaderboard-loading');
    this.empty = page.getByTestId('leaderboard-empty');
  }

  row(index: number): Locator {
    return this.page.getByTestId(`leaderboard-row-${index}`);
  }

  async getRowCount(): Promise<number> {
    const rows = this.page.locator('[data-testid^="leaderboard-row-"]');
    return rows.count();
  }
}
