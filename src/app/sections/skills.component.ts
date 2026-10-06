import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/** Skills as ruled rows (group · tools, set large enough to read), then education in the same rhythm. */
@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="skills">
      <app-sec-head idx="04" [title]="ui().sections.skills" [intro]="ui().intro.skills" />
      <div class="rows">
        @for (g of skills; track $index) {
          <div class="row g" reveal><h3 class="lab">{{ i18n.t(g.group) }}</h3><p>{{ g.items.join(', ') }}</p></div>
        }
      </div>
      <h3 class="subh lab" id="education" reveal>{{ ui().sections.education }}</h3>
      <ol class="rows edu">
        @for (e of education; track e.school) {
          <li class="row g" reveal>
            <span class="yr num">{{ e.start.slice(0, 4) }}–{{ e.end.slice(2, 4) }}</span>
            <div class="dg">
              <b>{{ i18n.t(e.degree) }}</b>
              <span>{{ e.school }} · {{ e.city }}, {{ i18n.t(e.country) }}</span>
              @if (e.award) { <p class="aw"><em>{{ ui().award }}</em>{{ i18n.t(e.award) }}</p> }
            </div>
          </li>
        }
      </ol>
    </section>
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly skills = SITE.skills;
  protected readonly education = SITE.education;
}
