import { Routes } from '@angular/router';

import { Home } from './pages/home/home';

import { Jogo } from './pages/jogo/jogo';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: Home
  },

  {
    path: 'jogo/:id',
    component: Jogo
  }

];