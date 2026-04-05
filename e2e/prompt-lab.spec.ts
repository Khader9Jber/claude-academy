import { test, expect } from '@playwright/test';

test.describe('Prompt Lab', () => {
  test('prompt lab page loads', async ({ page }) => {
    await page.goto('/prompt-lab');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('template library shows templates', async ({ page }) => {
    await page.goto('/prompt-lab');
    // Should have template cards
    await expect(page.locator('text=Copy')).toHaveCount({ minimum: 1 });
  });

  test('category filter buttons work', async ({ page }) => {
    await page.goto('/prompt-lab');
    // Click a category filter if available
    const codingFilter = page.locator('button:has-text("Coding")');
    if (await codingFilter.count() > 0) {
      await codingFilter.click();
      // Should filter to show only coding templates
      await expect(page.locator('text=Coding')).toBeVisible();
    }
  });

  test('before/after examples are visible', async ({ page }) => {
    await page.goto('/prompt-lab');
    // Scroll to before/after section
    const beforeAfter = page.locator('text=Before');
    if (await beforeAfter.count() > 0) {
      await expect(beforeAfter.first()).toBeVisible();
    }
  });
});
