import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { stopLabel, useScene } from '../engine/use-scene';
import { heroScene } from './hero.scene';

/** The projects the swirl links to (their element ids on the page). */
const PROJECT_IDS: Record<string, string> = { txbot: 'txbot', remind: 'remind', coilcheck: 'coilcheck', 'roll-power': 'rollpower', zktris: 'zktris' };

/** Stop 01 · 05:40 · first light in Niamey: name, AI Engineer, specialties and the quick actions, inside the word current. */
@Component({
  selector: 'section[appHero]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'hero seg', id: 'top', '[attr.data-place]': 'i18n.t(day.places.top)' },
  template: `
 <div class="scene">
  <canvas class="swirl" id="swirl" aria-hidden="true"></canvas>
  <div class="hero-in">
    <p class="hello"><span class="gold">{{ greeting }}</span>, {{ i18n.t(hero.hello) }}</p>
    <h1 class="hero-title">
      <span class="name">{{ name }}</span>
      <span class="role"><span class="ln"><span>{{ i18n.t(hero.role) }}</span></span></span>
    </h1>
    <p class="focus">@for (f of hero.focus; track $index) {@if (!$first) { <span class="sep">·</span> }{{ i18n.t(f) }}}</p>
    <p class="facts"><span class="status"><i aria-hidden="true"></i>{{ i18n.t(hero.status) }}</span><span class="sep">·</span><span>{{ i18n.t(hero.experience) }}</span><span class="sep">·</span><span>{{ i18n.t(hero.location) }}</span></p>
    <p class="actions">
      <a class="btn btn-primary" [href]="i18n.cv()" download>{{ ui().downloadCv }}</a>
      <a class="btn" [href]="'mailto:' + email">{{ ui().email }}</a>
      <a class="btn" [href]="linkedin" rel="noopener">LinkedIn</a>
      <a class="link resume-open" [href]="i18n.anchor('resume')">{{ ui().resumeView }}</a>
    </p>
  </div>
  <p class="hero-day"><span class="ln"><span>{{ i18n.t(day.hero.day[0]) }}</span></span><span class="ln"><span>{{ i18n.t(day.hero.day[1]) }}</span></span></p>
  <div class="hero-foot">
    <img decoding="async" class="niamey-strip" src="assets/art/niamey.webp" alt="" width="1664" height="640">
    <span class="ground" aria-hidden="true"></span>
    <img decoding="async" class="walker" src="assets/art/walk.webp" alt="" width="394" height="820">
    <p class="start mono"><span>{{ start() }}</span><span class="hint">{{ i18n.t(day.hero.hint) }}</span></p>
  </div>
  <svg class="thread scene-thread" id="heroThread" aria-hidden="true"></svg>
 </div>
`,
})
export class HeroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly day = SITE.day;
  protected readonly hero = SITE.hero;
  protected readonly name = SITE.profile.name;
  protected readonly email = SITE.profile.email;
  protected readonly linkedin = SITE.socials.find((s) => s.id === 'linkedin')!.url;
  /** "Sannu," → "Sannu" (the comma follows in plain ink). */
  protected readonly greeting = SITE.hero.greetings[0].replace(/,$/, '');
  protected readonly start = computed(() => stopLabel(this.ui().stop, 1, '05:40', this.i18n.t(this.day.hero.start)));

  constructor() {
    useScene((host, ctx) =>
      heroScene(host, ctx, {
        words: SITE.day.swirl.map((w) => (typeof w === 'string' ? w : this.i18n.t(w))),
        links: Object.fromEntries(SITE.projects.filter((p) => PROJECT_IDS[p.slug]).map((p) => [p.name, '#' + PROJECT_IDS[p.slug]])),
      }),
    );
  }
}
