import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AccentTextComponent } from './accent-text.component';
import { RevealDirective } from './reveal.directive';

/**
 * Section opener in the hero's language: one word set big in the condensed cut,
 * then a quiet line underneath (index in yellow, one-sentence intro).
 */
@Component({
  selector: 'app-sec-head',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent],
  host: { class: 'op', reveal: '' },
  hostDirectives: [RevealDirective],
  template: `
    <h2 class="mega">{{ title() }}</h2>
    <div class="sub g">
      <p class="idx num">{{ idx() }}</p>
      @if (intro()) { <p class="intro"><app-accent mode="b" [text]="intro()" /></p> }
    </div>
  `,
})
export class SectionHeadComponent {
  readonly idx = input.required<string>();
  readonly title = input.required<string>();
  readonly intro = input('');
}
