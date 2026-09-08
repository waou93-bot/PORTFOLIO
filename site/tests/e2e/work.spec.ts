import { expect, test } from '@playwright/test';

test.describe('Projets', () => {
  test('affiche la sélection de projets publiée', async ({ page }) => {
    await page.goto('/work');

    await expect(page.getByRole('heading', { name: 'Selected Works' })).toBeVisible();
    await expect(page.locator('.project-card')).toHaveCount(4);
    await expect(page.getByRole('link', { name: /Héritage 2/ })).toBeVisible();
  });

  test('les quatre projets de la sélection ont une fiche publique', async ({ page }) => {
    await page.goto('/work');
    for (const slug of ['down-trigger', 'heritage-2', 'maison-sillon', 'vantel']) {
      await expect(page.locator(`a[href="/work/${slug}"]`)).toBeVisible();
    }
  });
});
