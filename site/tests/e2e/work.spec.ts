import { expect, test } from '@playwright/test';

test.describe('Projets', () => {
  test('affiche l’état vide tant qu’aucun projet n’est publié', async ({ page }) => {
    await page.goto('/work');

    await expect(page.getByRole('heading', { name: 'Selected Works' })).toBeVisible();
    await expect(page.getByText('Les études de cas arrivent.')).toBeVisible();
    await expect(page.getByRole('link', { name: "Parler d'un projet" }).first()).toBeVisible();
  });

  test('chaque projet en brouillon ne doit pas être visible publiquement', async ({ page }) => {
    await page.goto('/work');
    await expect(page.locator('.project-card')).toHaveCount(0);
  });
});
