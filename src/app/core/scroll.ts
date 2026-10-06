import { Injectable } from '@angular/core';
import type Lenis from 'lenis';

/**
 * How an element's scroll progress (0 → 1) is measured:
 * - `view`  from the moment its top enters the bottom of the screen until its bottom leaves the top;
 * - `enter` from entering at the bottom until its top reaches 25% of the screen (one-shot reveals);
 * - `pin`   across a tall wrapper whose sticky child stays on screen (0 = pinned, 1 = released);
 * - `leave` from its top at the top of the screen until it has scrolled out (hero exit);
 * - `cover` from entering at the bottom until its top reaches the sticky line under the header
 *   (used to know how far a stacked card has slid over the one before it).
 */
export type FxMode = 'view' | 'enter' | 'pin' | 'leave' | 'cover';

interface Item {
  el: HTMLElement;
  mode: FxMode;
  last: number;
  cb?: (p: number) => void;
  write: boolean;
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * One scroll loop for the whole page. Lenis smooths wheel scrolling (touch stays native),
 * and every registered element gets its progress written to a `--p` CSS variable, so the
 * choreography itself lives in CSS. Nothing runs during prerender; with reduced motion
 * Lenis is skipped and every element is parked at its finished state.
 */
@Injectable({ providedIn: 'root' })
export class Scroll {
  private readonly items = new Set<Item>();
  private lenis?: Lenis;
  private started = false;
  private dirty = true;
  /** Height of the sticky header; anchors land just below it. */
  readonly offset = 72;
  still = false;

  async start(): Promise<void> {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;
    this.still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add(this.still ? 'still' : 'moving');
    const mark = () => (this.dirty = true);
    addEventListener('scroll', mark, { passive: true });
    addEventListener('resize', mark);
    if (!this.still) {
      const { default: L } = await import('lenis');
      this.lenis = new L({ lerp: 0.12, wheelMultiplier: 0.9 });
      this.lenis.on('scroll', mark);
    }
    const loop = (t: number) => {
      this.lenis?.raf(t);
      if (this.dirty) {
        this.dirty = false;
        this.update();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /** `write: false` only calls `cb` and leaves the element's `--p` alone. */
  register(el: HTMLElement, mode: FxMode, cb?: (p: number) => void, write = true): () => void {
    const item: Item = { el, mode, last: -1, cb, write };
    this.items.add(item);
    this.dirty = true;
    return () => this.items.delete(item);
  }

  /** Smooth jump to an element id (nav, case-study links). Lenis applies the page's scroll-padding, which keeps it clear of the sticky header. */
  to(id: string): boolean {
    const el = document.getElementById(id);
    if (!el) return false;
    if (this.lenis) this.lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ block: 'start' });
    return true;
  }

  /** Smooth jump to an absolute page position (used by the pinned timeline). */
  toY(y: number): void {
    if (this.lenis) this.lenis.scrollTo(y, { duration: 1 });
    else scrollTo({ top: y });
  }

  private update(): void {
    const vh = innerHeight;
    for (const it of this.items) {
      let p = 1;
      if (!this.still || it.mode === 'pin') {
        const r = it.el.getBoundingClientRect();
        switch (it.mode) {
          case 'view': p = clamp((vh - r.top) / (vh + r.height)); break;
          case 'enter': p = clamp((vh - r.top) / (vh * 0.75)); break;
          case 'pin': p = clamp(-r.top / Math.max(1, r.height - vh)); break;
          case 'leave': p = clamp(-r.top / Math.max(1, r.height)); break;
          case 'cover': p = clamp((vh - r.top) / Math.max(1, vh - this.offset - 24)); break;
        }
      }
      if (Math.abs(p - it.last) < 0.0005) continue;
      it.last = p;
      if (it.write) it.el.style.setProperty('--p', p.toFixed(4));
      it.cb?.(p);
    }
  }
}
