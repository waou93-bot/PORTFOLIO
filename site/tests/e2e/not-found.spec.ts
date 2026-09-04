import { expect, test } from '@playwright/test';

test.describe('Page 404', () => {
  test('affiche une page 404 avec des liens utiles', async ({ page }) => {
    const response = await page.goto('/cette-page-n-existe-pas');
    expect(response?.status()).toBe(404);

    await expect(page.getByRole('heading', { level: 1 })).toContainText("n'existe pas");
    await expect(page.getByRole('link', { name: "Retour à l'accueil" })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Voir les projets' })).toBeVisible();
  });
});
