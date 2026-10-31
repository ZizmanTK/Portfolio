/**
 * The colour of the day: the sky through the hours (minutes since midnight → colour, one entry per minute computed once),
 * the two pre-painted suns, and the tokens each block of the page gets for the skies it can be seen against.
 */
import { clamp, lerp } from './dom';

type RGB = [number, number, number];

const hex2rgb = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function toLab(rgb: RGB): RGB {
  const [r, g, b] = rgb.map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function fromLab([L, a, b]: RGB): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => clamp(gam(clamp(v)))) as RGB;
}
const rgb2hex = (c: RGB) => '#' + c.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const relLum = (rgb: RGB) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const contrast = (a: RGB, b: RGB) => {
  const la = relLum(a), lb = relLum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const mixLab = (a: RGB, b: RGB, t: number): RGB => {
  const A = toLab(a), B = toLab(b);
  return fromLab([lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]);
};
/** The colour between bg and ink that reaches the target contrast (or the ink itself if it cannot). */
function towards(bg: RGB, ink: RGB, target: number): RGB {
  if (contrast(ink, bg) <= target) return ink;
  let lo = 0, hi = 1;
  for (let i = 0; i < 14; i++) {
    const m = (lo + hi) / 2;
    if (contrast(mixLab(bg, ink, m), bg) >= target) hi = m;
    else lo = m;
  }
  return mixLab(bg, ink, hi);
}

// The sky through the day. The passage through mid-tones (where neither dark nor light ink reaches 4.5:1) happens
// between 19:00 and 19:20, which the page maps to the dusk interlude: no text there.
const SKY: [number, RGB][] = (
  [[330, '#e8dccb'], [352, '#efe2cf'], [380, '#f3eadc'], [430, '#f4eee4'], [500, '#f5f1ea'], [600, '#f6f4ef'], [720, '#f6f6f3'],
    [840, '#f5f1e8'], [930, '#f3eadb'], [1000, '#f1e2cb'], [1060, '#efd6b4'], [1100, '#e8c094'], [1125, '#e0a273'], [1140, '#c37a62'],
    [1160, '#7c4d56'], [1185, '#3e2b33'], [1230, '#1f1818'], [1290, '#16120e'], [1400, '#100e0b']] as [number, string][]
).map(([t, h]) => [t, toLab(hex2rgb(h))]);

function pwl<V>(P: [number, V][], t: number): [V, V, number] {
  let i = 0;
  while (i < P.length - 2 && P[i + 1][0] < t) i++;
  const [a, x] = P[i], [b, y] = P[i + 1];
  return [x, y, clamp((t - a) / (b - a))];
}
function skyAt(t: number): RGB {
  const [a, b, k] = pwl(SKY, t);
  return fromLab([lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]);
}

/** One sky colour per minute, computed once (the frame loop only looks it up). */
export const LUT0 = 330;
export const LUT: [RGB, string][] = [];
for (let t = LUT0; t <= 1400; t++) {
  const c = skyAt(t);
  LUT.push([c, rgb2hex(c)]);
}
export const lut = (t: number) => LUT[clamp(Math.round(t) - LUT0, 0, LUT.length - 1)];

// the two pre-painted suns: a warm white one through the day, an orange one at dawn and dusk (opacity by time)
export const WARM: [number, number][] = [[330, 0], [365, 0.35], [480, 0.7], [720, 0.85], [960, 0.7], [1080, 0.4], [1150, 0], [1400, 0]];
export const ORANGE: [number, number][] = [[330, 0.65], [400, 0.45], [520, 0.1], [600, 0], [960, 0], [1060, 0.35], [1110, 0.6], [1160, 0.45], [1220, 0], [1400, 0]];
export const at = (P: [number, number][], t: number): number => {
  const [x, y, k] = pwl(P, t);
  return lerp(x, y, k);
};
/** The sky where a sun's glow is strongest (text must read there too). */
export const litBy = (bg: RGB, t: number): RGB => {
  const w = at(WARM, t) * 0.62, o = at(ORANGE, t) * 0.55;
  const c = bg.map((v, j) => v * (1 - w) + [1, 0.957, 0.871][j] * w);
  return c.map((v, j) => v * (1 - o) + [1, 0.588, 0.314][j] * o) as RGB;
};

export const BASE = {
  day: { ink: '#17140f', gold: '#6a4506', thread: '#9c6a12', ok: '#1f7a43', line: '23,20,15', btnBg: '#17140f', btnInk: '#f6f2ea', plate: '#f7f5f0', crown: '#a87512' },
  night: { ink: '#f4f2ee', gold: '#fdd78c', thread: '#fbb915', ok: '#62cd7e', line: '244,242,238', btnBg: '#fbb915', btnInk: '#1d1307', plate: '#2a2620', crown: '#fbb915' },
};

/** Tokens for a block seen against several skies: each colour reaches its contrast target against the worst of them. */
export function tokensFor(skies: RGB[], mid: RGB): Record<string, string> {
  const dI = hex2rgb(BASE.day.ink), nI = hex2rgb(BASE.night.ink);
  let dW = 1e9, nW = 1e9, dBg = mid, nBg = mid;
  for (const c of skies) {
    const cd = contrast(dI, c), cn = contrast(nI, c);
    if (cd < dW) { dW = cd; dBg = c; }
    if (cn < nW) { nW = cn; nBg = c; }
  }
  const day = dW >= nW, B = day ? BASE.day : BASE.night, w = day ? dBg : nBg, ink = day ? dI : nI;
  return {
    '--bg': rgb2hex(mid), '--ink': B.ink, '--ink-2': rgb2hex(towards(w, ink, 8.5)), '--muted': rgb2hex(towards(w, ink, 5.6)),
    '--gold-ink': rgb2hex(towards(w, hex2rgb(B.gold), 5.6)), '--thread': rgb2hex(towards(w, hex2rgb(B.thread), 3.2)),
    '--line': `rgba(${B.line},.16)`, '--line-2': `rgba(${B.line},.34)`, '--track': `rgba(${B.line},.3)`,
    '--ok': B.ok, '--btn-bg': B.btnBg, '--btn-ink': B.btnInk, '--plate': B.plate, '--crown': B.crown,
  };
}

export type { RGB };
