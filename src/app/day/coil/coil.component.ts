import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE, headingLines } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RichComponent } from '../rich.component';
import { roleInfo } from '../role-info';
import { stopLabel, useScene } from '../engine/use-scene';
import { coilScene } from './coil.scene';

/** The ArcelorMittal internship (stop 05), and where it happened (the route stop for Uckange). */
const JOB = SITE.experience.find((e) => e.company.startsWith('ArcelorMittal'))!;
const PLACE = SITE.route.find((r) => r.city === 'Uckange')!;

/**
 * Stop 05 · Uckange: CoilCheck as a set piece (a coil rolls in, the camera pushes in, the scan leaves the anomaly
 * heatmap, a box locks onto the defect), then the facts of the internship.
 */
@Component({
  selector: 'section[appCoil]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent],
  host: { class: 'hobby seg coil', id: 'uckange', '[attr.data-place]': 'i18n.t(SITE.day.places.uckange)' },
  template: `
  <div class="scene cc-scene">
    <svg class="cc-floor" id="ccFloor" aria-hidden="true"></svg>
    <img decoding="async" class="cc-man" id="ccMan" src="assets/art/safety2.webp" [alt]="i18n.t(c.alt)" width="286" height="820">
    <div class="cc-cam" id="ccCam">
      <canvas class="cc-coil" id="ccCoil" role="img" [attr.aria-label]="i18n.t(c.coil)"></canvas>
      <div class="cc-heat-win" id="ccHeatWin" aria-hidden="true"><canvas class="cc-heat" id="ccHeat"></canvas></div>
      <canvas class="cc-hot" id="ccHot" aria-hidden="true"></canvas>
      <span class="cc-scan" id="ccScan" aria-hidden="true"></span>
    </div>
    <div class="cc-box" id="ccBox" aria-hidden="true"><span class="cc-tag">Anomalous 79%</span></div>
    <div class="stop-text cc-facts" id="ccFacts">
      <p class="label mono" data-anchor="0.84" data-stop="5" [attr.data-time]="c.time"><span class="node" aria-hidden="true"></span>{{ label() }}</p>
      <p class="sentence">{{ i18n.t(c.sentence) }}</p>
      <h2 class="h-stop">@for (l of heading(); track $index) {<span class="ln"><span>{{ l }}</span></span> }</h2>
      <dl class="info">
        @for (row of info(); track row.k) {<div><dt>{{ row.k }}</dt><dd>{{ row.v }}</dd></div>
        }
      </dl>
      <ul class="points">
        @for (h of job.highlights; track $index) {<li [rich]="i18n.t(h)"></li>
        }
      </ul>
    </div>
    <p class="scene-note mono cc-note"><span class="t">{{ c.time }}</span> · {{ i18n.t(c.note) }}<br>CoilCheck{{ colon() }} <span class="cc-step">{{ i18n.t(c.steps[0]) }}</span></p>
    <svg class="thread scene-thread" id="ccThread" aria-hidden="true"></svg>
  </div>
`,
})
export class CoilComponent {
  protected readonly i18n = inject(I18n);
  protected readonly SITE = SITE;
  protected readonly c = SITE.day.uckange;
  protected readonly job = JOB;
  protected readonly label = computed(() => stopLabel(this.i18n.ui().stop, 5, this.c.time, `${PLACE.city}, ${this.i18n.t(PLACE.country)}`));
  protected readonly heading = computed(() => headingLines(this.i18n.t(JOB.title ?? JOB.role)));
  protected readonly info = computed(() => roleInfo(this.i18n, JOB));
  /** French puts a narrow no-break space before a colon. */
  protected readonly colon = computed(() => (this.i18n.lang() === 'fr' ? ' :' : ':'));

  constructor() {
    const steps = this.c.steps.map((s) => this.i18n.t(s)) as [string, string, string, string, string];
    useScene((host, ctx) => coilScene(host, ctx, { steps }));
  }
}
