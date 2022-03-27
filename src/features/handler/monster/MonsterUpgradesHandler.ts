import { getJsonItemListByJsonId, getJsonItemsByItemType } from 'src/api';
import {
  MonsterUpgradesContent,
  MonsterUpgradesFeature,
} from 'src/features/type/monster/MonsterUpgrades';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { i18n } from 'src/boot/i18n';
import { getName, getModName } from 'src/utils/JsonItemUtil';

export class MonsterUpgradesFactory implements FeatureFactoryInterface {
  featureKey = 'monsterUpgrades';
  getFeatureHandler(): FeatureHandlerInterface {
    return new MonsterUpgradesHandler(this.featureKey);
  }
}

export class MonsterUpgradesHandler implements FeatureHandlerInterface {
  featureKey: string;
  label = 'label.uprades';
  validate = (jsonItem: JsonItem) => {
    return (
      jsonItem.type === 'monster' &&
      (<MonsterUpgradesContent>jsonItem.content).upgrades?.half_life !=
        undefined
    );
  };
  getDatas = () =>
    getJsonItemsByItemType('monster', [
      {
        $match: {
          'content.upgrades.half_life': {
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
        const monsterUparadesFeature = <MonsterUpgradesFeature>(
          row.feature.get(this.featureKey)
        );
        if (!monsterUparadesFeature.into_name && monsterUparadesFeature.into) {
          monsterUparadesFeature.into_name = monsterUparadesFeature.into;
          void getJsonItemListByJsonId(
            'monster',
            monsterUparadesFeature.into
          ).then((jsonItems) => {
            if (jsonItems && jsonItems.length > 0) {
              monsterUparadesFeature.into_name = getName(jsonItems[0]);
            }
          });
        }
        return monsterUparadesFeature.into_name;
      },
      route: (row: JsonItem) => {
        return {
          name: 'jsonItem',
          params: {
            jsonType: row.type,
            jsonId: (<MonsterUpgradesFeature>row.feature.get(this.featureKey))
              .into,
          },
        };
      },
      sortable: true,
    },
    {
      name: 'into_group',
      label: i18n.global.t('label.into_group'),
      field: (row: JsonItem) =>
        (<MonsterUpgradesFeature>row.feature.get(this.featureKey)).into_group,
      sortable: true,
    },
    {
      name: 'half_life',
      label: i18n.global.t('label.half_life'),
      field: (row: JsonItem) =>
        (<MonsterUpgradesFeature>row.feature.get(this.featureKey)).half_life,
      required: true,
      sortable: true,
    },
  ];
  initJsonItemFeature = (jsonItem: JsonItem) => {
    if (!jsonItem.feature) {
      jsonItem.feature = new Map<string, object>();
    }
    jsonItem.feature.set(this.featureKey, new MonsterUpgradesFeature(jsonItem));
  };
  constructor(featureKey: string) {
    this.featureKey = featureKey;
  }
}
