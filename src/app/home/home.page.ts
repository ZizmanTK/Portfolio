import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Lang } from '../core/content';
import { I18n } from '../core/i18n';
import { SeoService } from '../core/seo.service';
import { HeaderComponent } from '../sections/header/header.component';
import { HeroComponent } from '../sections/hero/hero.component';
import { ExperienceComponent } from '../sections/experience/experience.component';
import { SkillsComponent } from '../sections/skills/skills.component';
import { ProjectsComponent } from '../sections/projects/projects.component';
import { EducationComponent } from '../sections/education/education.component';
import { AboutComponent } from '../sections/about/about.component';
import { ContactComponent } from '../sections/contact/contact.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    HeaderComponent,
    HeroComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
    EducationComponent,
    AboutComponent,
    ContactComponent,
  ],
  template: `
    <a class="skip-link" [routerLink]="[]" fragment="main">{{ i18n.ui().skipToContent }}</a>
    <app-header />
    <main id="main" tabindex="-1">
      <app-hero />
      <app-experience />
      <app-skills />
      <app-projects />
      <app-education />
      <app-about />
      <app-contact />
    </main>
  `,
  styles: `
    .skip-link {
      position: fixed;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 100;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      background: var(--ink);
      color: var(--on-ink);
      transform: translateY(-200%);
      transition: transform 0.2s;
    }
    .skip-link:focus { transform: none; }
    main:focus { outline: none; }
  `,
})
export class HomePage {
  protected readonly i18n = inject(I18n);

  constructor() {
    const lang = (inject(ActivatedRoute).snapshot.data['lang'] ?? 'en') as Lang;
    this.i18n.lang.set(lang);
    inject(SeoService).apply(lang);
    // Keep anchor targets clear of the sticky header.
    inject(ViewportScroller).setOffset([0, 76]);
  }
}
