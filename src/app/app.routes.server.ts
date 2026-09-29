import { RenderMode, type ServerRoute } from '@angular/ssr';

/** Both language versions are prerendered to static HTML at build time. */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'fr', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
