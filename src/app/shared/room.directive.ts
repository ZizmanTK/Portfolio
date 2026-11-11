import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** What must stay free under the element, in pixels, for it to count as fitting. */
const SPARE = 16;

/**
 * `[wkRoom]`: gives the element .wk-room while the window has room for all of it under its own `top` (never, if the
 * stylesheet gives it none). The stylesheet holds such a block in place while the scroll plays what is in it (see
 * styles/_work-motion.scss); one that does not fit is left to scroll, or its foot would never be seen.
 */
@Directive({ selector: '[wkRoom]' })
export class RoomDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const check = (): void => {
        const top = parseFloat(getComputedStyle(el).top);
        el.classList.toggle('wk-room', top + el.offsetHeight + SPARE <= innerHeight);
      };
      const sizes = new ResizeObserver(check);
      sizes.observe(el);
      addEventListener('resize', check, { passive: true });
      destroy.onDestroy(() => {
        sizes.disconnect();
        removeEventListener('resize', check);
      });
    });
  }
}
