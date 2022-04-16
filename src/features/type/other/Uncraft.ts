import { reactive } from 'vue';
import { RequirementFeature, initRequirementFeature } from './Requirement';

interface UncraftContent {
  result?: string;
  time?: number | string;
}

interface UncraftFeature {
  result?: string;
  time: string;
  requirement: RequirementFeature;
}
export function validate(jsonItem: JsonItem): boolean {
  return jsonItem.type === 'uncraft';
}
export function initUncraftFeature(jsonItem: JsonItem): UncraftFeature {
  const uncraftFeature = reactive({} as UncraftFeature);
  const content = <UncraftContent>jsonItem.content;
  uncraftFeature.result = content.result;
  uncraftFeature.time =
    (typeof content.time === 'string'
      ? content.time
      : content.time?.toString()) ?? '0';
  uncraftFeature.requirement = initRequirementFeature(jsonItem);
  return uncraftFeature;
}
