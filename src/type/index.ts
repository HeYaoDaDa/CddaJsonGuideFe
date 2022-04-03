import { Version } from './Version';
import {
  FeatureHandlerInterface,
  FeatureFactoryInterface,
  ColumnInterface,
} from './Feature';
import { SearchResultItem, TypeTreeNode } from './Common';
import { Field, FieldStyle } from './FieldType';

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
  ColumnInterface,
  SearchResultItem,
  TypeTreeNode,
  Field,
  FieldStyle,
};
