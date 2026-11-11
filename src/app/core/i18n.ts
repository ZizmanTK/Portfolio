import { Injectable, computed, signal } from '@angular/core';
import { SITE, typo, type L, type Lang } from './content';
import { UI } from './ui-strings';

/** The two pages of the site: the work (the short version) and the story (the walk through a day). */
export type Page = 'work' | 'story';

/** Path of a page relative to the base href: '' and 'fr/' for the work, 'story/' and 'fr/story/' for the story. */
export const pagePath = (lang: Lang, page: Page): string => (lang === 'fr' ? 'fr/' : '') + (page === 'story' ? 'story/' : '');

/** " · " that never starts a line: the line can only break after the dot. */
export const SEP = ' · ';

@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>('en');
  readonly page = signal<Page>('work');
  readonly ui = computed(() => UI[this.lang()]);
  readonly otherLang = computed<Lang>(() => (this.lang() === 'fr' ? 'en' : 'fr'));
  /** Path of this page, relative to the base href. */
  readonly home = computed(() => pagePath(this.lang(), this.page()));
  /** The same page in the other language (a full page load: each page is its own prerendered file). */
  readonly otherHome = computed(() => pagePath(this.otherLang(), this.page()) || './');
  /** The work page and the story page in this language. */
  readonly work = computed(() => pagePath(this.lang(), 'work') || './');
  readonly story = computed(() => pagePath(this.lang(), 'story'));
  /** The CV in this language. */
  readonly cv = computed(() => SITE.profile.resume[this.lang()]);

  t(value: L): string {
    return value[this.lang()];
  }

  /**
   * Copy for display: typographic apostrophes, dots that never start a line, "TEEXMA 7" kept on one line and, in French,
   * a narrow no-break space before : ; ! ?
   */
  show(value: L): string {
    const s = typo(this.t(value)).replaceAll(' · ', SEP).replaceAll('TEEXMA 7', 'TEEXMA 7');
    return this.lang() === 'fr' ? s.replace(/[ \u00a0]([:;!?])/g, '\u202f$1') : s;
  }

  /** Items on one line, between dots that never start a line. */
  list(items: readonly string[]): string {
    return items.join(SEP);
  }

  /**
   * A link to an element of this page. The base href is the site root, so a bare "#id" would point at the English
   * work page from every other page.
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
