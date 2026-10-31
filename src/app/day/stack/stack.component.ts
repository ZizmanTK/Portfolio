import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { type Experience, SITE, headingLines } from '../../core/content';
import { I18n } from '../../core/i18n';
import { RichComponent } from '../rich.component';
import { contractOf, roleInfo } from '../role-info';
import { stopLabel, useScene } from '../engine/use-scene';
import { duskScene, stackScene } from './stack.scene';

const BASSETTI = SITE.experience.filter((e) => e.company === SITE.profile.company);
/** Oldest first: the internship, the fixed-term contract, the permanent one. */
const [INTERN, FIXED, NOW] = [...BASSETTI].reverse();
const GRENOBLE = SITE.route.find((r) => r.now)!;
const REMIND = SITE.projects.find((p) => p.slug === 'remind')!;
const TXBOT = SITE.projects.find((p) => p.slug === 'txbot')!;

const yy = (ym: string) => ym.slice(0, 4);
/** "2024", "2024–25", "2025–" */
const years = (e: Experience) => (!e.end ? `${yy(e.start)}–` : yy(e.start) === yy(e.end) ? yy(e.start) : `${yy(e.start)}–${e.end.slice(2, 4)}`);

/**
 * Stops 06-08 · Grenoble, BASSETTI France: he arrives on the Bastille, then his three contracts stack like ZKTris
 * blocks; the third falls while the sun goes down (the dusk), and the last stop is at night.
 */
@Component({
  selector: 'section[appStack]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent],
  host: { class: 'hobby seg stack', id: 'bassetti', '[attr.data-place]': 'i18n.t(SITE.day.places.bassetti)' },
  template: `
  <div class="scene">
    <div class="arrival">
      <img decoding="async" class="pano" src="assets/art/grenoble.webp" [alt]="i18n.t(b.pano)" width="1664" height="768" loading="lazy">
      <img decoding="async" class="summit" src="assets/art/summit.webp" [alt]="i18n.t(b.summit)" width="354" height="820" loading="lazy">
      <p class="arrival-note mono">{{ i18n.t(b.arrival) }}</p>
    </div>
    <div class="well-wrap" aria-hidden="true">
      <svg class="well" id="well"></svg>
    </div>
    <div class="roles">
      <article class="role" id="intern" data-stop="6">
        <p class="label mono" data-stop="6" [attr.data-time]="b.times[0]"><span class="node" aria-hidden="true"></span>{{ labels()[0] }}</p>
        <img decoding="async" class="role-fig" src="assets/art/desk.webp" [alt]="i18n.t(b.desk)" width="858" height="900" loading="lazy">
        <h2 class="h-role">@for (l of headings()[0]; track $index) {<span class="ln"><span>{{ l }}</span></span> }</h2>
        <dl class="info">
          @for (row of infos()[0]; track row.k) {<div><dt>{{ row.k }}</dt><dd>{{ row.v }}</dd></div>
          }
        </dl>
        <ul class="points">
          @for (h of intern.highlights; track $index) {<li [rich]="i18n.t(h)"></li>
          }
        </ul>
        <article class="project mini" id="remind">
          <div class="project-media frame"><img decoding="async" [src]="remind.image" [alt]="i18n.t(b.remind)" width="1400" height="718" loading="lazy"></div>
          <dl class="project-row">
            <div class="pr-name"><dt class="sr-only">{{ ui().row.project }}</dt><dd><b>{{ remind.name }}</b> <span class="muted">{{ i18n.t(remind.kicker!) }}</span></dd></div>
            <div class="pr-desc"><dt class="sr-only">{{ ui().row.what }}</dt><dd>{{ i18n.t(remind.tagline) }}</dd></div>
            <div><dt class="sr-only">{{ ui().row.link }}</dt><dd><a class="link" [href]="remind.links.demo" rel="noopener">{{ ui().watchDemo(remind.name) }}</a></dd></div>
          </dl>
        </article>
      </article>
      <article class="role" id="fixed" data-stop="7">
        <p class="label mono" data-stop="7" [attr.data-time]="b.times[1]"><span class="node" aria-hidden="true"></span>{{ labels()[1] }}</p>
        <h2 class="h-role">@for (l of headings()[1]; track $index) {<span class="ln"><span>{{ l }}</span></span> }</h2>
        <dl class="info">
          @for (row of infos()[1]; track row.k) {<div><dt>{{ row.k }}</dt><dd>{{ row.v }}</dd></div>
          }
        </dl>
        <ul class="points">
          @for (h of fixed.highlights; track $index) {<li [rich]="i18n.t(h)"></li>
          }
        </ul>
        <article class="project mini" id="txbot">
          <div class="project-media pipe" aria-hidden="true">
            <svg viewBox="0 0 560 150" class="pipeline">
              <g class="pl-box"><rect x="6" y="48" width="104" height="54" rx="2"/><text x="58" y="72">{{ ui().pipeline.question }}</text><text x="58" y="88" class="s">{{ ui().pipeline.engineer }}</text></g>
              <g class="pl-box"><rect x="150" y="48" width="118" height="54" rx="2"/><text x="209" y="72">{{ ui().pipeline.retrieve }}</text><text x="209" y="88" class="s">{{ ui().pipeline.sources }}</text></g>
              <g class="pl-box"><rect x="308" y="48" width="100" height="54" rx="2"/><text x="358" y="72">LLM</text><text x="358" y="88" class="s">LangChain</text></g>
              <g class="pl-box em"><rect x="448" y="48" width="106" height="54" rx="2"/><text x="501" y="72">{{ ui().pipeline.answer }}</text><text x="501" y="88" class="s">{{ ui().pipeline.grounded }}</text></g>
              <path class="pl-wire" d="M110 75H150M268 75H308M408 75H448"/>
              <circle class="pl-dot" r="3.5" cx="130" cy="75"/>
            </svg>
          </div>
          <dl class="project-row">
            <div class="pr-name"><dt class="sr-only">{{ ui().row.project }}</dt><dd><b>{{ txbot.name }}</b> <span class="muted">{{ i18n.t(txbot.kicker!) }}</span></dd></div>
            <div class="pr-desc"><dt class="sr-only">{{ ui().row.what }}</dt><dd>{{ i18n.t(txbot.tagline) }}</dd></div>
            <div><dt class="sr-only">{{ ui().row.status }}</dt><dd class="muted">{{ i18n.t(txbot.status!) }}</dd></div>
          </dl>
        </article>
      </article>
      <!-- Dusk: the third block falls while the sun goes down behind the mountains. No text here on purpose: the sky passes
           through mid-tones where neither dark nor light ink reaches AA contrast, so the page waits until it is night. -->
      <div class="dusk" id="dusk" data-clock-in="19:00" data-clock-out="19:20" data-stop="7" aria-hidden="true">
        <div class="dusk-scene"><svg class="dusk-svg" id="duskSvg"></svg></div>
      </div>
      <article class="role now night" id="now" data-stop="8">
        <p class="label mono" data-stop="8" [attr.data-time]="b.times[2]"><span class="node" aria-hidden="true"></span>{{ labels()[2] }}</p>
        <img decoding="async" class="role-fig lamp" src="assets/art/desknight.webp" [alt]="i18n.t(b.night)" width="860" height="900" loading="lazy">
        <h2 class="h-role">@for (l of headings()[2]; track $index) {<span class="ln"><span>{{ l }}</span></span> }</h2>
        <dl class="info">
          @for (row of infos()[2]; track row.k) {<div><dt>{{ row.k }}</dt><dd>{{ row.v }}</dd></div>
          }
        </dl>
        <ul class="points">
          @for (h of now.highlights; track $index) {<li [rich]="i18n.t(h)"></li>
          }
        </ul>
        <p class="stackline mono">{{ now.stack.join(' · ') }}</p>
      </article>
    </div>
    <svg class="thread scene-thread" id="stackThread" aria-hidden="true"></svg>
  </div>
`,
})
export class StackComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
  protected readonly b = SITE.day.bassetti;
  protected readonly intern = INTERN;
  protected readonly fixed = FIXED;
  protected readonly now = NOW;
  protected readonly remind = REMIND;
  protected readonly txbot = TXBOT;
  private readonly jobs = [INTERN, FIXED, NOW];
  protected readonly labels = computed(() => {
    const ui = this.ui(), here = `${GRENOBLE.city}, ${this.i18n.t(GRENOBLE.country)}`;
    return [stopLabel(ui.stop, 6, this.b.times[0], here), stopLabel(ui.stop, 7, this.b.times[1], here), stopLabel(ui.stop, 8, this.b.times[2], this.i18n.t(SITE.day.places.now))];
  });
  /** The role as a heading; a role too long for one (the French "Ingénieur en Intelligence Artificielle") takes its short form. */
  protected readonly headings = computed(() => this.jobs.map((e) => {
    const role = this.i18n.t(e.role);
    return headingLines(role.length <= 30 ? role : this.i18n.t(e.short).split(' · ')[0]);
  }));
  protected readonly infos = computed(() => this.jobs.map((e) => roleInfo(this.i18n, e)));

  constructor() {
    const tags = this.jobs.map((e) => {
      const c = contractOf(this.i18n, e);
      return `${years(e)} · ${c === c.toUpperCase() ? c : c.toLowerCase()}`;
    }) as [string, string, string];
    const first = Math.min(...SITE.education.map((e) => +yy(e.start)));
    const before = SITE.experience.filter((e) => e.company !== SITE.profile.company).map((e) => +yy(e.end ?? e.start));
    const foundation: [string, string] = [`${first}–${String(Math.max(...before)).slice(2)}`, this.i18n.t(this.b.foundation)];
    useScene((host, ctx) => {
      const dusk = host.querySelector<HTMLElement>('#dusk');
      return [stackScene(host, ctx, { tags, foundation }), ...(dusk ? [duskScene(dusk, ctx)] : [])];
    });
  }
}
