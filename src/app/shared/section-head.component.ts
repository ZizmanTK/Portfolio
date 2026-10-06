import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AccentTextComponent } from './accent-text.component';
import { RevealDirective } from './reveal.directive';

/** Section header on the 12-column grid: index on the left, title, one-line intro on the right. */
@Component({
  selector: 'app-sec-head',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent],
  host: { class: 'sh g', reveal: '' },
  hostDirectives: [RevealDirective],
  template: `
    <p class="idx num">{{ idx() }}</p>
    <h2>{{ title() }}</h2>
    @if (intro()) { <p class="intro"><app-accent mode="b" [text]="intro()" /></p> }
  `,
})
export class SectionHeadComponent {
  readonly idx = input.required<string>();
  readonly title = input.required<string>();
  readonly intro = input('');
}
