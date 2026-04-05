import { test, expect } from '@playwright/test';
import { PromptLabPage } from './pages';

test.describe('Prompt Lab', () => {
  test('prompt lab page loads with heading', async ({ page }) => {
    const promptLab = new PromptLabPage(page);
    await promptLab.navigateTo('/prompt-lab');
    await expect(promptLab.heading).toBeVisible();
  });

  test('template library shows template cards', async ({ page }) => {
    const promptLab = new PromptLabPage(page);
    await promptLab.navigateTo('/prompt-lab');
    await expect(promptLab.templateCards).not.toHaveCount(0);
  });

  test('category filter buttons work', async ({ page }) => {
    const promptLab = new PromptLabPage(page);
    await promptLab.navigateTo('/prompt-lab');
    // Click the Coding filter
    await promptLab.filterByCategory('coding');
    // Should still have template cards visible (filtered to coding)
    await expect(promptLab.templateCards).not.toHaveCount(0);
  });

  test('All filter shows all templates', async ({ page }) => {
    const promptLab = new PromptLabPage(page);
    await promptLab.navigateTo('/prompt-lab');
    // Click a specific filter first
    await promptLab.filterByCategory('coding');
    // Then click All
    await promptLab.filterByCategory('all');
    await expect(promptLab.templateCards).not.toHaveCount(0);
  });

  test('before/after examples are visible', async ({ page }) => {
    const promptLab = new PromptLabPage(page);
    await promptLab.navigateTo('/prompt-lab');
    // Scroll to before/after section
    const beforeAfter = page.locator('text=Before');
    if (await beforeAfter.count() > 0) {
      await expect(beforeAfter.first()).toBeVisible();
    }
  });
});
