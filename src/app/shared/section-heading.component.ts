import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="eyebrow"><span class="eyebrow__index">{{ index() }}</span> {{ label() }}</p>
    <h2 class="display-2" [id]="headingId()">{{ title() }}</h2>
    <ng-content />
  `,
  styles: `
    :host { display: block; margin-bottom: clamp(2rem, 5vw, 3.5rem); max-width: 46rem; }
    h2 { margin-top: 0.75rem; }
  `,
})
export class SectionHeadingComponent {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly headingId = input<string>();
}
