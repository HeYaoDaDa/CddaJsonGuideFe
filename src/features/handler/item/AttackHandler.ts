import { getJsonItemsByItemType } from 'src/api';
import { AttackFeature } from 'src/features/type/item/Attack';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { isItem } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';

export class AttackFactory implements FeatureFactoryInterface {
  getFeatureHandler(): FeatureHandlerInterface<unknown> {
    return new AttackHandler() as FeatureHandlerInterface<unknown>;
  }
}

export class AttackHandler implements FeatureHandlerInterface<AttackFeature> {
  label = 'label.attack';
  validate = (jsonItem: JsonItem) => {
    return isItem(jsonItem.type);
  };
  getDatas = () =>
    getJsonItemsByItemType('item').then((jsonItems: JsonItem[]) => {
      const attackFeatures = new Array<AttackFeature>();
      jsonItems.forEach((jsonItem) => {
        if (this.validate(jsonItem)) {
          attackFeatures.push(new AttackFeature(jsonItem));
        }
      });
      return attackFeatures;
    });
  getColumns = () => [
    {
      name: 'name',
      label: i18n.global.t('label.name'),
      field: (row: AttackFeature) => row.name,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'mod',
      label: 'Mod',
      field: (row: AttackFeature) => row.mod,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'weapon_categories_required',
      label: 'label.weapon_categories_required',
      field: (row: AttackFeature) => row.weapon_category?.join(', '),
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'bashing',
      label: 'label.bashing',
      field: (row: AttackFeature) => row.bashing,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'cutting',
      label: 'label.cutting',
      field: (row: AttackFeature) => row.cutting,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'piercing',
      label: 'label.piercing',
      field: (row: AttackFeature) => row.piercing,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'to_hit',
      label: 'label.to_hit',
      field: (row: AttackFeature) => row.to_hit,
      required: true,
      sortable: true,
      hideInCard: true,
    },
    {
      name: 'baseMovesPerAttack',
      label: 'label.baseMovesPerAttack',
      field: (row: AttackFeature) => row.baseMovesPerAttack,
      required: true,
      sortable: true,
      hideInCard: true,
    },
  ];
}
