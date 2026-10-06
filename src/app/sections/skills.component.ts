import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/** Skills as six short groups, then education as rows (dates · degree and school · city). */
@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="skills">
      <app-sec-head idx="04" [title]="ui().sections.skills" [intro]="ui().intro.skills" />
      <div class="two g">
        <div class="skl" reveal>
          @for (g of skills; track $index) {
            <div><h3 class="lab">{{ i18n.t(g.group) }}</h3><p>{{ g.items.join(', ') }}</p></div>
          }
        </div>
        <ol class="edu" id="education">
          @for (e of education; track e.school) {
            <li reveal>
              <span class="yr num">{{ e.start.slice(0, 4) }} — {{ e.end.slice(0, 4) }}</span>
              <div class="dg">
                <b>{{ i18n.t(e.degree) }}</b>
                <span>{{ e.school }}</span>
                @if (e.award) { <p class="aw">{{ i18n.t(e.award) }}</p> }
              </div>
              <span class="pl">{{ e.city }}, {{ i18n.t(e.country) }}</span>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly skills = SITE.skills;
  protected readonly education = SITE.education;
}
