import type { ReactNode } from 'react';

type CardBorda = 'positiva' | 'negativa' | 'destaque';

const CLASSES_BORDA: Record<CardBorda, string> = {
  positiva: 'border-l-4 border-green-600',
  negativa: 'border-l-4 border-red-600',
  destaque: 'border-2 border-red-800',
};

interface CardProps {
  borda?: CardBorda;
  children: ReactNode;
}

export function Card({ borda, children }: CardProps) {
  return <article className={`bg-white rounded-xl shadow p-4 ${borda ? CLASSES_BORDA[borda] : ''}`}>{children}</article>;
}
