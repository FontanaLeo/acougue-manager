import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSair } from '@/hooks';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { mutate: sair, isPending } = useSair();

  return (
    <>
      <nav className="bg-red-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-x-4 min-h-14">
          <Link to="/" className="font-bold text-lg whitespace-nowrap">🥩 Açougue Manager</Link>
          <div className="space-x-4 whitespace-nowrap">
            <Link to="/estoque" className="hover:underline">Estoque</Link>
            <Link to="/financeiro" className="hover:underline">Financeiro</Link>
            <button type="button" className="hover:underline" disabled={isPending} onClick={() => sair()}>Sair</button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </>
  );
}
