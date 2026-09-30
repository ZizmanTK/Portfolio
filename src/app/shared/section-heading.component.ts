import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Section header styled like an editor path: `02 ~/journey  git log --graph` over a display title. */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="path mono">
      <span class="idx">{{ index() }}</span>
      <span class="sep">~/</span><span class="file">{{ file() }}</span>
    </p>
    <h2 class="h2" [id]="headingId()">{{ title() }}</h2>
    <ng-content />
  `,
  styles: `
    :host { display: block; margin-bottom: clamp(2rem, 5vw, 3rem); max-width: 48rem; }
    .path { display: inline-flex; align-items: center; gap: 0.15rem; padding: 0.25rem 0.6rem 0.25rem 0.3rem; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--muted); }
    .idx { margin-right: 0.45rem; padding: 0 0.35rem; border-radius: 3px; background: var(--signal); color: var(--on-signal); font-weight: 600; }
    .file { color: var(--ink); }
    h2 { margin-top: 1rem; }
  `,
})
export class SectionHeadingComponent {
  readonly index = input.required<string>();
  readonly file = input.required<string>();
  readonly title = input.required<string>();
  readonly headingId = input<string>();
}
