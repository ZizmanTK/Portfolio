/**
 * "Walk through a day": the scroll engine. One loop reads the scroll position and drives the time of day (clock, stop
 * counter, sky, sun), the gold thread, and the set pieces (each registered by the component that renders it).
 *
 * Performance rules: layout is measured once (on load and on resize), never inside the frame loop. Each frame reads only
 * the scroll position, updates only the scenes on screen, and writes transforms, opacity and dash offsets, each only
 * when its value changes. Colours that depend on the time of day are set once per section, from the sky it is seen
 * against; only the fixed sky layer changes colour while you scroll. Lenis smooths the wheel.
 *
 * Browser only: `start()` is called from afterNextRender, after hydration.
 */
import { Injectable } from '@angular/core';
import type Lenis from 'lenis';
import { $, $$, C, O, T, clamp, lerp, tr } from './dom';
import { type Ctx, type Scene, type SceneFactory } from './scene';
import { LUT, LUT0, ORANGE, WARM, at, litBy, lut, tokensFor } from './sky';
import { type ResumeController, resumeController } from '../resume/resume.controller';

interface Seg { el: HTMLElement; place: string; top: number; h: number }
interface Anchor { y: number; t: number; stop: number }

const hm = (v: string) => {
  const [a, b] = v.split(':');
  return +a * 60 + +b;
};
const fmt = (m: number) => {
  m = Math.round(m);
  return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
};

@Injectable({ providedIn: 'root' })
export class DayEngine {
  private readonly entries: { host: HTMLElement; make: SceneFactory }[] = [];
  private stopFn: (() => void) | null = null;

  /** Called by each set piece's component; scenes run in page order whatever the order of registration. */
  register(host: HTMLElement, make: SceneFactory): void {
    this.entries.push({ host, make });
  }

  start(): void {
    if (this.stopFn || typeof window === 'undefined') return;
    this.stopFn = run(this.entries);
  }

  stop(): void {
    this.stopFn?.();
    this.stopFn = null;
    this.entries.length = 0;
  }
}

function run(entries: { host: HTMLElement; make: SceneFactory }[]): () => void {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = !reduce;
  root.classList.toggle('motion', motion);

  const ctx: Ctx = {
    root, motion, reduce,
    vw: root.clientWidth, vh: innerHeight, sy0: 0, curT: 340, lenis: null,
    phone: () => ctx.vw < 861,
    lane: () => (ctx.phone() ? 14 : null),
    docTop: (n) => n.getBoundingClientRect().top + ctx.sy0,
    scrollToEl: (t, offset, duration) => {
      if (ctx.lenis) ctx.lenis.scrollTo(t as HTMLElement, { offset, duration });
      else t.scrollIntoView();
    },
  };
  const offs: (() => void)[] = [];
  const on = (t: EventTarget, type: string, f: EventListener, o?: AddEventListenerOptions) => {
    t.addEventListener(type, f, o);
    offs.push(() => t.removeEventListener(type, f, o));
  };
  const timers: number[] = [];
  let raf = 0, stopped = false;

  /* ------------------------------------------------------------------ time along the page */
  const sky = $('#sky'), sunW = $('#sunW'), sunO = $('#sunO'), bar = $('#bar'), meta = $<HTMLMetaElement>('meta[name="theme-color"]');
  const clockEl = $('#clock'), placeEl = $('#place'), stopEl = $('#stopn');
  const segs: Seg[] = $$('main > .seg').map((s) => ({ el: s, place: s.dataset['place'] || '', top: 0, h: 0 }));
  let anchors: Anchor[] = [{ y: 0, t: 340, stop: 1 }];
  // The clock is pinned to the stops: when a stop's label crosses the middle of the screen, the clock reads the time
  // written on it; in between (the hobby scenes) time runs linearly. Labels inside a pinned scene give the progress at
  // which they show (data-anchor) instead of a position.
  function measureTime() {
    const { vh, sy0 } = ctx;
    for (const s of segs) {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + sy0;
      s.h = r.height;
    }
    const maxY = Math.max(2, root.scrollHeight - vh);
    anchors = [{ y: 0, t: 340, stop: 1 }];
    for (const lab of $$('main .label[data-time]')) {
      let y: number;
      if (lab.dataset['anchor'] && motion) {
        const s = segs.find((g) => g.el === lab.closest('main > .seg'))!;
        y = s.top + +lab.dataset['anchor'] * (s.h - vh);
      } else y = ctx.docTop(lab) - vh * 0.5;
      anchors.push({ y: clamp(y, 1, maxY - 1), t: hm(lab.dataset['time']!), stop: +lab.dataset['stop']! });
    }
    for (const d of $$('[data-clock-in]')) {
      const r = d.getBoundingClientRect();
      if (r.height < vh) continue;
      anchors.push({ y: clamp(r.top + sy0, 1, maxY - 1), t: hm(d.dataset['clockIn']!), stop: +d.dataset['stop']! });
      anchors.push({ y: clamp(r.top + sy0 + r.height - vh, 1, maxY - 1), t: hm(d.dataset['clockOut']!), stop: +d.dataset['stop']! });
    }
    anchors.push({ y: maxY, t: 1372, stop: 10 });
    anchors.sort((a, b) => a.y - b.y);
  }
  const anchorAt = (y: number) => {
    let i = 0;
    while (i < anchors.length - 2 && anchors[i + 1].y <= y) i++;
    return i;
  };
  const timeAt = (y: number) => {
    const i = anchorAt(y), a = anchors[i], b = anchors[i + 1] || a;
    return lerp(a.t, b.t, clamp((y - a.y) / Math.max(1, b.y - a.y)));
  };

  // each block gets its colours once, for every sky it can be seen against (while any part of it is on screen)
  function paintBlocks() {
    if (!motion) return;
    const { vh, sy0 } = ctx;
    const blocks: HTMLElement[] = [];
    for (const s of segs) {
      const id = s.el.id;
      if (id === 'top' || id === 'contact') continue;
      if (id === 'bassetti') { blocks.push($('.arrival', s.el), ...$$('.role', s.el)); continue; }
      blocks.push(s.el);
    }
    const ranges = blocks.map((b) => {
      const r = b.getBoundingClientRect();
      return [r.top + sy0 - vh, r.top + sy0 + r.height, r.top + sy0 + r.height / 2 - vh / 2];
    });
    blocks.forEach((b, i) => {
      const [y0, y1, ym] = ranges[i];
      const skies = [];
      for (let k = 0; k <= 30; k++) {
        const t = timeAt(lerp(y0, y1, k / 30)), c = lut(t)[0];
        skies.push(c, litBy(c, t));
      }
      const v = tokensFor(skies, lut(timeAt(ym))[0]);
      for (const k in v) b.style.setProperty(k, v[k]);
    });
  }

  let lastSky = -1, lastPhase = '';
  function applyTime(t: number) {
    ctx.curT = t;
    const i = clamp(Math.round(t) - LUT0, 0, LUT.length - 1);
    if (i !== lastSky) { lastSky = i; sky.style.backgroundColor = LUT[i][1]; }
    // the sun crosses the sky between 06:00 and 19:30
    const u = (t - 360) / 810;
    const sx = (0.06 + clamp(u, -0.1, 1.1) * 0.88) * ctx.vw, sy = (0.96 - Math.sin(Math.PI * clamp(u)) * 0.74) * ctx.vh;
    const st = tr(sx, sy);
    T(sunW, st); T(sunO, st);
    O(sunW, at(WARM, t)); O(sunO, at(ORANGE, t));
    const ph = t < 1050 ? 'day' : t < 1160 ? 'gold' : 'night';
    if (ph !== lastPhase) {
      lastPhase = ph;
      bar.dataset['phase'] = ph;
      if (meta) meta.setAttribute('content', ph === 'night' ? '#100e0b' : ph === 'gold' ? '#f3e2c8' : '#f6f0e6');
    }
  }

  /* ------------------------------------------------------------------ scrolling */
  const scrollPos = () => (ctx.lenis ? ctx.lenis.scroll : window.scrollY);
  // in-page links glide through the page (the set pieces play on the way); links into the résumé view are its own
  const inPage = (a: HTMLAnchorElement) => !!a.hash && a.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '');
  for (const a of $$<HTMLAnchorElement>('a[href*="#"]:not(.resume-open):not(.rv-close)')) {
    if (a.closest('#resume') || !inPage(a)) continue;
    on(a, 'click', (e) => {
      const t = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!t) return;
      e.preventDefault();
      const top = a.hash === '#top';
      if (ctx.lenis) ctx.lenis.scrollTo(t, { offset: top ? 0 : -70, duration: 2.2 });
      else t.scrollIntoView();
      history.replaceState(history.state, '', location.pathname + (top ? '' : a.hash));
    });
  }

  /* ------------------------------------------------------------------ display lines revealed once */
  // (from the scroll position and positions measured at build time, so nothing is observed while scrolling)
  let heads = $$('.h-stop, .h-role').filter((h) => !h.closest('.cc-facts')).map((n) => ({ n, top: 0 }));
  const measureHeads = () => { for (const h of heads) h.top = ctx.docTop(h.n); };
  const revealHeads = (y: number) => {
    if (heads.length) heads = heads.filter((h) => {
      if (y + ctx.vh * 0.82 > h.top) { h.n.classList.add('in'); return false; }
      return true;
    });
  };

  /* ------------------------------------------------------------------ the bar */
  const textOf = (n: HTMLElement) => {
    if (!n.firstChild || n.firstChild.nodeType !== 3 || n.childNodes.length > 1) n.textContent = n.textContent;
    return n.firstChild as Text;
  };
  // the clock is an odometer: a column of digits per place, moved with transforms (the bar is never repainted for it)
  const mk = (n: number) => `<span class="odo"><i>${Array.from({ length: n }, (_, k) => k).join('<br>')}</i></span>`;
  clockEl.innerHTML = mk(3) + mk(10) + '<span class="cs">:</span>' + mk(6) + mk(10);
  const clockCols = $$('.odo > i', clockEl);
  const setClock = (m: number) => {
    m = Math.round(m);
    const h = Math.floor(m / 60) % 24, mi = m % 60;
    [Math.floor(h / 10), h % 10, Math.floor(mi / 10), mi % 10].forEach((d, k) => T(clockCols[k], `translate3d(0,${-1.2 * d}em,0)`));
  };

  /* ------------------------------------------------------------------ main loop */
  const mods: Scene[] = [];
  let swirlReady = false;
  let lastClock = '', lastStop = -1, lastPlace = '', lastY = -1, dirty = true;
  function update(y: number) {
    const t = motion ? timeAt(y) : 340;
    if (motion) applyTime(t);
    else ctx.curT = t;
    for (const mm of mods) {
      const live = y > mm.y0 && y < mm.y1;
      // a set piece that has scrolled out of range is hidden (its layers are dropped), so the next one has the GPU to itself
      if (live || mm.live) {
        mm.update(live ? y : clamp(y, mm.y0, mm.y1));
        mm.live = live;
        if (mm.sec) C(mm.sec, 'gone', !live);
      }
    }
    revealHeads(y);
    const ck = fmt(t);
    if (ck !== lastClock) { lastClock = ck; setClock(t); }
    const ai = anchorAt(y), a = anchors[ai], b = anchors[ai + 1] || a;
    const stop = y >= b.y ? b.stop : a.stop;
    if (stop !== lastStop) { textOf(stopEl).nodeValue = String(stop).padStart(2, '0'); lastStop = stop; }
    const mid = y + ctx.vh * 0.5;
    let seg = segs[0];
    for (const s of segs) if (s.top <= mid) seg = s;
    if (seg.place !== lastPlace) { textOf(placeEl).nodeValue = seg.place; lastPlace = seg.place; }
    C(bar, 'top', y < 8);
  }
  function buildAll() {
    ctx.vw = root.clientWidth;
    ctx.vh = innerHeight;
    ctx.sy0 = window.scrollY;
    measureTime();
    for (const mm of mods) mm.build();
    measureTime();
    measureHeads();
    paintBlocks();
    if (swirlReady) for (const mm of mods) mm.afterBuild?.();
    for (const mm of mods) { mm.update(clamp(scrollPos(), mm.y0, mm.y1)); mm.live = false; }
    dirty = true;
  }
  function loop(time: number) {
    if (stopped) return;
    ctx.lenis?.raf(time);
    const y = scrollPos();
    if (y !== lastY || dirty) { lastY = y; dirty = false; update(y); }
    raf = requestAnimationFrame(loop);
  }
  let rz = 0, lastW = ctx.vw, lastH = 0;
  const sized = () => innerHeight > 0 && root.clientWidth > 0;
  const rebuild = () => {
    clearTimeout(rz);
    rz = window.setTimeout(() => { if (sized()) buildAll(); }, 150);
  };
  const ro = new ResizeObserver(() => {
    const h = root.scrollHeight;
    if (Math.abs(h - lastH) > 2) { lastH = h; rebuild(); }
  });

  // images below the fold are lazy; once the page is up, fetch them one by one, in page order, while the browser is
  // idle, so a fast scroll never waits for one (no decode() here: decoding them all at once costs frames)
  function warmImages() {
    const list = $$<HTMLImageElement>('img[loading="lazy"]').filter((im) => !(im.complete && im.naturalWidth));
    const idle = (f: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(() => f()) : setTimeout(f, 120));
    const next = () => {
      if (stopped) return;
      const im = list.shift();
      if (!im) return;
      if (im.complete && im.naturalWidth) { idle(next); return; }
      im.addEventListener('load', () => idle(next), { once: true });
      im.addEventListener('error', () => idle(next), { once: true });
      im.loading = 'eager';
    };
    timers.push(window.setTimeout(() => idle(next), 1500));
  }

  let resume: ResumeController | null = null;
  let started = false;
  async function start() {
    if (started || stopped) return;
    // a tab loaded in the background can report a 0×0 viewport, and every set piece is sized from it: wait for a real one
    if (!sized()) {
      const retry = () => { removeEventListener('resize', retry); document.removeEventListener('visibilitychange', retry); void start(); };
      addEventListener('resize', retry);
      document.addEventListener('visibilitychange', retry);
      offs.push(() => { removeEventListener('resize', retry); document.removeEventListener('visibilitychange', retry); });
      return;
    }
    started = true;
    if (motion) {
      const { default: L } = await import('lenis');
      if (stopped) return;
      ctx.lenis = new L({ lerp: 0.15, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });
      // measuring scripts drive the page through it (work/tools/perf.mjs, record.mjs)
      (window as unknown as { lenis: Lenis }).lenis = ctx.lenis;
      ctx.lenis.on('scroll', () => { dirty = true; });
    } else on(window, 'scroll', () => { dirty = true; }, { passive: true });
    // the scenes, in page order
    entries.sort((a, b) => (a.host.compareDocumentPosition(b.host) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    ctx.vw = root.clientWidth;
    ctx.vh = innerHeight;
    for (const e of entries) {
      const made = e.make(ctx);
      if (made) mods.push(...(Array.isArray(made) ? made : [made]));
    }
    swirlReady = true;
    resume = resumeController(root, reduce, () => ctx.lenis);
    buildAll();
    update(scrollPos());
    requestAnimationFrame(() => $('.hero-title')?.classList.add('in'));
    lastH = root.scrollHeight;
    ro.observe($('main'));
    on(window, 'resize', () => {
      if (root.clientWidth !== lastW || Math.abs(innerHeight - ctx.vh) > 120) { lastW = root.clientWidth; rebuild(); }
    });
    resume?.fromUrl();
    warmImages();
    root.classList.add('day-on');
    if (motion) raf = requestAnimationFrame(loop);
    else on(window, 'scroll', () => update(window.scrollY), { passive: true });
  }

  // build once fonts and images have their sizes (layout depends on both)
  const loaded = new Promise<void>((r) => (document.readyState === 'complete' ? r() : addEventListener('load', () => r(), { once: true })));
  void Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), loaded]).then(() => start());
  timers.push(window.setTimeout(() => void start(), 4000));

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    clearTimeout(rz);
    timers.forEach((t) => clearTimeout(t));
    ro.disconnect();
    offs.forEach((f) => f());
    resume?.destroy();
    for (const mm of mods) mm.destroy?.();
    ctx.lenis?.destroy();
    root.classList.remove('day-on', 'rv-open');
  };
}

