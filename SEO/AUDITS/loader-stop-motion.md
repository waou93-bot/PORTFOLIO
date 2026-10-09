# Chargement en stop motion — D078, 9 octobre 2026

Correction explicitement demandée : conserver le visage décliné dans l'écran de chargement et stabiliser son emplacement. Les trente images originales `sequence-expression-v1` sont préservées. Les dérivés WebP 640 pixels totalisent 831 618 octets, générés par `site/scripts/prepare-loader-faces.mjs`.

L'alignement est appliqué dans l'interface, sans redessiner le visage : trente repères manuels au milieu des yeux, translation vers un repère commun x50%/y36%, zoom léger 1,06. Les expressions, lunettes et vêtements continuent naturellement de varier. Ce réglage de présentation n'est pas une registration biométrique ni une garantie pixel par pixel.

Lecture : 30 poses à 80 ms, soit environ 2,4 secondes après décodage des images nécessaires. Une image non décodée n'est pas affichée ; le chargement peut durer davantage sur réseau lent. Le bouton Passer reste disponible ; délai de secours 6,5 secondes. La préférence de réduction de mouvement conserve un portrait fixe et ne charge pas toute la séquence. La progression reflète le décodage, puis atteint 100% à la fin.

Recette locale : build réussi, Astro check 90 fichiers sans erreur ni avertissement, ESLint réussi. Navigateur : déclinaisons observées dans le loader, cadre fixe, puis arrivée sur la landing miroir. Capture `loader-faces-local.png`. La mesure 84/100 antérieure concerne le loader réduit au logo ; elle ne vaut pas mesure de cette correction.

Publication vérifiée : commit 171ca1a, déploiement Vercel dpl_DkdsCbdCUKP4qLggq8Re82m5hSBg READY, alias www.wadek.fr sans erreur. Navigateur public : portraits défilants observés, frame finale 30 confirmée, loader masqué puis landing miroir accessible. Capture loader-faces-production.png. Mobile 390 pixels et bouton Passer vérifiés localement.

