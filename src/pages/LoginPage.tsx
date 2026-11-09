import { useEffect, type FormEvent } from 'react';
import { Button, Input } from '@/components/atoms';
import { CampoFormulario } from '@/components/molecules';
import { useEntrar, useTituloPagina } from '@/hooks';

export default function LoginPage() {
  useTituloPagina('Entrar');
  const { mutate, isPending, error } = useEntrar();

  // Todo login começa na tela inicial, mesmo que a pessoa tenha saído em outra página.
  useEffect(() => {
    window.history.replaceState(null, '', '/');
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valores = new FormData(event.currentTarget);

    mutate({ email: String(valores.get('email')), senha: String(valores.get('senha')) });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow space-y-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">🥩 Açougue Manager</h1>
        {error && <p className="text-sm text-red-700" role="alert">{error.message}</p>}
        <CampoFormulario rotulo="E-mail">
          <Input name="email" type="email" autoComplete="username" required autoFocus />
        </CampoFormulario>
        <CampoFormulario rotulo="Senha">
          <Input name="senha" type="password" autoComplete="current-password" required />
        </CampoFormulario>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending}>Entrar</Button>
        </div>
      </form>
    </main>
  );
}
