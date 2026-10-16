import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-instrucoes-jogo',
  standalone: true,
  imports: [],
  templateUrl: './instrucoes-jogo.html',
  styleUrl: './instrucoes-jogo.css'
})
export class InstrucoesJogo {

  @Output() iniciar = new EventEmitter<void>();

  comecarJogo(): void {
    this.iniciar.emit();
  }

}