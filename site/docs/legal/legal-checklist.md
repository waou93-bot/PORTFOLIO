# Checklist légale pré-production

> Toutes les cases doivent être vérifiées par le propriétaire avant toute mise en production.
> **Aucune information administrative n'est inventée** : les champs restent `TODO_CONTENT`
> jusqu'à saisie réelle.

## 1. Mentions légales — `src/pages/mentions-legales.astro`

- [ ] **Identité de l'éditeur** (à saisir, remplace `TODO_CONTENT`) :
  - [ ] Nom / prénom ou raison sociale
  - [ ] Adresse postale complète
  - [ ] SIREN / SIRET (si activité indépendante) — sinon « personne physique »
  - [ ] Email de contact (déjà présent via `src/config/site.ts`)
- [ ] **Directeur de la publication** : Nicolas Jez (déjà en place)
- [ ] **Hébergement** (à saisir, remplace `TODO_CONTENT`) :
  - [ ] Nom de l'hébergeur (ex. Vercel Inc.)
  - [ ] Adresse de l'hébergeur
- [ ] Supprimer la note `.legal-note` et les `.legal-todo` une fois complétés.

## 2. Confidentialité — `src/pages/confidentialite.astro`

- [ ] Vérifier que les affirmations correspondent au déploiement réel :
  - [ ] « Aucune donnée stockée sur un serveur » (le formulaire passe par `api/contact.ts` :
        honepot + jeton HMAC, envoi par email, aucune base de données)
  - [ ] « Aucun cookie ni traceur tiers » (vérifier que rien n'ajoute de script tiers)
  - [ ] Si Vercel Analytics/Web Analytics est activé plus tard : mettre à jour cette page et
        reconsidérer la nécessité d'une bannière de consentement.
- [ ] **Responsable de traitement** : nom + adresse réels (mêmes infos que l'éditeur).

## 3. Site — sécurité & conformité

- [ ] `vercel.json` actif (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- [ ] CSP : vérifier que `script-src 'self'` n'autorise aucun domaine tiers non justifié.
- [ ] Domaine de production final choisi et déployé (pas d'adresse `vercel.app` en production
      définitive pour le SEO).
- [ ] `robots.txt` / meta `noindex` : `mentions-legales`, `confidentialite` restent en `noindex`
      (déjà le cas via BaseLayout).
- [ ] Formulaire : tester `pnpm test` (jeton HMAC, honeypot, rate limit) et vérifier la
      transmission réelle des emails en preview.

## 4. Droits sur les contenus

- [ ] Down Trigger : autorisation écrite du client obtenue + crédits complétés
      (voir `docs/legal/copyright-status.md`).
- [ ] Méridien 1970 Paris et Beauchamp 95250 : contenus écrits (années, contexte), statut concept
      confirmé, disclaimers affichés.
- [ ] Assets (images, vidéos, posters) : licences vérifiées et créditées.

## 5. RGPD

- [ ] Droit d'accès / rectification / suppression : email de contact fonctionnel.
- [ ] Délai de conservation des emails : à préciser si l'outil de messagerie conserve les messages.
- [ ] Pas de données personnelles exposées (biographie à valider par le propriétaire).

## 6. Après mise en production

- [ ] Relancer `pnpm validate:links --external` sur l'URL de production.
- [ ] Relancer Lighthouse CI sur l'URL de production.
- [ ] Vérifier sitemap + indexation (Search Console si souhaité).
