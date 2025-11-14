import { Aula } from './aula';

export interface Modulo {
  id?: number;
  nome: string;
  cursoId: number;
  aulas?: Aula[];
}
