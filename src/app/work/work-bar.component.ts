import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { CROWN } from '../shared/crown';

/** The parts of the page the menu leads to, by id, from top to bottom. */
const PARTS = ['work', 'path', 'contact'] as const;

/**
 * The bar of the work page: who, the three parts of the page, open to work, the CV and the other language. The menu
 * marks the part being read, which is the one crossing a line seven tenths of the way down the window.
 */
@Component({
  selector: 'header[appWorkBar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'wk-bar wk-gr wk-g-paper' },
  template: `
  <a class="wk-id" [href]="i18n.anchor('top')"><span class="wk-crown"><svg viewBox="0 0 142 120" aria-hidden="true"><path [attr.d]="crown"/></svg></span><span>{{ name }}</span></a>
  <nav class="wk-nav" [attr.aria-label]="ui().quickLinks">
    <a [href]="i18n.anchor('work')" [attr.aria-current]="here() === 'work' ? 'location' : null">{{ ui().work.nav.work }}</a>
    <a [href]="i18n.anchor('path')" [attr.aria-current]="here() === 'path' ? 'location' : null">{{ ui().work.nav.path }}</a>
    <a [href]="i18n.anchor('contact')" [attr.aria-current]="here() === 'contact' ? 'location' : null">{{ ui().work.nav.contact }}</a>
  </nav>
  <p class="wk-do">
    <span class="wk-status"><i aria-hidden="true"></i>{{ i18n.show(status) }}</span>
    <a class="wk-cv" [href]="i18n.cv()" download [attr.aria-label]="ui().downloadCv"><span class="wk-wide">{{ ui().downloadCv }}</span><span class="wk-narrow">{{ ui().cv }}</span></a>
    <a class="wk-lang" [href]="i18n.otherHome()" [attr.hreflang]="i18n.otherLang()" [attr.lang]="i18n.otherLang()" [attr.aria-label]="ui().switchLang">{{ ui().langShort }}</a>
  </p>
`,
})
export class WorkBarComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly crown = CROWN;
  protected readonly name = SITE.profile.name;
  protected readonly status = SITE.hero.status;
  /** The part being read, if the menu leads to it. */
  protected readonly here = signal<string | null>(null);

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) return;
      const on = new Set<string>();
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) e.isIntersecting ? on.add(e.target.id) : on.delete(e.target.id);
        // A sheet starts over the foot of the one before it: where two parts cross the line, the lower one is being read.
        this.here.set([...PARTS].reverse().find((p) => on.has(p)) ?? null);
      }, { rootMargin: '-70% 0px -29% 0px' });
      for (const p of PARTS) {
        const part = document.getElementById(p);
        if (part) io.observe(part);
      }
      destroy.onDestroy(() => io.disconnect());
    });
  }
}
