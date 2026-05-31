import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  usuarios: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {

    this.api.getUsuarios().subscribe((dados: any) => {

      console.log(dados);

      this.usuarios = dados;

    });

  }
}