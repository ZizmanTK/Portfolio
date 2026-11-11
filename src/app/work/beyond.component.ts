import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { type L, SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { InViewVideoDirective } from '../shared/in-view-video.directive';
import { RichComponent } from '../day/rich.component';

/** The five postcards of the day, each leading to its stop of the story, each laid down a little askew. */
const CARDS = [
  { city: 'Niamey', stop: 'niamey', tilt: '-3deg' }, { city: 'Rabat', stop: 'rabat', tilt: '2deg' },
  { city: 'Strasbourg', stop: 'strasbourg', tilt: '-1.5deg' }, { city: 'Uckange', stop: 'uckange', tilt: '2.5deg' },
  { city: 'Grenoble', stop: 'bassetti', tilt: '-2deg' },
];
/** The two games, their element ids, their clips' size and their description. */
const GAMES: { slug: string; id: string; size: [number, number]; aria: L }[] = [
  { slug: 'zktris', id: 'zktris', size: [1280, 720], aria: SITE.day.after.zktris },
  { slug: 'roll-power', id: 'rollpower', size: [960, 540], aria: SITE.day.after.rollPower },
];

/** What comes after the facts: the way to the long version of the story, then life outside work. */
@Component({
  selector: 'section[appBeyond]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent, InViewVideoDirective],
  host: { class: 'wk-beyond wk-gr wk-g-paper' },
  template: `
  <div class="wk-long">
    <h2 class="wk-lab"><b>(04)</b> {{ ui().work.longVersion }}</h2>
    <p>{{ i18n.show(SITE.work.story) }}</p>
    <a class="wk-lab wk-tl" [href]="i18n.story()">{{ ui().work.walk }} <span aria-hidden="true">→</span></a>
  </div>
  <ol class="wk-cards">
    @for (c of cards(); track c.city) {
    <li [style.--tilt]="c.tilt"><a [href]="i18n.story() + '#' + c.stop">
      <img [src]="'assets/art/card-' + c.city.toLowerCase() + '.webp'" [alt]="c.alt" width="600" height="400" loading="lazy" decoding="async">
      <span class="wk-lab"><b>{{ c.city }}</b> <span>{{ c.years }}</span></span>
    </a></li>
    }
  </ol>
  <div class="wk-out wk-g">
    <div class="wk-out-t">
      <h2 class="wk-lab">{{ ui().resume.outside }}</h2>
      <p [rich]="i18n.show(SITE.day.after.body)"></p>
      <p class="wk-lab">{{ hobbies() }}</p>
    </div>
    @for (g of games; track g.id) {
    <article class="wk-game" [id]="g.id">
      <video inViewPlay [src]="g.p.video" [poster]="g.p.image" [attr.width]="g.size[0]" [attr.height]="g.size[1]" muted loop playsinline preload="none" [attr.aria-label]="i18n.show(g.aria)"></video>
      <h3>{{ g.p.name }}</h3>
      <p>{{ i18n.show(g.p.tagline) }}</p>
      <p class="wk-links"><a class="wk-tl" [href]="g.p.links.play" rel="noopener">{{ ui().playOn }}</a> <a class="wk-tl" [href]="g.p.links.github" rel="noopener">GitHub</a></p>
    </article>
    }
  </div>
`,
})
export class BeyondComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
  protected readonly games = GAMES.map((g) => ({ ...g, p: SITE.projects.find((p) => p.slug === g.slug)! }));
  protected readonly hobbies = computed(() => this.i18n.list(SITE.interests.map((x) => this.i18n.show(x))));
  protected readonly cards = computed(() => CARDS.map((c, i) => {
    const r = SITE.route.find((x) => x.city === c.city)!;
    return { ...c, alt: this.i18n.show(SITE.day.resume.cards[i]), years: r.years + (r.now ? `–${this.ui().now}` : '') };
  }));
}
