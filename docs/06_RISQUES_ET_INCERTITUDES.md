# 06 - Risques et incertitudes - Portfolio immersif Nicolas Jez

| ID | Risque ou incertitude | Probabilite | Impact | Test ou information manquante | Etat |
|---|---|---|---|---|---|
| I-000 | Le site n'atteint pas un niveau suffisamment premium pour jouer son role de carte de visite carriere. | moyenne | critique | Benchmark documente, revue externe, criteres gold pass/fail. | ouvert |
| I-001 | La liste des oeuvres a montrer est incomplete ou certaines oeuvres ne sont pas publiables. | elevee | critique | Inventaire exhaustif, droits, credits, assets et statut de chaque oeuvre. | ouvert |
| I-002 | La direction devient un effet gadget ou ressemble a un portfolio 3D generique. | moyenne | fort | Planches, storyboard, principes narratifs et rejet explicite des references faibles. | ouvert |
| I-003 | La plateforme choisie favorise l'effet visuel mais fragilise mobile, performance, SEO ou maintenance. | moyenne | critique | Comparatif Webflow / Astro + ilot immersif / architecture JavaScript dediee. | ouvert |
| I-004 | Le passage portrait vers monde interieur est techniquement ou artistiquement faux. | moyenne | critique | Storyboard, animatique non codee, test de coherence avec les assets reels. | ouvert |
| I-005 | La navigation immersive masque les oeuvres ou ralentit l'acces a un recruteur presse. | moyenne | critique | Parcours direct alternatif, carte lisible, acces projet en moins de quelques interactions. | ouvert |
| I-006 | Le benchmark Lando Norris pousse a copier une identite qui n'est pas celle de Nicolas. | moyenne | fort | Extraire les principes, pas les formes ni l'identite. | ouvert |
| I-007 | Le master autonome Vantel et son archive sont présents localement ; les droits de publication devaient être confirmés. | moyenne | fort | Nicolas confirme que le projet et tous ses médias sont fictifs, créés pour le portfolio et librement utilisables dans celui-ci. | résolu le 2026-09-04 |
| I-008 | Les projets conceptuels pourraient etre pris pour des commandes reelles. | moyenne | critique | Afficher le statut `concept` dans chaque etude de cas et dans les metadonnees. | ouvert |
| I-009 | Le projet Maison Sillon évolue vers Atelier NØR ; les captures sont désormais issues du prototype Atelier NØR, mais l'URL publique finale et le libellé définitif restent à confirmer. | moyenne | fort | Confirmer le lien public et le nom final avant publication. | ouvert |

## Hypotheses de travail

- La classification `hybrid` est un point de depart, pas une decision irrevocable.
- Les ressources historiques restent dans leur emplacement tant qu'un import n'est pas valide.
- La contrainte carriere et le niveau gold sont desormais des decisions sponsor ; leurs preuves restent a produire.
- La plateforme est maintenant orientee vers Astro + TypeScript + CSS natif avec un ilot immersif isole ; les versions seront figees a l'installation.

## Regle de suivi

Une incertitude devient une decision seulement lorsqu'elle est resolue par une preuve ou un arbitrage trace.

## Raccords du héros — 2026-09-09

La séquence assemble trois plans différents, pas un travelling géométriquement continu. Les raccords à 56 % des durées (11,32 s, 9,56 s, 16,24 s de temps source), à vitesse 0,8, utilisent un recouvrement de 100 ms et un glitch de 180 ms. Un changement de décor reste perceptible et intentionnel.

Le lecteur attend une image décodée du prochain clip avant de le révéler. Si le chargement tarde ou échoue, il conserve la dernière image du clip sortant et réessaie ; une tenue prolongée peut alors être perceptible. Les trois fichiers représentent environ 46,5 Mio, dont deux clips 1440p : réseau mobile lent et Safari/iOS physique restent à contrôler avant publication. Le premier clip est limité à sa résolution source 1358 × 720. La préférence de mouvement réduit désactive lecture et glitch, et conserve une image fixe.
