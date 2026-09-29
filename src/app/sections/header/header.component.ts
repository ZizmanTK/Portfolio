import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { ThemeService } from '../../core/theme.service';
import { IconComponent } from '../../shared/icon.component';

const SECTIONS = ['about', 'experience', 'projects', 'skills', 'contact'] as const;

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[class.is-scrolled]': 'scrolled()',
    '[class.is-open]': 'menuOpen()',
    '(window:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class HeaderComponent {
  protected readonly i18n = inject(I18n);
  protected readonly theme = inject(ThemeService);
  protected readonly profile = SITE.profile;

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly active = signal<string | null>(null);

  protected readonly homePath = computed(() => (this.i18n.lang() === 'fr' ? '/fr' : '/'));
  protected readonly links = computed(() => {
    const nav = this.i18n.ui().nav;
    return SECTIONS.map((id) => ({ id, label: nav[id] }));
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(scrollY > 12);
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });

      // Highlight the nav link of the section currently in the middle of the viewport.
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) this.active.set(e.target.id);
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      }

      destroyRef.onDestroy(() => {
        removeEventListener('scroll', onScroll);
        io.disconnect();
      });
    });
  }
}
