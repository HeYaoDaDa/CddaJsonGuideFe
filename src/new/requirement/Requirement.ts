import { i18n } from 'src/boot/i18n';
import MyField from 'src/new/components/MyField.vue';
import MyText from 'src/new/components/MyText/MyText.vue';
import { isEmpty, isNotEmpty } from 'src/utils';
import { h, VNode } from 'vue';
import { AsyncName } from '../AsyncName';
import { getNumber, getOptionalArray, getOptionalAsyncName } from '../JsonUtil';
import { SuperData } from '../SuperData';
import { CddaType } from '../type';

export class Requirement extends SuperData<RequirementInterface> {
  constructor(value: object | undefined) {
    super(value);
    if (value && this.validateValue(value)) {
      this.parseJson(value);
    }
  }

  getView(): VNode[] {
    const result: VNode[] = [];
    const data = this.data;
    result.push(toolsField(), componentField());

    return result;

    function toolsField() {
      const toolViews: VNode[] = [];
      data.qualities.forEach((qualitie) => {
        toolViews.push(
          h('li', {}, [
            h(MyText, {
              content: qualitie.name.getName(),
              route: qualitie.name.route,
            }),
            h(MyText, {
              content: `(${qualitie.level}) x ${qualitie.amount}`,
            }),
          ])
        );
      });
      data.tools.forEach((toolArray) => {
        toolViews.push(
          h(
            'li',
            {},
            (() => {
              const temp: VNode[] = [];
              toolArray.forEach((tool, i, a) => {
                temp.push(
                  h(MyText, {
                    content: tool.name.getName(),
                    route: tool.name.route,
                  })
                );
                if (tool.charge > 0) {
                  temp.push(
                    h(MyText, {
                      content: `(${tool.charge})`,
                    })
                  );
                }
                if (i < a.length - 1) {
                  temp.push(
                    h(MyText, {
                      content: ` ${i18n.global.t('or')} `,
                    })
                  );
                }
              });
              return temp;
            })()
          )
        );
      });
      return h(MyField, { label: 'tool', ul: true }, () => toolViews);
    }

    function componentField() {
      return h(MyField, { label: 'component', ul: true }, () =>
        data.components.map((componentArray) =>
          h(
            'li',
            (() => {
              const temp: VNode[] = [];
              componentArray.forEach((component, i, a) => {
                temp.push(
                  h(MyText, {
                    content: component.name.getName(),
                    route: component.name.route,
                  })
                );
                temp.push(
                  h(MyText, {
                    content: `x${component.amount}`,
                  })
                );
                if (i < a.length - 1) {
                  temp.push(
                    h(MyText, {
                      content: ` ${i18n.global.t('or')} `,
                    })
                  );
                }
              });
              return temp;
            })()
          )
        )
      );
    }
  }

  private parseJson(value: unknown) {
    const jsonObject = value as Record<string, unknown>;
    const data = this.data;

    data.qualities = [];
    data.tools = [];
    data.components = [];
    data.using = [];

    const qualitieObjects = getOptionalArray(jsonObject, 'qualities');
    if (qualitieObjects) {
      data.qualities = qualitieObjects.map((qualitieObject) => {
        const temp = qualitieObject as Record<string, unknown>;
        const qualitie = {} as RequirementQualitie;
        qualitie.name = getOptionalAsyncName(temp, 'id', CddaType.quality) ?? ({} as AsyncName);
        qualitie.level = getNumber(temp, 'levle', 1);
        qualitie.amount = getNumber(temp, 'amount', 1);
        return qualitie;
      });
    }
    const toolObjects = getOptionalArray(jsonObject, 'tools');
    if (toolObjects) {
      data.tools = toolObjects.map((toolObjectList) => {
        return (<unknown[]>toolObjectList).map((toolObject) => {
          const temp = toolObject as [string, number, string | undefined];
          const tool = {} as RequirementTool;
          tool.name = new AsyncName(temp[0], CddaType.item);
          tool.charge = temp[1];
          tool.isList = temp[2] !== undefined && temp[2].toLowerCase() === 'list';
          return tool;
        });
      });
    }
    const componentObjects = getOptionalArray(jsonObject, 'components');
    if (componentObjects) {
      data.components = componentObjects.map((componentObjectList) => {
        return (<unknown[]>componentObjectList).map((componentObject) => {
          const temp = componentObject as [string, number, string | undefined];
          const component = {} as RequirementComponent;
          component.name = new AsyncName(temp[0], CddaType.item);
          component.amount = temp[1];
          if (temp[2]) {
            if (temp[2].toLowerCase() === 'list') {
              component.isList = true;
            } else if (temp[2].toLowerCase() === 'no_recover') {
              component.norecoverable = true;
            }
          }
          return component;
        });
      });
    }
    const useObjects = getOptionalArray(jsonObject, 'using');
    if (useObjects) {
      data.using = useObjects.map((useObject) => {
        const temp = useObject as [string, number];
        const use = {} as RequirementUsing;
        use.name = new AsyncName(temp[0], CddaType.requirement);
        use.count = temp[1];
        return use;
      });
    }
  }

  public async load() {
    const data = this.data;

    data.qualities?.filter((qualitie) => {
      if (qualitie.isList) {
        data.using?.push({
          name: new AsyncName(qualitie.name.value.id, CddaType.requirement),
          count: qualitie.amount,
        });
      }
      return !qualitie.isList;
    });

    data.tools?.forEach((toolList, i, a) => {
      a[i] = toolList.filter((tool) => {
        if (tool.isList) {
          data.using?.push({
            name: new AsyncName(tool.name.value.id, CddaType.requirement),
            count: 1,
          });
        }
        return !tool.isList;
      });
    });
    data.tools = data.tools?.filter((toolList) => isNotEmpty(toolList));

    data.components?.forEach((componentList, i, a) => {
      a[i] = componentList.filter((component) => {
        if (component.isList) {
          data.using?.push({
            name: new AsyncName(component.name.value.id, CddaType.requirement),
            count: component.amount,
          });
        }
        return !component.isList;
      });
    });
    data.components = data.components?.filter((componentList) => {
      return isNotEmpty(componentList);
    });

    return processUse(data, data.using);
  }
}

async function processUse(requirement: RequirementInterface, using: RequirementUsing[]) {
  const data = requirement;
  if (isEmpty(using)) {
    return;
  }
  return Promise.allSettled(
    using.map(async (use) => {
      const useRequirement = new Requirement((await use.name.getJsonItems())[0].content);
      await useRequirement.load();
      if (isNotEmpty(useRequirement.data.qualities)) {
        useRequirement.data.qualities.forEach((useQualite) => {
          // useQualite.amount *= use.count;
          data.qualities.push(useQualite);
        });
      }
      if (isNotEmpty(useRequirement.data.tools)) {
        useRequirement.data.tools.forEach((tool) => {
          tool.forEach((tool) => (tool.charge *= use.count));
          data.tools.push(tool);
        });
      }
      if (isNotEmpty(useRequirement.data.components)) {
        useRequirement.data.components.forEach((component) => {
          component.forEach((component) => (component.amount *= use.count));
          data.components.push(component);
        });
      }
    })
  );
}

interface RequirementInterface {
  qualities: RequirementQualitie[];
  tools: RequirementTool[][];
  components: RequirementComponent[][];
  using: RequirementUsing[];

  lqualities: RequirementQualitie[];
  ltools: RequirementTool[][];
  lcomponents: RequirementComponent[][];
}

interface RequirementQualitie {
  name: AsyncName;
  level: number;
  amount: number;
  isList: boolean;
}

interface RequirementComponent {
  name: AsyncName;
  amount: number;
  isList: boolean;
  norecoverable: boolean;
}

interface RequirementTool {
  name: AsyncName;
  charge: number;
  isList: boolean;
}

interface RequirementUsing {
  name: AsyncName;
  count: number;
}
