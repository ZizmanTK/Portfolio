import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';
import { LogoComponent } from '../shared/logo.component';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent, LogoComponent],
  template: `
    <section class="ct" id="contact">
      <div class="wrap">
        <h2 class="ctt rv"><app-accent [text]="i18n.t(contact.title)" /></h2>
        <p class="c">{{ i18n.t(contact.text) }}</p>
        <a class="mail" [href]="'mailto:' + p.email">{{ p.email }}</a>
        <div class="acts">
          <a class="btn f" [href]="resume()" download>{{ i18n.ui().resume }} ↓</a>
          @for (s of socials; track s.id) { <a class="btn" [href]="s.url" rel="me">{{ s.label }} ↗</a> }
        </div>
        <div class="ft">
          <span><app-logo [size]="18" /> © {{ year }} {{ p.name }}</span>
          <span>{{ i18n.ui().footer }} · EN / FR</span>
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
}
