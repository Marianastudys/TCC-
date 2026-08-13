import {

  Component,

  OnInit,

  ChangeDetectorRef,

  ViewChildren,

  QueryList,

  ElementRef,

  ViewChild,

  HostListener

} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-jogo',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './jogo.html',
  styleUrls: ['./jogo.css']
})

export class Jogo implements OnInit {

  cartas: any[] = [];
  indicesErrados: number[] = [];

  primeiraCarta: any = null;

  segundaCarta: any = null;

  acertos = 0;
  erros = 0;
  score = 0;

  bloquearJogo = false;

  indiceAtual = 0;

  jogoFinalizado = false;

  somCarta = new Audio('sounds/flip.mp3');
  somAcerto = new Audio('sounds/correct.mp3');

  somErro = new Audio('sounds/error.mp3');

  @ViewChildren('cartaBotao')

  cartasBotoes!: QueryList<ElementRef>;

  constructor(

    private route: ActivatedRoute,

    private http: HttpClient,

    private cdr: ChangeDetectorRef,

    private router: Router

  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const idJogo = Number(params.get('id'));

      console.log('ID DO JOGO:', idJogo);

      this.acertos = 0;

      this.erros = 0;

      this.score = 0;

      this.primeiraCarta = null;

      this.segundaCarta = null;

      this.bloquearJogo = false;

      this.jogoFinalizado = false;

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

          virada: false,

          acertada: false

        }));

        this.embaralharCartas();

        this.cdr.detectChanges();

  setTimeout(() => {
  const primeiraCarta = this.cartasBotoes.first;

  if (primeiraCarta) {
    primeiraCarta.nativeElement.focus();
  }
});

      });

  }

  embaralharCartas() {

    this.cartas.sort(() => Math.random() - 0.5);

  }

  virarCarta(carta: any) {

    if (

      carta.virada ||

      this.bloquearJogo ||

      this.jogoFinalizado

    ) {

      return;

    }

    carta.virada = true;

    this.somCarta.currentTime = 0;

    this.somCarta.play();

    this.falarTexto(carta.conteudo);

    if (!this.primeiraCarta) {

      this.primeiraCarta = carta;

    }

    else if (!this.segundaCarta) {

      this.segundaCarta = carta;

      this.bloquearJogo = true;

      const tempoLeitura =

        carta.conteudo.length * 90;

      setTimeout(() => {

        this.verificarPar();

      }, tempoLeitura);

    }

  }

  verificarPar() {

    if (

      this.primeiraCarta.id ===

      this.segundaCarta.id

    ) {

      this.acertos++;
      this.score += 100;

      this.somAcerto.currentTime = 0;

      this.somAcerto.play();

      this.primeiraCarta.acertada = true;

      this.segundaCarta.acertada = true;

      this.cdr.detectChanges();

      this.somAcerto.onended = () => {
        this.falarTexto(`Par correto. Você ganhou 100 pontos e 
          agora tem ${this.score} pontos.`);
};

      if (

        this.acertos ===

        this.cartas.length / 2

      ) {
        this.jogoFinalizado = true;
  
  setTimeout(() => {
  this.botaoReiniciar?.nativeElement.focus();
});

        this.cdr.detectChanges();

        this.somAcerto.onended = () => {

    this.falarTexto(

      'Parabéns! Você concluiu o jogo.'

    );

  };

      }

      this.resetarJogada();

    }

    else {

      this.erros++;
      this.score = Math.max(0, this.score - 20);

      this.somErro.currentTime = 0;

      this.somErro.play();

      this.indicesErrados = [

        this.cartas.indexOf(this.primeiraCarta),

        this.cartas.indexOf(this.segundaCarta)

      ];

      this.cdr.detectChanges();

      this.somErro.onended = () => {
        this.falarTexto(`Par incorreto. Você perdeu 20 pontos e 
          agora tem ${this.score} pontos.`);
};

      setTimeout(() => {

        this.primeiraCarta.virada = false;

        this.segundaCarta.virada = false;

        this.indicesErrados = [];

        this.resetarJogada();

      }, 1000);

    }

  }

  resetarJogada() {

    this.primeiraCarta = null;

    this.segundaCarta = null;

    this.bloquearJogo = false;

  }



  reiniciarJogo() {

    this.jogoFinalizado = false;

    this.acertos = 0;

    this.erros = 0;

    this.score = 0;

    this.primeiraCarta = null;

    this.segundaCarta = null;

    this.bloquearJogo = false;

    this.cartas.forEach(carta => {

      carta.virada = false;

    });

    this.embaralharCartas();

  }
  sairJogo() {

    speechSynthesis.cancel();

    this.router.navigate(['/home']);

  }

  falarTexto(texto: string) {

    speechSynthesis.cancel();

    const audio = new SpeechSynthesisUtterance(texto);

    audio.lang = 'pt-BR';

    audio.rate = 0.9;

    audio.volume = 1;

    speechSynthesis.speak(audio);

  }

moverFoco(event: KeyboardEvent, indice: number) {

  let novoIndice = indice;

  const total = this.cartas.length;

  const colunas = window.innerWidth <= 480

    ? 1

    : window.innerWidth <= 768

    ? 2

    : 4;

  if (event.key === 'ArrowRight') {

    novoIndice++;

  }

  else if (event.key === 'ArrowLeft') {

    novoIndice--;

  }

  else if (event.key === 'ArrowDown') {

    novoIndice += colunas;

  }

  else if (event.key === 'ArrowUp') {

    novoIndice -= colunas;

  }

  else {

    return;

  }

  event.preventDefault();

  if (

    novoIndice < 0 ||

    novoIndice >= total

  ) {

    return;

  }

  const elemento =

    this.cartasBotoes.toArray()[novoIndice];

  if (elemento) {

    elemento.nativeElement.focus();

  }

}

alternarTema() {
  const html = document.documentElement;
  const temaAtual = html.getAttribute('data-bs-theme');

  html.setAttribute(
    'data-bs-theme',
    temaAtual === 'dark' ? 'light' : 'dark'
  );
}

@ViewChild('botaoReiniciar')
botaoReiniciar!: ElementRef<HTMLButtonElement>;

@ViewChild('botaoSair')
botaoSair!: ElementRef<HTMLButtonElement>;

@HostListener('document:keydown', ['$event'])
navegarFim(event: KeyboardEvent) {

  if (!this.jogoFinalizado) {
    return;
  }

  const ativo = document.activeElement;

  if (
    event.key === 'ArrowRight' &&
    ativo === this.botaoReiniciar.nativeElement
  ) {

    event.preventDefault();
    this.botaoSair.nativeElement.focus();

  }

  else if (
    event.key === 'ArrowLeft' &&
    ativo === this.botaoSair.nativeElement
  ) {

    event.preventDefault();
    this.botaoReiniciar.nativeElement.focus();

  }

  else if (
    event.key === 'ArrowUp'
  ) {

    event.preventDefault();

    const ultimaCarta =
      this.cartasBotoes.last;

    ultimaCarta.nativeElement.focus();
  }

}

}