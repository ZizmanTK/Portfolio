import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE, SKILL_ICONS } from '../core/content';
import { I18n } from '../core/i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/** Skills as ruled rows (group · tools, set large enough to read), then education in the same rhythm. */
@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="skills">
      <app-sec-head idx="#4" [title]="ui().sections.skills" [intro]="ui().intro.skills" />
      <div class="rows">
        @for (g of skills; track $index) {
          <div class="row g" reveal><h3 class="lab">{{ i18n.t(g.group) }}</h3><ul class="sk">@for (it of g.items; track it) { <li [style.--i]="icon(it).mask" [style.--h]="icon(it).hex"><i aria-hidden="true"></i>{{ it }}</li> }</ul></div>
        }
      </div>
      <h3 class="subh lab" id="education" reveal>{{ ui().sections.education }}</h3>
      <ol class="rows edu">
        @for (e of education; track e.school) {
          <li class="row g" reveal>
            <span class="yr"><b class="num">{{ e.start.slice(0, 4) }}–{{ e.end.slice(2, 4) }}</b>@if (e.logo) { <i class="mark" [style.--m]="'url(' + e.logo + ')'" aria-hidden="true"></i> }</span>
            <div class="dg">
              <b>{{ i18n.t(e.degree) }}</b>
              <span>{{ e.school }} · {{ e.city }}, {{ i18n.t(e.country) }}</span>
              @if (e.award) { <p class="aw"><em>{{ ui().award }}</em>{{ i18n.t(e.award) }}</p> }
            </div>
          </li>
        }
      </ol>
    </section>
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly skills = SITE.skills;
  protected readonly education = SITE.education;

  /** Mask URL and hover colour; very dark brand colours fall back to the text colour on this dark page. */
  protected icon(name: string): { mask: string; hex: string } {
    const ic = SKILL_ICONS[name];
    if (!ic) return { mask: 'none', hex: 'var(--ink)' };
    const n = parseInt(ic.hex.slice(1), 16);
    const lum = (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
    return { mask: `url("${ic.mask}")`, hex: lum < 0.35 ? 'var(--ink)' : ic.hex };
  }
}
