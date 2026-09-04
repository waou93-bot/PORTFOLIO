# 07 - Architecture technique - Portfolio immersif Nicolas Jez

## Statut

Document de cadrage ; aucune stack finale n'est decidee avant la preproduction artistique et le comparatif technique.

Comparatif de référence : `docs/14_COMPARATIF_PLATEFORME_STACK.md`. Recommandation actuelle à arbitrer : Astro principalement statique, contenu structuré et îlot immersif 2,5D isolé.

## Intention

Decrire les frontieres, dependances et choix reversibles necessaires au site premium. La technologie doit servir la preuve professionnelle et la completude des oeuvres, pas seulement produire un effet spectaculaire.

Reference d'ambition : le site Lando Norris est documente comme Webflow avec GSAP, Rive et WebGL ; il combine identite proprietaire, contenu editorial, sections specialisees, interactions fortes et adaptation mobile. Cette reference fixe une exigence de craft, pas une obligation d'utiliser la meme stack.

## Etat connu

- Profil : `hybrid`
- Git dans la source : oui
- Source : `C:\Users\Nicolas JEZ\Documents\NJ\PORTFOLIO 1`
- Indices :

- software marker: package.json
- software marker: pnpm-lock.yaml
- software marker: tsconfig.json
- artistic media: .png x1
- artistic media: .svg x5
- artistic directory: design
- artistic directory: media

## A arbitrer

- Plateforme cible : comparer Webflow, Astro avec ilot immersif et architecture JavaScript dediee.
- Stack ou moteur : comparer DOM/CSS/WAAPI, Canvas/WebGL/Three.js, Rive et eventuels composants 2.5D selon le storyboard valide.
- Mode de persistance : determiner si les projets restent geres par contenu versionne ou necessitent un CMS ; aucune decision avant l'inventaire complet des oeuvres.
- Observabilite et tests : definir tests responsive, accessibilite, reduced-motion, fallback, performance reelle, erreurs media et navigation directe.
- Reversibilite : aucun choix ne doit rendre les etudes de cas dependantes du moteur immersif.

## Tranche verticale non codee

Storyboard + animatique + architecture cible de la sequence validee "Inside My Mind", avec traitement 2,5D "Glass / Parallax", etats desktop/mobile, fallback, budget de performance et acces direct aux oeuvres.

## Contraintes techniques de la direction retenue

- Le portrait source reste reel, identifiable et prioritaire dans le hero.
- La 2,5D repose sur des couches maitrisees : arriere-plan, silhouette et visage, lunettes, reflets et elements de portail ; chaque couche doit avoir une fonction narrative ou de profondeur.
- Le mouvement attendu est un push-in cinematique, un parallaxe subtil et des variations de lumiere/reflet. Aucun effet ne doit transformer l'experience en demonstration 3D generique.
- La lentille des lunettes masque la transition vers le portail et doit preserver la continuite visuelle entre la photographie et le monde interieur.
- Le monde interieur peut etre une composition spatiale ou une scene rendue, mais son acces aux oeuvres doit rester lisible, direct et independant de l'effet immersif.
- Un etat statique, une strategie reduced-motion et un fallback mobile doivent etre specifies avant toute implementation.

## Regle

Toute decision technique irreversible doit etre inscrite dans le registre des decisions avec une preuve ou un motif explicite.
