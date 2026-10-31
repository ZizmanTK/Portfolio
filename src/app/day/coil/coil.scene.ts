/**
 * Stop 05, CoilCheck as a set piece: a coil rolls in on the line, the camera pushes in, a scan line sweeps the steel and
 * leaves the anomaly heatmap behind it, the hot spot blooms, a box snaps onto the defect with the model's label, then
 * the facts come in. The coil and its two heat layers are canvases drawn once, at the resolution of the pushed-in
 * camera; everything after that is transforms and opacity.
 */
import { $, C, O, T, clamp, ease, easeIO, el, f1, lerp, reset, seg01, smooth, tr, vcurve } from '../engine/dom';
import { type Ctx, type Scene, blank, progress, span } from '../engine/scene';
import { Thread } from '../engine/thread';

/** The five beats of the scan, written in the scene note. */
export interface CoilText { steps: [string, string, string, string, string] }

const DEF = (-52 * Math.PI) / 180; // where the defect sits on the coil once it has stopped
const jet = (v: number) => [clamp(1.5 - Math.abs(4 * v - 3)), clamp(1.5 - Math.abs(4 * v - 2)), clamp(1.5 - Math.abs(4 * v - 1))];

function drawCoil(cv: HTMLCanvasElement, Dm: number, R: number, ri: number, bs: number) {
  cv.width = cv.height = Math.round(Dm * bs);
  cv.style.width = cv.style.height = Dm + 'px';
  const c = cv.getContext('2d')!;
  c.setTransform(bs, 0, 0, bs, 0, 0);
  c.translate(Dm / 2, Dm / 2);
  const ink = '#2a2420', TAU = Math.PI * 2;
  const ring = (r0: number, r1: number, fill: string) => {
    c.beginPath(); c.arc(0, 0, r1, 0, TAU); c.arc(0, 0, r0, 0, TAU, true); c.fillStyle = fill; c.fill('evenodd');
  };
  c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fillStyle = '#a5a9ad'; c.fill();
  ring(R * 0.78, R * 0.87, '#b8bcbf'); ring(R * 0.56, R * 0.61, '#b2b6b9'); ring(R * 0.93, R * 0.97, '#9a9ea2');
  c.strokeStyle = 'rgba(42,36,32,.2)'; c.lineWidth = 0.8;
  for (let k = 1; k < 18; k++) { c.beginPath(); c.arc(0, 0, lerp(ri, R, k / 18), 0, TAU); c.stroke(); }
  // three steel straps through the eye
  for (const a of [Math.PI / 6, (5 * Math.PI) / 6, (3 * Math.PI) / 2]) {
    c.save(); c.rotate(a);
    c.fillStyle = '#3e444b'; c.fillRect(ri - R * 0.02, -R * 0.036, R - ri + R * 0.05, R * 0.072);
    c.strokeStyle = ink; c.lineWidth = 1.1; c.strokeRect(ri - R * 0.02, -R * 0.036, R - ri + R * 0.05, R * 0.072);
    c.fillStyle = '#868d94'; c.fillRect(R * 0.8, -R * 0.05, R * 0.08, R * 0.1); c.strokeRect(R * 0.8, -R * 0.05, R * 0.08, R * 0.1);
    c.restore();
  }
  // the defect: a scuffed patch and a scratch across the wraps
  c.save(); c.rotate(DEF); c.translate(R * 0.69, 0);
  c.beginPath(); c.ellipse(0, 0, R * 0.075, R * 0.13, 0, 0, TAU); c.fillStyle = '#8c9094'; c.fill();
  c.strokeStyle = ink; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-R * 0.06, -R * 0.1); c.lineTo(-R * 0.01, -R * 0.03); c.lineTo(-R * 0.035, R * 0.02); c.lineTo(R * 0.03, R * 0.11); c.stroke();
  c.lineWidth = 0.9; c.beginPath(); c.moveTo(R * 0.02, -R * 0.08); c.lineTo(R * 0.045, -R * 0.02); c.stroke();
  c.restore();
  c.lineWidth = 1.8; c.strokeStyle = ink; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.stroke();
  c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(0, 0, ri, 0, TAU); c.fill(); c.globalCompositeOperation = 'source-over';
  ring(ri, ri * 1.08, '#6f7478');
  c.lineWidth = 1.6; c.beginPath(); c.arc(0, 0, ri, 0, TAU); c.stroke();
  c.lineWidth = 1; c.beginPath(); c.arc(0, 0, ri * 1.08, 0, TAU); c.stroke();
}

// the anomaly heatmap over the annulus (jet colours, as in the real figure): a warm ring around the eye and two hot
// spots, the strongest on the defect. 'hotOnly' keeps only the hottest part, for the bloom.
function drawHeat(cv: HTMLCanvasElement, Dm: number, R: number, ri: number, bs: number, hotOnly: boolean) {
  const n = Math.round(Dm * bs);
  cv.width = cv.height = n;
  cv.style.width = cv.style.height = Dm + 'px';
  const c = cv.getContext('2d')!, img = c.createImageData(n, n), d = img.data, k = n / Dm;
  const h1 = [Math.cos(DEF) * R * 0.69, Math.sin(DEF) * R * 0.69], h2 = [Math.cos(0.95) * R * 0.64, Math.sin(0.95) * R * 0.64];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = (i + 0.5) / k - Dm / 2, y = (j + 0.5) / k - Dm / 2, r = Math.hypot(x, y);
    if (r > R + 1 || r < ri - 1) continue;
    const edge = clamp(R + 0.5 - r) * clamp(r - ri + 0.5);
    const a = Math.atan2(y, x);
    let v = 0.28 + 0.3 * Math.exp(-(((r - R * 0.6) / (R * 0.13)) ** 2)) + 0.05 * Math.sin(3 * a + 1.2) + 0.035 * Math.sin(7 * a);
    v += 0.52 * Math.exp(-((x - h1[0]) ** 2 + (y - h1[1]) ** 2) / (R * 0.16) ** 2) + 0.24 * Math.exp(-((x - h2[0]) ** 2 + (y - h2[1]) ** 2) / (R * 0.15) ** 2);
    let al = 0.8 * edge;
    if (hotOnly) {
      al = clamp((v - 0.7) / 0.16) * edge * 0.95;
      if (al <= 0) continue;
      v = Math.min(1, v + 0.06);
    }
    const j3 = jet(clamp(v)), rr = lerp(j3[0], 0.62, 0.14), gg = lerp(j3[1], 0.62, 0.14), bb = lerp(j3[2], 0.62, 0.14);
    const o = (j * n + i) * 4;
    d[o] = rr * 255; d[o + 1] = gg * 255; d[o + 2] = bb * 255; d[o + 3] = al * 255;
  }
  c.putImageData(img, 0, 0);
}

export function coilScene(sec: HTMLElement, ctx: Ctx, text: CoilText): Scene {
  const floor = $<SVGSVGElement>('#ccFloor', sec), man = $<HTMLImageElement>('#ccMan', sec), cam = $('#ccCam', sec);
  const base = $<HTMLCanvasElement>('#ccCoil', sec), heatWin = $('#ccHeatWin', sec), heat = $<HTMLCanvasElement>('#ccHeat', sec);
  const hot = $<HTMLCanvasElement>('#ccHot', sec), scan = $('#ccScan', sec), box = $('#ccBox', sec), tag = $('.cc-tag', box);
  const facts = $('#ccFacts', sec), factsH = $('.h-stop', facts), stepEl = $('.cc-step', sec), tsvg = $<SVGSVGElement>('#ccThread', sec);
  let th: Thread | null = null, lastNote = -1;
  let G = { R: 0, ri: 0, yf: 0, xc: 0, yc: 0, S1: 1, xt: 0, yt: 0, Dm: 0, hx: 0, hy: 0, bw: 0, bh: 0, mx: 0, my: 0, fy0: 0, tabY: 0, shift: 0, exitX: 0 };
  const m: Scene = {
    ...blank('coil'),
    build() {
      span(ctx, m, sec);
      const W = ctx.vw, H = ctx.vh, ph = ctx.phone();
      const R = ph ? Math.min(W * 0.27, H * 0.13) : Math.min(H * 0.21, W * 0.15), ri = R * 0.44;
      const yf = H * (ph ? 0.6 : 0.8), xc = W * (ph ? 0.33 : 0.4), yc = yf - R;
      const R1 = ph ? Math.min(W * 0.38, H * 0.19) : Math.min(H * 0.31, W * 0.21), S1 = R1 / R;
      const xt = W * (ph ? 0.5 : 0.33), yt = H * (ph ? 0.31 : 0.5) + (ph ? 0 : 12);
      const Dm = Math.ceil(R * 2.3), dpr = Math.min(2, devicePixelRatio || 1), bs = dpr * S1;
      cam.style.width = cam.style.height = Dm + 'px';
      drawCoil(base, Dm, R, ri, bs);
      drawHeat(heat, Dm, R, ri, bs * 0.4, false);
      drawHeat(hot, Dm, R, ri, bs * 0.4, true);
      heatWin.style.width = heatWin.style.height = Dm + 'px';
      scan.style.height = f1(R * 2.3) + 'px';
      scan.style.top = f1(Dm / 2 - R * 1.15) + 'px';
      const hx = Dm / 2 + Math.cos(DEF) * R * 0.69, hy = Dm / 2 + Math.sin(DEF) * R * 0.69;
      hot.style.transformOrigin = `${f1(hx)}px ${f1(hy)}px`;
      // the box is outside the camera, so its border and label stay sharp; it is placed where the defect ends up
      const bw = R * 0.46 * S1, bh = R * 0.42 * S1;
      box.style.width = f1(bw) + 'px';
      box.style.height = f1(bh) + 'px';
      // the floor: a roller line
      floor.setAttribute('viewBox', `0 0 ${W} ${H}`);
      floor.textContent = '';
      const g = el('g', {}, floor);
      const rr = Math.max(5, R * 0.065), step = R * 0.42;
      el('path', { class: 'rail', d: `M0,${f1(yf + rr * 2)} H${W}` }, g);
      for (let x = step / 2, i = 0; x < W + step; x += step, i++) {
        el('circle', { class: 'roller', cx: f1(x), cy: f1(yf + rr), r: f1(rr) }, g);
        if (i % 3 === 1) el('path', { class: 'leg', d: `M${f1(x)},${f1(yf + rr * 2)} V${f1(Math.min(H, yf + R * 0.9))}` }, g);
      }
      // where he stands (feet on the line), and how far he walks off when the camera moves in
      man.style.transform = '';
      reset(man, 't');
      const mh = man.offsetHeight, mw = man.offsetWidth;
      const mx = W * (ph ? 0.6 : 0.66), my = yf - mh;
      // the facts, centred (desktop) or at the bottom (phone); measured without their entrance offset
      facts.style.transform = 'none';
      reset(facts, 't');
      const fy0 = ph ? 0 : -facts.offsetHeight / 2;
      const lab = $('.label', facts);
      const fl = facts.offsetLeft, ft = facts.offsetTop + fy0;
      const ky = ft + lab.offsetTop + lab.offsetHeight / 2, kx = ctx.lane() ?? fl - 20;
      // thread: down to his tablet at the start; out from the facts' label at the end
      tsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      th = th || Thread(tsvg);
      const tabX = mx + mw * 0.18, tabY = my + mh * 0.31, x0 = ctx.lane() ?? W / 2; // the tablet in his hands (safety2.webp)
      th.set([`M${f1(x0)},0 ${vcurve(x0, 0, tabX, tabY, 0.5)}`, `M${f1(kx)},${f1(ky)} ${vcurve(kx, ky, x0, H, 0.55)}`],
        [{ x: tabX, y: tabY, at: 0, r: 4 }, { x: kx, y: ky, at: 1e9, r: 5 }]);
      G = { R, ri, yf, xc, yc, S1, xt, yt, Dm, hx, hy, bw, bh, mx, my, fy0, tabY, shift: ph ? 0 : W * 0.025, exitX: W * 0.3 };
    },
    update(y) {
      const t = th!, motion = ctx.motion;
      const rtop = m.top - y, p = progress(ctx, m, y);
      // roll in, settle, push in
      const k1 = ease(seg01(p, 0, 0.24));
      const cx = lerp(-G.R * 1.3, G.xc, motion ? k1 : 1);
      const w = seg01(p, 0.24, 0.31);
      const rot = (cx - G.xc) / G.R + Math.sin(w * Math.PI * 2) * (1 - w) * 0.05;
      const k2 = motion ? easeIO(seg01(p, 0.31, 0.46)) : 1;
      const k5 = motion ? easeIO(seg01(p, 0.78, 0.88)) : 1;
      const s = lerp(1, G.S1, k2);
      const Fx = lerp(G.xc, G.xt, k2) - k5 * G.shift, Fy = lerp(G.yc, G.yt, k2);
      const X = (cx - G.xc) * s + Fx, Y = Fy;
      T(cam, tr(X - (G.Dm / 2) * s, Y - (G.Dm / 2) * s, s));
      T(base, `rotate(${Math.round(rot * 1000) / 1000}rad)`);
      const ws = tr(Fx - G.xc * s, Fy - G.yc * s, s);
      T(floor, ws);
      O(floor, 1 - smooth(0.34, 0.44, p));
      T(man, tr(Fx - G.xc * s + G.mx * s + k2 * G.exitX, Fy - G.yc * s + G.my * s, s));
      O(man, 1 - smooth(0.32, 0.41, p));
      // the scan reveals the heatmap behind it
      const k3 = motion ? seg01(p, 0.46, 0.64) : 1;
      const sx = lerp(G.Dm / 2 - G.R * 1.02, G.Dm / 2 + G.R * 1.02, k3);
      T(scan, tr(sx, 0));
      O(scan, k3 > 0 && k3 < 1 ? 1 : 0);
      T(heatWin, tr(-(G.Dm - sx), 0));
      T(heat, tr(G.Dm - sx, 0));
      O(heatWin, k3 > 0 ? 1 : 0);
      // bloom on the hot spot
      const k4 = motion ? seg01(p, 0.62, 0.72) : 1;
      O(hot, easeIO(k4));
      T(hot, `scale(${Math.round(lerp(0.78, 1, ease(k4)) * 1000) / 1000})`);
      // the box snaps on (from large to a little small, then settles)
      const kb = motion ? seg01(p, 0.7, 0.77) : 1;
      const sb = kb < 0.6 ? lerp(1.9, 0.94, ease(kb / 0.6)) : lerp(0.94, 1, easeIO((kb - 0.6) / 0.4));
      const bx = X + (G.hx - G.Dm / 2) * s, by = Y + (G.hy - G.Dm / 2) * s;
      T(box, tr(bx - G.bw / 2, by - G.bh / 2, sb));
      O(box, Math.min(1, kb * 3));
      O(tag, motion ? smooth(0.75, 0.79, p) : 1);
      // the facts
      const kf = motion ? seg01(p, 0.8, 0.9) : 1;
      O(facts, easeIO(kf));
      T(facts, tr(0, G.fy0 + (1 - ease(kf)) * 26));
      C(facts, 'on', kf > 0.4);
      C(factsH, 'in', kf > 0.2);
      const note = p < 0.28 ? 0 : p < 0.46 ? 1 : p < 0.64 ? 2 : p < 0.72 ? 3 : 4;
      if (note !== lastNote) { lastNote = note; stepEl.textContent = text.steps[note]; }
      // thread
      const ef = !motion || rtop <= 0 ? 1 : clamp((ctx.vh * 0.5 - rtop) / Math.max(1, G.tabY));
      const f0 = 1 - smooth(0.3, 0.36, p), f1_ = motion ? smooth(0.8, 0.86, p) : 1;
      t.drawPart(0, ef); t.knot(0, ef >= 1); t.fade(0, f0); O(t.knots[0].c, f0);
      const xf = motion ? seg01(p, 0.88, 1) : 1;
      t.drawPart(1, xf); t.knot(1, xf > 0); t.fade(1, f1_); O(t.knots[1].c, f1_);
      if (ef > 0 && ef < 1) t.partAt(0, ef);
      else if (xf > 0 && xf < 1) t.partAt(1, xf);
      else t.head(0, 0, false);
    },
  };
  return m;
}
