# Revue indépendante ciblée — 9 octobre 2026

**SNAPSHOT HISTORIQUE D'UNE PROPOSITION REJETÉE.** D-077 restaure la landing originale vidéo/portrait miroir et le personnage stop-motion. Les constats ci-dessous appartiennent au dist statique examiné ; ils ne valident pas le build restauré. Les résultats finaux attendent sa recette et ses nouvelles mesures.

Reviewer réel `/root/audit_docs`, distinct du root implémenteur. Environnement : sources modifiées et `site/dist` local, build production fourni par root ; aucune réponse HTTP de production encore examinée dans cette revue. Empreintes de chaque HTML : `prepublication-evidence.json`. Pas de certification stricte SEO STUDIO 2 ni /personna complet.

## Résultats réellement extraits

19 HTML produits ; 12 pages publiques et 12 URL sitemap correspondant exactement. Sur ces 12 pages : titres et descriptions non vides et uniques ; canonical et og:url du domaine `https://www.wadek.fr`, sans noindex. 11 blocs JSON-LD ont été parsés sans erreur JSON. Légalité/404/confidentialité et anciennes routes univers/liste sont noindex et exclues du sitemap. Robots produit : `User-agent: *`, `Allow: /`, sitemap-index du bon domaine. Code preview : Disallow et noindex conditionnés hors VERCEL_ENV production ; comportement preview réel non exercé par cet agent.

Article `/journal/refonte-site-web/` : titre, H1, description spécifiques, auteur Nicolas Jez visible lié à about, date 2026-10-09 concordante, JSON-LD Article avec headline et mainEntityOfPage cohérents. Aucun résultat fictif ou essai personnel revendiqué ; exemples BEE/Mode RGB/Pas du jour alignés avec sources du délégué. L'article et méthode ont des rôles différents (guide public de cadrage versus démarche de Nicolas), aucune cannibalisation démontrée. Syntaxe JSON ne prouve pas éligibilité de résultat enrichi ; test fournisseur non réalisé ici.

Cinq routes cas exactement : association-bee, accord-raccord, mode-rgb, pas-du-jour, down-trigger. Aucun nom Héritage/Vantel/Sillon dans HTML/XML. Le générateur de cas utilise seulement getPublishedProjects ; les trois anciens fichiers sont archived/featured false. Les archives textuelles ne génèrent pas de pages. Les nouveaux cas n'affichent aucune métrique de résultat inventée.

Contact : lien mailto avec adresse existante et explication « Vous choisissez quand envoyer le message ». Plus aucun faux succès backend sur la page produite. Réception email inconnue ; aucun envoi testé. Mention hébergeur complétée par root avec source Vercel vérifiée par lui ; identité administrative opérateur toujours incomplète.

Contrôles transmis par root, sans les présenter comme mes propres exécutions : astro check 0 erreur/warning ; 29 tests unitaires passent ; validate et validate:links 0 défaut ; CUA desktop/mobile390 accès direct #projets et absence overflow. Ces résultats complètent les extractions ci-dessus, sans recette navigateur exhaustive par audit_docs.

## Défauts et limites avant publication

P1 — Légende couverture Down Trigger : le gabarit affichait « Capture du site public · 2026-09-04 » pour une image dont l'alt décrit une photographie de membres dans un décor brutaliste. Une photo ne doit pas être qualifiée capture du site. Correction demandée à root : légende conditionnée à la nature du média ou suppression pour ce cas. Recontrôle de la correction requis.

Recontrôle local du dist reconstruit à 14:14:45 fourni par root : la légende « Capture du site public » est absente de la couverture Down Trigger ; aucune propriété dateCreated n'est présente ; URL CreativeWork `https://www.wadek.fr/work/down-trigger/`. Ce défaut précis est **CORRIGÉ LOCALEMENT**. La future restauration invalide la revue globale d'accueil, pas cette preuve ponctuelle sur le cas tant que son fichier ne change pas.

P1 administratif — Mentions légales indiquent toujours que l'adresse/coordonnées opérateur restent à renseigner. Question utilisateur en attente, aucune adresse inventée. Ne pas annoncer conformité juridique ; ce rapport ne remplace pas validation juridique qualifiée. Inconnue distincte des corrections techniques réussies.

P2 précision — Vercel `permanent:true` règle une redirection permanente, généralement HTTP 308 ; le dossier initial proposait 301. Consigner le statut public réellement observé plutôt que promettre 301. HTTP réel, variantes trailing slash et 404 doivent être testés par root après déploiement.

P2 périmètre — Les dossiers `dist/media/projects/heritage-2`, `maison-sillon`, `vantel` restent copiés depuis public. Ils sont sans lien dans HTML/sitemap mais encore fichiers publics. Dire « retirés des pages et de la sélection » ; ne pas annoncer archives entièrement hors production sans déplacement des médias. Aucun défaut SEO bloquant démontré par leur seule présence.

Aucun P0 supplémentaire constaté dans cette revue ciblée. La version locale est techniquement cohérente pour les points SEO contrôlés sous réserve de la légende corrigée ; aucune mesure après refonte, indexation, trafic, collecte ou disponibilité finale de production n'est anticipée.
