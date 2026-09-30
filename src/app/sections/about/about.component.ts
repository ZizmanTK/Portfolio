import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

/** One line of the YAML card: key/value tokens plus an optional comment. */
interface YamlLine { indent?: boolean; key?: string; value?: string; kind?: 'str' | 'num' | 'key'; comment?: string }

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective],
  template: `
    @let ui = i18n.ui();
    <section id="about" class="section" aria-labelledby="about-title">
      <div class="container grid">
        <div class="story">
          <app-section-heading index="01" [file]="ui.files.about" [title]="ui.titles.about" headingId="about-title" />
          @for (p of about.paragraphs; track $index; let first = $first) {
            <p [class.lead]="first" [class.para]="!first" appReveal>{{ i18n.t(p) }}</p>
          }
        </div>

        <div class="window" appReveal>
          <div class="window__bar">
            <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="window__tab">profile.yaml</span>
          </div>
          <ol class="code mono" role="list">
            @for (l of yaml(); track $index) {
              <li>
                @if (l.indent) {<span>{{ '  ' }}</span>}
                @if (l.key) {<span class="tok-key">{{ l.key }}</span><span class="tok-pun">{{ l.value ? ': ' : ':' }}</span>}
                @if (l.value) {<span [class]="'tok-' + (l.kind ?? 'str')">{{ l.value }}</span>}
                @if (l.comment) {<span class="tok-com">{{ '  # ' + l.comment }}</span>}
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
      gap: clamp(2rem, 6vw, 5rem);
      align-items: start;
    }
    .story { display: grid; gap: 1.2rem; }
    .story app-section-heading { margin-bottom: 0.8rem; }
    .lead { font-size: clamp(1.18rem, 1.8vw, 1.4rem); color: var(--ink); line-height: 1.5; }
    .para { color: var(--ink-2); font-size: 1.04rem; text-wrap: pretty; }
    .window { position: sticky; top: calc(var(--header-h) + 1.5rem); }
    .code {
      margin: 0;
      padding: 1rem 0;
      counter-reset: line;
      font-size: 0.84rem;
      line-height: 1.85;
      overflow-x: auto;
    }
    .code li { counter-increment: line; padding: 0 1rem 0 4.2rem; text-indent: -3rem; white-space: pre-wrap; }
    .code li::before {
      content: counter(line);
      display: inline-block;
      width: 3rem;
      padding-right: 1rem;
      text-align: right;
      color: var(--line-strong);
      user-select: none;
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: minmax(0, 1fr); }
      .window { position: static; }
    }
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18n);
  protected readonly about = SITE.about;

  protected readonly yaml = computed<YamlLine[]>(() => {
    const t = (v: Parameters<I18n['t']>[0]) => this.i18n.t(v);
    const ui = this.i18n.ui().yaml;
    const p = SITE.profile;
    const levels = [ui.fluent, ui.professional, ui.native];
    return [
      { value: '---', kind: 'key' },
      { key: 'name', value: p.name },
      { key: 'role', value: t(p.role) },
      { key: 'company', value: p.company },
      { key: 'based_in', value: t(p.location) },
      { key: 'languages' },
      ...SITE.languages.map((l, i) => ({ indent: true, value: `- ${l.code}`, comment: levels[i] })),
      { key: 'degree', value: ui.degree },
      { key: 'certified', value: '[python]', kind: 'num', comment: ui.assessment },
      { key: 'mission', value: '>', kind: 'key' },
      { indent: true, value: `"${t(p.mission).replace(/^[^:]+:\s*/, '').replace(/\.$/, '')}"` },
      { value: '---', kind: 'key' },
    ] satisfies YamlLine[];
  });
}
