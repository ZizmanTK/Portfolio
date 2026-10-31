import data from '../../content/site.json';

export type Lang = 'en' | 'fr';
export type L = Record<Lang, string>;

export interface Social { id: 'github' | 'linkedin' | 'itch'; label: string; handle: string; url: string }
export interface Fact { icon: 'briefcase' | 'pin' | 'cap' | 'globe'; label: L; value: L }

export interface CardPoint extends L { case?: string }

export interface Experience {
  role: L; type: L; company: string; logo: string; url: string; location: L;
  start: string; end: string | null; highlights: L[]; stack: string[];
  /** Short version of the highlights (the résumé view; the CV uses `highlights`). */
  card: CardPoint[]; cardStack: string[]; title?: L;
  /** Short label of the role ("AI Engineer · permanent"). */
  short: L;
}

export interface Education {
  degree: L; school: string; logo: string | null; url: string | null; city: string; country: L;
  start: string; end: string; award?: L;
}

export type ProjectCategory = 'web' | 'ai' | 'games';

export interface Project {
  slug: string; name: string; year: string | null; context: L; category: ProjectCategory;
  image: string; tagline: L; description: L; stack: string[];
  links: { play?: string; github?: string; site?: string; demo?: string };
  featured?: boolean; kicker?: L; when?: string; problem?: L; builtWith?: L; status?: L;
  visual?: 'pipeline'; hue?: [string, string];
  /** Muted, looping gameplay clip. */
  video?: string;
}

export interface RouteStop { city: string; country: L; what: L; now?: boolean; years: string }

export interface SkillGroup { group: L; items: string[] }

/** A word of the first-light swirl: a name (the same in both languages) or a translated phrase. */
export type Word = string | L;

/** The walk through a day: the page's framing (hours, places, sentences, captions, descriptions of the drawings). */
export interface Day {
  places: Record<'top' | 'niamey' | 'knight' | 'rabat' | 'signal' | 'strasbourg' | 'uckange' | 'climb' | 'bassetti' | 'afterHours' | 'now', L>;
  hero: { day: [L, L]; start: L; hint: L };
  niamey: { time: string; sentence: L; caption: L; alt: L };
  knight: { time: string; title: L; note: [L, L]; from: L; to: L };
  rabat: { time: string; sentence: L; caption: L; alt: L };
  signal: { time: string; title: L; note: [L, L]; beats: [L, L, L, L] };
  strasbourg: { time: string; sentence: L; body: L; caption: L; alt: L };
  uckange: { time: string; sentence: L; alt: L; coil: L; note: L; steps: [L, L, L, L, L]; realCaption: L; realAlt: L };
  climb: { time: string; title: L; note: L; steps: [L, L, L]; alt: L };
  bassetti: { times: [string, string, string]; pano: L; summit: L; arrival: L; desk: L; remind: L; night: L; foundation: L };
  roll: { title: L; alt: L; note: L };
  after: { time: string; title: L; body: L; zktris: L; rollPower: L };
  contact: { time: string; note: L; wave: L };
  resume: { eyebrow: L; hours: string[]; cards: L[]; projects: Record<'txbot' | 'remind' | 'coilcheck', L> };
  swirl: Word[];
}

export interface Site {
  profile: {
    name: string; firstName: string; lastName: string; role: L; company: string; summary: L; mission: L;
    location: L; email: string; phone?: string; site: string; portrait: string; portraitCutout: string; avatar: string; resume: L;
  };
  hero: {
    greetings: string[]; hello: L; role: L; focus: L[]; status: L; experience: L;
    tagline: L; location: L; lede: L; languages: L;
  };
  statement: L;
  outside: L[];
  aboutShort: L[];
  route: RouteStop[];
  contact: { title: L; text: L };
  facts: Fact[];
  keySkills: string[];
  socials: Social[];
  about: { paragraphs: L[] };
  languages: { name: L; level: L }[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  badges: L[];
  interests: (L & { emoji: string })[];
  day: Day;
}

export const SITE = data as unknown as Site;

/** CSS class slug of a skill icon (same rule as scripts/build-icon-styles.mjs). */
export const skillSlug = (n: string): string =>
  ({ 'C#': 'csharp', 'C++': 'cpp', '.NET': 'dotnet', C: 'c' })[n] || n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** "Built **TxBot** with…" → [{ text: 'Built ', bold: false }, { text: 'TxBot', bold: true }, …] */
export function richText(text: string): { text: string; bold: boolean }[] {
  return text.split('**').map((part, i) => ({ text: part, bold: i % 2 === 1 })).filter((s) => s.text);
}

/** Typographic apostrophes for display ("Lycée d'Excellence" → "Lycée d’Excellence"). */
export const typo = (s: string): string => s.replace(/'/g, '’');

/** **bold** markers removed. */
export const plain = (s: string): string => s.replace(/\*\*/g, '');

/**
 * A display heading in at most two lines, each revealed on its own (`.ln`): short headings stay on one line, longer
 * ones break at the word that balances the two lines best.
 */
export function headingLines(s: string): string[] {
  const w = s.split(' ');
  if (s.length <= 16 || w.length < 2) return [s];
  let best = 1, bestLen = Infinity;
  for (let i = 1; i < w.length; i++) {
    const len = Math.max(w.slice(0, i).join(' ').length, w.slice(i).join(' ').length);
    if (len <= bestLen) { bestLen = len; best = i; } // on a tie, the longer first line
  }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}

/** "Engineering degree (Master's level) — Images, Signals & Data Science" → the degree and its detail. */
export function degreeParts(degree: string): { title: string; detail: string } {
  const [head, rest = ''] = degree.split(' — ');
  const paren = head.match(/\s*\(([^)]*)\)\s*$/);
  const title = paren ? head.slice(0, paren.index) : head;
  const detail = rest ? rest + (paren ? ` (${paren[1]})` : '') : paren ? paren[1] : '';
  return { title, detail };
}

/** Whole months between two "YYYY-MM" dates, end inclusive (Sep→Sep = 13 months, like LinkedIn). */
export function monthsBetween(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}
