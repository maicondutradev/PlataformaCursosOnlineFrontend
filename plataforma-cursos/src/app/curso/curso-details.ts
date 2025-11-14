import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { CursoService } from '../services/curso';
import { Curso } from '../models/curso';
import { Aula } from '../models/aula';
import { YoutubeThumbnailPipe } from '../pipes/youtube-thumbnail-pipe';

@Component({
  selector: 'app-curso-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
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

  aulaEmEdicao: Aula | null = null;

  aulaForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(1)]],
    descricaoCurta: [''],
    videoUrl: ['', [Validators.required, Validators.minLength(5)]]
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

    if (this.aulaEmEdicao) {
      const aulaAtualizada: Aula = {
        ...this.aulaEmEdicao,
        ...this.aulaForm.value
      } as Aula;

      this.service.atualizarAula(aulaAtualizada.id!, aulaAtualizada).subscribe(aulaSalva => {
        const index = this.curso!.aulas!.findIndex(a => a.id === aulaSalva.id);
        if (index > -1) {
          this.curso!.aulas![index] = aulaSalva;
        }
        this.cancelarEdicao();
      });
    }
    else {
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

  editarAula(aula: Aula) {
    this.aulaEmEdicao = aula;
    this.aulaForm.patchValue({
      nome: aula.nome,
      descricaoCurta: aula.descricaoCurta,
      videoUrl: aula.videoUrl
    });

    document.querySelector('.aula-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  cancelarEdicao() {
    this.aulaEmEdicao = null;
    this.aulaForm.reset();
  }

  removerAula(id: number) {
    if (confirm('Tem certeza que deseja remover esta aula?')) {
      this.service.removerAula(id).subscribe(() => {
        this.curso!.aulas = this.curso!.aulas!.filter(a => a.id !== id);
      });
    }
  }
}
