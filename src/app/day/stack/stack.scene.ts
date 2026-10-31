/**
 * Stops 06-08, Grenoble, BASSETTI France: the three contracts fall like ZKTris blocks onto a 2015-23 foundation, the
 * third one while the sun goes down behind the mountains (the dusk interlude, a second scene in the same section).
 */
import { $, $$, C, O, T, clamp, div, easeIO, el, f1, lerp, smooth, tr, twin, vcurve } from '../engine/dom';
import { type Ctx, type Scene, blank, span } from '../engine/scene';
import { Thread } from '../engine/thread';

export interface StackText {
  /** One tag per contract, oldest first ("2024 · internship"); on phones only the part before " · " shows. */
  tags: [string, string, string];
  /** The foundation's tag: its years and what it is. */
  foundation: [string, string];
}

const FOUND = ['0111101111', '1111111011', '1101111110', '1111011111'];
const PIECES = [
  { cells: [[0, 4], [1, 4], [2, 4], [0, 5]], cls: 'p1' },
  { cells: [[3, 4], [4, 4], [5, 4], [4, 5]], cls: 'p2' },
  { cells: [[6, 4], [7, 4], [8, 4], [9, 4]], cls: 'p3' },
];

export function stackScene(sec: HTMLElement, ctx: Ctx, text: StackText): Scene {
  const wrap = $('.well-wrap', sec), svg = $<SVGSVGElement>('#well', sec), roles = $$('.role', sec), tsvg = $<SVGSVGElement>('#stackThread', sec);
  const dusk = sec.querySelector<HTMLElement>('#dusk');
  let G = { c: 0, rows: 16 }, groups: SVGGElement[] = [], ghosts: SVGGElement[] = [], tags: SVGGElement[] = [];
  let glow: SVGRectElement, th: Thread | null = null, roleTops: number[] = [], wrapTop = 0, duskTop = 0, duskH = 0, lastPh = '';
  const m: Scene = {
    ...blank('stack'),
    build() {
      span(ctx, m, sec);
      const ph = ctx.phone(), motion = ctx.motion, vh = ctx.vh;
      const wr = wrap.getBoundingClientRect();
      const Wd = wr.width, Hd = motion ? (ph ? wr.height : vh) : Math.min(vh, 720);
      if (!motion) wrap.style.height = Hd + 'px';
      const cols = 10, rows = 16;
      const c = Math.floor(Math.min(ph ? (ctx.vw < 600 ? 22 : 30) : 34, (Hd * (ph ? 0.9 : 0.7)) / rows, (Wd * (ph ? 0.62 : 0.6)) / cols));
      const x0 = ph ? 2 : (Wd - cols * c) / 2 + 30, y0 = ph ? (Hd - rows * c) / 2 : (Hd - rows * c) / 2 + 26;
      svg.setAttribute('viewBox', `0 0 ${f1(Wd)} ${f1(Hd)}`);
      svg.textContent = '';
      const g = el('g', {}, svg);
      const cellXY = (cx: number, cy: number) => [x0 + cx * c, y0 + (rows - 1 - cy) * c];
      let gd = '';
      for (let i = 1; i < cols; i++) gd += `M${x0 + i * c},${y0} V${y0 + rows * c}`;
      for (let j = 1; j < rows; j++) gd += `M${x0},${y0 + j * c} H${x0 + cols * c}`;
      el('path', { class: 'cellgrid', d: gd }, g);
      FOUND.forEach((row, k) => {
        const cy = 3 - k;
        row.split('').forEach((v, cx) => {
          const [x, y] = cellXY(cx, cy);
          if (v === '1') el('rect', { class: 'cell found', x: x + 0.5, y: y + 0.5, width: c - 1, height: c - 1 }, g);
          else el('path', { class: 'hole', d: `M${x + c * 0.3},${y + c * 0.3} L${x + c * 0.7},${y + c * 0.7} M${x + c * 0.7},${y + c * 0.3} L${x + c * 0.3},${y + c * 0.7}` }, g);
        });
      });
      el('path', { class: 'wall-l', d: `M${x0},${y0 - c * 0.4} V${y0 + rows * c} H${x0 + cols * c} V${y0 - c * 0.4}` }, g);
      const dyn = twin(svg, 'well live');
      dyn.setAttribute('viewBox', `0 0 ${f1(Wd)} ${f1(Hd)}`);
      const gl = el('g', {}, dyn);
      const cp = el('clipPath', { id: 'wellclip' }, el('defs', {}, dyn));
      el('rect', { x: x0 - 2, y: y0 - c * 3, width: cols * c + 4, height: rows * c + c * 3 }, cp);
      if (!ph) {
        const [, fy] = cellXY(0, 3);
        el('path', { class: 'tagl', d: `M${x0 - 8},${fy + 0.5} H${x0 - 26} M${x0 - 8},${fy + 4 * c - 0.5} H${x0 - 26} M${x0 - 17},${fy + 0.5} V${fy + 4 * c - 0.5}` }, g);
        el('text', { class: 'tagt', x: x0 - 34, y: fy + 2 * c - 4, 'text-anchor': 'end' }, g).textContent = text.foundation[0];
        el('text', { class: 'tagt', x: x0 - 34, y: fy + 2 * c + 12, 'text-anchor': 'end' }, g).textContent = text.foundation[1];
      }
      const [gx, gy] = cellXY(0, 4);
      glow = el('rect', { x: gx - 3, y: gy - 3, width: cols * c + 6, height: c + 6, rx: 2, fill: 'none', stroke: 'var(--thread)', 'stroke-width': 2 }, gl);
      glow.style.opacity = '0';
      ghosts = []; groups = []; tags = [];
      PIECES.forEach((p, i) => {
        const gh = el('g', { class: 'ghost-g' }, gl);
        p.cells.forEach(([cx, cy]) => {
          const [x, y] = cellXY(cx, cy);
          el('rect', { class: 'ghost', x: x + 1.5, y: y + 1.5, width: c - 3, height: c - 3 }, gh);
        });
        gh.style.opacity = '0';
        ghosts.push(gh);
        const pg = el('g', {}, el('g', { 'clip-path': 'url(#wellclip)' }, gl));
        p.cells.forEach(([cx, cy]) => {
          const [x, y] = cellXY(cx, cy);
          el('rect', { class: `cell ${p.cls}`, x: x + 0.5, y: y + 0.5, width: c - 1, height: c - 1 }, pg);
        });
        groups.push(pg);
        const topc = Math.max(...p.cells.map((q) => q[1]));
        const right = Math.max(...p.cells.filter((q) => q[1] === topc).map((q) => q[0]));
        const [ax, ay] = cellXY(right, topc);
        const tyy = y0 + (rows - 1 - (7 - i)) * c + c / 2;
        const tg = el('g', {}, gl);
        tg.style.opacity = '0';
        el('path', { class: 'tagl', d: `M${ax + c * 0.5},${ay + c * 0.5} L${ax + c * 0.5},${tyy} L${x0 + cols * c + 18},${tyy}` }, tg);
        el('text', { class: 'tagt', x: x0 + cols * c + 24, y: tyy + 4 }, tg).textContent = ph ? text.tags[i].split(' · ')[0] : text.tags[i];
        tags.push(tg);
      });
      G = { c, rows };
      roleTops = roles.map((r) => ctx.docTop(r));
      wrapTop = ctx.docTop(wrap);
      if (dusk && dusk.offsetHeight) {
        const r = dusk.getBoundingClientRect();
        duskTop = r.top + ctx.sy0;
        duskH = r.height;
      } else duskH = 0;
      const sr = sec.getBoundingClientRect();
      tsvg.setAttribute('viewBox', `0 0 ${f1(sr.width)} ${f1(sr.height)}`);
      const x = ctx.lane() ?? roles[0].getBoundingClientRect().left - sr.left - 24;
      const xm = ctx.lane() ?? sr.width / 2;
      const knots = roles.map((ro) => {
        const lr = $('.label', ro).getBoundingClientRect();
        return { x, y: lr.top - sr.top + lr.height / 2, r: 5 };
      });
      const d = `M${f1(xm)},0 ${vcurve(xm, 0, x, knots[0].y, 0.6)} L${f1(x)},${f1(sr.height - vh * 0.3)} ${vcurve(x, sr.height - vh * 0.3, xm, sr.height, 0.5)}`;
      th = th || Thread(tsvg, { clip: true });
      th.set([d], knots);
    },
    update(y) {
      const motion = ctx.motion, vh = ctx.vh, phone = ctx.phone();
      const yr = motion ? vh * 0.5 - (m.top - y) : 1e9;
      th!.revealY(yr);
      th!.headAtY(yr, motion);
      let landed = 0;
      roles.forEach((ro, i) => {
        const rt = roleTops[i] - y;
        let pk = motion ? clamp((vh * 0.32 - rt) / (vh * 0.5)) : 1;
        if (motion && phone) pk = clamp(clamp((vh * 0.85 - (wrapTop - y)) / (vh * 0.75)) * 3.2 - i * 1.05);
        else if (motion && i === 2 && duskH) pk = clamp((-(duskTop - y) / Math.max(1, duskH - vh) - 0.12) / 0.8);
        const e = pk * pk;
        T(groups[i], `translate(0px,${f1(-(1 - e) * (G.rows + 4) * G.c)}px)`);
        O(groups[i], pk > 0 ? 1 : 0);
        O(ghosts[i], pk > 0 && pk < 1 ? 1 : 0);
        O(tags[i], smooth(0.98, 1, pk));
        if (pk >= 1) landed++;
        C(ro, 'in', !motion || rt < vh * 0.8);
      });
      O(glow, landed === 3 ? 0.9 : 0);
      const t = ctx.curT;
      const ph = t < 1075 ? 'day' : t < 1135 ? 'gold' : t < 1165 ? 'dusk' : 'night';
      if (ph !== lastPh) {
        lastPh = ph;
        wrap.dataset['phase'] = ph;
        tsvg.dataset['phase'] = ph === 'day' || ph === 'gold' ? 'day' : 'night';
        const clip = (tsvg as unknown as { __clip?: HTMLElement }).__clip;
        if (clip) clip.dataset['phase'] = tsvg.dataset['phase'];
      }
    },
  };
  return m;
}

const FAR = [[0, 0.6], [0.07, 0.575], [0.13, 0.58], [0.2, 0.53], [0.25, 0.515], [0.3, 0.52], [0.36, 0.49], [0.42, 0.48], [0.47, 0.495], [0.53, 0.455], [0.58, 0.45], [0.63, 0.47], [0.7, 0.52], [0.77, 0.54], [0.85, 0.57], [0.93, 0.59], [1, 0.6]];
const NEAR = [[0, 0.74], [0.06, 0.7], [0.12, 0.71], [0.19, 0.66], [0.24, 0.645], [0.28, 0.66], [0.33, 0.63], [0.37, 0.62], [0.41, 0.64], [0.48, 0.69], [0.56, 0.7], [0.63, 0.67], [0.69, 0.655], [0.74, 0.67], [0.8, 0.71], [0.88, 0.72], [0.95, 0.74], [1, 0.75]];

/** The dusk: the sun goes down behind the mountains, then the ridges melt into the night (motion only). */
export function duskScene(box: HTMLElement, ctx: Ctx): Scene {
  const scn = $('.dusk-scene', box), svg = $<SVGSVGElement>('#duskSvg', box);
  let G: { H: number } | null = null, sun: HTMLElement | null = null;
  const ridge = (P: number[][], W: number, H: number, cls: string) => {
    let d = `M-20,${f1(H + 20)} L-20,${f1(P[0][1] * H)}`;
    for (const [x, yv] of P) d += ` L${f1(x * W)},${f1(yv * H)}`;
    d += ` L${f1(W + 20)},${f1(P[P.length - 1][1] * H)} L${f1(W + 20)},${f1(H + 20)}Z`;
    return el('path', { class: cls, d }, svg);
  };
  const m: Scene = {
    ...blank('dusk'),
    build() {
      if (!box.offsetHeight) { G = null; m.y0 = m.y1 = -1; return; }
      span(ctx, m, box);
      const br = box.getBoundingClientRect();
      svg.style.left = f1(-br.left) + 'px';
      svg.style.width = ctx.vw + 'px';
      const W = ctx.vw, H = ctx.vh;
      svg.setAttribute('viewBox', `0 0 ${f1(W)} ${f1(H)}`);
      svg.textContent = '';
      ridge(FAR, W, H, 'dusk-far');
      for (let i = 0; i < 26; i++) {
        const x = ((i + 0.5) / 26) * W, len = H * (0.03 + (i % 3) * 0.012);
        el('path', { class: 'dusk-hatch', d: `M${f1(x)},${f1(H * 0.62)} l${f1(len * 0.5)},${f1(len)}` }, svg);
      }
      ridge(NEAR, W, H, 'dusk-near');
      el('path', { class: 'dusk-horizon', d: `M0,${f1(H * 0.86)} H${f1(W)}` }, svg);
      // the sun is its own layer behind the ridges, so it moves without repainting them
      sun = sun || div('dusk-sunl', null);
      if (sun.parentNode !== scn) scn.insertBefore(sun, svg);
      const R = Math.min(W * 0.2, H * 0.16);
      sun.style.width = sun.style.height = f1(2 * R) + 'px';
      sun.style.left = f1(-br.left + W * 0.56 - R) + 'px';
      sun.style.top = f1(-R) + 'px';
      G = { H };
    },
    update(y) {
      if (!G || !sun) return;
      const motion = ctx.motion;
      const p = motion ? clamp((y - m.top) / Math.max(1, m.h - ctx.vh)) : 0.4;
      T(sun, tr(0, lerp(G.H * 0.26, G.H * 0.82, easeIO(p))));
      C(sun, 'low', p >= 0.5);
      O(sun, motion ? 1 - smooth(0.74, 0.86, p) : 1);
      // the mountains melt into the night as it falls, so no band of them is left when the scene leaves
      O(svg, motion ? 1 - smooth(0.82, 1, p) : 1);
    },
  };
  return m;
}
