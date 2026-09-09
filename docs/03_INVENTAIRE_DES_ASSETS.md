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


## Logos manuscrits NJ — exports transparents du 2026-09-05

- Autorisation de Nicolas : détourage local et versions sombre/claire enregistrées dans le MASTER.
- `logo sombre.png` : encre sombre, PNG RGBA, 1199 × 1312 px.
- `logo clair.png` : encre ivoire, PNG RGBA, même masque alpha et mêmes dimensions.
- Extraction depuis la version sur papier : tracés conservés, fond éliminé par luminance, variations de densité converties en opacité.
- Anciens exports avec damier incrusté conservés par copie avant remplacement dans `archives/logos-avant-transparence-20260905-031232`. Source sur papier conservée dans cette archive.
- `apercu logos transparents.png` : contrôle des superpositions sur fonds clair et sombre ; aperçu opaque, distinct des deux calques.
- Transparence RGBA vérifiée ; aucune intégration au site effectuée.

## Séquence vidéo du héros — 2026-09-09

- `site/public/media/identity/landing-hero-video.mp4` : vidéo 60716-495935001 déjà active, 1358 × 720, 20,217 s ; conservée octet pour octet et archivée avant intervention.
- `site/public/media/identity/91744-636709154_medium.mp4` : copie de Downloads, 2560 × 1440, 17,067 s ; deuxième clip.
- `site/public/media/identity/165208-832102298_medium.mp4` : copie de Downloads, 2560 × 1440, 29 s ; troisième clip.
- `site/public/media/identity/nicolas-jez-hero-cutout-v2.png` : calque premier plan existant 1024 × 1536, RGBA ; canal alpha présent avec pixels transparents ; fichier inchangé (SHA-256 `CA3A14F8C573E6F1056770A382F5E0DF9026CEE36CC2DA504D0B357D2B6661E4`).
- Restauration : `archives/landing-hero-before-sequence-20260909/README.md` et copies locales de la vidéo et des composants avant intégration.
- Les trois sources Downloads sont préservées. Aucun asset existant supprimé, renommé ou redétouré.
