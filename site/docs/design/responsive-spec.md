# Design — Spec responsive (mobile-first)

## Breakpoints (container queries prioritaires, media queries en secours)

`--bp-sm 40rem` · `--bp-md 48rem` · `--bp-lg 64rem` · `--bp-xl 80rem`.

## Écrans de référence

360×800 · 390×844 (mobile prioritaire) · 768×1024 · 1024×768 · 1440×900 · 1920×1080. Test à 320 px sans scroll horizontal.

## Règles

1. **Aucun élément essentiel ne dépend** du hover, d'un pointeur précis, d'un écran large, du WebGL, d'une animation, d'un autoplay ou d'un scroll custom.
2. **Navigation** : header fixe discret avec identité + accès Contact toujours visible ; menu nav étendu sur ≥ md. Cibles ≥ 44 px.
3. **Hero** : typo fluide ; le CTA principal reste au-dessus de la ligne de flottaison ; jamais coupé.
4. **Cartes projets** : empilées en colonne, métadonnées sous le titre (jamais en overlay uniquement).
5. **Étude de cas** : colonne unique `--container-narrow` ; médias pleine largeur ; comparaisons desktop/mobile empilées avec labels.
6. **Galeries** : scroll horizontal autorisé uniquement avec `scroll-snap`, indices visibles et alternative grille.
7. **Formulaire** : champs pleine largeur, bouton ≥ 48 px, clavier virtuel (inputmode adapté), `autocomplete` corrects.
8. **Safe areas** : `env(safe-area-inset-*)` pour header/footer.
9. **Paysage mobile** : contenu scrollable naturel, pas de layout figé.
10. **Densité de texte** : corps ≥ 16 px, pas de colonnes multiples forcées.

## Capacités (media queries d'état)

```css
@media (hover: hover) and (pointer: fine) {
  /* effets hover */
}
@media (prefers-reduced-motion: reduce) {
  /* désactivation */
}
@media (prefers-contrast: more) {
  /* bordures/contraste renforcés */
}
```

`save-data` : détecté côté JS (`navigator.connection.saveData`) pour désactiver les previews vidéo.

## Zoom 200 %

- Layout fluide : à 200 % sur 360 px (≈ 180 px effectifs), le contenu reste lisible (texte réel, pas d'images de texte).
- Aucun `overflow-x: hidden` global qui masquerait un débordement non désiré (contenu uniquement).
