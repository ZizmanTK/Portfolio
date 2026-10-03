import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { IconComponent } from '../../shared/icon.component';
import { LogoComponent } from '../../shared/logo.component';
import { RichTextComponent } from '../../shared/rich-text.component';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, LogoComponent, RichTextComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly profile = SITE.profile;
  protected readonly facts = SITE.facts;
  protected readonly keySkills = SITE.keySkills;
  protected readonly linkedin = SITE.socials.find((s) => s.id === 'linkedin')!;
  protected readonly github = SITE.socials.find((s) => s.id === 'github')!;
}
