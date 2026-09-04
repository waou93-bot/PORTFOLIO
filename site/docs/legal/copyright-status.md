# Copyright — Statut des droits par projet

> Règle : un projet n'est publié que lorsque son statut de droits est confirmé par écrit.
> Aucun contenu ne sera publié avec un statut incertain.

## Site portfolio lui-même (code, design, textes)

Le code, le design et les textes du portfolio appartiennent à Nicolas Jez.

**Cas salarié (Art. L113-9 CPI)** : si Nicolas développe ce site alors qu'il est salarié d'une
entreprise, la propriété du code ne lui revient automatiquement que si le projet est **hors de ses
fonctions**, **sans instructions** ni **moyens** de l'employeur, et réalisé **sur son temps
personnel**. Recommandation si applicable : déclaration écrite « hors mission » (email ou LRAR)
reprenant date, description, absence de lien avec les fonctions, absence de moyens employeur, temps
personnel, référence à l'Art. L113-9 CPI, avec demande d'accusé de réception (2 mois). Conserver les
preuves (commits git, horodatage).

## Projets présentés

| Projet        | Statut de droits          | Preuve requise                              | Publication |
| ------------- | ------------------------- | ------------------------------------------- | ----------- |
| Down Trigger  | À confirmer (auteur/rôle) | Autorisation du groupe + crédits des médias | Bloquée     |
| Héritage 2    | À confirmer               | Validation des médias et de la diffusion    | Bloquée     |
| Maison Sillon | Concept indépendant       | Mention conceptuelle affichée               | Autorisée   |
| Vantel        | Concept fictif intégral   | Déclaration de Nicolas du 4 septembre 2026  | Autorisée   |

Pour les concepts indépendants, l'affichage de la mention `independentConceptDisclaimer`
(exigée par `src/content.config.ts`) est la garantie juridique/éditoriale affichée.

## Règles appliquées par `scripts/validate-content/index.ts`

- `rightsStatus: not-required` autorise la publication si le projet est un concept indépendant.
- `rightsStatus: pending` ou `clientName` réel → publication bloquée tant que `publicationStatus`
  reste `draft` ou `pending`.
- Tout `results[]` publié exige une `source` vérifiée.
- Tout `summary`, `cover.alt`, crédits manquants → refus en `published`.

## Responsabilités

- **Résultats/métriques** : jamais inventés, toujours sourcés.
- **Marques évoquées par un concept** : restent la propriété de leurs titulaires ; le site l'affiche
  (mentions légales + disclaimer par projet).
- **Assets tiers** (photos, vidéos, musiques) : licence vérifiée et créditée avant intégration.

## Vérification pré-production

1. Relire `docs/00-content-gaps.md` : aucune lacune bloquante résiduelle.
2. Vérifier `publicationStatus: published` uniquement pour les projets dont les droits sont confirmés.
3. Confirmer les crédits d'assets (gallery, couvertures, vidéos).
