import { Modulo } from './modulo';
export interface Curso {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  modulos?: Modulo[];
}
