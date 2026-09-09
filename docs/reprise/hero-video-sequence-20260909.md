# Héros vidéo — livraison locale du 9 septembre 2026

Demande validée : trois vidéos plein cadre, portrait transparent complet v2 et loupe colorée sur le titre. Aucun push ni déploiement.

## Comportement

| Ordre | Source | Raccord en temps source | Temps à l'écran approximatif à vitesse 0,8 |
|---|---|---|---|
| 1 | 60716-495935001, copie active `landing-hero-video.mp4` | 11,32 s / 20,22 s | 14,15 s |
| 2 | 91744-636709154 | 9,56 s / 17,07 s | 11,95 s |
| 3 | 165208-832102298 | 16,24 s / 29 s | 20,30 s |

Retour du troisième clip au premier. Lecture muette, inline, recadrage cover. Le prochain lecteur est préparé en arrière-plan, puis sa première image décodée déclenche le raccord : recouvrement de 100 ms et micro-décalage/variation chromatique de 180 ms sur le décor uniquement. Le portrait et les lettres restent stables.

Si le clip suivant tarde, le lecteur conserve l'image sortante au point de coupe et réessaie. Une erreur média entraîne un rechargement à la tentative suivante. Pause hors écran et quand l'onglet est masqué ; reprise à son retour. La préférence de mouvement réduit conserve un fond fixe et désactive lecture et glitch.

Le portrait `nicolas-jez-hero-cutout-v2.png` est utilisé tel quel, sans nouveau détourage ni modification. Son hash est inchangé. Le texte reste à gauche sur ordinateur ; sur mobile il est placé sous le menu, avec retour à la ligne du rôle.

## Fichiers de cette intervention

Modifiés :

- `site/src/components/immersive/InsideMindHero.astro` : lecteurs superposés, référence au portrait v2, styles de raccord et ajustement mobile.
- `site/src/lib/inside-mind.ts` : branchement du lecteur de séquence et nettoyage à la navigation.
- `docs/01_REGISTRE_DES_DECISIONS.md` : demande validée D-075.
- `docs/03_INVENTAIRE_DES_ASSETS.md` : provenance des médias et archive.
- `docs/06_RISQUES_ET_INCERTITUDES.md` : limites de raccord, poids et appareils restant à vérifier.

Ajoutés :

- `site/src/lib/hero-video-reel.ts` : lecture, préchargement, raccords et cycle de vie.
- `site/public/media/identity/91744-636709154_medium.mp4`.
- `site/public/media/identity/165208-832102298_medium.mp4`.
- `site/scripts/verify-hero-video-reel.mjs` : cycle réel complet, loupe, pause/reprise, mouvement réduit, mobile, navigation.
- `site/scripts/verify-hero-video-recovery.mjs` : téléchargement retardé et contrôle des compositions mobiles finales.
- `archives/landing-hero-before-sequence-20260909/` : vidéo active et deux fichiers de code sauvegardés avant intervention, README de restauration et première capture après intégration.
- Le présent rapport. Captures de recette locales : `site/test-results/hero-video-reel/`.

Les trois copies vidéo correspondent exactement aux sources Downloads. La vidéo active n'a pas été réencodée ou écrasée. Les modifications antérieures du projet sont conservées.

## Vérifications

- `pnpm check` : zéro erreur, zéro avertissement, zéro indication.
- `pnpm build` : 15 pages générées. Avertissement préexistant sur un bundle supérieur à 500 ko.
- Cycle réel 1 → 2 → 3 → 1 observé sans accélération du test : un seul clip actif après chaque raccord, lecteurs sortants masqués et remis au départ hors écran.
- Loupe : affichage réel vérifié au survol, dégradé coloré présent, capture contrôlée.
- Pause/reprise hors écran et préférence de mouvement réduit contrôlées.
- Simulation d'un téléchargement retardé : dernière image conservée ; reprise vers le deuxième clip après disponibilité des données.
- Captures desktop et mobiles 390/320 px inspectées ; aucun débordement horizontal, texte placé sous le menu.
- Navigation vers l'univers puis retour à la landing vérifiée ; aucune erreur JavaScript dans le parcours contrôlé.

## Limites

Les trois décors sont différents : le changement de plan reste volontairement visible, masqué brièvement par le glitch, et ne constitue pas une continuité de caméra parfaite. Sur un réseau insuffisant, une tenue d'image peut apparaître au raccord. Les fichiers totalisent environ 46,5 Mio ; le premier clip reste limité à 1358 × 720. La recette a été réalisée sous Chromium local avec émulation mobile ; Safari/iOS physique reste à vérifier avant publication.
