import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/** About: one large paragraph (key phrases in full white), then the route and life outside work. */
@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="about">
      <app-sec-head idx="03" [title]="ui().sections.about" [intro]="ui().intro.about" />
      <div class="g">
        <p class="big" reveal><app-accent mode="b" [text]="i18n.t(statement)" /></p>
      </div>
      <div class="ab2 g">
        <div class="col1" reveal>
          <h3 class="lab">{{ ui().route }}</h3>
          <ol class="route">
            @for (s of route; track s.city) {
              <li [class.now]="s.now">
                <span class="num">{{ s.years }}{{ s.now ? '–' + ui().now : '' }}</span>
                <div><b>{{ s.city }}, {{ i18n.t(s.country) }}</b><em>{{ i18n.t(s.what) }}</em></div>
              </li>
            }
          </ol>
        </div>
        <div class="col2" reveal>
          <h3 class="lab">{{ ui().outside }}</h3>
          @for (para of outside; track $index) { <p>{{ i18n.t(para) }}</p> }
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly statement = SITE.statement;
  protected readonly route = SITE.route;
  protected readonly outside = SITE.outside;
}
