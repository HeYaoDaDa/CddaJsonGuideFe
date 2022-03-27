import { RouteLocationRaw } from 'vue-router';
export interface ColumnInterface {
  name: string;
  label: string;
  field: ((row: JsonItem) => string | number | undefined) | number | undefined;
  required?: boolean;
  sortable?: boolean;
  hideInCard?: boolean;
  route?: (row: JsonItem) => RouteLocationRaw;
}
export interface FeatureHandlerInterface {
  featureKey: string;
  label: string;
  validate: (jsonItem: JsonItem) => boolean;
  getDatas: () => Promise<JsonItem[]>;
  getColumns: () => ColumnInterface[];
  initJsonItemFeature: (jsonItem: JsonItem) => void;
}
export interface FeatureFactoryInterface {
  featureKey: string;
  getFeatureHandler(): FeatureHandlerInterface;
}
