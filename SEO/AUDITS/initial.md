# Audit initial — 9 octobre 2026

Périmètre : accueil public https://www.wadek.fr mesuré par Lighthouse mobile ; inventaire des sources Astro initiales. Pas de recette navigateur exhaustive des routes, pas de données CrUX ou Search Console. Ce rapport conserve la baseline, il ne décrit pas la version refondue.

## Performance observée

Source : `baseline-mobile.json`, fetchTime `2026-10-09T11:50:27.35Z`. Le JSON existe malgré l'erreur EPERM de nettoyage du processus CLI : ses données sont exploitables, le succès global du processus n'est pas revendiqué.

| Mesure laboratoire | Valeur |
|---|---:|
| Performance | 52/100 |
| Accessibilité automatique | 95/100 |
| Bonnes pratiques | 100/100 |
| SEO automatique | 92/100 |
| LCP | 29,887409 s |
| FCP | 2,728409 s |
| Speed Index | 11,863934 s |
| TBT | 394 ms |
| CLS | 0,00443625 |
| Poids transféré | 16 697 877 octets |

Les requêtes répétées de `clip-01.mp4` totalisent au moins 10 368 452 octets dans les huit plus lourdes requêtes. Le portrait PNG transfère 3 312 028 octets ; deux images de pied de page 1 139 046 et 607 541 octets. Une même vidéo peut recevoir plusieurs requêtes partielles : ces lignes ne prouvent pas plusieurs fichiers distincts. Remplacer la vidéo de fond initiale par un portrait statique responsive et différer les médias secondaires est une correction P1 prioritaire. Réserver les dimensions ; ne pas charger paresseusement le portrait critique. L'audit signale aussi `aria-prohibited-attr` et `label-content-name-mismatch` : contrôle ciblé requis.

Lighthouse ne mesure pas ici l'INP réel. LCP/CLS laboratoire ne prouvent pas les Core Web Vitals terrain au 75e percentile. Aucun gain de classement, conversion ou trafic ne peut être attribué à ce run. Référence de définition consultée le 9 octobre : [Web Vitals](https://web.dev/articles/vitals).

## Site Checklist — 20 contrôles

CONFORME exige une preuve dans le périmètre testé ; la présence d'un composant n'établit pas son fonctionnement public. Les contrôles couvrant toutes les pages restent inconnus avec ce seul run.

| ID | Point | Statut | Preuve | Correction / priorité |
|---|---|---|---|---|
| SC01 | 404 utile et HTTP 404 | NON VÉRIFIÉ | `site/src/pages/404.astro` existe ; HTTP non testé | Tester URL inexistante et retour, P1 |
| SC02 | Title chaque page | NON VÉRIFIÉ | BaseLayout et pages présents ; crawl complet absent | Extraire tous HTML après build puis prod, P1 |
| SC03 | Description chaque page | NON VÉRIFIÉ | BaseLayout reçoit description ; toutes routes non testées | Vérifier singularité/fidélité, P1 |
| SC04 | CTA avant défilement | À CORRIGER | CUA root : bouton « VOIR MON UNIVERS » se déplace au premier clic ; statut « Le bouton s’est déplacé. Descendez pour le retrouver. » | Accès direct fixe aux projets, recontrôle multi viewport, P1 |
| SC05 | Favicon | NON VÉRIFIÉ | Preuve réseau/icône non extraite | Vérifier réponse et onglet, P2 |
| SC06 | robots.txt | NON VÉRIFIÉ | Lighthouse score 0, « unable to download » | Requête HTTP directe ; ne pas inférer syntaxe invalide, P1 |
| SC07 | Sitemap | NON VÉRIFIÉ | @astrojs/sitemap déclaré, sortie publique non contrôlée | XML/URLs canoniques 200, P1 |
| SC08 | Open Graph image | NON VÉRIFIÉ | Balise prévue dans BaseLayout | Image absolue accessible et aperçu, P2 |
| SC09 | Alt des images | NON VÉRIFIÉ | Aucun examen exhaustif des images informatives/décoratives | Parcours DOM et noms accessibles, P1 |
| SC10 | Responsive | NON VÉRIFIÉ | Run mobile unique ; aucun rendu 320/768/1280 | Examiner ruptures et débordements, P1 |
| SC11 | CTA mobile fixe | NON VÉRIFIÉ | Parcours mobile non exercé | Justifier sa nécessité puis vérifier masquage, P2 |
| SC12 | États de chargement | NON VÉRIFIÉ | ContactForm désactive bouton et aria-busy dans source | Simuler réseau lent sans envoi réel, P1 |
| SC13 | Erreurs formulaire | NON VÉRIFIÉ | Messages liés aux champs ; /api/contact non observée | Champs invalides et serveur simulé, P1 |
| SC14 | Confirmation | NON VÉRIFIÉ | Statut intégré prévu ; pas d'accusé observé | Ne pas présenter mail préparé comme livré, P1 |
| SC15 | Confidentialité | NON VÉRIFIÉ | Page source explique collectes/absence analytics | Confronter collecte active et page publiée ; juridique inconnue, P1 |
| SC16 | Conditions pertinentes | À CORRIGER | Mentions légales contiennent identité/adresse/hébergeur à compléter | Renseigner faits confirmés, ne pas inventer ; CGV non nécessaires sans vente, P1 |
| SC17 | Consentement cookies | NON VÉRIFIÉ | Config analytics=false et déclaration sans traceurs | Inspecter réseau/cookies public ; bandeau non requis par défaut, P2 |
| SC18 | Analytics | NON APPLICABLE | Absence volontaire `features.analytics=false` | Conserver choix sans nouveaux traceurs ; collecte absente, aucun résultat revendiqué |
| SC19 | Contact réel | NON VÉRIFIÉ | Email confirmé par Nicolas 2026-09-05 dans config, mailto source | Vérifier lien public ; réception non testée, P1 |
| SC20 | Images compressées | À CORRIGER | Portrait 3,312 Mo, footer 1,139 + 0,608 Mo ; responsive-images score 0 | Formats/variantes adaptés, poids mesurés après, P1 |

Comptes : **0 CONFORME, 3 À CORRIGER, 16 NON VÉRIFIÉ, 1 NON APPLICABLE = 20**. Ce compte exprime la couverture initiale, pas un score de qualité.

## Objections indépendantes

Aucun P0 sécurité constaté par ce périmètre ; absence de constat ne prouve pas absence de risque. P1 : médias initiaux excessifs ; mentions administratives incomplètes ; parcours contact serveur non prouvé ; découverte robots/sitemap non vérifiée. L'ancienne sélection comporte trois concepts désormais exclus explicitement par l'utilisateur : retirer sélection publique, garder provenance et rediriger vers `/work` sans fausse substitution de projet.

La revue après correction doit être un autre rapport daté avec son environnement et ses preuves. Aucun résultat futur n'est anticipé ici.
