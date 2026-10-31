import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { useScene } from '../engine/use-scene';
import { stopScene } from '../stop/stop.scene';

const P = SITE.projects.find((p) => p.slug === 'coilcheck')!;

/** The real CoilCheck output, right after the drawn one (a scan line crosses it as it comes up the screen). */
@Component({
  selector: 'section[appCoilReal]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  host: { class: 'cc-real seg', id: 'coilcheck-real', '[attr.data-place]': 'i18n.t(SITE.day.places.uckange)' },
  template: `
  <svg class="thread" aria-hidden="true"></svg>
  <article class="project" id="coilcheck">
    <p class="mono cc-real-cap">{{ i18n.t(SITE.day.uckange.realCaption) }}</p>
    <div class="project-media plate" id="coilPlate"><span class="scan" aria-hidden="true"></span><img [src]="p.image" [alt]="i18n.t(SITE.day.uckange.realAlt)" width="1400" height="509" loading="lazy" decoding="async"></div>
    <dl class="project-row">
      <div class="pr-name"><dt class="sr-only">{{ ui().row.project }}</dt><dd><b>{{ p.name }}</b> <span class="muted">{{ i18n.t(p.kicker!) }}</span></dd></div>
      <div><dt class="sr-only">{{ ui().row.when }}</dt><dd>{{ p.when }}</dd></div>
      <div class="pr-desc"><dt class="sr-only">{{ ui().row.what }}</dt><dd>{{ i18n.t(p.tagline) }}</dd></div>
      <div><dt class="muted">{{ ui().row.builtWith }}</dt><dd>{{ builtWith() }}</dd></div>
    </dl>
  </article>
`,
})
export class CoilRealComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
  protected readonly p = P;
  /** "TensorFlow, Anomalib, OpenCV, CNNs." → without the full stop, as a list. */
  protected readonly builtWith = () => this.i18n.t(P.builtWith!).replace(/\.$/, '');

  constructor() {
    useScene((host, ctx) => stopScene(host, ctx));
  }
}
