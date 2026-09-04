# 13 - Storyboard technique 2,5D - Portfolio immersif Nicolas Jez

## Statut

- Version : 0.1
- Date : 2026-08-04
- Statut : direction visuelle validee pour la suite de la preproduction ; aucune implementation
- Precedent valide : `docs/12_SPECIFICATION_2_5D.md`
- Planche visuelle de revue : `docs/references/inside-my-mind-2_5d-technical-storyboard-v01.png`

Ce document traduit la planche « Inside My Mind » en instructions de cadrage, de mouvement, de responsive et d'etats. Il ne choisit pas encore de moteur ni de plateforme.

## Regle de lecture

La planche validee reste la source de verite visuelle. Ce storyboard ajoute des contraintes de fabrication et de QA ; il ne remplace pas la planche et ne change pas le recit.

La planche visuelle v01 rend la separation de profondeur visible sous les plans de focus, portail, traversee et reveal. Elle sert a valider l'intention 2,5D ; elle ne constitue pas encore un fichier de production ni un rendu final.

## Planche technique des six plans

| ID | Composition | Couches actives | Camera / mouvement | Lumiere / matiere | Interface et sortie |
|---|---|---|---|---|---|
| SHOT-01 Hero | Portrait dans son environnement chaud, avec espace reserve au texte et au controle d'entree. | L0, L1, L2, L3 ; L4 inactif. | Cadre stable, profondeur a peine perceptible. | Mur brun/charbon, faisceau chaud, contraste premium. | Identifier Nicolas, le portfolio et la possibilite d'entrer ou de passer. |
| SHOT-02 Focus | Les lunettes occupent progressivement le centre de gravite ; le visage reste lisible autour. | L1, L2, L3, L4. | Rapprochement lent, sans deformation faciale. | Premier reflet cuivre dans la lentille ; pas de flash. | Le regard comprend que le passage se fera par les verres. |
| SHOT-03 Push-in | Le cadre se resserre jusqu'a la lentille dominante. | L3, L4, debut L5. | Push-in axial continu, parallaxe faible, profondeur simulee par les couches. | Arriere-plan plus sombre, reflet plus precis, bord de verre net. | Aucun bouton ne doit se superposer au point de passage. |
| SHOT-04 Portal | L'anneau circulaire apparait dans la lentille et devient une porte. | L4, L5. | Mouvement toujours axial ; l'anneau sert de masque de transition. | Cuivre/orange concentre, particules rares et directionnelles. | Le passage doit etre compris sans texte explicatif. |
| SHOT-05 Crossing | Le point de vue traverse l'anneau vers une profondeur bleue. | L5, L6 en apparition progressive. | Traversée courte puis ralentissement ; aucun mouvement orbital. | Bascule chaude vers bleu electrique, reflets plus froids. | Les premiers repères du monde interieur apparaissent sans etre encore navigables. |
| SHOT-06 Reveal | Le monde interieur se stabilise ; les œuvres et leurs points d'acces dominent la composition. | L6, avec traces visuelles de L5. | Stabilisation, legere respiration de profondeur ; pas de loop obligatoire. | Bleu froid principal, accents cuivre conserves comme fil conducteur. | Projets, navigation, skip et acces direct deviennent prioritaires. |

## Timing et keyframes de revue

Les valeurs suivantes sont des points de revue visuelle ; elles devront etre ajustees uniquement si un essai les contredit.

| Repere | Temps cible | Etat attendu |
|---|---:|---|
| K0 | 0,0 s | Hero stable, portrait et controle d'entree disponibles. |
| K1 | 2,0 s | Focus lunettes commence ; le visage n'est pas encore perdu. |
| K2 | 4,0 s | Reflet circulaire clairement visible ; intention d'entree lisible. |
| K3 | 6,5 s | Lentille dominante ; transition preparee et non brutale. |
| K4 | 8,5 s | Anneau-portail complet ; point de passage lisible. |
| K5 | 11,0 s | Traversée presque terminee ; monde interieur reconnaissable. |
| K6 | 14,0 s | Reveal stabilise ; acces aux projets prioritaire. |

Courbe de mouvement : acceleration douce, vitesse constante au centre de la traversee, deceleration avant le reveal. Aucun rebond, tremblement ou rotation demonstrative.

## Wireframe de composition

### Hero et transition

- Zone portrait : dominante, avec marge de securite autour des lunettes et du visage.
- Zone texte : courte, editoriale, secondaire par rapport au portrait ; jamais placee dans la lentille.
- Zone controle : visible, clavier-compatible et persistante assez longtemps pour passer la sequence.
- Zone signal : les traits, cadres et details graphiques restent fins et servent le cadrage ; ils ne doivent pas concurrencer le visage.

### Reveal

- Zone navigation : identifiable avant tout decor secondaire.
- Zone œuvres : chaque projet doit posseder un repere, un titre et une destination testable.
- Zone contexte : le monde interieur donne une atmosphere, mais aucune œuvre ne doit etre cachee derriere un effet.
- Zone sortie : retour, skip ou acces direct toujours disponible.

## Etats a dessiner avant implementation

| Etat | Comportement attendu | Preuve a fournir |
|---|---|---|
| Initial | Hero stable avant le mouvement. | Capture desktop et mobile. |
| Playing | Sequence lisible, non bloquante, avec progression naturelle. | Planche annotee avec timings. |
| Skip | Passage propre vers le reveal ou vers les œuvres. | Etat avant/apres et test clavier. |
| Reduced-motion | Hero statique, changement de lumiere ou fondu court, aucun push-in obligatoire. | Capture et parcours clavier. |
| Loading | Poster ou hero stable pendant le chargement. | Etat lent et etat media absent. |
| Media error | Fallback editorial lisible avec acces aux projets. | Capture d'erreur volontaire. |
| Direct project | Acces a une œuvre sans rejouer une introduction longue. | URL ou parcours documente a definir. |
| Return | Retour vers le reveal sans perte d'orientation. | Parcours de navigation complet. |

## Responsive : cadrages de reference

| Format | Priorite de cadrage | Adaptation 2,5D | Interdit |
|---|---|---|---|
| Desktop 1440 | Portrait puis lunettes en grand format. | Amplitude complete mais subtile. | Diminuer la lisibilite au profit du decor. |
| Laptop 1280/1024 | Maintenir les lunettes dans le centre utile. | Profondeur reduite si l'espace vertical manque. | Crop des verres au moment du portail. |
| Tablette 768 | Portrait et lentille restent dominants. | Moins de couches visibles ; transitions plus courtes si necessaire. | Demander un geste de precision. |
| Mobile 390/360 | Visage, lunettes, entree et projet visible. | Fallback poster ou 2,5D simplifiee autorise. | Scroll bloque, texte illisible, bouton hors ecran. |

## Contrôles et accessibilite

- Le controle d'entree doit etre visible, nomme et activable au clavier.
- Un controle « Passer » doit etre accessible pendant la sequence.
- Le son est coupe par defaut ou explicitement controlable ; aucun son critique ne doit etre obligatoire.
- Les textes du hero et du reveal restent disponibles sans mouvement.
- Le focus clavier ne doit jamais disparaitre dans la lentille ou pendant la traversée.
- Le reduced-motion doit modifier le mouvement, pas supprimer l'acces au contenu.
- Les images porteuses de sens ont un texte alternatif ; les couches purement decoratives sont ignorees par les technologies d'assistance.

## Preparation de livraison pour une future implementation

Avant toute production, le paquet de handoff devra contenir :

1. la planche de reference validee ;
2. les captures ou croquis des six plans, avec cadrage desktop et mobile ;
3. la liste des couches et medias avec proprietaire, source, licence et format ;
4. le tableau des timings et des etats ;
5. le poster, le reduced-motion et les fallbacks ;
6. la liste definitive des projets accessibles au reveal ;
7. le comparatif de plateforme et de moteur, fonde sur les contraintes de ce storyboard ;
8. le protocole de revue performance, accessibilite et QA.

## Tests de revue avant GO technique

- Une personne qui ne connait pas le projet comprend le passage portrait → lunettes → portail → monde interieur.
- La planche garde une identite personnelle et ne ressemble pas a une demo 3D generique.
- Le reveal montre les œuvres avant de montrer la prouesse technique.
- Le parcours complet est lisible sur 1440 px, 1024 px, 768 px, 390 px et 360 px.
- Le skip, le reduced-motion, le media absent et l'acces direct aux projets sont documentes.
- Les temps de chargement et les limites media sont compatibles avec un portfolio premium.
- Aucun choix de code ou de moteur n'est necessaire pour comprendre le comportement attendu.

## Arbitrages encore ouverts

- texte exact du controle d'entree et du skip ;
- declenchement automatique unique ou entree explicite ;
- cadrage final de la photographie source ;
- liste exacte des œuvres visibles dans le reveal ;
- representation finale du monde interieur ;
- plateforme et moteur apres comparatif technique ;
- palette finale et regles typographiques.

## Gate suivant

Faire une revue sponsor de cette planche technique et de la specification 2,5D. Le resultat attendu est un GO/NO-GO de la tranche de preproduction, pas le lancement du developpement.
