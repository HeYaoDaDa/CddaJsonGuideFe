import { UpgradesFactory } from './cards/factorys/UpgradesFactory';
import { CardFactoryInterface } from 'src/type';
import { MonsterGrowFactory } from './cards/factorys/MonsterGrowFactory';
export const languageOptions = [
  { value: 'en-US', label: 'English' },
  // { value: 'ar', label: 'العربية' },
  // { value: 'cs', label: 'Český Jazyk' },
  // { value: 'da', label: 'Dansk' },
  // { value: 'de', label: 'Deutsch' },
  // { value: 'el', label: 'Ελληνικά' },
  // { value: 'es-AR', label: 'Español (Argentina)' },
  // { value: 'es-ES', label: 'Español (España)' },
  // { value: 'fr', label: 'Français' },
  // { value: 'hu', label: 'Magyar' },
  // { value: 'id', label: 'Bahasa Indonesia' },
  // { value: 'is', label: 'Íslenska' },
  // { value: 'it-IT', label: 'Italiano' },
  // { value: 'ja', label: '日本語' },
  // { value: 'ko', label: '한국어' },
  // { value: 'nb', label: 'Norsk' },
  // { value: 'nl', label: 'Nederlands' },
  // { value: 'pl', label: 'Polski' },
  // { value: 'pt-BR', label: 'Português (Brasil)' },
  // { value: 'ru', label: 'Русский' },
  // { value: 'sr', label: 'Српски' },
  // { value: 'tr', label: 'Türkçe' },
  // { value: 'uk-UA', label: 'український' },
  { value: 'zh-CN', label: '中文 (天朝)' },
  // { value: 'zh-TW', label: '中文 (台灣)' },
];

export const itemTypes = [
  'ammo',
  'gun',
  'armor',
  'pet_armor',
  'tool',
  'toolmod',
  'tool_armor',
  'book',
  'comestible',
  'engine',
  'wheel',
  'gunmod',
  'magazine',
  'battery',
  'generic',
  'bionic_item',
];

export const cardTypes = new Map<string, CardFactoryInterface>()
  .set('upgrades', new UpgradesFactory())
  .set('monsterGrow', new MonsterGrowFactory());
