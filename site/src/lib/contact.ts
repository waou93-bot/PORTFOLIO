/**
 * Anti-spam et validation du formulaire de contact.
 * S'exécute côté serveur (build Astro + Vercel Function).
 * Aucune donnée personnelle n'est stockée, ni envoyée à des tiers.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const MIN_SUBMIT_MS = 3000;
export const MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const HONEYPOT_FIELD = 'website';

export function getSecret(): string {
  return process.env.CONTACT_FORM_SECRET ?? '';
}

/** Jeton signé portant un horodatage (anti-bot sans CAPTCHA). */
export function makeContactToken(now = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = now.toString();
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifyContactToken(token: unknown): boolean {
  if (typeof token !== 'string') return false;
  const secret = getSecret();
  if (!secret) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;
  const age = Date.now() - Number(payload);
  if (Number.isNaN(age)) return false;
  return age >= MIN_SUBMIT_MS && age <= MAX_AGE_MS;
}

export interface ContactInput {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export function validateContactInput(input: Record<string, unknown>): {
  ok: boolean;
  data?: ContactInput;
  errors?: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

  const name = str(input.name);
  const email = str(input.email);
  const projectType = str(input.projectType);
  const message = str(input.message);

  if (name.length < 2) errors.name = 'Veuillez indiquer votre nom.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Adresse email invalide.';
  if (!projectType) errors.projectType = 'Veuillez choisir un type de projet.';
  if (message.length < 10) errors.message = 'Votre message doit contenir au moins 10 caractères.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, projectType, message } };
}

/** Redirige l'utilisateur vers sa messagerie (fallback honnête sans service payant). */
export function buildMailto(data: ContactInput, to: string): string {
  const subject = encodeURIComponent(`Projet web — ${data.projectType} (${data.name})`);
  const body = encodeURIComponent(
    `Nom : ${data.name}\nEmail : ${data.email}\nType de projet : ${data.projectType}\n\n${data.message}`,
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
