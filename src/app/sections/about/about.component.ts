import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let ui = i18n.ui();
    <section id="about" class="section section--alt" aria-labelledby="about-title">
      <div class="container grid">
        <div>
          <h2 id="about-title" class="section-title">{{ ui.sections.about }}</h2>
          <div class="story">
            @for (p of paragraphs; track $index) {
              <p>{{ i18n.t(p) }}</p>
            }
            <p class="mission">{{ i18n.t(mission) }}</p>
          </div>
        </div>

        <aside class="side">
          <div class="card box">
            <h3>{{ ui.languages }}</h3>
            <ul role="list" class="langs">
              @for (l of languages; track $index) {
                <li><span>{{ i18n.t(l.name) }}</span><span class="muted">{{ i18n.t(l.level) }}</span></li>
              }
            </ul>
          </div>
          <div class="card box">
            <h3>{{ ui.interests }}</h3>
            <ul role="list" class="tags">
              @for (it of interests; track $index) {
                <li class="tag">{{ i18n.t(it) }}</li>
              }
            </ul>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: clamp(1.5rem, 5vw, 3.5rem); align-items: start; }
    .story { display: grid; gap: 1rem; max-width: 44rem; color: var(--ink-2); }
    .mission { padding-left: 1rem; border-left: 4px solid var(--accent); font-weight: 600; color: var(--ink); }
    .side { display: grid; gap: 1rem; }
    .box { padding: 1.25rem 1.4rem; }
    .box h3 { margin-bottom: 0.75rem; font-size: 1rem; font-weight: 700; }
    .langs li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.45rem 0; font-weight: 500; }
    .langs li + li { border-top: 1px solid var(--line); }
    @media (max-width: 860px) { .grid { grid-template-columns: minmax(0, 1fr); } }
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18n);
  protected readonly paragraphs = SITE.about.paragraphs;
  protected readonly mission = SITE.profile.mission;
  protected readonly languages = SITE.languages;
  protected readonly interests = SITE.interests;
}
