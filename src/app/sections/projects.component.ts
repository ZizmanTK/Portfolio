import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { AccentTextComponent } from '../shared/accent-text.component';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccentTextComponent],
  template: `
    <section class="sec" id="projects">
      <h2 class="tt rv"><span class="n">03</span>{{ i18n.ui().sections.projects }}</h2>
      <p class="lead rv"><app-accent mode="b" [text]="i18n.ui().projLead" /></p>
      <div class="proj">
        @for (p of projects; track p.slug; let odd = $odd) {
          <article class="pc rv" [class.rev]="odd" [id]="p.slug">
            <div class="vis">
              @if (p.visual === 'pipeline') {
                @let t = i18n.ui().pipeline;
                <svg class="pipe" viewBox="0 0 520 380" role="img" [attr.aria-label]="t.label">
                  <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#141414" /></marker></defs>
                  <g font-family="Space Grotesk, sans-serif" fill="#141414">
                    <rect x="20" y="30" width="200" height="84" rx="16" fill="#fff" stroke="#d7d5cc" />
                    <text x="40" y="62" font-size="13" fill="#7a786f">{{ t.chat }}</text><text x="40" y="92" font-size="17" font-weight="600">{{ t.question }}</text>
                    <rect x="300" y="30" width="200" height="84" rx="16" fill="#fff" stroke="#d7d5cc" />
                    <text x="320" y="62" font-size="13" fill="#7a786f">LANGCHAIN</text><text x="320" y="92" font-size="18" font-weight="600">{{ t.retriever }}</text>
                    <rect x="300" y="170" width="200" height="84" rx="16" fill="#f4f3ee" stroke="#b9b6aa" stroke-dasharray="5 5" />
                    <text x="320" y="202" font-size="13" fill="#7a786f">{{ t.sources }}</text><text x="320" y="232" font-size="15" font-weight="600">{{ t.docs }}</text>
                    <rect x="300" y="290" width="200" height="72" rx="16" fill="#fbb915" />
                    <text x="320" y="322" font-size="13" fill="#111">{{ t.model }}</text><text x="320" y="347" font-size="18" font-weight="700" fill="#111">LLM</text>
                    <rect x="20" y="290" width="200" height="72" rx="16" fill="#fff" stroke="#c99200" />
                    <text x="40" y="322" font-size="13" fill="#7a786f">{{ t.back }}</text><text x="40" y="347" font-size="17" font-weight="600">{{ t.answer }}</text>
                    <path d="M220 72H296" stroke="#141414" stroke-width="2" marker-end="url(#ar)" />
                    <path d="M400 114V166" stroke="#141414" stroke-width="2" marker-end="url(#ar)" />
                    <path d="M400 254V286" stroke="#141414" stroke-width="2" marker-end="url(#ar)" />
                    <path d="M300 326H224" stroke="#141414" stroke-width="2" marker-end="url(#ar)" />
                  </g>
                </svg>
              } @else {
                <img [src]="p.image" [alt]="p.name" loading="lazy" />
              }
            </div>
            <div class="pt">
              <p class="k kick"><span class="y">{{ i18n.t(p.kicker!) }}</span><span>{{ p.when }}</span></p>
              <h3>{{ p.name }}</h3>
              <p class="d">{{ i18n.t(p.tagline) }}</p>
              <dl>
                <div><dt>{{ i18n.ui().problem }}</dt><dd>{{ i18n.t(p.problem!) }}</dd></div>
                <div><dt>{{ i18n.ui().builtWith }}</dt><dd>{{ i18n.t(p.builtWith!) }}</dd></div>
              </dl>
              @if (p.status || p.links.demo) {
                <div class="go">
                  @if (p.links.demo) { <a class="lnk" [href]="p.links.demo" target="_blank" rel="noopener">{{ i18n.ui().watchDemo }}</a> }
                  @if (p.status) { <span class="lnk static">{{ i18n.t(p.status) }}</span> }
                </div>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class ProjectsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly projects = SITE.projects.filter((p) => p.featured);
}
