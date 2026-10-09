# Appui du personnage sur mobile — 9 octobre 2026

Demande : donner un appui visible au personnage suspendu sur la landing.

Correction : une traverse de 5 px, avec fixation au bord droit, passe derrière les deux mains. Elle partage les coordonnées responsive du personnage et reste distincte de son clone animé. Aucun média ajouté, aucune modification JavaScript.

## Vérifications locales

- 320 × 740, 375 × 812, 768 × 1024 : contact des deux mains et fixation à droite contrôlés visuellement ; aucun débordement horizontal.
- 1280 × 800 : traverse masquée (`display: none`), aucun débordement horizontal.
- À 375 px : activation clavier, état final `done`, footer `settled` en pose 8 ; clone supprimé. Position de la traverse inchangée avant/après chute (447.3984375 px dans le document).
- Astro check : 90 fichiers, 0 erreur, 0 warning, 0 hint.
- Astro build : 19 pages, réussite.

Preuves : `mobile-character-ledge-2026-10-09.json`, captures `mobile-character-ledge-320-2026-10-09.png` et `mobile-character-ledge-375-2026-10-09.png`. Une mesure intermédiaire 375 px précédait le rétablissement du contrôle du viewport ; seules les mesures portant les dimensions effectivement constatées étayent les largeurs annoncées.

Aperçu : http://127.0.0.1:4330/. Correction locale, non publiée. L’audit général précédent reste indépendant de cette correction ciblée.
