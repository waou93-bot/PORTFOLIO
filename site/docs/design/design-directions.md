# Design — Directions artistiques (3 propositions)

## Direction A — « Le dossier » (éditorial clair)

**Intention.** Le portfolio se présente comme un dossier de presse édité : fond papier ivoire, encre sombre, typographie éditoriale forte (sérif display), grande respiration, médias encadrés comme des planches. Chaque projet ouvre dans son propre accent couleur. Référence : édition imprimée contemporaine, archives de studio — pas une page web « techno ».

- **Typographie** : Instrument Serif (display, italiques éditoriales) + Archivo Variable (corps, UI, données).
- **Palette** : ivoire `oklch(0.975 0.004 90)`, encre `oklch(0.18 0.008 90)`, gris médium, accent couleur par projet.
- **Composition** : grille 12 col, numéros de section, grandes marges, média plein cadre dans la colonne, légendes petites capitales.
- **Grille** : en-tête de page façon sommaire ; cartes projets alignées sur une liste éditoriale (titre + métadonnées + vignette encadrée).
- **Mouvement** : reveals doux (translateY + fade), hover vignette (zoom subtil), transitions de route sobres.
- **Mobile** : grille qui se resserre, typo fluide, liste lisible ; les métadonnées restent en dessous du titre, jamais cachées.
- **Risques** : moins « wow immédiat » qu'un dark Awwwards ; dépend d'une exécution typographique irréprochable.
- **Coût dev** : faible (pas de fonds animés, pas de 3D). **Perf** : excellente (fond clair = pas de vidéo de fond ; images en vedette). **Compat univers** : très élevée — le métal comme Paris comme le territoire trouvent leur place sur papier.

## Direction B — « Dark studio » (immersif techno)

**Intention.** L'esthétique « studio digital créatif » : fond presque noir, typo massive condensée, grille visible, previews vidéo plein écran, cursor custom, overlay mono. C'est la direction la plus répandue chez les sites primés — donc la plus risquée en termes de cliché.

- **Typographie** : Archivo condensé graisses fortes + mono pour les données.
- **Palette** : noir `oklch(0.13 0.005 90)`, blanc cassé, accent saturé par projet.
- **Composition** : full-bleed, typo XXL, chiffres. **Mouvement** : reveals masqués, parallax léger, previews actives.
- **Mobile** : même logique mais noir ; lecture OK. **Risques** : clone Awwwards ; contraste plus difficile ; écrase les projets aux univers clairs (Paris 70s) ; vidéos lourdes en preview.
- **Coût dev** : moyen-élevé. **Perf** : moyen (risque de médias lourds). **Compat univers** : moyenne (dark imposé).

## Direction C — « Contraste » (hybride éditorial + immersif)

**Intention.** Base claire éditoriale (Direction A) + capacité de thème sombre par projet : un projet comme Down Trigger peut ouvrir en « monde sombre » via sa propre palette, avec une transition de thème contextualisée au changement de page. Le cadre reste neutre, mais chaque projet peut inverser sa polarité.

- **Typographie / palette / grille** : héritées de A, avec tokens `dark` par projet.
- **Mouvement** : reveals + transition de thème (fond/polarité) entre l'accueil et la page projet.
- **Risques** : plus de variantes à tester (contraste, mode sombre par projet) ; complexité de thème modérée.
- **Coût dev** : moyen. **Perf** : bonne. **Compat univers** : la plus élevée.

## Matrice de décision (pondérée)

| Critère                            | A       | B          | C   |
| ---------------------------------- | ------- | ---------- | --- |
| Singularité (1–5)                  | 4       | 2 (cliché) | 5   |
| Lisibilité / crédibilité (1–5)     | 5       | 3          | 5   |
| Adaptabilité aux univers (1–5)     | 5       | 2          | 5   |
| Mobile (1–5)                       | 5       | 3          | 4   |
| Accessibilité / contraste (1–5)    | 5       | 3          | 4   |
| Performance (1–5)                  | 5       | 3          | 4   |
| Coût de dev (1=cher, 5=bon marché) | 4       | 2          | 3   |
| Moyenne                            | **4.7** | 2.6        | 4.3 |

## Choix

**Direction A, avec la capacité de thème de C** (chaque projet peut inverser sa polarité via `theme.dark`). Raison : A gagne en lisibilité, crédibilité, accessibilité, performance et adaptabilité ; l'option `dark` par projet apporte la profondeur immersive quand le projet le mérite, sans contaminer l'ensemble du portfolio (exigence du brief : ne pas laisser Down Trigger définir l'esthétique globale).
