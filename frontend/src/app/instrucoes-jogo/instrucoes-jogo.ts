import {
  Component,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-instrucoes-jogo',
  standalone: true,
  imports: [],
  templateUrl: './instrucoes-jogo.html',
  styleUrl: './instrucoes-jogo.css'
})
export class InstrucoesJogo implements AfterViewInit {

  @Output() iniciar = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();
  @Input() idJogo: number = 0;

  @ViewChild('cardInstrucoes')
  cardInstrucoes!: ElementRef<HTMLElement>;

  @ViewChild('botaoComecar')
  botaoComecar!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cardInstrucoes.nativeElement.focus();
    }, 0);
  }

  @HostListener('document:keydown', ['$event'])
  navegarInstrucoes(event: KeyboardEvent): void {

    const card = this.cardInstrucoes?.nativeElement;
    const botao = this.botaoComecar?.nativeElement;

    if (!card || !botao || !card.isConnected) {
      return;
    }

    const ativo = document.activeElement;

    // Controla as teclas somente enquanto o foco
    // estiver no card ou no botão Começar jogo.
    if (ativo !== card && ativo !== botao) {
      return;
    }

    // Rolar as instruções para baixo.
    if (event.key === 'ArrowDown') {

      event.preventDefault();

      if (
        card.scrollTop + card.clientHeight >=
        card.scrollHeight - 5
      ) {
        botao.focus();
        return;
      }

      card.scrollBy({
        top: 60,
        behavior: 'auto'
      });

      // Verifica se chegou ao final da rolagem.
      setTimeout(() => {

        if (
          card.isConnected &&
          card.scrollTop + card.clientHeight >=
          card.scrollHeight - 5
        ) {
          botao.focus();
        }

      }, 0);

      return;
    }

    // Rolar as instruções para cima.
    if (event.key === 'ArrowUp') {

      event.preventDefault();

      if (ativo === botao) {
        this.cardInstrucoes.nativeElement.focus();
        return;
      }

      card.scrollBy({
        top: -60,
        behavior: 'auto'
      });

      return;
    }

    // Enter no card move o foco para o botão.
    if (event.key === 'Enter' && ativo === card) {

      event.preventDefault();
      botao.focus();

      return;
    }

    // Enter no botão inicia o jogo.
    if (event.key === 'Enter' && ativo === botao) {

      event.preventDefault();
      event.stopPropagation();

      this.comecarJogo();
    }
  }

  comecarJogo(): void {
    this.iniciar.emit();
  }

voltarInicio(): void {
  this.voltar.emit();
}

}
