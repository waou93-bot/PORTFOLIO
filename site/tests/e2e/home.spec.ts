import { expect, test } from '@playwright/test';

test.describe('Accueil', () => {
  test('affiche le hero, la navigation et les sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nicolas Jez|Portfolio/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('templates');
    await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Découvrir les projets' })).toBeVisible();
    await expect(page.getByRole('link', { name: "Parler d'un projet" }).first()).toBeVisible();

    await expect(page.getByRole('heading', { name: /Projets sélectionnés/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Comment je travaille' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ce que je fais' })).toBeVisible();
  });

  test('les liens de navigation mènent aux bonnes pages', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.site-nav');

    await nav.getByRole('link', { name: 'Projets' }).click();
    await expect(page).toHaveURL(/\/work/);

    await page.goto('/');
    await nav.getByRole('link', { name: 'À propos' }).click();
    await expect(page).toHaveURL(/\/about/);

    await page.goto('/');
    await nav.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('affiche les services du profil', async ({ page }) => {
    await page.goto('/');
    const services = page.locator('.services-item');
    await expect(services.first()).toBeVisible();
    await expect(services).not.toHaveCount(0);
  });
});
