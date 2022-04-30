import { cloneDeepWith } from 'lodash';
import { AsyncName } from 'src/new/AsyncName';

export function cloneObject<T>(value: T): T {
  return cloneDeepWith(value, (value) => {
    if (value instanceof AsyncName) {
      return value;
    }
  }) as T;
}
