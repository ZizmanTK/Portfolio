import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * `<video inViewPlay>`: plays (muted, looping) only while on screen, so off-screen clips cost nothing. With reduced
 * motion it never plays on its own: the poster stays and the controls appear instead.
 */
@Directive({ selector: 'video[inViewPlay]' })
export class InViewVideoDirective {
  constructor() {
    const v = inject<ElementRef<HTMLVideoElement>>(ElementRef).nativeElement;
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        v.controls = true;
        return;
      }
      if (!('IntersectionObserver' in window)) return;
      v.muted = true;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        },
        { rootMargin: '120px 0px' },
      );
      io.observe(v);
      destroy.onDestroy(() => io.disconnect());
    });
  }
}
