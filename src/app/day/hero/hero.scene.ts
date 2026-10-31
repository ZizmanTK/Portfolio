/** Stop 01, first light: the word swirl drains into the thread's first knot as the day begins. */
import { $, C, O, T, f1, reset, smooth, vcurve } from '../engine/dom';
import { BASE } from '../engine/sky';
import { type Ctx, type Scene, blank, progress, span } from '../engine/scene';
import { Thread } from '../engine/thread';
import { type Swirl, initSwirl } from './swirl';

export function heroScene(sec: HTMLElement, ctx: Ctx, swirlWords: { words: string[]; links: Record<string, string> }): Scene {
  const scene = $('.scene', sec), inner = $('.hero-in', sec), day = $('.hero-day', sec), start = $('.start', sec);
  const svg = $<SVGSVGElement>('#heroThread', sec);
  let th: Thread | null = null, origin = { x: 0, y: 0 };
  let focus: { x: number; y: number; rx: number; ry: number } | null = null;

  const m: Scene = {
    ...blank('hero'),
    build() {
      span(ctx, m, sec);
      m.y0 = -1e9;
      inner.style.transform = '';
      reset(inner, 't');
      const s = scene.getBoundingClientRect(), W = s.width, H = s.height;
      const st = start.getBoundingClientRect();
      origin = ctx.phone() ? { x: 14, y: st.top - s.top + 8 } : { x: st.left - s.left - 14, y: st.top - s.top + 8 };
      const b = Array.from(inner.children).reduce(
        (acc, c) => {
          const q = c.getBoundingClientRect();
          return { t: Math.min(acc.t, q.top), b: Math.max(acc.b, q.bottom), l: Math.min(acc.l, q.left), r: Math.max(acc.r, q.right) };
        },
        { t: 1e9, b: -1e9, l: 1e9, r: -1e9 },
      );
      focus = { x: (b.l + b.r) / 2 - s.left, y: (b.t + b.b) / 2 - s.top, rx: (b.r - b.l) / 2 + 90, ry: (b.b - b.t) / 2 + 70 };
      svg.setAttribute('viewBox', `0 0 ${f1(W)} ${f1(H)}`);
      const x1 = ctx.lane() ?? W / 2;
      th = th || Thread(svg, { clip: true });
      th.set([`M${f1(origin.x)},${f1(origin.y)} ${vcurve(origin.x, origin.y, x1, H, 0.55)}`], [{ x: origin.x, y: origin.y, at: 0, r: 5 }]);
    },
    update(y) {
      const p = progress(ctx, m, y);
      swirl.setProgress(ctx.motion ? smooth(0.04, 0.7, p) : 0);
      const t = th!;
      if (!ctx.motion) { t.revealY(1e9); return; }
      const fade = smooth(0.06, 0.5, p);
      O(inner, 1 - fade);
      T(inner, `translate3d(0,${f1(-50 * fade)}px,0)`);
      C(inner, 'gone', fade > 0.99);
      O(start, 1 - smooth(0.02, 0.25, p));
      C(day, 'in', p > 0.44);
      const len = t.total * smooth(0.45, 1, p), yr = len > 0.5 ? t.pointAt(len)[1] : origin.y;
      t.revealY(yr);
      t.knot(0, true);
      t.headAt(len, p > 0.45 && p < 0.999);
    },
    afterBuild() {
      swirl.refresh();
    },
    destroy() {
      swirl.destroy();
    },
  };

  const swirl: Swirl = initSwirl($<HTMLCanvasElement>('#swirl', sec), {
    ...swirlWords,
    reduce: ctx.reduce,
    host: sec,
    ink: BASE.day.ink,
    accent: '#845a0b',
    focus: () => focus,
    drain: () => origin,
    go: (id) => {
      const t = document.querySelector(id);
      if (t) ctx.scrollToEl(t, -80, 2.6);
    },
  });
  // a recorder drives the swirl's clock frame by frame (work/tools/record.mjs)
  (window as unknown as { __swirl: Swirl }).__swirl = swirl;
  return m;
}
