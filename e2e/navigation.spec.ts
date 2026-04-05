import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  test('landing page loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-heading')).toBeVisible();
    await expect(page.getByTestId('start-learning-btn').first()).toBeVisible();
  });

  test('landing page shows arc cards section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('arc-cards')).toBeVisible();
  });

  test('landing page shows stats bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('stats-bar')).toBeVisible();
  });

  test('Start Learning button navigates to curriculum', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('start-learning-btn').first().click();
    await expect(page).toHaveURL(/curriculum/);
  });

  test('curriculum page shows module cards', async ({ page }) => {
    await page.goto('/curriculum');
    await expect(page.getByTestId('module-card-claude-fundamentals')).toBeVisible();
    await expect(page.getByTestId('module-card-prompt-engineering')).toBeVisible();
    await expect(page.getByTestId('module-card-claude-code-basics')).toBeVisible();
  });

  test('curriculum page shows arc sections', async ({ page }) => {
    await page.goto('/curriculum');
    await expect(page.getByTestId('arc-foundation')).toBeVisible();
    await expect(page.getByTestId('arc-practitioner')).toBeVisible();
  });

  test('clicking a module navigates to module page', async ({ page }) => {
    await page.goto('/curriculum');
    await page.getByTestId('module-card-claude-fundamentals').click();
    await expect(page).toHaveURL(/curriculum\/claude-fundamentals/);
  });

  test('module page shows title and lessons', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals');
    await expect(page.getByTestId('module-title')).toBeVisible();
    await expect(page.getByTestId('lesson-item-what-is-claude')).toBeVisible();
  });

  test('clicking a lesson navigates to lesson page', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals');
    await page.getByTestId('lesson-item-what-is-claude').click();
    await expect(page).toHaveURL(/curriculum\/claude-fundamentals\/what-is-claude/);
  });

  test('lesson page shows title', async ({ page }) => {
    await page.goto('/curriculum/claude-fundamentals/what-is-claude');
    await expect(page.getByTestId('lesson-title')).toBeVisible();
  });

  test('header navigation links work (desktop)', async ({ page, browserName }, testInfo) => {
    // Skip on mobile — nav links are behind hamburger menu
    test.skip(testInfo.project.name === 'mobile', 'Nav links hidden on mobile');

    await page.goto('/');

    await page.getByTestId('nav-prompt-lab').click();
    await expect(page).toHaveURL(/prompt-lab/);

    await page.getByTestId('nav-cheatsheet').click();
    await expect(page).toHaveURL(/cheatsheet/);

    await page.getByTestId('nav-templates').click();
    await expect(page).toHaveURL(/templates/);

    await page.getByTestId('nav-curriculum').click();
    await expect(page).toHaveURL(/curriculum/);
  });

  test('header and logo are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('site-logo')).toBeVisible();
  });

  test('footer shows credit text', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('site-footer')).toBeVisible();
    await expect(page.getByTestId('footer-credit')).toBeVisible();
  });
});
