import { Routes } from '@angular/router';

import { Home } from './pages/home/home';

import { Jogo } from './pages/jogo/jogo';

import { Login } from './pages/login/login';

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
    path: 'login',
    component: Login
  },

  {
    path: 'jogo/:id',
    component: Jogo
  }

];