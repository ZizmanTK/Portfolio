import type Lenis from 'lenis';
import { clamp } from './dom';

/**
 * One set piece of the day. `build()` measures and lays out (on load and on resize, never inside a frame);
 * `update(y)` runs only while the scene is on screen (between y0 and y1) and only writes transforms, opacity and dash
 * offsets. `afterBuild()` runs once every scene is built and the page's colours are set.
 */
export interface Scene {
  name: string;
  /** The section the scene lives in; it gets `.gone` while the scene is out of range. */
  sec?: HTMLElement;
  top: number;
  h: number;
  y0: number;
  y1: number;
  live?: boolean;
  build(): void;
  update(y: number): void;
  afterBuild?(): void;
  /** Undo what the scene set up outside its own markup (listeners, timers). */
  destroy?(): void;
}

/** What every scene shares: the viewport, the scroll position at measuring time, and the time of day. */
export interface Ctx {
  readonly root: HTMLElement;
  readonly motion: boolean;
  readonly reduce: boolean;
  vw: number;
  vh: number;
  /** The scroll position when the page was last measured. */
  sy0: number;
  /** The time of day on screen (minutes since midnight). */
  curT: number;
  lenis: Lenis | null;
  phone(): boolean;
  /** On phones the thread runs down a lane at the left edge. */
  lane(): number | null;
  docTop(n: Element): number;
  /** Glide to an element (Lenis) or jump to it (reduced motion). */
  scrollToEl(el: Element, offset: number, duration: number): void;
}

/** A scene factory, registered by the component that renders the scene's markup. */
export type SceneFactory = (ctx: Ctx) => Scene | Scene[] | null;

export const blank = (name: string): Pick<Scene, 'name' | 'top' | 'h' | 'y0' | 'y1'> => ({ name, top: 0, h: 0, y0: 0, y1: 0 });

/** Measures the section a scene lives in, and the scroll range in which it is on screen (with a margin). */
export function span(ctx: Ctx, m: Scene, sec: HTMLElement): void {
  m.sec = sec;
  const r = sec.getBoundingClientRect();
  m.top = r.top + ctx.sy0;
  m.h = r.height;
  m.y0 = m.top - ctx.vh - 80;
  m.y1 = m.top + m.h + 80;
}

/** Progress through a pinned section: 0 when it pins, 1 when it lets go (always 1 without motion). */
export const progress = (ctx: Ctx, m: Scene, y: number): number => (ctx.motion ? clamp((y - m.top) / Math.max(1, m.h - ctx.vh)) : 1);
