# Stratégie — Modèle de contenu (schéma Zod)

Validation stricte au build (ADR-003). Les types ci-dessous sont implémentés dans `src/content/config.ts` et les types dérivés dans `src/types/project.ts`.

## Types énumérés

```ts
ProjectKind = 'client' | 'collaboration' | 'personal' | 'concept' | 'redesign' | 'experimental';
RightsStatus = 'confirmed' | 'pending' | 'restricted' | 'not-required';
PublicationStatus = 'draft' | 'private' | 'published' | 'archived';
BrandUsage = 'real-client' | 'real-independent-concept' | 'fictional' | 'none';
```

## Interface Project (frontmatter)

```ts
interface Project {
  slug: string; // identifiant d'URL
  title: string;
  clientName?: string;
  kind: ProjectKind;
  brandUsage: BrandUsage;
  publicationStatus: PublicationStatus;
  rightsStatus: RightsStatus;
  year: string; // "2026" ou "2024–2025"
  sector: string;
  summary: string;
  role: string[];
  services: string[];
  featured: boolean;
  liveUrl?: string;
  archivedUrl?: string; // archive visuelle si le site n'est plus dispo
  cover: { src: string; alt: string };
  previewVideo?: { src: string; poster?: string; alt: string }; // ou objet MediaAsset
  gallery: MediaAsset[];
  mobileGallery?: MediaAsset[];
  theme: ProjectTheme; // accent couleur par projet
  independentConceptDisclaimer?: string;
  capturedAt?: string; // date de capture des visuels
  // étude de cas éditoriale (Markdown = contenu du fichier)
  context?;
  challenge?;
  objective?;
  strategy?;
  artDirection?;
  uxApproach?;
  technicalApproach?;
  results?;
}
```

### MediaAsset

```ts
interface MediaAsset {
  src: string; // chemin public/media/projects/<slug>/...
  alt: string; // obligatoire, approprié
  caption?: string;
  credit?: string;
}
```

### VerifiedResult (métrique publiée)

```ts
interface VerifiedResult {
  value: string;
  unit: string;
  source: string; // d'où vient le chiffre
  date: string;
  confidence: 'verified' | 'reported' | 'estimated';
}
```

**Aucune métrique sans source** → le build échoue. Par défaut aucune métrique.

### ProjectTheme

```ts
interface ProjectTheme {
  accent: string; // couleur OKLCH, ex "oklch(0.55 0.19 25)"
  dark?: boolean; // si la page projet doit ouvrir en fond sombre
  name: string; // label lisible
}
```

## Règles de validation (échouent le build si violées)

1. Champs obligatoires présents.
2. `cover.alt` et tous les `alt` non vides.
3. Projet `kind: "client"` avec `rightsStatus !== "confirmed"` → doit être `draft`/`private` (jamais `published`).
4. `brandUsage: "real-independent-concept"` → `independentConceptDisclaimer` requis.
5. Toute métrique avec `source` vide → erreur.
6. `slug` unique, format kebab-case.
7. `publicationStatus: "published"` uniquement si tous les contenus requis sont renseignés (pas de `TODO_CONTENT`).
8. Les chemins de médias pointent vers des fichiers existants.
9. Lien `liveUrl` valide (http/https) si renseigné.

## Structure de fichier par projet

```
src/content/projects/
  <slug>.md          ← frontmatter validé + étude de cas en Markdown
public/media/projects/<slug>/
  cover.avif | cover.webp
  gallery/*.avif
  preview.mp4 | preview.webm
  poster.webp
```

Dossier `scripts/create-project/` génère tout (commande `pnpm project:new`).
