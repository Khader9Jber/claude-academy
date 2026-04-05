import { test, expect } from '@playwright/test';
import { TemplatesPage } from './pages';

test.describe('Templates', () => {
  test('templates page loads', async ({ page }) => {
    const templates = new TemplatesPage(page);
    await templates.navigateTo('/templates');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('templates show template cards with copy buttons', async ({ page }) => {
    const templates = new TemplatesPage(page);
    await templates.navigateTo('/templates');
    await expect(templates.templateCards).not.toHaveCount(0);
    // Each template should have a Copy button
    await expect(page.locator('text=Copy')).not.toHaveCount(0);
  });

  test('template categories are filterable', async ({ page }) => {
    const templates = new TemplatesPage(page);
    await templates.navigateTo('/templates');
    // Look for category filter buttons
    const hookFilter = page.locator('button:has-text("Hook"), button:has-text("Hooks")');
    if (await hookFilter.count() > 0) {
      await hookFilter.click();
      // Should still show template cards
      await expect(templates.templateCards).not.toHaveCount(0);
    }
  });

  test('templates show code previews', async ({ page }) => {
    const templates = new TemplatesPage(page);
    await templates.navigateTo('/templates');
    // Templates should have pre/code blocks
    await expect(templates.codeBlocks).not.toHaveCount(0);
  });
});
