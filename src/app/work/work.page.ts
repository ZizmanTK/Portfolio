import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Lang } from '../core/content';
import { I18n } from '../core/i18n';
import { SeoService } from '../core/seo.service';
import { WorkBarComponent } from './work-bar.component';
import { IntroComponent } from './intro.component';
import { CasesComponent } from './cases.component';
import { PathComponent } from './path.component';
import { BeyondComponent } from './beyond.component';
import { ReachComponent } from './reach.component';
import { RevealDirective } from '../shared/reveal.directive';

/** Ids that only exist on the story page: an old link to one of them is sent there. */
const STORY_IDS = new Set([
  'resume', 'niamey', 'knight', 'rabat', 'signal', 'strasbourg', 'uckange', 'coilcheck-real', 'climb', 'bassetti', 'well',
  'intern', 'fixed', 'now', 'roll', 'after', 'dusk',
]);

const samePath = (p: string): string => p.replace(/\/$/, '');

/** What comes in as the reader reaches it: see RevealDirective, and styles/_work-motion.scss for how each one does. */
const PARTS = [
  '.wk-facts > div', '.wk-sw', '.wk-big', '.wk-cl', '.wk-what', '.wk-notes > div', '.wk-how', '.ag-gens li',
  '.wk-time', '.wk-time li', '.wk-edu li', '.wk-skills dl > div', '.wk-long', '.wk-cards li', '.wk-out-t', '.wk-game',
  '.wk-reach-p', '.wk-reach-do', '.wk-hello span', '.wk-knight',
].join(', ');

/**
 * The work page, the front door of the site: who Aziz is, the three projects that prove it, his experience and how to
 * reach him. It scrolls like any page: what moves on the way is in the stylesheet (styles/_work-motion.scss), and the
 * story (src/app/day) is one link away.
 */
@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WorkBarComponent, IntroComponent, CasesComponent, PathComponent, BeyondComponent, ReachComponent, RevealDirective],
  host: { class: 'wk', '(click)': 'onClick($event)' },
  template: `
    <a class="skip" [href]="i18n.anchor('main')">{{ i18n.ui().skipToContent }}</a>
    <header appWorkBar></header>
    <main id="main" [wkReveal]="parts">
      <section appIntro></section>
      <section appCases></section>
      <section appPath></section>
      <section appBeyond></section>
      <section appReach></section>
    </main>
  `,
})
export class WorkPage {
  protected readonly i18n = inject(I18n);
  protected readonly parts = PARTS;

  constructor() {
    const lang = (inject(ActivatedRoute).snapshot.data['lang'] ?? 'en') as Lang;
    this.i18n.lang.set(lang);
    this.i18n.page.set('work');
    inject(SeoService).apply(lang, 'work');
    afterNextRender(() => this.forwardOldLinks());
  }

  /** The résumé view and the stops of the day used to live at this address: their old links go on to the story. */
  private forwardOldLinks(): void {
    const id = decodeURIComponent(location.hash.slice(1));
    const old = !!id && !document.getElementById(id) && (STORY_IDS.has(id) || id.startsWith('rv-'));
    if (!old && !new URLSearchParams(location.search).has('resume')) return;
    location.replace(new URL(`${this.i18n.story()}#${id || 'resume'}`, document.baseURI).href);
  }

  /**
   * Links to a part of this page are written from the base href ("fr/#work"), so the browser would load the page again:
   * scroll to the target instead, and keep the address in step.
   */
  protected onClick(e: MouseEvent): void {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || !a.hash || a.origin !== location.origin || samePath(a.pathname) !== samePath(location.pathname)) return;
    const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(history.state, '', location.pathname + location.search + (target.id === 'top' ? '' : a.hash));
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}
