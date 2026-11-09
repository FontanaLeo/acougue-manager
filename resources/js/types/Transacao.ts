import type { TipoTransacao } from '@/enums';
import type { Categoria } from './Categoria';

export interface Transacao {
  id: number;
  categoria_id: number;
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  data: string;
  categoria: Categoria;
}

export type NovaTransacao = Pick<Transacao, 'categoria_id' | 'tipo' | 'descricao' | 'valor'>;

export interface ItemResumo {
  titulo: string;
  valor: number;
  destaque: boolean;
}
