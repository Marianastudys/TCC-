
import {
  Component,
  OnInit,
  AfterViewInit,
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
export class Home implements OnInit, AfterViewInit {

  jogosCitologia: any[] = [];
  jogosGenetica: any[] = [];
  jogosEcologia: any[] = [];

  temaSelecionado: number | null = null;

  // Controla a aparição de cada diálogo
  etapasVisiveis: boolean[] = [false, false, false, false];

  @ViewChildren('etapaHistoria')
  etapasHistoria!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('botaoTema')
  botoes!: QueryList<ElementRef<HTMLButtonElement>>;

  @ViewChildren('botaoDificuldade')
  botoesDificuldade!: QueryList<ElementRef<HTMLButtonElement>>;

  indiceSelecionado = 0;
  navegacaoPorTeclado = false;

  @HostListener('document:keydown')
  ativarModoTeclado() {
    this.navegacaoPorTeclado = true;
  }

  @HostListener('document:pointerdown')
  ativarModoMouse() {
    this.navegacaoPorTeclado = false;
  }
  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.buscarJogos();
  }

  ngAfterViewInit() {
    // Começa com todos os diálogos escondidos
    this.etapasVisiveis = [false, false, false, false];

    // Aguarda a página terminar de carregar
    setTimeout(() => {
      window.scrollTo(0, 0);
      this.revelarEtapas();
    }, 100);
  }

  // Busca os jogos cadastrados no banco de dados
  buscarJogos() {

    this.http.get<any[]>('http://localhost:3000/jogos/1')
      .subscribe(resultado => {
        this.jogosCitologia = resultado;
        this.cdr.detectChanges();
      });

    this.http.get<any[]>('http://localhost:3000/jogos/2')
      .subscribe(resultado => {
        this.jogosGenetica = resultado;
        this.cdr.detectChanges();
      });

    this.http.get<any[]>('http://localhost:3000/jogos/3')
      .subscribe(resultado => {
        this.jogosEcologia = resultado;
        this.cdr.detectChanges();
      });
  }

  // Revela os diálogos conforme a rolagem da página
  @HostListener('window:scroll')
  revelarEtapas() {
    if (!this.etapasHistoria) {
      return;
    }

    this.etapasHistoria.forEach((etapa, indice) => {
      const elemento = etapa.nativeElement;
      const posicao = elemento.getBoundingClientRect();

      // Mostra o diálogo quando ele entra na área visível
      if (
        posicao.top < window.innerHeight * 0.85 &&
        posicao.bottom > 0 &&
        !this.etapasVisiveis[indice]
      ) {
        this.etapasVisiveis[indice] = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Verifica a qual tema pertence o painel de dificuldade
  temaPertenceALista(lista: any[]): boolean {
    return this.temaSelecionado !== null &&
      lista.some(jogo => jogo.id === this.temaSelecionado);
  }

  // Leva a criança até a seção dos jogos
  escolherJogo() {
    document.getElementById('secao-jogos')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  selecionarTema(idJogo: number) {

    if (this.temaSelecionado === idJogo) {
      this.temaSelecionado = null;
      return;
    }

    this.temaSelecionado = idJogo;

    this.cdr.detectChanges();

    setTimeout(() => {
      const primeiroBotao = this.botoesDificuldade.first;

      if (primeiroBotao) {
        primeiroBotao.nativeElement.focus();
      }
    }, 0);
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

  // Alterna o contraste da página
  alternarTema() {

    const html = document.documentElement;
    const temaAtual = html.getAttribute('data-bs-theme');

    html.setAttribute(
      'data-bs-theme',
      temaAtual === 'dark' ? 'light' : 'dark'
    );
  }

  // Coloca o foco no botão de tema selecionado
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

    // Navegação entre os temas
    const indiceTema = temas.findIndex(
      botao => botao.nativeElement === elementoAtivo
    );

    if (indiceTema !== -1) {

      if (event.key === 'ArrowRight') {
        event.preventDefault();

        this.indiceSelecionado = (indiceTema + 1) % temas.length;
        temas[this.indiceSelecionado].nativeElement.focus();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();

        this.indiceSelecionado =
          (indiceTema - 1 + temas.length) % temas.length;

        temas[this.indiceSelecionado].nativeElement.focus();
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        temas[indiceTema].nativeElement.click();
        return;
      }
    }

    // Navegação entre as dificuldades
    const indiceDificuldade = dificuldades.findIndex(
      botao => botao.nativeElement === elementoAtivo
    );

    if (indiceDificuldade !== -1) {

      if (event.key === 'ArrowDown') {
        event.preventDefault();

        const novoIndice =
          (indiceDificuldade + 1) % dificuldades.length;

        dificuldades[novoIndice].nativeElement.focus();
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        const novoIndice =
          (indiceDificuldade - 1 + dificuldades.length) %
          dificuldades.length;

        dificuldades[novoIndice].nativeElement.focus();
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();

        if (this.temaSelecionado === null) {
          return;
        }

        if (indiceDificuldade === 0) {
          this.iniciarJogo(this.temaSelecionado, 'facil');
        } else if (indiceDificuldade === 1) {
          this.iniciarJogo(this.temaSelecionado, 'medio');
        } else if (indiceDificuldade === 2) {
          this.iniciarJogo(this.temaSelecionado, 'dificil');
        }

        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();

        this.temaSelecionado = null;

        setTimeout(() => {
          const tema = this.botoes.toArray()[this.indiceSelecionado];

          if (tema) {
            tema.nativeElement.focus();
          }
        }, 0);

        return;
      }
    }
  }
}
