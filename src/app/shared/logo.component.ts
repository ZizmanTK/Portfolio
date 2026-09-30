import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LogoService, type LogoVariant } from '../core/logo.service';

/** Shared-stroke ZTK path data (one roof bar joins Z, T and K). */
export const LIGATURE =
  'M8 10H94V24H8ZM30 24H44L22 76H8ZM8 76H44V90H8ZM50 24H64V90H50ZM80 24H94V90H80ZM94 50L118 10H134L102 64H94ZM100 58L109 47L134 90H118Z';
export const CROWN =
  'M8 30H94V44H8ZM8 30L3 12L26 30ZM46 30L57 2L68 30ZM94 30L99 12L76 30ZM30 44H44L22 96H8ZM8 96H44V110H8ZM50 44H64V110H50ZM80 44H94V110H80ZM94 70L118 30H134L102 84H94ZM100 78L109 67L134 110H118Z';

/** Tetromino cells [col, row] on a 9×5 grid; Z and T share the top row with K's spine. */
const Z = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2], [0, 3], [0, 4], [1, 4], [2, 4]];
const T = [[3, 0], [4, 0], [5, 0], [4, 1], [4, 2], [4, 3], [4, 4]];
const K = [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [8, 0], [7, 1], [7, 3], [8, 4]];
const CELLS = [
  ...Z.map(([c, r]) => ({ x: c * 14, y: r * 14, fill: '#f59e0b' })),
  ...T.map(([c, r]) => ({ x: c * 14, y: r * 14, fill: '#fbb915' })),
  ...K.map(([c, r]) => ({ x: c * 14, y: r * 14, fill: '#fcd34d' })),
];

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'img', '[attr.aria-label]': '"ZTK"' },
  template: `
    @switch (current()) {
      @case ('ligature') {
        <svg viewBox="0 0 142 100" [attr.height]="size()"><path fill="currentColor" [attr.d]="lig" /></svg>
      }
      @case ('crown') {
        <svg viewBox="0 0 142 120" [attr.height]="size()"><path fill="currentColor" [attr.d]="crown" /></svg>
      }
      @case ('tetromino') {
        <svg viewBox="-1 -1 127 71" [attr.height]="size() * 0.8">
          @for (c of cells; track $index) {
            <rect [attr.x]="c.x" [attr.y]="c.y" width="13" height="13" rx="2" [attr.fill]="c.fill" />
          }
        </svg>
      }
      @case ('detection') {
        <svg viewBox="0 0 160 140" [attr.height]="size() * 1.15">
          <path d="M6 34V20H20M140 20H154V34M154 124V138H140M20 138H6V124" fill="none" stroke="currentColor" stroke-width="7" />
          <path fill="currentColor" [attr.d]="lig" transform="translate(16 30) scale(0.9)" />
        </svg>
      }
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; line-height: 0; color: var(--logo); }
    svg { width: auto; display: block; overflow: visible; }
  `,
})
export class LogoComponent {
  private readonly logos = inject(LogoService);
  /** Rendered height in px. */
  readonly size = input(28);
  /** Force a specific variant (e.g. in the picker); defaults to the chosen one. */
  readonly variant = input<LogoVariant | null>(null);

  protected readonly current = computed(() => this.variant() ?? this.logos.variant());
  protected readonly lig = LIGATURE;
  protected readonly crown = CROWN;
  protected readonly cells = CELLS;
}
