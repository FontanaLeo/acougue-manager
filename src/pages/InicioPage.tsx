import { CardModulo } from '@/components/molecules';
import { useTituloPagina } from '@/hooks';
import type { Modulo } from '@/types';

const MODULOS: Modulo[] = [
  {
    caminho: '/estoque',
    icone: '📦',
    titulo: 'Estoque',
    descricao: 'Veja os produtos e registre entradas e saídas.',
  },
  {
    caminho: '/financeiro',
    icone: '💰',
    titulo: 'Financeiro',
    descricao: 'Acompanhe os saldos e os lançamentos por categoria.',
  },
];

export default function InicioPage() {
  useTituloPagina('Início');

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Para onde você quer ir?</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULOS.map((modulo) => <CardModulo key={modulo.caminho} modulo={modulo} />)}
      </div>
    </>
  );
}
