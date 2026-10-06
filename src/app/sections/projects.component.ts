import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/**
 * Selected work: one wide visual per project on the same warm panel, then a three-column
 * caption (index and context · name and one line · problem, stack and link).
 * TxBot is internal, so its visual is a labelled illustration of the flow.
 */
@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadComponent],
  template: `
    <section class="sec w" id="work">
      <app-sec-head idx="02" [title]="ui().sections.work" [intro]="ui().intro.work" />
      <div class="work">
        @for (p of projects; track p.slug; let i = $index) {
          <article class="pj" [id]="p.slug" [attr.aria-labelledby]="p.slug + '-t'">
            <div class="vis" [class.tx]="p.visual === 'pipeline'" reveal>
              @if (p.visual === 'pipeline') {
                @let t = ui().txbot;
                <div class="txv" role="img" [attr.aria-label]="t.label">
                  <div class="chat" aria-hidden="true">
                    <div class="bar"><i></i><i></i><i></i><span>TxBot</span></div>
                    <div class="msgs">
                      <p class="q">{{ t.q }}</p>
                      <div class="a">
                        {{ t.a }}
                        <div class="src"><span><b>1</b>{{ t.s1 }}</span><span><b>2</b>{{ t.s2 }}</span></div>
                      </div>
                    </div>
                  </div>
                  <p class="flow" aria-hidden="true">@for (s of t.flow; track s) { <span>{{ s }}</span> }</p>
                </div>
                <p class="cap">{{ t.cap }}</p>
              } @else {
                <img [src]="p.image" [alt]="p.name" loading="lazy" />
              }
            </div>
            <div class="meta g" reveal>
              <p class="k num">0{{ i + 1 }}<b>{{ i18n.t(p.kicker!) }}</b>{{ p.when }}</p>
              <div class="t">
                <h3 [id]="p.slug + '-t'">{{ p.name }}</h3>
                <p>{{ i18n.t(p.tagline) }}</p>
              </div>
              <dl>
                <div><dt>{{ ui().problem }}</dt><dd>{{ i18n.t(p.problem!) }}</dd></div>
                <div><dt>{{ ui().builtWith }}</dt><dd>{{ i18n.t(p.builtWith!) }}</dd></div>
                @if (p.links.demo) {
                  <div><a class="go" [href]="p.links.demo" target="_blank" rel="noopener">{{ ui().watchDemo }}</a></div>
                } @else if (p.status) {
                  <div><span class="go off">{{ i18n.t(p.status) }}</span></div>
                }
              </dl>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class ProjectsComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly projects = SITE.projects.filter((p) => p.featured);
}
