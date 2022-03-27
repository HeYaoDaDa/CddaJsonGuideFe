import { RouteLocationRaw } from 'vue-router';
import { Version } from './Version';
import { FeatureHandlerInterface, FeatureFactoryInterface } from './Feature';
import { SearchResultItem } from './Common';

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

export interface MaterialContent {
  bash_resist: number;
  cut_resist: number;
  bullet_resist: number;
  acid_resist: number;
  elec_resist: number;
}

export {
  Version,
  FeatureHandlerInterface,
  FeatureFactoryInterface,
  SearchResultItem,
};
