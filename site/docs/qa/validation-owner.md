# Validation propriétaire — liste finale avant production

> Cette liste est signée par le propriétaire (Nicolas Jez). Chaque case cochée = acceptation.
> Rien n'est mis en production tant que toute la liste n'est pas verte.

## 1. Contenu — projets

- [ ] **Down Trigger** : crédits tiers et métadonnées disponibles complétés ; l’autorisation du groupe est confirmée par Nicolas.
- [ ] **Héritage 2** : concept fictif, disclaimer, médias et variante mobile vérifiés.
- [ ] **Maison Sillon** : concept fictif, disclaimer, provenance des rendus et contenu validés.
- [ ] **Vantel** : concept fictif, disclaimer, médias et démonstration correctement décrits.
- [ ] Résultats/métriques : toutes sourcées ou supprimées.
- [ ] Disclaimers concept affichés sur les projets concernés.
- [ ] Couvertures et galeries : visuels définitifs, alts descriptifs, droits ok.

## 2. Biographie & contact

- [ ] Texte de bio validé mot à mot.
- [ ] Email de contact : celui de `src/config/site.ts` est correct.
- [ ] Réseaux sociaux : liens ajoutés (ou décision de ne pas en mettre).
- [ ] Ville de base affichée correcte.

## 3. Pages légales

- [ ] Mentions légales complétées (identité, adresse, SIREN/SIRET si besoin, hébergeur) —
      voir `docs/legal/legal-checklist.md`.
- [ ] Confidentialité relue et conforme au déploiement réel (formulaire, analytics, cookies).
- [ ] Aucun placeholder ou contenu provisoire visible sur les pages publiques.

## 4. Design & ressenti

- [ ] Direction artistique validée (thème clair/sombre, typographies, rythme).
- [ ] Motion : pas de nausée, respect de `prefers-reduced-motion`.
- [ ] Navigation entre projets cohérente ; 404 utile.

## 5. Technique

- [ ] Pipeline complet vert (`docs/qa/qa-plan.md`).
- [ ] Lighthouse vert sur preview (perf ≥ 0.95, LCP ≤ 2,5 s, CLS ≤ 0,1).
- [ ] E2E vert sur preview.
- [ ] Mobile : tout fonctionne (menu, formulaire, vidéos avec poster).
- [ ] Domaine canonique `https://www.wadek.fr` activé chez OVH puis rattaché à Vercel ; `vercel.json` (CSP/HSTS) actif sur la preview.

## 6. GO / NO-GO

- [ ] Tous les points bloquants ci-dessus cochés.
- [ ] **Décision finale du propriétaire : GO** (mise en production) ou NO-GO (ajustements).

---

Signé / validé par le propriétaire : _____

Date : _____

Notes : _____
