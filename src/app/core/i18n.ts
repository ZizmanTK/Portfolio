import { Injectable, computed, signal } from '@angular/core';
import { SITE, type L, type Lang } from './content';
import { UI } from './ui-strings';

@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>('en');
  readonly ui = computed(() => UI[this.lang()]);
  /** Path of this language's page, relative to the base href ('' for English, 'fr/' for French). */
  readonly home = computed(() => (this.lang() === 'fr' ? 'fr/' : ''));
  /** The other language's page (a full page load: each language is its own prerendered page). */
  readonly otherHome = computed(() => (this.lang() === 'fr' ? './' : 'fr/'));
  readonly otherLang = computed<Lang>(() => (this.lang() === 'fr' ? 'en' : 'fr'));
  /** The CV in this language. */
  readonly cv = computed(() => SITE.profile.resume[this.lang()]);

  t(value: L): string {
    return value[this.lang()];
  }

  /**
   * A link to an element of this page. The base href is the site root, so a bare "#id" would point at the English
   * page from the French one.
   */
  anchor(id: string): string {
    return `${this.home()}#${id}`;
  }

  /** "2024-09" → "Sep 2024" / "sept. 2024". */
  month(ym: string, withYear = true): string {
    const [y, m] = ym.split('-').map(Number);
    const locale = this.lang() === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'short', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC' }).format(
      new Date(Date.UTC(y, m - 1, 1)),
    );
  }

  /** Compact dates for a stop: "Feb–Jul 2024", "Sep 2024–Sep 2025", "Since Sep 2025". */
  dates(start: string, end: string | null): string {
    if (!end) return `${this.ui().since} ${this.month(start)}`;
    return start.slice(0, 4) === end.slice(0, 4) ? `${this.month(start, false)}–${this.month(end)}` : `${this.month(start)}–${this.month(end)}`;
  }

  /** Dates for the résumé view: "Feb – Jul 2024", "Sep 2024 – Sep 2025", "Sep 2025 – now". */
  period(start: string, end: string | null): string {
    if (!end) return `${this.month(start)} – ${this.ui().present}`;
    return start.slice(0, 4) === end.slice(0, 4) ? `${this.month(start, false)} – ${this.month(end)}` : `${this.month(start)} – ${this.month(end)}`;
  }
}
