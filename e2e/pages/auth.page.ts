import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AuthPage extends BasePage {
  // Login form locators
  readonly loginForm: Locator;
  readonly loginHeading: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitBtn: Locator;
  readonly loginGoogleBtn: Locator;
  readonly loginGithubBtn: Locator;
  readonly loginSignupLink: Locator;
  readonly loginError: Locator;

  // Signup form locators
  readonly signupForm: Locator;
  readonly signupHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupPasswordInput: Locator;
  readonly signupSubmitBtn: Locator;
  readonly signupGoogleBtn: Locator;
  readonly signupGithubBtn: Locator;
  readonly signupLoginLink: Locator;
  readonly signupError: Locator;

  // Header auth locators
  readonly headerLoginBtn: Locator;
  readonly headerUserMenu: Locator;

  constructor(page: Page) {
    super(page);

    // Login
    this.loginForm = page.getByTestId('auth-login-form');
    this.loginHeading = page.getByTestId('auth-login-heading');
    this.loginEmailInput = page.getByTestId('auth-login-email');
    this.loginPasswordInput = page.getByTestId('auth-login-password');
    this.loginSubmitBtn = page.getByTestId('auth-login-submit');
    this.loginGoogleBtn = page.getByTestId('auth-login-google');
    this.loginGithubBtn = page.getByTestId('auth-login-github');
    this.loginSignupLink = page.getByTestId('auth-login-signup-link');
    this.loginError = page.getByTestId('auth-login-error');

    // Signup
    this.signupForm = page.getByTestId('auth-signup-form');
    this.signupHeading = page.getByTestId('auth-signup-heading');
    this.signupNameInput = page.getByTestId('auth-signup-name');
    this.signupEmailInput = page.getByTestId('auth-signup-email');
    this.signupPasswordInput = page.getByTestId('auth-signup-password');
    this.signupSubmitBtn = page.getByTestId('auth-signup-submit');
    this.signupGoogleBtn = page.getByTestId('auth-signup-google');
    this.signupGithubBtn = page.getByTestId('auth-signup-github');
    this.signupLoginLink = page.getByTestId('auth-signup-login-link');
    this.signupError = page.getByTestId('auth-signup-error');

    // Header
    this.headerLoginBtn = page.getByTestId('auth-login-btn');
    this.headerUserMenu = page.getByTestId('auth-user-menu');
  }

  async fillLoginEmail(email: string) {
    await this.loginEmailInput.fill(email);
  }

  async fillLoginPassword(password: string) {
    await this.loginPasswordInput.fill(password);
  }

  async submitLogin() {
    await this.loginSubmitBtn.click();
  }

  async clickLoginGoogle() {
    await this.loginGoogleBtn.click();
  }

  async clickLoginGithub() {
    await this.loginGithubBtn.click();
  }

  async fillSignupEmail(email: string) {
    await this.signupEmailInput.fill(email);
  }

  async fillSignupPassword(password: string) {
    await this.signupPasswordInput.fill(password);
  }

  async submitSignup() {
    await this.signupSubmitBtn.click();
  }

  async clickSignupGoogle() {
    await this.signupGoogleBtn.click();
  }

  async clickSignupGithub() {
    await this.signupGithubBtn.click();
  }
}
