import { getJsonItemsByItemType } from 'src/api';
import { ReproductionFeature } from 'src/features/type/item/Reproduction';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { isItem } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';

export class ReproductionFactory implements FeatureFactoryInterface {
  getFeatureHandler(): FeatureHandlerInterface<unknown> {
    return new ReproductionHandler() as FeatureHandlerInterface<unknown>;
  }
}

export class ReproductionHandler
  implements FeatureHandlerInterface<ReproductionFeature>
{
  label = 'label.uprades';
  validate = (jsonItem: JsonItem) => {
    return isItem(jsonItem.type);
  };
  getDatas = () =>
    getJsonItemsByItemType('item').then((jsonItems: JsonItem[]) => {
      const monsterUpgradesFeatures = new Array<ReproductionFeature>();
      jsonItems.forEach((jsonItem) => {
        if (this.validate(jsonItem)) {
          monsterUpgradesFeatures.push(new ReproductionFeature(jsonItem));
        }
      });
      return monsterUpgradesFeatures;
    });
  getColumns = () => [
    {
      name: 'name',
      label: i18n.global.t('label.name'),
      field: (row: ReproductionFeature) => row.name,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'mod',
      label: 'Mod',
      field: (row: ReproductionFeature) => row.mod,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'baby_flags',
      label: 'label.baby_flags',
      field: (row: ReproductionFeature) => row.baby_flags?.join(', '),
      required: true,
      sortable: true,
    },
    {
      name: 'baby_monster',
      label: 'label.baby_monster',
      field: (row: ReproductionFeature) => row.reproduction?.baby_monster,
      required: true,
      sortable: true,
    },
    {
      name: 'baby_egg',
      label: 'label.baby_egg',
      field: (row: ReproductionFeature) => row.reproduction?.baby_egg,
      required: true,
      sortable: true,
    },
    {
      name: 'baby_count',
      label: 'label.baby_count',
      field: (row: ReproductionFeature) => row.reproduction?.baby_count,
      required: true,
      sortable: true,
    },
    {
      name: 'baby_timer',
      label: 'label.baby_timer',
      field: (row: ReproductionFeature) => row.reproduction?.baby_timer,
      required: true,
      sortable: true,
    },
  ];
}
