# 00 — Inventaire

## État courant (2026-09-08)

Le site livré dans ce dossier est la source technique active. La sélection actuelle comprend
Down Trigger, Héritage 2, Maison Sillon et Vantel. Les trois derniers sont des concepts fictifs
créés pour le portfolio ; l’autorisation d’utilisation de Down Trigger est confirmée par Nicolas.
Les observations historiques ci-dessous restent conservées comme trace d’audit initiale.

## 1. Environnement de développement

| Élément      | Valeur                                                                | Preuve                     |
| ------------ | --------------------------------------------------------------------- | -------------------------- |
| OS           | Windows (win32)                                                       | env                        |
| Shell        | PowerShell 5.1                                                        | env                        |
| Node.js      | v24.16.0                                                              | `node -v`                  |
| npm          | 11.13.0                                                               | `npm -v`                   |
| pnpm         | 11.16.0                                                               | `pnpm -v`                  |
| Git          | 2.54.0.windows.1                                                      | `git --version`            |
| GitHub CLI   | 2.96.0 — authentifié (waou93-bot), scopes gist/read:org/repo/workflow | `gh auth status`           |
| Vercel CLI   | 56.2.0                                                                | `vercel --version`         |
| Playwright   | 1.62.1 (via npx)                                                      | `npx playwright --version` |
| Wrangler     | absent                                                                | —                          |
| Registry npm | https://registry.npmjs.org/                                           | `npm config get registry`  |

## 2. Dépôt

- Dossier de travail : `C:\Users\Nicolas JEZ\Documents\NJ\PORTFOLIO 1` — **vide** au départ (0 fichier).
- Dépôt Git : **inexistant** → initialisé en local, branche `develop`, aucun remote, aucun push.
- Aucun fichier utilisateur présent → aucun risque d'écrasement.

## 3. Outils et connecteurs disponibles

- MCP : context7 (docs), open-design (workspace design), pollinations (images/vidéo/IA).
- Skills locales : nombreuses (design, ui-ux, seo, security, etc.).
- Navigateur automatisé : Playwright.
- GitHub : gh CLI authentifié (utile pour l'audit de dépôts, pas pour le push sans accord).

## 4. Projets connus — audit de sources (lecture seule)

### 4.1 Down Trigger

- **URL** : https://downtrigger.fr/ (live, consulté).
- **Observations** : metal industriel français ; univers post-apocalyptique « signal / anomalie / MONDE_02 » ; hex codes (`0x44...`), narration « FORM_UNSTABLE », sections immersion, album "Then The Chaos" (2019), clip "Astrayed", date de concert 28 oct. 2026 (Paris, Les Étoiles), presse (French Metal, Among The Living).
- **Attribution** : autorisation d’utilisation confirmée par Nicolas le 2026-09-08 ; les crédits détaillés restent à compléter si disponibles.
- **Statut projet** : collaboration publiée, sous réserve de la QA des médias.

### 4.2 Méridien 1970 Paris

- **URL** : introuvable. Slug interne : `meridien-1970-paris`.
- **Recherche effectuée** : pas de site public correspondant. Les résultats « Le Méridien » concernent la chaîne hôtelière Marriott (sans rapport).
- **Hypothèse** : concept indépendant (univers parisien années 1970, esthétique mid-century / direction artistique). À confirmer par le propriétaire.
- **Statut provisoire** : concept / personal, URL = TODO_CONTENT.

### 4.3 Beauchamp 95250

- **URL** : introuvable. Site officiel de la ville (https://www.ville-beauchamp.fr/) réalisé par **Créasit** — n'est pas le projet.
- **Hypothèse** : concept territorial immersif (ville, gare, voie ferrée, quartiers). Aucune preuve de commande institutionnelle → **ne pas attribuer à une institution**.
- **Statut provisoire** : concept, URL = TODO_CONTENT.

## 5. Assets connus

- Aucun fichier média local fourni pour le moment.
- Les captures/previews seront produites en Phase 6 à partir des sources autorisées uniquement.

## 6. Droits — état courant

- L’autorisation d’utilisation de Down Trigger est confirmée par Nicolas.
- Les autres projets de la sélection sont des concepts fictifs créés pour le portfolio et utilisent un disclaimer.

## 7. Inconnues critiques

1. Crédits détaillés des médias Down Trigger, si disponibles.
2. Nature (concept vs client) et URLs de Méridien 1970 Paris et Beauchamp 95250.
3. Identité du propriétaire à diffuser (email, réseau, photo, biographie).
4. Activation du domaine canonique `https://www.wadek.fr` chez OVH puis rattachement à Vercel.
5. Présence d'autres projets non communiqués.
