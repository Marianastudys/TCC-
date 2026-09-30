import {

  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  ElementRef,
  HostListener

} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit {

  jogosCitologia: any[] = [];
  jogosGenetica: any[] = [];
  jogosEcologia: any[] = [];

  temaSelecionado: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buscarJogos();
  }

  buscarJogos() {

    this.http.get<any[]>('http://localhost:3000/jogos/1')
      .subscribe(resultado => {
        this.jogosCitologia = resultado;
        console.log('Citologia:', resultado);
        this.cdr.detectChanges();
      });

    this.http.get<any[]>('http://localhost:3000/jogos/2')
      .subscribe(resultado => {
        this.jogosGenetica = resultado;
        console.log('Genética:', resultado);
        this.cdr.detectChanges();
      });

    this.http.get<any[]>('http://localhost:3000/jogos/3')
      .subscribe(resultado => {
        this.jogosEcologia = resultado;
        console.log('Ecologia:', resultado);
        this.cdr.detectChanges();
      });

    setTimeout(() => this.focarBotao(), 100);
  }

selecionarTema(idJogo: number) {

  if (this.temaSelecionado === idJogo) {

    this.temaSelecionado = null;

    return;

  }

  this.temaSelecionado = idJogo;

  setTimeout(() => {

    const primeiroBotao =
      this.botoesDificuldade.first;

    if (primeiroBotao) {
      primeiroBotao.nativeElement.focus();
    }

  });

}

iniciarJogo(idJogo: number, dificuldade: string) {

  this.router.navigate(
    ['/jogo', idJogo],
    {
      queryParams: {
        dificuldade: dificuldade
      }
    }
  );

}

  alternarTema() {
  const html = document.documentElement;
  const temaAtual = html.getAttribute('data-bs-theme');

  html.setAttribute(
    'data-bs-theme',
    temaAtual === 'dark' ? 'light' : 'dark'
  );
}

@ViewChildren('botaoTema')
botoes!: QueryList<ElementRef<HTMLButtonElement>>;

@ViewChildren('botaoDificuldade')
botoesDificuldade!: QueryList<ElementRef<HTMLButtonElement>>;

indiceSelecionado = 0;

focarBotao() {
  const lista = this.botoes.toArray();

  if (lista[this.indiceSelecionado]) {
    lista[this.indiceSelecionado].nativeElement.focus();
  }
}

@HostListener('document:keydown', ['$event'])
navegacao(event: KeyboardEvent) {

  const temas = this.botoes.toArray();
  const dificuldades = this.botoesDificuldade.toArray();

  const elementoAtivo = document.activeElement;


  // ==========================================
  // VERIFICA SE O FOCO ESTÁ EM UM TEMA
  // ==========================================

  const indiceTema = temas.findIndex(
    botao => botao.nativeElement === elementoAtivo
  );


  if (indiceTema !== -1) {

    // Setas esquerda e direita entre os temas
    if (event.key === 'ArrowRight') {

      event.preventDefault();

      this.indiceSelecionado =
        (indiceTema + 1) % temas.length;

      temas[this.indiceSelecionado]
        .nativeElement
        .focus();

      return;
    }


    if (event.key === 'ArrowLeft') {

      event.preventDefault();

      this.indiceSelecionado =
        (indiceTema - 1 + temas.length) % temas.length;

      temas[this.indiceSelecionado]
        .nativeElement
        .focus();

      return;
    }


    // Enter abre as dificuldades
    if (event.key === 'Enter') {

      event.preventDefault();

      temas[indiceTema]
        .nativeElement
        .click();

      return;
    }

  }


  // ==========================================
  // VERIFICA SE O FOCO ESTÁ EM UMA DIFICULDADE
  // ==========================================

  const indiceDificuldade = dificuldades.findIndex(
    botao => botao.nativeElement === elementoAtivo
  );


  if (indiceDificuldade !== -1) {

    // Seta para baixo
    if (event.key === 'ArrowDown') {

      event.preventDefault();

      const novoIndice =
        (indiceDificuldade + 1) % dificuldades.length;

      dificuldades[novoIndice]
        .nativeElement
        .focus();

      return;
    }


    // Seta para cima
    if (event.key === 'ArrowUp') {

      event.preventDefault();

      const novoIndice =
        (indiceDificuldade - 1 + dificuldades.length)
        % dificuldades.length;

      dificuldades[novoIndice]
        .nativeElement
        .focus();

      return;
    }


    // Enter escolhe a dificuldade
    if (event.key === 'Enter') {

      event.preventDefault();

      if (this.temaSelecionado === null) {
        return;
      }


      if (indiceDificuldade === 0) {

        this.iniciarJogo(
          this.temaSelecionado,
          'facil'
        );

      }

      else if (indiceDificuldade === 1) {

        this.iniciarJogo(
          this.temaSelecionado,
          'medio'
        );

      }

      else if (indiceDificuldade === 2) {

        this.iniciarJogo(
          this.temaSelecionado,
          'dificil'
        );

      }

      return;
    }


    // Esc fecha o painel
    if (event.key === 'Escape') {

      event.preventDefault();

      this.temaSelecionado = null;

      setTimeout(() => {

        const tema =
          this.botoes.toArray()[this.indiceSelecionado];

        if (tema) {
          tema.nativeElement.focus();
        }

      });

      return;
    }

  }

}
}