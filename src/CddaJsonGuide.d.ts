declare interface SelectOption {
  label: string;
  value: string;
}

declare interface Version {
  id: string;
  releaseId: string;
  releaseDescribe: string;
  targetCommit: string;
  branch: number;
  createDate: Date;
  publishDate: Date;
  tagName: string;
  tagMessage: string;
  tagDate: Date;
}

declare interface Mod {
  id: string;
  name: string;
  description: string;
  category: string;
}
declare interface JsonItem {
  _id: string;
  jsonId: string;
  type: string;
  isOriginal: boolean;
  startVersion: Version;
  endVersion: Version;
  language: string;
  path: string;
  mod: string;
  content: object;
  originalContent: object;
  tempVar?: Map<string, string>;
}

declare class TypeTreeNode {
  name: string;
  id: string;
  sub: TypeTreeNode[];
}

declare interface SearchResultItem {
  type: string;
  jsonId: string;
  mod: string;
  name: string;
}

declare interface ColumnInterface {
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
}
declare interface CardInterface {
  label: string;
  getDatas: () => Promise<JsonItem[]>;
  getColumns: () => ColumnInterface[];
}
declare interface CardFactoryInterface {
  initCardByJsonItem(jsonItem: JsonItem): CardInterface | undefined;
  initCard(): CardInterface;
}
