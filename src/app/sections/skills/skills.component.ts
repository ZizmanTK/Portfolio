import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeadingComponent, RevealDirective],
  template: `
    @let ui = i18n.ui();
    <section id="stack" class="section" aria-labelledby="stack-title">
      <div class="container">
        <app-section-heading index="04" [file]="ui.files.stack" [title]="ui.titles.stack" headingId="stack-title">
          <p class="lead intro">{{ ui.stackIntro }}</p>
        </app-section-heading>

        <div class="window" appReveal>
          <div class="window__bar">
            <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="window__tab">stack.json</span>
            @for (b of badges; track $index) {
              <span class="badge mono">✓ {{ i18n.t(b) }}</span>
            }
          </div>
          <div class="json mono">
            <span class="tok-pun brace">{{ '{' }}</span>
            <div class="groups">
              @for (g of groups; track g.key; let last = $last) {
                <div class="group">
                  <span class="tok-com">// {{ i18n.t(g.group) }}</span>
                  <div>
                    <span class="tok-key">"{{ g.key }}"</span><span class="tok-pun">: [</span>
                  </div>
                  <ul role="list" class="items">
                    @for (s of g.items; track s; let lastItem = $last) {
                      <li><span class="tok-str">"{{ s }}"</span>@if (!lastItem) {<span class="tok-pun">,</span>}</li>
                    }
                  </ul>
                  <span class="tok-pun">]{{ last ? '' : ',' }}</span>
                </div>
              }
            </div>
            <span class="tok-pun brace">{{ '}' }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .intro { margin-top: 1rem; }
    .window__bar { flex-wrap: wrap; }
    .badge {
      margin-left: auto;
      padding: 0.1rem 0.55rem;
      border: 1px solid var(--green);
      border-radius: 999px;
      color: var(--green);
      font-size: 0.7rem;
      white-space: nowrap;
    }
    .json { padding: 1.4rem clamp(1rem, 3vw, 2rem); font-size: 0.88rem; line-height: 1.8; }
    .groups {
      columns: 3 16rem;
      column-gap: 2.5rem;
      padding: 0.5rem 0 0.5rem 1.5rem;
    }
    .group { break-inside: avoid; margin-bottom: 1.1rem; }
    .items { margin: 0; padding-left: 1.5rem; }
    .items li { transition: transform 0.2s var(--ease); }
    .items li:hover { transform: translateX(4px); }
    @media (max-width: 560px) {
      .badge { margin-left: 0; }
      .groups { padding-left: 0.75rem; }
    }
  `,
})
export class SkillsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly groups = SITE.skills;
  protected readonly badges = SITE.badges;
}
