import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';

/**
 * Both games are being upgraded: the cards show "living" placeholders (slow pan over a screenshot,
 * scanlines, pulsing play button) until real gameplay clips and soundtrack files are added.
 */
@Component({
  selector: 'app-games',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent],
  template: `
    <section class="sec" id="games">
      <h2 class="tt rv"><span class="n">04</span>{{ i18n.ui().sections.games }}</h2>
      <p class="lead rv"><app-accent mode="b" [text]="i18n.ui().gamesLead" /></p>
      <div class="gm">
        @for (g of games; track g.slug) {
          <a class="gcard rv" [href]="g.links.play" target="_blank" rel="noopener">
            <div class="clip" [style.--a]="g.hue?.[0]" [style.--b]="g.hue?.[1]">
              <img [src]="g.image" [alt]="g.name" loading="lazy" />
              <span class="scan" aria-hidden="true"></span>
              <span class="play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="#111"><path d="M7 4v16l13-8z" /></svg></span>
              <span class="soon">{{ i18n.ui().clipSoon }}</span>
              <span class="rec" aria-hidden="true">● REC</span>
            </div>
            <div class="gt">
              <p class="kick">{{ i18n.t(g.kicker!) }}</p>
              <h3>{{ g.name }}</h3>
              <p>{{ i18n.t(g.tagline) }}</p>
              <span class="go">{{ i18n.ui().play }}</span>
            </div>
          </a>
        }
      </div>
      <div class="sound rv">
        <span class="disc" aria-hidden="true"><i></i></span>
        <div class="sinfo"><p class="kick y">{{ i18n.ui().soundtrack }}</p><p class="stx">{{ i18n.ui().soundtrackText }}</p></div>
        <span class="eq" aria-hidden="true">@for (b of bars; track $index) { <i></i> }</span>
        <span class="sbtn">{{ i18n.ui().listenSoon }}</span>
      </div>
    </section>
  `,
})
export class GamesComponent {
  protected readonly i18n = inject(I18n);
  protected readonly games = SITE.projects.filter((p) => p.category === 'games');
  protected readonly bars = Array.from({ length: 12 });
}
