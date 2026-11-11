import { RenderMode, type ServerRoute } from '@angular/ssr';

/** Both pages are prerendered to static HTML at build time, in both languages. */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'fr', renderMode: RenderMode.Prerender },
  { path: 'story', renderMode: RenderMode.Prerender },
  { path: 'fr/story', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
