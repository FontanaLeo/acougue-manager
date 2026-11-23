import { useMemo, type ReactNode } from 'react';
import { BotaoFiltro } from '@/components/atoms';
import type { OpcaoFiltro } from '@/types';

interface BarraFiltrosProps<T> {
  opcoes: OpcaoFiltro<T>[];
  itens: T[];
  ativa: OpcaoFiltro<T>;
  onChange: (opcao: OpcaoFiltro<T>) => void;
  // Campo de busca, quando a tela tiver.
  children?: ReactNode;
}

export function BarraFiltros<T>({ opcoes, itens, ativa, onChange, children }: BarraFiltrosProps<T>) {
  // As contagens não dependem da busca: só mudam quando a lista muda.
  const contagens = useMemo(() => opcoes.map((opcao) => itens.filter(opcao.aceita).length), [opcoes, itens]);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {children}
      {opcoes.map((opcao, indice) => (
        <BotaoFiltro key={opcao.rotulo} ativo={opcao === ativa} contagem={contagens[indice]} onClick={() => onChange(opcao)}>
          {opcao.rotulo}
        </BotaoFiltro>
      ))}
    </div>
  );
}
