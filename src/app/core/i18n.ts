import { Injectable, computed, signal } from '@angular/core';
import type { L, Lang } from './content';
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
}
