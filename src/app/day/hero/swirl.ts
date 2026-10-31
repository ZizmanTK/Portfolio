/**
 * The first-light word swirl (idea from tholman.com): everything Aziz has built and used, drifting along the
 * streamlines of a slow current around his name. Every word comes from site.json. Canvas 2D, no dependencies.
 * Performance: each word is rendered once to a small sprite (per style), and frames only place sprites; the focus
 * ellipse and the drain point are read once (refresh), never inside a frame.
 */

export interface SwirlOptions {
  words: string[];
  /** Words drawn in the accent colour, and where a click on them leads (element ids). */
  links: Record<string, string>;
  reduce: boolean;
  host: HTMLElement;
  ink: string;
  accent: string;
  focus: () => { x: number; y: number; rx: number; ry: number } | null;
  drain: () => { x: number; y: number } | null;
  go: (id: string) => void;
}

export interface Swirl {
  setProgress(p: number): void;
  /** A recorder can drive the clock frame by frame. */
  manual(on: boolean): void;
  tick(dt: number): void;
  refresh(): void;
  redraw(): void;
  destroy(): void;
}

interface Line { pts: [number, number][]; s: number[]; len: number; speed: number; off: number; cycle: number }
interface Word { L: Line; w: string; wpx: number; base: number; x: number; y: number; a: number; alpha: number }
interface Sprite { c: HTMLCanvasElement; w: number; h: number }

// deterministic random, so the composition is the same on every visit
function rng(seed: number) {
  return function () {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function initSwirl(canvas: HTMLCanvasElement, opts: SwirlOptions): Swirl {
  const { words: WORDS, links: LINK, reduce } = opts;
  const ACCENT = new Set(Object.keys(LINK));
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, dpr = 1, lines: Line[] = [], words: Word[] = [], raf = 0, last = 0, t = 0, prog = 0;
  let hover: Word | null = null;
  let F: { x: number; y: number; rx: number; ry: number } | null = null;
  let Dr: { x: number; y: number } | null = null;
  const sprites = new Map<string, Sprite>();
  const ink = opts.ink, accent = opts.accent;
  const fontPx = () => (W < 700 ? 11 : 12);

  // the current: a smooth, slowly turning field with two eddies
  function angle(x: number, y: number) {
    const u = x / W, v = y / H;
    return 0.55 * Math.sin(u * 5.1 + v * 2.3) + 0.42 * Math.cos(v * 6.2 - u * 1.7) +
      0.9 * Math.sin((u - 0.28) * 3.2) * Math.cos((v - 0.35) * 3.4) - 0.12;
  }

  function build() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(320, r.width); H = Math.max(320, r.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sprites.clear();
    ctx.font = `400 ${fontPx()}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'middle';

    const rand = rng(7);
    const sep = W < 700 ? 22 : 25; // distance between streamlines
    const cell = sep * 0.62;
    const cols = Math.ceil(W / cell) + 2, rows = Math.ceil(H / cell) + 2;
    const occ = new Int32Array(cols * rows).fill(-1);
    const key = (x: number, y: number) => (Math.floor(y / cell) + 1) * cols + Math.floor(x / cell) + 1;
    const free = (x: number, y: number, id: number) => {
      const cx = Math.floor(x / cell) + 1, cy = Math.floor(y / cell) + 1;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
        const o = occ[(cy + j) * cols + cx + i];
        if (o !== -1 && o !== id) return false;
      }
      return true;
    };
    const pad = 40;
    const inside = (x: number, y: number) => x > -pad && x < W + pad && y > -pad && y < H + pad;

    function trace(x0: number, y0: number, id: number): [number, number][] {
      const step = 3;
      const fwd: [number, number][] = [], back: [number, number][] = [];
      for (const dir of [1, -1]) {
        let x = x0, y = y0;
        const out = dir === 1 ? fwd : back;
        for (let k = 0; k < 900; k++) {
          const a = angle(x, y);
          x += Math.cos(a) * step * dir; y += Math.sin(a) * step * dir;
          if (!inside(x, y) || !free(x, y, id)) break;
          out.push([x, y]);
        }
      }
      return back.reverse().concat([[x0, y0]], fwd);
    }

    lines = [];
    const seeds: [number, number][] = [];
    for (let y = sep / 2; y < H; y += sep * 0.9) for (let x = sep / 2; x < W; x += sep * 1.7) seeds.push([x + (rand() - 0.5) * sep, y + (rand() - 0.5) * sep]);
    for (let i = seeds.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [seeds[i], seeds[j]] = [seeds[j], seeds[i]];
    }
    for (const [sx, sy] of seeds) {
      if (!free(sx, sy, -2)) continue;
      const id = lines.length;
      const pts = trace(sx, sy, id);
      if (pts.length < 40) continue;
      // arc length table
      const s = [0];
      for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      for (const p of pts) {
        const k = key(p[0], p[1]);
        if (k >= 0 && k < occ.length) occ[k] = id;
      }
      lines.push({ pts, s, len: s[s.length - 1], speed: 7 + rand() * 7, off: rand() * 400, cycle: 0 });
    }

    // words along every line, as a looping sequence
    words = [];
    let wi = Math.floor(rand() * WORDS.length);
    for (const L of lines) {
      const seq: { w: string; wpx: number; at: number }[] = [];
      let at = 0;
      const gap = 26;
      while (at < L.len + 200) {
        const w = WORDS[wi++ % WORDS.length];
        const wpx = ctx.measureText(w).width;
        seq.push({ w, wpx, at });
        at += wpx + gap;
      }
      L.cycle = at;
      for (const q of seq) words.push({ L, w: q.w, wpx: q.wpx, base: q.at, x: 0, y: 0, a: 0, alpha: 0 });
    }
  }

  function tangent(L: Line, i: number) {
    const a = L.pts[Math.max(0, i - 2)], b = L.pts[Math.min(L.pts.length - 1, i + 2)];
    let ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    if (ang > Math.PI / 2) ang -= Math.PI;
    else if (ang < -Math.PI / 2) ang += Math.PI; // keep words readable
    return ang;
  }
  function pointAt(L: Line, d: number): [number, number, number] {
    // binary search arc length
    const s = L.s;
    let lo = 0, hi = s.length - 1;
    if (d <= 0) return [L.pts[0][0], L.pts[0][1], tangent(L, 0)];
    if (d >= L.len) return [L.pts[hi][0], L.pts[hi][1], tangent(L, hi - 1)];
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (s[m] < d) lo = m;
      else hi = m;
    }
    const f = (d - s[lo]) / (s[hi] - s[lo] || 1);
    const p = L.pts[lo], q = L.pts[hi];
    return [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f, tangent(L, lo)];
  }

  const focus = () => opts.focus() || { x: W / 2, y: H * 0.45, rx: Math.min(660, W * 0.46), ry: 250 };
  const drain = () => opts.drain() || { x: W / 2, y: H * 0.86 };
  function refresh() { F = focus(); Dr = drain(); }
  // a word, rendered once at the screen's resolution
  function sprite(w: string, acc: boolean): Sprite {
    const k = (acc ? 'a|' : 'n|') + w;
    let sp = sprites.get(k);
    if (sp) return sp;
    const fp = fontPx(), font = `${acc ? 500 : 400} ${fp}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.font = font;
    const tw = Math.ceil(ctx.measureText(w).width) + 4, th = Math.ceil(fp * 1.7);
    const c = document.createElement('canvas');
    c.width = Math.ceil(tw * dpr); c.height = Math.ceil(th * dpr);
    const x = c.getContext('2d')!;
    x.scale(dpr, dpr); x.font = font; x.textBaseline = 'middle'; x.fillStyle = acc ? accent : ink;
    x.fillText(w, 2, th / 2);
    sp = { c, w: tw, h: th };
    sprites.set(k, sp);
    return sp;
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!F) refresh();
    const D = Dr!, Fo = F!;
    const e = prog < 0 ? 0 : prog > 1 ? 1 : prog;
    const pull = e * e * (3 - 2 * e);
    const fadeAll = Math.pow(1 - e, 1.6);
    if (fadeAll <= 0.002) return;
    for (const q of words) {
      const L = q.L;
      const d = (q.base + L.off + t * L.speed) % L.cycle;
      if (d > L.len) { q.alpha = 0; continue; }
      const mid = d + q.wpx / 2;
      if (mid > L.len) { q.alpha = 0; continue; }
      const [x, y, a] = pointAt(L, mid);
      // ends of a streamline: fade in and out
      let al = Math.min(1, d / 40, (L.len - d - q.wpx) / 40);
      if (al <= 0) { q.alpha = 0; continue; }
      // keep the centre readable: fade inside an ellipse around the name
      const ex = (x - Fo.x) / Fo.rx, ey = (y - Fo.y) / Fo.ry, dd = ex * ex + ey * ey;
      al *= Math.max(0.0, Math.min(1, (dd - 0.62) / 0.75));
      // and keep the Niamey skyline clean
      al *= Math.max(0, Math.min(1, (H * 0.93 - y) / (H * 0.2)));
      al *= Math.max(0, Math.min(1, (y - 58) / 50)); // clear of the bar
      // scrolling: the whole current is drawn into the thread's first knot
      let px = x, py = y, pa = a;
      if (pull > 0) {
        const vx = x - D.x, vy = y - D.y;
        const rot = pull * 1.35, sc = 1 - pull;
        const c = Math.cos(rot), s = Math.sin(rot);
        px = D.x + (vx * c - vy * s) * sc; py = D.y + (vx * s + vy * c) * sc; pa = a + rot;
        al *= fadeAll;
      }
      q.x = px; q.y = py; q.a = pa; q.alpha = al;
      if (al < 0.02) continue;
      const isAcc = ACCENT.has(q.w), isHov = hover === q;
      const sp = sprite(q.w, isAcc || isHov);
      const c = Math.cos(pa) * dpr, sn = Math.sin(pa) * dpr;
      ctx.setTransform(c, sn, -sn, c, px * dpr, py * dpr);
      ctx.globalAlpha = isHov ? 1 : al * (isAcc ? 0.9 : 0.42);
      ctx.drawImage(sp.c, -q.wpx / 2 - 2, -sp.h / 2, sp.w, sp.h);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    t += dt;
    draw();
    if (!reduce && prog < 1 && !document.hidden) raf = requestAnimationFrame(frame);
  }
  let manual = false;
  function kick() {
    if (!raf && !reduce && !manual) { last = 0; raf = requestAnimationFrame(frame); }
  }

  function pick(mx: number, my: number): Word | null {
    let best: Word | null = null, bd = 1e9;
    for (const q of words) {
      if (q.alpha < 0.08) continue;
      const dx = mx - q.x, dy = my - q.y;
      const c = Math.cos(-q.a), s = Math.sin(-q.a);
      const lx = dx * c - dy * s, ly = dx * s + dy * c;
      if (Math.abs(lx) < q.wpx / 2 + 3 && Math.abs(ly) < 9) {
        const d = Math.abs(ly);
        if (d < bd) { bd = d; best = q; }
      }
    }
    return best;
  }
  function onMove(ev: PointerEvent) {
    if (prog > 0.05) return;
    const r = canvas.getBoundingClientRect();
    const h = pick(ev.clientX - r.left, ev.clientY - r.top);
    if (h !== hover) {
      hover = h;
      canvas.style.cursor = h && LINK[h.w] ? 'pointer' : '';
      if (reduce) draw();
    }
  }
  function onClick() {
    if (hover && LINK[hover.w]) opts.go(LINK[hover.w]);
  }
  // the canvas sits under the hero text, so listen on the hero and test the pointer position
  const host = opts.host;
  host.addEventListener('pointermove', onMove);
  host.addEventListener('click', onClick);
  const onVis = () => { if (!document.hidden) kick(); };
  document.addEventListener('visibilitychange', onVis);

  let rt = 0;
  const onResize = () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => { build(); refresh(); draw(); kick(); }, 120);
  };
  window.addEventListener('resize', onResize);

  build();
  t = 6; // start mid-flow
  draw();
  kick();

  return {
    setProgress(p) {
      const was = prog;
      prog = p;
      if (p < 1 && was >= 1) kick();
      if (reduce || !raf) draw();
    },
    manual(on) {
      manual = !!on;
      if (manual) { cancelAnimationFrame(raf); raf = 0; } else kick();
    },
    tick(dt) { t += dt; draw(); },
    refresh() { refresh(); draw(); },
    redraw() { build(); refresh(); draw(); },
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('click', onClick);
    },
  };
}
