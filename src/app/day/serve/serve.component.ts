import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE, plain } from '../../core/content';
import { I18n } from '../../core/i18n';
import { stopLabel, useScene } from '../engine/use-scene';
import { serveScene } from './serve.scene';

/** The six volleyball drawings, in order, with their size (height 1000). */
const POSES: [string, number][] = [['ready', 257], ['set', 196], ['approach', 637], ['takeoff', 277], ['cocked', 441], ['contact', 311]];

/**
 * Stop 10 · 22:30 · the finale: he sets the ball to himself, spikes it, it flies at you and the contact opens out of it.
 * Open to work, email, CV, LinkedIn, GitHub, itch.io and the résumé view.
 */
@Component({
  selector: 'section[appServe]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'hobby seg serve night', id: 'contact', '[attr.data-place]': 'i18n.t(SITE.day.places.now)' },
  template: `
  <div class="scene sv-scene">
    <div class="sv-sky" id="svSky" aria-hidden="true"></div>
    <div class="sv-world" id="svWorld">
      <svg class="sv-court" id="svCourt" aria-hidden="true"></svg>
      @for (p of poses; track p[0]) {<img class="sv-pose" [id]="'sv-' + p[0]" [src]="'assets/art/vb-' + p[0] + '.webp'" alt="" [attr.width]="p[1]" height="1000" decoding="async">
      }
      <svg class="sv-net" id="svNet" aria-hidden="true"></svg>
    </div>
    <canvas class="sv-fx" id="svFx" aria-hidden="true"></canvas>
    <div class="contact" id="svContact">
      <img class="sv-wave" src="assets/art/signature.webp" [alt]="i18n.t(c.wave)" width="361" height="820" loading="lazy" decoding="async">
      <div class="contact-in">
        <p class="label mono" data-anchor="0.9" data-stop="10" [attr.data-time]="c.time"><span class="node" aria-hidden="true"></span>{{ label() }}</p>
        <p class="status big"><i aria-hidden="true"></i>{{ i18n.t(SITE.hero.status) }}</p>
        <h2 class="h-contact"><span class="ln"><span><span class="gold">{{ hello()[0] }}</span>{{ hello()[1] }}</span></span> <span class="ln"><span>{{ hello()[2] }}</span></span></h2>
        <p class="body">{{ i18n.t(SITE.contact.text) }}</p>
        <p class="actions">
          <a class="btn btn-primary" [href]="'mailto:' + email">{{ email }}</a>
          <a class="btn" [href]="i18n.cv()" download>{{ i18n.ui().downloadCv }}</a>
          <a class="btn" [href]="social.linkedin" rel="noopener">LinkedIn</a>
        </p>
        <p class="socials"><a class="link" [href]="social.github" rel="noopener">GitHub</a> <a class="link" [href]="social.itch" rel="noopener">itch.io</a> <a class="link resume-open" [href]="i18n.anchor('resume')">{{ i18n.ui().resumeView }}</a></p>
        <p class="mission">{{ i18n.t(SITE.profile.mission) }}</p>
      </div>
    </div>
    <p class="scene-note mono sv-note" aria-hidden="true"><span class="t">{{ c.time }}</span> · {{ i18n.t(c.note) }}</p>
    <svg class="thread scene-thread" id="svThread" aria-hidden="true"></svg>
  </div>
`,
})
export class ServeComponent {
  protected readonly i18n = inject(I18n);
  protected readonly SITE = SITE;
  protected readonly c = SITE.day.contact;
  protected readonly poses = POSES;
  protected readonly email = SITE.profile.email;
  protected readonly social = Object.fromEntries(SITE.socials.map((s) => [s.id, s.url])) as Record<'github' | 'linkedin' | 'itch', string>;
  protected readonly label = computed(() => stopLabel(this.i18n.ui().stop, 10, this.c.time, this.i18n.t(SITE.day.places.now)));
  /** "Sannu · Bonjour · Hello." → the first greeting (in gold), the rest of the first line, and the second line. */
  protected readonly hello = computed(() => {
    const t = plain(this.i18n.t(SITE.contact.title)), cut = t.lastIndexOf(' · ') + 3;
    const first = t.slice(0, cut).trimEnd(), word = first.split(' ')[0];
    return [word, first.slice(word.length), t.slice(cut)];
  });

  constructor() {
    useScene((host, ctx) => serveScene(host, ctx));
  }
}
