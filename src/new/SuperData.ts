import { reactive, VNode } from 'vue';
import { CddaBranch } from './type';

export abstract class SuperData<T extends object> {
  validVersion: Map<CddaBranch, [Version, Version]> = new Map();
  data: T = reactive({}) as T;
  validateValue(value: object): boolean {
    return value !== undefined;
  }

  validateVersion(version: Version): boolean {
    return version !== undefined;
  }

  abstract getView(): VNode[];

  constructor(obj: object | undefined) {
    if (obj) {
      console.debug(
        'start constructor %s, obj is %o',
        Object.getOwnPropertyNames(this),
        obj
      );
    }
  }
}
