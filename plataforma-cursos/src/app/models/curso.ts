import { Aula } from './aula';
export interface Curso {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  aulas?: Aula[];
}
