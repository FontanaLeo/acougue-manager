import { CalendarClock, NotebookPen, Package, Slice, Tag, Wallet } from 'lucide-react';
import { ROTAS } from '@/lib/rotas';
import type { Modulo } from '@/types';

export const MODULOS: Modulo[] = [
  {
    caminho: ROTAS.estoque,
    icone: Package,
    titulo: 'Estoque',
    descricao: 'Veja os produtos e registre entradas e saídas.',
  },
  {
    caminho: ROTAS.lotes,
    icone: CalendarClock,
    titulo: 'Lotes e perdas',
    descricao: 'Veja o que vence primeiro e quanto se perdeu no mês.',
  },
  {
    caminho: ROTAS.precos,
    icone: Tag,
    titulo: 'Preços',
    descricao: 'Confira a margem de cada corte e os preços defasados.',
  },
  {
    caminho: ROTAS.desossa,
    icone: Slice,
    titulo: 'Desossa',
    descricao: 'Registre a compra e descubra o rendimento e o custo de cada corte.',
  },
  {
    caminho: ROTAS.fiado,
    icone: NotebookPen,
    titulo: 'Fiado',
    descricao: 'Controle quem deve, os pagamentos e envie lembretes.',
  },
  {
    caminho: ROTAS.financeiro,
    icone: Wallet,
    titulo: 'Financeiro',
    descricao: 'Acompanhe os saldos e os lançamentos por categoria.',
  },
];
