import type { ReactNode } from 'react';

interface BotaoFiltroProps {
  ativo: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function BotaoFiltro({ ativo, onClick, children }: BotaoFiltroProps) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm ${ativo ? 'bg-red-800 text-white' : 'bg-white border'}`}
    >
      {children}
    </button>
  );
}
