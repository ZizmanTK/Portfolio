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
      <div class="container split">
        <h2 id="skills-title" class="section-title">{{ ui.sections.skills }}</h2>

        <dl class="rows">
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
    .rows { margin: 0; }
    .row {
      display: grid;
      grid-template-columns: 190px minmax(0, 1fr);
      gap: 0.35rem 1.5rem;
      padding: 0.95rem 0;
      border-bottom: 1px solid var(--line);
    }
    .row:first-child { padding-top: 0; }
    dt { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.01em; }
    dd { margin: 0; }
    .tags { font-size: 1rem; }
    .cert { display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 500; }
    .cert app-icon { color: #15803d; }
    @media (max-width: 640px) {
      .row { grid-template-columns: minmax(0, 1fr); }
    }
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly groups = SITE.skills;
  protected readonly badges = SITE.badges;
}
