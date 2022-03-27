import { getJsonItemsByItemType } from 'src/api';
import {
  MonsterUpgradesContent,
  MonsterUpgradesFeature,
} from 'src/features/type/monster/MonsterUpgrades';
import { FeatureFactoryInterface, FeatureHandlerInterface } from 'src/type';
import { i18n } from 'src/boot/i18n';
import { router } from 'src/router';

export class MonsterUpgradesFactory implements FeatureFactoryInterface {
  getFeatureHandler(): FeatureHandlerInterface<unknown> {
    return new MonsterUpgradesHandler() as FeatureHandlerInterface<unknown>;
  }
}

export class MonsterUpgradesHandler
  implements FeatureHandlerInterface<MonsterUpgradesFeature>
{
  rowClick = (row: MonsterUpgradesFeature) => {
    void router.push({
      name: 'jsonItem',
      params: { jsonType: row.type, jsonId: row.jsonId },
    });
  };
  convertToFeature = (jsonItem: JsonItem) =>
    new MonsterUpgradesFeature(jsonItem);
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
      sortable: true,
    },
    {
      name: 'into_group',
      label: 'label.into_group',
      field: (row: MonsterUpgradesFeature) => row.into_group,
      sortable: true,
    },
    {
      name: 'half_life',
      label: 'label.half_life',
      field: (row: MonsterUpgradesFeature) => row.half_life,
      required: true,
      sortable: true,
    },
  ];
}
