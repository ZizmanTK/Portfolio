import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { type L, SITE, headingLines } from '../../core/content';
import { I18n } from '../../core/i18n';
import { InViewVideoDirective } from '../../shared/in-view-video.directive';
import { RichComponent } from '../rich.component';
import { stopLabel, useScene } from '../engine/use-scene';
import { stopScene } from '../stop/stop.scene';

/** The two games, their element ids (the swirl links to them), their clips' size and their description. */
const GAMES: { slug: string; id: string; size: [number, number]; aria: (d: typeof SITE.day.after) => L }[] = [
  { slug: 'zktris', id: 'zktris', size: [1280, 720], aria: (d) => d.zktris },
  { slug: 'roll-power', id: 'rollpower', size: [960, 540], aria: (d) => d.rollPower },
];

/** Stop 09 · 21:40 · after hours: the hobbies, and the two games playing in view. */
@Component({
  selector: 'section[appAfter]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent, InViewVideoDirective],
  host: { class: 'stop seg side-l after night', id: 'after', '[attr.data-place]': 'i18n.t(SITE.day.places.afterHours)' },
  template: `
  <svg class="thread" aria-hidden="true"></svg>
  <div class="stop-text">
    <p class="label mono" data-stop="9" [attr.data-time]="a.time"><span class="node" aria-hidden="true"></span>{{ label() }}</p>
    <h2 class="h-stop">@for (l of heading(); track $index) {<span class="ln"><span>{{ l }}</span></span> }</h2>
    <p class="body" [rich]="i18n.t(a.body)"></p>
    <p class="hobbies mono">{{ hobbies() }}</p>
  </div>
  <div class="games">
    @for (g of games; track g.id) {
    <article class="project game" [id]="g.id">
      <div class="project-media frame"><video class="demo" inViewPlay [src]="g.p.video" [poster]="g.p.image" [attr.width]="g.size[0]" [attr.height]="g.size[1]" muted loop playsinline preload="none" [attr.aria-label]="i18n.t(g.aria(a))"></video></div>
      <dl class="project-row">
        <div class="pr-name"><dt class="sr-only">{{ ui().row.game }}</dt><dd><b>{{ g.p.name }}</b> <span class="muted">{{ i18n.t(g.p.kicker!) }}</span></dd></div>
        <div class="pr-desc"><dt class="sr-only">{{ ui().row.what }}</dt><dd>{{ i18n.t(g.p.tagline) }}</dd></div>
        <div><dt class="sr-only">{{ ui().row.links }}</dt><dd><a class="link" [href]="g.p.links.play" rel="noopener">{{ ui().playOn }}</a> <a class="link" [href]="g.p.links.github" rel="noopener">GitHub</a></dd></div>
      </dl>
    </article>
    }
  </div>
`,
})
export class AfterComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
  protected readonly a = SITE.day.after;
  protected readonly games = GAMES.map((g) => ({ ...g, p: SITE.projects.find((p) => p.slug === g.slug)! }));
  protected readonly label = computed(() => stopLabel(this.ui().stop, 9, this.a.time, this.i18n.t(SITE.day.places.afterHours)));
  protected readonly heading = computed(() => headingLines(this.i18n.t(this.a.title)));
  protected readonly hobbies = computed(() => SITE.interests.map((x) => this.i18n.t(x)).join(' · '));

  constructor() {
    useScene((host, ctx) => stopScene(host, ctx));
  }
}
