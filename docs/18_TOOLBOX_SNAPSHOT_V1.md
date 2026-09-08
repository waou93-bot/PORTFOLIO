# 18 — Toolbox snapshot v1

- **Projet :** Portfolio immersif Nicolas Jez
- **Version :** 1.0
- **Statut :** validé pour la tranche verticale
- **Date :** 2026-09-04
- **Responsable de validation :** Nicolas Jez

## Contrat de conversion

- **Visiteur principal :** studios, agences et recruteurs.
- **Conversion principale :** proposition de collaboration.
- **CTA exact :** `Proposer une collaboration`.
- **Étape après le clic :** courriel ; formulaire différé.
- **Preuve nécessaire :** quatre études de cas au statut honnête.

## Synthèse des rôles

| Rôle | Skills mobilisés | Livrable | Statut | Décision ou incertitude |
|---|---|---|---|---|
| Pilotage | brain, newpro, newsite | MASTER repris et décisions consolidées | réalisé séquentiellement | les quatre projets sont classés ; crédits Down Trigger et QA restent à finaliser |
| Stratégie | product-marketing, no-slop | contrat de conversion | réalisé séquentiellement | pas de promesse de délai |
| UX | cro, newsite | parcours portrait → preuve → contact | réalisé séquentiellement | accès direct obligatoire |
| Direction UI | design-taste-frontend, asset-continuity | Design Read et canon média | réalisé séquentiellement | portrait 02 retenu comme candidat hero |
| Réalisation/recette | Astro, webapp-testing, web-design-guidelines | tranche verticale | en correction et recette | versions figées dans `site/package.json` |

## Architecture

- **Stack :** Astro + TypeScript + CSS natif.
- **Îlot immersif :** Three.js direct, limité à la séquence d’ouverture si la 2,5D DOM ne suffit pas.
- **Mouvement :** CSS/WAAPI d’abord ; GSAP ScrollTrigger admis uniquement pour synchroniser le push-in et les six beats.
- **Rendu :** statique, pages indexables, contenu versionné.
- **Dépendances refusées :** Next.js, React Three Fiber, UI kit, moteur 3D global, scroll hijacking.

## Typographie — passe d’essai v2

- **Direction en test :** Newsreader Variable pour les titres et Manrope Variable pour le texte, les labels et les commandes.
- **Source vérifiée :** catalogue officiel Google Fonts et métadonnées du dépôt `google/fonts`.
- **Licence :** SIL Open Font License ; fichiers WOFF2 officiels auto-hébergés et licences conservées dans `site/public/fonts/`.
- **Axes et usages :** Newsreader `opsz` et `wght` pour les titres ; Manrope `wght` pour le texte courant et les commandes.
- **Budget :** deux familles variables, trois fichiers latins servis localement, sans requête vers un service typographique tiers.
- **Alternative crédible :** Source Serif 4 + IBM Plex Sans, plus rationnelle et proche du premier système Héritage.
- **Options écartées pour cette passe :** Instrument Serif + Archivo, dont le contraste actuel manque de singularité dans le héros ; Cormorant Garamond, trop cérémonielle pour les interfaces et projets numériques.
- **Statut :** prototype à faire valider visuellement par Nicolas dans la page réelle.

## Médias et continuité

- Portraits : sources locales extraites, droits personnels présumés mais origine de génération à conserver.
- Storyboard : canon narratif, non utilisé comme fausse capture du site final.
- Projets : uniquement médias issus des dossiers audités, avec mention `concept` lorsque nécessaire.
- Vantel : étude de cas factuelle publiée comme concept fictif ; médias et droits déclarés utilisables par Nicolas.

## Gate anti-template

- Message et parcours propres au portrait de Nicolas : PASS.
- Hero centré générique, grille de cartes identiques, glassmorphism décoratif : refusés.
- Une seule famille de thème : charbon, cuivre et bleu électrique.
- Animation motivée : passage réel → esprit ; fallback statique obligatoire.
- Preuves fictionnalisées : interdites.
