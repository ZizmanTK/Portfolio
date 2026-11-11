import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * `[wkDepth]`: tells the element where the pointer is over it, as --mx and --my, each from -1 (left, top) to 1 (right,
 * bottom) and 0 when the pointer is away. The stylesheet moves the layers of the element by a share of them (see
 * styles/_work-motion.scss), so what is in front and what is behind part a little as the pointer crosses. Only with a
 * mouse, and not with "reduce motion".
 */
@Directive({ selector: '[wkDepth]' })
export class DepthDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
      let frame = 0;
      let x = 0;
      let y = 0;
      const paint = (): void => {
        frame = 0;
        el.style.setProperty('--mx', x.toFixed(3));
        el.style.setProperty('--my', y.toFixed(3));
      };
      const ask = (): void => { frame ||= requestAnimationFrame(paint); };
      const move = (e: PointerEvent): void => {
        const box = el.getBoundingClientRect();
        x = ((e.clientX - box.left) / box.width) * 2 - 1;
        y = ((e.clientY - box.top) / box.height) * 2 - 1;
        ask();
      };
      const leave = (): void => { x = y = 0; ask(); };
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', leave);
      destroy.onDestroy(() => {
        cancelAnimationFrame(frame);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}
