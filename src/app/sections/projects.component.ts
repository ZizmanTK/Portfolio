import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeadComponent } from '../shared/section-head.component';

/**
 * Each project repeats the hero's move: its name set huge in the condensed cut, the visual
 * laid over the end of the word, the facts in a quiet column underneath. Sides alternate.
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
        @for (p of projects; track p.slug; let i = $index; let odd = $odd) {
          <article class="pj" [class.rev]="odd" [id]="p.slug" [attr.aria-labelledby]="p.slug + '-t'">
            <p class="k" reveal><span class="num y">0{{ i + 1 }}</span><span>{{ i18n.t(p.kicker!) }}</span><span>{{ p.when }}</span></p>
            <div class="pstage">
              <h3 class="pname" [id]="p.slug + '-t'" reveal>{{ p.name }}</h3>
              <div class="vis" reveal>
                @if (p.visual === 'pipeline') {
                  @let t = ui().txbot;
                  <figure class="txv" role="img" [attr.aria-label]="t.label">
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
                    <figcaption class="cap">{{ t.cap }}</figcaption>
                  </figure>
                } @else {
                  <img [src]="p.image" [alt]="p.name" loading="lazy" />
                }
              </div>
              <div class="pinfo" reveal>
                <p class="tag">{{ i18n.t(p.tagline) }}</p>
                <dl>
                  <div><dt>{{ ui().problem }}</dt><dd>{{ i18n.t(p.problem!) }}</dd></div>
                  <div><dt>{{ ui().builtWith }}</dt><dd>{{ i18n.t(p.builtWith!) }}</dd></div>
                </dl>
                @if (p.links.demo) {
                  <a class="go" [href]="p.links.demo" target="_blank" rel="noopener">{{ ui().watchDemo }}</a>
                } @else if (p.status) {
                  <span class="go off">{{ i18n.t(p.status) }}</span>
                }
              </div>
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
