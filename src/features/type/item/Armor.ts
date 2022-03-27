// import { getName } from 'src/utils/JsonItemUtil';

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
