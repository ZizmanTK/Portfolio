import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  { path: '', component: HomePage, data: { lang: 'en' } },
  { path: 'fr', component: HomePage, data: { lang: 'fr' } },
  { path: '**', redirectTo: '' },
];
