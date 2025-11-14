import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso';
import { Aula } from '../models/aula';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private http = inject(HttpClient);
  private readonly API = 'https://localhost:7000/api/Curso';
  private readonly ApiAula = 'https://localhost:7000/api/Aula';

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.API);
  }

  buscarPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.API}/${id}`);
  }

  adicionar(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.API, curso);
  }

  atualizar(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.API}/${id}`, curso);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  adicionarAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.ApiAula, aula);
  }
}
