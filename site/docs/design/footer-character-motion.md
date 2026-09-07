# Petit personnage — planche de mouvement

Référence : `public/media/footer/nicolas-platform-idle-v6-alpha-clean.png` pour la boucle du plongeoir, `public/media/footer/nicolas-poses-v2-alpha.png` et la pose de remontée `nicolas-rising-v2-alpha.png`.

## Récit

Le personnage attend sur un plongeoir discret en haut à gauche de la landing. Un petit panneau « DON'T CLICK » accompagne la scène comme gag visuel. Le clic sur le personnage déclenche une chute courte et lisible, puis la page rejoint le footer. Le personnage remonte derrière le trait, présente l’adresse et le même panneau réapparaît à côté de l’email comme rappel comique.

## Beats

| Beat | Zone | Pose / action | Intention |
|---|---|---|---|
| 0 | Landing | Attente, salut et micro-respiration | Donner envie d’explorer sans ajouter un bouton intrusif |
| 1 | Landing | Main qui redescend | Rendre la transition lisible |
| 2 | Landing | Curiosité, léger lean vers la droite | Préparer le mouvement |
| 3 | Landing | Lean plus profond, pied qui avance | Ajouter un mouvement intermédiaire |
| 4 | Landing | Corps presque en plongeon | Installer le gag cartoon |
| 5 | Landing | Bras qui partent vers la droite | Donner une impulsion visible |
| 6 | Landing | Recul réflexe, toujours orienté vers la droite | Faire respirer la pose |
| 7 | Landing | Deux paumes levées, geste « non » | Rendre le refus immédiatement compréhensible |
| 8 | Landing | Petit haussement d’épaules puis retour à l’attente | Fermer la boucle sans à-coup |
| 9 | Landing | Disparition sous le cadre au clic | Faire comprendre le passage vers le bas |
| 10 | Footer | Deux mains derrière le trait | Point d’ancrage de la séquence historique validée |
| 11 | Footer | Tête puis épaules | Montée par changements de planche |
| 12 | Footer | Torse et appui | Donner du poids à l’effort |
| 13 | Footer | Accroupi, reprise d’équilibre | Transition vers la pose de présentation |
| 14 | Footer | Redressement | Préparer le geste final |
| 15 | Footer | Debout, bras orienté vers l’adresse | Rendre les coordonnées immédiatement lisibles |

## Règles de finition

- Les changements de pose restent visibles et espacés ; aucune interpolation douce ne remplace une planche.
- Le trait reste le repère de sol et de disparition ; aucun décor de salon, fauteuil ou arrivée assise.
- Le clic est disponible au clavier et au tactile ; les coordonnées et le lien email restent accessibles sans l’animation.
- Les panneaux « DON'T CLICK » sont des repères décoratifs ; ils ne capturent pas le clic et ne remplacent aucun lien.
- `prefers-reduced-motion` affiche directement la pose finale et rejoint le footer sans mouvement.
