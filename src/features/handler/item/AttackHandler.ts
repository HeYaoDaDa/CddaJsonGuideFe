import { getJsonItemsByItemType } from 'src/api';
import { AttackFeature } from 'src/features/type/item/Attack';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { getModName, getName, isItem } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';

export class AttackFactory implements FeatureFactoryInterface {
  featureKey = 'attack';
  getFeatureHandler(): FeatureHandlerInterface {
    return new AttackHandler(this.featureKey);
  }
}

export class AttackHandler implements FeatureHandlerInterface {
  featureKey: string;
  label = 'label.attack';
  validate = (jsonItem: JsonItem) => {
    return isItem(jsonItem.type);
  };
  getDatas = () =>
    getJsonItemsByItemType('item').then((jsonItems: JsonItem[]) => {
      jsonItems.forEach((jsonItem) => {
        if (this.validate(jsonItem)) {
          this.initJsonItemFeature(jsonItem);
        }
      });
      return jsonItems;
    });
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
      name: 'weapon_categories_required',
      label: i18n.global.t('label.weapon_categories_required'),
      field: (row: JsonItem) =>
        (<AttackFeature>row.feature.get(this.featureKey)).weapon_category?.join(
          ', '
        ),
      required: true,
      sortable: true,
    },
    {
      name: 'bashing',
      label: i18n.global.t('label.bash'),
      field: (row: JsonItem) =>
        (<AttackFeature>row.feature.get(this.featureKey)).bashing,
      required: true,
      sortable: true,
    },
    {
      name: 'cutting',
      label: i18n.global.t('label.cut'),
      field: (row: JsonItem) =>
        (<AttackFeature>row.feature.get(this.featureKey)).cutting,
      required: true,
      sortable: true,
    },
    {
      name: 'piercing',
      label: i18n.global.t('label.stab'),
      field: (row: JsonItem) =>
        (<AttackFeature>row.feature.get(this.featureKey)).piercing,
      required: true,
      sortable: true,
    },
    {
      name: 'to_hit',
      label: i18n.global.t('label.to_hit'),
      field: (row: JsonItem) =>
        (<AttackFeature>row.feature.get(this.featureKey)).to_hit,
      required: true,
      sortable: true,
    },
    {
      name: 'baseMovesPerAttack',
      label: i18n.global.t('label.base_moves_per_attack'),
      field: (row: JsonItem) =>
        (<AttackFeature>row.feature.get(this.featureKey)).baseMovesPerAttack,
      required: true,
      sortable: true,
    },
  ];
  initJsonItemFeature = (jsonItem: JsonItem) => {
    if (!jsonItem.feature) {
      jsonItem.feature = new Map<string, object>();
    }
    jsonItem.feature.set(this.featureKey, new AttackFeature(jsonItem));
  };
  constructor(featureKey: string) {
    this.featureKey = featureKey;
  }
}
