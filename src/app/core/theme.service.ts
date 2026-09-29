import { DOCUMENT, Injectable, inject } from '@angular/core';

type Theme = 'light' | 'dark';

/**
 * The initial theme is applied by an inline script in index.html before first paint;
 * this service only flips it. Icons swap purely via CSS on [data-theme], so the
 * prerendered markup never depends on the visitor's theme.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  toggle(): void {
    const root = this.doc.documentElement;
    const next: Theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }
}
