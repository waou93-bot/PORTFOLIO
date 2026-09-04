# GitHub Stack Audit — Framework front-end

Audit factuel réalisé le 2026-07-31. Sources : registre npm (`npm view`), docs officielles, blogs officiels. Les étoiles GitHub ne sont pas un critère de décision.

## Versions stables courantes (2026-07-31)

| Framework | Version stable | Dernière release | Dernière major      |
| --------- | -------------- | ---------------- | ------------------- |
| Astro     | 7.1.6          | 2026-07-29       | 7.0.0 → 2026-06-22  |
| Next.js   | 16.2.12        | 2026-07-30       | 16.0.0 → 2025-10-22 |
| SvelteKit | 2.70.2         | 2026-07-29       | 2.0.0 → 2023-12-14  |
| Nuxt      | 4.5.1          | 2026-07-27       | 4.0.0 → 2025-07-15  |
| Vite      | 8.2.0          | 2026-07-30       | 8.0.0 → 2026-03-12  |

## Comparaison clé pour ce cas d'usage (portfolio statique premium)

| Critère                        | Astro                          | Next.js                        | SvelteKit             | Nuxt                   | Vite vanilla       |
| ------------------------------ | ------------------------------ | ------------------------------ | --------------------- | ---------------------- | ------------------ |
| JS client initial (portfolio)  | **0 Ko par défaut**            | ~45 Ko (React)                 | ~5 Ko                 | ~45–60 Ko (Vue)        | 0–5 Ko (artisanal) |
| SSG natif                      | Oui (`output: static`)         | Oui (`output: export`)         | Oui (adapter-static)  | Oui (`nuxt generate`)  | Non (à construire) |
| Content collections typées     | **Oui (glob + Zod 4)**         | Non (file system)              | Non (mdsvex tiers)    | Module `@nuxt/content` | Non                |
| TypeScript strict              | Template `strictest` officiel  | First-class                    | `svelte-check` séparé | Correct                | Manuel             |
| SEO intégré (sitemap, RSS, og) | Oui (intégrations officielles) | Oui                            | Module tiers          | Module tiers           | Non                |
| Hydratation                    | **Îlots fins (islands)**       | Hydration par composant client | Par page              | Par page               | Manuelle           |
| Stable > 6 mois                | Non (v7 = juin 2026)           | Oui                            | Oui                   | Oui                    | Non                |
| Licence                        | MIT                            | MIT                            | MIT                   | MIT                    | MIT                |
| Node 24                        | ✅ (>= 22.12)                  | ✅ (>= 20.9)                   | ✅ (>= 18.13)         | ✅ (>= 24.11)          | ✅ (>= 22.12)      |

## Risques notés

- **Astro** : cadence de majors élevée (3 majors en 18 mois : v5→v6→v7) ; acquisition par Cloudflare le 2026-01-16 (open source préservé, positionnement content-driven renforcé). Une partie des nouveautés v6/v7 (server islands, fetch.ts) est inutile en 100 % statique — sur-dimensionnement sans conséquence.
- **Next.js** : breaking majeurs annuels lourds (v15→v16 : Async Request APIs obligatoires, middleware→proxy, next lint supprimé) ; runtime React + hydration pénalisent LCP mobile sans bénéfice ici.
- **SvelteKit** : très stable (2.x depuis déc 2023) mais pas de content layer typé ni d'îlots fins ; plan B crédible.
- **Nuxt** : le plus lourd (runtime Vue+Nuxt ~45–60 Ko) ; orientation full-stack ; sur-dimensionné.
- **Vite vanilla** : coût de développement maximal (routing, SEO, sitemap, images, content à la main) ; pas justifié pour un site avec contenu structuré.

## Décision

**Astro 7.1.6** est retenu :

1. Seul framework garantissant **0 Ko JS par défaut** (HTML pur, LCP indépendant de tout runtime).
2. **Content layer typé natif** (glob + schémas Zod 4) — parfait pour les études de cas structurées.
3. **SEO intégré** (sitemap, RSS, og-images, meta par page).
4. Windows + Node 24 + pnpm 11 supportés nativement.
5. Hydratation par îlots fins (`client:visible`, `client:load`) — le JS ne s'hydrate que là où il sert.

Mitigations : rester sur la ligne stable `latest`, code peu dépendant du framework (pages + composants simples), revue de migration courte au besoin.
