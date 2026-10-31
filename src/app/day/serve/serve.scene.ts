/**
 * Stop 10, the finale. Night court, seen from across the net: he sets the ball to himself with an overhead pass (two
 * hands above the forehead, ten fingers), it rises a little (he stays in frame: no camera ride), he takes a two-step
 * approach with his arms back, jumps, cocks the hitting arm and meets the ball at full stretch with an open hand; then
 * it flies straight at you, fills the screen, and the contact opens out of it. Poses and court move with transforms;
 * the ball and its effects are one canvas.
 */
import { $, C, O, T, clamp, ease, easeIn, easeIO, el, f1, lerp, reset, seg01, smooth, tr, vcurve } from '../engine/dom';
import { type Ctx, type Scene, blank, progress, span } from '../engine/scene';
import { Thread } from '../engine/thread';

const ORDER = ['ready', 'set', 'approach', 'takeoff', 'cocked', 'contact'] as const;
type PoseName = (typeof ORDER)[number];
// measured on the six drawings (fractions of each image): aspect, image height in body units (standing height = 100),
// soles, hip centre; the ball's centre and radius where the drawing holds it (ready, set, contact)
const VB: Record<PoseName, { ar: number; hu: number; feet: number; cx: number; ball?: [number, number]; r?: number }> = {
  ready: { ar: 0.257, hu: 127.8, feet: 0.987, cx: 0.49, ball: [0.49, 0.045], r: 0.045 },
  set: { ar: 0.196, hu: 132.9, feet: 0.987, cx: 0.498, ball: [0.507, -0.012], r: 0.038 },
  approach: { ar: 0.637, hu: 104.8, feet: 0.987, cx: 0.471 },
  takeoff: { ar: 0.277, hu: 105.7, feet: 0.988, cx: 0.518 },
  cocked: { ar: 0.441, hu: 108.9, feet: 0.987, cx: 0.629 },
  contact: { ar: 0.311, hu: 128.1, feet: 0.988, cx: 0.731, ball: [0.845, 0.04], r: 0.037 },
};
// the beats, as progress through the section
const K = { set: 0.06, out: 0.1, apex: 0.22, hitP: 0.4, app: [0.15, 0.3], take: [0.3, 0.33], rise: [0.33, 0.385] };
const F0 = K.hitP + 0.012; // the flight starts just after the contact

type XY = [number, number];

function drawBall(c: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  const TAU = Math.PI * 2;
  c.save(); c.translate(x, y);
  c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fillStyle = '#f6efe0'; c.fill();
  c.save(); c.clip(); c.rotate(rot);
  for (let k = 0; k < 3; k++) {
    c.rotate(TAU / 3);
    c.beginPath(); c.arc(r * 1.12, 0, r * 0.98, Math.PI * 0.6, Math.PI * 1.4); c.arc(r * 1.12, 0, r * 0.64, Math.PI * 1.4, Math.PI * 0.6, true); c.closePath();
    c.fillStyle = k === 0 ? '#1d1307' : '#fbb915'; c.fill();
    c.lineWidth = Math.max(0.8, r * 0.03); c.strokeStyle = '#1d1307'; c.stroke();
  }
  c.restore();
  c.beginPath(); c.arc(0, 0, r, 0, TAU); c.lineWidth = Math.max(1.2, r * 0.045); c.strokeStyle = '#1d1307'; c.stroke();
  c.restore();
}
function flash(c: CanvasRenderingContext2D, x: number, y: number, r0: number, k: number, alpha: number) {
  c.save(); c.globalAlpha = alpha; c.strokeStyle = '#fbb915'; c.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.2, r1 = r0 * (1.4 + k * 3), r2 = r1 + r0 * (1 + k * 4);
    c.beginPath(); c.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); c.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2); c.stroke();
  }
  c.restore();
}

export function serveScene(sec: HTMLElement, ctx: Ctx): Scene {
  const skyEl = $('#svSky', sec), world = $('#svWorld', sec), court = $<SVGSVGElement>('#svCourt', sec), net = $<SVGSVGElement>('#svNet', sec);
  const fx = $<HTMLCanvasElement>('#svFx', sec), contact = $('#svContact', sec), hc = $('.h-contact', contact), note = $('.sv-note', sec);
  const tsvg = $<SVGSVGElement>('#svThread', sec);
  const pose = Object.fromEntries(ORDER.map((k) => [k, $<HTMLImageElement>('#sv-' + k, sec)])) as Record<PoseName, HTMLImageElement>;
  let c2d: CanvasRenderingContext2D, th: Thread | null = null, dpr = 1, lastKey = '';
  let lines: { a: number; o: number; l: number; gold: boolean }[] = [];
  let G: {
    W: number; H: number; floorY: number; px: number; tx: number; jumpH: number; b0: XY; b1: XY; r0: number; cp: XY; apex: XY; Rb: number;
    at: (k: PoseName, x: number, y: number) => XY;
  };

  // where the ball is (up to the hit): out of his hands, a short rise, then down onto his hand at the top of the jump
  function ballAt(p: number): XY {
    const { b0, b1, cp, apex } = G;
    if (p < K.set) return b0;
    if (p < K.out) { const k = ease(seg01(p, K.set, K.out)); return [lerp(b0[0], b1[0], k), lerp(b0[1], b1[1], k)]; }
    if (p < K.apex) { const k = ease(seg01(p, K.out, K.apex)); return [lerp(b1[0], apex[0], k), lerp(b1[1], apex[1], k)]; }
    const k = easeIn(seg01(p, K.apex, K.hitP));
    return [lerp(apex[0], cp[0], k), lerp(apex[1], cp[1], k)];
  }
  function draw(p: number) {
    const { W, H, cp, r0, Rb } = G;
    const key = Math.round(p * 4000) + '|' + W;
    if (key === lastKey) return;
    lastKey = key;
    const c = c2d;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    if (p < F0) { // the set, the rise and the fall: the ball in the world
      const b = ballAt(p);
      drawBall(c, b[0], b[1], r0, p * 9);
      if (p > K.hitP - 0.004) flash(c, cp[0], cp[1], r0, seg01(p, K.hitP - 0.004, K.hitP + 0.06), 1);
      return;
    }
    // the flight: dim the court, then the ball grows toward you (exponential, slower in the middle)
    const dim = smooth(F0, F0 + 0.14, p);
    c.fillStyle = `rgba(13,11,8,${(0.84 * dim).toFixed(3)})`;
    c.fillRect(0, 0, W, H);
    const q = seg01(p, F0, 0.88);
    const qe = q < 0.35 ? lerp(0, 0.45, ease(q / 0.35) * 0.6 + (q / 0.35) * 0.4) : q < 0.72 ? lerp(0.45, 0.62, (q - 0.35) / 0.37) : lerp(0.62, 1, easeIn((q - 0.72) / 0.28) * 0.5 + ((q - 0.72) / 0.28) * 0.5);
    const r = r0 * Math.pow(Rb / r0, qe);
    const k = ease(clamp(qe * 1.25));
    const x = lerp(cp[0], W / 2, k), y = lerp(cp[1], H / 2, k);
    if (p < K.hitP + 0.06) flash(c, cp[0], cp[1], r0, seg01(p, K.hitP - 0.004, K.hitP + 0.06), 0.9);
    const speed = q < 0.35 ? 0.7 : q < 0.72 ? 0.35 : 1;
    if (r < Rb * 1.02) {
      c.save(); c.lineCap = 'round';
      for (const L of lines) {
        const r1 = r * (1.18 + L.o * 0.5), r2 = r1 + Math.max(10, r * (0.25 + speed * 0.9) * L.l + 30 * speed);
        c.strokeStyle = L.gold ? 'rgba(251,185,21,.75)' : 'rgba(246,239,224,.55)';
        c.lineWidth = L.gold ? 2.2 : 1.4;
        c.beginPath(); c.moveTo(x + Math.cos(L.a) * r1, y + Math.sin(L.a) * r1); c.lineTo(x + Math.cos(L.a) * r2, y + Math.sin(L.a) * r2); c.stroke();
      }
      c.restore();
    }
    drawBall(c, x, y, r, 1.2 + qe * 7.5 + p * 2);
    // the iris: the contact opens out of the ball
    const ki = seg01(p, 0.92, 1);
    if (ki > 0) {
      c.save(); c.globalCompositeOperation = 'destination-out'; c.fillStyle = '#000';
      c.beginPath(); c.arc(W / 2, H / 2, Math.hypot(W, H) * 0.56 * easeIO(ki) + 0.5, 0, Math.PI * 2); c.fill();
      c.restore();
      if (ki > 0.03) {
        c.save(); c.globalAlpha = 1 - ki; c.strokeStyle = '#fbb915'; c.lineWidth = 3;
        c.beginPath(); c.arc(W / 2, H / 2, Math.hypot(W, H) * 0.56 * easeIO(ki) + 2, 0, Math.PI * 2); c.stroke(); c.restore();
      }
    }
  }
  // which pose is on screen, and where (hip centre x, soles y), at progress p; the approach is two strides
  function figure(p: number): [PoseName, number, number] {
    const { px, tx, floorY, jumpH } = G;
    if (p < K.set) return ['ready', px, floorY];
    if (p < K.app[0]) return ['set', px, floorY];
    if (p < K.app[1]) {
      const u = seg01(p, K.app[0], K.app[1]), k = u < 0.5 ? 0.55 * easeIO(u * 2) : 0.55 + 0.45 * easeIO(u * 2 - 1);
      return ['approach', lerp(px, tx, k), floorY];
    }
    if (p < K.take[1]) return ['takeoff', tx, floorY];
    if (p < K.rise[1]) return ['cocked', tx, floorY - jumpH * ease(seg01(p, K.rise[0], K.rise[1]))];
    return ['contact', tx, floorY - jumpH];
  }

  const m: Scene = {
    ...blank('serve'),
    build() {
      span(ctx, m, sec);
      const W = ctx.vw, H = ctx.vh, ph = ctx.phone();
      dpr = Math.min(2, devicePixelRatio || 1);
      fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr);
      c2d = fx.getContext('2d')!;
      const floorY = H * (ph ? 0.66 : 0.74), body = H * (ph ? 0.27 : 0.34), unit = body / 100;
      const px = W * (ph ? 0.3 : 0.36), tx = px + W * (ph ? 0.14 : 0.08); // where he sets, where he takes off
      const jumpH = body * 0.32, grow = 1.07; // the jump; he is a little bigger after the approach (nearer the net)
      const size = {} as Record<PoseName, XY>;
      for (const k of ORDER) {
        const v = VB[k], h = v.hu * unit * (k === 'ready' || k === 'set' ? 1 : grow);
        size[k] = [h * v.ar, h];
        T(pose[k], 'none');
        reset(pose[k], 't');
        pose[k].style.width = f1(size[k][0]) + 'px';
        pose[k].style.height = f1(size[k][1]) + 'px';
      }
      // placement of a pose: hip centre at x, soles at y
      const at = (k: PoseName, x: number, y: number): XY => [x - VB[k].cx * size[k][0], y - VB[k].feet * size[k][1]];
      const ballOf = (k: PoseName, x: number, y: number): XY => {
        const [l, t] = at(k, x, y);
        return [l + VB[k].ball![0] * size[k][0], t + VB[k].ball![1] * size[k][1]];
      };
      const b0 = ballOf('ready', px, floorY), b1 = ballOf('set', px, floorY), r0 = VB.ready.r! * size.ready[1];
      const cp = ballOf('contact', tx, floorY - jumpH);
      const apex: XY = [lerp(b1[0], cp[0], 0.55), Math.max(H * 0.1, Math.min(b1[1], cp[1]) - H * (ph ? 0.12 : 0.14))]; // a short rise: it stays on screen
      // court: a dark floor, gold lines in perspective, a soft light on him; the net is a layer in front of him
      court.setAttribute('viewBox', `0 0 ${W} ${H}`);
      court.textContent = '';
      const defs = el('defs', {}, court);
      const rg = el('radialGradient', { id: 'svGlow', cx: '50%', cy: '50%', r: '50%' }, defs);
      el('stop', { offset: '0', 'stop-color': '#fbb915', 'stop-opacity': 0.22 }, rg);
      el('stop', { offset: '1', 'stop-color': '#fbb915', 'stop-opacity': 0 }, rg);
      el('rect', { class: 'ground', x: -W, y: f1(floorY - H * 0.04), width: 3 * W, height: H * 2 }, court);
      el('ellipse', { class: 'glow', cx: f1((px + tx) / 2), cy: f1(floorY), rx: f1(W * 0.24), ry: f1(H * 0.07) }, court);
      const bl = W * 0.16, br = W * 0.84;
      el('path', { class: 'floor', d: `M${f1(bl)},${f1(floorY + 4)} H${f1(br)}` }, court);
      el('path', { class: 'line', d: `M${f1(bl)},${f1(floorY + 4)} L${f1(-W * 0.3)},${f1(H * 1.3)} M${f1(br)},${f1(floorY + 4)} L${f1(W * 1.3)},${f1(H * 1.3)} M${f1(W * 0.08)},${f1(floorY + H * 0.06)} H${f1(W * 0.92)}` }, court);
      net.setAttribute('viewBox', `0 0 ${W} ${H}`);
      net.textContent = '';
      const nT = H * (ph ? 0.56 : 0.6), nB = H * (ph ? 0.78 : 0.84);
      let mesh = '';
      for (let x = 0; x <= W; x += 16) mesh += `M${x},${f1(nT)} V${f1(nB)}`;
      for (let yy = nT + 14; yy <= nB; yy += 14) mesh += `M0,${f1(yy)} H${W}`;
      el('path', { class: 'mesh', d: mesh }, net);
      el('rect', { class: 'tape', x: 0, y: f1(nT - 5), width: W, height: 9 }, net);
      el('path', { class: 'post', d: `M${f1(W * 0.04)},${f1(nT - 14)} V${f1(H * 1.2)} M${f1(W * 0.96)},${f1(nT - 14)} V${f1(H * 1.2)}` }, net);
      lines = [];
      for (let i = 0; i < 64; i++) {
        const r1 = Math.sin(i * 91.7) * 43758.5;
        lines.push({ a: (i / 64) * Math.PI * 2 + (r1 - Math.floor(r1)) * 0.09, o: ((i * 37) % 11) / 11, l: 0.4 + ((i * 53) % 13) / 13, gold: i % 3 !== 0 });
      }
      // thread: from the top of the screen to the ball in his hands
      tsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      th = th || Thread(tsvg);
      const x0 = ctx.lane() ?? W / 2;
      th.set([`M${f1(x0)},0 ${vcurve(x0, 0, b0[0], b0[1] - r0 - 6, 0.5)}`], [{ x: b0[0], y: b0[1] - r0 - 6, at: 1e9, r: 3.5 }]);
      G = { W, H, floorY, px, tx, jumpH, at, b0, b1, r0, cp, apex, Rb: Math.hypot(W, H) * 0.56 };
      lastKey = '';
    },
    update(y) {
      const t = th!;
      const rtop = m.top - y, p = progress(ctx, m, y);
      if (!ctx.motion) { C(contact, 'open', true); C(hc, 'in', true); return; }
      T(world, tr(0, 0));
      T(skyEl, tr(0, 0));
      O(world, 1 - smooth(0.86, 0.9, p));
      // the drawn poses: one at a time, cut on the beat (stop motion), the last one fading as the court dims
      const [k, X, Yf] = figure(p);
      for (const n of ORDER) O(pose[n], n === k ? (n === 'contact' ? 1 - smooth(0.45, 0.52, p) : 1) : 0);
      const [l, tp] = G.at(k, X, Yf);
      T(pose[k], tr(l, tp));
      draw(p);
      // the contact
      const ko = smooth(0.92, 0.985, p);
      C(contact, 'open', p > 0.915);
      O(contact, ko);
      T(contact, `scale(${Math.round(lerp(0.965, 1, ease(seg01(p, 0.92, 1))) * 10000) / 10000})`);
      O(skyEl, 1 - ko); // the stars go out behind the contact, so no star sits in a letter
      C(hc, 'in', p > 0.95);
      O(note, 1 - smooth(0.4, 0.46, p));
      // thread: in with the section, gone when the ball goes up
      const ef = rtop > 0 ? clamp((ctx.vh * 0.5 - rtop) / Math.max(1, G.b0[1])) : 1;
      const tf = 1 - smooth(0.05, 0.09, p);
      t.drawPart(0, ef); t.fade(0, tf); t.knot(0, ef >= 1); O(t.knots[0].c, tf);
      if (ef > 0 && ef < 1) t.partAt(0, ef);
      else t.head(0, 0, false);
    },
  };
  return m;
}
