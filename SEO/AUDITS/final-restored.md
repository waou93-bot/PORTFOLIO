# Recette de la landing restaurée — 9 octobre 2026

**RAPPORT INTERMÉDIAIRE EN ATTENTE DU RUN FINAL.** Root optimise encore le contrôleur initial et les deux défauts ARIA. Les chiffres a85e3d8 ci-dessous restent un snapshot intermédiaire de restauration ; ne pas les publier comme résultats finaux. Nouvelle preuve attendue : `restored-final-production-mobile.json`, avec commit/déploiement correspondants et recette de conservation vidéo miroir, portraits, bouton fuyant et atlas de chute.

Version cible : commit poussé `a85e3d8`, décision D-077. Landing originale vidéo/portrait miroir et personnage stop-motion conservés ; cinq sites en ligne et compléments éditoriaux/SEO maintenus. Le score 100 de l'accueil statique est un snapshot rejeté et **n'est pas le score de cette version**.

État actualisé : production publique restaurée contrôlée via `post-deploy-restored.json` à 2026-10-09T12:53:51.371Z ; Lighthouse `restored-production-mobile.json` à 2026-10-09T12:54:14.779Z. Ces snapshots appartiennent au commit restauré a85e3d8 annoncé par root ; un nouveau build invalide leur statut de mesure actuelle.

## Périmètre et preuves

Root a réellement communiqué : build 19 pages, Astro check 88 fichiers 0 erreur/avertissement, Vitest 29 tests réussis, ESLint réussi, contrôles liens 0 erreur/avertissement. CUA desktop largeur1265 et mobile390 : portrait vidéo miroir présents ; CTA atteint univers-v2 ; cinq repères ; carte Mode RGB ouverte ; personnage tombe puis atteint sa pose finale orientée vers l'email. Ces observations sont attribuées au root, pas présentées comme nouvelles exécutions de l'agent documentaire.

Audit_docs a relu les sources restaurées BaseLayout, univers-v2, configuration sitemap, confidentialité et stratégies de médias. Les revues source/dist statiques antérieures ne valident pas automatiquement l'accueil restauré. La correction de légende Down Trigger a été recontrôlée localement après rebuild, sans légende photo trompeuse ni dateCreated de capture.

## Site Checklist — 20 lignes

Périmètre actuel des CONFORME : recette locale et code précisés dans preuve. Les contrôles de production restants sont identifiés séparément ; aucune conformité globale ou juridique revendiquée.

| ID | Point | Statut | Preuve / périmètre | Action / priorité |
|---|---|---|---|---|
| SC01 | Vraie 404 utile | CONFORME | HTTP restauré notFound.status404, useful=true, noindex=true | Périmètre URL inconnue testé par root |
| SC02 | Titles pertinents | CONFORME | 12 pages publiques HTTP200, titles non vides spécifiques dans JSON | Utilitaires noindex hors sélection indexable |
| SC03 | Descriptions pertinentes | CONFORME | 12 pages publiques avec descriptions spécifiques et fidèles | Aucune garantie extrait moteur |
| SC04 | CTA compréhensible accessible | CONFORME | Root CUA desktop1265/mobile390 : CTA ouvre univers-v2 ; carte Mode RGB ouverte | Vérifier après publication ; pas mesure conversion |
| SC05 | Favicon | NON VÉRIFIÉ | SVG HTTP200 image/svg+xml confirmé ; affichage onglet non observé | Présence technique vérifiée, rendu onglet à confirmer, P2 |
| SC06 | robots.txt | CONFORME | HTTP200 text/plain, Allow /, sitemap-index www correct | Aucune indexation déduite |
| SC07 | Sitemap | CONFORME | Index et enfant HTTP200,12 URL concordant pages200 du bon domaine | Univers et concepts exclus volontairement |
| SC08 | Image Open Graph | NON VÉRIFIÉ | URL absolue prévue, source portrait/cas | Vérifier réponse image et aperçu réel, P2 |
| SC09 | Alt des images | NON VÉRIFIÉ | Hero portrait alt et décorations distinguées ; pas examen exhaustif restauré | Vérifier images fonctionnelles/cards/SVG, P1 |
| SC10 | Responsive | CONFORME | Root CUA desktop1265/mobile390 : vidéos/portrait/univers/repères/carte utilisables | Couverture limitée ; 320/768 et appareils réels non testés |
| SC11 | CTA fixe mobile | NON APPLICABLE | Portfolio de découverte : CTA univers et contact accessibles, pas vente ni tunnel nécessitant fixe | Ne pas ajouter un recouvrement sans besoin |
| SC12 | Chargements asynchrones | NON VÉRIFIÉ | Chargement vidéo/transition restaurés ; parcours CUA réussi | Réseau lent et échec média non simulés, P2 |
| SC13 | Erreurs formulaire | NON APPLICABLE | Page contact compose par mailto, aucun formulaire transmis | Ne pas créer backend artificiel |
| SC14 | Remerciement après succès | NON APPLICABLE | Pas envoi ni accusé serveur ; ouverture messagerie expliquée | Aucun message envoyé/reçu prétendu |
| SC15 | Confidentialité | NON VÉRIFIÉ | Source décrit mailto, absence traceurs et logs Vercel | Accessibilité live et validation juridique non certifiées, P1 |
| SC16 | Conditions/mentions | À CORRIGER | Hébergeur renseigné ; adresse/identité administrative opérateur incomplète | Données demandées au propriétaire ; ne pas inventer, P1 |
| SC17 | Consentement cookies | NON VÉRIFIÉ | Analytics off et déclaration sans traceurs ; réseau live final non inspecté | Vérifier cookies/tiers ; bandeau non nécessaire par seul mot « site », P2 |
| SC18 | Analytics | NON APPLICABLE | Absence volontaire, zéro nouveau traceur | GSC/Bing/GA4 non accessibles ; pas collecte confirmée |
| SC19 | Contact réel | CONFORME | Adresse existante confirmée, mailto source ; root CUA pose finale vers email | Ouverture lien cohérente, réception email non vérifiée |
| SC20 | Images/médias optimisés | À CORRIGER | Lighthouse responsive-images score0 :435KiB estimés ; delivery380KiB ; portrait156741octets, footer200046 | Réduire dimensions servies/variantes, préserver qualité et récit, P1 |

Comptes actuels : **8 CONFORME, 2 À CORRIGER, 6 NON VÉRIFIÉ, 4 NON APPLICABLE =20**. Ce compte exprime la couverture, pas une note de qualité.

## Performance et publication

| Laboratoire mobile public | Baseline initiale | Landing restaurée |
|---|---:|---:|
| Performance | 52 | 50 |
| Accessibilité automatique | 95 | 95 |
| Bonnes pratiques | 100 | 100 |
| SEO automatique | 92 | 100 |
| LCP | 29,887409s | 4,545844s |
| FCP | 2,728409s | 1,470844s |
| TBT | 394ms | 2207ms |
| CLS | 0,00443625 | 0,00206888 |
| Octets transférés | 16 697 877 | 2 531 992 |

Poids transféré et LCP réduits d'environ85%, mais **score performance non amélioré** :50 contre52. TBT monte à2207ms ; le diagnostic indique travail du thread principal8s et exécution scripts4,1s. Cela exige un triage CPU/interaction séparé du gain réseau ; une cause spécifique n'est pas affirmée sans profil. A11y95 conserve `aria-prohibited-attr` et `label-content-name-mismatch`, à corriger sur éléments exacts. LCP4,55s reste élevée. Vidéo optimisée clip02 transfère805038octets, clip01 deux requêtes partielles315543 et315530 ; ces lignes ne prouvent pas des fichiers dupliqués.

Baseline fetchTime2026-10-09T11:50:27.35Z, nouvelle fetchTime2026-10-09T12:54:14.779Z. Aucun100 statique réutilisé. Ces résultats restent laboratoire ; INP/CrUX terrain, trafic, classement et conversion inconnus. Les économies estimées Lighthouse ne s'additionnent pas automatiquement.

HTTP :12 pages indexables200 et atelier200 avec5 projets ; six anciennes routes308 vers/work/ ; HTTP www→HTTPS308 ; 404 réelle utile. Les données JSON-LD des pages publiques sont présentes dans l'export, syntaxe déjà inspectée localement ; pas certification fournisseur. Les utilitaires juridiques et preview ne sont pas déclarés conformes par cette vérification des seules pages prioritaires.

Apex wadek.fr : ECONNRESET rencontré par root, NON VÉRIFIÉ ; ne pas conclure domaine cassé ou redirection correcte. Canonique de référence www.wadek.fr. GSC/Bing/GA4 : sans accès confirmé, aucune soumission/propriété/lien inventé. Pas de message email testé. Adresse légale attendue. SEO STUDIO2 reste PROVISOIRE pour formation /personna partielle ; statut distinct du build/push/déploiement.
