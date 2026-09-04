# 03 - Inventaire des assets - Portfolio immersif Nicolas Jez

## Politique d'import

Les ressources de `C:\Users\Nicolas JEZ\Documents\NJ\PORTFOLIO 1` sont inventoriees mais non copiees automatiquement. Tout import doit etre explicite et inscrit dans `docs/reprise/IMPORT-MANIFEST.md`.

## Inventaire automatique

- Fichiers inspectes : 112
- Extensions : .astro: 19, .cjs: 1, .css: 1, .csv: 1, .example: 1, .html: 2, .js: 1, .json: 11, .local: 1, .md: 30, .mjs: 3, .png: 1, .svg: 5, .ts: 29, .txt: 1, .yaml: 2, .zip: 2, [none]: 1
- Indices de classification :

- software marker: package.json
- software marker: pnpm-lock.yaml
- software marker: tsconfig.json
- artistic media: .png x1
- artistic media: .svg x5
- artistic directory: design
- artistic directory: media

## Shortlist du registre global

Aucune shortlist demandee. Utiliser `python scripts/asset_registry.py --query "..."` pour rechercher.

Cette shortlist est une proposition. Elle ne signifie ni telechargement, ni import, ni validation de licence pour un asset particulier.

## Tableau de suivi

| Asset ou dossier | Type | Source | Statut | Action ou raison |
|---|---|---|---|---|
| `src/content/projects/` | Contenus de projets | `PORTFOLIO 1` | a examiner | Inventorier toutes les oeuvres a montrer et completer les contenus avant production. |
| `NJ en T.png` | Portrait / identite | `PORTFOLIO 1` | a examiner | Confirmer usage, cadrage, droits et role dans l'experience. |
| `portfolio-portraits-5-formats.zip` | Portraits historiques | `PORTFOLIO 1` | a examiner | Ne pas importer avant selection et validation explicite. |
| `portfolio_portraits_sans_tatouages (1).zip` | Portraits historiques | `PORTFOLIO 1` | a examiner | Ne pas importer avant selection et validation explicite. |
| `portfolio_house_blockout_v01.blend` | Blockout 3D historique | `C:\Users\Nicolas JEZ\Documents\NJ` | a examiner | Inventorier seulement ; pas de reprise automatique dans la direction finale. |
| `NJ-FONT-DISPLAY-NEWSREADER-V1` | Typographie variable, romain et italique | Google Fonts / `google/fonts` | importe, candidat | Newsreader, licence OFL conservée avec les deux WOFF2 officiels ; direction à valider dans le héros réel. |
| `NJ-FONT-UI-MANROPE-V1` | Typographie variable d’interface | Google Fonts / `google/fonts` | importe, candidat | Manrope, licence OFL conservée avec le WOFF2 officiel ; direction à valider dans le héros réel. |

Statuts recommandes : `a examiner`, `conserve`, `importe`, `exclu`, `a recreer`, `a archiver`.
