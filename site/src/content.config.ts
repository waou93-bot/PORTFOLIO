import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Statut du projet : client réel, collaboration, personnel, concept,
 * redesign non commandé, ou expérimentation.
 */
export const projectKindSchema = z.enum([
  'client',
  'collaboration',
  'personal',
  'concept',
  'redesign',
  'experimental',
]);

export const rightsStatusSchema = z.enum(['confirmed', 'pending', 'restricted', 'not-required']);
export const publicationStatusSchema = z.enum(['draft', 'private', 'published', 'archived']);
export const brandUsageSchema = z.enum([
  'real-client',
  'real-independent-concept',
  'fictional',
  'none',
]);
export const confidenceSchema = z.enum(['verified', 'reported', 'estimated']);

export const mediaAssetSchema = z.object({
  src: z.string().regex(/^\//), // chemin public/media/projects/<slug>/...
  alt: z.string().min(1, 'alt requis (accessibilité)'),
  poster: z.string().regex(/^\//).optional(),
  caption: z.string().optional(),
  credit: z.string().optional(),
});

export const verifiedResultSchema = z.object({
  value: z.string(),
  unit: z.string(),
  source: z.string().min(1, 'une métrique publiée doit avoir une source'),
  date: z.string(),
  confidence: confidenceSchema,
});

export const themeSchema = z.object({
  name: z.string().min(1),
  accent: z.string().min(1), // OKLCH
  accentContrast: z.string().min(1), // couleur texte lisible sur accent
  dark: z.boolean().default(false),
});

export const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug kebab-case requis'),
    title: z.string().min(1),
    clientName: z.string().optional(),
    kind: projectKindSchema,
    brandUsage: brandUsageSchema,
    publicationStatus: publicationStatusSchema,
    rightsStatus: rightsStatusSchema,
    year: z.string().min(1),
    sector: z.string().min(1),
    summary: z.string().min(1),
    role: z.array(z.string()).min(1),
    services: z.array(z.string()).min(1),
    featured: z.boolean().default(false),
    liveUrl: z.url().optional(),
    archivedUrl: z.url().optional(),
    cover: mediaAssetSchema,
    previewVideo: mediaAssetSchema.optional(),
    gallery: z.array(mediaAssetSchema).default([]),
    mobileGallery: z.array(mediaAssetSchema).default([]),
    theme: themeSchema,
    independentConceptDisclaimer: z.string().optional(),
    capturedAt: z.string().optional(),
    results: z.array(verifiedResultSchema).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { projects };
