import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE, shortHash, type L } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

interface Commit {
  kind: 'work' | 'edu';
  hash: string;
  start: string;
  end: string | null;
  title: L;
  org: string;
  url: string | null;
  logo: string | null;
  tag: L | null;
  where: string;
  highlights: L[];
  stack: string[];
  /** Git-graph drawing flags for this row. */
  workTop: boolean;
  workBottom: boolean;
  eduTop: boolean;
  eduBottom: boolean;
  fork: boolean;
}

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18n);

  /** Work and education merged into one history, newest first, with lane flags for the graph. */
  protected readonly commits = computed<Commit[]>(() => {
    const lang = this.i18n.lang();
    const base = [
      ...SITE.experience.map((e) => ({
        kind: 'work' as const,
        start: e.start,
        end: e.end,
        title: e.role,
        org: e.company,
        url: e.url,
        logo: e.logo,
        tag: e.type,
        where: e.location[lang],
        highlights: e.highlights,
        stack: e.stack,
      })),
      ...SITE.education.map((e) => ({
        kind: 'edu' as const,
        start: e.start,
        end: e.end,
        title: e.degree,
        org: e.school,
        url: e.url,
        logo: e.logo,
        tag: null,
        where: `${e.city}, ${e.country[lang]}`,
        highlights: [],
        stack: [],
      })),
    ].sort((a, b) => b.start.localeCompare(a.start));

    const lastWork = base.map((c) => c.kind).lastIndexOf('work');
    const firstEdu = base.findIndex((c) => c.kind === 'edu');
    const last = base.length - 1;
    const forks = firstEdu === lastWork + 1;

    return base.map((c, i) => ({
      ...c,
      hash: shortHash(c.org + c.start),
      workTop: i > 0 && i <= lastWork,
      workBottom: i < lastWork,
      eduTop: i > firstEdu || (forks && i === firstEdu),
      eduBottom: i >= firstEdu && i < last,
      fork: forks && i === lastWork,
    }));
  });
}
