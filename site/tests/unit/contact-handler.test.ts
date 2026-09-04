import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import type { ServerResponse, IncomingMessage } from 'node:http';
import handler from '../../api/contact';

function makeReq(method: string, body: unknown, ip = '203.0.113.1') {
  const req = new EventEmitter() as unknown as IncomingMessage;
  req.method = method;
  req.headers = { 'x-forwarded-for': ip };
  req.socket = { remoteAddress: '127.0.0.1' } as unknown as IncomingMessage['socket'];
  setTimeout(() => {
    if (body !== undefined) req.emit('data', JSON.stringify(body));
    req.emit('end');
  }, 0);
  return req;
}

function makeRes() {
  let status = 200;
  const headers: Record<string, string> = {};
  let body = '';
  const res = {
    set statusCode(v: number) {
      status = v;
    },
    get statusCode() {
      return status;
    },
    setHeader(k: string, v: string) {
      headers[k] = v;
    },
    end(payload?: unknown) {
      if (typeof payload === 'string') body = payload;
    },
    getHeader(k: string) {
      return headers[k];
    },
  } as unknown as ServerResponse;
  return {
    res,
    getStatus: () => status,
    getBody: () => JSON.parse(body || '{}') as Record<string, unknown>,
  };
}

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  projectType: 'landing',
  message: 'Un message valide de plus de dix caractères.',
};

describe('api/contact handler', () => {
  beforeEach(() => {
    process.env.CONTACT_EMAIL = 'test@example.com';
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FORM_SECRET;
  });
  afterEach(() => {
    delete process.env.CONTACT_EMAIL;
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FORM_SECRET;
  });

  it('refuse les méthodes autres que POST', async () => {
    const { res, getStatus, getBody } = makeRes();
    await handler(makeReq('GET', undefined), res);
    expect(getStatus()).toBe(405);
    expect(getBody().error).toBe('method not allowed');
  });

  it('retourne le fallback mailto sans stockage', async () => {
    const { res, getStatus, getBody } = makeRes();
    await handler(makeReq('POST', VALID), res);
    expect(getStatus()).toBe(200);
    expect(getBody()).toMatchObject({ ok: true });
    expect(getBody().mailto).toMatch(/^mailto:test@example\.com\?subject=/);
  });

  it('retourne 503 si aucun email de destination n’est configuré', async () => {
    delete process.env.CONTACT_EMAIL;
    const { res, getStatus, getBody } = makeRes();
    await handler(makeReq('POST', VALID), res);
    expect(getStatus()).toBe(503);
    expect(getBody().error).toBe('contact not configured');
  });

  it('neutralise le honeypot même avec un corps invalide', async () => {
    const { res, getStatus, getBody } = makeRes();
    await handler(makeReq('POST', { website: 'spam' }), res);
    expect(getStatus()).toBe(200);
    expect(getBody()).toEqual({ ok: true });
  });

  it('valide le formulaire et renvoie les erreurs champ par champ', async () => {
    const { res, getStatus, getBody } = makeRes();
    await handler(makeReq('POST', {}), res);
    expect(getStatus()).toBe(400);
    expect(getBody().errors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      projectType: expect.any(String),
      message: expect.any(String),
    });
  });

  it('rejette un jeton invalide quand un secret est configuré', async () => {
    process.env.CONTACT_FORM_SECRET = 'test-secret';
    const { res, getStatus, getBody } = makeRes();
    await handler(makeReq('POST', { ...VALID, token: 'falsifie' }), res);
    expect(getStatus()).toBe(400);
    expect(getBody().error).toBe('invalid token');
  });

  it('limite le débit par IP (429 au-delà de 5 requêtes)', async () => {
    for (let i = 0; i < 5; i += 1) {
      const { res } = makeRes();
      await handler(makeReq('POST', VALID, '198.51.100.9'), res);
    }
    const { res, getStatus, getBody } = makeRes();
    await handler(makeReq('POST', VALID, '198.51.100.9'), res);
    expect(getStatus()).toBe(429);
    expect(getBody().error).toBe('rate-limited');
  });

  it('ne limite pas les IP distinctes', async () => {
    for (let i = 0; i < 6; i += 1) {
      const { res, getStatus } = makeRes();
      await handler(makeReq('POST', VALID, `198.51.100.${i}`), res);
      expect(getStatus()).toBe(200);
    }
  });
});
