# Recette locale — 9 octobre 2026

Version : refonte éditoriale, sources du dépôt PORTFOLIO. Publication explicitement demandée par Nicolas dans cette session (D-076). La baseline reste dans `baseline-mobile.json`.

## Contrôles exécutés

- Build Astro production réussi, 19 HTML dont 12 pages publiques dans le sitemap.
- Astro check : 86 fichiers, zéro erreur, avertissement ou hint.
- Vitest : 4 suites, 29 tests réussis. Le test SEO vérifie que la date de capture n’est pas utilisée comme date de création et que les URL de cas ont le slash canonique.
- ESLint réussi ; validate contenu et liens internes : zéro erreur, zéro avertissement.
- Revue indépendante `/root/audit_docs` : titres/descriptions uniques, canonical et sitemap cohérents, JSON-LD syntaxiquement valides, article signé/date et sélection de cinq sites.
- Correction de la légende Down Trigger recontrôlée par root dans le HTML produit : aucune photo qualifiée de capture de site.
- CUA : composition desktop, accueil à 390 × 844, cas BEE, journal/article, contact et about. Aucun débordement observé sur les vues vérifiées. Le CTA accueil atteint directement `#projets` ; mailto public cohérent, aucun message envoyé.
- Anciennes pages de concepts retirées ; redirections permanentes configurées vers la sélection, statuts HTTP de production encore à mesurer. Les ressources historiques sont conservées, y compris certains médias publics sans liens.

## Mesures locales intermédiaires

`preproduction-mobile.json` : performance 82, accessibilité 100, bonnes pratiques 100, SEO 100 ; LCP 4,102 s ; 766 801 octets.

`preproduction-final-mobile.json` : performance 88, accessibilité 100, bonnes pratiques 100, SEO 100 ; LCP 3,409 s ; 574 376 octets ; CLS 0,00145. Run avant dernier allègement des fontes. Ce test localhost n’est pas directement comparable à la baseline publique.

Les JSON Lighthouse sont complets malgré une erreur Windows de nettoyage temporaire à la fin du processus. Aucun succès global de ces commandes n’est prétendu. Les résultats sont des mesures de laboratoire, sans données terrain ni promesse de trafic.

## Gates Design DNA et éditoriale

Identité sombre et cuivre, portrait existant, Manrope/Newsreader locales conservés. Composition asymétrique, lignes de projets avec captures réelles, navigation native et texte visible sans JavaScript. Aucun autoplay, animation bloquante ou grille de cartes générique introduit. Contrôle visuel des vues ci-dessus : lisibilité et hiérarchie cohérentes ; recette exhaustive de tous appareils NON VÉRIFIÉ.

Article original relu dans son rendu : vouvoiement, auteur réel, exemple de cadrage, source Google, liens internes réels, aucune métrique commerciale inventée. Sources et cinq propositions de title conservées dans `../PREPROD/recherche-editoriale.md`.

## Inconnues maintenues

Adresse et statut administratif de l’éditeur demandés au propriétaire, réponse non reçue. Hébergeur confirmé par le projet Vercel et coordonnées vérifiées sur https://vercel.com/legal/privacy-notice. La conformité juridique n’est pas certifiée.

Le dossier SEO Studio 2 reste provisoire pour la formation personna partielle ; aucune certification stricte de handoff. Les contrôles techniques exécutés sont distincts de cette limite documentaire. Search Console/Bing, indexation effective, trafic et réception d’email non vérifiés. Aucun traceur ajouté.
