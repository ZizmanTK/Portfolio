import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { LogoComponent } from '../shared/logo.component';

const LINKS = ['experience', 'work', 'about', 'contact'] as const;

/** Sticky header: mark and name, four section links (the current one lit), language, résumé. */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent],
  template: `
    <header class="nav">
      <div class="w">
        <a class="logo" [routerLink]="homePath()" fragment="top">
          <app-logo [size]="22" /><span>{{ name }}</span>
        </a>
        <nav [attr.aria-label]="i18n.lang() === 'fr' ? 'Navigation principale' : 'Main'">
          @for (l of links(); track l.id) {
            <a class="sl" [routerLink]="homePath()" [fragment]="l.id" [class.on]="active() === l.id" [attr.aria-current]="active() === l.id ? 'location' : null">{{ l.label }}</a>
          }
          <a class="lang" [routerLink]="i18n.otherLangPath()" [attr.aria-label]="i18n.ui().switchLang" [attr.hreflang]="i18n.lang() === 'en' ? 'fr' : 'en'">{{ i18n.ui().langShort }}</a>
          <a class="cv" [href]="resume()" download>{{ i18n.ui().resume }}</a>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly i18n = inject(I18n);
  protected readonly name = SITE.profile.name;
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
      // Skills and games are part of "About" in the nav; the contact link lights up at the end.
      const ids = ['experience', 'work', 'about', 'skills', 'games', 'contact'];
      const navOf: Record<string, string> = { skills: 'about', games: 'about' };
      const onScroll = () => {
        const line = innerHeight * 0.4;
        let cur: string | null = null;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) cur = navOf[id] ?? id;
        }
        if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = 'contact';
        if (cur !== this.active()) this.active.set(cur);
      };
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
      destroy.onDestroy(() => removeEventListener('scroll', onScroll));
    });
  }
}
