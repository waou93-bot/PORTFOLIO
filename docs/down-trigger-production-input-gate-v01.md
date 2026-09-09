# Down Trigger — porte d’entrée production v01

## État constaté

Recherche effectuée dans les deux espaces de travail (`Attraction` et `Portfolio immersif Nicolas Jez - MASTER`) : aucune piste audio `wav`, `mp3`, `flac`, `aiff` ou `m4a` et aucune planche canonique séparée de poses n’ont été trouvées. Les fichiers actuels sont donc des dérivés de préproduction, correctement marqués comme provisoires.

## Entrées attendues

### Audio

- fichier WAV ou AIFF non compressé, idéalement 24 bits ;
- fréquence native conservée ;
- version complète du morceau, sans normalisation destructive ;
- si possible, BPM ou timecode de début clairement indiqué.

À réception, relever : attaques, respirations, début des couplets/refrains, breaks, changements de densité et fin musicale. Le timing actuel de 5,03 s sera alors recalé, sans changer l’arc résistance → lâcher → chute.

### Assets dessinés canoniques

Pour chacun des six membres :

- vue neutre et vue trois-quarts ;
- tête/masque, torse, bras, avant-bras, mains, bassin, cuisses, jambes et bottes séparables ;
- au minimum les poses résistance, appui, torsion et chute ;
- PNG avec alpha ou fichier source en couches ;
- validation de la silhouette, des vêtements et des accessoires distinctifs.

Le modèle masqué provisoire, la pose sheet et l’atlas existants servent de guides de continuité, pas de canon définitif.

## Déclencheur de production

La production intensive démarre quand les deux conditions suivantes sont remplies :

1. audio importé et cue sheet validée ;
2. au moins le personnage masqué validé en pièces articulées, avec les autres membres disponibles avant les plans qui les montrent.

Le raccord main/dalle v04, le rig test v02 et l’animatic v08/v09 restent les preuves de référence pour contrôler le mouvement et la continuité.

Le rapport reproductible `prototypes/down-trigger-clip-preprod-v01/down-trigger-continuity-report-v01.json` confirme l’état technique actuel : quatre contrôles passent, tandis que les deux gates externes (`audio_present` et `canonical_separated_assets_present`) restent à faux.
