import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';

  mensagem = '';
  mostrarSenha = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  cadastrar() {

    this.mensagem = '';

    if (
      !this.nome ||
      !this.email ||
      !this.senha ||
      !this.confirmarSenha
    ) {

      this.mensagem = 'Preencha todos os campos.';

      return;
    }

    if (this.senha !== this.confirmarSenha) {

      this.mensagem = 'As senhas não coincidem.';

      return;
    }

    this.http.post<any>(
      'http://localhost:3000/usuario/cadastro',
      {
        nome: this.nome,
        email: this.email,
        senha: this.senha
      }
    ).subscribe({

      next: () => {

        alert('Conta criada com sucesso!');

        this.router.navigate(['/login']);

      },

      error: (erro) => {

        console.log(erro);

        this.mensagem = 'Não foi possível criar a conta.';

      }

    });

  }

}