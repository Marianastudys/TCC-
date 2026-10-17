
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  AfterViewInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-saiba-mais',
  standalone: true,
  imports: [],
  templateUrl: './saiba-mais.html',
  styleUrl: './saiba-mais.css'
})
export class SaibaMais implements AfterViewInit {

  @Input() titulo = '';
  @Input() texto = '';

  @Output() continuar = new EventEmitter<void>();

  @ViewChild('botaoContinuar')
  botaoContinuar!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.botaoContinuar?.nativeElement.focus();
    });
  }

  fechar(): void {
    this.continuar.emit();
  }
}
