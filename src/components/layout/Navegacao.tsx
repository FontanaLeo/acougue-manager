import { LayoutGrid, LogOut, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSair } from '@/hooks';
import { MODULOS } from '@/lib/modulos';
import { ROTAS } from '@/lib/rotas';

const CLASSE_BASE =
  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-marca-500';

function classeItem({ isActive }: { isActive: boolean }): string {
  return `${CLASSE_BASE} ${isActive ? 'bg-marca-700 text-white' : 'text-stone-300 hover:bg-stone-800 hover:text-white'}`;
}

export function Navegacao() {
  const { mutate: sair, isPending } = useSair();

  return (
    <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
      <NavLink to={ROTAS.inicio} end className={classeItem}>
        <LayoutGrid className="h-5 w-5" aria-hidden />
        Início
      </NavLink>
      {MODULOS.map((modulo) => (
        <NavLink key={modulo.caminho} to={modulo.caminho} className={classeItem}>
          <modulo.icone className="h-5 w-5" aria-hidden />
          {modulo.titulo}
        </NavLink>
      ))}

      <div className="mt-auto space-y-1 border-t border-stone-800 pt-3">
        <NavLink to={ROTAS.privacidade} className={classeItem}>
          <ShieldCheck className="h-5 w-5" aria-hidden />
          Privacidade
        </NavLink>
        <button type="button" disabled={isPending} onClick={() => sair()} className={`${CLASSE_BASE} text-stone-300 hover:bg-stone-800 hover:text-white`}>
          <LogOut className="h-5 w-5" aria-hidden />
          Sair
        </button>
      </div>
    </nav>
  );
}
