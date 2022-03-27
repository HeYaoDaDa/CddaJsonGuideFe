import { getJsonItemListByJsonId, getJsonItemsByItemType } from 'src/api';
import { getName } from 'src/utils/JsonItemUtil';
import { getModName } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';
import { CardFactoryInterface, CardInterface } from 'src/type';

export class MonsterUpgradesFactory implements CardFactoryInterface {
  initCardByJsonItem(jsonItem: JsonItem): CardInterface | undefined {
    const upgradesCard = jsonItem.content as MonsterUpgradesCard;
    if (
      jsonItem &&
      jsonItem.type === 'monster' &&
      upgradesCard.upgrades?.half_life
    ) {
      const instance = new MonsterUpgradesCard();
      instance.upgrades = upgradesCard.upgrades;
      return instance;
    } else {
      return undefined;
    }
  }
  initCard(): CardInterface {
    return new MonsterUpgradesCard();
  }
}

export class MonsterUpgradesCard implements CardInterface {
  upgrades?: {
    half_life?: number;
    into?: string;
    into_group?: string;
  };
  label = 'label.uprades';
  getDatas = () =>
    getJsonItemsByItemType('monster', [
      {
        $match: {
          'content.upgrades.half_life': {
            $exists: true,
          },
        },
      },
    ]);
  getColumns = () => [
    {
      name: 'name',
      label: i18n.global.t('label.name'),
      field: (row: JsonItem) => getName(row),
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'mod',
      label: 'Mod',
      field: (row: JsonItem) => getModName(row.mod),
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'into_name',
      label: i18n.global.t('label.into_name'),
      field: (row: JsonItem): string | undefined => {
        const into_name = 'into_name';
        const upgradesCard = <MonsterUpgradesCard>row.content;
        if (!row.tempVar) {
          row.tempVar = new Map<string, string>();
        }
        if (!row.tempVar.get(into_name) && upgradesCard.upgrades?.into) {
          row.tempVar.set(into_name, upgradesCard.upgrades.into);
          void getJsonItemListByJsonId(
            'monster',
            upgradesCard.upgrades?.into
          ).then((jsonItems) => {
            if (row.tempVar && jsonItems && jsonItems.length > 0) {
              row.tempVar.set(into_name, getName(jsonItems[0]));
            }
          });
        }
        return row.tempVar.get(into_name);
      },
      sortable: true,
      route: (row: JsonItem) => {
        const upgradesCard = <MonsterUpgradesCard>row.content;
        return {
          name: 'jsonItem',
          params: { jsonType: 'monster', jsonId: upgradesCard.upgrades?.into },
        };
      },
    },
    {
      name: 'into_group',
      label: i18n.global.t('label.into_group'),
      field: (row: JsonItem) =>
        (<MonsterUpgradesCard>row.content).upgrades?.into_group,
      sortable: true,
    },
    {
      name: 'half_life',
      label: i18n.global.t('label.half_life'),
      field: (row: JsonItem) =>
        (<MonsterUpgradesCard>row.content).upgrades?.half_life,
      sortable: true,
      require: true,
    },
  ];
}
