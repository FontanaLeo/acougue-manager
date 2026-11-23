import type { ReactNode } from 'react';

interface CabecalhoPaginaProps {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

export function CabecalhoPagina({ titulo, descricao, acao }: CabecalhoPaginaProps) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">{titulo}</h1>
        {descricao && <p className="mt-0.5 text-sm text-stone-600">{descricao}</p>}
      </div>
      {acao}
    </header>
  );
}
