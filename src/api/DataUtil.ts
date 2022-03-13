import { UserConfigInterface } from 'src/store/user-config/state';

export function parseVolumeToMl(string: string | number): number {
  if (typeof string === 'undefined') return 0;
  if (typeof string === 'number') return string * 250;
  if (string.endsWith('ml')) return parseInt(string);
  else if (string.endsWith('L')) return parseInt(string) * 1000;
  else return 0;
}

export function parseWeightToG(string: string | number): number {
  if (typeof string === 'undefined') return 0;
  if (typeof string === 'number') return string;
  if (string.endsWith('mg')) return parseInt(string) / 1000;
  if (string.endsWith('kg')) return parseInt(string) * 1000;
  if (string.endsWith('g')) return parseInt(string);
  else return 0;
}

export function getLocalModById(
  userConfig: UserConfigInterface,
  modId: string
): Mod | undefined {
  return userConfig.mods.find((mod) => mod.id == modId);
}
