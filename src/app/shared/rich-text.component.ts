import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { richText } from '../core/content';

/** Renders content strings where **keywords** are bolded, without innerHTML. */
@Component({
  selector: 'app-rich',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (s of segments(); track $index) {@if (s.bold) {<strong>{{ s.text }}</strong>} @else {<span>{{ s.text }}</span>}}`,
  styles: `:host { display: contents; } strong { font-weight: 600; color: var(--ink); }`,
})
export class RichTextComponent {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => richText(this.text()));
}
