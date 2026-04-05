import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  readonly heading: Locator;
  readonly profileCard: Locator;
  readonly displayNameInput: Locator;
  readonly saveBtn: Locator;
  readonly email: Locator;
  readonly joinDate: Locator;
  readonly avatar: Locator;
  readonly avatarPlaceholder: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('profile-heading');
    this.profileCard = page.getByTestId('profile-card');
    this.displayNameInput = page.getByTestId('profile-display-name');
    this.saveBtn = page.getByTestId('profile-save-btn');
    this.email = page.getByTestId('profile-email');
    this.joinDate = page.getByTestId('profile-join-date');
    this.avatar = page.getByTestId('profile-avatar');
    this.avatarPlaceholder = page.getByTestId('profile-avatar-placeholder');
  }

  async editName(name: string) {
    await this.displayNameInput.clear();
    await this.displayNameInput.fill(name);
  }

  async save() {
    await this.saveBtn.click();
  }
}
