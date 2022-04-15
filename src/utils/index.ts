import { Notify } from 'quasar';

export function getUserLanguageCode(): string {
  return navigator.language;
}

export function showAjaxFailNotify() {
  Notify.create({
    color: 'negative',
    position: 'top',
    message: 'Loading failed',
    icon: 'report_problem',
  });
}

export function isEmpty(value: Array<unknown> | string | undefined): boolean {
  return value == undefined || value.length === 0;
}

export function isNotEmpty(
  value: Array<unknown> | string | undefined
): boolean {
  return !isEmpty(value);
}
