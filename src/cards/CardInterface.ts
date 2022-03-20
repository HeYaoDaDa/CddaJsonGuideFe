import { VNode } from 'vue';

export interface TableInterfact {
  label: string;
  data: JsonItem[];
  columns: object[];
}

export interface CardInterface {
  init(jsonItem: JsonItem): CardInterface | undefined;
  rending(): VNode;
  getTable(): Promise<TableInterfact>;
}
