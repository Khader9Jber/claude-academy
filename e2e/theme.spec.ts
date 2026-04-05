import { test, expect } from '@playwright/test';
import { LandingPage } from './pages';

test.describe('Light/Dark Mode', () => {
  test('page loads in dark mode by default', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    // The layout uses ThemeProvider with defaultTheme="dark" and attribute="class"
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });

  test('theme toggle button is visible', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    // The theme toggle has aria-label containing "theme"
    const toggle = page.getByRole('button', { name: /theme|switch to/i });
    await expect(toggle).toBeVisible();
  });

  test('clicking toggle changes theme from dark to light', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');

    // Verify starts in dark
    const htmlBefore = await page.locator('html').getAttribute('class');
    expect(htmlBefore).toContain('dark');

    // Click the toggle
    const toggle = page.getByRole('button', { name: /switch to light/i });
    await toggle.click();

    // After click, dark class should be removed
    const htmlAfter = await page.locator('html').getAttribute('class');
    expect(htmlAfter).not.toContain('dark');
  });

  test('clicking toggle twice returns to dark mode', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');

    // Click once to go to light
    const toggleToDark = page.getByRole('button', { name: /switch to light/i });
    await toggleToDark.click();

    // Click again to go back to dark
    const toggleToLight = page.getByRole('button', { name: /switch to dark/i });
    await toggleToLight.click();

    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });

  test('theme persists after page reload', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');

    // Switch to light mode
    const toggle = page.getByRole('button', { name: /switch to light/i });
    await toggle.click();

    // Verify light mode
    const htmlBefore = await page.locator('html').getAttribute('class');
    expect(htmlBefore).not.toContain('dark');

    // Reload the page
    await page.reload();

    // Theme should persist (next-themes uses localStorage)
    const htmlAfter = await page.locator('html').getAttribute('class');
    expect(htmlAfter).not.toContain('dark');
  });
});
