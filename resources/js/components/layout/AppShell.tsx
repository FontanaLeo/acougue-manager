import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <nav className="bg-red-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-14">
          <span className="font-bold text-lg">🥩 Açougue Manager</span>
          <div className="space-x-4">
            <Link to="/estoque" className="hover:underline">Estoque</Link>
            <Link to="/financeiro" className="hover:underline">Financeiro</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </>
  );
}
