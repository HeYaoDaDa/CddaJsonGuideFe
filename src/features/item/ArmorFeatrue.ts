// import { getAllJsonItemByCon } from 'src/api';
// import { getName, isItem } from 'src/utils/JsonItemUtil';
// import { getModName } from 'src/utils/JsonItemUtil';
// import { getJsonItems } from 'src/api/jsonItem';
// import { i18n } from 'src/boot/i18n';
// import { FeatureHandlerInterface, FeatureFactoryInterface } from 'src/type';

// export class ArmorFactory implements FeatureFactoryInterface {
//   getFeatureHandler(): FeatureHandlerInterface<unknown> {
//     return new ArmorHandler() as FeatureHandlerInterface<unknown>;
//   }
// }

// export class ArmorHandler implements FeatureHandlerInterface<ArmorFeature> {
//   label = 'label.armor';
//   validate = (jsonItem: JsonItem) => {
//     return (
//       isItem(jsonItem.type) &&
//       (<ArmorContent>jsonItem.content).armor !== undefined
//     );
//   };
//   getDatas = () =>
//     getAllJsonItemByCon('item', [
//       {
//         $match: {
//           'content.armor': {
//             $exists: true,
//           },
//         },
//       },
//     ]).then((jsonItems: JsonItem[]) => {
//       const armorFeatures = new Array<ArmorFeature>();
//       jsonItems.forEach((jsonItem) => {
//         if (this.validate(jsonItem)) {
//           armorFeatures.push(this.convert(jsonItem));
//         }
//       });
//       return armorFeatures;
//     });
//   getColumns = () => [
//     {
//       name: 'name',
//       label: i18n.global.t('label.name'),
//       field: (row: ArmorFeature) => row.name,
//       required: true,
//       sortable: true,
//       hideInCard: true,
//     },
//     {
//       name: 'mod',
//       label: 'Mod',
//       field: (row: ArmorFeature) => row.mod,
//       required: true,
//       sortable: true,
//       hideInCard: true,
//     },
//     {
//       name: 'covers',
//       label: 'label.covers',
//       field: (row: ArmorFeature) => row.covers?.join(', '),
//       required: true,
//       sortable: true,
//       hideInCard: true,
//     },
//   ];

//   convert = (jsonItem: JsonItem) => {
//     const armorContent = <ArmorContent>jsonItem.content;
//     const armorFeature: ArmorFeature = {
//       name: getName(jsonItem),
//       mod: jsonItem.mod,
//       covers: armorContent?.covers,
//       warmth: armorContent.warmth,
//       layers: new Array<string>(),

//       coverage: armorContent.coverage,
//       cover_melee: armorContent.cover_melee,
//       cover_ranged: armorContent.cover_ranged,
//       cover_vitals: armorContent.cover_vitals,

//       weight_capacity_bonus: armorContent.weight_capacity_bonus,
//       weight_capacity_modifier: armorContent.weight_capacity_modifier,
//       power_armor: armorContent.power_armor,
//       non_functional: armorContent.non_functional,
//       valid_mods: armorContent.valid_mods,
//       limbArmors: [],
//     } as ArmorFeature;
//     if (armorContent.flags) {
//       const layerFlags = ['OUTER', 'NORMAL', ''];
//     } else {
//       armorFeature.layers.push('NORMAL');
//     }
//     if (armorContent.armor) {
//       armorContent.armor.forEach((subArmor) => {
//         armorFeature.limbArmors.push({
//           cover: subArmor.covers,
//           specificallyCovers: subArmor.specifically_covers,
//           encumbrance: subArmor.encumbrance ?? [
//             armorContent.encumbrance,
//             armorContent.max_encumbrance,
//           ],
//           environmentalProtection:
//             subArmor.encumbrance ?? armorContent.environmental_protection,

//           coverage: subArmor.coverage,
//           cover_melee: subArmor.cover_melee,
//           cover_ranged: subArmor.cover_ranged,
//           cover_vitals: subArmor.cover_vitals,
//         } as LimbArmor);
//       });
//     }
//     return armorFeature;
//   };
// }

// interface ArmorContent {
//   covers?: string[];
//   warmth?: number;
//   flags?: string[];
//   environmental_protection?: number;
//   encumbrance?: number;
//   max_encumbrance?: number;
//   weight_capacity_bonus?: number | string;
//   weight_capacity_modifier?: number;
//   coverage?: number;
//   cover_melee?: number;
//   cover_ranged?: number;
//   cover_vitals?: number;
//   material_thickness?: number;
//   power_armor?: boolean;
//   non_functional?: string;
//   valid_mods?: string[];
//   armor?: [
//     {
//       encumbrance?: number[] | number;
//       coverage?: number;
//       cover_melee?: number;
//       cover_ranged?: number;
//       cover_vitals?: number;
//       covers: string[];
//       specifically_covers?: string[];
//       material?: [
//         { type?: string; covered_by_mat?: number; thickness?: number }
//       ];
//     }
//   ];
// }

// class ArmorFeature {
//   name: string;
//   mod: string;
//   covers: string[];
//   layers: string[];
//   warmth: number;

//   coverage: number;
//   cover_melee?: number;
//   cover_ranged?: number;
//   cover_vitals?: number;

//   weight_capacity_bonus?: number | string;
//   weight_capacity_modifier?: number;
//   power_armor?: boolean;
//   non_functional?: string;
//   valid_mods?: string[];

//   limbArmors: LimbArmor[];

//   constructor(jsonItem: JsonItem) {
//     const armorContent = <ArmorContent>jsonItem.content;
//     this.name = getName(jsonItem);
//     this.mod = jsonItem.mod;
//     this.covers = armorContent.covers ?? [];
//     this.warmth = armorContent.warmth ?? 0;
//     this.layers = [];

//     this.coverage = armorContent.coverage ?? 0;
//     this.cover_melee = armorContent.cover_melee;
//     this.cover_ranged = armorContent.cover_ranged;
//     this.cover_vitals = armorContent.cover_vitals;

//     this.weight_capacity_bonus = armorContent.weight_capacity_bonus;
//     this.weight_capacity_modifier = armorContent.weight_capacity_modifier;
//     this.power_armor = armorContent.power_armor;
//     this.non_functional = armorContent.non_functional;
//     this.valid_mods = armorContent.valid_mods;
//     this.limbArmors = [];

//     if (armorContent.flags) {
//       const layerFlags = [
//         'PERSONAL',
//         'SKINTIGHT',
//         'BELTED',
//         'OUTER',
//         'WAIST',
//         'AURA',
//       ];
//       for (const layerFlag of armorContent.flags) {
//         if (layerFlags.includes(layerFlag)) {
//           this.layers.push(layerFlag);
//         }
//       }
//     } else {
//       this.layers.push('NORMAL');
//     }

//     if (armorContent.armor) {
//       armorContent.armor.forEach((subArmor) => {
//         this.limbArmors.push({
//           cover: subArmor.covers,
//           specificallyCovers: subArmor.specifically_covers,
//           encumbrance: subArmor.encumbrance ?? [
//             armorContent.encumbrance,
//             armorContent.max_encumbrance,
//           ],
//           environmentalProtection:
//             subArmor.encumbrance ?? armorContent.environmental_protection,

//           coverage: subArmor.coverage,
//           cover_melee: subArmor.cover_melee,
//           cover_ranged: subArmor.cover_ranged,
//           cover_vitals: subArmor.cover_vitals,
//         } as LimbArmor);
//       });
//     }
//   }
// }

// function getEnvResist(armorContent: ArmorContent, limbArmors: LimbArmor[]) {
//   if (limbArmors.length === 0) return 0;
//   const avgEnvResist =
//     limbArmors.reduce(
//       (m, o) =>
//         m +
//         (o.environmentalProtection ??
//           armorContent.environmental_protection ??
//           0),
//       0
//     ) / limbArmors.length;
//   return avgEnvResist;
// }

// interface LimbArmor {
//   cover: string[];
//   specificallyCovers: string[];
//   encumbrance: number[];
//   environmentalProtection: number;

//   coverage: number;
//   cover_melee?: number;
//   cover_ranged?: number;
//   cover_vitals?: number;

//   acidProtection: number;
//   fireProtection: number;

//   protection: protection[];
// }

// interface protection {
//   bashProtection: number;
//   cutProtection: number;
//   ballistic: number;
//   probability: number;
// }
