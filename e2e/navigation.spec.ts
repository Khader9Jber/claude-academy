import { test, expect } from '@playwright/test';
import { LandingPage, CurriculumPage, ModulePage, LessonPage } from './pages';

test.describe('Site Navigation', () => {
  test('landing page loads with hero section', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await expect(landing.heroHeading).toBeVisible();
    await expect(landing.startLearningBtn).toBeVisible();
  });

  test('landing page shows arc cards section', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await expect(landing.arcCards).toBeVisible();
  });

  test('landing page shows stats bar', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await expect(landing.statsBar).toBeVisible();
  });

  test('Start Learning button navigates to curriculum', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await landing.clickStartLearning();
    await expect(page).toHaveURL(/curriculum/);
  });

  test('curriculum page shows module cards', async ({ page }) => {
    const curriculum = new CurriculumPage(page);
    await curriculum.navigateTo('/curriculum');
    await expect(curriculum.moduleCard('claude-fundamentals')).toBeVisible();
    await expect(curriculum.moduleCard('prompt-engineering')).toBeVisible();
    await expect(curriculum.moduleCard('claude-code-basics')).toBeVisible();
  });

  test('curriculum page shows arc sections', async ({ page }) => {
    const curriculum = new CurriculumPage(page);
    await curriculum.navigateTo('/curriculum');
    await expect(curriculum.arcSection('foundation')).toBeVisible();
    await expect(curriculum.arcSection('practitioner')).toBeVisible();
  });

  test('clicking a module navigates to module page', async ({ page }) => {
    const curriculum = new CurriculumPage(page);
    await curriculum.navigateTo('/curriculum');
    await curriculum.clickModule('claude-fundamentals');
    await expect(page).toHaveURL(/curriculum\/claude-fundamentals/);
  });

  test('module page shows title and lessons', async ({ page }) => {
    const modulePage = new ModulePage(page);
    await modulePage.navigateTo('/curriculum/claude-fundamentals');
    await expect(modulePage.moduleTitle).toBeVisible();
    await expect(modulePage.lessonItem('what-is-claude')).toBeVisible();
  });

  test('clicking a lesson navigates to lesson page', async ({ page }) => {
    const modulePage = new ModulePage(page);
    await modulePage.navigateTo('/curriculum/claude-fundamentals');
    await modulePage.clickLesson('what-is-claude');
    await expect(page).toHaveURL(/curriculum\/claude-fundamentals\/what-is-claude/);
  });

  test('lesson page shows title', async ({ page }) => {
    const lesson = new LessonPage(page);
    await lesson.navigateTo('/curriculum/claude-fundamentals/what-is-claude');
    await expect(lesson.lessonTitle).toBeVisible();
  });

  test('header navigation links work (desktop)', async ({ page }, testInfo) => {
    // Skip on mobile — nav links are behind hamburger menu
    test.skip(testInfo.project.name === 'mobile', 'Nav links hidden on mobile');

    const landing = new LandingPage(page);
    await landing.navigateTo('/');

    await landing.goToPromptLab();
    await expect(page).toHaveURL(/prompt-lab/);

    await landing.goToCheatsheet();
    await expect(page).toHaveURL(/cheatsheet/);

    await landing.goToTemplates();
    await expect(page).toHaveURL(/templates/);

    await landing.goToCurriculum();
    await expect(page).toHaveURL(/curriculum/);
  });

  test('header and logo are visible', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await expect(landing.header).toBeVisible();
    await expect(landing.logo).toBeVisible();
  });

  test('footer shows credit text', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.navigateTo('/');
    await expect(landing.footer).toBeVisible();
    await expect(landing.footerCredit).toBeVisible();
  });
});
