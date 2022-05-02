import { UserConfigInterface } from 'src/store/user-config/state';
import { IdNameHelpInterface } from 'src/type';
import { reactive, VNode, h } from 'vue';
import MyText from 'src/new/components/MyText/MyText.vue';

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

export function parseLengthToCm(string: string | number): number {
  if (typeof string === 'undefined') return 0;
  if (typeof string === 'number') return string;
  if (string.endsWith('cm')) return parseInt(string);
  else if (string.endsWith('m')) return parseInt(string) * 1000;
  else return 0;
}

export function getLocalModById(
  userConfig: UserConfigInterface,
  modId: string
): Mod | undefined {
  return userConfig.mods.find((mod) => mod.id == modId);
}

export function pushItem<T>(array: Array<T> | undefined, item: T): Array<T> {
  if (!array) {
    array = new Array<T>();
  }
  array.push(item);
  return array;
}

export function initIdNameHelpInterface(val: string): IdNameHelpInterface {
  return reactive({ id: val, name: val });
}

export function initIdNameHelpInterfaces(
  vals: string[]
): IdNameHelpInterface[] {
  return reactive(vals.map((val) => initIdNameHelpInterface(val)));
}

export function hasFlag(flags: string[], val: string): boolean {
  return (
    flags.find((flag) => flag.toLowerCase() === val.toLowerCase()) != undefined
  );
}

export function convertToArray<T>(val: T | T[]): T[] {
  if (val instanceof Array) {
    return val;
  } else {
    return [val];
  }
}

export function weightToString(value: number): string {
  if (value >= 1000 * 1000) {
    return `${value / 1000 / 1000} t`;
  } else if (value >= 1000) {
    return `${value / 1000} kg`;
  } else {
    return `${value} g`;
  }
}

export function lengthToString(value: number): string {
  if (value >= 1000 * 100) {
    return `${value / 1000 / 100} km`;
  } else if (value >= 100) {
    return `${value / 100} m`;
  } else {
    return `${value} cm`;
  }
}

export function VolumeToString(value: number): string {
  if (value >= 1000) {
    return `${value / 1000} L`;
  } else {
    return `${value} ml`;
  }
}

export function foreachVNode<T>(
  value: Array<T>,
  vNodeFun: (item: T) => VNode[],
  separator?: string
): Array<VNode> {
  const result = new Array<VNode>();
  value.forEach((v, i, a) => {
    result.push(...vNodeFun(v));
    if (separator && i < a.length - 1) {
      result.push(h(MyText, { content: separator }));
    }
  });
  return result;
}
