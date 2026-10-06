import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { LogoComponent } from '../shared/logo.component';

const LINKS = ['about', 'experience', 'projects', 'skills', 'contact'] as const;

/** Sticky nav with a reading-progress line and the current section highlighted. */
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
            <a [routerLink]="homePath()" [fragment]="l.id" [class.on]="active() === l.id" [attr.aria-current]="active() === l.id ? 'location' : null">{{ l.label }}</a>
          }
        </nav>
        <div class="r">
          <a class="lang" [routerLink]="i18n.otherLangPath()" [attr.aria-label]="i18n.ui().switchLang" [attr.hreflang]="i18n.lang() === 'en' ? 'fr' : 'en'">{{ i18n.ui().langShort }}</a>
          <a class="cv" [href]="resume()" download>{{ i18n.ui().resume }} ↓</a>
        </div>
      </div>
      <i class="bar" aria-hidden="true"></i>
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
  protected readonly active = signal<string | null>(null);

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const root = document.documentElement;
      // Games and education count as their neighbours in the nav.
      const ids = ['about', 'experience', 'projects', 'games', 'skills', 'education', 'contact'];
      const navOf: Record<string, string> = { games: 'projects', education: 'skills' };
      const onScroll = () => {
        const max = root.scrollHeight - innerHeight;
        root.style.setProperty('--read', (max > 0 ? scrollY / max : 0).toFixed(4));
        const line = innerHeight * 0.35;
        let cur: string | null = null;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) cur = navOf[id] ?? id;
        }
        if (cur !== this.active()) this.active.set(cur);
      };
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
      destroy.onDestroy(() => removeEventListener('scroll', onScroll));
    });
  }
}
