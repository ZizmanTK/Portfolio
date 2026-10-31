/**
 * The gold thread. A thread is a set of parts (SVG paths) drawn in order: a dashed track ahead, a gold line behind. Each
 * part is sampled once when it is built, so the frame loop never measures a path. A thread that runs down the page
 * ({ clip: true }) is drawn in full on its own layer and revealed by a clip moved with transforms (no repaint).
 */
import { C, D, NS, O, T, clamp, div, el, f1, lerp, reset } from './dom';

interface Part { tk: SVGPathElement; ln: SVGPathElement; L: number; start: number; n: number; pts: Float32Array }
interface Knot { at: number; y: number; c: SVGCircleElement }
export interface KnotSpec { x: number; y: number; at?: number; r?: number }

export interface Thread {
  parts: Part[];
  knots: Knot[];
  total: number;
  H: number;
  set(ds: string[], knots?: KnotSpec[]): void;
  revealY(yr: number): void;
  headAtY(yr: number, on?: boolean): void;
  lenAtY(y: number): number;
  pointAt(len: number): [number, number];
  drawPart(i: number, f: number): void;
  drawLen(len: number): void;
  knot(i: number, on: boolean): void;
  head(x: number, y: number, on: boolean): void;
  headAt(len: number, on?: boolean): void;
  partAt(i: number, f: number, on?: boolean): void;
  fade(i: number, o: number): void;
}

type Host = (SVGSVGElement | SVGGElement) & { __clip?: HTMLElement; __hd?: HTMLElement };

export function Thread(svg: SVGSVGElement | SVGGElement, opts: { clip?: boolean } = {}): Thread {
  const host = svg as Host;
  svg.textContent = '';
  const gT = el('g', {}, svg), gK = el('g', {}, svg);
  let clip: HTMLElement | null = null;
  let gL: SVGElement;
  if (opts.clip) {
    clip = host.__clip || (host.__clip = (() => {
      const w = div('thread th-clip');
      w.setAttribute('aria-hidden', 'true');
      const l = document.createElementNS(NS, 'svg');
      l.setAttribute('class', 'th-line');
      w.appendChild(l);
      svg.after(w);
      return w;
    })());
    gL = clip.firstChild as SVGSVGElement;
    gL.textContent = '';
  } else gL = el('g', {}, svg);
  if (clip) svg.insertBefore(gK, null);
  // the head is a small HTML layer over the SVG (same origin), so moving it is compositing only
  const owner = ((svg as SVGElement).ownerSVGElement || svg) as Host;
  const hd = owner.__hd || (owner.__hd = div('th-head', owner.parentNode, 'span'));
  hd.setAttribute('aria-hidden', 'true');
  hd.style.opacity = '0';
  (hd as unknown as { __o: number }).__o = 0;

  let ymax: number[] = [], lens: number[] = [], hdOn = false;
  const th: Thread = {
    parts: [], knots: [], total: 0, H: 0,
    set(ds, knotList = []) {
      gT.textContent = ''; gL.textContent = ''; gK.textContent = '';
      th.parts = []; th.total = 0;
      for (const d of ds) {
        const tk = el('path', { class: 'track', d }, gT), ln = el('path', { class: 'line', d }, gL);
        const L = Math.max(0.01, ln.getTotalLength());
        const n = Math.max(2, Math.ceil(L / 6));
        const pts = new Float32Array((n + 1) * 2);
        for (let i = 0; i <= n; i++) {
          const q = ln.getPointAtLength((L * i) / n);
          pts[2 * i] = q.x; pts[2 * i + 1] = q.y;
        }
        if (!clip) {
          ln.style.strokeDasharray = `${f1(L)} ${f1(L + 4)}`;
          ln.style.strokeDashoffset = String(f1(L));
          (ln as unknown as { __d: number }).__d = f1(L);
        }
        th.parts.push({ tk, ln, L, start: th.total, n, pts });
        th.total += L;
      }
      ymax = []; lens = [];
      let m = -1e9;
      for (const p of th.parts) for (let i = 0; i <= p.n; i++) {
        m = Math.max(m, p.pts[2 * i + 1]);
        ymax.push(m);
        lens.push(p.start + (p.L * i) / p.n);
      }
      th.knots = knotList.map((k) => ({ at: k.at ?? th.lenAtY(k.y), y: k.y, c: el('circle', { class: 'knot', r: k.r || 4.5, cx: f1(k.x), cy: f1(k.y) }, gK) }));
      if (clip) {
        const vb = svg.getAttribute('viewBox') || '0 0 0 0';
        gL.setAttribute('viewBox', vb);
        th.H = +vb.split(' ')[3];
        reset(clip, 't'); reset(gL, 't');
        th.revealY(0);
      }
    },
    // clip mode: everything above this height is drawn
    revealY(yr) {
      const H = th.H;
      yr = f1(clamp(yr, 0, H + 4));
      T(clip!, `translate3d(0,${f1(yr - H)}px,0)`);
      T(gL, `translate3d(0,${f1(H - yr)}px,0)`);
      for (const k of th.knots) C(k.c, 'on', yr >= k.y - 1);
    },
    // the head where the thread first comes down to a height
    headAtY(yr, on = true) {
      const len = th.lenAtY(yr);
      if (!on || len <= 0.5 || len >= th.total - 0.5) { th.head(0, 0, false); return; }
      const q = th.pointAt(len);
      th.head(q[0], q[1], true);
    },
    // the length at which the thread first comes down to a height
    lenAtY(y) {
      const Y = ymax;
      if (!Y.length || y <= Y[0]) return 0;
      if (y >= Y[Y.length - 1]) return th.total;
      let lo = 0, hi = Y.length - 1;
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (Y[m] < y) lo = m;
        else hi = m;
      }
      return lerp(lens[lo], lens[hi], (y - Y[lo]) / Math.max(1e-6, Y[hi] - Y[lo]));
    },
    pointAt(len) {
      let p = th.parts[0];
      for (const q of th.parts) if (len >= q.start) p = q;
      const f = clamp((len - p.start) / p.L) * p.n, i = Math.min(p.n - 1, Math.floor(f)), k = f - i;
      return [lerp(p.pts[2 * i], p.pts[2 * i + 2], k), lerp(p.pts[2 * i + 1], p.pts[2 * i + 3], k)];
    },
    drawPart(i, f) {
      const p = th.parts[i];
      if (p) D(p.ln, p.L * (1 - clamp(f)));
    },
    drawLen(len) {
      for (const p of th.parts) D(p.ln, p.L - clamp(len - p.start, 0, p.L));
      for (const k of th.knots) C(k.c, 'on', len >= k.at - 1);
    },
    knot(i, on) {
      if (th.knots[i]) C(th.knots[i].c, 'on', on);
    },
    head(x, y, on) {
      if (on !== hdOn) { hdOn = on; O(hd, on ? 1 : 0); }
      if (on) T(hd, `translate3d(${f1(x)}px,${f1(y)}px,0)`);
    },
    headAt(len, on = true) {
      if (!on || len <= 0.5 || len >= th.total - 0.5) { th.head(0, 0, false); return; }
      const q = th.pointAt(len);
      th.head(q[0], q[1], true);
    },
    // head at a fraction of one part
    partAt(i, f, on = true) {
      const p = th.parts[i];
      if (!p || !on || f <= 0.001 || f >= 0.999) { th.head(0, 0, false); return; }
      const q = th.pointAt(p.start + p.L * f);
      th.head(q[0], q[1], true);
    },
    fade(i, o) {
      const p = th.parts[i];
      if (p) { O(p.ln, o); O(p.tk, o); }
    },
  };
  return th;
}
