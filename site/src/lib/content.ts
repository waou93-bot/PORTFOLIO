import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../config/site';

const PUBLISHED = 'published';

/**
 * Projets visibles publiquement : statut published.
 * Un projet client avec droits pending est bloqué par le validateur
 * (validate-content) ; le build le filtre ici par sécurité.
 */
export async function getPublishedProjects() {
  const all = (await getCollection('projects')) as CollectionEntry<'projects'>[];
  return all
    .filter((p: CollectionEntry<'projects'>) => p.data.publicationStatus === PUBLISHED)
    .sort(
      (a: CollectionEntry<'projects'>, b: CollectionEntry<'projects'>) =>
        Number(b.data.year) - Number(a.data.year),
    );
}

export async function getFeaturedProjects() {
  const projects = await getPublishedProjects();
  return projects.filter((p: CollectionEntry<'projects'>) => p.data.featured);
}

/**
 * Projets visibles en développement/preview (inclut les drafts).
 * Contrôlé par feature flag : ne jamais activer en production.
 */
export async function getVisibleProjects() {
  const all = (await getCollection('projects')) as CollectionEntry<'projects'>[];
  const sorted = [...all].sort((a, b) => Number(b.data.year) - Number(a.data.year));
  if (site.features.showDrafts) return sorted;
  return sorted.filter((p) => p.data.publicationStatus === PUBLISHED);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getVisibleProjects();
  return projects.find((p) => p.data.slug === slug);
}

export function isPublished(p: CollectionEntry<'projects'>) {
  return p.data.publicationStatus === PUBLISHED;
}

export function projectNav(projects: CollectionEntry<'projects'>[], slug: string) {
  const idx = projects.findIndex((p) => p.data.slug === slug);
  if (idx === -1) return null;
  const next = projects[(idx + 1) % projects.length] ?? projects[0];
  if (!next) return null;
  return { next };
}
