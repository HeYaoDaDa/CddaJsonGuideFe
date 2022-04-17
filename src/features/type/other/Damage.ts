//damage_unit damage.h
export interface DamageInstance {
  damageType: string;
  amount: number;
  armorPenetration: number;
  armorPenetrationMultiplier: number;
  damageMultiplier: number;
}

function initDamageInstanceByJsonObject(val: unknown): DamageInstance {
  const jsonObject = val as DamageInstanceJsonObject;
  const result = {} as DamageInstance;

  result.damageType = jsonObject.damage_type;
  result.amount = jsonObject.amount;
  result.armorPenetration = jsonObject.armor_penetration;
  result.armorPenetrationMultiplier = jsonObject.armor_multiplier;
  result.damageMultiplier = jsonObject.damage_multiplier;

  return result;
}

export function initDamageInstanceByJsonObjects(
  vals: unknown | unknown[]
): DamageInstance[] {
  const jsonObjects = (
    vals instanceof Array ? vals : [vals]
  ) as DamageInstanceJsonObject[];

  const result = jsonObjects.map((jsonObject) =>
    initDamageInstanceByJsonObject(jsonObject)
  );

  return result;
}

export interface DamageInstanceJsonObject {
  damage_type: string;
  amount: number;
  armor_penetration: number;
  armor_multiplier: number;
  damage_multiplier: number;
}
