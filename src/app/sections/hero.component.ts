import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { IconComponent } from '../shared/icon.component';
import { AccentTextComponent } from '../shared/accent-text.component';
import { StickersComponent } from './stickers.component';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, AccentTextComponent, StickersComponent],
  template: `
    <section class="hero" id="top">
      <div class="stage">
        <p class="big" aria-hidden="true">{{ p.lastName }}</p>
        <img class="cut" [src]="p.portraitCutout" [alt]="i18n.ui().photoAlt" width="1368" height="1823" fetchpriority="high" />
        <div class="fade"></div>
        <div class="meta">
          <h1 class="first greet">
            <span class="wbox" aria-hidden="true"><span class="w">
              @for (g of greetings; track $index) { <span>{{ g }}</span> }
            </span></span>
            <span class="vh">{{ greetings[0] }} </span>{{ i18n.ui().im }} {{ p.name }}
          </h1>
          <p class="sub">
            <b>{{ i18n.t(p.role) }}</b> {{ i18n.ui().at }} <b class="y">{{ p.company }}</b> · {{ i18n.t(hero.contract) }} · {{ i18n.t(hero.location) }}
          </p>
        </div>
      </div>
      <div class="low wrap">
        <p class="role"><app-accent [text]="i18n.t(hero.tagline)" /></p>
        <div class="acts">
          <a class="btn f" [href]="resume()" download>{{ i18n.ui().downloadResume }} ↓</a>
          <a class="btn" [href]="'mailto:' + p.email">{{ i18n.ui().email }}</a>
          <a class="btn ic" [href]="linkedin" aria-label="LinkedIn" rel="me"><app-icon name="linkedin" /></a>
          <a class="btn ic" [href]="github" aria-label="GitHub" rel="me"><app-icon name="github" /></a>
        </div>
      </div>
    </section>

    <div class="wrap">
      <div class="nowbar">
        <p class="clock">
          <i aria-hidden="true"></i>
          <b>Grenoble</b>
          <span><time>{{ time() }}</time> {{ i18n.ui().nowBar.local }}</span>
        </p>
        <p><b>{{ i18n.ui().nowBar.building }}</b><span>{{ i18n.t(now.building) }}</span></p>
        <p><b>{{ i18n.ui().nowBar.lately }}</b><span>{{ i18n.t(now.lately) }}</span></p>
        <p><b>{{ i18n.ui().nowBar.speaks }}</b><span>{{ now.speaks }}</span></p>
      </div>
      <app-stickers />
    </div>
  `,
})
export class HeroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly p = SITE.profile;
  protected readonly hero = SITE.hero;
  protected readonly now = SITE.now;
  /** Rotating word above the name; the first one repeats so the loop restarts seamlessly. */
  protected readonly greetings = [...SITE.hero.greetings, SITE.hero.greetings[0]];
  protected readonly linkedin = SITE.socials.find((s) => s.id === 'linkedin')!.url;
  protected readonly github = SITE.socials.find((s) => s.id === 'github')!.url;
  protected readonly resume = computed(() => this.i18n.t(this.p.resume));
  /** Grenoble wall-clock time; blank until the page runs in a browser. */
  protected readonly time = signal('--:--');

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const fmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
      const tick = () => this.time.set(fmt.format(new Date()));
      tick();
      const id = setInterval(tick, 15_000);
      destroy.onDestroy(() => clearInterval(id));
    });
  }
}
