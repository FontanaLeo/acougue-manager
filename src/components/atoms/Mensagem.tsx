import type { ReactNode } from 'react';

interface MensagemProps {
  children: ReactNode;
}

export function Mensagem({ children }: MensagemProps) {
  return <p className="col-span-full py-8 text-center text-stone-500">{children}</p>;
}
