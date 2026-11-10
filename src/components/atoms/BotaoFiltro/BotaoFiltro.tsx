import type { ReactNode } from 'react';

interface BotaoFiltroProps {
  ativo: boolean;
  onClick: () => void;
  contagem?: number;
  children: ReactNode;
}

export function BotaoFiltro({ ativo, onClick, contagem, children }: BotaoFiltroProps) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-marca-600 focus-visible:ring-offset-2 ${
        ativo ? 'border-marca-700 bg-marca-700 text-white' : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
      }`}
    >
      {children}
      {contagem !== undefined && <span className={`tabular-nums ${ativo ? 'text-marca-100' : 'text-stone-500'}`}>{contagem}</span>}
    </button>
  );
}
