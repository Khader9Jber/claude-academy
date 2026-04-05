import { test, expect } from '@playwright/test';
import { CheatsheetPage } from './pages';

test.describe('Cheatsheet', () => {
  test('cheatsheet page loads with search input', async ({ page }) => {
    const cheatsheet = new CheatsheetPage(page);
    await cheatsheet.navigateTo('/cheatsheet');
    await expect(cheatsheet.searchInput).toBeVisible();
  });

  test('search filters sections', async ({ page }) => {
    const cheatsheet = new CheatsheetPage(page);
    await cheatsheet.navigateTo('/cheatsheet');
    await cheatsheet.search('compact');
    // Should filter to show compact-related content
    await expect(page.locator('text=/compact/i')).not.toHaveCount(0);
  });

  test('category tabs are visible and clickable', async ({ page }) => {
    const cheatsheet = new CheatsheetPage(page);
    await cheatsheet.navigateTo('/cheatsheet');
    await expect(cheatsheet.categoryTab('all')).toBeVisible();
    await expect(cheatsheet.categoryTab('cli')).toBeVisible();
    await expect(cheatsheet.categoryTab('commands')).toBeVisible();
  });

  test('clicking a tab filters content', async ({ page }) => {
    const cheatsheet = new CheatsheetPage(page);
    await cheatsheet.navigateTo('/cheatsheet');
    await cheatsheet.selectTab('cli');
    // Should show CLI-related content
    await expect(page.locator('text=claude')).not.toHaveCount(0);
  });
});
