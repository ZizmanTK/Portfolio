/**
 * Uckange to Grenoble: a sideways bouldering traverse. The scene pins and scrolling pans the camera along the wall while
 * he moves hold by hold to the right, from the riveted steel of the U4 blast furnace onto the limestone above Grenoble.
 * The camera never moves up (it only pans sideways), and he only stays level or goes a little down, so nothing on the
 * screen rises while the visitor scrolls down. Drawn poses (seen from behind); each move keeps a limb or two on their
 * holds (searched offline); every hand and foot is on a drawn hold; a landing puffs chalk; scroll back and he traverses
 * back.
 */
import { $, $$, D, O, T, clamp, div, ease, easeIn, el, f1, lerp, seg01, smooth, tr, twin, vcurve } from '../engine/dom';
import { type Ctx, type Scene, blank, progress, span } from '../engine/scene';

/** The three notes: on the steel, at the seam, on the limestone. */
export interface ClimbText { steps: [string, string, string] }

// image width (height 820), head top and belt (fractions of the height), hip x (fraction of the width)
const POSE: Record<string, [number, number, number, number]> = {
  start: [398, 0.006, 0.415, 0.5], highstep: [392, 0.022, 0.415, 0.53], rockover: [324, 0.156, 0.488, 0.54],
  reach: [377, 0.128, 0.463, 0.57], pull: [366, 0.046, 0.43, 0.57], topout: [306, 0.156, 0.488, 0.57],
};
// pose, mirrored, image top-left (X, Y), hands and feet (LH, RH, LF, RF), in body units (head to belt = 1; y down);
// the floor is at GROUND; his feet start a body unit above it and the route only goes right and a little down
const SEQ: [string, number, number, number, number[]][] = [
  ['start', 0, -0.593, -3.34, [-0.361, -3.235, 0.38, -3.235, -0.415, -1.0, 0.392, -1.0]],
  ['pull', 0, -0.042, -3.419, [0.179, -3.323, 1.021, -3.341, 0.275, -1.435, 0.593, -0.912]],
  ['start', 0, 0.415, -3.251, [0.647, -3.146, 1.388, -3.146, 0.593, -0.912, 1.4, -0.912]],
  ['pull', 1, 1.08, -3.322, [1.179, -3.244, 2.022, -3.226, 1.608, -0.814, 1.925, -1.338]],
  ['highstep', 0, 1.756, -3.213, [1.927, -3.088, 2.851, -3.144, 2.02, -1.475, 2.471, -0.763]],
  ['start', 1, 2.453, -3.176, [2.667, -3.071, 3.407, -3.071, 2.655, -0.836, 3.462, -0.836]],
  ['pull', 0, 3.007, -3.255, [3.228, -3.159, 4.07, -3.177, 3.324, -1.271, 3.642, -0.748]],
  ['start', 0, 3.464, -3.087, [3.696, -2.982, 4.437, -2.982, 3.642, -0.748, 4.448, -0.748]],
  ['pull', 0, 4.015, -3.167, [4.236, -3.071, 5.078, -3.089, 4.332, -1.183, 4.649, -0.659]],
];
const GROUND = 0.42, SEAM = 2.24; // the floor (body units below the origin); where the steel gives way to limestone (x)
const A0 = 0.08, A1 = 0.9; // the moves happen between these two progress points
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

interface Step { name: string; mir: number; key: string; X: number; Y: number; W: number; H: number; belt: number; hip: number; limbs: [number, number][]; hold: number[]; lands: { h: number; li: number }[] }
interface Hold { x: number; y: number; n: number; hand: boolean; first: number; grab: number; chalk?: SVGPathElement }
interface Path { tk: SVGPathElement; ln: SVGPathElement; L: number; pts: [number, number][] }
type Pose = HTMLImageElement & { __step: number };

export function climbScene(sec: HTMLElement, ctx: Ctx, text: ClimbText): Scene {
  const world = $('#clWorld', sec), rock = $('#clRock', sec), steel = $('#clSteel', sec), svg = $<SVGSVGElement>('#clHolds', sec);
  const climber = $('#clClimber', sec), puffBox = $('#clPuffs', sec), stepEl = $('.cl-step', sec);
  let G = { B: 0, N: 0, ty: 0, ps: 0, seamX: 0, camX: (hx: number) => hx };
  let steps: Step[] = [], holds: Hold[] = [], puffs: HTMLElement[] = [];
  const imgs: Record<string, Pose> = {};
  let lastReach = -9, lastNote = -1, lastPair = -1, warmed = false;
  let entry: Path, exit: Path, head: SVGGElement & { __on?: boolean };

  const place = (im: Pose, s: Step, i: number) => {
    if (im.__step === i) return;
    im.__step = i;
    const B = G.B;
    T(im, s.mir ? `translate3d(${f1((s.X + s.W) * B)}px,${f1(s.Y * B)}px,0) scale(-1,1)` : `translate3d(${f1(s.X * B)}px,${f1(s.Y * B)}px,0)`);
  };
  const headTo = (q: [number, number] | null, on: boolean) => {
    if (on !== head.__on) { head.__on = on; head.style.display = on ? '' : 'none'; }
    if (on && q) T(head, `translate(${f1(q[0])}px,${f1(q[1])}px)`);
  };
  const noteAt = (reached: number, hipW: number) => (reached >= G.N ? 2 : Math.abs(hipW - G.seamX) < 0.9 * G.B ? 1 : hipW > G.seamX ? 2 : 0);

  const m: Scene = {
    ...blank('climb'),
    build() {
      span(ctx, m, sec);
      const vw = ctx.vw, vh = ctx.vh, ph = ctx.phone(), B = Math.round(vh * (ph ? 0.13 : 0.165));
      steps = SEQ.map(([name, mir, X, Y, L]) => {
        const [w, hd, bt, hx] = POSE[name], H = 1 / (bt - hd), W = (H * w) / 820;
        return {
          name, mir, key: name + (mir ? '-m' : ''), X, Y, W, H, belt: Y + bt * H, hip: X + (mir ? 1 - hx : hx) * W,
          limbs: [[L[0], L[1]], [L[2], L[3]], [L[4], L[5]], [L[6], L[7]]], hold: [], lands: [],
        };
      });
      const N = steps.length - 1;
      holds = [];
      steps.forEach((s, i) => {
        s.hold = s.limbs.map(([x, y], li) => {
          let best = -1, bd = 1e9;
          holds.forEach((h, j) => {
            const d = Math.hypot(h.x - x, h.y - y);
            if (d < bd) { bd = d; best = j; }
          });
          if (best >= 0 && bd < 0.26) {
            const h = holds[best];
            h.x = (h.x * h.n + x) / (h.n + 1); h.y = (h.y * h.n + y) / (h.n + 1); h.n++;
            if (li < 2) h.hand = true;
            return best;
          }
          holds.push({ x, y, n: 1, hand: li < 2, first: i, grab: li < 2 ? i : 99 });
          return holds.length - 1;
        });
        s.hold.forEach((h, li) => { if (li < 2) holds[h].grab = Math.min(holds[h].grab, i); });
      });
      steps.forEach((s, i) => {
        s.lands = i ? s.hold.map((h, li) => (h !== steps[i - 1].hold[li] ? { h, li } : null)).filter((x): x is { h: number; li: number } => !!x) : [];
      });
      // the camera: his hips at the middle of the screen (eased from move to move), at a fixed height; it only pans
      const SY = vh * (ph ? 0.5 : 0.52), ty = SY - steps[0].belt * B;
      const hip0 = steps[0].hip, hipN = steps[N].hip;
      const groundY = GROUND * B;
      // the wall, in world pixels: from a screen left of the start to a screen right of the end, from the top of the
      // screen to the floor; steel up to the seam, limestone after it
      const xL = hip0 * B - vw * 0.62, xR = hipN * B + vw * 0.62, yT = -ty - 4, seamX = SEAM * B;
      const put = (node: HTMLElement, x0: number, x1: number) => {
        node.style.left = f1(x0) + 'px'; node.style.top = f1(yT) + 'px';
        node.style.width = f1(x1 - x0) + 'px'; node.style.height = f1(groundY - yT) + 'px';
      };
      put(steel, xL, seamX);
      put(rock, seamX, xR);
      // the holds layer
      const x0 = xL, y0 = yT, ww = xR - xL, hh = groundY + vh - yT;
      svg.style.left = f1(x0) + 'px'; svg.style.top = f1(y0) + 'px'; svg.style.width = f1(ww) + 'px'; svg.style.height = f1(hh) + 'px';
      svg.setAttribute('viewBox', `${f1(x0)} ${f1(y0)} ${f1(ww)} ${f1(hh)}`);
      svg.textContent = '';
      const g = el('g', {}, svg);
      el('rect', { class: 'floor', x: f1(x0), y: f1(groundY), width: f1(ww), height: f1(vh) }, g);
      el('path', { class: 'edge', d: `M${f1(x0)},${f1(groundY)} H${f1(x0 + ww)}` }, g);
      // crash pads along the whole traverse (bouldering: no rope)
      const padW = 2.6 * B, padH = 0.2 * B;
      for (let px = hip0 * B - padW * 0.75; px < hipN * B + padW * 0.6; px += padW + 0.06 * B) {
        el('rect', { class: 'pad', x: f1(px), y: f1(groundY - padH), width: f1(padW), height: f1(padH), rx: 3 }, g);
        el('rect', { class: 'pad-band', x: f1(px), y: f1(groundY - padH), width: f1(padW), height: f1(padH * 0.22), rx: 2 }, g);
      }
      // the seam: the riveted edge of the U4's steel, where the limestone takes over
      el('rect', { class: 'flange', x: f1(seamX - 0.09 * B), y: f1(yT), width: f1(0.16 * B), height: f1(groundY - yT) }, g);
      for (let y = yT + 0.2 * B; y < groundY; y += 0.34 * B) el('circle', { class: 'rivet', cx: f1(seamX - 0.01 * B), cy: f1(y), r: f1(Math.max(1.5, 0.028 * B)) }, g);
      holds.forEach((h, i) => {
        const steelZone = h.x * B < seamX - 0.1 * B, hand = h.hand, sz = (hand ? 0.17 : 0.14) * B;
        const cx = h.x * B, cy = h.y * B + (hand ? 0.05 : 0.07) * B;
        const gh = el('g', { class: 'hold ' + (steelZone ? 'bolt' : 'rockh'), transform: `translate(${f1(cx)},${f1(cy)}) rotate(${f1((rnd(i, 1) - 0.5) * 50)})` }, g);
        if (steelZone) {
          const pts: string[] = [];
          const n = 6;
          for (let k = 0; k < n; k++) {
            const a = (k / n) * Math.PI * 2, rr = sz * (0.78 + rnd(i, k + 2) * 0.4);
            pts.push(`${f1(Math.cos(a) * rr * 1.25)},${f1(Math.sin(a) * rr * 0.8)}`);
          }
          el('polygon', { points: pts.join(' ') }, gh);
          el('circle', { class: 'bolt-c', cy: f1(sz * 0.12), r: f1(Math.max(1.6, sz * 0.16)) }, gh);
        } else {
          const w = sz * 1.35, t = sz * 0.5, j = (k: number) => (rnd(i, k) - 0.5) * t * 0.5;
          el('path', { class: 'under', d: `M${f1(-w)},${f1(j(3))} L${f1(-w * 0.55)},${f1(t * 0.95)} L${f1(w * 0.45)},${f1(t * 1.05)} L${f1(w * 0.95)},${f1(j(4))} Z` }, gh);
          el('path', { d: `M${f1(-w)},${f1(j(3))} L${f1(-w * 0.7)},${f1(-t * 0.55 + j(5))} L${f1(w * 0.55)},${f1(-t * 0.6 + j(6))} L${f1(w * 0.95)},${f1(j(4))} Z` }, gh);
        }
        if (hand) {
          const cy0 = steelZone ? -0.42 * sz : -0.3 * sz;
          h.chalk = el('path', { class: 'chalk', d: `M${f1(-sz * 0.8)},${f1(cy0 + sz * 0.06)} Q${f1(-sz * 0.1)},${f1(cy0 - sz * 0.22)} ${f1(sz * 0.75)},${f1(cy0)} L${f1(sz * 0.55)},${f1(cy0 + sz * 0.12)} Q${f1(-sz * 0.1)},${f1(cy0 - sz * 0.02)} ${f1(-sz * 0.6)},${f1(cy0 + sz * 0.16)} Z` }, gh);
          h.chalk.style.opacity = '0';
        }
      });
      // camera x for a hip position (world), and the entry / exit threads (both only go down the screen)
      const camX = (hx: number) => vw / 2 - hx * B;
      const tx0 = camX(hip0), txN = camX(hipN);
      const top0 = [(ctx.lane() ?? vw / 2) - tx0, -ty];
      const padL = [hip0 * B - padW * 0.75 - 0.08 * B, groundY - padH];
      const eD = `M${f1(top0[0])},${f1(top0[1])} ${vcurve(top0[0], top0[1], padL[0], padL[1], 0.55)}`;
      const lastPad = [hipN * B + 0.6 * B, groundY - padH], endX = (ctx.lane() ?? vw / 2) - txN, endY = vh - ty;
      const xD = `M${f1(lastPad[0])},${f1(lastPad[1])} ${vcurve(lastPad[0], lastPad[1], endX, endY + 2, 0.5)}`;
      const live = twin(svg, 'cl-holds live');
      live.setAttribute('viewBox', svg.getAttribute('viewBox')!);
      live.style.left = svg.style.left; live.style.top = svg.style.top; live.style.width = svg.style.width; live.style.height = svg.style.height;
      const ex = el('g', { class: 'tg' }, live);
      const mk = (dd: string): Path => {
        const tk = el('path', { class: 'track', d: dd }, ex), ln = el('path', { class: 'line', d: dd }, ex);
        const L = ln.getTotalLength();
        ln.style.strokeDasharray = `${f1(L)} ${f1(L + 4)}`;
        ln.style.strokeDashoffset = String(f1(L));
        (ln as unknown as { __d: number }).__d = f1(L);
        const pts: [number, number][] = [];
        for (let i = 0; i <= 60; i++) {
          const q = ln.getPointAtLength((L * i) / 60);
          pts.push([q.x, q.y]);
        }
        return { tk, ln, L, pts };
      };
      entry = mk(eD);
      exit = mk(xD);
      exit.tk.style.opacity = '0';
      head = el('g', { class: 'hd' }, ex);
      el('circle', { class: 'halo', r: 9 }, head);
      el('circle', { class: 'head', r: 3.6 }, head);
      head.style.display = 'none';
      head.__on = false;
      const want = new Set(steps.map((s) => s.key));
      for (const k of Object.keys(imgs)) if (!want.has(k)) { imgs[k].remove(); delete imgs[k]; }
      for (const s of steps) {
        if (!imgs[s.key]) {
          const im = new Image() as Pose;
          im.src = `assets/art/cl-${s.name}.webp`;
          im.alt = '';
          im.decoding = 'async';
          climber.appendChild(im);
          imgs[s.key] = im;
        }
        const im = imgs[s.key];
        im.style.width = f1(s.W * B) + 'px';
        im.style.height = f1(s.H * B) + 'px';
        im.__step = -1;
        (im as unknown as { __t?: string; __o?: number }).__t = undefined;
        (im as unknown as { __t?: string; __o?: number }).__o = undefined;
        im.style.opacity = '0';
      }
      if (!puffs.length) for (let i = 0; i < 3; i++) {
        const pf = div('cl-puff', puffBox, 'span');
        pf.innerHTML = '<svg viewBox="-50 -50 100 100"><circle cx="0" cy="0" r="13"/><circle cx="-14" cy="-5" r="9"/><circle cx="13" cy="-7" r="10"/><circle cx="-4" cy="-17" r="8"/><circle cx="9" cy="-21" r="6"/><circle class="s" cx="-30" cy="-16" r="3"/><circle class="s" cx="28" cy="-26" r="2.6"/><circle class="s" cx="-22" cy="-34" r="2.2"/><circle class="s" cx="34" cy="2" r="2.4"/><circle class="s" cx="-36" cy="6" r="2"/><circle class="s" cx="4" cy="-40" r="2"/></svg>';
        puffs.push(pf);
      }
      const ps = 0.9 * B;
      puffs.forEach((pf) => {
        pf.style.width = pf.style.height = f1(ps) + 'px';
        pf.style.opacity = '0';
        (pf as unknown as { __o: number }).__o = 0;
      });
      lastReach = -9; lastNote = -1; lastPair = -1;
      G = { B, N, ty, camX, ps, seamX };
    },
    update(y) {
      const motion = ctx.motion, vh = ctx.vh;
      const rtop = m.top - y, p = progress(ctx, m, y), B = G.B, N = G.N;
      // the climb is short, so the stack section comes soon after it: decode its drawings while he climbs (cheap
      // frames), not when they first come on screen
      if (!warmed && p > 0.2) {
        warmed = true;
        for (const im of $$<HTMLImageElement>('#bassetti img')) {
          im.loading = 'eager';
          if (im.decode) im.decode().catch(() => {});
        }
      }
      const q = clamp((p - A0) / (A1 - A0)) * N;
      let i = Math.min(N - 1, Math.floor(q)), u = q - i;
      if (q >= N) { i = N - 1; u = 1; }
      const a = steps[i], b = steps[i + 1];
      // the two poses of this move: a clean cut halfway (drawn frames, like stop motion), never two of him at once
      const x = u >= 0.45 ? 1 : 0;
      for (const k in imgs) O(imgs[k], k === a.key ? 1 - x : k === b.key ? x : 0);
      place(imgs[a.key], a, i);
      place(imgs[b.key], b, i + 1);
      if (lastPair !== i) { lastPair = i; imgs[a.key].style.zIndex = '1'; imgs[b.key].style.zIndex = '2'; }
      // camera: sideways only, following his hips; its height never changes
      const hx = lerp(a.hip, b.hip, smooth(0.12, 0.88, u));
      T(world, `translate3d(${f1(G.camX(hx))}px,${f1(G.ty)}px,0)`);
      const reached = u >= 0.48 ? i + 1 : i;
      if (reached !== lastReach) {
        lastReach = reached;
        for (const h of holds) if (h.chalk) O(h.chalk, h.grab <= reached ? 0.9 : 0);
      }
      const pu = (u - 0.47) / 0.5;
      puffs.forEach((pf, k) => {
        const L = b.lands[k];
        if (!L || pu <= 0 || pu >= 1 || !motion) { O(pf, 0); return; }
        const h = holds[L.h], hand = L.li < 2, sc = (hand ? 1 : 0.7) * lerp(0.4, 1.25, ease(pu));
        T(pf, tr(h.x * B - G.ps / 2, h.y * B - G.ps * 0.62, sc));
        O(pf, (hand ? 0.9 : 0.65) * (1 - easeIn(pu)));
      });
      const ef = !motion ? 1 : rtop > 0 ? clamp((vh - rtop) / vh) * 0.9 : lerp(0.9, 1, seg01(p, 0, A0));
      D(entry.ln, entry.L * (1 - ef));
      O(entry.ln, 1 - smooth(A0, A0 + 0.05, p));
      O(entry.tk, 1 - smooth(A0 - 0.02, A0 + 0.03, p));
      const xf = motion ? seg01(p, 0.92, 1) : 1;
      D(exit.ln, exit.L * (1 - xf));
      O(exit.tk, xf > 0 ? 1 : 0);
      if (ef > 0.02 && ef < 0.999) headTo(entry.pts[Math.round(ef * 60)], true);
      else if (xf > 0.001 && xf < 0.999) headTo(exit.pts[Math.round(xf * 60)], true);
      else headTo(null, false);
      const note = noteAt(reached, hx * B);
      if (note !== lastNote) { lastNote = note; stepEl.textContent = text.steps[note]; }
    },
  };
  return m;
}
