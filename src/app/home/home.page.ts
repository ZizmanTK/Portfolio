import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Lang } from '../core/content';
import { I18n } from '../core/i18n';
import { Scroll } from '../core/scroll';
import { SeoService } from '../core/seo.service';
import { HeaderComponent } from '../sections/header.component';
import { HeroComponent } from '../sections/hero.component';
import { AboutComponent } from '../sections/about.component';
import { ExperienceComponent } from '../sections/experience.component';
import { ProjectsComponent } from '../sections/projects.component';
import { GamesComponent } from '../sections/games.component';
import { SkillsComponent } from '../sections/skills.component';
import { ContactComponent } from '../sections/contact.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    GamesComponent,
    SkillsComponent,
    ContactComponent,
  ],
  template: `
    <a class="skip-link" [routerLink]="[]" fragment="main">{{ i18n.ui().skipToContent }}</a>
    <app-header />
    <main id="main" tabindex="-1">
      <app-hero />
      <app-experience />
      <app-projects />
      <app-about />
      <app-skills />
      <app-games />
      <app-contact />
    </main>
  `,
})
export class HomePage {
  protected readonly i18n = inject(I18n);

  constructor() {
    const lang = (inject(ActivatedRoute).snapshot.data['lang'] ?? 'en') as Lang;
    this.i18n.lang.set(lang);
    inject(SeoService).apply(lang);
    const scroll = inject(Scroll);
    // Keep anchor targets clear of the sticky header.
    inject(ViewportScroller).setOffset([0, scroll.offset]);

    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      void scroll.start();
      // In-page links (nav, case-study links) glide through the page instead of jumping,
      // so the scroll choreography plays on the way. Runs before RouterLink sees the click.
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
        if (!a) return;
        const url = new URL(a.href, location.href);
        if (url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '')) return;
        const id = decodeURIComponent(url.hash.slice(1));
        if (!id || !scroll.to(id)) return;
        e.preventDefault();
        e.stopPropagation();
        history.replaceState(history.state, '', url.pathname + url.hash);
        if (id === 'main') document.getElementById('main')?.focus({ preventScroll: true });
      };
      document.addEventListener('click', onClick, true);
      destroy.onDestroy(() => document.removeEventListener('click', onClick, true));
    });
  }
}
