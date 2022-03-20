import { CardInterface, TableInterfact } from 'src/cards/CardInterface';
import { VNode, h } from 'vue';
import ReproductionCard from 'src/components/jsonItem/ReproductionCard.vue';

export class ReproductionCardClass implements CardInterface {
  baby_flags?: string[];
  reproduction?: {
    baby_monster: string;
    baby_count: number;
    baby_timer: number;
  };

  init(jsonItem: JsonItem): CardInterface | undefined {
    const reproductionCard = jsonItem.content as ReproductionCardClass;
    if (
      jsonItem &&
      jsonItem.type === 'monster' &&
      reproductionCard.reproduction
    ) {
      const instance = new ReproductionCardClass();
      instance.baby_flags = reproductionCard.baby_flags;
      instance.reproduction = reproductionCard.reproduction;
      return instance;
    } else {
      return undefined;
    }
  }

  rending(): VNode {
    return h(ReproductionCard, { reproductionCard: this });
  }

  getTable(): TableInterfact {
    throw new Error('Method not implemented.');
  }
}
