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
