import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { LogoComponent } from '../shared/logo.component';

const LINKS = ['about', 'experience', 'projects', 'skills', 'contact'] as const;

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent],
  template: `
    <header class="nav">
      <div class="wrap">
        <a class="l" [routerLink]="homePath()" fragment="top" aria-label="Abdoul Aziz Maazou"><app-logo [size]="26" /></a>
        <nav [attr.aria-label]="'Main'">
          @for (l of links(); track l.id) {
            <a [routerLink]="homePath()" [fragment]="l.id">{{ l.label }}</a>
          }
        </nav>
        <div class="r">
          <a class="lang" [routerLink]="i18n.otherLangPath()" [attr.aria-label]="i18n.ui().switchLang" [attr.hreflang]="i18n.lang() === 'en' ? 'fr' : 'en'">{{ i18n.ui().langShort }}</a>
          <a class="cv" [href]="resume()" download>{{ i18n.ui().resume }} ↓</a>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly i18n = inject(I18n);
  protected readonly homePath = computed(() => (this.i18n.lang() === 'fr' ? '/fr' : '/'));
  protected readonly resume = computed(() => this.i18n.t(SITE.profile.resume));
  protected readonly links = computed(() => {
    const nav = this.i18n.ui().nav;
    return LINKS.map((id) => ({ id, label: nav[id] }));
  });
}
