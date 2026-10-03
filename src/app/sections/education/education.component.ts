import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let ui = i18n.ui();
    <section id="education" class="section" aria-labelledby="education-title">
      <div class="container">
        <h2 id="education-title" class="section-title" data-n="04">{{ ui.sections.education }}</h2>

        <ol role="list" class="list card">
          @for (e of education; track e.school) {
            <li class="item">
              @if (e.logo) {
                <img class="logo" [src]="e.logo" [alt]="e.school + ' logo'" width="48" height="48" loading="lazy" />
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
      grid-template-columns: 48px minmax(0, 1fr) auto;
      gap: 1rem 1.25rem;
      align-items: center;
      padding: 1.1rem 1.5rem;
    }
    .item + .item { border-top: 1px solid var(--line); }
    h3 { font-size: 1.08rem; font-weight: 700; line-height: 1.35; }
    .school { font-weight: 500; }
    a.school:hover { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 3px; }
    .dates { font-weight: 600; font-size: 0.95rem; white-space: nowrap; }
    .logo {
      width: 48px;
      height: 48px;
      padding: 5px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #fff;
      object-fit: contain;
    }
    .logo--blank { display: grid; place-items: center; padding: 0; background: var(--bg-alt); font-weight: 700; color: var(--muted); }
    @media (max-width: 640px) {
      .item { grid-template-columns: 48px minmax(0, 1fr); padding: 1rem; }
      .dates { grid-column: 2; white-space: normal; }
    }
  `,
})
export class EducationComponent {
  protected readonly i18n = inject(I18n);
  protected readonly education = SITE.education;
}
