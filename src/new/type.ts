export enum CddaType {
  item = 'item',
  ammo = 'ammo',
  armor = 'armor',

  itemCategory = 'item_category',
  proficiency = 'proficiency',

  profession = 'profession',

  quality = 'tool_quality',
  monster = 'monster',
  material = 'material',
  bodyPart = 'body_part',
  subBodyPart = 'sub_body_part',
  asciiArt = 'ascii_art',
  requirement = 'requirement',
  weaponCategory = 'weapon_category',
  emit = 'emit',
  technique = 'technique',
  skill = 'skill',
  faults = 'fault',
  itemGroup = 'item_group',
  vitamin = 'vitamin',
  terrain = 'terrain',
  flag = 'json_flag',
}

export enum CddaBranch {
  experimental,
  stable,
}

export enum BreathabilityRating {
  IMPERMEABLE = 0,
  POOR = 30,
  AVERAGE = 50,
  GOOD = 80,
  MOISTURE_WICKING = 110,
  SECOND_SKIN = 140,
  last = 0,
}

export enum PocketType {
  CONTAINER = 'CONTAINER',
  MAGAZINE = 'MAGAZINE',
  MAGAZINE_WELL = 'MAGAZINE_WELL', //holds magazines
  MOD = 'MOD', // the gunmods or toolmods
  CORPSE = 'CORPSE', // the "corpse" pocket - bionics embedded in a corpse
  SOFTWARE = 'SOFTWARE', // software put into usb or some such
  EBOOK = 'EBOOK', // holds electronic books for a device or usb
  MIGRATION = 'MIGRATION', // this allows items to load contents that are too big, in order to spill them later.
  LAST = 'LAST',
}

export enum damageType {
  pure = 'pure',
  biological = 'biological',
  bash = 'bash',
  cut = 'cut',
  acid = 'acid',
  stab = 'stab',
  bullet = 'bullet',
  heat = 'heat',
  cold = 'cold',
  electric = 'electric',
}
