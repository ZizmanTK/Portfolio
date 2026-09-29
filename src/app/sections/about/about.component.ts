import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective],
  template: `
    @let ui = i18n.ui();
    <section id="about" class="section" aria-labelledby="about-title">
      <div class="container grid">
        <app-section-heading index="01" [label]="ui.sections.about" [title]="ui.aboutTitle" headingId="about-title" />

        <div class="body">
          @for (p of about.paragraphs; track $index; let first = $first) {
            <p [class.lead]="first" [class.para]="!first" appReveal>{{ i18n.t(p) }}</p>
          }
        </div>

        <aside class="side">
          <dl class="facts">
            @for (f of about.facts; track $index) {
              <div class="fact card" [appReveal]="$index * 60">
                <dt class="eyebrow">{{ i18n.t(f.label) }}</dt>
                <dd>{{ i18n.t(f.value) }}</dd>
              </div>
            }
          </dl>

          <div class="langs card" appReveal>
            <p class="eyebrow">{{ ui.spokenLanguages }}</p>
            <ul role="list">
              @for (l of languages; track $index) {
                <li>
                  <span>{{ i18n.t(l.name) }}</span>
                  <span class="mono muted">{{ i18n.t(l.level) }}</span>
                </li>
              }
            </ul>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      grid-template-areas: 'head head' 'body side';
      column-gap: clamp(2rem, 6vw, 5rem);
    }
    app-section-heading { grid-area: head; }
    .body { grid-area: body; display: grid; gap: 1.25rem; align-content: start; }
    .lead { font-size: clamp(1.25rem, 2vw, 1.55rem); color: var(--ink); line-height: 1.45; }
    .para { color: var(--ink-2); font-size: 1.05rem; text-wrap: pretty; }
    .side { grid-area: side; display: grid; gap: 1rem; align-content: start; }
    .facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin: 0; }
    .fact { padding: 1.1rem 1.2rem; }
    .fact dd { margin: 0.5rem 0 0; font-weight: 500; line-height: 1.35; }
    .langs { padding: 1.1rem 1.2rem; }
    .langs ul { margin: 0.75rem 0 0; display: grid; }
    .langs li {
      display: flex; justify-content: space-between; align-items: baseline; gap: 1rem;
      padding: 0.55rem 0; border-top: 1px solid var(--line); font-weight: 500;
    }
    .langs li:first-child { border-top: 0; }
    @media (max-width: 900px) {
      .grid { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'head' 'body' 'side'; row-gap: 2.5rem; }
    }
    @media (max-width: 420px) {
      .facts { grid-template-columns: minmax(0, 1fr); }
    }
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18n);
  protected readonly about = SITE.about;
  protected readonly languages = SITE.languages;
}
