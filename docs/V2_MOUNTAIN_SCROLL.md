# V2 — Exploration des sommets

## Périmètre validé le 5 septembre 2026

Nicolas autorise une V2 isolée : landing conservée visuellement, seconde expérience remplacée par la vidéo montagne parcourue en sens inverse au scroll natif. Quatre vignettes apparaissent successivement, diminuent avec la profondeur et révèlent des informations par une ligne oblique puis horizontale au survol et au focus.

## Conservation

- V1 : branche `main`, commit `0ebb204000b021f5b924ba634bbb641f2216f669` et tag `restore-2026-09-05-before-project-exploration`, poussés sur le dépôt GitHub PORTFOLIO.
- Archive autonome vérifiée dans `.restore-points/`.
- Travail V2 : branche `v2/mountain-scroll`, route `/univers-v2`. Aucun push V2 effectué.
- Aucun asset source remplacé. Le bouton du portrait garde son glitch et change seulement de destination.

## Premier jet

- Vidéo source de 20,3 secondes, chargée en blob local ; vidéo toujours en pause, seeks coalescés suivant le scroll.
- Repères calibrés manuellement sur trois images. Position des vignettes synchronisée avec l'image décodée.
- Apparitions à 0 / 22 / 46 / 70 % ; perspective artistique progressive, pas une reconstruction exacte de caméra 3D.
- Pas de voile global ni de correction colorimétrique.
- Informations factuelles : collaboration/site en ligne pour Down Trigger ; concepts pour les trois autres. Aucune commande commerciale inventée.
- Mobile : panorama entier, vignettes compactes, liens textuels accessibles sous l'expérience. Mouvement réduit : image fixe et quatre projets accessibles.

## Vérifications et limites

- Astro check : 60 fichiers, zéro erreur. Build réussi ; avertissement de bundle historique du héros encore présent.
- Chromium : vidéo de 20,26 à 8,84 secondes au scroll ; inchangée après une seconde au repos.
- Apparitions successives vérifiées : 1, puis 2, puis 3, puis 4 projets.
- Héritage 2 conserve son statut brouillon : accessible en développement, exclu du build public normal. Aucun statut de publication modifié par cette V2.
- Ajustement artistique des trajectoires et vérification Safari/iPhone réel restent nécessaires. Ce premier jet n'est pas une validation de performance finale.
