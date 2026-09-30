import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE, type Lang } from './content';

const BASE = SITE.profile.site; // https://zizmantk.github.io/Portfolio/

const COPY: Record<Lang, { title: string; description: string; locale: string }> = {
  en: {
    title: 'Abdoul Aziz Maazou — AI Engineer',
    description:
      'AI engineer at BASSETTI France in Grenoble: agentic AI, RAG, computer vision and full-stack development. Experience, projects, skills and resume.',
    locale: 'en_US',
  },
  fr: {
    title: 'Abdoul Aziz Maazou — Ingénieur en Intelligence Artificielle',
    description:
      'Ingénieur en IA chez BASSETTI France à Grenoble : IA agentique, RAG, vision par ordinateur et développement full-stack. Expérience, projets, compétences et CV.',
    locale: 'fr_FR',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  apply(lang: Lang): void {
    const c = COPY[lang];
    const url = lang === 'en' ? BASE : `${BASE}fr/`;
    this.doc.documentElement.lang = lang;
    this.title.setTitle(c.title);
    this.meta.updateTag({ name: 'description', content: c.description });
    this.meta.updateTag({ property: 'og:title', content: c.title });
    this.meta.updateTag({ property: 'og:description', content: c.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: c.locale });
    this.meta.updateTag({ name: 'twitter:title', content: c.title });
    this.meta.updateTag({ name: 'twitter:description', content: c.description });

    this.link('canonical', url);
    this.link('alternate', BASE, 'en');
    this.link('alternate', `${BASE}fr/`, 'fr');
    this.link('alternate', BASE, 'x-default');
  }

  private link(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let el = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) el.setAttribute('hreflang', hreflang);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }
}
