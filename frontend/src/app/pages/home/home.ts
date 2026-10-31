import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
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
import { SomService } from '../../services/som.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit, OnDestroy {

  jogosCitologia: any[] = [];
  jogosGenetica: any[] = [];
  jogosEcologia: any[] = [];

  temaSelecionado: number | null = null;

  // Controla a aparição de cada diálogo (são 8 diálogos)
  etapasVisiveis: boolean[] = [false, false, false, false, false, false, false, false];

  // Índice do balão que está sendo lido em voz alta (null = nenhum)
  dialogoFalando: number | null = null;

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
    if (!this.navegacaoPorTeclado) {
      this.navegacaoPorTeclado = true;
      this.cdr.detectChanges();
    }
  }

  @HostListener('document:pointerdown')
  ativarModoMouse() {
    if (this.navegacaoPorTeclado) {
      this.navegacaoPorTeclado = false;
      this.cdr.detectChanges();
    }
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private som: SomService
  ) { }

  ngOnInit() {
    this.buscarJogos();
    this.som.ativar();
  }

  ngAfterViewInit() {
    // Começa com todos os diálogos escondidos
    this.etapasVisiveis = [false, false, false, false, false, false, false, false];

    // Aguarda a página terminar de carregar
    setTimeout(() => {
      window.scrollTo(0, 0);
      this.revelarEtapas();
    }, 100);
  }

  ngOnDestroy() {
    // Para a voz e os sons ao sair da página
    this.pararLeitura();
    this.som.desativar();
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

  // =========================
  // LEITURA POR VOZ
  // =========================

  // Lê em voz alta o nome do personagem e a fala do balão clicado
  ouvirDialogo(indice: number, evento: Event) {

    if (!('speechSynthesis' in window)) {
      return; // navegador sem suporte
    }

    // Clicar de novo no mesmo balão para a leitura
    if (this.dialogoFalando === indice) {
      this.pararLeitura();
      return;
    }

    this.pararLeitura();

    // Pega o nome e o texto direto do balão clicado
    const balao = (evento.currentTarget as HTMLElement).closest('.dialogo');
    const nome = balao?.querySelector('.nome-personagem')?.textContent?.trim();
    const texto = balao?.querySelector('p')?.textContent?.replace(/\s+/g, ' ').trim();

    if (!texto) {
      return;
    }

    const fala = new SpeechSynthesisUtterance(`${nome} diz: ${texto}`);
    fala.lang = 'pt-BR';
    fala.rate = 0.9; // um pouco mais devagar

    const terminou = () => {
      // Só limpa se ainda for este balão (evita conflito ao trocar de balão)
      if (this.dialogoFalando === indice) {
        this.dialogoFalando = null;
        this.cdr.detectChanges();
      }
    };

    fala.onend = terminou;
    fala.onerror = terminou;

    this.dialogoFalando = indice;
    window.speechSynthesis.speak(fala);
  }

  pararLeitura() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.dialogoFalando = null;
  }

  // =========================
  // HISTÓRIA E NAVEGAÇÃO
  // =========================

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

  // Se o foco chegar num diálogo escondido, revela ele
  @HostListener('document:focusin', ['$event'])
  revelarAoFocar(event: FocusEvent) {
    const alvo = event.target as HTMLElement;

    this.etapasHistoria?.forEach((etapa, indice) => {
      if (etapa.nativeElement.contains(alvo) && !this.etapasVisiveis[indice]) {
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

  // Leva a criança até a seção dos jogos (só rola a página, não mexe no foco)
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

  // =========================
  // NAVEGAÇÃO POR TECLADO
  // =========================

  // Foca o elemento e garante que ele fique visível na tela
  private focar(el: HTMLElement | null | undefined) {
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center' });
  }

  // Botões que ficam um embaixo do outro na página, na ordem do documento
  private obterBotoesVerticais(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(
        '.botao-aventura, .botao-ouvir, .botao-escolher'
      )
    );
  }

  // Todos os botões navegáveis por seta, na ordem em que aparecem na página
  private obterBotoesNavegaveis(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(
        '.botao-aventura, .botao-ouvir, .botao-escolher, ' +
        '.btnTop-celular, .btnTop-genetica, .btnTop-ecologia'
      )
    );
  }

  // Quando nenhum botão está focado, ↓ foca o primeiro botão a partir do
  // topo da tela e ↑ foca o último botão até o fim da tela.
  // Se não houver botão nessa direção, a seta rola a página normalmente.
  private focarPrimeiroBotaoNaDirecao(event: KeyboardEvent, temas: HTMLElement[]): void {
    const botoes = this.obterBotoesNavegaveis();
    let alvo: HTMLElement | undefined;

    if (event.key === 'ArrowDown') {
      alvo = botoes.find(b => b.getBoundingClientRect().top >= 0);
    } else {
      alvo = [...botoes].reverse().find(
        b => b.getBoundingClientRect().bottom <= window.innerHeight
      );
    }

    if (!alvo) return;

    event.preventDefault();

    const indiceTema = temas.indexOf(alvo);
    if (indiceTema !== -1) {
      this.indiceSelecionado = indiceTema;
    }

    this.focar(alvo);
  }

  @HostListener('document:keydown', ['$event'])
  navegacao(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const ativo = document.activeElement as HTMLElement | null;
    const temas: HTMLElement[] = this.botoes.toArray().map(b => b.nativeElement);

    // Nenhum elemento focado: as setas ↑/↓ passam a focar os botões,
    // sem precisar apertar Tab antes
    const semFoco =
      !ativo || ativo === document.body || ativo === document.documentElement;

    if (semFoco) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        this.focarPrimeiroBotaoNaDirecao(event, temas);
      }
      return;
    }

    // ===== 1) Botões de tema =====
    const indiceTema = temas.indexOf(ativo as HTMLButtonElement);

    if (indiceTema !== -1) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.indiceSelecionado = (indiceTema + 1) % temas.length;
        this.focar(temas[this.indiceSelecionado]);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.indiceSelecionado = (indiceTema - 1 + temas.length) % temas.length;
        this.focar(temas[this.indiceSelecionado]);
        return;
      }

      if (event.key === 'ArrowDown') {
        // Se o painel de dificuldade deste tema estiver aberto, desce até ele
        const primeira = ativo
          .closest('.tema-coluna')
          ?.querySelector<HTMLElement>('.botao-dificuldade');

        if (primeira) {
          event.preventDefault();
          this.focar(primeira);
        }
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focar(document.querySelector<HTMLElement>('.botao-escolher'));
        return;
      }

      return; // Enter e Espaço já funcionam nativamente no <button>
    }

    // ===== 2) Botões de dificuldade =====
    const dificuldades = this.botoesDificuldade.toArray().map(b => b.nativeElement);
    const indiceDificuldade = dificuldades.indexOf(ativo as HTMLButtonElement);

    if (indiceDificuldade !== -1) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focar(dificuldades[(indiceDificuldade + 1) % dificuldades.length]);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        // Na primeira dificuldade (Fácil), ↑ volta para o botão do tema
        // e mantém o painel aberto
        if (indiceDificuldade === 0) {
          const temaDoPainel = ativo
            .closest('.tema-coluna')
            ?.querySelector<HTMLElement>(
              '.btnTop-celular, .btnTop-genetica, .btnTop-ecologia'
            );

          if (temaDoPainel) {
            const indice = temas.indexOf(temaDoPainel);
            if (indice !== -1) {
              this.indiceSelecionado = indice;
            }
            this.focar(temaDoPainel);
          }
          return;
        }

        this.focar(dificuldades[indiceDificuldade - 1]);
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        this.temaSelecionado = null;
        this.cdr.detectChanges();
        this.focar(temas[this.indiceSelecionado]);
        return;
      }

      return;
    }

    // ===== 3) Botões da apresentação / história =====
    const lista = this.obterBotoesVerticais();
    const i = lista.indexOf(ativo);
    if (i === -1) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (i < lista.length - 1) {
        this.focar(lista[i + 1]);
      } else {
        // Último botão ("Escolher jogo") → vai para o primeiro tema
        this.indiceSelecionado = 0;
        this.focar(temas[0]);
      }
      return;
    }

    if (event.key === 'ArrowUp' && i > 0) {
      event.preventDefault();
      this.focar(lista[i - 1]);
    }
  }
}