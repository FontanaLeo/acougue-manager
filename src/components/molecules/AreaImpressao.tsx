import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface AreaImpressaoProps {
  children: ReactNode;
}

// Fica fora do app e só aparece no papel: veja a regra de impressão em index.css.
export function AreaImpressao({ children }: AreaImpressaoProps) {
  return createPortal(<div className="area-impressao hidden p-8 print:block">{children}</div>, document.body);
}
