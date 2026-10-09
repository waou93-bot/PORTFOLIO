# Roadmap exécutable

D-077 remplace W02 : restaurer landing originale vidéo/portrait miroir et personnage stop-motion, optimiser médias/chargement en conservant le récit. W07 doit porter sur le nouveau build et nouvelles mesures ; l'acceptance « aucun clip initial » est rejetée. Les autres tickets nouveaux sites/SEO restent actifs. Aucun transfert du score de la version statique à la version restaurée.

| Ticket | Propriétaire | Dépendance | Sortie et acceptance | Taille |
|---|---|---|---|---|
| W01 preuve sites/remplacement | editorial_research + root | domaines utilisateur | URLs live vérifiées, attribution prudente, sélection cinq cas | M |
| W02 accueil statique/médias | root | baseline | aucun clip initial, portrait responsive, parcours direct clavier/mobile | M |
| W03 cas et maillage | root | W01 | toutes routes HTML, aucun cas orphelin, domaines exacts | M |
| W04 méthode/article | editorial_research + root | sources | article original, limites, auteur réel, aucun résultat fictif | M |
| W05 robots/sitemap/redirects | root | routes | HTTP 200/301/404 exacts, sitemap canonique sans archives | S |
| W06 contact/légal | root | données confirmées | mailto fonctionnel ou backend testé ; inconnues identité signalées | S |
| W07 recette/audit | root + audit_docs | W01..06 | build/check, HTTP, navigateur, Lighthouse comparable et défauts séparés | M |
| W08 push/publication | root | recette | commit distant et déploiement de ce commit vérifiés | S |
| W09 SEO post-deploy | root | W08 | production vérifiée ; soumissions/access manquants tracés | S |

Budget et capacité humaine inconnus ; tailles relatives, aucune date contractuelle inventée. Critique documentaire examine faits et couverture ; root intègre corrections. Rollback : commit/deploy précédent ; archives locales préservées. Après premières données suffisantes : CONTINUER si parcours clair et observations utiles, CORRIGER si défaut avéré, ARRETER sujets sans preuve/capacité, NON_CONCLUANT si données faibles. Contrôles J+3/J+7/J+30 proposés, aucune automation créée.
