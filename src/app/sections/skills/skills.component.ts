import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective],
  template: `
    @let ui = i18n.ui();
    <section id="skills" class="section" aria-labelledby="skills-title">
      <div class="container">
        <app-section-heading index="05" [label]="ui.sections.skills" [title]="ui.skillsTitle" headingId="skills-title" />

        <div class="bento">
          @for (g of groups; track $index; let i = $index) {
            <article class="group card" [class.group--wide]="i >= 3" [appReveal]="(i % 3) * 70">
              <header class="group__head">
                <span class="mono muted">0{{ i + 1 }}</span>
                <h3>{{ i18n.t(g.group) }}</h3>
              </header>
              <ul role="list" class="group__items">
                @for (s of g.items; track s.name) {
                  <li class="skill">
                    @if (s.icon) {
                      <img [src]="'assets/logos/skills/' + s.icon + '.svg'" alt="" width="22" height="22" loading="lazy" />
                    } @else {
                      <span class="skill__mono" aria-hidden="true">{{ s.name.charAt(0) }}</span>
                    }
                    {{ s.name }}
                  </li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .bento {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 1rem;
    }
    .group {
      grid-column: span 2;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 1.4rem;
      transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
    }
    .group:hover { border-color: var(--line-strong); box-shadow: var(--shadow); }
    .group--wide { grid-column: span 3; }
    .group__head { display: flex; align-items: baseline; gap: 0.75rem; }
    .group__head h3 { font-size: 1.1rem; font-weight: 600; letter-spacing: -0.01em; }
    .group__items { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; }
    .skill {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.45rem 0.85rem 0.45rem 0.5rem;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--bg-elev);
      font-size: 0.92rem;
      font-weight: 500;
      transition: transform 0.2s var(--ease), border-color 0.2s;
    }
    .skill:hover { transform: translateY(-2px); border-color: var(--line-strong); }
    .skill img { width: 22px; height: 22px; object-fit: contain; }
    .skill__mono {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: var(--accent-soft);
      color: var(--accent-ink);
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
    }
    @media (max-width: 900px) {
      .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .group, .group--wide { grid-column: span 1; }
      .group:last-child { grid-column: span 2; }
    }
    @media (max-width: 560px) {
      .bento { grid-template-columns: minmax(0, 1fr); }
      .group, .group--wide, .group:last-child { grid-column: auto; }
    }
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly groups = SITE.skills;
}
