import { DestroyRef, Directive, ElementRef, Injectable, afterNextRender, inject } from '@angular/core';

/** One IntersectionObserver for the whole page: elements get `.in` the first time they show up. */
@Injectable({ providedIn: 'root' })
class Reveals {
  private io?: IntersectionObserver;

  watch(el: HTMLElement): () => void {
    this.io ??= new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          this.io!.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    this.io.observe(el);
    return () => this.io?.unobserve(el);
  }
}

/**
 * `<div reveal>` fades and lifts in once it scrolls into view. Without JavaScript, or with
 * reduced motion, content is simply visible (the hidden state only applies under `html.moving`).
 */
@Directive({ selector: '[reveal]' })
export class RevealDirective {
  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;
    const reveals = inject(Reveals);
    const destroy = inject(DestroyRef);
    afterNextRender(() => destroy.onDestroy(reveals.watch(el)));
  }
}
