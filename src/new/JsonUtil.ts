import {
  parseLengthToCm,
  parseVolumeToMl,
  parseWeightToG,
} from 'src/utils/DataUtil';
import { AsyncName } from './AsyncName';

export function getOptionalUnknown(
  jsonObject: Record<string, unknown>,
  key: string
): unknown | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    return jsonObject[key];
  } else {
    return undefined;
  }
}

export function getOptionalObject(
  jsonObject: Record<string, unknown>,
  key: string
): object | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (result && typeof result === 'object') {
      return result;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getOptionalArray(
  jsonObject: Record<string, unknown>,
  key: string
): Array<unknown> | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (Array.isArray(result)) {
      return result as Array<unknown>;
    } else {
      return [result];
    }
  } else {
    return undefined;
  }
}

export function getArray(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: Array<unknown>
): Array<unknown> {
  return getOptionalArray(jsonObject, key) ?? def ?? [];
}

export function getOptionalString(
  jsonObject: Record<string, unknown>,
  key: string
): string | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'string' || typeof result === 'number') {
      return result as string;
    } else {
      console.warn(
        `getOptionalString is no string jsonObject: ${recordToString(
          jsonObject
        )}, key: ${key}, result: ${result as string}`
      );
      return result as string;
    }
  } else {
    return undefined;
  }
}

export function getString(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: string
): string {
  return getOptionalString(jsonObject, key) ?? def ?? '';
}

export function getOptionalNumber(
  jsonObject: Record<string, unknown>,
  key: string
): number | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'number') {
      return result;
    } else {
      console.warn(
        `getOptionalNumber is no number jsonObject: ${recordToString(
          jsonObject
        )}, key: ${key}, result: ${result as string}`
      );
      return result as number;
    }
  } else {
    return undefined;
  }
}

export function getNumber(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: number
): number {
  return getOptionalNumber(jsonObject, key) ?? def ?? 0;
}

export function getOptionalBoolean(
  jsonObject: Record<string, unknown>,
  key: string
): boolean | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'boolean') {
      return result;
    } else {
      console.warn(
        `getOptionalBoolean is no boolean jsonObject: ${recordToString(
          jsonObject
        )}, key: ${key}, result: ${result as string}`
      );
      return false;
    }
  } else {
    return undefined;
  }
}

export function getBoolean(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: boolean
): boolean {
  return getOptionalBoolean(jsonObject, key) ?? def ?? false;
}

export function getOptionalWeight(
  jsonObject: Record<string, unknown>,
  key: string
): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseWeightToG(field);
  } else {
    return undefined;
  }
}

export function getWeight(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: number
): number {
  return getOptionalWeight(jsonObject, key) ?? def ?? 0;
}

export function getOptionalVolume(
  jsonObject: Record<string, unknown>,
  key: string
): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseVolumeToMl(field);
  } else {
    return undefined;
  }
}

export function getVolume(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: number
): number {
  return getOptionalVolume(jsonObject, key) ?? def ?? 0;
}

export function getOptionalLength(
  jsonObject: Record<string, unknown>,
  key: string
): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseLengthToCm(field);
  } else {
    return undefined;
  }
}

export function getLength(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: number
): number {
  return getOptionalLength(jsonObject, key) ?? def ?? 0;
}

export function getOptionalAsyncName(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string
): AsyncName | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return new AsyncName(field, type);
  } else {
    return undefined;
  }
}

export function getOptionalTranslationString(
  jsonObject: Record<string, unknown>,
  key: string
): string | undefined {
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result !== 'object') {
      return result as string;
    } else {
      if (Array.isArray(result)) {
        return (<string[]>result)[0];
      }
      return (
        getOptionalString(result as Record<string, unknown>, 'str') ??
        getOptionalString(result as Record<string, unknown>, 'str_sp') ??
        getOptionalString(result as Record<string, unknown>, 'str_pl') ??
        getOptionalString(result as Record<string, unknown>, 'male') ??
        getOptionalString(result as Record<string, unknown>, 'female')
      );
    }
  } else {
    return undefined;
  }
}

export function getTranslationString(
  jsonObject: Record<string, unknown>,
  key: string,
  def?: string
): string {
  return getOptionalTranslationString(jsonObject, key) ?? def ?? '';
}

function recordToString(val: Record<string, unknown>): string {
  return val as unknown as string;
}
