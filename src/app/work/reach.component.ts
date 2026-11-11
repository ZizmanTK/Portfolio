import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE, plain, typo } from '../core/content';
import { I18n } from '../core/i18n';
import { FitTextDirective } from '../shared/fit-text.directive';
import { InViewDirective } from '../shared/in-view.directive';

/** The end of the page, on gold: open to work, every way to reach Aziz, and the foot of the page. */
@Component({
  selector: 'section[appReach]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [FitTextDirective, InViewDirective],
  host: { class: 'wk-reach wk-sheet wk-gr wk-g-end', id: 'contact', 'aria-labelledby': 'contact-h' },
  template: `
  <div class="wk-g">
    <p class="wk-lab wk-no"><span class="wk-status" wkInView="0px"><i aria-hidden="true"></i><b>{{ i18n.show(SITE.hero.status) }}</b></span></p>
    <p class="wk-reach-p">{{ i18n.show(SITE.contact.text) }}</p>
    <div class="wk-reach-do">
      <a class="wk-mail" [href]="'mailto:' + SITE.profile.email">{{ SITE.profile.email }}</a>
      <p class="wk-cta">
        <a class="wk-btn" [href]="i18n.cv()" download>{{ ui().downloadCv }} <span aria-hidden="true">↓</span></a>
        <span class="wk-cta-o"><a class="wk-tl" [href]="social.linkedin" rel="noopener">LinkedIn</a> <a class="wk-tl" [href]="social.github" rel="noopener">GitHub</a></span>
      </p>
    </div>
  </div>
  <p class="wk-hi">{{ hello().others }}</p>
  <div class="wk-bye">
    <h2 class="wk-hello" id="contact-h"><span wkFit>{{ hello().here }}<i>.</i></span></h2>
    <img class="wk-knight" src="assets/art/knight.webp" alt="" width="211" height="400" loading="lazy" decoding="async">
  </div>
  <p class="wk-foot wk-lab">
    <span>© 2026 {{ SITE.profile.name }}</span>
    <span>{{ i18n.show(SITE.profile.mission) }}</span>
    <a [href]="social.itch" rel="noopener">itch.io <span aria-hidden="true">↗</span></a>
  </p>
`,
})
export class ReachComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
  /** "Sannu · Bonjour · **Hello.**": his other greetings as two short sentences, the last one set very large below them. */
  protected readonly hello = computed(() => {
    const all = typo(plain(this.i18n.t(SITE.contact.title))).split(' · ');
    return { here: all.pop()!.replace(/\.$/, ''), others: all.map((word) => word + '.').join(' ') };
  });
  protected readonly social = Object.fromEntries(SITE.socials.map((s) => [s.id, s.url])) as Record<'github' | 'linkedin' | 'itch', string>;
}
