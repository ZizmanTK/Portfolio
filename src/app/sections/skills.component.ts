import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sec" id="skills">
      <h2 class="tt rv"><span class="n">05</span>{{ i18n.ui().sections.skills }}</h2>
      <dl class="skl rv">
        @for (g of skills; track $index) {
          <div><dt>{{ i18n.t(g.group) }}</dt><dd>{{ g.items.join(', ') }}</dd></div>
        }
      </dl>
    </section>

    <section class="sec" id="education">
      <h2 class="tt rv"><span class="n">06</span>{{ i18n.ui().sections.education }}</h2>
      <div class="ed">
        @for (e of education; track e.school) {
          <div class="rv">
            <p class="yr">{{ e.start.slice(0, 4) }} – {{ e.end.slice(0, 4) }}</p>
            <div>
              <h4>{{ i18n.t(e.degree) }}</h4>
              <p>{{ e.school }} · {{ e.city }}, {{ i18n.t(e.country) }}</p>
              @if (e.award) { <p class="aw"><span class="pill y">{{ i18n.ui().award }}</span>{{ i18n.t(e.award) }}</p> }
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly skills = SITE.skills;
  protected readonly education = SITE.education;
}
