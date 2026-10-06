import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/**
 * Experience as a list a recruiter can scan in seconds: dates, role, company, contract.
 * Each row opens to show what I did and the stack; the current role starts open.
 */
@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, RouterLink, RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="experience">
      <app-sec-head idx="#1" [title]="ui().sections.experience" [intro]="ui().intro.experience" />
      <ol class="xp">
        @for (r of rows(); track $index; let i = $index) {
          <li [class.open]="open().has(i)" reveal>
            <button type="button" [attr.aria-expanded]="open().has(i)" [attr.aria-controls]="'xp-' + i" (click)="toggle(i)">
              <span class="when"><b class="num">{{ r.years }}</b><span>@if (r.current) { <i aria-hidden="true"></i> }{{ r.dates }}</span>@if (r.firstAtCompany) { <i class="mark" [style.--m]="'url(' + r.logo + ')'" aria-hidden="true"></i> }</span>
              <span class="role"><span class="rt"><b>{{ r.title }}</b><span>{{ r.company }} · {{ r.type }} · {{ r.location }}</span></span></span>
              <span class="tog" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" /></svg></span>
            </button>
            <div class="body" [id]="'xp-' + i" role="region" [attr.aria-label]="r.title + ', ' + r.company" [attr.inert]="open().has(i) ? null : ''">
              <div>
                <div class="g">
                  <ul class="pts">
                    @for (pt of r.points; track $index) {
                      <li>
                        <app-accent mode="b" [text]="i18n.t(pt)" />
                        @if (pt.case) { <a [routerLink]="[]" [fragment]="pt.case">{{ ui().caseStudy }}</a> }
                      </li>
                    }
                  </ul>
                  <div class="stk"><p class="lab">{{ ui().stack }}</p><p>{{ r.stack }}</p></div>
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
  /** Rows that are open; the current role (first) starts open. */
  protected readonly open = signal(new Set([0]));

  protected readonly rows = computed(() =>
    SITE.experience.map((e, i, all) => ({
      firstAtCompany: i === 0 || all[i - 1].company !== e.company,
      current: e.end === null,
      years: e.end ? (e.start.slice(0, 4) === e.end.slice(0, 4) ? e.start.slice(0, 4) : `${e.start.slice(0, 4)}–${e.end.slice(2, 4)}`) : `${e.start.slice(0, 4)}–${this.ui().now}`,
      dates: `${this.i18n.month(e.start)} – ${e.end ? this.i18n.month(e.end) : this.ui().present} · ${this.i18n.duration(e.start, e.end)}`,
      title: this.i18n.t(e.title ?? e.role),
      company: e.company,
      logo: e.logo,
      type: this.i18n.t(e.type),
      location: this.i18n.t(e.location),
      points: e.card,
      stack: e.stack.join(', '),
    })),
  );

  protected toggle(i: number): void {
    const next = new Set(this.open());
    if (next.has(i)) next.delete(i);
    else next.add(i);
    this.open.set(next);
  }
}
