# Plan QA — pipeline de qualité

Tout changement est validé par le pipeline complet avant d'être considéré comme livrable.
**Aucun contenu non vérifié n'est publié.**

## Pipeline local (à exécuter après chaque changement)

```bash
pnpm lint            # eslint : 0 problème attendu
pnpm test            # vitest : tests unitaires (contact, seo, media)
pnpm check           # astro check : 0 erreur / 0 warning / 0 hint
pnpm build           # build statique : 7 pages + sitemap
pnpm knip            # détection de code mort : 0 problème
pnpm format:check    # prettier : tout formaté
pnpm validate        # validateur de contenu (slugs, assets, droits, métriques sourcées)
pnpm build && pnpm validate:links   # liens internes ; ajouter --external pour l'externe
```

## Tests unitaires (`tests/unit/`)

| Fichier           | Couverture                                                               |
| ----------------- | ------------------------------------------------------------------------ |
| `contact.test.ts` | Token HMAC (âge, validité), honeypot, validation des champs, mailto      |
| `seo.test.ts`     | URL absolues, titles, OG, JSON-LD (person/website/itemList/creativeWork) |
| `media.test.ts`   | Choix du format, détection d'existence des assets                        |

## Tests E2E (`tests/e2e/`, Playwright)

- Lancement : `pnpm test:e2e` (requiert `npx playwright install chromium` une fois).
- Pré-requis : build à jour (`pnpm build`) — `playwright.config.ts` sert `dist/`.
- Scénarios prévus :
  - Accueil : rendu, navigation, sections clés.
  - Work : grille des projets publiés, filtres éventuels.
  - Étude de cas (`/work/[slug]`) : rendu complet, poster vidéo, navigation précédent/suivant.
  - Contact : formulaire valide → mailto, honeypot ignoré, token présent, rejet si soumission trop
    rapide.
  - Legal : mentions légales et confidentialité sans `TODO_CONTENT` résiduel visible.
  - 404 : redirection/liens de retour.
- Navigateurs : `playwright.config.ts` définit `workers: CI ? 2 : 1`.

## Lighthouse (`lighthouserc.cjs`)

- Desktop, `staticDistDir: ./dist`.
- Seuils : perf ≥ 0.95, a11y/bp/seo = 1, LCP ≤ 2500 ms, CLS ≤ 0.1, TBT ≤ 200 ms,
  TTI ≤ 3500 ms, SI ≤ 3000 ms.
- Budgets : JS ≤ 50 Ko gzip, HTML ≤ 80 Ko, fonts ≤ 200 Ko, images ≤ 1500 Ko, total ≤ 2200 Ko.
- Seuils Core Web Vitals 2026 : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 (p75).

## Checklist manuelle (qualité perçue)

- [ ] Le premier écran se charge vite et l'animation ne bloque pas le rendu.
- [ ] Aucun clignotement FOUC (fontes, poster vidéo, images).
- [ ] Toutes les interactions tactiles fonctionnent sur mobile (scroll, menu, formulaire).
- [ ] Zoom navigateur 200 % : aucun contenu tronqué.
- [ ] Navigation clavier : focus visible, ordre logique, pas de piège.
- [ ] Réduction de mouvement respectée (`prefers-reduced-motion` dans `src/lib/reveals.ts` / CSS).
- [ ] Contrastes AA sur l'ensemble (thème clair + sombre).
- [ ] Chaque projet publié affiche son statut de droits et sa date.

## Conditions de sortie

1. Pipeline complet vert.
2. Lighthouse vert sur le build local et sur la preview.
3. E2E vert.
4. Checklist propriétaire signée (`docs/qa/validation-owner.md`).
5. Aucune lacune bloquante dans `docs/00-content-gaps.md`.
