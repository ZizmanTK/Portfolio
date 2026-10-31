/** Niamey to Rabat: six knight's moves across an isometric board, the thread following the piece. */
import { $, T, clamp, easeIO, el, lerp, tr, twin } from '../engine/dom';
import { type Ctx, type Scene, blank, progress, span } from '../engine/scene';
import { Thread } from '../engine/thread';

export interface KnightText { from: string; to: string }

const MOVES: [number, number][] = [[0, 0], [2, 1], [4, 0], [5, 2], [4, 4], [6, 5], [7, 7]];

export function knightScene(sec: HTMLElement, ctx: Ctx, text: KnightText): Scene {
  const svg = $<SVGSVGElement>('#board', sec), piece = $('#knightPiece', sec);
  let th: Thread | null = null;
  let G: { b: number; Cc: (c: number, r: number) => [number, number]; pw: number; ph: number } | null = null;
  const m: Scene = {
    ...blank('knight'),
    build() {
      span(ctx, m, sec);
      const W = ctx.vw, H = ctx.vh, ph = ctx.phone();
      const a = ph ? Math.min(40, (W - 28) / 16) : Math.min(58, W * 0.04), b = a * 0.5714;
      const cx = ph ? W / 2 + 6 : W / 2, y0 = H * 0.5 - 8 * b - (ph ? 10 : 6);
      const P = (c: number, r: number): [number, number] => [cx + (c - r) * a, y0 + (c + r) * b];
      const Cc = (c: number, r: number): [number, number] => [cx + (c - r) * a, y0 + (c + r + 1) * b];
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.textContent = '';
      const defs = el('defs', {}, svg);
      const pat = el('pattern', { id: 'hatch', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
      el('line', { x1: 0, y1: 0, x2: 0, y2: 5, stroke: 'currentColor', 'stroke-width': 1.1, 'stroke-opacity': 0.5 }, pat);
      svg.style.color = 'var(--ink)';
      const g = el('g', {}, svg);
      const thk = ph ? 7 : 13;
      const [lx, ly] = P(0, 8), [bx, by] = P(8, 8), [rx, ry] = P(8, 0);
      el('path', { class: 'slab', d: `M${lx},${ly} L${bx},${by} L${bx},${by + thk} L${lx},${ly + thk}Z` }, g);
      el('path', { class: 'slab', d: `M${bx},${by} L${rx},${ry} L${rx},${ry + thk} L${bx},${by + thk}Z`, style: 'fill: color-mix(in srgb, var(--ink) 16%, var(--bg))' }, g);
      for (let c = 0; c < 8; c++) for (let r = 0; r < 8; r++) {
        const pts = [P(c, r), P(c + 1, r), P(c + 1, r + 1), P(c, r + 1)].map((q) => q.join(',')).join(' ');
        el('polygon', { points: pts, class: (c + r) % 2 ? 'sq-d' : 'sq-l' }, g);
      }
      const [tx, ty] = P(0, 0);
      el('path', { class: 'grid', d: `M${tx},${ty} L${rx},${ry} L${bx},${by} L${lx},${ly}Z` }, g);
      if (!ph) {
        'abcdefgh'.split('').forEach((ch, c) => {
          const [x, y] = P(c + 0.5, 0);
          el('text', { class: 'coord', x: x + 10, y: y - 6 }, g).textContent = ch;
        });
        for (let r = 0; r < 8; r++) {
          const [x, y] = P(0, r + 0.5);
          el('text', { class: 'coord', x: x - 18, y: y - 6 }, g).textContent = String(r + 1);
        }
      }
      const [sx, sy] = Cc(0, 0), [ex, ey] = Cc(7, 7);
      const tagL = ph ? 70 : 150;
      el('path', { class: 'tag-line', d: `M${sx - 6},${sy} L${sx - tagL},${sy}` }, g);
      el('text', { class: 'tag', x: sx - tagL, y: sy - 8 }, g).textContent = text.from;
      el('path', { class: 'tag-line', d: `M${ex + 6},${ey} L${ex + tagL},${ey}` }, g);
      el('text', { class: 'tag', x: ex + tagL, y: ey - 8, 'text-anchor': 'end' }, g).textContent = text.to;
      const dyn = twin(svg, 'board live');
      dyn.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const tg = el('g', { class: 'tg' }, dyn);
      const ds = [`M${cx},0 L${sx},${sy}`];
      for (let i = 1; i < MOVES.length; i++) {
        const [c0, r0] = MOVES[i - 1], [c1, r1] = MOVES[i];
        const mid = Math.abs(c1 - c0) === 2 ? Cc(c1, r0) : Cc(c0, r1);
        const [x0, y0_] = Cc(c0, r0), [x1, y1] = Cc(c1, r1);
        ds.push(`M${x0},${y0_} L${mid[0]},${mid[1]} L${x1},${y1}`);
      }
      ds.push(`M${ex},${ey} L${cx},${H}`);
      th = Thread(tg);
      th.set(ds, MOVES.map(([c, r]) => {
        const [x, y] = Cc(c, r);
        return { x, y, at: 0, r: 3.8 };
      }));
      const pw = ph ? 46 : 92;
      piece.style.width = pw + 'px';
      G = { b, Cc, pw, ph: (pw * 400) / 209 };
    },
    update(y) {
      const t = th!, g = G!;
      const rtop = m.top - y, ps = progress(ctx, m, y);
      const entryF = !ctx.motion || ps > 0 ? 1 : clamp((ctx.vh * 0.5 - rtop) / Math.max(1, g.Cc(0, 0)[1]));
      t.drawPart(0, entryF);
      t.knot(0, entryF >= 1);
      const n = MOVES.length - 1, t0 = 0.04, t1 = 0.9, slot = (t1 - t0) / n;
      let px: number | undefined, py = 0, lift = 0, k = 0, hx: number | null = null, hy = 0;
      for (let i = 1; i <= n; i++) {
        const s = clamp((ps - t0 - (i - 1) * slot) / (slot * 0.78));
        t.drawPart(i, easeIO(s));
        t.knot(i, s >= 1);
        if (s > 0) k = i;
        if (s > 0 && s < 1) {
          const [x0, y0] = g.Cc(...MOVES[i - 1]), [x1, y1] = g.Cc(...MOVES[i]);
          const e = easeIO(s);
          px = lerp(x0, x1, e); py = lerp(y0, y1, e); lift = Math.sin(Math.PI * e) * (ctx.phone() ? 34 : 70);
          const p = t.parts[i], q = t.pointAt(p.start + p.L * e);
          hx = q[0]; hy = q[1];
        }
      }
      if (px === undefined) [px, py] = g.Cc(...MOVES[k]);
      const xf = ctx.motion ? clamp((ps - 0.92) / 0.08) : 1;
      t.drawPart(n + 1, xf);
      T(piece, tr(px - g.pw / 2, py - g.ph + g.b * 0.45 - lift));
      if (xf > 0 && xf < 1) t.partAt(n + 1, xf);
      else if (hx !== null) t.head(hx, hy, true);
      else t.head(0, 0, false);
    },
  };
  return m;
}
