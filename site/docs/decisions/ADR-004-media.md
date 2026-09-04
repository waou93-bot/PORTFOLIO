# ADR-004 — Médias : pipeline local Astro `astro:assets` + formats AVIF/WebP + posters vidéo

**Statut** : Accepté · **Date** : 2026-07-31 · **Auteur** : Agent 10 / Orchestrateur

## Contexte

Captures et previews de projets autorisés, netteté contrôlée, poids maîtrisé, droits tracés.

## Décision

1. **Images** : pipeline `astro:assets` (conversion AVIF/WebP, `srcset`/`sizes`, dimensionnement) ; jamais de faux upscale ; `width`/`height` explicites ; lazy loading hors LCP ; la ressource LCP n'est jamais lazy.
2. **Vidéos de preview** : séquence courte (5–12 s), MP4 + WebM si pertinent, bitrate raisonnable, `muted playsInline preload="none"`, poster statique d'abord, chargement via IntersectionObserver, pause hors viewport, détection `save-data`, respect de `prefers-reduced-motion`, fallback image.
3. **Captures** : deviceScaleFactor adapté aux résolutions cibles (360×800, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080) sans simuler une résolution impossible ; date de capture notée.
4. **Droits** : `assets/rights-manifest.json` (source, auteur, propriétaire, licence, autorisation, usage, crédit requis, statut). Les preuves confidentielles restent hors du dossier public.

## Conséquences

- Un projet sans assets autorisés reste en `draft` (pas de placeholder trompeur).
- Le manifeste des droits est vérifié par le script `validate-content` (synchronisation projet ↔ assets).
- Coût : génération d'images à la demande au build uniquement.

## Flag P2

3D / WebGL : seulement si une fonctionnalité narrative le justifie (hero signature lazy) — sinon non.
