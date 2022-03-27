import { getJsonItemListByJsonId, getJsonItemsByItemType } from 'src/api';
import {
  MonsterGrowContent,
  MonsterGrowFeature,
} from 'src/features/type/monster/MonsterGrow';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { i18n } from 'src/boot/i18n';
import { getModName, getName } from 'src/utils/JsonItemUtil';

export class MonsterGrowFactory implements FeatureFactoryInterface {
  featureKey = 'monsterGrow';
  getFeatureHandler(): FeatureHandlerInterface {
    return new MonsterUpgradesHandler(this.featureKey);
  }
}

export class MonsterUpgradesHandler implements FeatureHandlerInterface {
  featureKey: string;
  label = 'label.grow';
  validate = (jsonItem: JsonItem) => {
    return (
      jsonItem.type === 'monster' &&
      (<MonsterGrowContent>jsonItem.content).upgrades?.age_grow != undefined
    );
  };
  getDatas = () =>
    getJsonItemsByItemType('monster', [
      {
        $match: {
          'content.upgrades.age_grow': {
            $exists: true,
          },
        },
      },
    ]).then((jsonItems: JsonItem[]) => {
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
      name: 'into_name',
      label: i18n.global.t('label.into_name'),
      field: (row: JsonItem) => {
        const monsterGrowFeature = <MonsterGrowFeature>(
          row.feature.get(this.featureKey)
        );
        if (!monsterGrowFeature.into_name && monsterGrowFeature.into) {
          monsterGrowFeature.into_name = monsterGrowFeature.into;
          void getJsonItemListByJsonId('monster', monsterGrowFeature.into).then(
            (jsonItems) => {
              if (jsonItems && jsonItems.length > 0) {
                monsterGrowFeature.into_name = getName(jsonItems[0]);
              }
            }
          );
        }
        return monsterGrowFeature.into_name;
      },
      route: (row: JsonItem) => {
        return {
          name: 'jsonItem',
          params: {
            jsonType: row.type,
            jsonId: (<MonsterGrowFeature>row.feature.get(this.featureKey)).into,
          },
        };
      },
      sortable: true,
    },
    {
      name: 'into_group',
      label: i18n.global.t('label.into_group'),
      field: (row: JsonItem) =>
        (<MonsterGrowFeature>row.feature.get(this.featureKey)).into_group,
      sortable: true,
    },
    {
      name: 'age_grow',
      label: i18n.global.t('label.age_grow'),
      field: (row: JsonItem) =>
        (<MonsterGrowFeature>row.feature.get(this.featureKey)).age_grow,
      required: true,
      sortable: true,
    },
  ];
  initJsonItemFeature = (jsonItem: JsonItem) => {
    if (!jsonItem.feature) {
      jsonItem.feature = new Map<string, object>();
    }
    jsonItem.feature.set(this.featureKey, new MonsterGrowFeature(jsonItem));
  };
  constructor(featureKey: string) {
    this.featureKey = featureKey;
  }
}
