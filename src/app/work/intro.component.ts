import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { RichComponent } from '../day/rich.component';
import { DepthDirective } from '../shared/depth.directive';
import { FitTextDirective } from '../shared/fit-text.directive';
import { InViewDirective } from '../shared/in-view.directive';

/**
 * The first screen and the sheet under it. First screen: the name behind the photo, the title, the specialties, open
 * to work, his years at BASSETTI and where, the message and its proof, the CV and the ways to reach Aziz: what a
 * recruiter decides on in the first seconds is all there. Sheet: four facts.
 */
@Component({
  selector: 'section[appIntro]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent, DepthDirective, FitTextDirective, InViewDirective],
  host: { class: 'wk-intro', id: 'top' },
  template: `
  <div class="wk-hero wk-gr wk-g-paper" wkDepth>
    <h1 class="wk-name"><span wkFit><span class="wk-ln"><span>{{ me.firstName }}</span></span> <br><span class="wk-ln"><span>{{ me.lastName }}</span></span></span></h1>
    <img class="wk-me" src="assets/img/portrait-cutout.webp" [alt]="me.name" width="1368" height="1823" fetchpriority="high" decoding="async">
    <div class="wk-tag">
      <p class="wk-role">{{ i18n.show(hero.role) }}</p>
      <div class="wk-tag-t">
        <p class="wk-focus">@for (f of focus(); track $index) {<span>{{ f }}@if (!$last) {&nbsp;·}</span> }</p>
        <p class="wk-lab wk-where"><span class="wk-status" wkInView="0px"><i aria-hidden="true"></i><b>{{ i18n.show(hero.status) }}</b></span> <span>{{ i18n.show(hero.experience) }}</span> <span>{{ i18n.show(hero.location) }}</span></p>
      </div>
    </div>
    <div class="wk-say">
      <p class="wk-lede" [rich]="i18n.show(SITE.work.message)"></p>
      <p class="wk-said" [rich]="i18n.show(SITE.work.proof)"></p>
      <p class="wk-cta">
        <a class="wk-btn" [href]="i18n.cv()" download>{{ ui().downloadCv }} <span aria-hidden="true">↓</span></a>
        <a class="wk-tl wk-em" [href]="'mailto:' + me.email">{{ me.email }}</a>
        <span class="wk-cta-o"><a class="wk-tl" [href]="social.linkedin" rel="noopener">LinkedIn</a> <a class="wk-tl" [href]="social.github" rel="noopener">GitHub</a></span>
      </p>
    </div>
  </div>
  <div class="wk-short wk-sheet wk-gr wk-g-white">
    <div class="wk-g">
      <p class="wk-lab wk-no"><b>(01)</b> {{ ui().work.inShort }}</p>
      <dl class="wk-facts">
        <div><dt class="wk-lab">{{ ui().resume.experience }}</dt><dd>{{ i18n.show(hero.experience) }}</dd></div>
        <div><dt class="wk-lab">{{ ui().work.degree }}</dt><dd>{{ i18n.show(SITE.work.degree) }}</dd></div>
        <div><dt class="wk-lab">{{ ui().resume.languages }}</dt><dd>{{ i18n.show(hero.languages) }}</dd></div>
        <div><dt class="wk-lab">{{ ui().work.basedIn }}</dt><dd>{{ i18n.show(hero.location) }}</dd></div>
      </dl>
    </div>
  </div>
`,
})
export class IntroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
  protected readonly me = SITE.profile;
  protected readonly hero = SITE.hero;
  protected readonly social = Object.fromEntries(SITE.socials.map((s) => [s.id, s.url])) as Record<'github' | 'linkedin' | 'itch', string>;
  protected readonly focus = computed(() => SITE.hero.focus.map((f) => this.i18n.show(f)));
}
