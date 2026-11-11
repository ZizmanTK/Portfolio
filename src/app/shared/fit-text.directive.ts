import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Fits a line of display type to the inner width of its parent. `fill` makes it exactly as wide; `shrink` keeps the
 * size the stylesheet gives it and only reduces it when the line would not fit. The stylesheet already gives a close
 * size, so the page reads the same before this runs and without it.
 */
@Directive({ selector: '[wkFit]' })
export class FitTextDirective {
  readonly wkFit = input<'fill' | 'shrink' | ''>('fill');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const box = el.parentElement;
      if (!box) return;
      let fitted = -1;

      const fit = (force = false): void => {
        const cs = getComputedStyle(box);
        const room = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        if (room <= 0 || (!force && room === fitted)) return;
        fitted = room;
        if (this.wkFit() === 'shrink') {
          el.style.fontSize = '';
          const width = el.getBoundingClientRect().width;
          if (width > room) el.style.fontSize = ((parseFloat(getComputedStyle(el).fontSize) * room) / width).toFixed(2) + 'px';
        } else {
          el.style.fontSize = '100px';
          el.style.fontSize = ((100 * room) / el.getBoundingClientRect().width).toFixed(2) + 'px';
        }
      };

      const refit = (): void => fit(true);
      const sizes = new ResizeObserver(() => fit());
      sizes.observe(box);
      document.fonts.ready.then(refit);
      document.fonts.addEventListener('loadingdone', refit);
      destroyRef.onDestroy(() => {
        sizes.disconnect();
        document.fonts.removeEventListener('loadingdone', refit);
      });
    });
  }
}
