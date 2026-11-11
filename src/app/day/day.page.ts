import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Lang } from '../core/content';
import { I18n } from '../core/i18n';
import { SeoService } from '../core/seo.service';
import { BarComponent } from './bar/bar.component';
import { HeroComponent } from './hero/hero.component';
import { StopComponent } from './stop/stop.component';
import { KnightComponent } from './knight/knight.component';
import { SignalComponent } from './signal/signal.component';
import { CoilComponent } from './coil/coil.component';
import { CoilRealComponent } from './coil/coil-real.component';
import { ClimbComponent } from './climb/climb.component';
import { StackComponent } from './stack/stack.component';
import { RollComponent } from './roll/roll.component';
import { AfterComponent } from './after/after.component';
import { ServeComponent } from './serve/serve.component';
import { ResumeViewComponent } from './resume/resume-view.component';
import { FooterComponent } from './footer.component';
import { DayEngine } from './engine/engine';

/**
 * The story page: a walk through a day, ten stops from first light in Niamey to tonight in Grenoble. Each section is a
 * component; the scroll engine (src/app/day/engine) starts once the page is hydrated and drives the set pieces.
 */
@Component({
  selector: 'app-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BarComponent, HeroComponent, StopComponent, KnightComponent, SignalComponent, CoilComponent, CoilRealComponent,
    ClimbComponent, StackComponent, RollComponent, AfterComponent, ServeComponent, ResumeViewComponent, FooterComponent,
  ],
  template: `
    <a class="skip" [href]="i18n.anchor('main')">{{ i18n.ui().skipToContent }}</a>
    <!-- The sky: one fixed layer whose colour and light follow the time of day (set by the engine). -->
    <div class="sky" id="sky" aria-hidden="true"><div class="sun sun-w" id="sunW"></div><div class="sun sun-o" id="sunO"></div></div>
    <header appBar></header>
    <main id="main">
      <section appHero></section>
      <section appStop="niamey"></section>
      <section appKnight></section>
      <section appStop="rabat"></section>
      <section appSignal></section>
      <section appStop="strasbourg"></section>
      <section appCoil></section>
      <section appCoilReal></section>
      <section appClimb></section>
      <section appStack></section>
      <section appRoll></section>
      <section appAfter></section>
      <section appServe></section>
    </main>
    <section appResumeView></section>
    <footer appFooter></footer>
  `,
})
export class DayPage {
  protected readonly i18n = inject(I18n);

  constructor() {
    const lang = (inject(ActivatedRoute).snapshot.data['lang'] ?? 'en') as Lang;
    this.i18n.lang.set(lang);
    this.i18n.page.set('story');
    inject(SeoService).apply(lang, 'story');
    const engine = inject(DayEngine);
    afterNextRender(() => engine.start());
    inject(DestroyRef).onDestroy(() => engine.stop());
  }
}
