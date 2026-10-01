import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The ZTK crown mark: the letters share one roof bar, which doubles as the crown band. */
const CROWN =
  'M8 30H94V44H8ZM8 30L3 12L26 30ZM46 30L57 2L68 30ZM94 30L99 12L76 30ZM30 44H44L22 96H8ZM8 96H44V110H8ZM50 44H64V110H50ZM80 44H94V110H80ZM94 70L118 30H134L102 84H94ZM100 78L109 67L134 110H118Z';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'img', 'aria-label': 'ZTK' },
  template: `<svg viewBox="0 0 142 120" [attr.height]="size()"><path fill="currentColor" [attr.d]="d" /></svg>`,
  styles: `
    :host { display: inline-flex; line-height: 0; color: var(--logo); }
    svg { width: auto; display: block; }
  `,
})
export class LogoComponent {
  /** Rendered height in px. */
  readonly size = input(28);
  protected readonly d = CROWN;
}
