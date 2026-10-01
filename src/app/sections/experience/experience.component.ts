import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE, type Experience } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RichTextComponent } from '../../shared/rich-text.component';

interface CompanyGroup {
  company: string;
  url: string;
  logo: string;
  start: string;
  end: string | null;
  positions: Experience[];
}

/** Consecutive positions at the same company are shown together, LinkedIn-style. */
function groupByCompany(items: Experience[]): CompanyGroup[] {
  const groups: CompanyGroup[] = [];
  for (const e of items) {
    const last = groups.at(-1);
    if (last && last.company === e.company) {
      last.positions.push(e);
      last.start = e.start;
    } else {
      groups.push({ company: e.company, url: e.url, logo: e.logo, start: e.start, end: e.end, positions: [e] });
    }
  }
  return groups;
}

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RichTextComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18n);
  protected readonly groups = groupByCompany(SITE.experience);
}
