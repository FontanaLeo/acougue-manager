import type { ReactNode } from 'react';
import type { Tom } from '@/types';

const CLASSES_TOM: Record<Tom, string> = {
  perigo: 'bg-red-100 text-red-800',
  alerta: 'bg-amber-100 text-amber-900',
  sucesso: 'bg-emerald-100 text-emerald-800',
  neutro: 'bg-stone-100 text-stone-600',
};

interface BadgeProps {
  tom?: Tom;
  // Cor vinda do banco, usada nas categorias.
  cor?: string;
  children: ReactNode;
}

export function Badge({ tom = 'neutro', cor, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${cor ? '' : CLASSES_TOM[tom]}`}
      style={cor ? { color: cor, backgroundColor: `${cor}1a` } : undefined}
    >
      {children}
    </span>
  );
}
