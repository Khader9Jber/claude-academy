import { test, expect } from '@playwright/test';
import { AuthPage } from './pages';

test.describe('Auth Pages', () => {
  test('login page loads with email and password fields', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/login');
    await expect(auth.loginForm).toBeVisible();
    await expect(auth.loginEmailInput).toBeVisible();
    await expect(auth.loginPasswordInput).toBeVisible();
  });

  test('login page shows heading', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/login');
    await expect(auth.loginHeading).toBeVisible();
    await expect(auth.loginHeading).toContainText('Welcome back');
  });

  test('login page has Google and GitHub OAuth buttons', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/login');
    await expect(auth.loginGoogleBtn).toBeVisible();
    await expect(auth.loginGithubBtn).toBeVisible();
  });

  test('login page has link to signup page', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/login');
    await expect(auth.loginSignupLink).toBeVisible();
    await auth.loginSignupLink.click();
    await expect(page).toHaveURL(/\/auth\/signup/);
  });

  test('login page has submit button', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/login');
    await expect(auth.loginSubmitBtn).toBeVisible();
  });

  test('signup page loads with email and password fields', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/signup');
    await expect(auth.signupForm).toBeVisible();
    await expect(auth.signupEmailInput).toBeVisible();
    await expect(auth.signupPasswordInput).toBeVisible();
  });

  test('signup page shows heading', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/signup');
    await expect(auth.signupHeading).toBeVisible();
    await expect(auth.signupHeading).toContainText('Create your account');
  });

  test('signup page has link to login page', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/signup');
    await expect(auth.signupLoginLink).toBeVisible();
    await auth.signupLoginLink.click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('signup page has display name field', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/signup');
    await expect(auth.signupNameInput).toBeVisible();
  });

  test('Sign In button visible in header when not logged in', async ({ page }, testInfo) => {
    // Sign In button is hidden on mobile via sm:flex
    test.skip(testInfo.project.name === 'mobile', 'Sign In button hidden on mobile');

    const auth = new AuthPage(page);
    await auth.navigateTo('/');
    await expect(auth.headerLoginBtn).toBeVisible();
  });

  test('data-testid selectors work on login form', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/login');
    // Verify all key data-testid attributes are present
    await expect(page.getByTestId('auth-login-form')).toBeAttached();
    await expect(page.getByTestId('auth-login-email')).toBeAttached();
    await expect(page.getByTestId('auth-login-password')).toBeAttached();
    await expect(page.getByTestId('auth-login-submit')).toBeAttached();
    await expect(page.getByTestId('auth-login-google')).toBeAttached();
    await expect(page.getByTestId('auth-login-github')).toBeAttached();
  });

  test('data-testid selectors work on signup form', async ({ page }) => {
    const auth = new AuthPage(page);
    await auth.navigateTo('/auth/signup');
    await expect(page.getByTestId('auth-signup-form')).toBeAttached();
    await expect(page.getByTestId('auth-signup-email')).toBeAttached();
    await expect(page.getByTestId('auth-signup-password')).toBeAttached();
    await expect(page.getByTestId('auth-signup-submit')).toBeAttached();
  });
});
