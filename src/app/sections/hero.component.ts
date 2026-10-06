import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { FxDirective } from '../shared/fx.directive';

/**
 * First screen: the surname set big behind the portrait, then the two things a recruiter
 * reads first: who (name + one line) on the left, the facts and actions on the right.
 * While it scrolls away (`--p`), the surname drifts up slower than the page.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FxDirective],
  template: `
    <section class="hero" id="top" fx="leave">
      <div class="stage">
        <p class="sur" aria-hidden="true">{{ p.lastName }}</p>
        <img class="me" [src]="p.portraitCutout" [alt]="i18n.ui().photoAlt" width="1368" height="1823" fetchpriority="high" />
        <div class="shade"></div>
      </div>
      <div class="base">
        <div class="w g">
          <div class="hi">
            <p class="hello"><b>Sannu</b>, {{ i18n.t(h.hello) }}</p>
            <h1>{{ p.name }}</h1>
            <p class="lede">{{ i18n.t(h.lede) }}</p>
          </div>
          <div class="facts">
            <dl>
              <div><dt>{{ ui().facts.now }}</dt><dd>{{ i18n.t(p.role) }}, {{ p.company }}</dd></div>
              <div><dt>{{ ui().facts.contract }}</dt><dd>{{ i18n.t(h.contract) }}</dd></div>
              <div><dt>{{ ui().facts.based }}</dt><dd>{{ i18n.t(h.location) }}</dd></div>
              <div><dt>{{ ui().facts.speaks }}</dt><dd>{{ i18n.t(h.languages) }}</dd></div>
            </dl>
            <div class="acts">
              <a class="btn p" [href]="resume()" download>{{ ui().downloadResume }}</a>
              <a class="btn" [href]="'mailto:' + p.email">{{ ui().email }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly p = SITE.profile;
  protected readonly h = SITE.hero;
  protected readonly resume = computed(() => this.i18n.t(this.p.resume));
}
