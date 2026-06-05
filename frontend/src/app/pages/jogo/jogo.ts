import {

  Component,

  OnInit,

  ChangeDetectorRef

} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jogo.html',
  styleUrls: ['./jogo.css']
})

export class Jogo implements OnInit {

  cartas: any[] = [];

  primeiraCarta: any = null;

  segundaCarta: any = null;

  acertos = 0;

  erros = 0;

  bloquearJogo = false;

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private http: HttpClient,

    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const idJogo = Number(params.get('id'));

      console.log('ID DO JOGO:', idJogo);

      this.acertos = 0;

      this.erros = 0;

      this.primeiraCarta = null;

      this.segundaCarta = null;

      this.bloquearJogo = false;

      this.cartas = [];

      this.buscarCartas(idJogo);

    });

  }

  buscarCartas(idJogo: number) {

    this.http.get<any[]>(`http://localhost:3000/cartas/jogo/${idJogo}`)

      .subscribe((resultado) => {

        console.log('CARTAS:', resultado);

        this.cartas = resultado.map(carta => ({

          id: carta.par_id,

          conteudo: carta.conteudo,

          virada: false

        }));

        this.embaralharCartas();

        this.cdr.detectChanges();

      });

  }

  embaralharCartas() {

    this.cartas.sort(() => Math.random() - 0.5);

  }

  virarCarta(carta: any) {

    if (

      carta.virada ||

      this.bloquearJogo

    ) {

      return;

    }

    carta.virada = true;

    this.falarTexto(carta.conteudo);

    const tempoLeitura = carta.conteudo.length * 120;

    if (!this.primeiraCarta) {

      this.primeiraCarta = carta;

    }

    else if (!this.segundaCarta) {

      this.segundaCarta = carta;

      this.bloquearJogo = true;

      setTimeout(() => {

        this.verificarPar();

      }, tempoLeitura);

    }

  }

  verificarPar() {

    if (this.primeiraCarta.id === this.segundaCarta.id) {

      this.acertos++;

      setTimeout(() => {

        this.falarTexto('Par correto');

      }, 300);

      this.resetarJogada();

    }

    else {

      this.erros++;

      this.bloquearJogo = true;

      setTimeout(() => {

        this.falarTexto('Par incorreto');

      }, 300);

      setTimeout(() => {

        this.primeiraCarta.virada = false;

        this.segundaCarta.virada = false;

        this.resetarJogada();

      }, 1500);

    }

  }

  resetarJogada() {

    this.primeiraCarta = null;

    this.segundaCarta = null;

    this.bloquearJogo = false;

  }

  falarTexto(texto: string) {

    speechSynthesis.cancel();

    const audio = new SpeechSynthesisUtterance(texto);

    audio.lang = 'pt-BR';

    audio.rate = 0.9;

    audio.volume = 1;

    speechSynthesis.speak(audio);

  }
sairJogo() {
  const confirmar = confirm('Tem certeza que deseja sair do jogo?');

  if (confirmar) {
    this.router.navigate(['/home']);
  }
}

  
}