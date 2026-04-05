import { test, expect } from '@playwright/test';
import { ProfilePage } from './pages';

test.describe('Profile Page', () => {
  test('profile page redirects to login when not authenticated', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.navigateTo('/profile');
    // The profile page redirects unauthenticated users to /auth/login
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('profile page does not show profile content when not authenticated', async ({ page }) => {
    const profile = new ProfilePage(page);
    await profile.navigateTo('/profile');
    // The heading should not be visible for unauthenticated users
    // (they get redirected before it renders)
    await expect(profile.heading).not.toBeVisible({ timeout: 5000 });
  });
});
