import { RouteLocationRaw } from 'vue-router';

export interface SearchResultItem {
  type: string;
  jsonId: string;
  mod: string;
  name: string;
}

export interface TypeTreeNode {
  name: string;
  id: string;
  sub: TypeTreeNode[];
  route?: RouteLocationRaw;
}
