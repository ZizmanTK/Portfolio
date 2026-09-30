import { DOCUMENT, Injectable, afterNextRender, inject, signal } from '@angular/core';

export const LOGO_VARIANTS = ['crown', 'ligature', 'tetromino', 'detection'] as const;
export type LogoVariant = (typeof LOGO_VARIANTS)[number];

/** Default mark used for prerendering, the favicon and the resume. */
export const DEFAULT_LOGO: LogoVariant = 'crown';

/**
 * Which ZTK mark is shown. A visitor-facing picker lets the owner compare the
 * candidates on the real page; the choice is remembered locally and mirrored to the favicon.
 */
@Injectable({ providedIn: 'root' })
export class LogoService {
  private readonly doc = inject(DOCUMENT);
  readonly variant = signal<LogoVariant>(DEFAULT_LOGO);

  constructor() {
    afterNextRender(() => {
      try {
        const saved = localStorage.getItem('logo') as LogoVariant | null;
        if (saved && LOGO_VARIANTS.includes(saved)) this.set(saved, false);
      } catch {
        // Storage unavailable — keep the default.
      }
    });
  }

  set(variant: LogoVariant, persist = true): void {
    this.variant.set(variant);
    const icon = this.doc.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) icon.href = `assets/img/logo-${variant}.svg`;
    if (!persist) return;
    try {
      localStorage.setItem('logo', variant);
    } catch {
      // Ignore — the switch still applies for this visit.
    }
  }
}
