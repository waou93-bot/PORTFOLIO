# QA continuité

Footer stop-motion, 2026-09-05 : intégration et contrôles fonctionnels PASS dans le périmètre Chromium desktop/mobile émulé/réduction du mouvement. Détails, limites et captures dans [FOOTER_STOPMOTION_V1.md](FOOTER_STOPMOTION_V1.md).

## Périmètre inspecté

- MASTER immersif et storyboard validé ;
- ancien portfolio Astro ;
- deux séries de portraits ;
- dossier complet de la maison 3D ;
- sources locales de Down Trigger, Héritage 2 et Maison Sillon.

## Résultat

- **PASS :** cohérence portrait → lunettes → portail → monde intérieur.
- **PASS :** Maison Sillon v1.1 comme canon spatial conceptuel.
- **MAJEUR :** Vantel audité et sélectionné, mais sans médias sources locaux utilisables pour la publication.
- **MAJEUR :** droits et crédits publics de Down Trigger et Héritage 2 à confirmer.
- **PASS GÉOMÉTRIQUE :** les trente copies de production ont été recalées sur les deux coins externes des yeux et le menton du portrait canonique ; l'erreur de mapping enregistrée est inférieure à 0,001 px pour chaque frame. Rapport : `assets/derived-portraits/hero-sequence/aligned-v1/alignment-report-v1.json`.
- **PASS VISUEL :** la dérive évidente de taille sur la première frame brutaliste a été corrigée en `17-brutalist-v2`, puis incluse dans l'alignement.
- **À VÉRIFIER EN MOUVEMENT :** absence de saut perceptible lié aux lunettes, chapeaux ou volumes de col ; contrôle desktop, mobile et `prefers-reduced-motion` requis après intégration.

## Série de paysages hybrides — 2026-09-04

PÉRIMÈTRE : `NJ-LANDSCAPE-HYBRID-01` à `NJ-LANDSCAPE-HYBRID-10`  
CANON UTILISÉ : `NJ-LANDSCAPE-CANON-01`  
MÉTHODE : inspection visuelle individuelle des dix sorties générées ; comparaison de la palette, du langage matière, de la lisibilité et de la séparation des formats  
STATUT : PASS

| Sévérité | Asset | Écart | Source à corriger | Correction | Preuve | Statut |
|---|---|---|---|---|---|---|
| — | `NJ-LANDSCAPE-HYBRID-01` à `05` | Aucun écart bloquant observé ; cinq panoramas cohérents et distincts | — | — | sorties panoramiques inspectées | PASS |
| — | `NJ-LANDSCAPE-HYBRID-06` à `10` | Aucun écart bloquant observé ; cinq verticales cohérentes et distinctes | — | — | sorties verticales inspectées | PASS |

## Série de paysages hybrides — passe 02 — 2026-09-04

PÉRIMÈTRE : `NJ-LANDSCAPE-HYBRID-11` à `NJ-LANDSCAPE-HYBRID-20`  
CANON UTILISÉ : `NJ-LANDSCAPE-CANON-01`  
MÉTHODE : inspection visuelle individuelle des dix sorties générées ; comparaison avec la passe 01 sur la palette, le langage matière, la lisibilité, la variété des biomes et la séparation des formats  
STATUT : PASS

| Sévérité | Asset | Écart | Source à corriger | Correction | Preuve | Statut |
|---|---|---|---|---|---|---|
| — | `NJ-LANDSCAPE-HYBRID-11` à `15` | Aucun écart bloquant observé ; cinq panoramas distincts et compatibles avec la passe 01 | — | — | sorties panoramiques inspectées | PASS |
| — | `NJ-LANDSCAPE-HYBRID-16` à `20` | Aucun écart bloquant observé ; cinq verticales distinctes et compatibles avec la passe 01 | — | — | sorties verticales inspectées | PASS |

## Variante glitch — `NJ-LANDSCAPE-HYBRID-18-GLITCH-01` — 2026-09-04

PÉRIMÈTRE : `assets/derived-landscapes/glitch/nj-landscape-hybrid-18-glitch-v1.png`  
CANON UTILISÉ : `NJ-LANDSCAPE-CANON-01`, avec delta glitch autorisé  
MÉTHODE : comparaison directe avec la fresque source ; vérification de la conservation du portail circulaire, du cadrage vertical et des formes mécaniques principales ; inspection des distorsions et artefacts intentionnels  
STATUT : PASS

| Sévérité | Asset | Écart | Source à corriger | Correction | Preuve | Statut |
|---|---|---|---|---|---|---|
| — | `NJ-LANDSCAPE-HYBRID-18-GLITCH-01` | Aucun écart bloquant ; éclatement et bug visuel lisibles, source conservée intacte | — | — | comparaison source / variante inspectée | PASS |

## Variante glitch nettoyée — `NJ-LANDSCAPE-HYBRID-18-GLITCH-02` — 2026-09-04

PÉRIMÈTRE : `assets/derived-landscapes/glitch/nj-landscape-hybrid-18-glitch-v2-clean.png`  
CANON UTILISÉ : `NJ-LANDSCAPE-CANON-01`, avec delta glitch autorisé et préférence mémoire de surfaces propres  
MÉTHODE : comparaison directe avec `v1`; vérification de la lisibilité du portail et des structures principales, de la baisse du bruit aléatoire et du maintien des ruptures numériques intentionnelles  
STATUT : PASS

| Sévérité | Asset | Écart | Source à corriger | Correction | Preuve | Statut |
|---|---|---|---|---|---|---|
| — | `NJ-LANDSCAPE-HYBRID-18-GLITCH-02` | Aucun écart bloquant ; bruit réduit, glitch conservé et composition plus respirante | — | — | comparaison `v1` / `v2-clean` inspectée | PASS |

## Séquence expressive stop-motion — 2026-09-04

PÉRIMÈTRE : `NJ-PORTRAIT-EXPRESSION-01-30`  
CANON UTILISÉ : `NJ-PORTRAIT-CENTER-01` et série d'univers `aligned-v1`  
MÉTHODE : inspection des trente images, comparaison sur planche-contact, recalage par transformation de similarité, puis contrôle dans le héros réellement servi  
STATUT : PASS

| Sévérité | Asset | Écart | Source à corriger | Correction | Preuve | Statut |
|---|---|---|---|---|---|---|
| BLOCKER | `expressive-aligned-v1` | Cisaillement et étirement de plusieurs visages | méthode d'alignement affine à trois repères | version rejetée ; remplacement par une transformation rigide sans cisaillement | `docs/02_REGISTRE_DES_REJETS.md` R-008 | CORRIGÉ |
| — | `expressive-aligned-v4` | Aucun saut géométrique bloquant observé | — | coins externes des yeux alignés ; bouche et menton laissés libres pour l'expression | `alignment-report-v4.json` et planche-contact | PASS |
| — | héros web | Arc neutre → sourire → émerveillement, puis retour au calme | — | trente WebP préchargés et changement en coupe franche | contrôle réel sur l'accueil et traversée jusqu'aux projets | PASS |

## Down Trigger — préproduction clip stop-motion — 2026-09-08

PÉRIMÈTRE : `prototypes/down-trigger-clip-preprod-v01/storyboard-revised-v01.png`, `test-07-11-contact-sheet-v01.png`, `test-07-11-contact-sheet-v02.png`, `test-07-11-contact-sheet-v03.png`, `hand-release-test-v01.png`, `hand-release-test-v02.png`, `hand-release-test-v03.png`, `hand-release-registered-v01.gif`, `hand-release-registered-v02.gif`, `hand-release-registered-v02-contact-sheet.png`, `hand-release-registered-v03.gif`, `hand-release-registered-v03-contact-sheet.png`, `hand-release-registered-v03-detail-sheet.png`, `hand-release-registered-v08.gif`, `hand-release-registered-v08-detail-sheet.png`, `hand-release-registered-v11.gif`, `hand-release-registered-v11-detail-sheet.png`, `down-trigger-preprod-animatic-v01.gif`, `down-trigger-preprod-animatic-v02.gif`, `down-trigger-clip-test-v01.gif`, `down-trigger-clip-test-v02.gif`, `down-trigger-clip-test-v03.gif`, `hand-release-test-v01.gif`, `hand-release-test-v02.gif`, `docs/down-trigger-clip-preproduction-v01.md`  
CANON UTILISÉ : identité locale Down Trigger, logo clair local, silhouette encapuchonnée issue du visuel héros ; personnage masqué isolé non disponible  
MÉTHODE : inspection de la planche révisée, contrôle du découpage en six états, vérification du cadrage et de l’export GIF, comparaison avec les invariants de matière et de palette du projet  
STATUT : À CORRIGER AVANT PRODUCTION INTENSIVE

| Sévérité | Asset | Écart | Source à corriger | Correction / suite | Preuve | Statut |
|---|---|---|---|---|---|---|
| MAJEUR | `storyboard-revised-v01.png` | Masque et silhouette dérivés d’une référence de groupe, pas d’une planche canonique isolée | référence personnage manquante | fournir ou valider une planche isolée avant fabrication intensive | planche de préproduction inspectée | OUVERT |
| — | `storyboard-revised-v01.png` | Progression résistance → faux espoir → lâcher volontaire lisible ; logo intégré à la matière | — | conserver cette dramaturgie pour le test risqué | inspection visuelle de la planche | PASS PROVISOIRE |
| — | `down-trigger-preprod-animatic-v01.gif` | Boucle de poses exportée ; audio et timing musical définitifs absents | morceau final non fourni | utiliser comme animatic de rythme, puis recaler sur l’audio | contrôle local du GIF et de ses dix images distinctes | PASS PROVISOIRE |
| — | `down-trigger-preprod-animatic-v02.gif` | Lecture chronologique avec holds ; vignettes ajustées sans étirement ; audio définitif absent | morceau final non fourni | recaler la cadence sur la piste dès qu’elle est disponible | export local vérifié : 6 keyframes, holds 300 ms, 960×540, séquence 0→5 sans retour arrière | PASS PROVISOIRE |
| MAJEUR | `test-07-11-contact-sheet-v01.png` | Contacts main/roche, repère fixe et détente volontaire lisibles ; masque et empreinte restent génératifs | référence canonique isolée manquante | remplacer le masque et l’empreinte avant fabrication intensive ; refaire un contrôle de raccord | planche ciblée inspectée visuellement | OUVERT |
| — | `down-trigger-clip-test-v01.gif` | Six poses lues dans l’ordre, cadence 8 fps, registration jitter discret, export GIF lisible ; pas d’audio | piste finale non fournie | recaler les holds et accents sur la musique ; remplacer les poses provisoires | contrôle local : 24 exposures, 3 s, 720×405, GIF vérifié par PIL et aperçu visuel | PASS PROVISOIRE |
| — | `test-07-11-contact-sheet-v02.png` | Même dalle portée par le personnage dans 01–04, repère cuivre persistant, détente avant séparation ; palette tactile conservée | masque et empreinte non canoniques | remplacer les placeholders et refaire un contrôle de raccord avec la référence validée | inspection visuelle de la nouvelle planche | PASS PROVISOIRE |
| — | `down-trigger-clip-test-v02.gif` | Découpe exacte sur les séparateurs de la planche v02 ; 24 expositions, 8 fps, 720×405 ; plus de bandes ni numéros | piste finale non fournie ; transfert de poids encore limité par les keyframes | recaler sur l’audio et produire des poses intermédiaires réelles | GIF vérifié par PIL et aperçu visuel ; durée encodée 2,88 s | PASS PROVISOIRE |
| — | `test-07-11-contact-sheet-v03.png` | Huit états ; détente au contact puis intervalle avant séparation ; même dalle et repère cuivre persistants dans l’axe | masque/empreinte provisoires ; continuité complète du repère encore à confirmer | revue Astra de la causalité et de la géographie | planche v03 inspectée visuellement | À REVOIR |
| — | `down-trigger-clip-test-v03.gif` | 32 expositions, 8 fps, 720×405 ; découpe exacte des huit panneaux v03 ; aucun débordement visible au premier aperçu | piste finale absente ; jitter simule encore les poses intermédiaires | contrôler toutes les expositions et produire les vraies poses après validation | PIL : 32 frames, délais 120 ms, 3,84 s encodées ; aperçu visuel | À REVOIR |
| — | `hand-release-test-v01.png` | Une seule main rattachée à une manche, même dalle et repère cuivre fixes ; trois états causaux | résultat génératif, non canonique | confirmer avec Astra puis intégrer le raccord dans la séquence globale | planche macro inspectée visuellement | À REVOIR |
| — | `hand-release-test-v01.gif` | 12 expositions, 8 fps, 720×405 ; raccord isolé lisible dans l’aperçu | audio absent ; mouvement issu de trois keyframes | recaler le geste sur la musique et remplacer par des poses de production | PIL : 12 frames, 120 ms, 1,44 s encodées ; aperçu visuel | À REVOIR |
| — | `hand-release-test-v02.png` | Fond/repère cuivre plus stables ; prise crochetée, détente au contact et séparation plus distinctes ; une seule main visible | résultat génératif, non canonique | obtenir le verdict Astra puis intégrer ce raccord au clip global | planche macro v02 inspectée visuellement | À REVOIR |
| — | `hand-release-test-v02.gif` | 12 expositions, 120 ms, 720×405 ; lecture locale et découpe vérifiées ; séquence macro complète | audio absent ; micro-jitter encore simulé | recaler sur la piste et remplacer par poses de production | PIL : 12 frames, 1,44 s encodées ; aperçu visuel | À REVOIR |
| — | `hand-release-test-v03.png` | Prise crochetée plus lisible, détente et séparation courte ; un seul axe macro et repère cuivre conservé | planche générative ; aucune animation GIF v03 encore produite | obtenir le verdict Astra ; puis réencoder le raccord choisi | planche v03 inspectée visuellement | À REVOIR |
| MAJEUR | `hand-release-test-v03.png` | Astra valide l’unicité main/manche et la progression générale | dernier contact, gabarit de dalle et amplitude du déplacement restent ambigus | produire une passe enregistrée sur gabarit fixe avant intégration globale | verdict Astra du 2026-09-08 | À CORRIGER |
| — | `hand-release-registered-v01.gif` | Plaque commune et couche main animée séparément ; 12 frames, 120 ms, 720×405 ; contrôle local effectué | qualité des contours et lisibilité du dernier doigt à confirmer par revue visuelle | faire arbitrer le raccord, puis intégrer ou corriger | export vérifié par PIL et aperçu local ; source `build_hand_release_registered_v01.py` | À REVOIR |
| — | `hand-release-registered-v02.gif` | Plaque commune ; dalle et repère cuivre fixes ; 16 frames réelles, 120 ms, 720×405, 2,00 s nominales ; dernier contact et petit espace ajoutés ; jitter global supprimé | poses toujours dérivées de la planche provisoire ; verdict visuel Astra en attente | arbitrer le raccord sur la planche des expositions, puis intégrer ou corriger | PIL : 16 frames, 120 ms, 2,00 s nominales ; planche `hand-release-registered-v02-contact-sheet.png` inspectée localement | À REVOIR |
| — | `hand-release-registered-v02-contact-sheet.png` | 16 expositions visibles dans l’ordre ; contrôle du maintien du repère et de la progression du lâcher | contrôle humain/Astra encore requis pour le dernier contact et les résidus | obtenir l’arbitrage visuel avant d’ouvrir la production intensive | planche exportée localement, 1440×924 | À REVOIR |
| MAJEUR | `hand-release-registered-v03.gif` | Masques distincts par pose ; plaque commune ; 12 frames, 120 ms, 720×405 ; retrait distribué sur plusieurs états ; aucun fragment résiduel identifiable au premier contrôle | verdict Astra en attente ; dernière pointe de contact et frontière gant/dalle à confirmer | arbitrer la passe v03 avant intégration au clip global | PIL : 12 frames, 120 ms, 1,50 s nominale ; planches globale et détaillée inspectées localement | À REVOIR |
| — | `hand-release-registered-v03-detail-sheet.png` | Planche agrandie permettant de comparer contact, interstice et retrait pose par pose | variations de palette possibles sur le fond fixe | conserver seulement si la continuité est validée | export local, 12 expositions détaillées | À REVOIR |
| — | `hand-release-registered-v08.gif` | 12 frames distinctes, 720×405, 120 ms/frame, 1,44 s ; un seul gant, pas de symbole répété ; plaque et cuivre géométriquement stables ; palette commune | dernier contact et premier interstice encore peu lisibles ; orientation 08→09 trop brusque ; de faibles variations chromatiques persistent | conserver comme preuve de direction/chaîne ; reconstruire deux poses de contact avant toute production intensive | contrôle PIL local ; inspection des 12 images ; verdict Astra du 2026-09-08 | À CORRIGER |
| — | `hand-release-registered-v08-detail-sheet.png` | Planche détaillée fidèle aux 12 images du GIF et lisible pour l’audit de raccord | le geste fin reste insuffisamment démontré à 720×405 | refaire le micro-raccord si passage en production demandé | inspection locale et revue Astra | À CORRIGER |
| MAJEUR | `hand-release-registered-v11.gif` | Macro recadré, opaque, 16 frames, 720×405, 120 ms/frame, 1,92 s ; symbole et dalle stables ; cadrage plus lisible | manche sectionnée ; forme polygonale de fond ; dernier appui/interstice toujours ambigus ; rotation 10→11 trop brusque | fournir une planche canonique isolée et reconstruire les poses articulées avant production intensive | contrôle PIL local et verdict Astra du 2026-09-08 | À CORRIGER |
| — | `hand-release-registered-v11-detail-sheet.png` | Planche de contrôle fidèle aux 16 expositions et plus lisible à taille réelle | le détourage provisoire reste visible dans la manche et le fond | ne pas utiliser comme asset de production ; conserver comme preuve de cadrage | inspection locale et revue Astra | À CORRIGER |
| MINEUR | `storyboard-revised-v01.png` | Rendu encore génératif et non un tournage/animation final image par image | — | remplacer progressivement par assets de production après validation du masque et des matières | statut du dossier de préproduction | OUVERT |
| MAJEUR | `down-trigger-masked-character-cutout-provisional-v01-clean.png` | Silhouette masquée isolée et alpha nettoyé ; dérivée de la couverture, donc non canonique | asset personnage officiel/planche de poses encore absente | faire valider l’identité et produire les poses articulées avant production intensive | inspection locale de l’alpha et du compositing v02 | À REVOIR |
| — | `down-trigger-character-core-prototype-v02.gif` | Plan lisible : résistance sur plaque, convergence des fissures, trou noir/core, déplacement et réduction du personnage en trois temps | audio absent ; mouvement construit par transformation d’un seul cutout ; granularité stop-motion à enrichir | recaler sur la piste finale, remplacer les transformations par poses articulées, puis lancer le découpage de production | contrôle local du GIF et de la planche-contact v02 ; 24 expositions, 960×540 | PASS PROVISOIRE |
| MAJEUR | `down-trigger-character-core-prototype-v04.gif` | La DA est désormais dessinée : aplats d’encre, sérigraphie, collage et accents rouille/bleu-gris ; silhouette lisible dans le décor | personnage encore dérivé d’une seule pose ; autres membres du groupe et poses canoniques absents | valider la bible de style et produire les planches/poses officielles avant fabrication intensive | contrôle local du GIF et de la planche-contact v04 ; 24 expositions, 960×540 | PASS PROVISOIRE |
| MAJEUR | `hand-release-illustrated-registered-v01.gif` | Une couche gant/manche continue tient une arête fixe ; six états de contact, dernier appui, interstice et lâcher lisibles ; repère cuivre stable | assets de main encore provisoires ; liaison exacte avec le corps à verrouiller ; audio absent | valider le raccord, puis remplacer les dérivés par les poses de production et recaler sur la musique | planche-contact v01 inspectée localement ; 12 expositions, 960×540, 120 ms | PASS PROVISOIRE |
| — | `down-trigger-masked-character-illustrated-provisional-v02-clean.png` | Interprétation non photoréaliste cohérente avec la nouvelle DA et détourage débarrassé des poussières de papier | asset non canonique et absence de planche complète des membres | conserver comme styleframe de travail ; produire une bible dessinée validée | inspection locale du compositing v04 | À REVOIR |
| — | `down-trigger-character-core-prototype-v05.gif` | Textures du personnage simplifiées en masses dessinées ; mouvement résistance → attraction → chute conservé ; décor et core stables | dérivé d’une pose unique ; autres membres et poses canoniques absents ; audio absent | utiliser comme styleframe/animatic avancé, puis remplacer par poses articulées de production | planche-contact v05 inspectée localement ; 24 expositions, 960×540 | PASS PROVISOIRE |
| MAJEUR | `hand-release-illustrated-registered-v01.gif` | Version révisée : 12 vignettes visibles, support texturé conservé pendant toute la séquence, gant/manche continus, interstice visible avant lâcher | niveau de détail du gant encore à harmoniser avec les aplats de la dalle ; pose canonique à valider | valider la DA et remplacer le dérivé par une planche de poses de production | planche-contact 4×3 inspectée localement ; 12 expositions, 960×540 | À REVOIR |
| MAJEUR | `hand-release-illustrated-registered-v02.gif` | Preuve technique vectorielle : dalle et repère cuivre fixes, manche continue, dernier doigt puis interstice puis dégagement complet | rendu volontairement schématique ; il ne constitue pas encore l’asset artistique final | conserver comme gabarit de continuité et le remplacer par des poses dessinées articulées | planche-contact 4×3 inspectée localement ; 12 expositions, 960×540, 120 ms | PASS TECHNIQUE |
| — | `hand-release-illustrated-registered-v03.gif` | Même gabarit technique avec support et repère fixes ; 12 frames effectivement encodées, dont holds non fusionnés ; succession dernier appui → espace → main dégagée lisible dans la planche | dessin volontairement schématique ; fluidité musicale et poses artistiques encore absentes | utiliser v03 comme référence de géométrie et construire les poses finales à partir de ce gabarit | PIL : 12 frames, 120 ms, 1,44 s ; planche-contact 3×4 inspectée | PASS TECHNIQUE |
| MAJEUR | `down-trigger-band-illustrated-lineup-provisional-v01.png` | Les six membres sont regroupés dans un langage visuel dessiné cohérent ; masques, silhouettes, vêtements et accents de palette lisibles | dérivé provisoire ; aucune planche de poses séparées ni validation humaine | utiliser comme styleframe, puis produire les marionnettes 2D articulées membre par membre | inspection visuelle locale | PASS PROVISOIRE |
| — | `down-trigger-clip-animatic-v06.gif` | Assemblage silencieux de 37 expositions : identité, résistance, macro du lâcher, révélation du core et chute ; logo Down Trigger correct dans les cartons | audio final absent ; personnages et main encore provisoires ; timing à recaler | importer la piste finale, relever les accents, puis remplacer les dérivés par les poses canoniques dessinées | export local et planche-contact v06 inspectés ; 960×540, 5,03 s nominales | PASS PROVISOIRE |
| MAJEUR | `hand-release-illustrated-registered-v04.gif` | Passe dessinée enrichie : dalle et repère cuivre fixes, manche continue, doigts articulés en pièces papier, dernier contact puis espace avant dégagement | le langage graphique est cohérent mais le personnage de la main reste un asset de travail ; verdict humain et raccord au corps absents | conserver comme candidate de mise en scène, puis remplacer par la main canonique et vérifier image par image sur l’audio | export local et planche-contact v04 inspectés ; 12 expositions, 960×540, 120 ms | À REVOIR |
| — | `down-trigger-clip-animatic-v07.gif` | Assemblage v06 avec la passe main/dalle v04 intégrée ; structure, logo, support fixe et transitions conservés | audio final absent ; assets canoniques et validation artistique absents | recaler sur la piste, puis lancer les poses articulées de production | export local et planche-contact v07 inspectés ; 37 expositions, 960×540, 5,03 s nominales | PASS PROVISOIRE |
| MAJEUR | `down-trigger-band-illustrated-model-sheet-provisional-v01.png` | Six silhouettes lisibles dans une DA dessinée : contours encre, aplats charbon/bleu-gris, accents rouille, personnage masqué identifiable | planche encore dérivée/provisoire ; figures non séparées en pièces articulées ; validation humaine absente | valider la piste graphique, puis produire six planches séparées avec articulations et poses de production | inspection visuelle locale ; styleframe 1821×864 | À REVOIR |
| MAJEUR | `down-trigger-masked-character-illustrated-model-provisional-v01-clean.png` | Silhouette masquée isolée, lisible et non photoréaliste ; mêmes masses charbon/bleu-gris et accents rouille que la planche de modèles | asset dérivé provisoire ; pose neutre unique ; pas encore de pièces articulées ni validation humaine | valider le modèle puis produire les poses résistance, appui, rotation et chute | alpha contrôlé localement ; 1024×1536 ; aperçu visuel | À REVOIR |
| MAJEUR | `down-trigger-masked-character-pose-sheet-provisional-v01.png` | Six poses dessinées couvrant neutre, résistance, progression au sol, prise, torsion et chute ; costume et masque cohérents | planche générée provisoire ; cases non séparées et accessoires de décor encore intégrés ; validation humaine absente | valider les poses puis les redessiner en pièces séparées pour le rig 2D | inspection visuelle locale ; planche 1024×1536 | À REVOIR |
| MAJEUR | `assets/derived-down-trigger/puppet-atlas-provisional-v01/` | Atlas de pièces PNG dérivé du modèle masqué : tête, torse, bras, mains, bassin, jambes et bottes ; transparence et chevauchements documentés | découpe polygonale de travail, non canonique ; recouvrements aux joints ; aucune pose animée avec ces pièces | redessiner/valider les contours puis brancher les couches sur les six poses de production | planche de contrôle et `manifest.json` inspectés localement | À REVOIR |
| MAJEUR | `down-trigger-puppet-rig-test-v02.gif` | Chute construite par compositing de pièces séparées ; 24 frames, 960×540 ; rotation locale des bras et chute globale lisibles | pièces provisoires avec chevauchements ; aucun raccord musical ; échelle encore technique | valider les découpes, puis remplacer les pièces par les assets canoniques et recaler sur l’audio | GIF et planche-contact v02 inspectés localement | PASS TECHNIQUE |
| MAJEUR | `down-trigger-clip-animatic-v09.gif` | Variante globale de 37 frames intégrant le test de rigging au plan core ; ordre des plans et durée 5,03 s conservés | silhouette plus petite dans le plan core ; assets et audio provisoires | garder comme preuve de pipeline 2D, sans remplacer v08 avant validation artistique | export et planche-contact v09 inspectés localement | PASS TECHNIQUE |
| MAJEUR | `docs/down-trigger-production-input-gate-v01.md` | Recherche des deux workspaces documentée ; absence d’audio et de planches canoniques explicitée ; formats d’entrée et déclencheur de production définis | entrées externes toujours manquantes | importer audio et assets canoniques, puis appliquer la cue sheet et le rig validé | document relu localement ; cohérent avec la recherche `rg --files` | OUVERT |
| — | `down-trigger-prototype-review-board-v01.jpg` | Vue comparative unique de la DA groupe, pose sheet, raccord main/dalle et animatics artistique/technique | éléments encore provisoires ; validation humaine non faite | utiliser comme support de décision avant de produire les découpes canoniques | planche 1800×1500 générée et inspectée localement | PASS PROVISOIRE |
| — | `down-trigger-continuity-report-v01.json` | Rapport automatisé : 4 contrôles PASS, dimensions et durées cohérentes, 0 changement des zones fixes dalle/repère sur le raccord et les deux animatics, alpha personnage valide | audio et assets canoniques séparés absents | relancer le rapport après import des entrées externes et avant rendu final | script `verify_down_trigger_continuity_v01.py` exécuté ; JSON relu localement | PASS PROVISOIRE |
| — | `down-trigger-character-core-prototype-v06.gif` | Plan planète/core reconstruit avec le nouveau modèle masqué ; résistance, attraction, rotation et chute lisibles ; 24 frames | une seule pose transformée ; audio absent ; poses canoniques manquantes | remplacer les transformations par des poses articulées après validation | export et planche-contact v06 inspectés ; 24 frames, 960×540 | PASS PROVISOIRE |
| MAJEUR | `down-trigger-clip-animatic-v08.gif` | Animatic global avec core v06 et main v04 ; raccord, logo et support fixe conservés | audio final absent ; assets encore provisoires ; cadence non musicale | recaler sur l’audio et remplacer les assets par les planches canoniques | export et planche-contact v08 inspectés ; 37 frames, 960×540, 5,03 s ; macro : 0 changement sur les zones fixes dalle/repère | PASS PROVISOIRE |
