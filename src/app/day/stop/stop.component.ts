import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SITE, degreeParts, headingLines, typo } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RichComponent } from '../rich.component';
import { stopLabel, useScene } from '../engine/use-scene';
import { stopScene } from './stop.scene';

type Which = 'niamey' | 'rabat' | 'strasbourg';

/** Each school stop, its school in site.json, its drawing (and the town's strip behind it), and its stop number. */
const STOPS: Record<Which, { n: number; school: string; detail: 'track' | 'field' | null; figure: [string, number, number]; strip?: string }> = {
  niamey: { n: 2, school: 'Niamey', detail: null, figure: ['chess', 853, 900] },
  rabat: { n: 3, school: 'Rabat', detail: 'track', figure: ['board', 796, 900], strip: 'rabat' },
  strasbourg: { n: 4, school: 'Strasbourg', detail: 'field', figure: ['piano', 813, 900], strip: 'strasbourg' },
};

/** Stops 02-04: the three schools, a sentence of the path each, and a drawing of him there. */
@Component({
  selector: 'section[appStop]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent],
  host: { class: 'stop seg', '[class.side-l]': 'which() !== "rabat"', '[class.side-r]': 'which() === "rabat"', '[id]': 'which()', '[attr.data-place]': 'i18n.t(SITE.day.places[which()])' },
  template: `
  <svg class="thread" aria-hidden="true"></svg>
  <div class="stop-text">
    <p class="label mono" [attr.data-stop]="cfg().n" [attr.data-time]="copy().time"><span class="node" aria-hidden="true"></span>{{ label() }}</p>
    <p class="sentence">{{ i18n.t(copy().sentence) }}</p>
    <h2 class="h-stop">@for (l of heading(); track $index) {<span class="ln"><span>{{ l }}</span></span> }</h2>
    <dl class="info">
      @for (row of info(); track row.k) {<div><dt>{{ row.k }}</dt><dd [rich]="row.v"></dd></div>
      }
    </dl>
    @if (body(); as b) {<p class="body" [rich]="b"></p>}
  </div>
  <figure class="stop-fig">
    @if (cfg().strip; as s) {<img decoding="async" class="strip" [src]="'assets/art/' + s + '.webp'" alt="" width="1664" height="640" loading="lazy">}
    <img decoding="async" class="figure" [src]="'assets/art/' + cfg().figure[0] + '.webp'" [alt]="i18n.t(copy().alt)" [attr.width]="cfg().figure[1]" [attr.height]="cfg().figure[2]" loading="lazy">
    <figcaption class="mono">{{ i18n.t(copy().caption) }}</figcaption>
  </figure>
`,
})
export class StopComponent {
  readonly which = input.required<Which>({ alias: 'appStop' });
  protected readonly i18n = inject(I18n);
  protected readonly SITE = SITE;
  protected readonly cfg = computed(() => STOPS[this.which()]);
  protected readonly copy = computed(() => SITE.day[this.which()]);
  private readonly edu = computed(() => SITE.education.find((e) => e.city === this.cfg().school)!);
  private readonly years = computed(() => SITE.route.find((r) => r.city === this.cfg().school)!.years);
  private readonly degree = computed(() => degreeParts(typo(this.i18n.t(this.edu().degree))));
  protected readonly label = computed(() => {
    const e = this.edu();
    return stopLabel(this.i18n.ui().stop, this.cfg().n, this.copy().time, `${e.city}, ${this.i18n.t(e.country)}`);
  });
  protected readonly heading = computed(() => headingLines(this.degree().title));
  protected readonly info = computed(() => {
    const ui = this.i18n.ui().info, e = this.edu(), d = this.cfg().detail;
    const rows = [{ k: ui.school, v: typo(e.school) }, { k: ui.years, v: this.years() }];
    if (e.award) rows.push({ k: ui.award, v: this.i18n.t(e.award).replace(/\b(\d+(?:st|nd|rd|th|er|re|e))\b/g, '**$1**') });
    if (d) rows.push({ k: ui[d], v: this.degree().detail });
    return rows;
  });
  protected readonly body = computed(() => {
    const c = this.copy();
    return 'body' in c ? this.i18n.t(c.body) : null;
  });

  constructor() {
    useScene((host, ctx) => stopScene(host, ctx));
  }
}
