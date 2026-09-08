import { expect, test } from '@playwright/test';

test.describe('Accueil', () => {
  test('affiche le hero, la navigation et les sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nicolas Jez|Portfolio/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('vision');
    await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voir mon univers' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Proposer une collaboration' }).first(),
    ).toBeVisible();

    await expect(page.getByText('Voir mon univers')).toBeVisible();
  });

  test('les liens de navigation mènent aux bonnes pages', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.site-nav');

    await nav.getByRole('link', { name: 'À propos' }).click();
    await expect(page).toHaveURL(/\/about/);

    await page.goto('/');
    await page.locator('.site-nav').getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('conserve les quatre accès projet dans le hero interactif', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-flip-projects] a')).toHaveCount(4);
  });
});
