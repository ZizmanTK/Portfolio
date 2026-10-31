import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { richText } from '../core/content';

/** `<li [rich]="text">`: the text with its **marked** words in <strong>. */
@Component({
  selector: '[rich]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (s of parts(); track $index) {@if (s.bold) {<strong>{{ s.text }}</strong>} @else {<ng-container>{{ s.text }}</ng-container>}}`,
})
export class RichComponent {
  readonly rich = input.required<string>();
  protected readonly parts = computed(() => richText(this.rich()));
}
