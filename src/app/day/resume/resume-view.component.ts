import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { type Experience, SITE, plain, skillSlug, typo } from '../../core/content';
import { SKILLS_WITH_ICONS } from '../../core/skill-icons';
import { I18n } from '../../core/i18n';
import { RichComponent } from '../rich.component';

/** The single-colour mark of each company and school (styles/_logo-marks.scss). */
const MARK: Record<string, string> = {
  'BASSETTI France': 'bassetti', 'ArcelorMittal France': 'arcelormittal', 'Télécom Physique Strasbourg': 'tps',
  'CPGE Ibn Ghazi': 'ibn-ghazi', "Lycée d'Excellence de Niamey": 'lex-niamey',
};
/** The five postcards of the day: the route of site.json, each card leading to its entry in the view. */
const CARDS = [
  { city: 'Niamey', target: 'rv-edu-niamey' }, { city: 'Rabat', target: 'rv-edu-rabat' }, { city: 'Strasbourg', target: 'rv-edu-strasbourg' },
  { city: 'Uckange', target: 'rv-exp-arcelormittal' }, { city: 'Grenoble', target: 'rv-exp-bassetti' },
];
const EDU_ID: Record<string, string> = { Strasbourg: 'rv-edu-strasbourg', Rabat: 'rv-edu-rabat', Niamey: 'rv-edu-niamey' };
const PROJECTS: { slug: 'txbot' | 'remind' | 'coilcheck'; size: [number, number] }[] = [
  { slug: 'txbot', size: [1200, 750] }, { slug: 'remind', size: [1400, 718] }, { slug: 'coilcheck', size: [1400, 509] },
];

/**
 * The résumé view: the whole day on one page, from the same site.json as the PDF CV. With JS it opens as a full-screen
 * view from the button that was pressed (src/app/day/resume/resume.controller.ts); without JS it is the end of the page.
 * data-lenis-prevent: the smooth scroll leaves this panel's own scrolling alone.
 */
@Component({
  selector: 'section[appResumeView]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent],
  host: { class: 'resume shut', id: 'resume', 'aria-labelledby': 'rv-name', tabindex: '-1', 'data-lenis-prevent': '' },
  template: `
  <div class="rv">
    <header class="rv-top">
      <img class="rv-figure" src="assets/art/signature.webp" [alt]="i18n.t(SITE.day.contact.wave)" width="361" height="820" decoding="async">
      <div class="rv-id">
        <p class="rv-eyebrow">{{ i18n.t(SITE.day.resume.eyebrow) }}</p>
        <h2 class="rv-name" id="rv-name">{{ SITE.profile.name }}</h2>
        <p class="rv-role">{{ i18n.t(SITE.profile.role) }} <span>{{ focus() }}</span></p>
        <ul class="rv-meta">
          <li class="ok"><i aria-hidden="true"></i>{{ i18n.t(SITE.hero.status) }}</li>
          <li>{{ i18n.t(SITE.hero.location) }}</li>
          <li>{{ i18n.t(SITE.hero.experience) }}</li>
          <li>{{ languages() }}</li>
        </ul>
      </div>
      <div class="rv-actions">
        <a class="rv-btn gold" [href]="i18n.cv()" download>{{ ui().downloadCv }}</a>
        <a class="rv-btn" [href]="'mailto:' + SITE.profile.email">{{ SITE.profile.email }}</a>
        <a class="rv-btn" [href]="social.linkedin" rel="noopener">LinkedIn</a>
        <a class="rv-btn" [href]="social.github" rel="noopener">GitHub</a>
        <a class="rv-close" [href]="i18n.anchor('top')">{{ ui().backToDay }}</a>
      </div>
    </header>

    <nav class="rv-route" [attr.aria-label]="ui().resume.route">
      <ol>
        @for (c of cards(); track c.city; let i = $index) {
        <li [style.--i]="i"><a [href]="i18n.anchor(c.target)">
          <img [src]="'assets/art/card-' + c.city.toLowerCase() + '.webp'" [alt]="c.alt" width="600" height="400" decoding="async">
          <span class="rv-knot"><span class="rv-hour">{{ c.hour }}</span></span>
          <span class="rv-stop"><b>{{ c.city }}</b> <span class="rv-years">{{ c.years }}</span></span>
          <span class="rv-what">{{ c.what }}</span>
        </a></li>
        }
      </ol>
    </nav>

    <div class="rv-grid">
      <div class="rv-main">
        <section aria-labelledby="rv-exp-h">
          <h3 class="rv-h" id="rv-exp-h">{{ ui().resume.experience }}</h3>
          <ol class="rv-thread">
          @for (e of SITE.experience; track $index; let i = $index) {
          <li class="rv-job" [class.now]="!e.end" [attr.id]="jobId(e, i)">
            <span class="rv-knot" aria-hidden="true"></span>
            <div class="rv-job-head">
              <span [class]="'lm lm-' + mark(e.company)" aria-hidden="true"></span><h4>{{ i18n.t(e.role) }}</h4>
            </div>
            <p class="rv-co">{{ e.company }} · {{ i18n.t(e.type) }} · {{ i18n.t(e.location) }}</p>
            <p class="rv-when">{{ i18n.period(e.start, e.end) }}</p>
            <ul class="rv-hl">@for (h of e.card; track $index) {<li [rich]="i18n.t(h)"></li>}</ul>
            <ul class="rv-chips" [attr.aria-label]="ui().resume.stack">@for (s of e.stack; track s) {<li>@if (icon(s); as c) {<span [class]="'si si-' + c" aria-hidden="true"></span>}{{ s }}</li>}</ul>
          </li>
          }
          </ol>
        </section>
        <section aria-labelledby="rv-edu-h">
          <h3 class="rv-h" id="rv-edu-h">{{ ui().resume.education }}</h3>
          <ol class="rv-edu">
          @for (e of SITE.education; track e.school) {
          <li [id]="eduId[e.city]">
            <span [class]="'lm lm-' + mark(e.school)" aria-hidden="true"></span>
            <div>
              <h4>{{ degree(e.degree) }}</h4>
              <p class="rv-co">{{ typo(e.school) }} · {{ e.city }}, {{ i18n.t(e.country) }}</p>
              @if (e.award) {<p class="rv-award">{{ i18n.t(e.award) }}</p>}
            </div>
            <p class="rv-when">{{ e.start.slice(0, 4) }} – {{ e.end.slice(0, 4) }}</p>
          </li>
          }
          </ol>
        </section>
      </div>
      <div class="rv-side">
        <section aria-labelledby="rv-proj-h">
          <h3 class="rv-h" id="rv-proj-h">{{ ui().resume.projects }}</h3>
          <ol class="rv-projects">
          @for (p of projects; track p.slug) {
          <li class="rv-proj">
            <img [src]="p.data.image" [alt]="i18n.t(SITE.day.resume.projects[p.slug])" [attr.width]="p.size[0]" [attr.height]="p.size[1]" decoding="async">
            <div>
              <h4>{{ p.data.name }}</h4>
              <p class="rv-kicker">{{ plainOf(p.data.kicker!) }} · {{ p.data.when }}</p>
              <p>{{ plainOf(p.data.tagline) }}@if (p.data.status) { <span class="rv-st">{{ plainOf(p.data.status) }}.</span>}</p>
              @if (p.data.links.demo) {<a class="link" [href]="p.data.links.demo" rel="noopener">{{ ui().watchDemo(p.data.name) }}</a>}
            </div>
          </li>
          }
          </ol>
        </section>
        <section aria-labelledby="rv-skills-h">
          <h3 class="rv-h" id="rv-skills-h">{{ ui().resume.skills }}</h3>
          <dl class="rv-skills">
            @for (g of SITE.skills; track $index) {<div><dt>{{ i18n.t(g.group) }}</dt><dd><ul class="rv-chips">@for (s of g.items; track s) {<li>@if (icon(s); as c) {<span [class]="'si si-' + c" aria-hidden="true"></span>}{{ s }}</li>}</ul></dd></div>
            }
          </dl>
          <p class="rv-badge">{{ i18n.t(SITE.badges[0]) }}</p>
        </section>
        <div class="rv-duo">
          <section aria-labelledby="rv-lang-h">
            <h3 class="rv-h" id="rv-lang-h">{{ ui().resume.languages }}</h3>
            <ul class="rv-langs">@for (l of SITE.languages; track $index) {<li><b>{{ i18n.t(l.name) }}</b><span>{{ i18n.t(l.level) }}</span></li>}</ul>
          </section>
          <section aria-labelledby="rv-out-h">
            <h3 class="rv-h" id="rv-out-h">{{ ui().resume.outside }}</h3>
            <ul class="rv-hobbies">@for (x of SITE.interests; track $index) {<li>{{ i18n.t(x) }}</li>}</ul>
            <p class="rv-games">@for (g of games; track g.slug) {<a class="link" [href]="g.links.play" rel="noopener">{{ g.name }}</a> }</p>
          </section>
        </div>
      </div>
    </div>
    <p class="rv-mission">{{ i18n.t(SITE.profile.mission) }}</p>
  </div>
`,
})
export class ResumeViewComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly SITE = SITE;
  protected readonly typo = typo;
  protected readonly eduId = EDU_ID;
  protected readonly social = Object.fromEntries(SITE.socials.map((s) => [s.id, s.url])) as Record<'github' | 'linkedin' | 'itch', string>;
  protected readonly projects = PROJECTS.map((p) => ({ ...p, data: SITE.projects.find((x) => x.slug === p.slug)! }));
  protected readonly games = ['zktris', 'roll-power'].map((s) => SITE.projects.find((p) => p.slug === s)!);
  protected readonly focus = computed(() => SITE.hero.focus.map((f) => this.i18n.t(f)).join(' · '));
  protected readonly languages = computed(() => SITE.languages.map((l) => this.i18n.t(l.name)).join(' · '));
  protected readonly cards = computed(() => CARDS.map((c, i) => {
    const r = SITE.route.find((x) => x.city === c.city)!;
    return {
      ...c, hour: SITE.day.resume.hours[i], alt: this.i18n.t(SITE.day.resume.cards[i]),
      years: r.years + (r.now ? `–${this.ui().now}` : ''), what: this.i18n.t(r.what),
    };
  }));

  protected mark(name: string): string {
    return MARK[name] ?? '';
  }
  protected jobId(e: Experience, i: number): string | null {
    return e.company.startsWith('ArcelorMittal') ? 'rv-exp-arcelormittal' : i === 0 ? 'rv-exp-bassetti' : null;
  }
  protected icon(skill: string): string | null {
    return SKILLS_WITH_ICONS.has(skill) ? skillSlug(skill) : null;
  }
  protected degree(d: { en: string; fr: string }): string {
    return typo(this.i18n.t(d)).replace(' — ', ', ');
  }
  protected plainOf(v: { en: string; fr: string }): string {
    return plain(this.i18n.t(v));
  }
}
