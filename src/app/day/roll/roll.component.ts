import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { useScene } from '../engine/use-scene';
import { rollScene } from './roll.scene';

/** After work: a roll of the die, as in Roll Power. */
@Component({
  selector: 'section[appRoll]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'hobby seg roll night', id: 'roll', '[attr.data-place]': 'i18n.t(SITE.day.places.afterHours)' },
  template: `
  <h2 class="sr-only">{{ i18n.t(r.title) }}</h2>
  <svg class="thread" aria-hidden="true"></svg>
  <img decoding="async" class="dicer" src="assets/art/dice.webp" [alt]="i18n.t(r.alt)" width="431" height="820" loading="lazy">
  <svg class="die" id="die" viewBox="-60 -60 120 120" aria-hidden="true"></svg>
  <p class="roll-note mono">{{ i18n.t(r.note) }}</p>
`,
})
export class RollComponent {
  protected readonly i18n = inject(I18n);
  protected readonly SITE = SITE;
  protected readonly r = SITE.day.roll;

  constructor() {
    useScene((host, ctx) => rollScene(host, ctx));
  }
}
