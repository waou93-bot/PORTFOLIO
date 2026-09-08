# ADR-005 — Déploiement : statique sur CDN (Vercel)

**Statut** : Accepté · **Date** : 2026-07-31 · **Auteur** : Agent 17 / Orchestrateur

## Contexte

Site statique Astro, sortie `dist/`. Vercel CLI 56.2.0 disponible sur la machine. Le domaine canonique souhaité est `https://www.wadek.fr`, commandé chez OVH ; son activation est encore en cours.

## Décisions

1. **Vercel** : hébergement applicatif prévu, preview par branche/PR automatique, domaine de preview `.vercel.app`, variables d'environnement par environnement, headers/redirects configurables, rollback simple. Le rattachement de `www.wadek.fr` sera fait après activation du domaine.
2. **Formulaire de contact** : endpoint serverless Vercel (fonction Node) isolé — validation serveur, honeypot, rate limiting, destination email configurée par variable d'environnement. Aucune donnée stockée durablement.
3. **Analytics** : désactivé par défaut (aucun script tiers). Flag P1 vers une solution sans cookies (self-hosted / privacy-friendly) validée par l'agent Legal.
4. **Previews et staging en `noindex`** ; production seule indexable.
5. **Environnements** : local / preview (Vercel) / production. Variables séparées via Vercel (pas de secrets dans le code).
6. **Pas de changement DNS ni de publication de production sans validation explicite du propriétaire.**

## Conséquences

- Sortie 100 % statique : déployable ailleurs (Cloudflare Pages, Netlify) sans refonte (pas de verrouillage fort).
- Vercel est un choix de commodité, pas un lock-in : le dossier `dist/` est autonome.
- `vercel.json` : headers de sécurité (CSP, HSTS en production, Referrer-Policy, Permissions-Policy, X-Content-Type-Options), redirects propres.

## Bloqueur

- Aucun déploiement de production avant validation du propriétaire (brief §29).
- L’activation OVH et le rattachement du domaine dans Vercel nécessitent une action du propriétaire ou un accès autorisé ; aucune action externe n’est tentée ici.
