import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { useScene } from '../engine/use-scene';
import { knightScene } from './knight.scene';

/** Niamey to Rabat, 2018: chess, a knight's move north (the board is drawn by the scene). */
@Component({
  selector: 'section[appKnight]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'hobby seg knight', id: 'knight', '[attr.data-place]': 'i18n.t(k.place)' },
  template: `
  <h2 class="sr-only">{{ i18n.t(k.title) }}</h2>
  <div class="scene">
    <svg class="board" id="board" aria-hidden="true"></svg>
    <img decoding="async" class="knight-piece" id="knightPiece" src="assets/art/knight.webp" alt="" width="211" height="400">
    <p class="scene-note mono"><span class="t">{{ k.time }}</span> · {{ i18n.t(k.note[0]) }}<br>{{ i18n.t(k.note[1]) }}</p>
  </div>
`,
})
export class KnightComponent {
  protected readonly i18n = inject(I18n);
  protected readonly k = { ...SITE.day.knight, place: SITE.day.places.knight };

  constructor() {
    useScene((host, ctx) => knightScene(host, ctx, { from: this.i18n.t(this.k.from), to: this.i18n.t(this.k.to) }));
  }
}
