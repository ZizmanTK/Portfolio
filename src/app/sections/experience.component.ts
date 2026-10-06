import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal, viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { Scroll } from '../core/scroll';
import { AccentTextComponent } from '../shared/accent-text.component';

/** Oldest first: the section reads as a journey from the steel line to the current permanent role. */
const ROLES = [...SITE.experience].reverse();

/**
 * Experience pins to the screen and scrolling walks through the roles, oldest to now:
 * the rail fills, the year in the background changes, and each role's card slides in.
 * Clicking a role scrolls to its stop.
 */
@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, RouterLink],
  template: `
    <section class="sec" id="experience">
      <h2 class="tt rv"><span class="n">02</span>{{ i18n.ui().sections.experience }}</h2>
      <p class="lead rv"><app-accent mode="b" [text]="i18n.ui().expLead" /></p>

      <div class="jr" #pin [style.--n]="roles().length">
        <div class="jr-in">
          <ol class="jl">
            <i class="fill" aria-hidden="true"></i>
            @for (r of roles(); track $index; let i = $index) {
              <li [class.on]="sel() === i" [class.past]="sel() > i" [class.now]="r.current">
                <button type="button" (click)="go(i)" [attr.aria-current]="sel() === i ? 'step' : null">
                  <span class="yr">{{ r.year }}</span>
                  <b>{{ r.short }}</b>
                  <span class="co">{{ r.company }}</span>
                </button>
              </li>
            }
          </ol>

          <div class="jd" aria-live="polite">
            @for (c of [card()]; track c.i) {
              <p class="ghost" aria-hidden="true">{{ c.current ? i18n.ui().now : c.year }}</p>
              <article class="jc">
                <p class="step kick"><span class="y">{{ c.i + 1 < 10 ? '0' : '' }}{{ c.i + 1 }}</span> / {{ roles().length < 10 ? '0' : '' }}{{ roles().length }}</p>
                <span class="pill" [class.y]="c.current">{{ c.current ? i18n.ui().nowPill : c.type }}</span>
                <h3>{{ c.title }}</h3>
                <p class="co">{{ c.company }} · {{ c.location }}</p>
                <p class="dt">{{ c.dates }} · <b>{{ c.duration }}</b></p>
                <ul>
                  @for (pt of c.points; track $index) {
                    <li [style.--k]="$index">
                      <app-accent mode="b" [text]="i18n.t(pt)" />
                      @if (pt.case) { <a class="cs" [routerLink]="[]" [fragment]="pt.case">{{ i18n.ui().caseStudy }}</a> }
                    </li>
                  }
                </ul>
                <footer>@for (s of c.stack; track s) { <span>{{ s }}</span> }</footer>
              </article>
            }
            <i class="q" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18n);
  private readonly scroll = inject(Scroll);
  private readonly pin = viewChild.required<ElementRef<HTMLElement>>('pin');
  protected readonly sel = signal(0);

  protected readonly roles = computed(() =>
    ROLES.map((e) => ({
      current: e.end === null,
      year: e.start.slice(0, 4),
      short: this.i18n.t(e.short),
      company: e.company,
    })),
  );

  protected readonly card = computed(() => {
    const i = this.sel();
    const e = ROLES[i];
    return {
      i,
      current: e.end === null,
      year: e.start.slice(0, 4),
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

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.pin().nativeElement;
      const n = ROLES.length;
      const off = this.scroll.register(el, 'pin', (p) => {
        const x = p * n;
        const i = Math.min(n - 1, Math.floor(x));
        // --q: progress through the current role, drives the thin bar under the card.
        el.style.setProperty('--q', Math.min(1, x - i).toFixed(3));
        if (i !== this.sel()) this.sel.set(i);
      });
      destroy.onDestroy(off);
    });
  }

  /** Scroll to the middle of a role's stretch of the pinned section. */
  protected go(i: number): void {
    const el = this.pin().nativeElement;
    const top = el.getBoundingClientRect().top + scrollY;
    const run = el.offsetHeight - innerHeight;
    this.scroll.toY(top + ((i + 0.35) / ROLES.length) * run);
  }
}
