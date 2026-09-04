# Footer stop-motion — pack de production v1

Autorisation : Nicolas demande de générer les assets de son personnage franchissant le rebord du footer puis désignant le contact.

## Canon

ID personnage : NJ-FOOTER-CHAR-V1. Référence inspectée : `site/public/media/identity/sequence-expression-v1/frame-01.webp` (portrait dérivé, pas photo d'identité originale). Conserver crâne rasé, barbe rousse courte, lunettes transparentes, veste ivoire, t-shirt noir. Yeux bleus selon correction explicite du propriétaire, malgré la référence dérivée. Pantalon noir et chaussures sombres : choix de production pour les parties non visibles dans la référence. Pas de tatouages ni de logo.

## Assets

NJ-FOOTER-SPRITE-V1 : planche de huit poses détourées en grille 4 × 2, destinée au footer. Statut : à générer. Source : génération intégrée, référence personnage ci-dessus. Aucun original remplacé.

## États

1. Mains agrippées au rebord imaginaire ; personnage sous le rebord.
2. Tête dépasse, mains toujours fixes.
3. Poitrine montée, coudes pliés.
4. Bras tendus, buste au-dessus.
5. Genou passé sur le rebord.
6. Personnage accroupi sur le rebord.
7. Se redresse, tourne vers le contact à droite.
8. Pointe vers la droite avec un sourire.

Caméra fixe, même échelle et même axe ; poses successives volontairement distinctes pour le stop-motion. Fond transparent, rebord dessiné par le site et non dans les images. Grille uniforme sans texte. Lecture unique ; pose finale statique tactile/mouvement réduit.

## QA

Génération intégrée Imagegen, trois appels (planche initiale, correction du fond, remplacement de pose 7). Inspection visuelle de chaque résultat.

- `assets/footer-stopmotion-v1/poses-atlas-dark-v2.png` : huit poses sur fond sombre opaque, 1774 × 887. Source conservée dans le dossier de génération. Planche initiale au damier peint rejetée (absence de canal alpha vérifiée).
- `assets/footer-stopmotion-v1/pose-07-rising-v2.png` : remplacement individuel de la pose 7, jambes et chaussures complètes ; référence directe du visage conservée.
- MINEUR : expression et proportions varient légèrement, ce ne sont pas des frames géométriquement recalées.
- MAJEUR pour intégration : la planche n'est pas une grille régulièrement enregistrée malgré le prompt ; les régions doivent être cadrées individuellement et leurs points de contact alignés au rebord. Ne pas utiliser directement une animation CSS en huit cellules uniformes.
- Fond sombre opaque, PAS de transparence. À composer uniquement dans le footer sombre ; harmonisation des bords nécessaire.
- La pose 7 de l'atlas est rejetée (jambes tronquées), remplacée par le fichier individuel.
- Statut : sources générées et inspectées, montage et contrôle de l'animation dans le footer encore à faire. Aucun remplacement de la landing effectué pendant cette génération.

## Prompts de production (synthèse reproductible)

## Intégration terminée — 2026-09-05

Les originaux restent dans `assets/footer-stopmotion-v1`. Copies de service versionnées dans `site/public/media/footer`. Le cadrage est réalisé dans le navigateur avec des rectangles individuels (aucune grille uniforme), points d'appui enregistrés au rebord et échelles distinctes pour la pose 7. Le fond sombre est composé en mode éclaircir contre le fond réel du footer : absence de rectangle constatée sur captures desktop et mobile.

Montage : huit poses, de 0 à 1,70 s, petites levées en trois paliers, tenue finale de 650 ms après la dernière levée. Aucun fondu de visages superposés. Lecture unique au seuil de visibilité, pause hors écran/onglet caché. Respiration finale de 0,4 % sur 5,8 s, sans translation des pieds. État conservé pendant les navigations Astro, réinitialisé au rechargement. Pose finale statique sur tactile ou mouvement réduit. L'adresse reste du texte HTML accessible indépendamment des images.

QA : `site/scripts/qa-footer-nicolas.mjs` passe en Chromium desktop 1440 px, tactile émulé 390 px et mouvement réduit. Huit poses observées dans l'ordre, zéro erreur JS, maintien après scroll et navigation, lien email exact, pas de débordement. Captures `footer-desktop-verified.png`, `footer-mobile-verified.png`, `footer-reduced-verified.png`. Build et Astro check passent (57 fichiers). Contrôle sur appareils physiques non réalisé ; légères différences photographiques entre poses assumées comme stop-motion, pas de garantie de morphologie pixel-parfaite.

Référence directe : portrait frontal frame-01. Homme reconnaissable, crâne rasé, barbe rousse, lunettes transparentes, yeux bleus, blazer ivoire, t-shirt/pantalon noirs et chaussures sombres, sans tatouages. Traitement photographique découpé, proportions adultes, caméra frontale fixe. Huit états listés ci-dessus, aucun texte ni décor, échelle constante et rebord invisible commun. Demande initiale de transparence non satisfaite ; correction vers fond uni #090807. Correction individuelle 7 : corps complet, deux jambes et chaussures dans le cadre, genoux légèrement fléchis, buste se redressant, regard à droite, pas encore de geste pointé. Mêmes identité et tenue.
