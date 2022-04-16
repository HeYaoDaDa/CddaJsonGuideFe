import { isNotEmpty } from 'src/utils';
import { getBaseJsonItem } from 'src/utils/baseJsonItemMapUtil';
import { getName } from 'src/utils/JsonItemUtil';
import { reactive } from 'vue';
interface Proficiency {
  proficiency: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
  name: string;
}
function initProficiency(content: ContentProficiency): Proficiency {
  const proficiency = reactive({} as Proficiency);
  proficiency.proficiency = content.proficiency;
  proficiency.required = content.required;
  proficiency.time_multiplier = content.time_multiplier;
  proficiency.fail_multiplier = content.fail_multiplier;
  proficiency.learning_time_multiplier = content.learning_time_multiplier;
  proficiency.max_experience = content.max_experience;
  proficiency.name = proficiency.proficiency;
  void getBaseJsonItem('proficiency', proficiency.proficiency).then(
    (jsonItems) => {
      if (isNotEmpty(jsonItems)) {
        proficiency.name = getName(jsonItems);
        const proficiencyContent = jsonItems[0].content as {
          default_time_multiplier: number;
          default_fail_multiplier: number;
        };
        proficiency.time_multiplier =
          proficiency.time_multiplier ??
          proficiencyContent.default_time_multiplier;
        proficiency.fail_multiplier =
          proficiency.fail_multiplier ??
          proficiencyContent.default_fail_multiplier;
      }
    }
  );
  return proficiency;
}

interface Qualitie {
  id: string;
  level: number;
  amount: number;
  name: string;
}
function initQualitie(content: ContentQualitie): Qualitie {
  const qualitie = reactive({} as Qualitie);
  qualitie.id = content.id;
  qualitie.level = content.level ?? 0;
  qualitie.amount = content.amount ?? 1;
  qualitie.name = qualitie.id;
  void getBaseJsonItem('tool_quality', qualitie.id).then((jsonItem) => {
    jsonItem
      ? (qualitie.name = getName(jsonItem))
      : (qualitie.name = qualitie.id);
  });
  return qualitie;
}

interface Tool {
  id: string;
  amount: number;
  other?: string;
  name: string;
}
function initTool(value: [string, number, string | undefined]): Tool {
  const tool = reactive({} as Tool);
  tool.id = value[0];
  tool.amount = value[1] ?? -1;
  tool.other = value[2];
  tool.name = tool.id;
  void getBaseJsonItem('item', tool.id).then(
    (jsonItem) => (tool.name = jsonItem ? getName(jsonItem) : tool.id)
  );
  return tool;
}

interface Component {
  id: string;
  amount: number;
  other?: string;
  name: string;
}
function initComponent(value: [string, number, string | undefined]): Component {
  const component = reactive({} as Component);
  component.id = value[0];
  component.amount = value[1];
  component.other = value[2];
  component.name = component.id;
  void getBaseJsonItem('item', component.id).then(
    (jsonItem) => (component.name = jsonItem ? getName(jsonItem) : component.id)
  );
  return component;
}
interface Use {
  id: string;
  amount: number;
  name?: string;
}

export interface RequirementContent {
  proficiencies?: ContentProficiency[];
  qualities?: ContentQualitie[];
  tools?: [string, number, string | undefined][][];
  using?: [string, number][];
  components?: [string, number, string | undefined][][];
}

interface ContentQualitie {
  id: string;
  level?: number;
  amount?: number;
}

interface ContentProficiency {
  proficiency: string;
  required?: boolean;
  time_multiplier?: number;
  fail_multiplier?: number;
  learning_time_multiplier?: number;
  max_experience?: number | string;
}

export interface RequirementFeature {
  proficiencies?: Proficiency[];
  qualities?: Qualitie[];
  tools?: Tool[][];
  using?: Use[];
  components?: Component[][];
}
export function validate(jsonItem: JsonItem): boolean {
  return jsonItem.type === 'requirement';
}
export function initRequirementFeature(jsonItem: JsonItem): RequirementFeature {
  const requirementFeature = reactive({} as RequirementFeature);
  const content = <RequirementContent>jsonItem.content;

  if (content.proficiencies) {
    requirementFeature.proficiencies = [];
    content.proficiencies.forEach((proficiencie) =>
      requirementFeature.proficiencies?.push(initProficiency(proficiencie))
    );
  }
  if (content.qualities) {
    requirementFeature.qualities = content.qualities.map((qualitie) =>
      initQualitie(qualitie)
    );
  }
  if (content.tools) {
    requirementFeature.tools = [];
    content.tools.forEach((tools, index) => {
      tools.forEach((tool) => {
        if (tool[2] !== 'LIST') {
          if (requirementFeature.tools && !requirementFeature.tools[index]) {
            requirementFeature.tools[index] = [];
          }
          requirementFeature.tools?.[index].push(initTool(tool));
        } else {
          if (!requirementFeature.using) {
            requirementFeature.using = [];
          }
          requirementFeature.using?.push({ id: tool[0], amount: tool[1] });
        }
      });
    });
  }
  if (content.using) {
    if (!requirementFeature.using) {
      requirementFeature.using = [];
    }
    content.using.forEach((using) => {
      requirementFeature.using?.push({ id: using[0], amount: using[1] });
    });
  }
  if (content.components) {
    requirementFeature.components = [];
    content.components.forEach((components, index) => {
      components.forEach((component) => {
        if (component[2] !== 'LIST') {
          if (
            requirementFeature.components &&
            !requirementFeature.components[index]
          ) {
            requirementFeature.components[index] = [];
          }
          requirementFeature.components?.[index].push(initComponent(component));
        } else {
          if (!requirementFeature.using) {
            requirementFeature.using = [];
          }
          requirementFeature.using?.push({
            id: component[0],
            amount: component[1],
          });
        }
      });
    });
  }
  processUsing(requirementFeature.using, requirementFeature);

  return requirementFeature;
}

function processUsing(
  using: Use[] | undefined,
  recipe: RequirementFeature,
  amount?: number
) {
  if (using) {
    using.forEach((using) => {
      void getBaseJsonItem('requirement', using.id).then((jsonItems) => {
        if (isNotEmpty(jsonItems)) {
          const requirement = reactive(initRequirementFeature(jsonItems[0]));
          if (requirement.proficiencies) {
            if (!recipe.proficiencies) {
              recipe.proficiencies = [];
            }
            recipe.proficiencies.push(...requirement.proficiencies);
          }

          if (requirement.tools) {
            requirement.tools.forEach((tools) =>
              tools.forEach(
                (tool) => (tool.amount *= using.amount * (amount ?? 1))
              )
            );
            if (!recipe.tools) {
              recipe.tools = [];
            }
            recipe.tools.push(...requirement.tools);
          }

          if (requirement.qualities) {
            requirement.qualities.forEach(
              (qualitie) => (qualitie.amount *= using.amount * (amount ?? 1))
            );
            if (!recipe.qualities) {
              recipe.qualities = reactive([]);
            }
            recipe.qualities?.push(...reactive(requirement.qualities));
          }

          if (requirement.components) {
            requirement.components.forEach((components) =>
              components.forEach(
                (component) =>
                  (component.amount *= using.amount * (amount ?? 1))
              )
            );
            if (!recipe.components) {
              recipe.components = [];
            }
            recipe.components.push(...requirement.components);
          }

          if (requirement.using) {
            processUsing(requirement.using, recipe, using.amount);
          }
        }
      });
    });
  }
}
