import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/content';
import { I18n } from '../../core/i18n';
import { IconComponent } from '../../shared/icon.component';

interface Box { label: string; score: string; x: number; y: number; w: number; h: number; tone: 'signal' | 'teal' | 'coral' }

/** Detection boxes (percent of the 4:5 frame), hand-placed on each portrait. */
const BOXES: Record<'day' | 'night', Box[]> = {
  day: [
    { label: 'face', score: '0.99', x: 31, y: 5, w: 40, h: 47, tone: 'signal' },
    { label: 'ai_engineer', score: '0.98', x: 3, y: 41, w: 94, h: 56, tone: 'teal' },
    { label: 'backpack', score: '0.83', x: 9, y: 56, w: 20, h: 40, tone: 'coral' },
  ],
  night: [
    { label: 'face', score: '0.99', x: 41, y: 7, w: 24, h: 23, tone: 'signal' },
    { label: 'ai_engineer', score: '0.98', x: 20, y: 26, w: 77, h: 72, tone: 'teal' },
    { label: 'training_inspiration', score: '0.87', x: 34, y: 43, w: 33, h: 15, tone: 'coral' },
  ],
};

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly i18n = inject(I18n);
  protected readonly profile = SITE.profile;
  protected readonly socials = SITE.socials;
  protected readonly stats = SITE.about.stats;
  protected readonly detections = SITE.detections;
  protected readonly boxes = BOXES;
  protected readonly homePath = computed(() => (this.i18n.lang() === 'fr' ? '/fr' : '/'));
}
