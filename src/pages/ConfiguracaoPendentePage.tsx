import { CLASSES_SUPERFICIE, Logo } from '@/components/atoms';

export default function ConfiguracaoPendentePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className={`max-w-md space-y-4 p-6 ${CLASSES_SUPERFICIE}`}>
        <Logo />
        <h1 className="text-lg font-bold text-stone-900">Supabase não configurado</h1>
        <p className="text-stone-600">
          Preencha <code className="rounded bg-stone-100 px-1">VITE_SUPABASE_URL</code> e{' '}
          <code className="rounded bg-stone-100 px-1">VITE_SUPABASE_PUBLISHABLE_KEY</code> no arquivo{' '}
          <code className="rounded bg-stone-100 px-1">.env</code> e reinicie o servidor. O passo a passo está em{' '}
          <code className="rounded bg-stone-100 px-1">COMO-INICIAR.md</code>.
        </p>
      </div>
    </main>
  );
}
