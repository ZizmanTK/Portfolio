import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/** How much of a part has to show before it comes in: this share of the part, or of the window if the part is taller. */
const ENOUGH = .24;

/**
 * Brings the parts of a page in as the reader reaches them. Put on a container, with the selector of its parts.
 *
 * A part that is below the window when the page opens gets .wk-wait; the first time enough of it shows, .wk-wait
 * becomes .wk-go, once. What waiting and going look like is in the stylesheet (styles/_work-motion.scss). A part that
 * is on screen or above it when the page opens is left as it is written, so nothing blinks; so is the whole page
 * without a script.
 */
@Directive({ selector: '[wkReveal]' })
export class RevealDirective {
  /** The parts to bring in: a selector, looked up inside the host once it is rendered. */
  readonly wkReveal = input.required<string>();

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const part = e.target.classList;
          const win = e.rootBounds?.height ?? innerHeight;
          if (!part.contains('wk-wait')) {
            // The first look at a part: it waits only if the reader cannot see it yet.
            if (e.boundingClientRect.top >= win) part.add('wk-wait');
            else io.unobserve(e.target);
          } else if (e.intersectionRatio >= ENOUGH || e.intersectionRect.height >= win * ENOUGH) {
            part.replace('wk-wait', 'wk-go');
            io.unobserve(e.target);
          }
        }
      }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
      host.querySelectorAll(this.wkReveal()).forEach((el) => io.observe(el));
      destroy.onDestroy(() => io.disconnect());
    });
  }
}
