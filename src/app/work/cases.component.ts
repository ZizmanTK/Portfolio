import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { type L, type ProofLink, type Project, SITE, projectTitle } from '../core/content';
import { I18n } from '../core/i18n';
import { FitTextDirective } from '../shared/fit-text.directive';
import { InViewDirective } from '../shared/in-view.directive';
import { AgentDiagramComponent } from './agent-diagram.component';

/** The three projects, in the order a recruiter should read them. The chatbot has a diagram, the others a real output. */
const CASES: { slug: string; shot?: { size: [number, number]; alt: L; white?: boolean } }[] = [
  { slug: 'txbot' },
  { slug: 'remind', shot: { size: [1400, 718], alt: SITE.day.bassetti.remind } },
  { slug: 'coilcheck', shot: { size: [1400, 509], alt: SITE.day.uckange.realAlt, white: true } },
];

/** What comes after the dot in a line such as "LLM agent, RAG · in production". */
const afterDot = (l: L): L => ({ en: l.en.split(' · ').pop()!, fr: l.fr.split(' · ').pop()! });

/**
 * The work: a heading, then each project on its own colour (what it is, my part, how it works, status, stack).
 * The colours are the contrast between the projects, so each one reads as its own page.
 */
@Component({
  selector: 'section[appCases]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [AgentDiagramComponent, FitTextDirective, InViewDirective],
  host: { class: 'wk-cases', id: 'work', 'aria-labelledby': 'work-h' },
  template: `
  <div class="wk-sec-h wk-gr wk-g-white">
    <h2 class="wk-sw" id="work-h">{{ ui().work.selected }}</h2>
    <p class="wk-lab"><b>(02)</b> {{ ui().work.threeProjects }}<br>{{ from }} — {{ ui().present }}</p>
  </div>
  @for (c of cases; track c.slug; let i = $index) {
  <article class="wk-case wk-sheet wk-gr" [class]="'wk-g-' + (i + 1)" [id]="c.slug" [attr.aria-labelledby]="c.slug + '-h'">
    <p class="wk-meta wk-lab">
      <b>0{{ i + 1 }}</b>
      <span>{{ i18n.show(c.p.kicker!) }}</span>
      <span>{{ i18n.show(c.p.when!) }}</span>
      @if (c.p.aka; as aka) {<span class="wk-aka">{{ i18n.show(aka) }}</span>}
      <span class="wk-live" wkInView="0px"><i aria-hidden="true"></i>{{ i18n.show(c.live) }}</span>
    </p>
    <h3 class="wk-big" [id]="c.slug + '-h'"><span class="wk-sw" wkFit="shrink">{{ projectTitle(c.p, i18n.lang()) }}</span></h3>
    @if (c.shot; as s) {
    <div class="wk-pair wk-g" [class.wk-flip]="i === 2">
      <div class="wk-tx">
        <p class="wk-what">{{ i18n.show(c.study.what ?? c.p.tagline) }}</p>
        <dl class="wk-notes">
          <div><dt class="wk-lab">{{ ui().work.part }}</dt><dd>{{ i18n.show(c.study.part) }}</dd></div>
          <div><dt class="wk-lab">{{ ui().work.how }}</dt><dd>{{ i18n.show(c.study.how) }}</dd></div>
        </dl>
      </div>
      <figure class="wk-vis">
        <img class="wk-cl" [class.wk-on-white]="s.white" [src]="c.p.image" [alt]="i18n.show(s.alt)" [attr.width]="s.size[0]" [attr.height]="s.size[1]" loading="lazy" decoding="async">
        @if (c.study.caption; as caption) {<figcaption class="wk-lab">{{ i18n.show(caption) }}</figcaption>}
      </figure>
      <dl class="wk-notes wk-under">
        <div>
          <dt class="wk-lab">{{ ui().work.state }}</dt>
          <dd>{{ i18n.show(c.study.state) }}@for (l of c.study.proof ?? []; track l.url) { <a class="wk-tl" [href]="url(l)" rel="noopener">{{ i18n.show(l.label) }} <span aria-hidden="true">↗</span></a>}</dd>
        </div>
        <div><dt class="wk-lab">{{ ui().resume.stack }}</dt><dd>{{ i18n.list(c.p.stack) }}</dd></div>
      </dl>
    </div>
    } @else {
    <div class="wk-txt wk-g">
      <p class="wk-what">{{ i18n.show(c.study.what ?? c.p.tagline) }}</p>
      <dl class="wk-notes">
        <div class="wk-tall"><dt class="wk-lab">{{ ui().work.part }}</dt><dd>{{ i18n.show(c.study.part) }}</dd></div>
        <div>
          <dt class="wk-lab">{{ ui().work.state }}</dt>
          <dd>{{ i18n.show(c.study.state) }}@for (l of c.study.proof ?? []; track l.url) { <a class="wk-tl" [href]="url(l)" rel="noopener">{{ i18n.show(l.label) }} <span aria-hidden="true">↗</span></a>}</dd>
        </div>
        <div><dt class="wk-lab">{{ ui().resume.stack }}</dt><dd>{{ i18n.list(c.p.stack) }}</dd></div>
      </dl>
    </div>
    <div class="wk-how wk-g">
      <p class="wk-lab">{{ ui().work.how }}</p>
      <p>{{ i18n.show(c.study.how) }}</p>
    </div>
    <figure appAgentDiagram></figure>
    }
  </article>
  }
`,
})
export class CasesComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly projectTitle = projectTitle;
  /** The year of the first project. */
  protected readonly from = SITE.experience.at(-1)!.start.slice(0, 4);
  protected readonly cases = CASES.map((c) => {
    const p = SITE.projects.find((x) => x.slug === c.slug) as Project;
    return { ...c, p, study: p.study!, live: afterDot(p.study!.index) };
  });

  /** A source has one address, or one per language. */
  protected url(l: ProofLink): string {
    return typeof l.url === 'string' ? l.url : l.url[this.i18n.lang()];
  }
}
