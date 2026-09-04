import type { CollectionEntry } from 'astro:content';
import { site, profile } from '../config/site';

export function absUrl(path: string): string {
  return new URL(path, site.url).toString();
}

export function ogImageUrl(slug: string): string {
  return absUrl(`/media/projects/${slug}/cover.svg`);
}

/** <title> avec séparateur cohérent. */
export function pageTitle(title?: string): string {
  if (!title) return site.title;
  return `${title} — ${site.name}`;
}

/** JSON-LD Person (informations exactes uniquement). */
export function personLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    jobTitle: profile.role,
    knowsLanguage: ['fr'],
    ...(site.email ? { email: site.email } : {}),
  };
}

/** JSON-LD WebSite. */
export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.title,
    url: site.url,
    inLanguage: site.lang,
  };
}

/** JSON-LD ItemList pour /work. */
export function itemListLd(projects: CollectionEntry<'projects'>[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projets sélectionnés',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absUrl(`/work/${p.data.slug}`),
      name: p.data.title,
    })),
  };
}

/**
 * JSON-LD CreativeWork par étude de cas.
 * url = page de l'étude de cas ; le site en ligne (si présent) est exposé via relatedLink.
 */
export function creativeWorkLd(project: CollectionEntry<'projects'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.data.title,
    url: absUrl(`/work/${project.data.slug}`),
    description: project.data.summary,
    creator: { '@type': 'Person', name: site.name },
    ...(project.data.capturedAt ? { dateCreated: project.data.capturedAt } : {}),
    ...(project.data.liveUrl ? { relatedLink: project.data.liveUrl } : {}),
  };
}
