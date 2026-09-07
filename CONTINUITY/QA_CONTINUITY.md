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

PÉRIMÈTRE : `prototypes/down-trigger-clip-preprod-v01/storyboard-revised-v01.png`, `down-trigger-preprod-animatic-v01.gif`, `docs/down-trigger-clip-preproduction-v01.md`  
CANON UTILISÉ : identité locale Down Trigger, logo clair local, silhouette encapuchonnée issue du visuel héros ; personnage masqué isolé non disponible  
MÉTHODE : inspection de la planche révisée, contrôle du découpage en six états, vérification du cadrage et de l’export GIF, comparaison avec les invariants de matière et de palette du projet  
STATUT : À CORRIGER AVANT PRODUCTION INTENSIVE

| Sévérité | Asset | Écart | Source à corriger | Correction / suite | Preuve | Statut |
|---|---|---|---|---|---|---|
| MAJEUR | `storyboard-revised-v01.png` | Masque et silhouette dérivés d’une référence de groupe, pas d’une planche canonique isolée | référence personnage manquante | fournir ou valider une planche isolée avant fabrication intensive | planche de préproduction inspectée | OUVERT |
| — | `storyboard-revised-v01.png` | Progression résistance → faux espoir → lâcher volontaire lisible ; logo intégré à la matière | — | conserver cette dramaturgie pour le test risqué | inspection visuelle de la planche | PASS PROVISOIRE |
| — | `down-trigger-preprod-animatic-v01.gif` | Boucle de poses exportée ; audio et timing musical définitifs absents | morceau final non fourni | utiliser comme animatic de rythme, puis recaler sur l’audio | contrôle local du GIF et de ses dix images distinctes | PASS PROVISOIRE |
| MINEUR | `storyboard-revised-v01.png` | Rendu encore génératif et non un tournage/animation final image par image | — | remplacer progressivement par assets de production après validation du masque et des matières | statut du dossier de préproduction | OUVERT |
