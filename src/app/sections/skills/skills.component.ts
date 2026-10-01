import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    @let ui = i18n.ui();
    <section id="skills" class="section" aria-labelledby="skills-title">
      <div class="container">
        <h2 id="skills-title" class="section-title">{{ ui.sections.skills }}</h2>

        <dl class="table card">
          @for (g of groups; track $index) {
            <div class="row">
              <dt>{{ i18n.t(g.group) }}</dt>
              <dd>
                <ul role="list" class="tags">
                  @for (s of g.items; track s) {
                    <li class="tag">{{ s }}</li>
                  }
                </ul>
              </dd>
            </div>
          }
          <div class="row">
            <dt>{{ ui.certifications }}</dt>
            <dd>
              @for (b of badges; track $index) {
                <span class="cert"><app-icon name="check" [size]="16" /> {{ i18n.t(b) }}</span>
              }
            </dd>
          </div>
        </dl>
      </div>
    </section>
  `,
  styles: `
    .table { margin: 0; overflow: hidden; }
    .row {
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 0.5rem 1.5rem;
      align-items: center;
      padding: 1rem 1.5rem;
    }
    .row + .row { border-top: 1px solid var(--line); }
    dt { font-weight: 700; }
    dd { margin: 0; }
    .cert { display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 500; }
    .cert app-icon { color: #15803d; }
    @media (max-width: 640px) {
      .row { grid-template-columns: minmax(0, 1fr); padding: 1rem; }
    }
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly groups = SITE.skills;
  protected readonly badges = SITE.badges;
}
