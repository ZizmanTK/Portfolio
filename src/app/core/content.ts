import data from '../../content/site.json';

export type Lang = 'en' | 'fr';
export type L = Record<Lang, string>;

export interface Social { id: 'github' | 'linkedin' | 'itch'; label: string; handle: string; url: string }

export interface Experience {
  role: L; type: L; company: string; logo: string; url: string; location: string;
  start: string; end: string | null; summary: L; highlights: L[]; stack: string[];
}

export interface Education {
  degree: L; school: string; logo: string; url: string; location: string;
  start: string; end: string; details: L;
}

export type ProjectCategory = 'web' | 'ai' | 'games';

export interface Project {
  slug: string; name: string; year: string; context: L; category: ProjectCategory;
  image: string; featured: boolean; tagline: L; description: L; highlights: L[]; stack: string[];
  links: { play?: string; github?: string; site?: string };
}

export interface SkillGroup { group: L; items: { name: string; icon: string | null }[] }
export interface Interest { name: L; image: string; text: L }

export interface Site {
  profile: {
    name: string; firstName: string; lastName: string; role: L; headline: L; summary: L; location: L;
    email: string; site: string; current: L; portrait: { day: string; night: string }; avatar: string; resume: L;
  };
  socials: Social[];
  about: { paragraphs: L[]; facts: { label: L; value: L }[]; stats: { value: string; label: L }[] };
  languages: { name: L; level: L }[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  interests: Interest[];
}

export const SITE = data as unknown as Site;
