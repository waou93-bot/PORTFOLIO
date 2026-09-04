import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  makeContactToken,
  verifyContactToken,
  validateContactInput,
  buildMailto,
  MIN_SUBMIT_MS,
  MAX_AGE_MS,
} from '../../src/lib/contact';

const SECRET = 'test-secret';

describe('validateContactInput', () => {
  it('accepte un formulaire valide et normalise les champs', () => {
    const res = validateContactInput({
      name: '  Ada Lovelace  ',
      email: 'ada@example.com',
      projectType: 'landing',
      message: '  Un projet immersif pour notre marque.  ',
    });
    expect(res.ok).toBe(true);
    expect(res.data).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      projectType: 'landing',
      message: 'Un projet immersif pour notre marque.',
    });
  });

  it('rejette les champs manquants ou invalides', () => {
    const res = validateContactInput({});
    expect(res.ok).toBe(false);
    expect(res.errors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      projectType: expect.any(String),
      message: expect.any(String),
    });
  });

  it('rejette un email invalide', () => {
    const res = validateContactInput({
      name: 'Ada',
      email: 'pas-un-email',
      projectType: 'landing',
      message: 'Message valide dix caractères',
    });
    expect(res.ok).toBe(false);
    expect(res.errors?.email).toBeDefined();
  });

  it('ignore les champs inattendus', () => {
    const res = validateContactInput({
      name: 'Ada',
      email: 'ada@example.com',
      projectType: 'landing',
      message: 'Message valide dix caractères',
      token: 'hack',
      submittedAt: 12345,
    });
    expect(res.ok).toBe(true);
  });
});

describe('makeContactToken / verifyContactToken', () => {
  beforeEach(() => {
    process.env.CONTACT_FORM_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.CONTACT_FORM_SECRET;
  });

  it('retourne null sans secret configuré', () => {
    delete process.env.CONTACT_FORM_SECRET;
    expect(makeContactToken()).toBeNull();
  });

  it('produit un jeton vérifiable au bon âge', () => {
    const now = Date.now() - MIN_SUBMIT_MS - 1000;
    const token = makeContactToken(now);
    expect(token).toContain('.');
    expect(verifyContactToken(token)).toBe(true);
  });

  it('rejette un jeton trop jeune (anti-bot)', () => {
    const token = makeContactToken(Date.now());
    expect(verifyContactToken(token)).toBe(false);
  });

  it('rejette un jeton expiré', () => {
    const token = makeContactToken(Date.now() - MAX_AGE_MS - 1000);
    expect(verifyContactToken(token)).toBe(false);
  });

  it('rejette un jeton falsifié', () => {
    const token = makeContactToken(Date.now() - MIN_SUBMIT_MS - 1000);
    const [payload] = token!.split('.');
    expect(verifyContactToken(`${payload}.deadbeef`)).toBe(false);
  });

  it('rejette un jeton signé avec un autre secret', () => {
    const token = makeContactToken(Date.now() - MIN_SUBMIT_MS - 1000);
    process.env.CONTACT_FORM_SECRET = 'autre-secret';
    expect(verifyContactToken(token)).toBe(false);
  });

  it('rejette une entrée non-chaîne', () => {
    expect(verifyContactToken(undefined)).toBe(false);
    expect(verifyContactToken(42)).toBe(false);
  });
});

describe('buildMailto', () => {
  it('construit une URL mailto correctement encodée', () => {
    const data = {
      name: 'Ada',
      email: 'ada@example.com',
      projectType: 'landing',
      message: 'Bonjour !',
    };
    const url = buildMailto(data, 'contact@example.com');
    expect(url).toMatch(/^mailto:contact@example\.com\?subject=/);
    expect(url).toContain(encodeURIComponent('Projet web — landing (Ada)'));
    expect(url).toContain(encodeURIComponent('Bonjour !'));
  });
});
