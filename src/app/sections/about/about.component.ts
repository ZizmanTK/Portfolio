import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let ui = i18n.ui();
    <section id="about" class="section" aria-labelledby="about-title">
      <div class="container split">
        <h2 id="about-title" class="section-title">{{ ui.sections.about }}</h2>

        <div class="body">
          <blockquote class="mission">{{ i18n.t(mission) }}</blockquote>

          @for (p of paragraphs; track $index) {
            <p class="para">{{ i18n.t(p) }}</p>
          }

          <dl class="lists">
            <div class="list">
              <dt>{{ ui.languages }}</dt>
              <dd>
                @for (l of languages; track $index) {
                  <span class="lang"><strong>{{ i18n.t(l.name) }}</strong> <span class="muted">{{ i18n.t(l.level) }}</span></span>
                }
              </dd>
            </div>
            <div class="list">
              <dt>{{ ui.interests }}</dt>
              <dd>
                @for (it of interests; track $index) {
                  <span class="fun"><span aria-hidden="true">{{ it.emoji }}</span><span>{{ i18n.t(it) }}</span></span>
                }
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  `,
  styles: `
    .body { display: grid; gap: 1.25rem; max-width: 46rem; }
    .mission {
      margin: 0 0 0.5rem;
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.25;
    }
    .mission::before {
      content: '“';
      display: block;
      margin-bottom: -0.35em;
      font-size: 3.2em;
      line-height: 1;
      color: var(--accent);
    }
    .para { color: var(--ink-2); }
    .lists { display: grid; gap: 1.25rem; margin: 0.75rem 0 0; padding-top: 1.5rem; border-top: 1px solid var(--line); }
    .list { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 0.4rem 1rem; }
    dt { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: var(--accent-ink); padding-top: 0.2rem; }
    dd { margin: 0; display: flex; flex-wrap: wrap; gap: 0.2rem 1.4rem; }
    .lang, .fun { display: inline-flex; gap: 0.4rem; align-items: baseline; }
    @media (max-width: 560px) { .list { grid-template-columns: minmax(0, 1fr); } }
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18n);
  protected readonly paragraphs = SITE.about.paragraphs;
  protected readonly mission = SITE.profile.mission;
  protected readonly languages = SITE.languages;
  protected readonly interests = SITE.interests;
}
