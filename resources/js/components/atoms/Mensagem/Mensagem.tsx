import type { ReactNode } from 'react';

interface MensagemProps {
  children: ReactNode;
}

export function Mensagem({ children }: MensagemProps) {
  return <p className="col-span-full text-center text-gray-500 py-8">{children}</p>;
}
