import { Routes } from '@angular/router';
import { CursoList } from './curso/curso-list';
import { CursoForm } from './curso/curso-form';
import { CursoDetails } from './curso/curso-details';

export const routes: Routes = [
  { path: '', component: CursoList },
  { path: 'novo', component: CursoForm },
  { path: 'editar/:id', component: CursoForm },
  { path: 'curso/:id', component: CursoDetails }
];
