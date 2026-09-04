# ADR-001 — Framework : Astro (statique)

**Statut** : Accepté · **Date** : 2026-07-31 · **Auteur** : Orchestrateur / Agent 1

## Contexte

Portfolio statique premium : accueil, index projets, études de cas, about, contact. Contenu majoritairement statique, JS interactif minimal, SEO et performance critiques (LCP ≤ 2.5 s mobile).

## Candidats évalués

Astro 7.1.6 · Next.js 16.2.12 · SvelteKit 2.70.2 · Nuxt 4.5.1 · Vite 8 vanilla.
Détails factuels : docs/research/github-stack-audit.md (+ .csv).

## Décision

**Astro 7.1.6**, rendu statique (`output: "static"`), îlots d'hydratation seulement là où c'est nécessaire, TypeScript `strictest`, content layer (glob + Zod 4) pour les projets.

## Raisons

1. **0 Ko JS par défaut** → LCP dépend du HTML, des fonts et des images optimisées, jamais d'un runtime.
2. **Content collections typées** = le modèle de contenu des études de cas est validé au build (champs requis, médias, droits).
3. **SEO intégré** : sitemap, RSS, meta par page, og-image — sans sur-architecture.
4. **Islands** : le seul JS client requis (transitions, formulaire, previews) s'hydrate à la demande.
5. Maturité Windows/Node 24/pnpm, template TS `strictest` officiel.

## Conséquences

- Aucun runtime React/Vue. Le JS total client doit rester < 15 Ko gzip (objectif ~6 Ko).
- Adapter les ADR de motion et de formulaire au modèle static + endpoint.
- Veiller aux majors fréquentes : rester sur `latest` stable, code faiblement couplé au framework.

## Alternatives rejetées

- **Next.js** : runtime React ~45 Ko + hydration pénalisent LCP sans bénéfice statique ; breaking majeurs annuels.
- **Nuxt** : le plus lourd (45–60 Ko), orientation full-stack.
- **SvelteKit** : très stable mais sans content layer typé ni îlots fins → plan B.
- **Vite vanilla** : effort de développement disproportionné (routing, SEO, sitemap, images à la main).

## Hypothèses

- A4 (statique + hydratation minimale) validée par ce choix ; à confirmer par les mesures du prototype (Phase 4).
