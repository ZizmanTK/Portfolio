import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { SITE, shortHash, type Project, type ProjectCategory } from '../../core/content';
import { I18n } from '../../core/i18n';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

type Filter = 'all' | ProjectCategory;

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective, IconComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  protected readonly i18n = inject(I18n);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly filters: Filter[] = ['all', 'ai', 'games', 'web'];
  protected readonly filter = signal<Filter>('all');
  protected readonly selected = signal<Project | null>(null);

  protected readonly visible = computed(() => {
    const f = this.filter();
    return f === 'all' ? SITE.projects : SITE.projects.filter((p) => p.category === f);
  });

  protected count(f: Filter): number {
    return f === 'all' ? SITE.projects.length : SITE.projects.filter((p) => p.category === f).length;
  }

  /** A stable, playful "confidence" in 0.90–0.99 for the hover detection tag. */
  protected score(p: Project): string {
    return (0.9 + (parseInt(shortHash(p.slug), 16) % 10) / 100).toFixed(2);
  }

  protected open(project: Project): void {
    this.selected.set(project);
    this.dialog().nativeElement.showModal();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  /** Clicks on the ::backdrop land on the <dialog> element itself. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
