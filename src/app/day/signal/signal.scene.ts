/** Rabat to Strasbourg: a wave, with harmonics, sampled, and played on piano keys while he walks across. */
import { $, D, O, T, clamp, easeIO, el, f1, lerp, smooth, tr, twin, vcurve } from '../engine/dom';
import { type Ctx, type Scene, blank, progress, span } from '../engine/scene';
import { Thread } from '../engine/thread';

/** The axis label and the four beats written over the wave. */
export interface SignalText { axis: string; beats: [string, string, string, string] }

const shape = (u: number, m: number) => {
  const t = u * Math.PI * 6;
  return lerp(Math.sin(t), (Math.sin(t) + 0.42 * Math.sin(2 * t + 0.6) + 0.24 * Math.sin(3 * t + 1.3)) / 1.25, m);
};

export function signalScene(sec: HTMLElement, ctx: Ctx, text: SignalText): Scene {
  const svg = $<SVGSVGElement>('#scope', sec), walker = $('#sigWalker', sec);
  let th: Thread | null = null, G = { yb: 0 }, walkW = 60;
  let pure: SVGPathElement & { __L?: number }, rich: SVGPathElement;
  let stems: { st: SVGLineElement; dot: SVGCircleElement; yw: number }[] = [];
  let drops: { c: SVGCircleElement; dy: number }[] = [];
  let keysOn: SVGRectElement[] = [], labels: SVGTextElement[] = [], wpts: [number, number][] = [];
  const m: Scene = {
    ...blank('signal'),
    build() {
      span(ctx, m, sec);
      const W = ctx.vw, H = ctx.vh, ph = ctx.phone();
      const xl = ph ? 18 : W * 0.12, xr = ph ? W - 18 : W * 0.88, yb = H * (ph ? 0.36 : 0.38), A = H * (ph ? 0.085 : 0.12);
      const K = W < 600 ? 8 : 15;
      const kw = (xr - xl) / K, ky = H * (ph ? 0.56 : 0.6), kh = H * (ph ? 0.15 : 0.17);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.textContent = '';
      const g = el('g', {}, svg);
      el('line', { class: 'axis', x1: xl, x2: xr, y1: yb, y2: yb }, g);
      for (let i = 0; i <= 12; i++) {
        const x = lerp(xl, xr, i / 12);
        el('line', { class: 'tick', x1: x, x2: x, y1: yb - 4, y2: yb + 4 }, g);
      }
      keysOn = [];
      for (let i = 0; i < K; i++) el('rect', { class: 'key-w', x: xl + i * kw, y: ky, width: kw, height: kh, rx: 1.5 }, g);
      el('text', { class: 'lbl', x: xl - (ph ? 0 : 34), y: yb + (ph ? 22 : 4) }, g).textContent = text.axis;
      const dyn = twin(svg, 'scope live');
      dyn.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const gd = el('g', {}, dyn);
      for (let i = 0; i < K; i++) {
        const k = el('rect', { class: 'key-on', x: xl + i * kw + 1, y: ky + 1, width: kw - 2, height: kh - 2, rx: 1 }, gd);
        k.style.opacity = '0';
        keysOn.push(k);
      }
      const blackAfter = [0, 1, 3, 4, 5];
      for (let i = 0; i < K - 1; i++) if (blackAfter.includes(i % 7)) el('rect', { class: 'key-b', x: xl + (i + 1) * kw - kw * 0.3, y: ky, width: kw * 0.6, height: kh * 0.6, rx: 1 }, gd);
      stems = []; drops = [];
      for (let i = 0; i < K; i++) {
        const x = xl + (i + 0.5) * kw, u = (x - xl) / (xr - xl), yw = yb - A * shape(u, 1);
        const st = el('line', { class: 'stem', x1: x, x2: x, y1: yb, y2: yw }, gd);
        st.style.transformOrigin = `${f1(x)}px ${f1(yb)}px`;
        st.style.opacity = '0';
        const dot = el('circle', { class: 'sample', cx: x, cy: yw, r: ph ? 3.4 : 4.2 }, gd);
        dot.style.opacity = '0';
        const drop = el('circle', { class: 'drop', cx: x, cy: yw, r: ph ? 3 : 3.6 }, gd);
        drop.style.opacity = '0';
        stems.push({ st, dot, yw });
        drops.push({ c: drop, dy: ky + kh * 0.78 - yw });
      }
      labels = text.beats.map((s) => {
        const t = el('text', { class: 'lbl big', x: xr, y: yb - A - (ph ? 26 : 34), 'text-anchor': 'end' }, gd);
        t.textContent = s;
        t.style.opacity = '0';
        return t;
      });
      const tg = el('g', { class: 'tg' }, dyn);
      th = Thread(tg);
      const ex = ph ? W - 10 : xr + 46;
      const exit = ph
        ? `M${xr},${yb} ${vcurve(xr, yb, W - 8, H * 0.5, 0.4)} L${W - 8},${H * 0.86} ${vcurve(W - 8, H * 0.86, 14, H, 0.5)}`
        : `M${xr},${yb} C${xr + 30},${yb} ${ex},${yb + 20} ${ex},${yb + 60} L${ex},${H * 0.82} ${vcurve(ex, H * 0.82, W / 2, H, 0.5)}`;
      const entry = ph
        ? `M14,0 L14,${yb - 40} C14,${yb - 10} 16,${yb} ${xl},${yb}`
        : `M${W / 2},0 ${vcurve(W / 2, 0, xl - 40, yb - 50, 0.5)} C${xl - 40},${yb - 20} ${xl - 20},${yb} ${xl},${yb}`;
      th.set([entry, exit], [{ x: xl, y: yb, at: 0, r: 4 }]);
      // the waves are drawn in full once: the pure one is revealed by its dash offset, the rich one fades in over it
      const wd = (mm: number) => {
        let d = '';
        for (let i = 0; i <= 220; i++) {
          const u = i / 220;
          d += (i ? 'L' : 'M') + f1(lerp(xl, xr, u)) + ',' + f1(yb - A * shape(u, mm));
        }
        return d;
      };
      const track = el('path', { class: 'track', d: wd(0) });
      tg.insertBefore(track, tg.firstChild);
      pure = el('path', { class: 'wave', d: wd(0) }, tg);
      const PL = pure.getTotalLength();
      pure.__L = PL;
      pure.style.strokeDasharray = `${f1(PL)} ${f1(PL + 4)}`;
      pure.style.strokeDashoffset = String(f1(PL));
      (pure as unknown as { __d: number }).__d = f1(PL);
      rich = el('path', { class: 'wave rich', d: wd(1) }, tg);
      wpts = [];
      for (let i = 0; i <= 200; i++) {
        const u = i / 200;
        wpts.push([lerp(xl, xr, u), yb - A * shape(u, 0)]);
      }
      walkW = walker.getBoundingClientRect().width || 60;
      G = { yb };
    },
    update(y) {
      const t = th!, motion = ctx.motion, vw = ctx.vw, phone = ctx.phone();
      const rtop = m.top - y, ps = progress(ctx, m, y);
      const entryF = !motion || ps > 0 ? 1 : clamp((ctx.vh * 0.5 - rtop) / G.yb);
      t.drawPart(0, entryF);
      t.knot(0, entryF >= 1);
      const fw = clamp(ps / 0.36), mm = smooth(0.4, 0.54, ps), dim = 1 - 0.55 * smooth(0.6, 0.7, ps);
      D(pure, pure.__L! * (1 - fw));
      O(pure, (1 - mm * 0.9) * dim);
      O(rich, mm * dim);
      const sp = clamp((ps - 0.55) / 0.12);
      stems.forEach((s, i) => {
        const vis = clamp(sp * stems.length - i);
        O(s.st, vis > 0 ? 1 : 0);
        T(s.st, `scale(1,${Math.round(vis * 1000) / 1000})`);
        O(s.dot, vis >= 1 ? 1 : 0);
      });
      const np = clamp((ps - 0.69) / 0.2);
      drops.forEach((d, i) => {
        const fall = clamp(np * (drops.length + 2) - i);
        T(d.c, `translate(0px,${f1(fall * fall * d.dy)}px)`);
        O(d.c, fall > 0 && fall < 1 ? 1 : 0);
        O(keysOn[i], fall >= 1 ? 1 : 0);
      });
      labels.forEach((l, i) => {
        const c = [0.16, 0.47, 0.61, 0.79][i];
        O(l, i === 3 ? smooth(c - 0.04, c, ps) : smooth(c - 0.04, c, ps) * (1 - smooth(c + 0.1, c + 0.14, ps)));
      });
      T(walker, tr(lerp(vw * (phone ? 0.1 : 0.3), vw * (phone ? 0.9 : 0.88) - walkW, motion ? easeIO(clamp((ps - 0.02) / 0.92)) : 1), 0));
      const xf = motion ? clamp((ps - 0.9) / 0.1) : 1;
      t.drawPart(1, xf);
      if (xf > 0 && xf < 1) t.partAt(1, xf);
      else if (fw > 0 && fw < 1) {
        const q = wpts[Math.round(fw * 200)];
        t.head(q[0], q[1], true);
      } else t.head(0, 0, false);
    },
  };
  return m;
}
