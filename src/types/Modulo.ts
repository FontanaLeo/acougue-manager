import type { LucideIcon } from 'lucide-react';
import type { Rota } from '@/lib/rotas';

export type Tom = 'perigo' | 'alerta' | 'sucesso' | 'neutro';

export interface Modulo {
  caminho: Rota;
  icone: LucideIcon;
  titulo: string;
  descricao: string;
}

export interface StatusModulo {
  texto: string;
  tom: Tom;
}
