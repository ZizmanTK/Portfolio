import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Lang } from '../core/content';
import { I18n } from '../core/i18n';
import { SeoService } from '../core/seo.service';
import { BarComponent } from '../day/bar/bar.component';
import { HeroComponent } from '../day/hero/hero.component';
import { StopComponent } from '../day/stop/stop.component';
import { KnightComponent } from '../day/knight/knight.component';
import { SignalComponent } from '../day/signal/signal.component';
import { CoilComponent } from '../day/coil/coil.component';
import { CoilRealComponent } from '../day/coil/coil-real.component';
import { ClimbComponent } from '../day/climb/climb.component';
import { StackComponent } from '../day/stack/stack.component';
import { RollComponent } from '../day/roll/roll.component';
import { AfterComponent } from '../day/after/after.component';
import { ServeComponent } from '../day/serve/serve.component';
import { ResumeViewComponent } from '../day/resume/resume-view.component';
import { FooterComponent } from '../day/footer.component';
import { DayEngine } from '../day/engine/engine';

/**
 * The page: a walk through a day, ten stops from first light in Niamey to tonight in Grenoble. Each section is a
 * component; the scroll engine (src/app/day/engine) starts once the page is hydrated and drives the set pieces.
 */
@Component({
  selector: 'app-home',
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
export class HomePage {
  protected readonly i18n = inject(I18n);

  constructor() {
    const lang = (inject(ActivatedRoute).snapshot.data['lang'] ?? 'en') as Lang;
    this.i18n.lang.set(lang);
    inject(SeoService).apply(lang);
    const engine = inject(DayEngine);
    afterNextRender(() => engine.start());
    inject(DestroyRef).onDestroy(() => engine.stop());
  }
}
