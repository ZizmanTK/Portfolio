import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE, type Lang } from './content';
import { pagePath, type Page } from './i18n';

const BASE = SITE.profile.site; // https://zizmantk.github.io/Portfolio/

const LOCALE: Record<Lang, string> = { en: 'en_US', fr: 'fr_FR' };

const COPY: Record<Page, Record<Lang, { title: string; description: string }>> = {
  work: {
    en: {
      title: 'Abdoul Aziz Maazou — AI Engineer',
      description:
        'AI engineer in Grenoble, open to work. I built most of the TEEXMA chatbot (LLM agent, RAG), in production at several BASSETTI customers, and co-developed Analysis & Prediction. Projects, experience, skills and CV.',
    },
    fr: {
      title: 'Abdoul Aziz Maazou — Ingénieur en Intelligence Artificielle',
      description:
        'Ingénieur IA à Grenoble, ouvert aux opportunités. J’ai développé l’essentiel du Chatbot TEEXMA (agent LLM, RAG), en production chez plusieurs clients de BASSETTI, et co-développé Analyse et prédiction. Projets, expérience, compétences et CV.',
    },
  },
  story: {
    en: {
      title: 'A walk through a day — Abdoul Aziz Maazou',
      description:
        'The long version of Abdoul Aziz Maazou’s path, told as one day: Niamey at first light, Rabat, Strasbourg, ArcelorMittal in Uckange, and BASSETTI in Grenoble tonight.',
    },
    fr: {
      title: 'Mon parcours en une journée — Abdoul Aziz Maazou',
      description:
        'Le parcours d’Abdoul Aziz Maazou raconté comme une journée : Niamey aux premières lueurs, Rabat, Strasbourg, ArcelorMittal à Uckange, puis BASSETTI à Grenoble ce soir.',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  apply(lang: Lang, page: Page): void {
    const c = COPY[page][lang];
    const url = BASE + pagePath(lang, page);
    this.doc.documentElement.lang = lang;
    this.title.setTitle(c.title);
    this.meta.updateTag({ name: 'description', content: c.description });
    this.meta.updateTag({ property: 'og:title', content: c.title });
    this.meta.updateTag({ property: 'og:description', content: c.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: LOCALE[lang] });
    this.meta.updateTag({ name: 'twitter:title', content: c.title });
    this.meta.updateTag({ name: 'twitter:description', content: c.description });

    this.link('canonical', url);
    this.link('alternate', BASE + pagePath('en', page), 'en');
    this.link('alternate', BASE + pagePath('fr', page), 'fr');
    this.link('alternate', BASE + pagePath('en', page), 'x-default');
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
