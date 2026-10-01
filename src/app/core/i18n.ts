import { Injectable, computed, signal } from '@angular/core';
import { monthsBetween, type L, type Lang } from './content';
import { UI } from './ui-strings';

@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>('en');
  readonly ui = computed(() => UI[this.lang()]);
  /** Router path of the other language version. */
  readonly otherLangPath = computed(() => (this.lang() === 'en' ? '/fr' : '/'));

  t(value: L): string {
    return value[this.lang()];
  }

  /** "2024-09" → "Sep 2024" / "sept. 2024"; null → "Present". */
  month(ym: string | null): string {
    if (!ym) return this.ui().present;
    const [y, m] = ym.split('-').map(Number);
    const locale = this.lang() === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(y, m - 1, 1)),
    );
  }

  /** LinkedIn-style length of a period: "1 yr 1 mo", "6 mo". An open end means "until this month". */
  duration(start: string, end: string | null): string {
    const now = new Date();
    const until = end ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const total = monthsBetween(start, until);
    const years = Math.floor(total / 12);
    const months = total % 12;
    const ui = this.ui();
    return [years ? ui.yr(years) : '', months ? ui.mo(months) : ''].filter(Boolean).join(' ');
  }
}
