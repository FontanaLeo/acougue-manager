import type { HTMLAttributes } from 'react';
import type { Tom } from '@/types';

const CLASSES_TOM: Record<Tom, string> = {
  perigo: 'bg-red-50 text-red-800',
  alerta: 'bg-amber-50 text-amber-900',
  sucesso: 'bg-emerald-50 text-emerald-800',
  neutro: 'bg-stone-50 text-stone-700',
};

interface AlertaProps extends HTMLAttributes<HTMLParagraphElement> {
  tom?: Tom;
}

// Faixa de mensagem: erro de formulário, aviso ou prévia de cálculo.
export function Alerta({ tom = 'perigo', className = '', ...props }: AlertaProps) {
  return <p className={`rounded-lg px-3 py-2 text-sm ${CLASSES_TOM[tom]} ${className}`} {...props} />;
}
