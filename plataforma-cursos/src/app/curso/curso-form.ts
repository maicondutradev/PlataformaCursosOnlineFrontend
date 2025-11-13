import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CursoService } from '../services/curso';
import { Curso } from '../models/curso';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.css'
})
export class CursoForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CursoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['', Validators.required],
    preco: [0, [Validators.required, Validators.min(0.01)]]
  });

  cursoId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cursoId = +id;
      this.service.buscarPorId(this.cursoId).subscribe(curso => {
        this.form.patchValue(curso);
      });
    }
  }

  salvar() {
    if (this.form.invalid) return;

    const curso = this.form.value as Curso;

    if (this.cursoId) {
      this.service.atualizar(this.cursoId, curso).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.service.adicionar(curso).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
