import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, type Experience } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/** Consecutive roles at the same company, newest first (as in site.json). */
function byCompany(items: Experience[]): Experience[][] {
  const groups: Experience[][] = [];
  for (const e of items) {
    const last = groups.at(-1);
    if (last && last[0].company === e.company) last.push(e);
    else groups.push([e]);
  }
  return groups;
}

/**
 * Experience, one row per company so the time spent there reads as one block (BASSETTI:
 * internship, fixed-term, then permanent). A row opens to show each role with its dates,
 * what I did and the stack. The current company starts open.
 */
@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, RouterLink, RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="experience">
      <app-sec-head idx="#1" [title]="ui().sections.experience" [intro]="ui().intro.experience" />
      <ol class="xp">
        @for (c of companies(); track c.company; let i = $index) {
          <li [class.open]="open().has(i)" reveal>
            <button type="button" [attr.aria-expanded]="open().has(i)" [attr.aria-controls]="'xp-' + i" (click)="toggle(i)">
              <span class="when">
                <b class="num">{{ c.years }}</b>
                <span>@if (c.current) { <i aria-hidden="true"></i> }{{ c.dates }}</span>
                <i class="mark" [style.--m]="'url(' + c.logo + ')'" aria-hidden="true"></i>
              </span>
              <span class="role"><span class="rt"><b>{{ c.company }}</b><span>{{ c.title }} · {{ c.location }}</span></span></span>
              <span class="tog" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" /></svg></span>
            </button>
            <div class="body" [id]="'xp-' + i" role="region" [attr.aria-label]="c.company" [attr.inert]="open().has(i) ? null : ''">
              <div>
                <div class="g">
                  <div class="roles">
                    @for (r of c.roles; track $index) {
                      <div class="rl">
                        @if (c.roles.length > 1) {
                          <p class="rl-h"><b>{{ r.title }}</b><span>{{ r.type }} · {{ r.dates }} · {{ r.duration }}</span></p>
                        }
                        <ul class="pts">
                          @for (pt of r.points; track $index) {
                            <li>
                              <app-accent mode="b" [text]="i18n.t(pt)" />
                              @if (pt.case) { <a [routerLink]="[]" [fragment]="pt.case">{{ ui().caseStudy }}</a> }
                            </li>
                          }
                        </ul>
                      </div>
                    }
                  </div>
                  <div class="stk"><p class="lab">{{ ui().stack }}</p><p>{{ c.stack }}</p></div>
                </div>
              </div>
            </div>
          </li>
        }
      </ol>
    </section>
  `,
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  /** Companies that are open; the current one (first) starts open. */
  protected readonly open = signal(new Set([0]));

  protected readonly companies = computed(() =>
    byCompany(SITE.experience).map((roles) => {
      const latest = roles[0];
      const start = roles[roles.length - 1].start;
      const end = latest.end;
      const years = end
        ? start.slice(0, 4) === end.slice(0, 4) ? start.slice(0, 4) : `${start.slice(0, 4)}–${end.slice(2, 4)}`
        : `${start.slice(0, 4)}–${this.ui().now}`;
      return {
        company: latest.company,
        logo: latest.logo,
        current: end === null,
        years,
        dates: `${this.i18n.month(start)} – ${end ? this.i18n.month(end) : this.ui().present} · ${this.i18n.duration(start, end)}`,
        title: `${this.i18n.t(latest.title ?? latest.role)} · ${this.i18n.t(latest.type)}`,
        location: this.i18n.t(latest.location),
        roles: roles.map((e) => ({
          title: this.i18n.t(e.title ?? e.role),
          type: this.i18n.t(e.type),
          dates: `${this.i18n.month(e.start)} – ${e.end ? this.i18n.month(e.end) : this.ui().present}`,
          duration: this.i18n.duration(e.start, e.end),
          points: e.card,
        })),
        stack: [...new Set(roles.flatMap((e) => e.stack))].join(', '),
      };
    }),
  );

  protected toggle(i: number): void {
    const next = new Set(this.open());
    if (next.has(i)) next.delete(i);
    else next.add(i);
    this.open.set(next);
  }
}
