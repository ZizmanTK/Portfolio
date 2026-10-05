import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Lang } from '../core/content';
import { I18n } from '../core/i18n';
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
      <div class="wrap">
        <app-about />
        <app-experience />
        <app-projects />
        <app-games />
        <app-skills />
      </div>
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
    // Keep anchor targets clear of the sticky header.
    inject(ViewportScroller).setOffset([0, 80]);
  }
}
