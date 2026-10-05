import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';
import { IconComponent } from '../shared/icon.component';
import { AccentTextComponent } from '../shared/accent-text.component';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, AccentTextComponent],
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
      <div class="nums">
        @for (s of stats; track $index) {
          <div><b>{{ s.value }}<i>{{ s.accent }}</i></b><span>{{ i18n.t(s.label) }}<br />{{ i18n.t(s.note) }}</span></div>
        }
      </div>
    </div>
    <div class="mq" aria-hidden="true">
      <div class="tr">
        @for (item of storyTwice; track $index) { <span>{{ i18n.t(item) }}</span> }
      </div>
    </div>
  `,
})
export class HeroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly p = SITE.profile;
  protected readonly hero = SITE.hero;
  protected readonly stats = SITE.stats;
  /** Rotating word above the name; the first one repeats so the loop restarts seamlessly. */
  protected readonly greetings = [...SITE.hero.greetings, SITE.hero.greetings[0]];
  protected readonly storyTwice = [...SITE.story, ...SITE.story];
  protected readonly linkedin = SITE.socials.find((s) => s.id === 'linkedin')!.url;
  protected readonly github = SITE.socials.find((s) => s.id === 'github')!.url;
  protected readonly resume = computed(() => this.i18n.t(this.p.resume));
}
