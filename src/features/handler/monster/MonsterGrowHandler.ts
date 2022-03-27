import { getJsonItemsByItemType } from 'src/api';
import { MonsterGrowFeature } from 'src/features/type/monster/MonsterGrow';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { isItem } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';

export class MonsterGrowFactory implements FeatureFactoryInterface {
  getFeatureHandler(): FeatureHandlerInterface<unknown> {
    return new MonsterUpgradesHandler() as FeatureHandlerInterface<unknown>;
  }
}

export class MonsterUpgradesHandler
  implements FeatureHandlerInterface<MonsterGrowFeature>
{
  label = 'label.uprades';
  validate = (jsonItem: JsonItem) => {
    return isItem(jsonItem.type);
  };
  getDatas = () =>
    getJsonItemsByItemType('item').then((jsonItems: JsonItem[]) => {
      const monsterUpgradesFeatures = new Array<MonsterGrowFeature>();
      jsonItems.forEach((jsonItem) => {
        if (this.validate(jsonItem)) {
          monsterUpgradesFeatures.push(new MonsterGrowFeature(jsonItem));
        }
      });
      return monsterUpgradesFeatures;
    });
  getColumns = () => [
    {
      name: 'name',
      label: i18n.global.t('label.name'),
      field: (row: MonsterGrowFeature) => row.name,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'mod',
      label: 'Mod',
      field: (row: MonsterGrowFeature) => row.mod,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'into_name',
      label: 'label.into_name',
      field: (row: MonsterGrowFeature) => row.into,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'into_group',
      label: 'label.into_group',
      field: (row: MonsterGrowFeature) => row.into_group,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'age_grow',
      label: 'label.age_grow',
      field: (row: MonsterGrowFeature) => row.age_grow,
      required: true,
      sortable: true,
      hideInCard: true,
    },
  ];
}