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
  feature: Map<string, object>;
}
