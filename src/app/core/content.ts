import data from '../../content/site.json';

export type Lang = 'en' | 'fr';
export type L = Record<Lang, string>;

export interface Social { id: 'github' | 'linkedin' | 'itch'; label: string; handle: string; url: string }
export interface Detection { label: string; score: string }

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
  image: string; featured: boolean; tagline: L; description: L; highlights: L[]; stack: string[];
  links: { play?: string; github?: string; site?: string };
}

export interface SkillGroup { key: string; group: L; items: string[] }
export interface Interest extends Detection { name: L; image: string; text: L }

export interface Site {
  profile: {
    name: string; firstName: string; lastName: string; role: L; company: string; focus: L; headline: L; mission: L;
    summary: L; location: L; coords: string; email: string; site: string;
    portrait: { day: string; night: string }; avatar: string; resume: L;
  };
  detections: Detection[];
  socials: Social[];
  about: { paragraphs: L[]; stats: { value: string; label: L }[] };
  languages: { code: string; name: L; level: L }[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  badges: L[];
  interests: Interest[];
}

export const SITE = data as unknown as Site;

/** A stable short "commit hash" for timeline entries, derived from their content. */
export function shortHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}
