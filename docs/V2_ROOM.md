# V2 — salon des projets

## Direction validée

Nicolas retient le salon chaleureux avec cheminée, mur continu, portant rapproché de la fenêtre et deux appliques. Source conservée dans `assets/room-v2/salon-approved-v1.png`. Les différences résiduelles entre les appliques ont été signalées avant son accord. Image optimisée : `site/public/media/room/salon-v1.webp`.

La route `/univers-v2` remplace la galaxie par cette pièce. La galaxie reste consultable à `/univers-galaxie-v2`, la montagne à `/univers-montagnes-v2`. Aucun original supprimé. V1 reste sur son commit/tag existant ; pas de push de ces modifications.

## Interactions

- Hi-fi : Down Trigger ; cheminée : Héritage 2 ; maquette : Maison Sillon ; vêtements : Vantel.
- Ligne oblique puis horizontale et fiche au survol/focus ; toucher sur mobile. Accès directs complémentaires.
- Préchargement de l'image au clic depuis la landing, en conservant l'accélération et le glitch existants.
- Décor : bande décalée 320 ms, reflet 650 ms ou lumière 1,8 s, intervalles aléatoires de 10–24 s sans répétition consécutive.
- Arrêt immédiat des effets lors de l'ouverture d'une fiche ; absence d'effets hors écran, onglet masqué ou mouvement réduit ; bouton pause.
- Aucun négatif ou flash plein écran, aucune déformation des contrôles.

## Limites à valider

Premier jet interactif ; confort et intensité à valider dans le navigateur. Il s'agit d'une photographie générée à calques d'effets, pas d'une reconstruction 3D. Héritage 2 reste une fiche privée : sa disponibilité dans le build public dépend de son statut éditorial existant, non modifié ici.

## Human QA

Périmètre : source salon approuvée et dérivé WebP. Statut : FIX (revue interactive finale encore requise).

| Sévérité | Zone | Famille | Constat | Confiance | Action |
|---|---|---|---|---|---|
| Mineur | Appliques | Géométrie | Tailles apparentes différentes | Observé | Signalé ; source acceptée par Nicolas |
| À vérifier | Mobile | Lisibilité | Fiches en panneau bas, décor conservé sans recadrage | À tester | Contrôle navigateur |
