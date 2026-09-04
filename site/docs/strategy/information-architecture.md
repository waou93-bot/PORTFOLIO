# Stratégie — Architecture de l'information

## Sitemap

```
/                      Accueil (hero, positionnement, selected works, approche, services, présentation, CTA)
/work                  Index des projets (filtres type/compétence quand suffisant, distinction client/concept)
/work/[slug]           Étude de cas détaillée (structure de données cohérente, narration adaptée)
/about                 Présentation, approche, compétences, disponibilité, métriques de perf publiées
/contact               Formulaire court + coordonnées + mentions
/mentions-legales      Identité, éditeur, hébergeur, propriété intellectuelle
/confidentialite       Politique de confidentialité (données du formulaire, analytics)
/404                   Page introuvable (utile, pas de piège)
```

`/lab` (expérimentations) : non retenu au lancement (flag P2) — il ne justifie pas un poste dédié tant que les projets publiables ne sont pas là.

## Navigation

- **Desktop** : header fixe discret (identité + Accueil/Projets/À propos/Contact), footer riche (contact, réseaux, mentions).
- **Mobile** : même navigation en haut, jamais cachée derrière un geste mystère. Menu simple, cibles tactiles ≥ 44 px.
- Lien d'évitement (« Aller au contenu ») en premier élément du DOM.

## Hiérarchie visuelle de l'accueil

1. Héro (identité + promesse + CTA)
2. Positionnement synthétique
3. Selected Works (cartes : visuel + rôle + année + secteur + statut)
4. Approche / méthode (comment je travaille)
5. Compétences / services
6. Présentation courte + disponibilité
7. CTA de contact
8. Footer

## Règles de contenu

- Les projets en `draft` / `private` / droits `pending` : exclus du sitemap, non indexables, non liés.
- Distinction visuelle client / concept explicite sur chaque carte et chaque page (badge + disclaimer pour les concepts).
