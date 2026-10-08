import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { FxDirective } from '../shared/fx.directive';

/**
 * First screen, ordered by what a recruiter checks in the first seconds: the job title set big
 * across the full width behind the portrait (always in English, in both languages), then name +
 * specialties on the left, and on the right that I'm
 * open to work, how much experience, where, which languages, and the résumé.
 * While it scrolls away (`--p`), the big title drifts up slower than the page.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FxDirective],
  template: `
    <section class="hero" id="top" fx="leave">
      <div class="stage">
        <p class="sur" lang="en">{{ h.role.en }}</p>
        <img class="me" [src]="p.portraitCutout" [alt]="i18n.ui().photoAlt" width="1368" height="1823" fetchpriority="high" />
        <div class="shade"></div>
      </div>
      <div class="base">
        <div class="w g">
          <div class="hi">
            <p class="hello"><b>Sannu</b>, {{ i18n.t(h.hello) }}</p>
            <h1>{{ p.name }}</h1>
            <ul class="focus">@for (f of h.focus; track $index) { <li>{{ i18n.t(f) }}</li> }</ul>
          </div>
          <div class="facts">
            <dl>
              <div class="st"><dt>{{ ui().facts.status }}</dt><dd><i aria-hidden="true"></i>{{ i18n.t(h.status) }}</dd></div>
              <div><dt>{{ ui().facts.experience }}</dt><dd>{{ i18n.t(h.experience) }}</dd></div>
              <div><dt>{{ ui().facts.based }}</dt><dd>{{ i18n.t(h.location) }}</dd></div>
              <div><dt>{{ ui().facts.speaks }}</dt><dd>{{ i18n.t(h.languages) }}</dd></div>
            </dl>
            <div class="acts">
              <a class="btn p" [href]="resume()" download>{{ ui().downloadResume }}</a>
              <a class="btn" [href]="'mailto:' + p.email">{{ ui().email }}</a>
              <a class="btn" [href]="linkedin" target="_blank" rel="noopener">LinkedIn</a>
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
  protected readonly linkedin = SITE.socials.find((s) => s.id === 'linkedin')!.url;
  protected readonly resume = computed(() => this.i18n.t(this.p.resume));
}
