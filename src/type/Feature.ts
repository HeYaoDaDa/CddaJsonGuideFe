import { RouteLocationRaw } from 'vue-router';
export interface ColumnInterface<T> {
  name: string;
  label: string;
  field:
    | ((row: T) => string | number | undefined)
    | keyof T
    | number
    | undefined;
  required?: boolean;
  sortable?: boolean;
  format?: (val: unknown, row?: T) => unknown;
  hideInCard?: boolean;
  route?: (row: JsonItem) => RouteLocationRaw;
}
export interface FeatureHandlerInterface<T> {
  label: string;
  validate: (jsonItem: JsonItem) => boolean;
  getDatas: () => Promise<T[]>;
  getColumns: () => ColumnInterface<T>[];
}
export interface FeatureFactoryInterface {
  getFeatureHandler(): FeatureHandlerInterface<unknown>;
}
