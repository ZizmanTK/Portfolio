/**
 * Small helpers shared by the scroll engine and its scenes. Browser only.
 *
 * Every per-frame write goes through T / O / C / D, which skip the write when the value has not changed (the last value
 * is cached on the node), so a frame only touches what actually moves.
 */

export const NS = 'http://www.w3.org/2000/svg';

/** A node with the engine's write cache. */
export type FxNode = Element & {
  __t?: string;
  __o?: number;
  __d?: number;
  __c?: Record<string, boolean>;
  style: CSSStyleDeclaration;
};

export const $ = <E extends Element = HTMLElement>(s: string, r: ParentNode = document): E => r.querySelector(s) as E;
export const $$ = <E extends Element = HTMLElement>(s: string, r: ParentNode = document): E[] => Array.from(r.querySelectorAll<E>(s));

export const clamp = (v: number, a = 0, b = 1): number => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const seg01 = (v: number, a: number, b: number): number => clamp((v - a) / (b - a));
export const smooth = (a: number, b: number, v: number): number => {
  const t = seg01(v, a, b);
  return t * t * (3 - 2 * t);
};
export const ease = (t: number): number => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number): number => clamp(t) * clamp(t);
export const easeIO = (t: number): number => {
  t = clamp(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const f1 = (n: number): number => Math.round(n * 10) / 10;

/** An SVG element with attributes, appended to `parent` if given. */
export function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, parent?: Element): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(n);
  return n;
}

export function div(cls: string, parent?: Node | null, tag: keyof HTMLElementTagNameMap = 'div'): HTMLElement {
  const d = document.createElement(tag);
  d.className = cls;
  if (parent) parent.appendChild(d);
  return d;
}

export const T = (n: Element, v: string): void => {
  const x = n as FxNode;
  if (x.__t !== v) {
    x.__t = v;
    x.style.transform = v;
  }
};
export const O = (n: Element, v: number): void => {
  const x = n as FxNode;
  v = Math.round(v * 1000) / 1000;
  if (x.__o !== v) {
    x.__o = v;
    x.style.opacity = String(v);
  }
};
export const C = (n: Element, cls: string, on: boolean): void => {
  const x = n as FxNode;
  const c = x.__c || (x.__c = {});
  if (c[cls] !== on) {
    c[cls] = on;
    n.classList.toggle(cls, on);
  }
};
export const D = (n: Element, v: number): void => {
  const x = n as FxNode;
  v = f1(v);
  if (x.__d !== v) {
    x.__d = v;
    x.style.strokeDashoffset = String(v);
  }
};
/** Forget the cached transform / opacity, so the next write goes through. */
export const reset = (n: Element, what: 't' | 'o' | 'd'): void => {
  const x = n as FxNode;
  if (what === 't') x.__t = undefined;
  else if (what === 'o') x.__o = undefined;
  else x.__d = undefined;
};

/** A second SVG over an existing one, for the parts that move (its own layer, so the static drawing is not repainted). */
export function twin(svg: SVGSVGElement, cls: string): SVGSVGElement {
  const host = svg as SVGSVGElement & { __twin?: SVGSVGElement };
  let t = host.__twin;
  if (!t) {
    t = document.createElementNS(NS, 'svg');
    t.setAttribute('class', cls);
    t.setAttribute('aria-hidden', 'true');
    svg.after(t);
    host.__twin = t;
  }
  t.textContent = '';
  return t;
}

export const tr = (x: number, y: number, s = 1): string =>
  `translate3d(${f1(x)}px,${f1(y)}px,0)` + (s !== 1 ? ` scale(${Math.round(s * 10000) / 10000})` : '');

/** A curve that leaves (x0,y0) downwards and arrives at (x1,y1) downwards. */
export const vcurve = (x0: number, y0: number, x1: number, y1: number, k = 0.5): string =>
  `C${f1(x0)},${f1(lerp(y0, y1, k))} ${f1(x1)},${f1(lerp(y1, y0, k))} ${f1(x1)},${f1(y1)}`;
