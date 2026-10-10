# Montage miroir unique — 10 octobre 2026

Demande D085 : intégrer le miroir et les raccords des vidéos originales dans un seul fichier. D086 : aucun budget externe.

## Livraison locale

`hero-mirror-loop-v1.mp4` : 1920 × 1080, 30 images/s, H.264 yuv420p, sans audio, durée 18.966667 s, 12714237 octets (12.7 Mo). Atome moov avant mdat, début de lecture progressif. Poster WebP 1280 × 720. Six plans conservés : concert, foule, lasers, Terre, ville, bokeh. Miroir du demi-cadre gauche, demi-cadre droit pour la Terre. Fondus 480 ms cuits dans le média, raccord dernier/premier intégré. Lecture native à vitesse 1, aucun timer de coupe, boucle rAF ou double lecteur pour le fond.

Sources originales et exports antérieurs préservés. Version de travail haute qualité (18.9 Mo) conservée en sauvegarde ; encodage de livraison depuis les mêmes intermédiaires issus des originaux, preset medium CRF 23. Commande reproductible gratuite : `python scripts/build-single-hero-video.py`. `--finish-only` réutilise uniquement les intermédiaires déjà produits dans la sauvegarde du lot.

## Recette

- Astro check final et compilation Astro : aucune erreur ; 19 pages compilées.
- Trois tests unitaires réussis : vitesse normale et pause/reprise hors écran ; réduction de mouvement et onglet masqué ; chargement et libération des ressources à la navigation.
- Décodage intégral FFmpeg du MP4 final : aucune erreur.
- Boucle : différence moyenne RGB dernier/premier à 160 × 90 = 0.414/255, contre 5.897 entre les deux premières images. Cette mesure confirme la continuité des extrémités ; elle ne mesure pas la fluidité du navigateur.
- Recette locale ordinateur 1280 × 720 et mobile 375 × 812 : fond vidéo visible, portraits miroir conservés, aucun débordement horizontal ; sur mobile, un seul élément vidéo, appui du personnage visible. Captures et preuve DOM dans ce dossier.
- Loader visage et chute du personnage conservés ; arrivée au footer contrôlée après déclenchement clavier.

Gain établi : un lecteur actif au lieu de deux, et quatre pendant les anciens raccords ; aucune composition du miroir ou coupe JavaScript pendant la lecture. Les trois anciens éléments vidéo de l’introduction 3D inutilisée sont retirés du HTML, leurs fichiers restent conservés. Le nouveau fichier est plus lourd que les six anciens exports 960 px/24 fps (1.76 Mo au total) : pas de gain de téléchargement revendiqué, priorité donnée à la définition et à la cadence. Aucun benchmark de consommation CPU/GPU ni compteur d’images perdues disponible dans cette recette ; aucun score Lighthouse inventé.

Le serveur Astro dev ne démarrait pas dans l’environnement ; l’aperçu sert le build validé avec le serveur Python local sur http://127.0.0.1:4330/. Aucun déploiement de ce lot.

Design Quality : direction, typographie et composition existantes conservées ; contact sheet des six plans contrôlée, miroir cohérent, pas de nouveaux effets ou contenu. Réduction de mouvement, fallback affiche et accès au contenu maintenus.

Motion : tentative initiale job `c12504b8-5cd6-4315-8ddd-d94310182353`, état `awaiting_user_input` faute de crédits, aucun rendu livré, achat/recharge refusés selon la demande et aucune relance. Production finale avec FFmpeg déjà installé, hors ligne.
