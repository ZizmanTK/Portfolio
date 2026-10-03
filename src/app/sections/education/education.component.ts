import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let ui = i18n.ui();
    <section id="education" class="section" aria-labelledby="education-title">
      <div class="container split">
        <h2 id="education-title" class="section-title">{{ ui.sections.education }}</h2>

        <ol role="list" class="list">
          @for (e of education; track e.school) {
            <li class="item">
              @if (e.logo) {
                <img class="logo" [src]="e.logo" [alt]="e.school + ' logo'" width="44" height="44" loading="lazy" />
              } @else {
                <span class="logo logo--blank" aria-hidden="true">{{ e.school.charAt(0) }}</span>
              }
              <div class="main">
                <h3>{{ i18n.t(e.degree) }}</h3>
                <p>
                  @if (e.url) {
                    <a class="school" [href]="e.url" target="_blank" rel="noopener">{{ e.school }}</a>
                  } @else {
                    <span class="school">{{ e.school }}</span>
                  }
                  <span class="muted"> · {{ e.city }}, {{ i18n.t(e.country) }}</span>
                </p>
              </div>
              <p class="dates">{{ i18n.month(e.start) }} – {{ i18n.month(e.end) }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .list { margin: 0; }
    .item {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr) auto;
      gap: 0.5rem 1.1rem;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid var(--line);
    }
    .item:first-child { padding-top: 0; }
    h3 { font-family: var(--font-display); font-size: 1.12rem; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3; }
    .school { font-weight: 500; }
    a.school:hover { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 4px; }
    .dates { font-weight: 600; font-size: 0.95rem; white-space: nowrap; }
    .logo {
      width: 44px;
      height: 44px;
      padding: 5px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 1px var(--line);
      object-fit: contain;
    }
    .logo--blank { display: grid; place-items: center; padding: 0; background: var(--accent-soft); box-shadow: none; font-weight: 800; color: var(--accent-ink); }
    @media (max-width: 640px) {
      .item { grid-template-columns: 44px minmax(0, 1fr); }
      .dates { grid-column: 2; white-space: normal; }
    }
  `,
})
export class EducationComponent {
  protected readonly i18n = inject(I18n);
  protected readonly education = SITE.education;
}
