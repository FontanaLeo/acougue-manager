export default function ConfiguracaoPendentePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-lg font-bold text-gray-800 mb-2">Supabase não configurado</h1>
        <p className="text-gray-600">
          Preencha <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> no arquivo <code>.env</code> e
          reinicie o servidor. O passo a passo está em <code>COMO-INICIAR.md</code>.
        </p>
      </div>
    </main>
  );
}
