import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Partida {
  id: number;
  tema: string;
  score: number;
  acertos: number;
  erros: number;
  data_partida: string;
}

export interface Usuario {
  id: number;
  nome: string;

  scoreAcumulado: number;
  maiorScore: number;
  partidasJogadas: number;
  totalAcertos: number;
  totalErros: number;
  percentualAcertos: number;
  mediaScore: number;

  partidas: Partida[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient) {}

  // BUSCAR DADOS DO USUÁRIO
  obterUsuario(id: number): Observable<Usuario> {

    return this.http.get<Usuario>(
      `${this.apiUrl}/${id}`
    );

  }

  // ALTERAR DADOS DO USUÁRIO
  atualizarUsuario(
    id: number,
    nome: string,
    senha: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      {
        nome,
        senha
      }
    );

  }

}