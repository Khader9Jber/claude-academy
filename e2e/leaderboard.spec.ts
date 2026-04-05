import { test, expect } from '@playwright/test';
import { LeaderboardPage } from './pages';

test.describe('Leaderboard Page', () => {
  test('leaderboard page loads', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.navigateTo('/leaderboard');
    await expect(leaderboard.heading).toBeVisible();
  });

  test('shows leaderboard heading', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.navigateTo('/leaderboard');
    await expect(leaderboard.heading).toContainText('Leaderboard');
  });

  test('shows table or empty state for rankings', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.navigateTo('/leaderboard');
    // Wait for loading to finish: either the table or the empty state should appear
    await expect(leaderboard.table.or(leaderboard.empty)).toBeVisible();
  });

  test('accessible without login', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.navigateTo('/leaderboard');
    // Page should not redirect to login
    await expect(page).toHaveURL(/\/leaderboard/);
    await expect(leaderboard.heading).toBeVisible();
  });

  test('header and footer are visible', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.navigateTo('/leaderboard');
    await expect(leaderboard.header).toBeVisible();
    await expect(leaderboard.footer).toBeVisible();
  });
});
