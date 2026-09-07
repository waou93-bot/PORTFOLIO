# V2 — Carte du ciel

## État actuel après essais

La source active est désormais `371443_medium.mp4`, copiée sous `universe-alt-source-v2.mp4`. Les références ci-dessous à la galaxie bleue décrivent le premier essai, non le média actif.

Dérivé actif : `universe-v3-fast.mp4`, encodeur FFmpeg/libx264, CRF 24, preset fast, sans audio, yuv420p, faststart, 720 × 1280, cadence source de 30 images/s conservée. Affiche : `universe-v3-poster.jpg`, première image du fichier source. Original de 16,6 Mo conservé. Les sorties `universe-alt-web-v2.webm` et `universe-alt-poster-v2.jpg` issues du premier outil de capture sont exclues du rendu (mauvais cadrage/étirement de la source verticale).

Le dérivé bleu par MediaRecorder est également remplacé : Nicolas a constaté des saccades. L'encodage de la nouvelle source est effectué hors lecture temps réel pour éviter les irrégularités dues à la capture.

Chargement : préparation au clic de la landing, blob partagé entre routes et première image décodée ; accélération courte durant cette préparation, puis glitch validé. Une affiche de la galaxie remplace le fond vide. Le second lecteur charge après le démarrage du premier, non simultanément à l'arrivée. Les anciennes vidéos montagne cachées du héros ne sont plus préchargées.

Le héros lent à divisions systématiques a été essayé puis écarté par Nicolas. Retour à la boucle rapide antérieure et splits sporadiques uniquement, voir D-061 à D-064.

## Validation du 5 septembre 2026

Nicolas abandonne l'essai de sommets au scroll et fournit `373885_medium.mp4` pour une carte du ciel. Il valide les quatre repères stables, les fiches révélées au survol/toucher et la lecture en boucle infinie.

- V1 inchangée sur main et son tag de restauration.
- Route active : `/univers-v2` ; essai montagne conservé dans `/univers-montagnes-v2` avec son script original.
- Source copiée sans modification : `site/public/media/transition/galaxy-source-v2.mp4`, 12 935 332 octets, 2560 × 1440, 10,4 s. Original Downloads conservé.
- Aucune génération, recolorisation ou voile global. Lecture à 75 % ; raccord par superposition progressive de deux lecteurs sur les 1,2 dernières secondes de média. Il s'agit d'un raccord en fondu, pas d'une boucle source géométriquement parfaite.
- Repères indépendants du décor : une fiche à la fois, trait diagonal puis horizontal, ouverture clavier/tactile, sortie avec Échap et liens directs sous la scène.
- Pause explicite, pause hors écran/onglet caché et image fixe par défaut en mouvement réduit.

## Vérifications

Chromium headless, sans contrôle souris du bureau : deux cycles consécutifs observés, commande pause arrête les deux lecteurs, mouvement réduit arrête les deux lecteurs, largeur mobile 390 px sans débordement. Astro check : 63 fichiers sans erreur ; build réussi avec avertissement historique de poids du bundle héros.

Limites : qualité du raccord à valider artistiquement ; Safari/iPhone matériel non testé ; le média original reste 12,9 Mo et mérite une déclinaison allégée avant publication. Héritage 2 demeure un brouillon disponible en dev, absent du build public standard. V2 non poussée.
