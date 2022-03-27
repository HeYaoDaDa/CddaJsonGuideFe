import { getJsonItemListByJsonId, getJsonItemsByItemType } from 'src/api';
import { ReproductionFeature } from 'src/features/type/monster/Reproduction';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { getModName, getName, isItem } from 'src/utils/JsonItemUtil';
import { i18n } from 'src/boot/i18n';

export class ReproductionFactory implements FeatureFactoryInterface {
  featureKey = 'reproduction';
  getFeatureHandler(): FeatureHandlerInterface {
    return new ReproductionHandler(this.featureKey);
  }
}

export class ReproductionHandler implements FeatureHandlerInterface {
  featureKey: string;
  label = 'label.reproduction';
  validate = (jsonItem: JsonItem) => {
    return (
      !isItem(jsonItem.type) &&
      (<ReproductionFeature>jsonItem.content).reproduction != undefined
    );
  };
  getDatas = () =>
    getJsonItemsByItemType('monster', [
      {
        $match: {
          'content.reproduction': {
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
      name: 'baby_flags',
      label: i18n.global.t('label.baby_flags'),
      field: (row: JsonItem) =>
        (<ReproductionFeature>row.feature.get(this.featureKey)).baby_flags
          ?.map((flag) => i18n.global.t(flag.toLowerCase()))
          .join(', '),
      required: true,
      sortable: true,
    },
    {
      name: 'baby_monster',
      label: i18n.global.t('label.baby_monster'),
      field: (row: JsonItem) => {
        const reproductionFeature = <ReproductionFeature>(
          row.feature.get(this.featureKey)
        );
        if (
          reproductionFeature.reproduction &&
          !reproductionFeature.reproduction.baby_monster_name &&
          reproductionFeature.reproduction.baby_monster
        ) {
          reproductionFeature.reproduction.baby_monster_name =
            reproductionFeature.reproduction.baby_monster;
          void getJsonItemListByJsonId(
            'monster',
            reproductionFeature.reproduction.baby_monster
          ).then((jsonItems) => {
            if (
              reproductionFeature.reproduction &&
              jsonItems &&
              jsonItems.length > 0
            ) {
              reproductionFeature.reproduction.baby_monster_name = getName(
                jsonItems[0]
              );
            }
          });
        }
        return reproductionFeature.reproduction?.baby_monster_name;
      },
      route: (row: JsonItem) => {
        return {
          name: 'jsonItem',
          params: {
            jsonType: row.type,
            jsonId: (<ReproductionFeature>row.feature.get(this.featureKey))
              .reproduction?.baby_monster,
          },
        };
      },
      sortable: true,
    },
    {
      name: 'baby_egg',
      label: i18n.global.t('label.baby_egg'),
      field: (row: JsonItem) => {
        const reproductionFeature = <ReproductionFeature>(
          row.feature.get(this.featureKey)
        );
        if (
          reproductionFeature.reproduction &&
          !reproductionFeature.reproduction.baby_egg_name &&
          reproductionFeature.reproduction.baby_egg
        ) {
          reproductionFeature.reproduction.baby_egg_name =
            reproductionFeature.reproduction.baby_egg;
          void getJsonItemListByJsonId(
            'item',
            reproductionFeature.reproduction.baby_egg
          ).then((jsonItems) => {
            if (
              reproductionFeature.reproduction &&
              jsonItems &&
              jsonItems.length > 0
            ) {
              reproductionFeature.reproduction.baby_egg_name = getName(
                jsonItems[0]
              );
            }
          });
        }
        return reproductionFeature.reproduction?.baby_egg_name;
      },
      route: (row: JsonItem) => {
        return {
          name: 'jsonItem',
          params: {
            jsonType: 'item',
            jsonId: (<ReproductionFeature>row.feature.get(this.featureKey))
              .reproduction?.baby_egg,
          },
        };
      },
      sortable: true,
    },
    {
      name: 'baby_count',
      label: i18n.global.t('label.baby_count'),
      field: (row: JsonItem) =>
        (<ReproductionFeature>row.feature.get(this.featureKey)).reproduction
          ?.baby_count,
      required: true,
      sortable: true,
    },
    {
      name: 'baby_timer',
      label: i18n.global.t('label.baby_timer'),
      field: (row: JsonItem) =>
        (<ReproductionFeature>row.feature.get(this.featureKey)).reproduction
          ?.baby_timer,
      required: true,
      sortable: true,
    },
  ];
  initJsonItemFeature = (jsonItem: JsonItem) => {
    if (!jsonItem.feature) {
      jsonItem.feature = new Map<string, object>();
    }
    jsonItem.feature.set(this.featureKey, new ReproductionFeature(jsonItem));
  };
  constructor(featureKey: string) {
    this.featureKey = featureKey;
  }
}
