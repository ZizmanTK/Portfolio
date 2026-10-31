import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';

/** The ZTK crown: the letters share one roof bar, which doubles as the crown band. */
export const CROWN =
  'M8 30H94V44H8ZM8 30L3 12L26 30ZM46 30L57 2L68 30ZM94 30L99 12L76 30ZM30 44H44L22 96H8ZM8 96H44V110H8ZM50 44H64V110H50ZM80 44H94V110H80ZM94 70L118 30H134L102 84H94ZM100 78L109 67L134 110H118Z';

/**
 * The bar: who he is, the clock of the day (an odometer the engine turns), the place and the stop counter, and the quick
 * links. Its ground switches between day, golden hour and night (data-phase, set by the engine).
 */
@Component({
  selector: 'header[appBar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'bar', id: 'bar' },
  template: `
  <a class="bar-id" [href]="i18n.anchor('top')" [attr.aria-label]="name + ', ' + ui().backToStart">
    <svg class="crown" viewBox="0 0 142 120" aria-hidden="true"><path [attr.d]="crown"/></svg>
    <span>{{ name }}</span>
  </a>
  <p class="bar-role"><span>{{ i18n.t(hero.role) }}</span><span class="sep">·</span><span class="yrs">{{ i18n.t(hero.experience) }}</span><span class="sep yrs">·</span><span class="status"><i aria-hidden="true"></i>{{ i18n.t(hero.status) }}</span><span class="sep city">·</span><span class="city">{{ city }}</span></p>
  <p class="bar-clock" aria-hidden="true"><span class="clock" id="clock">05:40</span><span class="sep">·</span><span class="place" id="place">{{ i18n.t(places.top) }}</span><span class="sep place">·</span><span class="stopc">{{ ui().stop }} <b id="stopn">01</b> / 10</span></p>
  <nav class="bar-nav" [attr.aria-label]="ui().quickLinks">
    <a class="resume-open" [href]="i18n.anchor('resume')">{{ ui().resumeView }}</a>
    <a [href]="i18n.cv()" download>{{ ui().cv }}</a>
    <a [href]="'mailto:' + email">{{ ui().email }}</a>
    <a [href]="linkedin" rel="noopener">LinkedIn</a>
    <a class="lang" [href]="i18n.otherHome()" [attr.hreflang]="i18n.otherLang()" [attr.lang]="i18n.otherLang()" [attr.aria-label]="ui().switchLang">{{ ui().langShort }}</a>
  </nav>
`,
})
export class BarComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly crown = CROWN;
  protected readonly name = SITE.profile.name;
  protected readonly hero = SITE.hero;
  protected readonly places = SITE.day.places;
  protected readonly email = SITE.profile.email;
  protected readonly linkedin = SITE.socials.find((s) => s.id === 'linkedin')!.url;
  protected readonly city = SITE.route.find((r) => r.now)!.city;
}
