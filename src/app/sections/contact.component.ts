import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { SITE, richText } from '../core/content';
import { I18n } from '../core/i18n';
import { FxDirective } from '../shared/fx.directive';
import { LogoComponent } from '../shared/logo.component';

/**
 * Closing section. The page's dark body ends in a curve that flattens as you arrive,
 * and the three greetings slide in from three directions.
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FxDirective, LogoComponent],
  template: `
    <section class="ct" id="contact" fx="enter">
      <div class="curve" aria-hidden="true"></div>
      <div class="wrap">
        <h2 class="ctt">
          @for (w of title(); track $index) {
            <span class="gw" [class.y]="w.bold" [style.--g]="$index">{{ w.text }}</span>
          }
        </h2>
        <p class="c">{{ i18n.t(contact.text) }}</p>
        <a class="mail" [href]="'mailto:' + p.email">{{ p.email }}</a>
        <div class="acts">
          <a class="btn f" [href]="resume()" download>{{ i18n.ui().resume }} ↓</a>
          @for (s of socials; track s.id) { <a class="btn" [href]="s.url" rel="me">{{ s.label }} ↗</a> }
        </div>
        <div class="ft">
          <span><app-logo [size]="18" /> © {{ year }} {{ p.name }}</span>
          <span class="clock"><i aria-hidden="true"></i>{{ i18n.ui().footer }} · <time>{{ time() }}</time></span>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  protected readonly i18n = inject(I18n);
  protected readonly p = SITE.profile;
  protected readonly contact = SITE.contact;
  protected readonly socials = SITE.socials;
  protected readonly year = new Date().getFullYear();
  protected readonly resume = computed(() => this.i18n.t(this.p.resume));
  /** "Sannu · Bonjour · **Hello.**" → three greetings (separators dropped), the marked one in yellow. */
  protected readonly title = computed(() =>
    richText(this.i18n.t(this.contact.title))
      .flatMap((s) => s.text.split('·').map((t) => ({ text: t.trim(), bold: s.bold })))
      .filter((w) => w.text),
  );
  /** Grenoble wall-clock time, filled in once the page runs in a browser. */
  protected readonly time = signal('');

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const fmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
      const tick = () => this.time.set(fmt.format(new Date()));
      tick();
      const id = setInterval(tick, 20_000);
      destroy.onDestroy(() => clearInterval(id));
    });
  }
}
