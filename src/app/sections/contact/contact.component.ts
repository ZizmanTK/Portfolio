import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { LOGO_VARIANTS, LogoService } from '../../core/logo.service';
import { IconComponent } from '../../shared/icon.component';
import { LogoComponent } from '../../shared/logo.component';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, LogoComponent, SectionHeadingComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly i18n = inject(I18n);
  protected readonly logos = inject(LogoService);
  protected readonly variants = LOGO_VARIANTS;
  protected readonly profile = SITE.profile;
  protected readonly socials = SITE.socials;
  protected readonly year = new Date().getFullYear();
  protected readonly copied = signal(false);
  protected readonly homePath = computed(() => (this.i18n.lang() === 'fr' ? '/fr' : '/'));

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.profile.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      location.href = `mailto:${this.profile.email}`;
    }
  }
}
