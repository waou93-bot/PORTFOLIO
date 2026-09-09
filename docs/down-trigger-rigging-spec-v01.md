# Down Trigger — spécification de marionnette 2D v01

## But

Transformer la silhouette masquée dessinée en marionnette image par image, sans modifier son identité graphique. Cette spécification sert de contrat de découpe dès que le modèle est validé.

Un premier atlas provisoire est disponible dans `assets/derived-down-trigger/puppet-atlas-provisional-v01/` avec une planche de contrôle et un manifeste JSON. Les chevauchements aux articulations sont intentionnels à ce stade : ils évitent les trous lors des essais, mais devront être redessinés proprement pour les assets canoniques.

Le test `prototypes/down-trigger-clip-preprod-v01/down-trigger-puppet-rig-test-v02.gif` assemble ces pièces sur 24 expositions. La variante `down-trigger-clip-animatic-v09.gif` l’intègre au découpage global ; elle sert de preuve technique du rigging, tandis que v08 reste la référence artistique de lecture.

## Hiérarchie des couches

```text
DT_masked_character
├── head_mask
├── hood_neck
├── torso_shirt
├── vest_front
├── upper_arm_L
├── forearm_L
├── glove_L
├── upper_arm_R
├── forearm_R
├── glove_R
├── pelvis
├── thigh_L
├── shin_L
├── boot_L
├── thigh_R
├── shin_R
├── boot_R
└── paper_shadow_and_rust_accents
```

## Points d’ancrage de travail

Coordonnées normalisées sur la source 1024×1536 ; elles seront recalées sur le dessin canonique final.

| Joint | Position indicative | Usage |
|---|---:|---|
| neck | (0, 0.22) | rotation tête/torse |
| shoulder_L / shoulder_R | (0.33, 0.29) / (0.67, 0.29) | résistance et chute |
| elbow_L / elbow_R | (0.28, 0.38) / (0.72, 0.38) | traction, appui, ouverture |
| wrist_L / wrist_R | (0.36, 0.43) / (0.64, 0.43) | raccord avec la main/dalle |
| pelvis | (0.50, 0.52) | centre de gravité |
| hip_L / hip_R | (0.42, 0.55) / (0.58, 0.55) | torsion et rotation |
| knee_L / knee_R | (0.40, 0.72) / (0.60, 0.72) | crouch et chute |
| ankle_L / ankle_R | (0.38, 0.91) / (0.62, 0.91) | contact avec la planète |

## Poses à fabriquer en priorité

1. résistance basse, deux mains et un genou au sol ;
2. prise d’arête, avant-bras tendu et bassin en arrière ;
3. dernier contact, un seul doigt visible sur la dalle ;
4. torsion latérale vers le core ;
5. chute trois-quarts, membres relâchés ;
6. chute dos caméra, silhouette réduite vers le centre.

## Règles de raccord

- La main, la manche et l’arête sont des couches distinctes mais partagent un repère fixe.
- Toute pose de contact doit fournir une version appui, une version interstice et une version séparation.
- Les accents rouille et le grain papier appartiennent aux couches de matière communes ; ils ne doivent pas scintiller indépendamment à chaque frame.
- Les accessoires générés dans une planche de poses ne sont pas importés dans la marionnette sans découpe séparée.

## État

Le modèle et la planche de poses actuels sont provisoires. La structure est prête à recevoir les exports canoniques ; aucune production intensive ne doit être déclarée avant validation du modèle et de l’audio.
