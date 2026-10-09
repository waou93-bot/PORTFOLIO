# Recette de la landing restaurée — 9 octobre 2026

**VERSION FINALE DU LOT : `44949bf`.** Production Vercel READY `dpl_7X1L2MW9BBosbS9iCMruHXMQ16LB`, alias www sans aliasError confirmé par root. Navigation native, animation footer chargée au premier scroll/interactions avec replay, portraits srcset384/768/1024 et salon840/1680. Vidéo miroir, portraits, bouton fuyant et personnage stop-motion conservés. Les mesures ci-dessous viennent uniquement de `restored-optimized-production-mobile.json` ; les versions statique, a85e3d8 et5d8451d restent historiques/intermédiaires.

Version cible : commit poussé `44949bf`, décision D-077. Landing originale vidéo/portrait miroir et personnage stop-motion conservés ; cinq sites en ligne et compléments éditoriaux/SEO maintenus. Le score100 de l'accueil statique est un snapshot rejeté et **n'est pas le score de cette version**.

État final : production contrôlée via `post-deploy-optimized.json` à2026-10-09T13:21:12.857Z et Lighthouse `restored-optimized-production-mobile.json` à2026-10-09T13:22:28.387Z. Rapport JSON complet malgré exit1 CLI pour nettoyage Windows EPERM ; succès global du processus non revendiqué. Un changement de build invalide ces mesures comme état actuel.

## Périmètre et preuves

Root a réellement communiqué : build 19 pages, Astro check 88 fichiers 0 erreur/avertissement, Vitest 29 tests réussis, ESLint réussi, contrôles liens 0 erreur/avertissement. CUA desktop largeur1265 et mobile390 : portrait vidéo miroir présents ; CTA atteint univers-v2 ; cinq repères ; carte Mode RGB ouverte ; personnage tombe puis atteint sa pose finale orientée vers l'email. Ces observations sont attribuées au root, pas présentées comme nouvelles exécutions de l'agent documentaire.

Audit_docs a relu les sources restaurées BaseLayout, univers-v2, configuration sitemap, confidentialité et stratégies de médias. Les revues source/dist statiques antérieures ne valident pas automatiquement l'accueil restauré. La correction de légende Down Trigger a été recontrôlée localement après rebuild, sans légende photo trompeuse ni dateCreated de capture.

CUA **production44949bf** exécutée par root : deux portraits/vidéo miroir chargés ; scroll fait entrer le personnage ; clic déclenche sa chute ; pose finale orientée vers l'email observée ; CTA effectue la navigation native vers `/univers-v2/` et affiche les cinq repères. Captures : `landing-optimized-production.png`, `stop-motion-optimized-production.png`, `atelier-optimized-production.png`. Build19pages, check88fichiers0/0, ESLint réussi ; 29tests unitaires précédemment passés sur API conservée. Le JSON Lighthouse final a runtimeError absent et runWarnings vide ; exit1 vient du nettoyageEPERM, pas d'un échec de mesure.

## Site Checklist — 20 lignes

Périmètre actuel des CONFORME : recette locale et code précisés dans preuve. Les contrôles de production restants sont identifiés séparément ; aucune conformité globale ou juridique revendiquée.

| ID | Point | Statut | Preuve / périmètre | Action / priorité |
|---|---|---|---|---|
| SC01 | Vraie 404 utile | CONFORME | HTTP restauré notFound.status404, useful=true, noindex=true | Périmètre URL inconnue testé par root |
| SC02 | Titles pertinents | CONFORME | 12 pages publiques HTTP200, titles non vides spécifiques dans JSON | Utilitaires noindex hors sélection indexable |
| SC03 | Descriptions pertinentes | CONFORME | 12 pages publiques avec descriptions spécifiques et fidèles | Aucune garantie extrait moteur |
| SC04 | CTA compréhensible accessible avant défilement | NON VÉRIFIÉ | CTA ouvre univers-v2 dans recette root, mais bouton se déplace volontairement ; position avant défilement mobile non prouvée strictement | Fonctionnement observé distinct du critère above-fold ; interaction conservée par D077 |
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
| SC20 | Images/médias optimisés | À CORRIGER | Portraits/salon srcset corrigés, transfert global1,745Mo ; delivery197KiB estimés et responsive79KiB restent signalés | P2 résiduel : logo-clair.png1199×1312 servi47×51 (~174Ko évitables) et portrait384 rendu222 ; conserver récit/qualité |

Comptes finaux du périmètre contrôlé : **7 CONFORME, 2 À CORRIGER, 7 NON VÉRIFIÉ, 4 NON APPLICABLE =20**. Ce compte exprime la couverture, pas une note de qualité. SC20 est corrigé sur portraits/salon et garde une amélioration résiduelle mesurée ; SC16 reste administratif.

## Performance et publication

| Laboratoire mobile public | Baseline initiale | Landing restaurée |
|---|---:|---:|
| Performance | 52 | 84 |
| Accessibilité automatique | 95 | 100 |
| Bonnes pratiques | 100 | 100 |
| SEO automatique | 92 | 100 |
| LCP | 29,887409s | 3,664229s |
| FCP | 2,728409s | 1,329229s |
| TBT | 394ms | 261ms |
| CLS | 0,00443625 | 0,00245775 |
| Octets transférés | 16 697 877 | 1 744 837 |

Poids transféré réduit d'environ89,6%, LCP d'environ87,7%, TBT d'environ33,8% dans ces deux runs publics. Score performance52→84 ; `aria-prohibited-attr` et `label-content-name-mismatch` passent désormais score1. La réduction CPU après contrôleur léger/navigation native/footer différé est cohérente avec le run, sans attribuer une causalité précise à une seule intervention. LCP3,66s reste au-dessus de la cible laboratoire interne2,5s ; un84 n'est pas un100 et les médias peuvent encore être améliorés sans supprimer leur direction artistique.

Baseline fetchTime2026-10-09T11:50:27.35Z, finale fetchTime2026-10-09T13:22:28.387Z. Aucun100 statique réutilisé. Ces résultats restent laboratoire ; INP/CrUX terrain, trafic, classement et conversion inconnus. Les économies estimées Lighthouse ne s'additionnent pas automatiquement. L'accessibilité automatique100 ne constitue pas une certification d'accessibilité.

HTTP :12 pages indexables200 et atelier200 avec5 projets ; six anciennes routes308 vers/work/ ; HTTP www→HTTPS308 ; 404 réelle utile. Les données JSON-LD des pages publiques sont présentes dans l'export, syntaxe déjà inspectée localement ; pas certification fournisseur. Les utilitaires juridiques et preview ne sont pas déclarés conformes par cette vérification des seules pages prioritaires.

Apex wadek.fr : ECONNRESET rencontré par root, NON VÉRIFIÉ ; ne pas conclure domaine cassé ou redirection correcte. Canonique de référence www.wadek.fr. GSC/Bing/GA4 : sans accès confirmé, aucune soumission/propriété/lien inventé. Pas de message email testé. Adresse légale attendue. SEO STUDIO2 reste PROVISOIRE pour formation /personna partielle ; statut distinct du build/push/déploiement.
