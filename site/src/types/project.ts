import type { CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;
export type Project = ProjectEntry['data'];

export type ProjectKind = Project['kind'];
export type RightsStatus = Project['rightsStatus'];
export type PublicationStatus = Project['publicationStatus'];
export type BrandUsage = Project['brandUsage'];

export const PROJECT_KIND_LABELS: Record<ProjectKind, string> = {
  client: 'Client',
  collaboration: 'Collaboration',
  personal: 'Personnel',
  concept: 'Concept indépendant',
  redesign: 'Redesign',
  experimental: 'Expérimental',
};

export const RIGHTS_LABELS: Record<RightsStatus, string> = {
  confirmed: 'Publication autorisée',
  pending: 'Droits en attente',
  restricted: 'Usage restreint',
  'not-required': 'Non requis',
};
