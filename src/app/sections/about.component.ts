import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE, richText } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';
import { FxDirective } from '../shared/fx.directive';

interface Word { parts: { t: string; k: boolean }[] }

/** Split "**marked**" text into words, keeping punctuation glued to the word before it. */
function words(text: string): Word[] {
  const out: Word[] = [];
  let open = false; // the last word can still take more characters
  for (const seg of richText(text)) {
    for (const tok of seg.text.split(/(\s+)/)) {
      if (!tok) continue;
      if (/^\s+$/.test(tok)) { open = false; continue; }
      if (open && out.length) out[out.length - 1].parts.push({ t: tok, k: seg.bold });
      else out.push({ parts: [{ t: tok, k: seg.bold }] });
      open = true;
    }
  }
  return out;
}

/* Equirectangular projection around 35°N, in SVG units. */
const LON0 = -12, LAT1 = 54, K = 9.2, COS = Math.cos((35 * Math.PI) / 180), PADX = 70, PADY = 24;
const px = (lon: number) => PADX + (lon - LON0) * COS * K;
const py = (lat: number) => PADY + (LAT1 - lat) * K;

/**
 * About = two scroll moments:
 * 1. the section pins and the opening statement lights up word by word (key facts turn yellow);
 * 2. the route from Niamey to Grenoble draws itself on a small map, each stop lighting up in the list.
 */
@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, FxDirective],
  template: `
    <section class="sec" id="about">
      <div class="stmt" fx="pin">
        <div class="stmt-in">
          <h2 class="tt"><span class="n">01</span>{{ i18n.ui().sections.about }}</h2>
          <p class="say" [style.--n]="statement().length">
            @for (w of statement(); track $index) {
              <span class="wd" [style.--i]="$index">@for (pt of w.parts; track $index) {<span [class.k]="pt.k">{{ pt.t }}</span>}</span>{{ ' ' }}
            }
          </p>
        </div>
      </div>

      <div class="route" fx="view">
        <div class="rt-txt">
          <p class="txt"><app-accent mode="b" [text]="i18n.t(bio)" /></p>
          <p class="kick">{{ i18n.ui().route }}</p>
          <ol>
            @for (s of stops; track s.city) {
              <li [class.on]="s.now" [style.--t]="s.t"><b>{{ s.city }}</b><span>{{ s.years }} · {{ i18n.t(s.what) }}</span></li>
            }
          </ol>
        </div>
        <svg class="map" [attr.viewBox]="'0 0 ' + W + ' ' + H" aria-hidden="true">
          @for (g of grid; track g.lat) {
            <line [attr.x1]="0" [attr.x2]="W" [attr.y1]="g.y" [attr.y2]="g.y" class="gl" />
            <text [attr.x]="W - 4" [attr.y]="g.y - 6" class="gt" text-anchor="end">{{ g.lat }}°N</text>
          }
          <path class="trail" [attr.d]="d" />
          <path class="trip" [attr.d]="d" pathLength="1" />
          @for (s of stops; track s.city) {
            <g class="stop" [class.now]="s.now" [style.--t]="s.t">
              @if (s.now) { <circle [attr.cx]="s.x" [attr.cy]="s.y" r="14" class="ring" /> }
              <circle [attr.cx]="s.x" [attr.cy]="s.y" r="6" class="dot" />
              <text [attr.x]="s.x + (s.left ? -14 : 14)" [attr.y]="s.y + 5" [attr.text-anchor]="s.left ? 'end' : 'start'">{{ s.city }}</text>
            </g>
          }
        </svg>
      </div>
    </section>
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18n);
  protected readonly bio = SITE.aboutShort[1];
  protected readonly statement = computed(() => words(this.i18n.t(SITE.statement)));

  protected readonly W = Math.round(px(14) + 20);
  protected readonly H = Math.round(py(8));
  protected readonly grid = [10, 20, 30, 40, 50].map((lat) => ({ lat, y: py(lat) }));

  /** Stops with SVG position, label side, and where along the trip (0 → 1) the line reaches them. */
  protected readonly stops = (() => {
    const pts = SITE.route.map((r) => ({ ...r, x: px(r.lon), y: py(r.lat) }));
    const seg = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
    const total = seg.reduce((a, b) => a + b, 0);
    let acc = 0;
    return pts.map((p, i) => {
      if (i) acc += seg[i - 1];
      return { ...p, t: +(acc / total).toFixed(3), left: p.city === 'Uckange' || p.city === 'Rabat' };
    });
  })();

  /** Gentle arcs between stops, like flight paths. */
  protected readonly d = this.stops
    .map((s, i) => {
      if (!i) return `M${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
      const a = this.stops[i - 1];
      const mx = (a.x + s.x) / 2, my = (a.y + s.y) / 2;
      const nx = -(s.y - a.y) * 0.18, ny = (s.x - a.x) * 0.18;
      return `Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
    })
    .join(' ');
}
