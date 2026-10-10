# Diagnostic vidéo landing — 10 octobre 2026

Périmètre : expliquer les saccades et la qualité signalées par Nicolas. Aucun code ou média modifié.

## Faits vérifiés

FFprobe sur les six fichiers actifs, confirmés dans le DOM public de www.wadek.fr :

| Clip | Dimensions | Cadence | Durée source | Taille en octets | Débit vidéo bit/s |
|---|---|---|---|---|---|
| 01 | 960 × 728 | 24 | 1.916667 s | 314413 | 1304786 |
| 02 | 960 × 540 | 24 | 3.5 s | 803395 | 1832075 |
| 03 | 960 × 540 | 24 | 3.791667 s | 223661 | 467716 |
| 04 | 960 × 508 | 24 | 2.541667 s | 69332 | 213116 |
| 05 | 960 × 540 | 24 | 2.208333 s | 132657 | 475036 |
| 06 | 960 × 540 | 24 | 3.416667 s | 219838 | 510698 |

`hero-video-reel.ts` fixe playbackRate à 0.8. Cadence temporelle calculée : 24 × 0.8 = 19.2 images source par seconde de lecture. Aucun procédé d’interpolation du ralenti dans ce lecteur.

`InsideMindHero.astro` crée deux lecteurs indépendants par clip (source et miroir), soit douze éléments vidéo. Une paire joue hors raccord, deux pendant le fondu 480 ms ; les autres paires sont arrêtées. Le miroir utilise clip-path et scaleX(-1), chaque vidéo applique saturate/contrast. Les deux lecteurs ne sont pas synchronisés image par image.

DOM public mesuré : viewport 1280 × 720, DPR 2 ; chaque vidéo occupe 1265 × 720 pixels CSS, object-fit cover. Les fichiers sont donc agrandis au-delà de leur définition, particulièrement sur écran dense. Les coupes se produisent à durée moins 0.5 s, avec anticipation supplémentaire de 0.4 s, puis fondu ; les clips étant courts, ces raccords sont fréquents.

## Interprétation

Cadence faible après ralentissement et agrandissement sont établis. Ils expliquent respectivement une part du mouvement haché et de la perte de détail. Double décodage, composition filtrée et désynchronisation peuvent aggraver le résultat sur certaines machines ; leur impact exact reste non mesuré. Un faible débit seul ne suffit pas à prouver une compression visuellement excessive pour tous les plans.

## Limites et suite pertinente

Aucun outil de trace DevTools disponible. Le navigateur piloté n’expose pas getVideoPlaybackQuality dans sa vue DOM de lecture ; impossible de quantifier les images perdues, les stalls réseau ou la cadence réellement présentée. Aucun score CWV/Lighthouse attribué à ce diagnostic.

Pour corriger : repartir des sources pour produire un montage continu conservant une cadence suffisante après ralentissement et une définition adaptée à l’affichage ; intégrer le miroir au média pour éviter deux lecteurs par plan. Garder les portraits miroir et le stop motion du visage/personnage. Comparer netteté et lecture réelles avant publication, sans simplement dupliquer des images pour afficher un chiffre de fps supérieur.

Références d’API consultées : https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate et https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality.
