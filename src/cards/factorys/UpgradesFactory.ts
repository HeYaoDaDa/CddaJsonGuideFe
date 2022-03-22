import { getAllJsonItemByCon } from 'src/api';
import { getName } from 'src/utils/JsonItemUtil';
import { getModName } from 'src/utils/JsonItemUtil';
import { getJsonItems } from 'src/api/jsonItem';
import { i18n } from 'src/boot/i18n';
import { CardFactoryInterface, CardInterface } from 'src/type';

export class UpgradesFactory implements CardFactoryInterface {
  initCardByJsonItem(jsonItem: JsonItem): CardInterface | undefined {
    const upgradesCard = jsonItem.content as UpgradesCard;
    if (jsonItem && jsonItem.type === 'monster' && upgradesCard.upgrades) {
      const instance = new UpgradesCard();
      instance.upgrades = upgradesCard.upgrades;
      return instance;
    } else {
      return undefined;
    }
  }
  initCard(): CardInterface {
    return new UpgradesCard();
  }
}

export class UpgradesCard implements CardInterface {
  upgrades?: {
    half_life?: number;
    age_grow?: number;
    into?: string;
    into_group?: string;
  };
  label = 'label.uprades';
  getDatas = () =>
    getAllJsonItemByCon('monster', [
      {
        $match: {
          'content.upgrades': {
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
        const upgradesCard = <UpgradesCard>row.content;
        if (!row.tempVar) {
          row.tempVar = new Map<string, string>();
        }
        if (!row.tempVar.get(into_name) && upgradesCard.upgrades?.into) {
          row.tempVar.set(into_name, upgradesCard.upgrades.into);
          void getJsonItems('monster', upgradesCard.upgrades?.into).then(
            (jsonItems) => {
              if (row.tempVar && jsonItems && jsonItems.length > 0) {
                row.tempVar.set(into_name, getName(jsonItems[0]));
              }
            }
          );
        }
        return row.tempVar.get(into_name);
      },
      sortable: true,
    },
    {
      name: 'into_group',
      label: i18n.global.t('label.into_group'),
      field: (row: JsonItem) =>
        (<UpgradesCard>row.content).upgrades?.into_group,
      sortable: true,
    },
    {
      name: 'age_grow',
      label: i18n.global.t('label.age_grow'),
      field: (row: JsonItem) => (<UpgradesCard>row.content).upgrades?.age_grow,
      sortable: true,
    },
    {
      name: 'half_life',
      label: i18n.global.t('label.half_life'),
      field: (row: JsonItem) => (<UpgradesCard>row.content).upgrades?.half_life,
      sortable: true,
    },
  ];
}
