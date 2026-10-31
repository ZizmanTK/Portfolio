import type { Experience } from '../core/content';
import type { I18n } from '../core/i18n';

/** "Fixed-term contract" → "Fixed-term" (the row is already labelled Contract); "CDD" stays "CDD". */
export const contractOf = (i18n: I18n, e: Experience): string => i18n.t(e.type).replace(/ contract$/i, '');

/** The facts of a role, as the info rows of its stop: company, contract, dates, place. */
export function roleInfo(i18n: I18n, e: Experience): { k: string; v: string }[] {
  const ui = i18n.ui().info;
  return [
    { k: ui.company, v: e.company },
    { k: ui.contract, v: contractOf(i18n, e) },
    { k: ui.dates, v: i18n.dates(e.start, e.end) },
    { k: ui.place, v: i18n.t(e.location) },
  ];
}
