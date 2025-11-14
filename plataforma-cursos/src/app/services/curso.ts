import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso';
import { Aula } from '../models/aula';
import { Modulo } from '../models/modulo';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private http = inject(HttpClient);
  private readonly ApiBase = 'https://localhost:7000/api';
  private readonly ApiCurso = `${this.ApiBase}/Curso`;
  private readonly ApiAula = `${this.ApiBase}/Aula`;
  private readonly ApiModulo = `${this.ApiBase}/Modulo`;

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.ApiCurso);
  }
  buscarPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.ApiCurso}/${id}`);
  }
  adicionar(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.ApiCurso, curso);
  }
  atualizar(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.ApiCurso}/${id}`, curso);
  }
  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ApiCurso}/${id}`);
  }

  adicionarModulo(modulo: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(this.ApiModulo, modulo);
  }

  adicionarAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.ApiAula, aula);
  }
  atualizarAula(id: number, aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.ApiAula}/${id}`, aula);
  }
  removerAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ApiAula}/${id}`);
  }
}
