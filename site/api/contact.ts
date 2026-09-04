/**
 * Vercel Function — POST /api/contact
 * Protection : honeypot, jeton signé horodaté, rate limiting par IP, validation.
 * Aucune donnée stockée. Envoi via Resend si configuré, sinon fallback mailto.
 */
import type { ServerResponse, IncomingMessage } from 'node:http';
import {
  verifyContactToken,
  validateContactInput,
  buildMailto,
  HONEYPOT_FIELD,
  type ContactInput,
} from '../src/lib/contact';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function json(res: ServerResponse, code: number, payload: Record<string, unknown>) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function clientIp(req: IncomingMessage): string {
  const fwd = req.headers['x-forwarded-for'];
  const first = Array.isArray(fwd) ? fwd[0] : fwd;
  if (typeof first === 'string' && first) return first.split(',')[0]?.trim() ?? first;
  return req.socket.remoteAddress ?? 'unknown';
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => {
      body += c;
      if (body.length > 50_000) {
        reject(new Error('too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    json(res, 405, { error: 'method not allowed' });
    return;
  }

  const ip = clientIp(req);
  const now = Date.now();
  const hit = ipHits.get(ip);
  if (hit && hit.resetAt > now && hit.count >= RATE_LIMIT_MAX) {
    json(res, 429, { error: 'rate-limited' });
    return;
  }
  ipHits.set(ip, {
    count: hit && hit.resetAt > now ? hit.count + 1 : 1,
    resetAt: hit && hit.resetAt > now ? hit.resetAt : now + RATE_LIMIT_WINDOW_MS,
  });

  let input: Record<string, unknown>;
  try {
    input = await readBody(req);
  } catch {
    json(res, 400, { error: 'invalid request' });
    return;
  }

  // Honeypot
  if (input[HONEYPOT_FIELD]) {
    json(res, 200, { ok: true });
    return;
  }

  // Jeton horodaté (si secret configuré)
  if (process.env.CONTACT_FORM_SECRET && !verifyContactToken(input.token)) {
    json(res, 400, { error: 'invalid token' });
    return;
  }

  const { ok, data, errors } = validateContactInput(input);
  if (!ok || !data) {
    json(res, 400, { errors: errors ?? {} });
    return;
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    json(res, 503, { error: 'contact not configured' });
    return;
  }

  // Envoi via Resend si configuré, sinon fallback mailto (aucune donnée stockée).
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
          to: [to],
          replyTo: data.email,
          subject: `Projet web — ${data.projectType} (${data.name})`,
          text: `Nom : ${data.name}\nEmail : ${data.email}\nType : ${data.projectType}\n\n${data.message}`,
        }),
      });
      if (!r.ok) {
        json(res, 502, { error: 'mail provider error' });
        return;
      }
      json(res, 200, { ok: true });
      return;
    } catch {
      json(res, 502, { error: 'mail provider error' });
      return;
    }
  }

  // Fallback mailto honnête
  json(res, 200, { ok: true, mailto: buildMailto(data as ContactInput, to) });
}
