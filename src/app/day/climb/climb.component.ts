import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { useScene } from '../engine/use-scene';
import { climbScene } from './climb.scene';

/** Uckange to Grenoble, 2024: bouldering, a sideways traverse from the U4's steel onto the limestone above Grenoble. */
@Component({
  selector: 'section[appClimb]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'hobby seg climb', id: 'climb', '[attr.data-place]': 'i18n.t(SITE.day.places.climb)' },
  template: `
  <h2 class="sr-only">{{ i18n.t(c.title) }}</h2>
  <div class="scene cl-scene">
    <div class="cl-world" id="clWorld">
      <div class="cl-wall cl-steel" id="clSteel" style="background-image: url(assets/art/wall-steel-wide.webp)"></div>
      <div class="cl-wall cl-rock" id="clRock" style="background-image: url(assets/art/wall-rock-wide.webp)"></div>
      <svg class="cl-holds" id="clHolds" aria-hidden="true"></svg>
      <div class="cl-climber" id="clClimber" role="img" [attr.aria-label]="i18n.t(c.alt)"></div>
      <div class="cl-puffs" id="clPuffs" aria-hidden="true"></div>
    </div>
    <svg class="thread scene-thread" id="clThread" aria-hidden="true"></svg>
    <p class="scene-note mono cl-note"><span class="t">{{ c.time }}</span> · {{ i18n.t(c.note) }}<br><span class="cl-step">{{ i18n.t(c.steps[0]) }}</span></p>
  </div>
`,
})
export class ClimbComponent {
  protected readonly i18n = inject(I18n);
  protected readonly SITE = SITE;
  protected readonly c = SITE.day.climb;

  constructor() {
    const steps = this.c.steps.map((s) => this.i18n.t(s)) as [string, string, string];
    useScene((host, ctx) => climbScene(host, ctx, { steps }));
  }
}
