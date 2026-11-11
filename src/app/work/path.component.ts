import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE, monthsBetween, typo } from '../core/content';
import { I18n } from '../core/i18n';
import { RichComponent } from '../day/rich.component';
import { FitTextDirective } from '../shared/fit-text.directive';
import { RoomDirective } from '../shared/room.directive';

/** One colour per job, oldest first: the colours of the three projects, then the gold of today. */
const COLOURS = ['#175a44', '#a33818', '#111934', '#fbb915'];

const today = new Date();
const NOW = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
/** The axis runs from January of the year of the first job to the end of this year. */
const FIRST = +SITE.experience.at(-1)!.start.slice(0, 4);
const YEARS = Array.from({ length: today.getFullYear() - FIRST + 1 }, (_, i) => FIRST + i);

/**
 * The jobs, newest first as in a résumé, each with its place on the axis: its first month, its number of months (a job
 * stops where the next one starts), and its side of the axis, which alternates so two neighbours never share a row.
 */
const JOBS = SITE.experience.map((e, i, all) => {
  const age = all.length - 1 - i;
  const next = all[i - 1];
  const months = monthsBetween(e.start, e.end ?? NOW);
  return {
    e,
    col: monthsBetween(`${FIRST}-01`, e.start),
    span: next ? Math.min(months, monthsBetween(e.start, next.start) - 1) : months,
    up: age % 2 === 1,
    colour: COLOURS[age % COLOURS.length],
  };
});

/** Experience as a timeline drawn from the real dates, then the education and the skills. */
@Component({
  selector: 'section[appPath]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  imports: [RichComponent, FitTextDirective, RoomDirective],
  host: { class: 'wk-path wk-sheet wk-gr wk-g-paper', id: 'path', 'aria-labelledby': 'path-h' },
  template: `
  <div class="wk-run">
    <i class="wk-track" aria-hidden="true"></i>
    <div class="wk-pin" wkRoom>
      <p class="wk-meta wk-lab"><b>(03)</b> <span>{{ ui().work.fourRoles }}</span> <span>{{ years[0] }} — {{ ui().present }}</span></p>
      <h2 class="wk-big" id="path-h"><span class="wk-sw" wkFit="shrink">{{ ui().resume.experience }}</span></h2>
      <div class="wk-time" [style.--months]="years.length * 12">
        <ol>
          @for (j of jobs; track j.e.start) {
          <li [class.wk-up]="j.up" [style.--c]="j.col" [style.--s]="j.span" [style.--k]="j.colour">
            <i aria-hidden="true"></i>
            <div>
              <p class="wk-lab">{{ i18n.dates(j.e.start, j.e.end) }} · {{ i18n.show(j.e.type) }}</p>
              <h3>{{ i18n.show(j.e.role) }}</h3>
              <p class="wk-co">{{ i18n.list([j.e.company, i18n.show(j.e.location)]) }}</p>
              @if (j.e.line; as line) {<p class="wk-d" [rich]="i18n.show(line)"></p>}
            </div>
          </li>
          }
        </ol>
        <span class="wk-head" aria-hidden="true"></span>
        <p class="wk-axis wk-lab" aria-hidden="true">@for (y of years; track y) {<span [style.--c]="$index * 12 + 1">{{ y }}</span>}<span class="wk-to">{{ ui().present }} →</span></p>
      </div>
    </div>
  </div>
  <div class="wk-more wk-g">
    <div class="wk-edu">
      <h3 class="wk-lab">{{ ui().resume.education }}</h3>
      <ol>
        @for (e of education(); track e.title) {
        <li>
          <span class="wk-lab">{{ e.years }}</span>
          <p><b>{{ e.title }}</b>{{ e.rest }}@if (e.award) {<span>{{ e.award }}</span>}</p>
        </li>
        }
      </ol>
    </div>
    <div class="wk-skills">
      <h3 class="wk-lab">{{ ui().resume.skills }}</h3>
      <dl>
        @for (g of skills(); track g.name) {
        <div><dt>{{ g.name }}</dt><dd>{{ g.items }}</dd></div>
        }
      </dl>
    </div>
  </div>
`,
})
export class PathComponent {
  protected readonly i18n = inject(I18n);
  protected readonly ui = this.i18n.ui;
  protected readonly jobs = JOBS;
  protected readonly years = YEARS;

  /** Each degree as a title and one line under it: the field, the school and where it is. */
  protected readonly education = computed(() =>
    SITE.education.map((e) => {
      const [title, field] = this.i18n.show(e.degree).split(' — ');
      const where = [typo(e.school), ...(e.school.includes(e.city) ? [] : [e.city]), this.i18n.show(e.country)].join(', ');
      return {
        title,
        rest: this.i18n.list(field ? [field, where] : [where]),
        years: `${e.start.slice(0, 4)} — ${e.end.slice(2, 4)}`,
        award: e.award ? this.i18n.show(e.award) : '',
      };
    }),
  );

  /** The skill groups, then the spoken languages with their level. */
  protected readonly skills = computed(() => [
    ...SITE.skills.map((g) => ({ name: this.i18n.show(g.group), items: g.items.join(', ') })),
    {
      name: this.ui().work.spoken,
      items: SITE.languages.map((l) => `${this.i18n.show(l.name)} (${this.i18n.show(l.level).toLowerCase()})`).join(', '),
    },
  ]);
}
