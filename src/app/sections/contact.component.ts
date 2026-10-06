import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { RevealDirective } from '../shared/reveal.directive';

/** Closing: the three greetings set large, the email as the main action, then links and the footer. */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="ct w" id="contact">
      <h2 class="hello" reveal>
        <span class="gw">Sannu</span><span class="d" aria-hidden="true">·</span><span class="gw">Bonjour</span><span class="d" aria-hidden="true">·</span><em class="gw">Hello.</em>
      </h2>
      <div class="row g" reveal>
        <p class="ask">{{ ui().contactAsk }}</p>
        <a class="mail" [href]="'mailto:' + p.email">{{ p.email }}</a>
        <div class="acts">
          <a class="btn p" [href]="resume()" download>{{ ui().resumePdf }}</a>
          @for (s of socials; track s.id) { <a class="btn" [href]="s.url" rel="me">{{ s.label }}</a> }
        </div>
      </div>
      <footer class="ft">
        <span>© {{ year }} {{ p.name }}</span>
        <span>{{ ui().footer }} · <time>{{ time() }}</time></span>
      </footer>
    </section>
  `,
})
export class ContactComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly p = SITE.profile;
  protected readonly socials = SITE.socials;
  protected readonly year = new Date().getFullYear();
  protected readonly resume = computed(() => this.i18n.t(this.p.resume));
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
