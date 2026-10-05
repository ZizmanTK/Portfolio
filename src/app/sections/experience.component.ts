import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, monthsBetween } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';

function thisMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, RouterLink],
  template: `
    <section class="sec" id="experience">
      <h2 class="tt rv"><span class="n">02</span>{{ i18n.ui().sections.experience }}</h2>
      <p class="lead rv"><app-accent mode="b" [text]="i18n.ui().expLead" /></p>
      <div class="xc">
        @for (c of cards(); track $index) {
          <article class="xcard rv" [class.now]="c.current" [style.--d]="c.share + '%'">
            <div class="xc-in">
              <header>
                <span class="pill" [class.y]="c.current">{{ c.current ? i18n.ui().nowPill : c.type }}</span>
                <span class="dt">{{ c.dates }}</span>
              </header>
              <h3>{{ c.title }}</h3>
              <p class="co">{{ c.company }} · {{ c.location }}</p>
              <div class="dur"><i></i><span>{{ c.duration }}</span></div>
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
      <p class="swipe" aria-hidden="true">{{ i18n.ui().swipe }}</p>
      <div class="xrail rv" aria-hidden="true">
        <span class="y">{{ i18n.ui().now }}</span><i></i><span>2025</span><i></i><span>2024</span><i></i><span>2023</span>
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18n);

  protected readonly cards = computed(() => {
    const now = thisMonth();
    const months = SITE.experience.map((e) => monthsBetween(e.start, e.end ?? now));
    const longest = Math.max(...months);
    return SITE.experience.map((e, i) => ({
      current: e.end === null,
      type: this.i18n.t(e.type),
      dates: `${this.i18n.month(e.start)} → ${e.end ? this.i18n.month(e.end) : this.i18n.ui().present}`,
      title: this.i18n.t(e.title ?? e.role),
      company: e.company,
      location: this.i18n.t(e.location),
      duration: this.i18n.duration(e.start, e.end),
      share: Math.round((months[i] / longest) * 100),
      points: e.card,
      stack: e.cardStack,
    }));
  });
}
