import { expect, test } from '@playwright/test';

test.describe('Pages légales', () => {
  test('mentions légales : sections présentes', async ({ page }) => {
    await page.goto('/mentions-legales');
    await expect(page.getByRole('heading', { name: 'Mentions légales' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Éditeur du site' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hébergement' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Propriété intellectuelle' })).toBeVisible();
  });

  test('confidentialité : sections présentes', async ({ page }) => {
    await page.goto('/confidentialite');
    await expect(page.getByRole('heading', { name: 'Politique de confidentialité' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Données collectées' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vos droits' })).toBeVisible();
  });
});
