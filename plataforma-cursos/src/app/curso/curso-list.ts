import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CursoService } from '../services/curso';
import { Curso } from '../models/curso';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './curso-list.html',
  styleUrl: './curso-list.css'
})
export class CursoList implements OnInit {
  private service = inject(CursoService);
  private router = inject(Router);

  cursos: Curso[] = [];

  cursosFiltrados!: Observable<Curso[]>;

  searchControl = new FormControl('');

  ngOnInit() {
    this.carregarCursos();
  }

  carregarCursos() {
    this.service.listar().subscribe(dados => {
      this.cursos = dados;

      this.cursosFiltrados = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(termo => this.filtrarCursos(termo))
      );
    });
  }

  private filtrarCursos(termo: string | null): Curso[] {
    const termoBusca = (termo || '').toLowerCase();

    if (!termoBusca) {
      return this.cursos;
    }

    return this.cursos.filter(curso =>
      curso.nome.toLowerCase().includes(termoBusca)
    );
  }

  editar(id: number) {
    this.router.navigate(['/editar', id]);
  }

  remover(id: number) {
    if (confirm('Deseja remover este curso?')) {
      this.service.remover(id).subscribe(() => {
        this.carregarCursos();
      });
    }
  }
}
