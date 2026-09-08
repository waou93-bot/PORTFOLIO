# 00 — Assumptions (hypothèses de travail)

Chaque hypothèse est marquée comme acceptable à tester ou bloquante si invalidée.

| #   | Hypothèse                                                                                                                       | Confiance | Impact si fausse                                            | Statut                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------- | ----------------------- |
| A1  | Nicolas Jez conçoit et développe des sites/landing pages en France, marché francophone initial                                  | élevée    | nul                                                         | acceptée                |
| A2  | Nicolas est membre de Down Trigger et les membres du groupe ont validé l’utilisation du site et des contenus dans son portfolio | élevée    | compléter les crédits disponibles                           | acceptée le 2026-09-08  |
| A3  | Méridien 1970 Paris et Beauchamp 95250 sont des concepts indépendants non commandés                                             | moyenne   | requalification + mention/retrait                           | à confirmer             |
| A4  | Architecture majoritairement statique + contenu typé + hydratation minimale répond au besoin                                    | élevée    | réévaluation du prototype                                   | à tester en Phase 4     |
| A5  | Pas de CMS headless nécessaire au lancement (l'ajout de projets se fait par fichiers typés)                                     | élevée    | coût de migration                                           | acceptée (P2 si besoin) |
| A6  | Aucune donnée personnelle de tiers n'est requise au-delà des champs du formulaire de contact                                    | élevée    | revue privacy                                               | acceptée                |
| A7  | Le domaine canonique souhaité est `https://www.wadek.fr`, commandé chez OVH ; activation encore en cours                        | élevée    | vérification DNS et domaine Vercel à faire après activation | acceptée le 2026-09-08  |
| A8  | Aucune dépense payante n'est engagée sans accord (analytics, fonts, stock, etc.)                                                | élevée    | —                                                           | acceptée                |

## Décisions prises (réversibles)

- D1 : nom de travail centralisé dans `src/config/site.ts` → renommable sans toucher aux composants.
- D2 : dépôt Git local initialisé (branche `develop`), aucun remote, aucun push.
- D3 : langue initiale FR avec architecture d'internationalisation prête.
- D4 : tout projet sans droits confirmés démarre en `draft` et est exclu du sitemap ; les concepts fictifs du portfolio utilisent `not-required` avec un disclaimer.
- D5 : Vercel est l’hébergement applicatif prévu ; aucune action DNS/OVH/Vercel n’est exécutée sans accès et validation explicites.
