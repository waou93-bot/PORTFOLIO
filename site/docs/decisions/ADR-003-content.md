# ADR-003 — Contenu : fichiers typés locaux + content layer Astro (glob + Zod)

**Statut** : Accepté · **Date** : 2026-07-31 · **Auteur** : Orchestrateur / Agent 9

## Contexte

Études de cas structurées, validation stricte au build, ajout d'un projet < 10 min, pas de CMS lourd au lancement.

## Options considérées

1. Content layer Astro (glob + schémas Zod 4) — **retenu**.
2. MDX par projet (rendu Markdown riche enrichi) — partiel (description longue en Markdown, reste en frontmatter).
3. CMS headless (Sanity, Contentful…) — rejeté (coût opérationnel, pas d'éditeur non-technique au lancement). Flag P2 si besoin futur.
4. JSON/TS brut sans validation — rejeté (pas de validation schéma, erreurs silencieuses).

## Décision

- **Un dossier par projet** : `src/content/projects/<slug>.md`.
- **Frontmatter validé par schéma Zod strict** (types ProjectKind, RightsStatus, PublicationStatus, BrandUsage, MediaAsset, VerifiedResult, ProjectTheme…).
- Description riche en **Markdown** (étude de cas éditoriale).
- Build **échoue** si : champ obligatoire vide, média sans alt, projet réel avec droits `pending` visible, métrique sans source, marque réelle sans statut, lien critique invalide.
- Propriété `TODO_CONTENT` pour toute information manquante — jamais de faux contenu.
- Commande `pnpm project:new` (slug → création dossier + contenu draft + assets + champs requis). Le projet reste en `draft`, exclu du sitemap et non indexable.

## Conséquences

- Les rédacteurs ne peuvent pas casser le modèle (validation au build).
- Ajout de projet = un fichier + des assets + `pnpm run build`.
- i18n future : fichiers traduits ou sous-dossiers `fr`/`en` sans refonte.

## Hypothèses

- A5 (pas de CMS headless) validée pour le lancement.
