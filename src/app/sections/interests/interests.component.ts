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
        <app-section-heading index="05" [file]="ui.files.interests" [title]="ui.titles.interests" headingId="interests-title" />
      </div>
      <ul role="list" class="rail container">
        @for (it of interests; track it.label; let i = $index) {
          <li class="tile" [appReveal]="(i % 3) * 70">
            <img [src]="it.image" alt="" width="720" height="900" loading="lazy" />
            <span class="box det" aria-hidden="true"><span class="det__tag">{{ it.label }} {{ it.score }}</span></span>
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
      border-radius: var(--radius);
      background: var(--surface-2);
      isolation: isolate;
    }
    .tile img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -2;
      filter: saturate(0.85);
      transition: transform 1s var(--ease), filter 0.5s var(--ease);
    }
    .tile:hover img { transform: scale(1.05); filter: saturate(1.05); }
    .tile::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(180deg, rgb(8 9 12 / 0.1) 30%, rgb(8 9 12 / 0.85));
    }
    .box {
      position: absolute;
      inset: 14% 12% 34% 12%;
      --det-len: 18px;
      transition: inset 0.5s var(--ease);
    }
    .box::after { inset: 0; }
    .box .det__tag { left: 0; top: -22px; }
    .tile:hover .box { inset: 10% 8% 30% 8%; }
    .tile__text { position: absolute; inset: auto 0 0 0; padding: 1.3rem; color: #f2f1ec; }
    .tile__text h3 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
    .tile__text p { margin-top: 0.35rem; font-size: 0.9rem; color: rgb(242 241 236 / 0.8); }
    @media (max-width: 900px) {
      .rail {
        grid-template-columns: none;
        grid-auto-flow: column;
        grid-auto-columns: min(74vw, 300px);
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
