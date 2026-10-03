import data from '../../content/site.json';

export type Lang = 'en' | 'fr';
export type L = Record<Lang, string>;

export interface Social { id: 'github' | 'linkedin' | 'itch'; label: string; handle: string; url: string }
export interface Fact { icon: 'briefcase' | 'pin' | 'cap' | 'globe'; label: L; value: L }

export interface Experience {
  role: L; type: L; company: string; logo: string; url: string; location: L;
  start: string; end: string | null; highlights: L[]; stack: string[];
}

export interface Education {
  degree: L; school: string; logo: string | null; url: string | null; city: string; country: L;
  start: string; end: string;
}

export type ProjectCategory = 'web' | 'ai' | 'games';

export interface Project {
  slug: string; name: string; year: string | null; context: L; category: ProjectCategory;
  image: string; tagline: L; description: L; stack: string[];
  links: { play?: string; github?: string; site?: string };
}

export interface SkillGroup { group: L; items: string[] }

export interface Site {
  profile: {
    name: string; firstName: string; lastName: string; role: L; company: string; summary: L; mission: L;
    location: L; email: string; site: string; portrait: string; avatar: string; resume: L;
  };
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
}

export const SITE = data as unknown as Site;

/** "Built **TxBot** with…" → [{ text: 'Built ', bold: false }, { text: 'TxBot', bold: true }, …] */
export function richText(text: string): { text: string; bold: boolean }[] {
  return text.split('**').map((part, i) => ({ text: part, bold: i % 2 === 1 })).filter((s) => s.text);
}

/** Whole months between two "YYYY-MM" dates, end inclusive (Sep→Sep = 13 months, like LinkedIn). */
export function monthsBetween(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}
