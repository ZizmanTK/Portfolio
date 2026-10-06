import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild, viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { SITE } from '../core/content';
import { I18n } from '../core/i18n';

interface Body { x: number; y: number; vx: number; vy: number; r: number; w: number; h: number }

/** Hand-placed starting spots (fractions of the free width/height, degrees of tilt). */
const SPOTS: [number, number, number][] = [
  [0.02, 0.18, -5], [0.17, 0.62, 4], [0.3, 0.08, 2], [0.4, 0.5, -3], [0.53, 0.12, 5],
  [0.66, 0.58, -4], [0.76, 0.14, 3], [0.9, 0.5, -6], [0.12, 0.92, 6], [0.5, 0.9, -2],
];

/**
 * A pile of stickers you can throw around (pointer drag with inertia and wall bounces).
 * A click without a drag jumps to the section the sticker names.
 */
@Component({
  selector: 'app-stickers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pile" #pile>
      <p class="hint" aria-hidden="true">✦ {{ i18n.ui().dragHint }}</p>
      @for (s of stickers; track $index; let i = $index) {
        <button
          #stk
          class="stk"
          [class.y]="s.tone === 'y'"
          type="button"
          [attr.data-i]="i"
          (pointerdown)="down($event, i)"
          (pointermove)="move($event, i)"
          (pointerup)="up($event, i)"
          (pointercancel)="up($event, i)"
          (click)="click($event, i)"
          (keydown.enter)="go(i)"
        >
          <span>{{ i18n.t(s.label) }}</span>
        </button>
      }
    </div>
  `,
})
export class StickersComponent {
  protected readonly i18n = inject(I18n);
  protected readonly stickers = SITE.stickers;
  private readonly router = inject(Router);
  private readonly pile = viewChild.required<ElementRef<HTMLElement>>('pile');
  private readonly els = viewChildren<ElementRef<HTMLButtonElement>>('stk');

  private bodies: Body[] = [];
  private drag: { i: number; ox: number; oy: number; lx: number; ly: number; moved: number } | null = null;
  private raf = 0;
  private W = 0;
  private H = 0;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      this.layout();
      const ro = new ResizeObserver(() => this.layout());
      ro.observe(this.pile().nativeElement);
      destroy.onDestroy(() => { ro.disconnect(); cancelAnimationFrame(this.raf); });
    });
  }

  /** The first layout with a real box scatters the stickers; later ones only keep them inside it. */
  private layout(): void {
    const box = this.pile().nativeElement.getBoundingClientRect();
    this.W = box.width;
    this.H = box.height;
    const els = this.els();
    if (!this.W || !this.H) return;
    if (this.bodies.length !== els.length) {
      const narrow = this.W < 640;
      const rows = Math.ceil(els.length / 2);
      this.bodies = els.map((el, i) => {
        const w = el.nativeElement.offsetWidth;
        const h = el.nativeElement.offsetHeight;
        const [fx, fy, r] = SPOTS[i % SPOTS.length];
        if (narrow) {
          // Phones: two staggered columns so every label stays readable until you start throwing them.
          const right = i % 2 === 1;
          const jitter = (i * 7) % 20;
          return {
            x: right ? this.W - w - jitter : jitter,
            y: (Math.floor(i / 2) * (this.H - h)) / Math.max(1, rows - 1),
            vx: 0, vy: 0, r: r / 2, w, h,
          };
        }
        return { x: fx * (this.W - w), y: fy * (this.H - h), vx: 0, vy: 0, r, w, h };
      });
    }
    this.bodies.forEach((b, i) => {
      b.w = els[i].nativeElement.offsetWidth;
      b.h = els[i].nativeElement.offsetHeight;
      b.x = Math.min(Math.max(0, b.x), this.W - b.w);
      b.y = Math.min(Math.max(0, b.y), this.H - b.h);
    });
    this.paint();
  }

  private paint(): void {
    const els = this.els();
    this.bodies.forEach((b, i) => {
      els[i].nativeElement.style.transform = `translate(${b.x}px,${b.y}px) rotate(${b.r}deg)`;
    });
  }

  protected down(e: PointerEvent, i: number): void {
    const b = this.bodies[i];
    if (!b) return;
    (e.target as HTMLElement).closest('button')!.setPointerCapture(e.pointerId);
    this.drag = { i, ox: e.clientX - b.x, oy: e.clientY - b.y, lx: e.clientX, ly: e.clientY, moved: 0 };
    b.vx = b.vy = 0;
    this.els()[i].nativeElement.classList.add('held');
  }

  protected move(e: PointerEvent, i: number): void {
    const d = this.drag;
    if (!d || d.i !== i) return;
    const b = this.bodies[i];
    const nx = e.clientX - d.ox;
    const ny = e.clientY - d.oy;
    b.vx = e.clientX - d.lx;
    b.vy = e.clientY - d.ly;
    d.moved += Math.abs(b.vx) + Math.abs(b.vy);
    d.lx = e.clientX;
    d.ly = e.clientY;
    b.x = nx;
    b.y = ny;
    // Tilt a little in the direction of travel, like a card being pushed.
    b.r = Math.max(-14, Math.min(14, b.vx * 0.6));
    this.paint();
  }

  protected up(e: PointerEvent, i: number): void {
    const d = this.drag;
    if (!d || d.i !== i) return;
    this.els()[i].nativeElement.classList.remove('held');
    // Keep the drag record for the click handler that fires right after pointerup.
    setTimeout(() => { if (this.drag === d) this.drag = null; });
    if (!this.raf) this.raf = requestAnimationFrame(() => this.step());
  }

  protected click(e: MouseEvent, i: number): void {
    if (this.drag && this.drag.moved > 8) { e.preventDefault(); return; }
    this.go(i);
  }

  protected go(i: number): void {
    const to = this.stickers[i].to;
    if (to) void this.router.navigate([], { fragment: to });
  }

  /** Inertia + friction + bounces until everything settles. */
  private step(): void {
    let live = false;
    const held = this.drag?.i;
    this.bodies.forEach((b, i) => {
      if (i === held) return;
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.93;
      b.vy *= 0.93;
      if (b.x < 0) { b.x = 0; b.vx = -b.vx * 0.55; }
      if (b.y < 0) { b.y = 0; b.vy = -b.vy * 0.55; }
      if (b.x > this.W - b.w) { b.x = this.W - b.w; b.vx = -b.vx * 0.55; }
      if (b.y > this.H - b.h) { b.y = this.H - b.h; b.vy = -b.vy * 0.55; }
      b.r *= 0.9;
      if (Math.abs(b.vx) + Math.abs(b.vy) > 0.08 || Math.abs(b.r) > 0.3) live = true; else { b.vx = b.vy = 0; }
    });
    this.paint();
    this.raf = live ? requestAnimationFrame(() => this.step()) : 0;
  }
}
