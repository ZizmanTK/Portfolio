import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // in-page links and the scroll position are the scroll engine's (src/app/day/engine), not the router's
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};
