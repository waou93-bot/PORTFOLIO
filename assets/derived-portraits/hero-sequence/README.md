# Séquence de portraits du héros

## Intention validée

Trente portraits panoramiques destinés à une permutation progressive dans le héros. Le visage reste frontal, centré, à échelle constante et regarde la caméra. Le décor, la tenue, les lunettes, les accessoires et la lumière changent. Les images 21 à 30 installent une montée surréaliste jusqu'au monde intérieur.

## Source canonique

- `../hero-expanded/nicolas-jez-centered-frontal-hero-v1.png`
- identité reconstruite depuis les portraits 01, 02, 03 et 05 du pack sans tatouages ;
- génération réalisée avec le générateur d'images intégré, en mode édition avec référence locale.

## Versions

- `01` à `16`, puis `18` à `30` : premières versions conservées ;
- `17-brutalist.png` : première tentative, cadrage trop éloigné, conservée pour traçabilité ;
- `17-brutalist-v2.png` : correction retenue, gros plan rétabli ;
- `hero-sequence-contact-sheet-v2.jpg` : planche de contrôle des trente variantes retenues.

## Continuité

Invariants demandés dans chaque prompt : identité, frontalité, regard caméra, centre du visage, ligne des yeux, taille de tête, distance caméra et expression. Variables : vêtements, lunettes, accessoires, décor, matière et lumière.

Les copies prêtes pour la production se trouvent dans `aligned-v1/`. Elles ont été recalées sur le portrait frontal canonique à partir de trois repères : les deux coins externes des yeux et le menton. L'erreur mathématique maximale de mapping enregistrée est inférieure à `0,001 px` sur les trente frames. Conserver aussi un cadrage CSS identique (`object-fit: cover; object-position: 50% 50%`) pour toute la séquence.

## Droits

Assets créés spécifiquement pour le portfolio à partir des portraits de Nicolas Jez. Aucun média tiers n'a été importé dans cette série.
