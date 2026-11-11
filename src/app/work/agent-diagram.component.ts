import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18n } from '../core/i18n';
import { InViewDirective } from '../shared/in-view.directive';

/**
 * How the TEEXMA chatbot works, drawn in HTML so every word stays real text: a question goes to one agent, the agent
 * works with two tools, an answer comes back. Below, the three designs it went through. The arrows are decoration:
 * the reading order of the markup is the order of the flow. While the figure is on screen, the stylesheet plays one round
 * of that flow again and again ([wkInView], styles/_work-motion.scss).
 */
@Component({
  selector: 'figure[appAgentDiagram]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  hostDirectives: [InViewDirective],
  host: { class: 'ag-fig' },
  template: `
  <div class="ag wk-cl">
    <p class="ag-node ag-q"><b>{{ a().question }}</b><span>{{ a().questionSub }}</span></p>
    <svg class="ag-arrow ag-a1" viewBox="0 0 36 12" aria-hidden="true"><path d="M1 6H34M29 2L34 6L29 10"/></svg>
    <div class="ag-agent">
      <p class="ag-title">{{ a().agent }}</p>
      <p class="ag-sub">{{ a().agentSub }}</p>
      <ol class="ag-steps">@for (s of a().steps; track $index) {<li><span class="ag-n" aria-hidden="true">0{{ $index + 1 }}</span>{{ s }}</li>}</ol>
      <p class="ag-retry"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M11.6 7.4A4.6 4.6 0 1 1 10 3.5M10.4 1.2V3.9H7.7"/></svg>{{ a().retry }}</p>
    </div>
    <svg class="ag-arrow ag-a2" viewBox="0 0 36 12" aria-hidden="true"><path d="M1 6H34M29 2L34 6L29 10"/></svg>
    <p class="ag-node ag-ans"><b>{{ a().answer }}</b><span>{{ a().answerSub }}</span></p>
    <div class="ag-tools">
      <p class="ag-tools-h">{{ a().tools }}</p>
      <p class="ag-node ag-tool"><svg class="ag-updown" viewBox="0 0 12 34" aria-hidden="true"><path d="M6 2V32M2 7L6 2L10 7M2 27L6 32L10 27"/></svg><b>{{ a().search }}</b><span>{{ a().searchSub }}</span></p>
      <p class="ag-node ag-tool"><svg class="ag-updown" viewBox="0 0 12 34" aria-hidden="true"><path d="M6 2V32M2 7L6 2L10 7M2 27L6 32L10 27"/></svg><b>{{ a().data }}</b><span>{{ a().dataSub }}</span></p>
    </div>
  </div>
  <div class="ag-gens">
    <p class="ag-gens-h">{{ a().designs }}</p>
    <ol>
      @for (g of a().gens; track $index; let last = $last) {
      <li [class.ag-live]="last"><i aria-hidden="true"></i>{{ g }}@if (last) { <span>{{ a().live }}</span>}</li>
      }
    </ol>
  </div>
  <figcaption>{{ a().caption }}</figcaption>
`,
})
export class AgentDiagramComponent {
  private readonly i18n = inject(I18n);
  protected readonly a = computed(() => this.i18n.ui().agent);
}
