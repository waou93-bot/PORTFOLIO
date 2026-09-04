import { expect, test } from '@playwright/test';

test.describe('Contact', () => {
  test('affiche la validation côté client pour un envoi vide', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();

    await page.getByRole('button', { name: 'Envoyer le message' }).click();

    await expect(page.getByText('Veuillez indiquer votre nom.')).toBeVisible();
    await expect(page.getByText('Adresse email invalide.')).toBeVisible();
    await expect(page.getByText('Veuillez choisir un type de projet.')).toBeVisible();
    await expect(
      page.getByText('Votre message doit contenir au moins 10 caractères.'),
    ).toBeVisible();
    await expect(page.getByText('Certains champs sont à corriger.')).toBeVisible();
  });

  test('le honeypot capte les bots avec un succès silencieux', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('#website').fill('spam');
    await page.locator('#name').fill('Robot');
    await page.locator('#email').fill('robot@example.com');
    await page.locator('#projectType').selectOption('landing');
    await page.locator('#message').fill('Message automatique');

    await page.getByRole('button', { name: 'Envoyer le message' }).click();

    await expect(page.getByText('Merci, votre message a bien été envoyé.')).toBeVisible();
  });

  test('un envoi valide aboutit au fallback mailto (aucune donnée stockée)', async ({ page }) => {
    await page.goto('/contact');

    const token = await page.locator('#contact-form').getAttribute('data-token');
    expect(token).not.toBeNull();

    await page.locator('#name').fill('Ada Lovelace');
    await page.locator('#email').fill('ada@example.com');
    await page.locator('#projectType').selectOption('landing');
    await page.locator('#message').fill('Bonjour, j’aimerais parler d’une landing page immersive.');

    await page.getByRole('button', { name: 'Envoyer le message' }).click();

    const status = page.locator('.form-status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Ouvrir ma messagerie');
    const link = status.locator('a');
    await expect(link).toHaveAttribute('href', /^mailto:test@example\.com\?subject=/);
  });

  test('n’envoie rien quand le token est absent (page pré-rendue)', async ({ page }) => {
    await page.goto('/contact');
    await page.evaluate(() => {
      const form = document.querySelector<HTMLFormElement>('#contact-form');
      if (form) form.dataset.token = '';
    });
    await page.locator('#name').fill('Ada Lovelace');
    await page.locator('#email').fill('ada@example.com');
    await page.locator('#projectType').selectOption('landing');
    await page.locator('#message').fill('Message valide avec dix caractères au minimum.');
    await page.getByRole('button', { name: 'Envoyer le message' }).click();
    await expect(page.locator('.form-status')).toBeVisible();
  });
});
