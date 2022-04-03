import { RouteLocationRaw } from 'vue-router';

export enum FieldStyle {
  OBJECT,
  STRING,
}

export interface Field {
  label?: string;
  content: string | Field[] | (() => string);
  // only content is Field[], default is OBJECT.
  style?: FieldStyle;
  // only content is string.
  contentRoute?: RouteLocationRaw;
  // only label is exist.
  labelRoute?: RouteLocationRaw;
  // TODO only content is Field[]
  subNoLabel?: boolean;
}
