import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CursoService } from '../services/curso';
import { Curso } from '../models/curso';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Aula } from '../models/aula';
import { YoutubeThumbnailPipe } from '../pipes/youtube-thumbnail-pipe';


@Component({
  selector: 'app-curso-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    YoutubeThumbnailPipe
  ],
  templateUrl: './curso-details.html',
  styleUrl: './curso-details.css'
})
export class CursoDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(CursoService);
  private fb = inject(FormBuilder);

  curso: Curso | null = null;
  loading = true;

  aulaForm = this.fb.group({
    nome: ['', Validators.required],
    descricaoCurta: [''],
    videoUrl: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.service.buscarPorId(+id).subscribe(dados => {
        this.curso = dados;
        this.loading = false;
      });
    }
  }
  salvarAula() {
    if (this.aulaForm.invalid || !this.curso) return;

    const novaAula: Aula = {
      ...this.aulaForm.value,
      cursoId: this.curso.id!
    } as Aula;

    this.service.adicionarAula(novaAula).subscribe(aulaCriada => {
      this.curso?.aulas?.push(aulaCriada);
      this.aulaForm.reset();
    });
  }
}
