import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-saiba-mais',
  standalone: true,
  imports: [],
  templateUrl: './saiba-mais.html',
  styleUrl: './saiba-mais.css'
})
export class SaibaMais {

  @Input() titulo = '';
  @Input() texto = '';

  @Output() continuar = new EventEmitter<void>();

  fechar(): void {
    this.continuar.emit();
  }
}