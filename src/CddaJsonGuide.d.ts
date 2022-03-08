declare interface SelectOption {
  label: string;
  value: string;
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
