# Design — Direction retenue

## « Le dossier » — édition contemporaine, cadre neutre, accent par projet

**Décision** : Direction A du comparatif, enrichie de la polarité par projet (héritée de C) : `theme.dark` permet à un projet immersif d'ouvrir en fond sombre avec sa propre palette, via une transition de thème contextualisée.

## Principes

1. **Le cadre sert les projets** : fond neutre ivoire, encre, grille — jamais de fond décoratif qui rivalise avec les médias.
2. **Typographie forte** : Instrument Serif en display (accents éditoriaux, italiques) + Archivo Variable (corps, UI, données, petits capitales).
3. **Grands espaces** : marges généreuses, numéros de section, hiérarchie nette.
4. **Accent couleur par projet** (token `theme.accent`, OKLCH) sur les labels, badges, liens et détails de la page projet.
5. **Polarité optionnelle** : `theme.dark: true` pour les projets immersifs (Down Trigger). Toute autre page reste en clair.
6. **Médias en grande taille, encadrés** : images nettes, dimensions explicites, légendes.
7. **Mouvement discret** : reveals doux, hovers légers, transitions de route sobres. Le mouvement clarifie, il ne distrait pas.

## Ce qui reste interdit

Tous les anti-patterns listés (docs/research/anti-patterns.md) : pas de bento, pas de marquee, pas de curseur custom, pas de preloader, pas de scroll hijacking, pas de glassmorphism décoratif.

## Preuve par le site lui-même

- Skip-link, focus visible, reduced-motion : implémentés et affichés comme signaux de qualité.
- Métriques de performance réelles (CWV lab) publiées dans /about, avec date et méthode — preuve vérifiable du craft.
- Chaque étude de cas honnête : rôle, périmètre, crédits, statut des droits, lien live.

## Composants clés

Header discret · Hero éditorial · Liste « Selected Works » façon sommaire · Carte projet (visuel encadré + métadonnées + badge statut) · Étude de cas (sections numérotées) · Galerie desktop/mobile · Formulaire de contact · Footer dense (contact, réseaux, mentions, perf) · Badges Client/Concept · Disclaimer concepts.
