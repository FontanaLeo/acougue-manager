import type { ReactNode } from 'react';

interface CampoFormularioProps {
  rotulo: string;
  children: ReactNode;
}

export function CampoFormulario({ rotulo, children }: CampoFormularioProps) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {rotulo}
      {children}
    </label>
  );
}
