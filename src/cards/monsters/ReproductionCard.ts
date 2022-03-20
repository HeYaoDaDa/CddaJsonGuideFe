import { CardInterface, TableInterfact } from 'src/cards/CardInterface';
import { VNode, h } from 'vue';
import { getAllJsonItemByCon } from 'src/api';
import ReproductionCard from 'src/components/jsonItem/ReproductionCard.vue';
import { getName } from 'src/utils/JsonItemUtil';

export class ReproductionCardClass implements CardInterface {
  baby_flags?: string[];
  reproduction?: {
    baby_monster: string;
    baby_egg: string;
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

  getTable(): Promise<TableInterfact> {
    const pipeline = [
      {
        $match: {
          'content.reproduction': {
            $exists: true,
          },
        },
      },
    ];
    return getAllJsonItemByCon('monster', pipeline).then((jsonItems) => {
      const tableInterfact = {
        label: 'reproduction',
        data: new Array<JsonItem>(),
      } as TableInterfact;
      jsonItems.forEach((jsonItem) => {
        const reproductionCard = new ReproductionCardClass().init(jsonItem);
        if (reproductionCard) {
          tableInterfact.data.push(jsonItem);
        }
      });
      tableInterfact.columns = [
        {
          name: 'name',
          label: 'label.name',
          field: (row: JsonItem) => getName(row),
          required: true,
          sortable: true,
        },
        {
          name: 'baby_flags',
          label: 'label.baby_flags',
          field: (row: JsonItem) =>
            (<ReproductionCardClass>row.content).baby_flags,
          required: true,
          sortable: true,
          format: (val?: string[]) => {
            if (val) {
              return val.join(',');
            }
            return '';
          },
        },
        {
          name: 'baby_monster',
          label: 'label.baby_monster',
          field: (row: JsonItem) =>
            (<ReproductionCardClass>row.content).reproduction?.baby_monster,
          required: true,
          sortable: true,
        },
        {
          name: 'baby_egg',
          label: 'label.baby_egg',
          field: (row: JsonItem) =>
            (<ReproductionCardClass>row.content).reproduction?.baby_egg,
          required: true,
          sortable: true,
        },
        {
          name: 'baby_count',
          label: 'label.baby_count',
          field: (row: JsonItem) =>
            (<ReproductionCardClass>row.content).reproduction?.baby_count,
          required: true,
          sortable: true,
        },
        {
          name: 'baby_timer',
          label: 'label.baby_timer',
          field: (row: JsonItem) =>
            (<ReproductionCardClass>row.content).reproduction?.baby_timer,
          required: true,
          sortable: true,
        },
      ];
      console.debug(
        'ReproductionCardClass.getAllJsonItemByCon.data ',
        tableInterfact.data
      );
      return tableInterfact;
    });
  }
}
