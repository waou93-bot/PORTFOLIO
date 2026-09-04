# Stratégie — Parcours de conversion

## Étapes et intentions

| Étape         | Page                    | Objectif                              | Critère de succès                          |
| ------------- | ----------------------- | ------------------------------------- | ------------------------------------------ |
| Arrivée       | /                       | Comprendre qui, quoi, pourquoi en 5 s | Héro lisible, CTA visible sans scroll      |
| Compréhension | / (scroll)              | Positionnement, services, niveau      | < 30 s : « ce type de projets, ce niveau » |
| Consultation  | /work puis /work/[slug] | Preuve par les cas                    | Cas structurés, honnêtes, lisibles         |
| Preuve        | études de cas + /about  | Crédibilité (rôle, périmètre, perf)   | Informations vérifiables, pas de puff      |
| CTA           | partout (sticky/footer) | Initier la conversation               | Contact accessible à tout moment           |
| Contact       | /contact                | Message qualifié envoyé               | Formulaire court, 2 min max                |

## CTA

- Principal : **« Découvrir les projets »** → /work.
- Secondaire : **« Parler d'un projet »** → /contact.
- Persistant : lien contact dans header + footer + fin de chaque étude de cas (« Un projet à discuter ? »).

## Anti-dark-patterns

- Aucune fausse urgence, aucun faux compteur, aucun faux témoignage, aucun consentement piégé.
- Le formulaire demande uniquement : nom, email, type de projet, message + mention confidentialité.
- Si aucune donnée personnelle tiers n'est collectée → pas de bannière cookie (décision à confirmer par l'agent Legal).

## Événements d'analytics (P1, opt-in privacy-friendly)

- `view_project` · `click_live_site` · `play_project_preview` · `open_contact` · `submit_contact_success` · `submit_contact_error`.
- Jamais de texte de message, email, nom ou identifiant dans les analytics.
