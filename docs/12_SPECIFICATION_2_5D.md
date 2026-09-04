# 12 - Specification de preproduction 2,5D - Portfolio immersif Nicolas Jez

## Statut

- Version : 0.1
- Date : 2026-08-04
- Statut : base de travail adoptee pour la suite de la preproduction ; aucune production lancee
- Nature : specification artistique et technique non codee

## Sources de verite

- Direction narrative et visuelle : `docs/references/inside-my-mind-validated-storyboard.png`
- Planche technique visuelle de revue : `docs/references/inside-my-mind-2_5d-technical-storyboard-v01.png`
- Decision de direction : `docs/01_REGISTRE_DES_DECISIONS.md`, decision D-005
- Direction artistique : `docs/08_DIRECTION_ARTISTIQUE.md`
- Cadrage general : `docs/00_MASTER_BRIEF.md`

## Objectif

Faire ressentir une entree personnelle dans l'univers creatif de Nicolas en conservant son portrait reel comme preuve d'identite. La 2,5D sert la transition et la profondeur percue ; elle ne devient ni un jeu 3D, ni un decor autonome, ni un remplacement des oeuvres.

## Contraintes non negociables

- Le portrait doit rester identifiable et visuellement credible.
- Les lunettes sont le point d'entree narratif et le portail de transition.
- La progression couleur est chaude et cuivre/orange dans la realite, puis plus froide et bleue dans le monde interieur.
- La sequence doit rester lisible sans effet de survol, sans machine puissante et sans memoriser un geste particulier.
- Aucun registre anatomique, medical ou gore.
- Aucun visage entierement synthetique et aucune reconstruction 3D complete du visage.
- Le visiteur doit pouvoir acceder directement aux projets, y compris si la sequence immersive est ignoree, interrompue ou indisponible.

## Sequence nominale

La duree de reference est d'environ 14 secondes, conforme aux durees de la planche validee. Les durees sont des cibles de preproduction, pas encore une implementation.

| Beat | Duree cible | Image et intention | Mouvement autorise | Critere de sortie |
|---|---:|---|---|---|
| 01 — Hero | 2,0 s | Portrait reel, lumiere chaude, calme avant le passage. | Presque statique ; respiration lumineuse minimale. | Le visiteur identifie Nicolas et comprend qu'il entre dans un portfolio. |
| 02 — Focus | 2,0 s | Les lunettes deviennent le centre de l'image ; un reflet circulaire apparait. | Rapprochement leger, micro-reflet dans les verres. | Le regard est guide vers la lentille sans effet gadget. |
| 03 — Push-in | 2,5 s | La realite se resserre autour de la lentille. | Push-in continu, profondeur de champ suggeree, parallaxe faible. | Le mouvement donne une intention claire d'entree. |
| 04 — Portal | 2,0 s | La lentille devient un portail circulaire cuivre/orange. | Anneau lumineux, transition masquee par le verre, aucune rupture de visage. | Le portail est compris comme une transformation des lunettes. |
| 05 — Crossing | 2,5 s | Traversée vers un espace interieur plus froid et bleu. | Passage axial ; particules ou elements uniquement s'ils renforcent la profondeur. | Le changement de monde est perceptible sans confusion. |
| 06 — Reveal | 3,0 s | Monde interieur creatif, œuvres et zones de navigation visibles. | Stabilisation, profondeur spatiale et apparition progressive des points d'acces. | Le portfolio devient navigable et les projets sont prioritaires sur le decor. |

## Déclenchement et sortie

Le mode de déclenchement reste à arbitrer avant la conception détaillée de l'interface :

- option recommandée : lecture unique à l'arrivée, avec possibilité visible d'entrer directement ou de passer la séquence ;
- alternative : déclenchement explicite par un bouton « Enter » ou par le scroll, si les essais montrent qu'une lecture automatique nuit à la compréhension ;
- interdit : boucle infinie, blocage de navigation, interaction cachée ou transition obligatoire avant l'accès aux œuvres.

La sortie de la séquence doit mener vers une zone de projets clairement repérable. Une navigation directe vers un projet ne doit jamais rejouer une longue introduction sans consentement du visiteur.

## Découpage 2,5D

Le découpage est une spécification de préparation des médias, indépendante du moteur qui sera choisi plus tard.

| Couche | Contenu | Rôle | Règle de qualité |
|---|---|---|---|
| L0 | Fond mural et ambiance chaude | Ancrer la réalité et la photographie. | Pas de texture générique visible ; lumière cohérente avec le portrait. |
| L1 | Silhouette et épaules | Donner une profondeur de premier plan. | Les contours restent naturels, sans halo de détourage. |
| L2 | Visage, barbe et zones de lumière | Préserver l'identité et la présence. | Aucun déplacement qui déforme les proportions ou le regard. |
| L3 | Monture des lunettes | Créer le cadre du portail. | Les verres restent nets et crédibles à l'approche. |
| L4 | Lentilles et reflets | Faire naître le passage. | Reflets contrôlés ; pas de bruit lumineux qui masque le visage. |
| L5 | Anneau-portail et profondeur interne | Masquer la transition et guider l'œil. | Le portail doit être lisible avant l'entrée dans le monde intérieur. |
| L6 | Monde intérieur et points d'accès aux œuvres | Révéler la matière créative de Nicolas. | Chaque élément de décor a une fonction narrative ou de navigation. |

Les couches peuvent être fusionnées si cela améliore la performance ou la qualité. Elles ne doivent pas être multipliées pour produire un effet technique visible.

## Grammaire de mouvement

- Courbe : mouvement cinématique continu, sans rebond ni accélération agressive.
- Caméra : axe principalement frontal et axial ; aucun orbiting autour du visage.
- Parallaxe : faible et contrôlé ; la profondeur doit être ressentie, pas exhibée.
- Reflets : mouvement lent, lié au passage de la lumière, jamais aléatoire.
- Portail : l'anneau est un masque de continuité, pas un objet qui prend toute la place.
- Révélation : le mouvement ralentit avant l'apparition des premiers projets afin de rétablir la lisibilité.
- Son à prévoir : pulsation basse et discrète, montée pendant le portail, respiration plus ample au reveal ; le son doit toujours être désactivable.

## Responsive et fallback

### Desktop

- Référence de revue : 1440 px de large.
- Le visage, les lunettes et l'anneau doivent rester entièrement lisibles.
- La profondeur peut utiliser l'amplitude complète prévue par la planche.

### Tablette

- Références de revue : 1024 px et 768 px.
- Réduire l'amplitude du parallaxe et préserver le cadrage des lunettes.
- Le monde intérieur conserve les points d'accès aux œuvres avant les éléments décoratifs.

### Mobile

- Références de revue : 390 px et 360 px.
- Le portrait et la lentille restent le centre ; le décor intérieur peut être simplifié.
- Pas de crop qui coupe les lunettes ou le visage au moment critique.
- Si le média animé est trop lourd, basculer vers une image poster et une transition courte, sans supprimer l'accès aux projets.

### Reduced-motion et appareil limité

- Afficher un hero statique propre avec un bouton d'entrée explicite.
- Remplacer le push-in et le parallaxe par un fondu ou une coupe douce.
- Conserver la progression narrative par changement de lumière, de cadrage ou de contenu.
- Ne jamais désactiver la navigation, les textes, les projets ou les contrôles essentiels.

## Cibles techniques à valider

Ces valeurs sont des cibles de revue, pas des décisions de stack :

- premier visuel utile du hero : inférieur à 1,5 s sur une connexion mobile de référence ;
- média initial de la séquence : cible maximale de 1,5 Mo compressés, hors médias des études de cas ;
- aucune dépendance à un modèle 3D lourd pour le visage ;
- animation interrompable ou contournable ;
- budget mémoire et comportement sur mobile réel à mesurer avant tout choix de moteur ;
- accès direct aux projets, titres, textes et liens présents même si l'effet immersif échoue.

## Préparation des médias à produire

Avant code, il faut valider une planche de découpage ou un fichier de préparation contenant :

1. le portrait source retenu et son cadrage exact ;
2. les couches L0 à L6 avec leur statut, leur origine et leur mode de détourage ;
3. les états de lumière chaude, portail cuivre/orange et monde intérieur bleu ;
4. les versions desktop, tablette et mobile ;
5. le poster statique et l'état reduced-motion ;
6. les textes, labels et accès aux projets du reveal ;
7. le statut des droits pour chaque média importé.

## Critères pass/fail de la tranche

| Test | PASS si... | FAIL si... |
|---|---|---|
| Identité | Le portrait est immédiatement reconnaissable. | Le détourage, la 2,5D ou la lumière altèrent le visage. |
| Narration | Les six beats sont compris sans explication orale. | Le portail ressemble à un effet décoratif ou la traversée est confuse. |
| Premium | Le rythme, les reflets et les matières sont précis et maîtrisés. | L'ensemble évoque un template ou une démo WebGL générique. |
| Œuvres | Le reveal met les projets au premier plan et donne un accès clair. | Le décor prend le dessus ou cache les projets. |
| Mobile | La séquence reste lisible à 390 px et possède un fallback. | Le visage est coupé, l'interaction bloque ou la page devient lourde. |
| Accessibilité | Skip, reduced-motion, clavier, contraste et son désactivable sont prévus. | L'effet est obligatoire ou dépend d'un geste non accessible. |
| Technique | Une architecture cible peut être comparée sur ces contraintes. | Le choix d'un moteur est fait avant la preuve de faisabilité. |

## Arbitrages restants

- déclenchement final : lecture unique à l'arrivée ou entrée explicite ;
- portrait source et cadrage exact de production ;
- représentation du monde intérieur : composition 2,5D ou rendu plus riche ;
- liste définitive des œuvres visibles dans le reveal ;
- plateforme et moteur après comparaison sur cette spécification ;
- valeurs finales de palette, typographies, audio et budget média.

## Prochaine validation

Cette spécification doit être relue contre la planche validée, puis approuvée ou corrigée par Nicolas avant la production de toute planche technique supplémentaire ou de tout prototype. Tant que cette validation n'est pas donnée, le projet reste en préproduction non codée.
