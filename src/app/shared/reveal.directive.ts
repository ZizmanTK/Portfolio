import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Fades an element in the first time it scrolls into view.
 * Runs only in the browser, and skips elements already on screen at load and
 * visitors who prefer reduced motion — so prerendered content is never hidden.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  /** Stagger delay in ms. */
  readonly appReveal = input<number | ''>('');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (el.getBoundingClientRect().top < innerHeight * 0.9) return;

      const delay = Number(this.appReveal()) || 0;
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.classList.add('reveal');

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            io.disconnect();
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
