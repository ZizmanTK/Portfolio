import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent],
  template: `
    <section class="sec" id="about">
      <h2 class="tt rv"><span class="n">01</span>{{ i18n.ui().sections.about }}</h2>
      <div class="about">
        <div class="txt rv">
          @for (para of paragraphs; track $index) { <p><app-accent mode="b" [text]="i18n.t(para)" /></p> }
        </div>
        <div class="path rv">
          <p class="kick">{{ i18n.ui().route }}</p>
          <ol>
            @for (stop of route; track stop.city) {
              <li [class.on]="stop.now"><b>{{ stop.city }}</b><span>{{ i18n.t(stop.what) }}</span></li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18n);
  protected readonly paragraphs = SITE.aboutShort;
  protected readonly route = SITE.route;
}
