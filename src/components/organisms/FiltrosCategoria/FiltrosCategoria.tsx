import { BotaoFiltro } from '@/components/atoms';
import type { Categoria } from '@/types';

interface FiltrosCategoriaProps {
  categorias: Categoria[];
  filtro: number | null;
  onChange: (filtro: number | null) => void;
}

export function FiltrosCategoria({ categorias, filtro, onChange }: FiltrosCategoriaProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <BotaoFiltro ativo={filtro === null} onClick={() => onChange(null)}>Todos</BotaoFiltro>
      {categorias.map((categoria) => (
        <BotaoFiltro key={categoria.id} ativo={filtro === categoria.id} onClick={() => onChange(categoria.id)}>
          {categoria.nome}
        </BotaoFiltro>
      ))}
    </div>
  );
}
