import type { ReactNode } from 'react';

const CLASSES_BASE = 'rounded-2xl border bg-white shadow-cartao';

// Aparência de cartão para blocos que não são cards de lista, como formulários e seções.
export const CLASSES_SUPERFICIE = `${CLASSES_BASE} border-stone-200`;

interface CardProps {
  destaque?: boolean;
  interativo?: boolean;
  children: ReactNode;
}

export function Card({ destaque = false, interativo = false, children }: CardProps) {
  return (
    <article
      className={`flex h-full flex-col p-4 sm:p-5 ${CLASSES_BASE} ${
        destaque ? 'border-marca-700 ring-1 ring-marca-700' : 'border-stone-200'
      } ${interativo ? 'transition group-hover:border-marca-600 group-hover:shadow-md' : ''}`}
    >
      {children}
    </article>
  );
}
