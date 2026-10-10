# Fluidité de la landing — correction locale du 10 octobre 2026

Demande : la version avec un lecteur unique reste saccadée sur le poste utilisateur.

## Constats vérifiés

- Version précédente : 1920 × 1080, 30 fps, 12 714 237 octets. FFmpeg freezedetect à 120 ms / -50 dB ne détecte aucune pause dans le montage.
- DOM local : un lecteur et quatre calques de portrait, avec plusieurs ombres floutées, filtres et mélange RGB. Les deux portraits principaux déclarent `will-change: transform, opacity, filter` en permanence.
- Le contrôle direct du navigateur ne donne pas ces compteurs. Une page de diagnostic locale instrumentée dans le projet permet ensuite de lire `getVideoPlaybackQuality()` et de comparer les versions. Aucun gain CPU n'est revendiqué.

## Correction

- Export hors ligne à 60 fps avec interpolation de mouvement FFmpeg, 1280 × 720 ; la cadence n'est pas obtenue par simple duplication des images. H.264 yuv420p et faststart.
- Variante mobile 960 × 540 sélectionnée par un élément source jusqu'à 600 px. Un seul lecteur reste actif.
- Préchargement pendant le loader pour éviter de commencer le transfert seulement à son effacement.
- Portraits et accents RGB précomposés hors ligne en deux images alpha, chacune disponible en 384/768/1024 px : suppression des deux images chromatiques supplémentaires et des filtres/ombres de composition pendant la lecture. Originaux conservés, reflets bilatéraux et accents RGB maintenus. Script : `scripts/bake-hero-portraits.cjs`.
- Au démontage, les URL des éléments source sont retirées avant `load()` pour ne pas relancer le téléchargement.
- Originaux, premier montage et sauvegardes de code conservés. Aucun achat, génération distante, push ou déploiement dans cette correction.

L'interpolation peut produire de petites déformations sur les mouvements rapides. Une vidéo 60 fps ne garantit pas un affichage 60 fps sur tout appareil ; retour visuel utilisateur requis pour valider son confort sur son écran.

## Contrôles techniques terminés
- Astro : 91 fichiers, 0 erreur, 0 avertissement, 0 hint ; compilation des 19 pages réussie.
- Vitest : 3 tests du cycle de vie du lecteur réussis, dont retrait des sources au démontage.
- Décodage complet des deux fichiers sans erreur ; durée 18.916667 s, cadence 60/1.
- Export 720p : 7 888 027 octets ; 540p : 3 840 363 octets. Version précédente : 12 714 237 octets.
- La variante légère est sélectionnée jusqu'à 896 px, en cohérence avec la mise en page étroite.
- Les halos du CTA restent en dégradé RGB, avec suppression du flou et de l'animation permanente. L'esquive du bouton, le loader et le personnage stop motion sont conservés.

## Mesure directe finale — 11 octobre 2026
La page instrumentée locale compare les versions dans un seul onglet de lecture, sans encodage en arrière-plan. Fenêtre de six secondes, viewport courant étroit du navigateur intégré, même poste.
- Avant : 172 images comptées, 100 perdues ; intervalle médian de rendu 66.6 ms, progression vidéo 5.54 s sur 6.02 s.
- Après : 361 images comptées, 5 perdues ; intervalle médian de rendu 16.7 ms (environ 60 Hz), progression vidéo 6.00 s sur 6.00 s. Source mobile 960 × 540 sélectionnée.
- Preuve : `SEO/AUDITS/landing-fluidity-native-2026-10-11.json`. Ce résultat est un contrôle local, pas une garantie universelle ou un Core Web Vital terrain.
Les premières mesures en iframe, ainsi que celles prises avec plusieurs lecteurs ou pendant l'encodage, ont été écartées de cette comparaison finale.

## Recette responsive finale
- Desktop 1280 × 720, source 720p60 : 363 images comptées, 6 perdues en 6.001 s ; rendu médian 16.7 ms, P95 16.9 ms, progression vidéo 6.00 s.
- Mobile 375 × 812, source 540p60 : 361 images comptées, 4 perdues en 6.001 s ; rendu médian 16.7 ms, P95 16.9 ms. Deux portraits, aucun calque chromatique additionnel, aucun débordement horizontal.
- Captures desktop/mobile et compteurs : `landing-fluidity-responsive-2026-10-11.json` et captures du même préfixe dans ce dossier.
- Script de diagnostic retiré de la landing compilée après contrôle ; exemplaire conservé uniquement en sauvegarde locale. Aperçu normal conservé sur http://127.0.0.1:4330/.
