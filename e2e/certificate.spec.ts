import { test, expect } from '@playwright/test';
import { CertificatePage } from './pages';

const certificateTypes = ['foundation', 'practitioner', 'power-user', 'expert', 'full'];

test.describe('Certificate Pages', () => {
  for (const type of certificateTypes) {
    test(`certificate page loads for type: ${type}`, async ({ page }) => {
      const cert = new CertificatePage(page);
      await cert.navigateTo(`/certificate/${type}`);
      // The page should load without a 404 error.
      // For unauthenticated users it will redirect to login.
      await expect(page).not.toHaveURL(/\/404/);
    });
  }

  test('certificate page redirects unauthenticated users to login', async ({ page }) => {
    const cert = new CertificatePage(page);
    await cert.navigateTo('/certificate/foundation');
    // Unauthenticated users get redirected to the login page
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('certificate page is accessible (does not crash)', async ({ page }) => {
    const cert = new CertificatePage(page);
    await cert.navigateTo('/certificate/foundation');
    // Should show either the locked state heading or redirect — no crash
    await expect(cert.header).toBeVisible();
  });
});
