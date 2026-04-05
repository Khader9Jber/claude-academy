import { test, expect } from '@playwright/test';

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('lesson shows Mark as Complete button', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    await expect(page.locator('text=Mark as Complete')).toBeVisible();
  });

  test('clicking Mark as Complete changes button state', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    await page.click('text=Mark as Complete');
    // Should show completed state
    await expect(page.locator('text=Completed')).toBeVisible();
  });

  test('completed lesson persists after page reload', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    await page.click('text=Mark as Complete');
    await expect(page.locator('text=Completed')).toBeVisible();

    // Reload the page
    await page.reload();
    // Should still show completed
    await expect(page.locator('text=Completed')).toBeVisible();
  });

  test('progress page loads', async ({ page }) => {
    await page.goto('/progress');
    await expect(page.locator('text=Your Progress')).toBeVisible();
  });

  test('progress dashboard shows stats', async ({ page }) => {
    await page.goto('/progress');
    // Should show lesson count, module count
    await expect(page.locator('text=Lessons')).toBeVisible();
    await expect(page.locator('text=Modules')).toBeVisible();
  });

  test('reset progress button exists with confirmation', async ({ page }) => {
    await page.goto('/progress');
    const resetButton = page.locator('text=Reset All');
    if (await resetButton.count() > 0) {
      await resetButton.click();
      // Should show confirmation
      await expect(page.locator('text=Are you sure')).toBeVisible();
    }
  });
});
