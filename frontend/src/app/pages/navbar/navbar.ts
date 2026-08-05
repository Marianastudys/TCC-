import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  @Input() mostrarBotaoEntrar: boolean = true;

  tamanhoFonte = 100;
  usuarioLogado = false;
  nomeUsuario = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const fonteSalva = localStorage.getItem('tamanhoFonte');

    this.usuarioLogado =
    localStorage.getItem('usuarioLogado') !== null;

   const usuarioSalvo = localStorage.getItem('usuarioLogado');

  if (usuarioSalvo) {

    const usuario = JSON.parse(usuarioSalvo);

    console.log(usuario);

    this.nomeUsuario = usuario.nome;

  }
    if (fonteSalva) {
      this.tamanhoFonte = Number(fonteSalva);
    }

    this.atualizarFonte();
  }
  

  atualizarFonte() {
    document.documentElement.style.fontSize = this.tamanhoFonte + '%';
    localStorage.setItem('tamanhoFonte', this.tamanhoFonte.toString());
  }

  aumentarFonte() {
    if (this.tamanhoFonte < 200) {
      this.tamanhoFonte += 10;
      this.atualizarFonte();
    }
  }

  diminuirFonte() {
    if (this.tamanhoFonte > 70) {
      this.tamanhoFonte -= 10;
      this.atualizarFonte();
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
    irHome() {
    this.router.navigate(['/home']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

  logout() {

  localStorage.removeItem('usuarioLogado');

  this.router.navigate(['/login']);

}



@HostListener('document:keydown', ['$event'])
atalhos(event: KeyboardEvent) {

  switch (event.key.toLowerCase()) {

    case 'a': //aumenta fonte
      event.preventDefault();
      this.aumentarFonte();
      break;

    case 'z': //diminui a fonte 
      event.preventDefault();
      this.diminuirFonte();
      break;

    case 't': //altera o tema 
      event.preventDefault();
      this.alternarTema();
      break;

    case 'h': //volta para home 
      event.preventDefault();
      this.router.navigate(['/']);
      break;
  }

}
}

