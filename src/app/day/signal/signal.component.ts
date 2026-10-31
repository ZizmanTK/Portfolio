import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { useScene } from '../engine/use-scene';
import { signalScene } from './signal.scene';

/** Rabat to Strasbourg, 2020: his field and his music, a wave sampled and played on piano keys. */
@Component({
  selector: 'section[appSignal]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'hobby seg signal', id: 'signal', '[attr.data-place]': 'i18n.t(s.place)' },
  template: `
  <h2 class="sr-only">{{ i18n.t(s.title) }}</h2>
  <div class="scene">
    <svg class="scope" id="scope" aria-hidden="true"></svg>
    <img decoding="async" class="sig-walker" id="sigWalker" src="assets/art/coat.webp" alt="" width="400" height="820" loading="lazy">
    <p class="scene-note mono"><span class="t">{{ s.time }}</span> · {{ i18n.t(s.note[0]) }}<br>{{ i18n.t(s.note[1]) }}</p>
  </div>
`,
})
export class SignalComponent {
  protected readonly i18n = inject(I18n);
  protected readonly s = { ...SITE.day.signal, place: SITE.day.places.signal };

  constructor() {
    const beats = this.s.beats.map((b) => this.i18n.t(b)) as [string, string, string, string];
    useScene((host, ctx) => signalScene(host, ctx, { axis: 'x(t)', beats }));
  }
}
