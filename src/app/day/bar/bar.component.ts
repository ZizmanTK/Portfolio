import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { CROWN } from '../../shared/crown';

/**
 * The bar of the story page, drawn like the work page's: who he is (a link to the work page), the clock of the day (an
 * odometer the engine turns) with the place and the stop counter, then open to work, the CV and the other language.
 * Its ground switches between day, golden hour and night (data-phase, set by the engine).
 */
@Component({
  selector: 'header[appBar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'bar', id: 'bar' },
  template: `
  <a class="bar-id" [href]="i18n.work()" [attr.aria-label]="name + ', ' + ui().work.shortVersion.toLowerCase()">
    <span class="box"><svg class="crown" viewBox="0 0 142 120" aria-hidden="true"><path [attr.d]="crown"/></svg></span>
    <span>{{ name }}</span>
  </a>
  <p class="bar-clock" aria-hidden="true"><span class="clock" id="clock">05:40</span><span class="sep">·</span><span class="place" id="place">{{ i18n.t(places.top) }}</span><span class="sep place">·</span><span class="stopc">{{ ui().stop }} <b id="stopn">01</b> / 10</span></p>
  <p class="bar-do">
    <span class="status"><i aria-hidden="true"></i>{{ i18n.t(hero.status) }}</span>
    <a class="bar-cv" [href]="i18n.cv()" download [attr.aria-label]="ui().downloadCv"><span class="wide">{{ ui().downloadCv }}</span><span class="narrow">{{ ui().cv }}</span></a>
    <a class="bar-lang" [href]="i18n.otherHome()" [attr.hreflang]="i18n.otherLang()" [attr.lang]="i18n.otherLang()" [attr.aria-label]="ui().switchLang">{{ ui().langShort }}</a>
  </p>
`,
})
export class BarComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly crown = CROWN;
  protected readonly name = SITE.profile.name;
  protected readonly hero = SITE.hero;
  protected readonly places = SITE.day.places;
}
