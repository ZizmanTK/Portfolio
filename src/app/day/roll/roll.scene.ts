/** After work, a roll of the die (Roll Power): the thread leaves his palm and bounces like a thrown die. */
import { $, O, T, clamp, el, f1, lerp, vcurve } from '../engine/dom';
import { type Ctx, type Scene, blank, span } from '../engine/scene';
import { Thread } from '../engine/thread';

function drawDie(die: SVGSVGElement) {
  die.textContent = '';
  const s = 34, h = s * 0.577;
  const faces = [
    { cls: 'f-top', c: [0, -h], e1: [s / 2, -h / 2], e2: [s / 2, h / 2], pips: [[-0.55, -0.55], [0, 0], [0.55, 0.55]] },
    { cls: 'f-left', c: [-s / 2, h / 2], e1: [s / 2, h / 2], e2: [0, -h], pips: [[-0.5, 0.5], [0.5, -0.5]] },
    { cls: 'f-right', c: [s / 2, h / 2], e1: [-s / 2, h / 2], e2: [0, -h], pips: [[-0.55, -0.55], [0.55, -0.55], [0, 0], [-0.55, 0.55], [0.55, 0.55]] },
  ];
  for (const f of faces) {
    const P = (a: number, b: number) => [f.c[0] + a * f.e1[0] + b * f.e2[0], f.c[1] + a * f.e1[1] + b * f.e2[1]];
    el('polygon', { class: `face ${f.cls}`, points: [P(-1, -1), P(1, -1), P(1, 1), P(-1, 1)].map((q) => q.map(f1).join(',')).join(' ') }, die);
    for (const [a, b] of f.pips) {
      const [x, y] = P(a, b), mm = [f.e1[0] * 0.17, f.e1[1] * 0.17, f.e2[0] * 0.17, f.e2[1] * 0.17];
      el('circle', { class: 'pip', r: 1, transform: `matrix(${mm.map(f1).join(' ')} ${f1(x)} ${f1(y)})` }, die);
    }
  }
}

export function rollScene(sec: HTMLElement, ctx: Ctx): Scene {
  const svg = sec.querySelector<SVGSVGElement>(':scope > svg.thread')!, die = $<SVGSVGElement>('#die', sec), dicer = $('.dicer', sec);
  let th: Thread | null = null, handAt = 0, dpx = 76;
  const m: Scene = {
    ...blank('roll'),
    build() {
      span(ctx, m, sec);
      drawDie(die);
      const r = sec.getBoundingClientRect(), W = r.width, H = r.height;
      svg.setAttribute('viewBox', `0 0 ${f1(W)} ${f1(H)}`);
      const dr = dicer.getBoundingClientRect();
      const hx = dr.left - r.left + dr.width * 0.86, hy = dr.top - r.top + dr.height * 0.17; // just above his open palm (dice.webp)
      const x0 = ctx.lane() ?? W / 2, ph = ctx.phone();
      const b1 = ph ? [W * 0.3, H * 0.55] : [W * 0.47, H * 0.6], b2 = ph ? [W * 0.62, H * 0.66] : [W * 0.66, H * 0.66], b3 = ph ? [W * 0.84, H * 0.7] : [W * 0.79, H * 0.69];
      const d = `M${f1(x0)},0 ${vcurve(x0, 0, hx, hy, 0.4)}` +
        ` Q${f1(lerp(hx, b1[0], 0.5))},${f1(hy - H * 0.16)} ${f1(b1[0])},${f1(b1[1])}` +
        ` Q${f1(lerp(b1[0], b2[0], 0.5))},${f1(b1[1] - H * 0.2)} ${f1(b2[0])},${f1(b2[1])}` +
        ` Q${f1(lerp(b2[0], b3[0], 0.5))},${f1(b2[1] - H * 0.1)} ${f1(b3[0])},${f1(b3[1])}` +
        ` ${vcurve(b3[0], b3[1], x0, H, 0.5)}`;
      th = th || Thread(svg);
      th.set([d], []);
      svg.querySelectorAll('.ground').forEach((n) => n.remove());
      for (const [gx, gy] of [b1, b2, b3]) el('path', { class: 'ground', d: `M${f1(gx - 34)},${f1(gy + 2)} H${f1(gx + 34)}` }, svg);
      let best = 0, bd = 1e9;
      for (let s = 0; s <= 300; s++) {
        const L = (th.total * s) / 300, q = th.pointAt(L), dd = (q[0] - hx) ** 2 + (q[1] - hy) ** 2;
        if (dd < bd) { bd = dd; best = L; }
      }
      handAt = best;
      th.set([d], [{ x: hx, y: hy, at: handAt, r: 4 }]);
      dpx = Math.max(40, (dr.height * 0.095) / 0.57);
      die.style.width = die.style.height = f1(dpx) + 'px';
    },
    update(y) {
      const t = th!, motion = ctx.motion;
      const rtop = m.top - y;
      const p = motion ? clamp((ctx.vh * 0.5 - rtop) / m.h) : 0.82;
      const L = p * t.total;
      t.drawLen(L);
      if (L >= handAt) {
        const q = t.pointAt(L);
        O(die, 1);
        T(die, `translate3d(${f1(q[0] - dpx / 2)}px,${f1(q[1] - dpx / 2)}px,0) rotate(${f1((L - handAt) * 0.75)}deg)`);
        t.head(q[0], q[1], motion && L < t.total - 1);
      } else {
        O(die, 0);
        t.headAt(L, motion);
      }
    },
  };
  return m;
}
