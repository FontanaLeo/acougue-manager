import type { MotivoSaida } from '@/enums';

export interface Lote {
  id: number;
  produto_id: number;
  kg_atual: number;
  custo_kg: number | null;
  validade: string | null;
  produto: { nome: string };
}

export interface Perda {
  motivo: MotivoSaida;
  kg: number;
  custo_total: number;
}
