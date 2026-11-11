import { Routes } from '@angular/router';
import { WorkPage } from './work/work.page';

/** The work page is the front door; the story (the walk through a day) loads its own code only when it is opened. */
const story = () => import('./day/day.page').then((m) => m.DayPage);

export const routes: Routes = [
  { path: '', component: WorkPage, data: { lang: 'en' } },
  { path: 'fr', component: WorkPage, data: { lang: 'fr' } },
  { path: 'story', loadComponent: story, data: { lang: 'en' } },
  { path: 'fr/story', loadComponent: story, data: { lang: 'fr' } },
  { path: '**', redirectTo: '' },
];
