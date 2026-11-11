import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/** Where an element starts when nothing else is asked: once it crosses the middle of the window. */
const MIDDLE = '-20% 0px';

/**
 * `[wkInView]`: the element carries the class `wk-in` from the moment it crosses the middle of the window until it has
 * left the window. What moves on its own there (see styles/_work-motion.scss) only exists then, so it costs nothing
 * when nobody is looking at it. `wkInView="0px"` starts as soon as any of the element shows.
 */
@Directive({ selector: '[wkInView]' })
export class InViewDirective {
  /** How far inside the window the element has to be to start, written as the margin of an IntersectionObserver. */
  readonly wkInView = input(MIDDLE, { transform: (v: string) => v || MIDDLE });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) return;
      const start = new IntersectionObserver((seen) => { if (seen.at(-1)!.isIntersecting) el.classList.add('wk-in'); }, { rootMargin: this.wkInView() });
      const stop = new IntersectionObserver((seen) => { if (!seen.at(-1)!.isIntersecting) el.classList.remove('wk-in'); });
      start.observe(el);
      stop.observe(el);
      destroy.onDestroy(() => (start.disconnect(), stop.disconnect()));
    });
  }
}
