import { IdNameHelpInterface } from 'src/type';
import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { initIdNameHelpInterface } from 'src/utils/DataUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';

export interface MonsterAttackEffectContent {
  id: string;
  name: string;
  duration?: number;
  affect_hit_bp?: boolean;
  bp?: string;
  permanent?: boolean;
  chance?: number;
}

export interface MonsterAttackEffectFeature {
  id: string;
  name: string;
  duration?: number;
  affect_hit_bp?: boolean;
  bp?: IdNameHelpInterface;
  permanent?: boolean;
  chance?: number;
}
function initMonsterAttackEffectFeature(
  val: unknown
): MonsterAttackEffectFeature {
  const content = val as MonsterAttackEffectContent;
  const result = reactive({} as MonsterAttackEffectFeature);

  result.id = content.id;
  result.name = content.name;
  void getBaseJsonItem('effect_type', result.id).then((jsonItems) => {
    if (isNotEmpty(jsonItems)) {
      result.name = getName(jsonItems);
    }
  });
  result.duration = content.duration;
  result.affect_hit_bp = content.affect_hit_bp;
  if (content.bp) {
    result.bp = initIdNameHelpInterface(content.bp);
    void getBaseJsonItem('body_part', result.bp.id).then((jsonItems) => {
      if (isNotEmpty(jsonItems) && result.bp) {
        result.bp.name = getName(jsonItems);
      }
    });
  }
  result.permanent = content.permanent;
  result.chance = content.chance;

  return result;
}

export function initMonsterAttackEffectFeatures(
  vals: unknown | unknown[] | undefined
): MonsterAttackEffectFeature[] {
  if (!vals) {
    return [];
  }
  const jsonObjects = (
    vals instanceof Array ? vals : [vals]
  ) as MonsterAttackEffectContent[];

  const result = jsonObjects.map((jsonObject) =>
    initMonsterAttackEffectFeature(jsonObject)
  );

  return result;
}
