import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/atoms';
import { useJanelaModal } from '@/hooks';
import { ROTAS } from '@/lib/rotas';
import { Navegacao } from './Navegacao';

const CLASSES_BOTAO_ESCURO =
  'flex h-10 w-10 items-center justify-center rounded-lg hover:bg-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-marca-500';

function LogoComLink() {
  return (
    <Link to={ROTAS.inicio} className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-marca-500">
      <Logo />
    </Link>
  );
}

// Menu do celular: uma janela como as outras, com Tab preso e foco devolvido ao fechar.
function MenuMovel({ onClose }: { onClose: () => void }) {
  const painel = useRef<HTMLDivElement>(null);

  useJanelaModal(painel, onClose);

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-stone-950/50" onClick={onClose} aria-hidden />
      <div
        ref={painel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-stone-900 text-white shadow-xl outline-none motion-safe:animate-surgir"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <LogoComLink />
          <button type="button" aria-label="Fechar menu" autoFocus onClick={onClose} className={CLASSES_BOTAO_ESCURO}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <Navegacao />
      </div>
    </div>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuAberto(false), [pathname]);

  return (
    <div className="min-h-screen lg:pl-64 print:pl-0">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-stone-900 text-white lg:flex print:hidden">
        <div className="px-5 py-5"><LogoComLink /></div>
        <Navegacao />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-stone-900 px-4 text-white shadow-md lg:hidden print:hidden">
        <LogoComLink />
        <button type="button" aria-label="Abrir menu" aria-expanded={menuAberto} onClick={() => setMenuAberto(true)} className={CLASSES_BOTAO_ESCURO}>
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </header>

      {menuAberto && <MenuMovel onClose={() => setMenuAberto(false)} />}

      <main id="conteudo" tabIndex={-1} className="mx-auto max-w-6xl p-4 focus:outline-none sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
