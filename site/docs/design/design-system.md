# Design — Design system (code-first)

Variables CSS sémantiques, couleurs en OKLCH (fallback hex auto-inclus), typographie auto-hébergée sous-ensemblée (@fontsource).

## Couleurs — tokens primitifs

```css
:root {
  /* Polaire clair (défaut) */
  --color-ink: oklch(0.18 0.008 85); /* encre chaude */
  --color-ink-soft: oklch(0.32 0.008 85);
  --color-muted: oklch(0.5 0.01 85);
  --color-faint: oklch(0.62 0.01 85);
  --color-paper: oklch(0.975 0.004 85); /* ivoire */
  --color-paper-raised: oklch(0.995 0.002 85);
  --color-line: oklch(0.86 0.008 85);
  --color-accent: oklch(0.55 0.2 25); /* remplacé par projet */
  --color-on-accent: oklch(0.98 0.01 85);
  --color-ok: oklch(0.45 0.15 150);
  --color-warn: oklch(0.55 0.2 60);
}
/* Polarité sombre par projet (page/theme) */
[data-theme='dark'] {
  --color-ink: oklch(0.93 0.008 85);
  --color-ink-soft: oklch(0.82 0.008 85);
  --color-muted: oklch(0.68 0.01 85);
  --color-faint: oklch(0.55 0.01 85);
  --color-paper: oklch(0.12 0.006 85);
  --color-paper-raised: oklch(0.16 0.006 85);
  --color-line: oklch(0.28 0.008 85);
  --color-on-accent: oklch(0.98 0.01 85);
}
```

## Typographie — échelle fluide (clamp)

```css
--font-display: 'Instrument Serif', Georgia, serif;
--font-sans: 'Archivo Variable', system-ui, sans-serif;
--text-xs: clamp(0.72rem, 0.7rem + 0.1vw, 0.8rem);
--text-sm: clamp(0.85rem, 0.82rem + 0.15vw, 0.95rem);
--text-md: clamp(1rem, 0.97rem + 0.15vw, 1.125rem);
--text-lg: clamp(1.15rem, 1.05rem + 0.5vw, 1.5rem);
--text-xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
--text-2xl: clamp(1.9rem, 1.5rem + 2vw, 2.8rem);
--text-3xl: clamp(2.4rem, 1.8rem + 3vw, 4rem);
--text-4xl: clamp(3rem, 2.2rem + 4vw, 6rem);
```

Corps : Archivo 400/500, interligne 1.6. Display : Instrument Serif 400, italique pour accents. Petites capitales (Archivo 500, letter-spacing 0.08em) pour les labels de section.

## Espacement

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.5rem;
--space-6: 2rem;
--space-7: 3rem;
--space-8: 4rem;
--space-9: 6rem;
--space-10: 8rem;
--container: 72rem;
--container-narrow: 44rem;
--gutter: clamp(1rem, 4vw, 2.5rem);
```

## Grille

- Grille 12 colonnes desktop, `--gutter` comme gouttière ; media blocks pleine colonne ou 7/5.
- Breakpoints : `--bp-sm: 40rem` (640), `--bp-md: 48rem` (768), `--bp-lg: 64rem` (1024), `--bp-xl: 80rem` (1280).
- Cibles tactiles ≥ 44×44 px (48 px pour les éléments cliquables courants).

## Rayons, bordures, ombres

```css
--radius-s: 4px;
--radius-m: 10px;
--radius-l: 18px;
--border-1: 1px solid var(--color-line);
--shadow-s: 0 1px 2px oklch(0.1 0 0 / 0.06);
--shadow-m: 0 6px 24px oklch(0.1 0 0 / 0.08);
--shadow-l: 0 16px 48px oklch(0.1 0 0 / 0.12);
```

## Durées et courbes (motion tokens)

```css
--dur-fast: 150ms;
--dur-med: 300ms;
--dur-slow: 600ms;
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

## Z-index

```css
--z-header: 100;
--z-overlay: 200;
--z-skip: 1000;
```

## États interactifs

- **Focus** : `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }` — jamais supprimé.
- **Hover** : lien → `color` accent + trait; carte → image `scale(1.02)` 300 ms; bouton → léger soulèvement.
- **Densité** : par défaut aérée ; listes métadonnées en petite capitales.

## Règles médias

- `img, video { max-width: 100%; height: auto; }` + `width`/`height` explicites.
- Images : `loading="lazy"` hors LCP ; LCP jamais lazy, `fetchpriority="high"`.
- Vidéos : `muted playsinline preload="none"`, poster, `IntersectionObserver`.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Les reveals sont pilotés par JS (classe `.is-visible`) : si reduced-motion, tout est visible immédiatement (CSS `@media` garde `.reveal` visible).

## Contraste

- Ratio minimum 4.5:1 texte sur fond (AA) ; grands textes 3:1.
- `--color-muted` vérifié sur `--color-paper` (≈ 7:1) ; accent utilisé en décoration, jamais seul pour une information portante.
