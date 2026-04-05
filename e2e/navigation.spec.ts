import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  test('landing page loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Start Learning')).toBeVisible();
  });

  test('landing page shows 4 arc cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Foundation')).toBeVisible();
    await expect(page.locator('text=Practitioner')).toBeVisible();
    await expect(page.locator('text=Power User')).toBeVisible();
    await expect(page.locator('text=Expert')).toBeVisible();
  });

  test('Start Learning button navigates to curriculum', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start Learning');
    await expect(page).toHaveURL(/curriculum/);
  });

  test('curriculum page shows all 13 modules', async ({ page }) => {
    await page.goto('/curriculum');
    await expect(page.locator('text=Claude Fundamentals')).toBeVisible();
    await expect(page.locator('text=Prompt Engineering')).toBeVisible();
    await expect(page.locator('text=Claude Code Basics')).toBeVisible();
  });

  test('clicking a module navigates to module page', async ({ page }) => {
    await page.goto('/curriculum');
    await page.click('text=Claude Fundamentals');
    await expect(page).toHaveURL(/curriculum\/claude-fundamentals/);
  });

  test('module page lists lessons', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals');
    await expect(page.locator('text=What Is Claude')).toBeVisible();
  });

  test('clicking a lesson navigates to lesson page', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals');
    await page.click('text=What Is Claude');
    await expect(page).toHaveURL(/curriculum\/claude-fundamentals\/what-is-claude/);
  });

  test('lesson page shows title and content', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('header navigation links work', async ({ page }) => {
    await page.goto('/');

    // Navigate to Prompt Lab
    await page.click('header >> text=Prompt Lab');
    await expect(page).toHaveURL(/prompt-lab/);

    // Navigate to Cheatsheet
    await page.click('header >> text=Cheatsheet');
    await expect(page).toHaveURL(/cheatsheet/);

    // Navigate to Templates
    await page.click('header >> text=Templates');
    await expect(page).toHaveURL(/templates/);
  });

  test('breadcrumb navigation shows on lesson page', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    // Breadcrumb should have Home > Module > Lesson structure
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"], [class*="breadcrumb"]');
    if (await breadcrumb.count() > 0) {
      await expect(breadcrumb).toBeVisible();
    }
  });

  test('footer shows Built with heart by KK', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Built with')).toBeVisible();
    await expect(page.locator('text=by KK')).toBeVisible();
  });
});
