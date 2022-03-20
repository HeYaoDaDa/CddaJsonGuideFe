import { VNode } from 'vue';

export interface TableInterfact {
  label: string;
  data: CardInterface[];
  columns: [];
}

export interface CardInterface {
  init(jsonItem: JsonItem): CardInterface | undefined;
  rending(): VNode;
  getTable(): TableInterfact;
}
