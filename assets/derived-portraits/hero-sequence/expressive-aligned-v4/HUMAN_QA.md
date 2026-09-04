# Human QA — séquence expressive stop-motion v1

PÉRIMÈTRE : 30 images `expressive-aligned-v4`, planche-contact et affichage héros.
RÉFÉRENCE : `frame-01-neutral.png`, série `aligned-v1` et canon `NJ-PORTRAIT-CENTER-01`.
STATUT : PASS

| Sévérité | Zone | Famille | Constat observable | Confiance | Correction minimale | Statut |
|---|---|---|---|---|---|---|
| BLOCKER | Série `expressive-aligned-v1` | Géométrie | Plusieurs images sont étirées ou cisaillées par un recalage affine fondé sur trois repères presque collinéaires. | observé | Rejeter v1 et utiliser une transformation de similarité sans cisaillement. | corrigé en v4 |
| MINEUR | Bouche, images 21 à 30 | Anatomie | L’ouverture de la bouche change naturellement le contour inférieur du visage. | observé | Conserver ce mouvement intentionnel ; ne pas employer le menton comme repère d’alignement. | accepté |
| MINEUR | Reflets de lunettes | Continuité | Les verres masquent parfois les yeux, sans interrompre la lecture du sourire. | observé | Aligner les coins externes détectés et contrôler sur planche-contact. | corrigé en v4 |

## Décision

Conserver `expressive-aligned-v4`. Les deux coins externes des yeux sont alignés par translation, rotation et échelle uniformes, sans étirement ; l’erreur maximale de mapping reste inférieure à 0,001 px. La séquence v1 déformée est conservée comme dérivé rejeté et n’est pas publiée.

## Gate final

- chaque image active a été inspectée à sa taille d’usage : oui ;
- chaque anomalie a une zone, une famille et une sévérité : oui ;
- les invariants de série sont inchangés : oui ;
- les corrections sont versionnées et leurs sources conservées : oui ;
- la page réellement servie a été revue : oui ;
- aucun texte généré ne remplace du texte HTML : oui ;
- observation, probabilité et préférence sont séparées : oui.
