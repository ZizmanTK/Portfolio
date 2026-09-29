import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly profile = SITE.profile;
  protected readonly socials = SITE.socials;
  protected readonly about = SITE.about;
  protected readonly stats = SITE.about.stats;
  protected readonly homePath = computed(() => (this.i18n.lang() === 'fr' ? '/fr' : '/'));

  /** Every skill that has a logo, for the scrolling tech strip. */
  protected readonly tech = SITE.skills
    .flatMap((g) => g.items)
    .filter((s, i, all) => s.icon && all.findIndex((o) => o.icon === s.icon) === i);
}
