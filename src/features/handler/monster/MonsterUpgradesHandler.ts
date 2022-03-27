import { getJsonItemsByItemType } from 'src/api';
import { MonsterUpgradesFeature } from 'src/features/type/monster/MonsterUpgrades';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { isItem } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';

export class MonsterUpgradesFactory implements FeatureFactoryInterface {
  getFeatureHandler(): FeatureHandlerInterface<unknown> {
    return new MonsterUpgradesHandler() as FeatureHandlerInterface<unknown>;
  }
}

export class MonsterUpgradesHandler
  implements FeatureHandlerInterface<MonsterUpgradesFeature>
{
  label = 'label.uprades';
  validate = (jsonItem: JsonItem) => {
    return isItem(jsonItem.type);
  };
  getDatas = () =>
    getJsonItemsByItemType('item').then((jsonItems: JsonItem[]) => {
      const monsterUpgradesFeatures = new Array<MonsterUpgradesFeature>();
      jsonItems.forEach((jsonItem) => {
        if (this.validate(jsonItem)) {
          monsterUpgradesFeatures.push(new MonsterUpgradesFeature(jsonItem));
        }
      });
      return monsterUpgradesFeatures;
    });
  getColumns = () => [
    {
      name: 'name',
      label: i18n.global.t('label.name'),
      field: (row: MonsterUpgradesFeature) => row.name,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'mod',
      label: 'Mod',
      field: (row: MonsterUpgradesFeature) => row.mod,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'into_name',
      label: 'label.into_name',
      field: (row: MonsterUpgradesFeature) => row.into,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'into_group',
      label: 'label.into_group',
      field: (row: MonsterUpgradesFeature) => row.into_group,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'half_life',
      label: 'label.half_life',
      field: (row: MonsterUpgradesFeature) => row.half_life,
      required: true,
      sortable: true,
      hideInCard: true,
    },
  ];
}
