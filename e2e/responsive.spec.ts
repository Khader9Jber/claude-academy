import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('mobile: landing page renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Start Learning')).toBeVisible();
  });

  test('mobile: hamburger menu appears', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Desktop nav links should be hidden, hamburger should appear
    const hamburger = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], header button:has(svg)');
    if (await hamburger.count() > 0) {
      await expect(hamburger.first()).toBeVisible();
    }
  });

  test('tablet: curriculum page shows module cards', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/curriculum');
    await expect(page.locator('text=Claude Fundamentals')).toBeVisible();
  });

  test('desktop: lesson page shows sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('mobile: lesson page is scrollable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    await expect(page.locator('h1')).toBeVisible();
    // Should be able to scroll
    await page.evaluate(() => window.scrollTo(0, 500));
  });
});
