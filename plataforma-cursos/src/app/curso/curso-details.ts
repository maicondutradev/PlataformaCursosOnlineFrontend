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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { Modulo } from '../models/modulo';

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
    YoutubeThumbnailPipe,
    MatExpansionModule,
    MatSelectModule
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

  moduloForm = this.fb.group({
    nome: ['', Validators.required]
  });

  aulaForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(1)]],
    descricaoCurta: [''],
    videoUrl: ['', [Validators.required, Validators.minLength(5)]],
    moduloId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarCurso(+id);
    }
  }

  carregarCurso(id: number) {
    this.service.buscarPorId(id).subscribe(dados => {
      this.curso = dados;
      this.loading = false;
    });
  }

  salvarModulo() {
    if (this.moduloForm.invalid || !this.curso) return;

    const novoModulo: Modulo = {
      nome: this.moduloForm.value.nome!,
      cursoId: this.curso.id!
    };

    this.service.adicionarModulo(novoModulo).subscribe(moduloCriado => {
      this.curso?.modulos?.push(moduloCriado);
      this.moduloForm.reset();
    });
  }

  salvarAula() {
    if (this.aulaForm.invalid || !this.curso) return;

    if (this.aulaEmEdicao) {
      const aulaAtualizada: Aula = {
        ...this.aulaEmEdicao,
        nome: this.aulaForm.value.nome!,
        descricaoCurta: this.aulaForm.value.descricaoCurta!,
        videoUrl: this.aulaForm.value.videoUrl!,
        moduloId: this.aulaForm.value.moduloId!
      };

      this.service.atualizarAula(aulaAtualizada.id!, aulaAtualizada).subscribe(aulaSalva => {
        this.carregarCurso(this.curso!.id!);
        this.cancelarEdicao();
      });
    }
    else {
      const novaAula: Aula = {
        nome: this.aulaForm.value.nome!,
        descricaoCurta: this.aulaForm.value.descricaoCurta!,
        videoUrl: this.aulaForm.value.videoUrl!,
        moduloId: this.aulaForm.value.moduloId!
      };

      this.service.adicionarAula(novaAula).subscribe(aulaCriada => {
        const modulo = this.curso?.modulos?.find(m => m.id === aulaCriada.moduloId);
        modulo?.aulas?.push(aulaCriada);
        this.aulaForm.reset();
      });
    }
  }

  editarAula(aula: Aula) {
    this.aulaEmEdicao = aula;
    this.aulaForm.patchValue({
      nome: aula.nome,
      descricaoCurta: aula.descricaoCurta,
      videoUrl: aula.videoUrl,
      moduloId: aula.moduloId
    });
    document.querySelector('.aula-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cancelarEdicao() {
    this.aulaEmEdicao = null;
    this.aulaForm.reset();
  }

  removerAula(id: number) {
    if (confirm('Tem certeza que deseja remover esta aula?')) {
      this.service.removerAula(id).subscribe(() => {
        this.curso?.modulos?.forEach(m => {
          m.aulas = m.aulas?.filter(a => a.id !== id);
        });
      });
    }
  }
}
