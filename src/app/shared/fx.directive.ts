import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { Scroll, type FxMode } from '../core/scroll';

/** `<div fx="enter">` → the element gets a live `--p` (0 → 1) for its scroll progress. */
@Directive({ selector: '[fx]' })
export class FxDirective {
  readonly fx = input<FxMode | ''>('');

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;
    const scroll = inject(Scroll);
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const off = scroll.register(el, this.fx() || 'enter');
      destroy.onDestroy(off);
    });
  }
}
