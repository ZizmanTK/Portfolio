import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { richText } from '../core/content';

/** Like app-rich, but **marked** words are set in the accent colour (taglines, leads, titles). */
@Component({
  selector: 'app-accent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (s of segments(); track $index) {@if (s.bold) {<span [class]="mode()">{{ s.text }}</span>} @else {<span>{{ s.text }}</span>}}`,
  styles: `:host { display: contents; } .b { color: var(--tx); font-weight: 700; }`,
})
export class AccentTextComponent {
  readonly text = input.required<string>();
  /** 'y' = accent colour (default), 'b' = bold white. */
  readonly mode = input<'y' | 'b'>('y');
  protected readonly segments = computed(() => richText(this.text()));
}
