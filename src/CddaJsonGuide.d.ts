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
declare interface JsonItem {
  id: string;
  jsonId: string;
  type: string;
  isOriginal: boolean;
  startVersion: Version;
  endVersion: Version;
  language: string;
  path: string;
  mod: string;
  content: object;
}

declare class TypeTreeNode {
  name: string;
  id: string;
  sub: TypeTreeNode[];
  constructor(name: string, id: string, sub: TypeTreeNode[]) {
    this.name = name;
    this.id = id;
    this.sub = sub;
  }
}
