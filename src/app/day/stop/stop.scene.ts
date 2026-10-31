/**
 * A plain stop (Niamey, Rabat, Strasbourg, after hours) or the real CoilCheck figure: the thread comes down to the
 * stop's knot beside its label, runs down the text, and leaves for the next stop. The CoilCheck figure also gets a
 * scan line that crosses it as it comes up the screen.
 */
import { $, O, T, clamp, f1, tr, vcurve } from '../engine/dom';
import { type Ctx, type Scene, blank, span } from '../engine/scene';
import { Thread } from '../engine/thread';

export function stopScene(sec: HTMLElement, ctx: Ctx): Scene | null {
  const svg = sec.querySelector<SVGSVGElement>(':scope > svg.thread');
  if (!svg) return null;
  const scan = sec.querySelector<HTMLElement>('.plate .scan'), plate = sec.querySelector<HTMLElement>('.plate');
  let th: Thread | null = null, plateW = 0, plateTop = 0;
  const m: Scene = {
    ...blank(sec.id),
    build() {
      span(ctx, m, sec);
      const r = sec.getBoundingClientRect(), W = r.width, H = r.height;
      svg.setAttribute('viewBox', `0 0 ${f1(W)} ${f1(H)}`);
      const lab = $('.label', sec) || $('.cc-real-cap', sec), lr = lab.getBoundingClientRect();
      const text = $('.stop-text', sec) || $('.project', sec), tr_ = text.getBoundingClientRect();
      const x0 = ctx.lane() ?? W / 2;
      const nx = ctx.lane() ?? lr.left - r.left - 20, ny = lr.top - r.top + lr.height / 2;
      const ty = Math.min(H - 60, tr_.bottom - r.top + 40);
      const d = `M${f1(x0)},0 ${vcurve(x0, 0, nx, ny, 0.55)} L${f1(nx)},${f1(ty)} ${vcurve(nx, ty, x0, H, 0.5)}`;
      th = th || Thread(svg, { clip: true });
      th.set([d], [{ x: nx, y: ny, r: 5 }]);
      if (plate) {
        const pr = plate.getBoundingClientRect();
        plateW = pr.width;
        plateTop = pr.top - r.top;
      }
    },
    update(y) {
      const rtop = m.top - y, yr = ctx.motion ? ctx.vh * 0.5 - rtop : 1e9;
      th!.revealY(yr);
      th!.headAtY(yr, ctx.motion);
      if (scan && ctx.motion) {
        // the scan line crosses the CoilCheck figure as it comes up the screen
        const k = clamp((ctx.vh * 0.82 - rtop - plateTop) / (ctx.vh * 0.62));
        T(scan, tr(4 + k * (plateW - 8), 0));
        O(scan, k > 0.01 && k < 0.99 ? 1 : 0);
      }
    },
  };
  return m;
}
