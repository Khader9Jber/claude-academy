import { test, expect } from '@playwright/test';
import { LandingPage, CurriculumPage, LessonPage } from './pages';

test.describe('Responsive Design', () => {
  test('mobile: landing page renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await expect(landing.heroHeading).toBeVisible();
    await expect(landing.startLearningBtn).toBeVisible();
  });

  test('mobile: hamburger menu appears', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await expect(landing.mobileMenuBtn).toBeVisible();
  });

  test('tablet: curriculum page shows module cards', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const curriculum = new CurriculumPage(page);
    await curriculum.navigateTo('/curriculum');
    await expect(curriculum.moduleCard('claude-fundamentals')).toBeVisible();
  });

  test('desktop: lesson page shows title', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const lesson = new LessonPage(page);
    await lesson.navigateTo('/curriculum/claude-fundamentals/what-is-claude');
    await expect(lesson.lessonTitle).toBeVisible();
  });

  test('mobile: lesson page is scrollable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const lesson = new LessonPage(page);
    await lesson.navigateTo('/curriculum/claude-fundamentals/what-is-claude');
    await expect(lesson.lessonTitle).toBeVisible();
    // Should be able to scroll
    await page.evaluate(() => window.scrollTo(0, 500));
  });
});
