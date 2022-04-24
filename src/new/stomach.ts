import { VitaminId } from './id';

export interface Nutrients {
  calories: number;
  vitamins: Map<VitaminId, [string, number]>;
}
