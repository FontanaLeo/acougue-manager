import { Fragment, type ReactElement, type ReactNode } from 'react';
import { EstadoVazio } from '@/components/molecules/EstadoVazio/EstadoVazio';

export const CLASSES_GRADE = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3';
export const CLASSES_GRADE_RESUMO = 'grid grid-cols-2 gap-3 lg:grid-cols-4';

interface GradeCartoesProps<T extends { id: number }> {
  itens: T[];
  // Texto simples vira um EstadoVazio; um elemento é mostrado como está.
  vazio: string | ReactElement;
  alinharTopo?: boolean;
  children: (item: T) => ReactNode;
}

export function GradeCartoes<T extends { id: number }>({ itens, vazio, alinharTopo = false, children }: GradeCartoesProps<T>) {
  if (itens.length === 0) return typeof vazio === 'string' ? <EstadoVazio titulo={vazio} /> : vazio;

  return (
    <div className={`${CLASSES_GRADE} ${alinharTopo ? 'items-start' : ''}`}>
      {itens.map((item) => <Fragment key={item.id}>{children(item)}</Fragment>)}
    </div>
  );
}
