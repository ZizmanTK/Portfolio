import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/** Side projects, kept secondary: two games (being upgraded) and the soundtrack line. */
@Component({
  selector: 'app-games',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="games">
      <app-sec-head idx="05" [title]="ui().sections.games" [intro]="ui().intro.games" />
      <div class="g">
        <div class="side">
          @for (g of games; track g.slug; let i = $index) {
            <a class="gm" [href]="g.links.play" target="_blank" rel="noopener" reveal>
              <div class="im">
                <img [src]="g.image" alt="" loading="lazy" />
                <span class="soon">{{ i === 0 ? ui().clipSoon : ui().upgrading }}</span>
              </div>
              <h3>{{ g.name }}</h3>
              <p>{{ i18n.t(g.tagline) }}</p>
              <span class="lk">{{ ui().play }}</span>
            </a>
          }
        </div>
        <div class="ost" reveal>
          <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span>{{ ui().soundtrack }}</span>
          <span class="s">{{ ui().soundtrackSoon }}</span>
        </div>
      </div>
    </section>
  `,
})
export class GamesComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly games = SITE.projects.filter((p) => p.category === 'games');
}
