import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CursoService } from '../services/curso';
import { Curso } from '../models/curso';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule, MatIconModule, MatCardModule],
  templateUrl: './curso-list.html',
  styleUrl: './curso-list.css'
})
export class CursoList implements OnInit {
  private service = inject(CursoService);
  private router = inject(Router);

  cursos: Curso[] = [];

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(dados => this.cursos = dados);
  }

  editar(id: number) {
    this.router.navigate(['/editar', id]);
  }

  remover(id: number) {
    if(confirm('Deseja remover este curso?')) {
      this.service.remover(id).subscribe(() => this.carregar());
    }
  }
}
