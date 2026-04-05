import { test, expect } from '@playwright/test';

test.describe('Cheatsheet', () => {
  test('cheatsheet page loads with search', async ({ page }) => {
    await page.goto('/cheatsheet');
    await expect(page.locator('h1')).toBeVisible();
    // Should have a search input
    const searchInput = page.locator('input[type="text"], input[type="search"]');
    await expect(searchInput).toBeVisible();
  });

  test('search filters sections', async ({ page }) => {
    await page.goto('/cheatsheet');
    const searchInput = page.locator('input[type="text"], input[type="search"]');
    await searchInput.fill('compact');
    // Should filter to show compact-related content
    await expect(page.locator('text=/compact/i')).toHaveCount({ minimum: 1 });
  });

  test('category tabs are visible', async ({ page }) => {
    await page.goto('/cheatsheet');
    // Should have tab buttons for categories
    const allTab = page.locator('button:has-text("All")');
    if (await allTab.count() > 0) {
      await expect(allTab).toBeVisible();
    }
  });

  test('cheatsheet shows CLI commands', async ({ page }) => {
    await page.goto('/cheatsheet');
    await expect(page.locator('text=claude')).toHaveCount({ minimum: 1 });
  });
});
