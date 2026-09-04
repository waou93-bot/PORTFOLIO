# 00 - Master Brief - Portfolio immersif Nicolas Jez

## Statut

- Version : 0.4
- Profil : `hybrid` (hybride)
- Date d'initialisation : 2026-08-03T21:38:08.734074+00:00
- Statut : direction artistique validée ; préproduction technique et contenu à finaliser
- Production : non commencee

## Objectif

Concevoir et valider en préproduction un portfolio web premium où un portrait de Nicolas ouvre sur un monde intérieur donnant accès à ses projets réels. Le site doit fonctionner comme sa carte de visite professionnelle et son équivalent CV pour intégrer le monde professionnel qu’il vise.

Le résultat attendu est un site en état gold ou quasiment gold : toutes les œuvres retenues sont présentes, correctement présentées, accessibles, fonctionnelles et soutenues par une direction artistique et technique cohérente.

Règle bloquante : aucun code, prototype fonctionnel ou modification du site de production ne commence avant validation complète de la direction artistique et technique.

## Faits connus

Contexte inspecte : `C:\Users\Nicolas JEZ\Documents\NJ\PORTFOLIO 1`  
Fichiers inspectes : 112  
Extensions recensees : .astro: 19, .cjs: 1, .css: 1, .csv: 1, .example: 1, .html: 2, .js: 1, .json: 11, .local: 1, .md: 30, .mjs: 3, .png: 1, .svg: 5, .ts: 29, .txt: 1, .yaml: 2, .zip: 2, [none]: 1  
Git detecte : oui

Indices ayant guide la classification :

- software marker: package.json
- software marker: pnpm-lock.yaml
- software marker: tsconfig.json
- artistic media: .png x1
- artistic media: .svg x5
- artistic directory: design
- artistic directory: media

## Contraintes non négociables

- Le site engage directement l’image professionnelle et la carrière de Nicolas.
- Le niveau de qualité visé est premium, gold ou quasiment gold ; « suffisant pour montrer une idée » n’est pas un niveau acceptable pour le livrable final.
- Toutes les œuvres que Nicolas décide de montrer doivent être présentes et accessibles depuis l’expérience finale.
- Le site doit rester fonctionnel et compréhensible sans dépendre d’un effet spectaculaire, d’un hover précis ou d’une machine puissante.
- Aucun lancement public avant validation propriétaire, validation des droits et QA complète.

Toute contrainte non confirmee reste une hypothese et doit etre deplacee dans le registre des risques.

## Perimetre initial

### Inclus

- Cadrage du projet et sources de verite.
- Definition d'une tranche verticale representative.
- Criteres d'acceptation et risques a tester.

### Exclus

- Production generale ou finition exhaustive.
- Import automatique de tous les essais historiques.
- Decisions irreversibles non validees.
- Lancement commercial ou diffusion publique.

## Tranche verticale proposee

Tranche de préproduction non codée, présentable comme une séquence complète : intention, storyboard, planches visuelles, rythme, comportement mobile, architecture cible, fallback et critères de qualité. Elle doit montrer comment le portrait devient une porte vers le monde intérieur puis donne accès à un projet réel.

La tranche doit être suffisamment aboutie pour permettre une décision GO/NO-GO de la direction artistique et technique, sans engager la production du site.

Risques testés : valeur professionnelle, singularité sans effet gadget, cohérence du passage portrait → monde intérieur, hiérarchie entre expérience et œuvres, faisabilité technique, performance mobile, accessibilité, droits et charge réelle.

## Direction retenue en préproduction

Le storyboard validé `docs/references/inside-my-mind-validated-storyboard.png` est la référence narrative et visuelle canonique. La séquence à préserver est : portrait réel chaleureux → focus sur les lunettes → push-in → lentille-portail → traversée → révélation du monde intérieur et accès aux projets.

Le mix validé avec la proposition « Glass / Parallax » apporte un traitement 2,5D : le portrait reste une photographie réelle et identifiable, découpée en couches de profondeur pour produire un parallaxe subtil, des reflets et un mouvement de caméra contrôlé. Il n'est pas prévu de reconstruire un visage entièrement en 3D.

Les arbitrages encore ouverts portent uniquement sur les raffinements et la traduction technique : palette et typographies finales, matériaux et niveaux de détail, inventaire exact des œuvres, comportement mobile, fallback, performance et choix de plateforme. Ils ne doivent pas rouvrir la direction « Inside My Mind » ni son rôle de portail par les lunettes.

## Arbitrages ouverts

- Plateforme et stack : à choisir après la comparaison documentée des options. Le benchmark Lando Norris fixe l’ambition visuelle, pas la technologie à copier.
- Périmètre exact des œuvres à montrer : la liste exhaustive doit être confirmée et chaque œuvre doit avoir un statut de droits et d’assets.
- Direction artistique de base : validée avec le storyboard « Inside My Mind » et le mix 2,5D « Glass / Parallax » ; seuls les raffinements restent à arbitrer.
- Architecture technique finale : à verrouiller après validation de la direction artistique, avec stratégie mobile, fallback et budget de performance.

## Prochaine action

Arbitrer le comparatif `docs/14_COMPARATIF_PLATEFORME_STACK.md`, puis finaliser l'inventaire des œuvres de la phase 1 avant le GO/NO-GO technique ; aucun code avant cet arbitrage.
