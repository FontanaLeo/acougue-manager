import type { ReactNode } from 'react';

interface CampoFormularioProps {
  rotulo: string;
  ajuda?: string;
  children: ReactNode;
}

export function CampoFormulario({ rotulo, ajuda, children }: CampoFormularioProps) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {rotulo}
      <span className="mt-1 block">{children}</span>
      {ajuda && <span className="mt-1 block text-xs font-normal text-stone-500">{ajuda}</span>}
    </label>
  );
}
