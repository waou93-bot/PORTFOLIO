# Design — Spec motion (grammaire)

ADR-002 : CSS + WAAPI + helper IO (~0,5 Ko) + ClientRouter Astro (~5,4 Ko). Budget JS motion ≈ 6 Ko gzip.

## Principes

- Animer principalement `transform` et `opacity` (compositor-only → INP bas, pas de reflow).
- Animations **interruptibles**, ne bloquent jamais les clics ni les routes.
- **`prefers-reduced-motion: reduce`** : désactivation complète (contenu visible).
- Aucune animation perpétuelle ; durée totale < ~1 s par geste.
- Mobile : équivalents tactiles, aucun geste dépendant du hover.

## Grammaire

### 1. Reveal des blocs (helper IO)

- État initial : `opacity 0 / translateY(16px)`.
- Au scroll : classe `.is-visible` → transition `opacity 600ms var(--ease-out)`, `transform 600ms`.
- Stagger léger sur les listes (décalage 60–120 ms via `transition-delay`).
- `animation-timeline: view()` en enhancement sous `@supports` (Firefox retombe sur l'IO).
- LCP/hero : jamais révélé (visible dès le premier paint).

### 2. Hover projets

- Vignette : `scale(1.02)` 300 ms, `box-shadow` léger ; légende/indice « Voir l'étude de cas → » en fondu.
- Carte : bordure accent, `transform: translateY(-2px)`.

### 3. Transitions de route (ClientRouter Astro)

- `fallback="swap"` (Firefox sans View Transitions natif).
- Vue de transition : fondu 200–300 ms + léger translateY du `<main>`. Ne jamais retarder la navigation.
- Focus restauré sur le `<main>` après navigation.
- **Changement de thème contextualisé** : si la destination est `data-theme='dark'`, la transition inclut un fondu du fond (via `view-transition-name` sur `body` si nécessaire).

### 4. Preview vidéo

- Poster statique d'abord. Sur `(hover: hover) and (pointer: fine)` : chargement léger à l'approche/hover, lecture après ~300 ms, pause à la sortie ; une seule vidéo joue à la fois.
- Mobile / sans hover : lecture sur tap explicite OU dans le viewport si coût acceptable ; jamais d'autoplay audio ; `muted playsinline`.
- Hors viewport → vidéo suspendue (`IntersectionObserver`).
- `save-data` ou `prefers-reduced-motion` → preview désactivée (poster uniquement).
- Fallback : si la vidéo échoue → image poster reste affichée.

### 5. Interactions CTA / liens

- Bouton : `background` accent → `on-accent` texte, légère élévation 150 ms.
- Liens texte : trait animé `width 0 → 100%` 300 ms, couleur accent.

### 6. Projet suivant (bas d'étude de cas)

- Lien « Projet suivant » : grand titre display, hover = déplacement du titre en accent + flèche.

## Interdits (rappel)

- Scroll hijacking, parallax de fond, marquee, cursor custom, preloader, chargement artificiel.
- GSAP/Motion/Lenis sauf flag P2 justifié (scrub/pin) — nécessite un ADR complémentaire.
- Trois.js hors hero signature lazy (flag P2).

## Toggles (feature flags)

`smooth-scroll` (off), `advanced-route-transitions` (off), `webgl` (off), `auto-video` (off — hover uniquement), `lab` (off), `analytics` (off).
