import { describe, it, expect } from 'vitest';
import { absUrl, pageTitle, personLd, websiteLd, creativeWorkLd } from '../../src/lib/seo';
import { site } from '../../src/config/site';

describe('absUrl', () => {
  it('résout un chemin relatif depuis site.url', () => {
    expect(absUrl('/work')).toBe(`${site.url}/work`);
  });
});

describe('pageTitle', () => {
  it('retourne le titre du site sans argument', () => {
    expect(pageTitle()).toBe(site.title);
  });

  it('concatène titre + nom avec séparateur', () => {
    expect(pageTitle('Projets')).toBe(`Projets — ${site.name}`);
  });
});

describe('JSON-LD', () => {
  it('personLd expose des informations exactes', () => {
    const ld = personLd();
    expect(ld).toMatchObject({ '@type': 'Person', name: site.name, knowsLanguage: ['fr'] });
  });

  it('websiteLd expose les métadonnées du site', () => {
    const ld = websiteLd();
    expect(ld).toMatchObject({ '@type': 'WebSite', inLanguage: site.lang });
  });

  it('creativeWorkLd utilise le lien live via relatedLink', () => {
    const project = {
      data: {
        title: 'Down Trigger',
        slug: 'down-trigger',
        summary: 'Résumé du projet.',
        capturedAt: '2026-05-01',
        liveUrl: 'https://downtrigger.fr/',
        role: ['Direction artistique'],
      },
    } as never;
    const ld = creativeWorkLd(project as never);
    expect(ld).toMatchObject({
      '@type': 'CreativeWork',
      name: 'Down Trigger',
      dateCreated: '2026-05-01',
      relatedLink: 'https://downtrigger.fr/',
    });
    expect(ld.url).toBe(`${site.url}/work/down-trigger`);
  });
});
