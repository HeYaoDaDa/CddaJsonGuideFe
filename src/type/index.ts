import { RouteLocationRaw } from 'vue-router';

export interface ColumnInterface {
  name: string;
  label: string;
  field:
    | ((row: JsonItem) => string | number | undefined)
    | keyof JsonItem
    | number
    | undefined;
  required?: boolean;
  sortable?: boolean;
  format?: (val: unknown, row?: JsonItem) => unknown;
  hideInCard?: boolean;
  route?: (row: JsonItem) => RouteLocationRaw;
}
export interface CardInterface {
  label: string;
  getDatas: () => Promise<JsonItem[]>;
  getColumns: () => ColumnInterface[];
}
export interface CardFactoryInterface {
  initCardByJsonItem(jsonItem: JsonItem): CardInterface | undefined;
  initCard(): CardInterface;
}
