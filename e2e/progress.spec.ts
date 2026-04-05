import { test, expect } from '@playwright/test';
import { LessonPage, ProgressPage } from './pages';

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('lesson shows Mark as Complete button', async ({ page }) => {
    const lesson = new LessonPage(page);
    await lesson.navigateTo('/curriculum/claude-fundamentals/what-is-claude');
    await expect(lesson.markCompleteBtn).toBeVisible();
  });

  test('clicking Mark as Complete changes button state', async ({ page }) => {
    const lesson = new LessonPage(page);
    await lesson.navigateTo('/curriculum/claude-fundamentals/what-is-claude');
    await lesson.markAsComplete();
    // Should show completed state
    await expect(lesson.completedIndicator).toBeVisible();
  });

  test('completed lesson persists after page reload', async ({ page }) => {
    const lesson = new LessonPage(page);
    await lesson.navigateTo('/curriculum/claude-fundamentals/what-is-claude');
    await lesson.markAsComplete();
    await expect(lesson.completedIndicator).toBeVisible();

    // Reload the page
    await page.reload();
    // Should still show completed
    await expect(lesson.completedIndicator).toBeVisible();
  });

  test('progress page loads with heading', async ({ page }) => {
    const progress = new ProgressPage(page);
    await progress.navigateTo('/progress');
    await expect(progress.heading).toBeVisible();
  });

  test('progress dashboard shows stats', async ({ page }) => {
    const progress = new ProgressPage(page);
    await progress.navigateTo('/progress');
    await expect(progress.statLessons).toBeVisible();
    await expect(progress.statQuizzes).toBeVisible();
    await expect(progress.statStreak).toBeVisible();
    await expect(progress.statAchievements).toBeVisible();
  });

  test('reset progress button exists with confirmation', async ({ page }) => {
    const progress = new ProgressPage(page);
    await progress.navigateTo('/progress');
    await progress.clickReset();
    // Should show confirmation
    await expect(progress.confirmResetBtn).toBeVisible();
  });
});
