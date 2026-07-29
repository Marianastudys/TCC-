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

  iniciarJogo(idJogo: number) {

    this.router.navigate(['/jogo', idJogo]);

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

indiceSelecionado = 0;

focarBotao() {
  const lista = this.botoes.toArray();

  if (lista[this.indiceSelecionado]) {
    lista[this.indiceSelecionado].nativeElement.focus();
  }
}

@HostListener('document:keydown', ['$event'])
navegacao(event: KeyboardEvent) {

  const lista = this.botoes.toArray();

  switch (event.key) {

    case 'ArrowRight':
      event.preventDefault();

      this.indiceSelecionado =
        (this.indiceSelecionado + 1) % lista.length;

      this.focarBotao();
      break;

    case 'ArrowLeft':
      event.preventDefault();

      this.indiceSelecionado =
        (this.indiceSelecionado - 1 + lista.length) % lista.length;

      this.focarBotao();
      break;

    case 'Enter':
      event.preventDefault();

      lista[this.indiceSelecionado].nativeElement.click();
      break;
  }
}

}