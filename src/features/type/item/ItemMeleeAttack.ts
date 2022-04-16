import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { parseVolumeToMl, parseWeightToG } from 'src/utils/DataUtil';
import { getName, isItem } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';

interface ToHitInterface {
  grip: string;
  length: string;
  surface: string;
  balance: string;
}

interface ItemMeleeAttackContent {
  weapon_category?: string | string[];
  bashing?: number;
  cutting?: number;
  piercing?: number;
  to_hit?: number | ToHitInterface;
  volume?: string | number;
  weight?: string | number;
  techniques?: string | string[];
}

interface ItemMeleeAttackFeature {
  weapon_category?: { id: string; name: string }[];
  bashing: number;
  cutting: number;
  piercing: number;
  to_hit: number | string;
  techniques?: { id: string; name: string; des?: string }[];
  baseMovesPerAttack: number;
}
export function validate(jsonItem: JsonItem): boolean {
  return isItem(jsonItem.type);
}
export function initItemMeleeAttackFeature(
  jsonItem: JsonItem
): ItemMeleeAttackFeature {
  const itemMeleeAttackFeature = reactive({} as ItemMeleeAttackFeature);
  const attackContent = jsonItem.content as ItemMeleeAttackContent;
  itemMeleeAttackFeature.weapon_category = (
    typeof attackContent.weapon_category === 'string'
      ? [attackContent.weapon_category]
      : attackContent.weapon_category
  )?.map((id) => {
    return { id, name: id };
  });
  itemMeleeAttackFeature.weapon_category?.forEach((category) => {
    void getBaseJsonItem('weapon_category', category.id).then((jsonItem) => {
      if (jsonItem) category.name = getName(jsonItem);
    });
  });
  itemMeleeAttackFeature.bashing = attackContent.bashing ?? 0;
  itemMeleeAttackFeature.cutting = attackContent.cutting ?? 0;
  itemMeleeAttackFeature.piercing = attackContent.piercing ?? 0;

  if (typeof attackContent.to_hit === 'number') {
    itemMeleeAttackFeature.to_hit = attackContent.to_hit;
  } else if (typeof attackContent.to_hit === 'object') {
    //TODO
    itemMeleeAttackFeature.to_hit = 0;
  } else {
    itemMeleeAttackFeature.to_hit = 0;
  }

  itemMeleeAttackFeature.baseMovesPerAttack =
    65 +
    Math.floor(parseVolumeToMl(attackContent.volume ?? 0) / 62.5) +
    Math.floor(parseWeightToG(attackContent.weight ?? 0) / 60);

  itemMeleeAttackFeature.techniques = (
    typeof attackContent.techniques === 'string'
      ? [attackContent.techniques]
      : attackContent.techniques
  )?.map((id) => {
    return { id, name: id };
  });
  itemMeleeAttackFeature.techniques?.forEach((technique) => {
    void getBaseJsonItem('technique', technique.id).then((jsonItems) => {
      if (isNotEmpty(jsonItems)) {
        technique.name = getName(jsonItems);
        technique.des = (<{ description?: string }>(
          jsonItems[0].content
        )).description;
      }
    });
  });
  return itemMeleeAttackFeature;
}
