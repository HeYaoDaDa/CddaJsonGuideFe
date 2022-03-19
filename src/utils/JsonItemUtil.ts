import { itemTypes } from 'src/constant';

export function isItem(jsonType: string): boolean {
  return itemTypes.includes(jsonType);
}
