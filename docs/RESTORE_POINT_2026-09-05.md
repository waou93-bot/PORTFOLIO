# Point de restauration — avant nouvelle exploration des projets

Mandat : conserver l'état actuel complet avant toute nouvelle idée, créer un point Git local et le pousser vers le dépôt distant désigné par Nicolas.

État conservé : héros et stop-motion, glitch d'entrée renforcé, montagnes, palettes projets avec survol, loupe limitée aux textes du héros, personnage stop-motion du footer, portrait Contact, email confirmé et services IA/SaaS/outils internes. Sources, assets locaux (y compris versions historiques), documentation et captures conservés.

Derniers contrôles : build statique réussi ; derniers tests ciblés de footer desktop/mobile/mouvement réduit réussis ; loupe exclue des boutons/footer vérifiée. Pas de déploiement public demandé. Le choix d'une nouvelle présentation des projets est suspendu.

## Périmètre de sauvegarde

Git conserve les fichiers du projet et médias présents dans ce MASTER. Exclusions : dépendances réinstallables, caches, runtimes locaux, sorties de compilation et secrets. Les archives Git autonomes vont dans `.restore-points/`, hors index pour éviter une récursion. Les références vers des fichiers situés hors de ce MASTER ne constituent pas des copies de ces fichiers.

Le dépôt local n'existait pas au début de cette demande. Le dépôt distant doit être précisé avant tout envoi ; aucun dépôt public n'est créé implicitement.

## Reprise sans écraser le travail courant

Une fois l'archive Git créée, la cloner dans un nouveau dossier puis sélectionner le tag de restauration. Installer les dépendances à partir de `site/pnpm-lock.yaml`, puis lancer les scripts du package dans `site`. Ne pas utiliser de reset destructif pour revoir cet état.
