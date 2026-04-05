import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CertificatePage extends BasePage {
  readonly certificateCard: Locator;
  readonly certificateTitle: Locator;
  readonly certificateName: Locator;
  readonly certificateDate: Locator;
  readonly certificateNumber: Locator;
  readonly lockedHeading: Locator;
  readonly lockedCta: Locator;
  readonly shareBtn: Locator;
  readonly downloadBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.certificateCard = page.getByTestId('certificate-card');
    this.certificateTitle = page.getByTestId('certificate-title');
    this.certificateName = page.getByTestId('certificate-name');
    this.certificateDate = page.getByTestId('certificate-date');
    this.certificateNumber = page.getByTestId('certificate-number');
    this.lockedHeading = page.getByTestId('certificate-locked-heading');
    this.lockedCta = page.getByTestId('certificate-locked-cta');
    this.shareBtn = page.getByTestId('certificate-share-btn');
    this.downloadBtn = page.getByTestId('certificate-download-btn');
  }

  async isLocked(): Promise<boolean> {
    return this.lockedHeading.isVisible();
  }

  async getTitle(): Promise<string | null> {
    if (await this.certificateTitle.isVisible()) {
      return this.certificateTitle.textContent();
    }
    return null;
  }
}
