import { Routes } from '@angular/router';

import { Home } from './pages/home/home';

import { Jogo } from './pages/jogo/jogo';

import { Login } from './pages/login/login';

import { Cadastro } from './pages/cadastro/cadastro';

import { UsuarioComponent } from './pages/usuario/usuario';

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
    path: 'cadastro',
    component: Cadastro
  },

  {
    path: 'jogo/:id',
    component: Jogo
  },
  {
    path: 'usuario',
    component: UsuarioComponent
  }

];