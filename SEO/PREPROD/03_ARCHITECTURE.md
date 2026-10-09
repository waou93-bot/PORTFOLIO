# Architecture et données

Routes V1 : `/` rôle et accès direct ; `/work` sélection ; `/work/down-trigger`, `/work/association-bee`, `/work/accord-raccord`, `/work/mode-rgb`, `/work/pas-du-jour` cas distincts ; `/about` profil et méthode ; `/contact` action ; `/journal` liste ; article de méthode sous `/journal/` avec slug arrêté par réalisation ; `/mentions-legales`, `/confidentialite`, 404 utilitaires.

Réalisation revue : article arrêté à `/journal/refonte-site-web/` ; `/methode/` porte une démarche distincte, liée depuis accueil/contact/article. Les 12 pages publiques produites concordent exactement au sitemap dans `AUDITS/prepublication-evidence.json`. Les concepts n'ont plus de pages produites ; leurs médias restent dans public/dist au moment de cette revue, donc archives entièrement hors production non vérifié.

Une seule intention par page : l'accueil présente la personne ; work inventorie ; chaque cas explique une réalisation ; about explique rôle/méthode ; l'article traite une question de conception sans dupliquer about. Ne pas indexer une liste de tags vide ou des brouillons.

Maillage : accueil→work/about/contact/journal ; work→cinq cas ; chaque cas→work/contact et site externe concerné ; about→work/contact ; journal→article ; article→work/about/contact ; footer→mentions/confidentialité. Aucun cas V1 ne reste orphelin. Liens HTML avec ancre compréhensible ; pas d'UTM internes.

Migration : `/work/heritage-2`, `/work/maison-sillon`, `/work/vantel`, `/univers-v2`, `/univers-galaxie-v2`, `/univers-montagnes-v2` et ancienne liste→301 `/work`. La destination est une sélection de remplacement, pas une équivalence de projet ; ne pas rediriger toutes les 404. Canonical auto-référent https://www.wadek.fr ; sitemap exclut redirections, brouillons et utilitaires noindex.

CMS conservé : fichiers Markdown + collection Astro. Chaque projet possède slug, titre, statut, description, URL live, médias et alt, preuves, droits, date et propriétaire. Brouillon→relecture→publié seulement avec preuve suffisante ; `PUBLIC_SHOW_DRAFTS` ne doit pas exposer les archives en production. Nicolas édite les contenus ; root intègre. Données de prix/offres sans objet.
