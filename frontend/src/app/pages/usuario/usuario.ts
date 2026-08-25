import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import {
  UsuarioService,
  Partida
} from './usuario-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent, 
    DatePipe
  ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuarioComponent implements OnInit {


  // DADOS DO USUÁRIO
  idUsuario: number = 0;
  nomeUsuario: string = 'Usuário';
  novaSenha: string = '';
  confirmarSenha: string = '';

  // ESTATÍSTICAS
  scoreAcumulado: number = 0;
  maiorScore: number = 0;
  partidasJogadas: number = 0;
  totalAcertos: number = 0;
  totalErros: number = 0;
  percentualAcertosAPI: number = 0;
  mediaScoreAPI: number = 0;

  // HISTÓRICO
  partidas: Partida[] = [];

  constructor(
  private usuarioService: UsuarioService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

 ngOnInit(): void {

   this.carregarUsuario();
 }

  carregarUsuario(): void {

    console.log(
      'LOCAL STORAGE:',
      localStorage.getItem('usuarioLogado')
);

  const usuarioSalvo =
    localStorage.getItem('usuarioLogado');

  if (!usuarioSalvo) {

    this.router.navigate(['/login']);

    return;

  }

  const usuario =
    JSON.parse(usuarioSalvo);

  this.idUsuario = usuario.id;

  this.usuarioService
    .obterUsuario(this.idUsuario)
    .subscribe({

      next: (dados) => {

  console.log('DADOS DO PERFIL:', dados);

  this.nomeUsuario =
    dados.nome;

  this.scoreAcumulado =
    dados.scoreAcumulado;

  this.maiorScore =
    dados.maiorScore;

  this.partidasJogadas =
    dados.partidasJogadas;

  this.totalAcertos =
    dados.totalAcertos;

  this.totalErros =
    dados.totalErros;

  this.percentualAcertosAPI =
    dados.percentualAcertos;

  this.mediaScoreAPI =
    dados.mediaScore;

  this.partidas =
    dados.partidas;

  this.cdr.detectChanges();

},
      error: (erro) => {

        console.error(
          'Erro ao carregar perfil:',
          erro
        );
      }
    });
}

  get percentualAcertos(): number {

    const totalTentativas =
      this.totalAcertos +
      this.totalErros;


    if (totalTentativas === 0) {

      return 0;

    }

    return Math.round(

      (
        this.totalAcertos /
        totalTentativas
      ) * 100

    );

  }

  // MÉDIA DE SCORE
  get mediaScore(): number {

    if (this.partidasJogadas === 0) {

      return 0;

    }

    return Math.round(

      this.scoreAcumulado /
      this.partidasJogadas

    );

  }

  // SALVAR ALTERAÇÕES
  salvarAlteracoes(): void {

    if (
      this.novaSenha !== '' &&
      this.novaSenha !== this.confirmarSenha
    ) {

      alert('As senhas não são iguais.');

      return;

    }

    this.usuarioService
      .atualizarUsuario(
        this.idUsuario,
        this.nomeUsuario,
        this.novaSenha
      )
      .subscribe({

        next: () => {

          const usuarioSalvo =
            localStorage.getItem('usuarioLogado');


          if (usuarioSalvo) {

            const usuario =
              JSON.parse(usuarioSalvo);


            usuario.nome =
              this.nomeUsuario;


            localStorage.setItem(
              'usuarioLogado',
              JSON.stringify(usuario)
            );

          }

          this.novaSenha = '';

          this.confirmarSenha = '';

          alert(
            'Alterações salvas com sucesso!'
          );

        },

        error: (erro) => {

          console.error(
            'Erro ao atualizar usuário:',
            erro
          );


          alert(
            'Não foi possível salvar as alterações.'
          );

        }

      });

  }

  // LIMPAR CAMPOS DE SENHA
  limparSenha(): void {

    this.novaSenha = '';

    this.confirmarSenha = '';

  }

}