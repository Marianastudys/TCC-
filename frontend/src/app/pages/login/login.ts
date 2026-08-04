import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  nome = '';
  senha = '';
  mensagem = '';
  mostrarSenha = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    this.http.post<any>('http://localhost:3000/usuario/login', {

      nome: this.nome,

      senha: this.senha

    }).subscribe({

      next: (usuario) => {

        this.router.navigate(['/home']);

      },

      error: () => {

        this.mensagem = 'Nome ou senha inválidos.';

      }

    });

  }

}