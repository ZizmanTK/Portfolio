import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

@Component({
  selector: 'app-interests',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective],
  template: `
    @let ui = i18n.ui();
    <section id="interests" class="section" aria-labelledby="interests-title">
      <div class="container">
        <app-section-heading index="06" [label]="ui.sections.interests" [title]="ui.interestsTitle" headingId="interests-title" />
      </div>
      <ul role="list" class="rail container">
        @for (it of interests; track $index; let i = $index) {
          <li class="tile" [appReveal]="(i % 3) * 70">
            <img [src]="it.image" alt="" width="720" height="900" loading="lazy" />
            <div class="tile__text">
              <h3>{{ i18n.t(it.name) }}</h3>
              <p>{{ i18n.t(it.text) }}</p>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .rail {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-block: 0;
    }
    .tile {
      position: relative;
      overflow: hidden;
      aspect-ratio: 4 / 5;
      border-radius: var(--radius-lg);
      background: var(--surface-2);
      isolation: isolate;
    }
    .tile img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
      transition: transform 1s var(--ease);
    }
    .tile:hover img { transform: scale(1.06); }
    .tile::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(180deg, transparent 35%, rgb(10 10 9 / 0.82));
    }
    .tile__text {
      position: absolute;
      inset: auto 0 0 0;
      padding: 1.4rem;
      color: #f5f3ee;
    }
    .tile__text h3 { font-family: var(--font-serif); font-weight: 400; font-size: 2rem; line-height: 1; }
    .tile__text p { margin-top: 0.5rem; font-size: 0.92rem; color: rgb(245 243 238 / 0.82); }
    @media (max-width: 900px) {
      .rail {
        grid-template-columns: none;
        grid-auto-flow: column;
        grid-auto-columns: min(72vw, 300px);
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        padding-bottom: 0.5rem;
      }
      .rail::-webkit-scrollbar { display: none; }
      .tile { scroll-snap-align: start; }
    }
  `,
})
export class InterestsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly interests = SITE.interests;
}
