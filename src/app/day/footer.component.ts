import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';

/** The foot of the night: who, the résumé view, back to first light, the other language. */
@Component({
  selector: 'footer[appFooter]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'foot night' },
  template: `
  <p>{{ SITE.profile.name }} <span class="sep">·</span> {{ i18n.t(SITE.hero.role) }} <span class="sep">·</span> {{ i18n.t(SITE.profile.location) }}</p>
  <p><a class="link resume-open" [href]="i18n.anchor('resume')">{{ ui().resumeView }}</a> <a class="link" [href]="i18n.anchor('top')">{{ ui().backToFirstLight }}</a> <a class="link" [href]="i18n.otherHome()" [attr.hreflang]="i18n.otherLang()" [attr.lang]="i18n.otherLang()">{{ ui().otherLangName }}</a></p>
  <p class="mono">© 2026</p>
`,
})
export class FooterComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
}
