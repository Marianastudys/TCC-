import {

  Component,

  OnInit,

  ChangeDetectorRef

} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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

}


  iniciarJogo(idJogo: number) {

    this.router.navigate(['/jogo', idJogo]);

  }

}