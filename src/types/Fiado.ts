import type { TipoLancamentoFiado } from '@/enums';

interface LancamentoFiado {
  id: number;
  tipo: TipoLancamentoFiado;
  descricao: string;
  valor: number;
  data: string;
}

export interface Cliente {
  id: number;
  nome: string;
  telefone: string | null;
  criado_em: string;
  lancamentos: LancamentoFiado[];
}

// Sem id, é um cliente novo; com id, a correção de um cliente existente.
export interface DadosCliente {
  id?: number;
  nome: string;
  telefone: string;
}

export interface NovoLancamentoFiado {
  cliente_id: number;
  tipo: TipoLancamentoFiado;
  descricao: string;
  valor: number;
}
