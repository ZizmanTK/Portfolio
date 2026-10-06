import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * `<video inViewPlay>`: plays (muted, looping) only while on screen, so off-screen clips cost
 * nothing. With reduced motion it never autoplays; the poster stays and controls appear.
 */
@Directive({ selector: 'video[inViewPlay]' })
export class InViewVideoDirective {
  constructor() {
    const v = inject(ElementRef<HTMLVideoElement>).nativeElement;
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        v.controls = true;
        return;
      }
      v.muted = true;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            if (v.preload === 'none') v.preload = 'auto';
            void v.play().catch(() => {});
          } else v.pause();
        },
        { threshold: 0.35 },
      );
      io.observe(v);
      destroy.onDestroy(() => io.disconnect());
    });
  }
}
