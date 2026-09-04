# ADR-002 — Motion : CSS + WAAPI + helper IO maison + ClientRouter (View Transitions)

**Statut** : Accepté · **Date** : 2026-07-31 · **Auteur** : Agent 8 / Orchestrateur

## Contexte

Portfolio éditorial premium, JS minimal, WCAG 2.2 AA, reduced-motion, INP ≤ 200 ms. Pas de scroll hijacking.

## Mesures (2026-07-31, gzip réels)

| Option                                                   | Gzip    |
| -------------------------------------------------------- | ------- |
| CSS transitions/animations + WAAPI                       | 0 Ko    |
| Helper IntersectionObserver maison (reveals)             | ~0,5 Ko |
| Astro ClientRouter (transitions de route, fallback swap) | 5,4 Ko  |
| Lenis 1.3.25                                             | 5,2 Ko  |
| GSAP core + ScrollTrigger 3.15                           | 45,2 Ko |
| Motion 12.43 (bundle non tree-shaké)                     | 45,5 Ko |
| Three.js                                                 | 84,8 Ko |

Faits critiques : Lenis n'a **aucune option reduced-motion** et désactive les ancres par défaut. GSAP est désormais gratuit (3.13+, licence No-Charge Webflow) mais propriétaire. Firefox ne supporte pas les View Transitions cross-document natif (fallback `swap` obligatoire). WAAPI : Baseline widely available. CSS scroll-driven animations : enhancement uniquement (Firefox absent).

## Décision

1. **CSS transitions** pour tous les hovers (transform/opacity, eases custom, 150–400 ms) — 0 Ko.
2. **Helper IO maison (~0,5 Ko)** pour les reveals au scroll ; `animation-timeline: view()` en enhancement `@supports`.
3. **Astro `ClientRouter`** (5,4 Ko) pour les transitions de route, `fallback="swap"`.
4. **WAAPI** (`element.animate()`) pour les rares micro-interactions JS-scoped (stagger léger de titres) si besoin.
5. **`prefers-reduced-motion: reduce`** : désactivation complète des animations (contenu visible, pas de mouvement).
6. **Pas de Lenis, pas de GSAP, pas de Motion, pas de Three.js** à ce stade.

## Conséquences

- Budget JS motion total ≈ 6 Ko gzip (helper + ClientRouter).
- Les effets avancés (scrub, pin, 3D) sont des feature flags P2, ajoutables sans refonte.
- Aucune transition de route ne bloque la navigation (dégradé `swap`).
- Les previews vidéo suivent des règles strictes (poster, muted/playsinline, IntersectionObserver, save-data, reduced-motion).

## Interdits formels

- Empiler plusieurs bibliothèques d'animation majeures.
- Lenis sans sections pinned (inutile et risqué ici).
- WebGL pour un effet réalisable en CSS.
