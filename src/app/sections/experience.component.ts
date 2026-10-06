import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, monthsBetween } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';

/** "YYYY-MM" → months since year 0, so dates can be placed on a line. */
function abs(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
}
function ym(a: number): string {
  return `${Math.floor(a / 12)}-${String((a % 12) + 1).padStart(2, '0')}`;
}
function thisMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Experience as a scrubbable timeline: every role is a segment sized by its real length,
 * school time shows as hatched ground behind them, and a playhead follows the pointer and
 * tells you where I was that month. Clicking (or tabbing to) a segment opens the role below.
 */
@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, RouterLink],
  template: `
    <section class="sec" id="experience">
      <h2 class="tt rv"><span class="n">02</span>{{ i18n.ui().sections.experience }}</h2>
      <p class="lead rv"><app-accent mode="b" [text]="i18n.ui().expLead" /></p>

      <div class="tl rv" role="group" [attr.aria-label]="i18n.ui().tlLabel" (keydown)="key($event)">
        <div class="yrs" aria-hidden="true">
          @for (t of ticks(); track t.m) { <span [style.left.%]="t.x" [class.y]="t.now">{{ t.label }}</span> }
        </div>
        <div class="rail" #rail (pointermove)="scrub($event)" (pointerleave)="hover.set(null)" (click)="pick($event)">
          @for (s of school(); track $index) { <span class="sch" [style.left.%]="s.l" [style.width.%]="s.w" aria-hidden="true"></span> }
          @for (s of segs(); track $index; let i = $index) {
            <button
              type="button"
              class="seg"
              [class.on]="sel() === i"
              [class.now]="s.current"
              [style.left.%]="s.l"
              [style.width.%]="s.w"
              [attr.aria-pressed]="sel() === i"
              (click)="choose(i, $event)"
              (focus)="sel.set(i)"
            >
              <b>{{ s.short }}</b><span>{{ s.company }}</span>
            </button>
          }
          <div class="head" [class.live]="!!hover()" [class.l]="headX() < 18" [class.r]="headX() > 82" [style.left.%]="headX()" aria-hidden="true">
            <span class="tip">{{ tip() }}</span>
          </div>
        </div>
        <p class="tlhint" aria-hidden="true">{{ i18n.ui().tlHint }}</p>
        <div class="tabs">
          @for (s of segs(); track $index; let i = $index) {
            <button type="button" [class.on]="sel() === i" (click)="sel.set(i)">{{ s.short }}</button>
          }
        </div>
      </div>

      <div class="xd-wrap" aria-live="polite">
        @for (c of [card()]; track c.i) {
          <article class="xd">
            <div class="xd-l">
              <span class="pill" [class.y]="c.current">{{ c.current ? i18n.ui().nowPill : c.type }}</span>
              <h3>{{ c.title }}</h3>
              <p class="co">{{ c.company }} · {{ c.location }}</p>
              <p class="dt">{{ c.dates }} · <b>{{ c.duration }}</b></p>
            </div>
            <div class="xd-r">
              <ul>
                @for (pt of c.points; track $index) {
                  <li>
                    <app-accent mode="b" [text]="i18n.t(pt)" />
                    @if (pt.case) { <a class="cs" [routerLink]="[]" [fragment]="pt.case">{{ i18n.ui().caseStudy }}</a> }
                  </li>
                }
              </ul>
              <footer>@for (s of c.stack; track s) { <span>{{ s }}</span> }</footer>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18n);
  private readonly rail = viewChild.required<ElementRef<HTMLElement>>('rail');

  protected readonly sel = signal(0);
  /** Month under the pointer while scrubbing, as a fraction of the rail and an absolute month. */
  protected readonly hover = signal<{ f: number; m: number } | null>(null);

  private readonly nowAbs = abs(thisMonth());
  /** Two months of air before the first role, one after this month. */
  private readonly t0 = Math.min(...SITE.experience.map((e) => abs(e.start))) - 2;
  private readonly t1 = this.nowAbs + 2;
  private readonly span = this.t1 - this.t0;

  private x(a: number): number {
    return ((a - this.t0) / this.span) * 100;
  }

  protected readonly segs = computed(() =>
    SITE.experience.map((e) => {
      const s = abs(e.start);
      const en = e.end ? abs(e.end) : this.nowAbs;
      return {
        current: e.end === null,
        short: this.i18n.t(e.short),
        company: e.company,
        l: this.x(s),
        w: this.x(en + 1) - this.x(s),
        s, en,
      };
    }),
  );

  protected readonly school = computed(() =>
    SITE.education
      .map((ed) => ({ l: Math.max(abs(ed.start), this.t0), r: Math.min(abs(ed.end) + 1, this.t1), name: ed.school }))
      .filter((s) => s.r > s.l)
      .map((s) => ({ l: this.x(s.l), w: this.x(s.r) - this.x(s.l), name: s.name })),
  );

  protected readonly ticks = computed(() => {
    const out: { m: number; x: number; label: string; now?: boolean }[] = [];
    for (let y = Math.ceil(this.t0 / 12); y * 12 < this.t1; y++) {
      out.push({ m: y * 12, x: this.x(y * 12), label: String(y) });
    }
    out.push({ m: this.nowAbs, x: this.x(this.nowAbs), label: this.i18n.ui().now, now: true });
    return out;
  });

  protected readonly headX = computed(() => {
    const h = this.hover();
    if (h) return h.f * 100;
    return this.segs()[this.sel()].l;
  });

  protected readonly tip = computed(() => {
    const h = this.hover();
    const ui = this.i18n.ui();
    if (!h) {
      const c = this.card();
      return `${c.dates} · ${c.duration}`;
    }
    const month = this.i18n.month(ym(h.m));
    const i = SITE.experience.findIndex((e) => h.m >= abs(e.start) && h.m <= (e.end ? abs(e.end) : this.nowAbs));
    if (i >= 0) {
      const e = SITE.experience[i];
      const total = monthsBetween(e.start, e.end ?? thisMonth());
      return `${month} · ${this.i18n.t(e.short)} · ${e.company} · ${ui.monthOf(h.m - abs(e.start) + 1, total)}`;
    }
    const ed = SITE.education.find((d) => h.m >= abs(d.start) && h.m <= abs(d.end));
    return ed ? `${month} · ${ui.studying} ${ed.school}` : month;
  });

  protected readonly card = computed(() => {
    const i = this.sel();
    const e = SITE.experience[i];
    return {
      i,
      current: e.end === null,
      type: this.i18n.t(e.type),
      dates: `${this.i18n.month(e.start)} → ${e.end ? this.i18n.month(e.end) : this.i18n.ui().present}`,
      title: this.i18n.t(e.title ?? e.role),
      company: e.company,
      location: this.i18n.t(e.location),
      duration: this.i18n.duration(e.start, e.end),
      points: e.card,
      stack: e.cardStack,
    };
  });

  protected scrub(e: PointerEvent): void {
    if (e.pointerType === 'touch') return;
    const r = this.rail().nativeElement.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    this.hover.set({ f, m: Math.min(this.t1 - 1, Math.floor(this.t0 + f * this.span)) });
  }

  /** A click on the rail picks the role under the pointer, if any. */
  protected pick(e: MouseEvent): void {
    const r = this.rail().nativeElement.getBoundingClientRect();
    const m = Math.floor(this.t0 + ((e.clientX - r.left) / r.width) * this.span);
    const i = this.segs().findIndex((s) => m >= s.s && m <= s.en);
    if (i >= 0) this.sel.set(i);
  }

  protected choose(i: number, e: Event): void {
    e.stopPropagation();
    this.sel.set(i);
  }

  protected key(e: KeyboardEvent): void {
    const n = this.segs().length;
    if (e.key === 'ArrowLeft') { this.sel.set((this.sel() + 1) % n); e.preventDefault(); }
    if (e.key === 'ArrowRight') { this.sel.set((this.sel() + n - 1) % n); e.preventDefault(); }
  }
}
