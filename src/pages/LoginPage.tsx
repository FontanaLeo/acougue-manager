import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Alerta, Button, CLASSES_SUPERFICIE, Input, Logo } from '@/components/atoms';
import { CampoFormulario } from '@/components/molecules';
import { useEntrar, useTituloPagina } from '@/hooks';
import { consumirSaidaPorInatividade, LIMITE_INATIVIDADE_MS } from '@/lib/inatividade';

const MINUTOS_SEM_USO = LIMITE_INATIVIDADE_MS / 60_000;

export default function LoginPage() {
  useTituloPagina('Entrar');
  const { mutate, isPending, error } = useEntrar();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [saiuPorInatividade] = useState(consumirSaidaPorInatividade);

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
    <main className="flex min-h-screen">
      <section className="hidden w-[44%] flex-col justify-between bg-stone-900 p-12 text-white lg:flex">
        <Logo />
        <div>
          <p className="text-4xl font-bold leading-tight tracking-tight">Estoque, preços e fiado do açougue em um só lugar.</p>
          <p className="mt-4 max-w-md text-stone-300">Validade de cada lote, margem de cada corte, rendimento da desossa e a caderneta do fiado, sempre atualizados.</p>
        </div>
        <p className="flex items-center gap-2 text-sm text-stone-400">
          <LockKeyhole className="h-4 w-4" aria-hidden />
          Só quem tem login vê os dados. A sessão termina após {MINUTOS_SEM_USO} minutos sem uso.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center p-4">
        <form onSubmit={handleSubmit} className={`w-full max-w-sm space-y-4 p-6 sm:p-8 ${CLASSES_SUPERFICIE}`}>
          <div className="lg:hidden"><Logo /></div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">Entrar</h1>
            <p className="text-sm text-stone-600">Use o e-mail e a senha cadastrados no Supabase.</p>
          </div>
          {saiuPorInatividade && !error && <Alerta tom="alerta">Sua sessão terminou depois de {MINUTOS_SEM_USO} minutos sem uso.</Alerta>}
          {error && <Alerta role="alert">{error.message}</Alerta>}
          <CampoFormulario rotulo="E-mail">
            <Input name="email" type="email" autoComplete="username" required autoFocus />
          </CampoFormulario>
          <CampoFormulario rotulo="Senha">
            <span className="relative block">
              <Input name="senha" type={senhaVisivel ? 'text' : 'password'} autoComplete="current-password" required className="pr-11" />
              <Button
                variant="ghost"
                tamanho="icone"
                icone={senhaVisivel ? EyeOff : Eye}
                aria-label={senhaVisivel ? 'Esconder senha' : 'Mostrar senha'}
                aria-pressed={senhaVisivel}
                onClick={() => setSenhaVisivel(!senhaVisivel)}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              />
            </span>
          </CampoFormulario>
          <Button type="submit" carregando={isPending} className="w-full">Entrar</Button>
        </form>
      </section>
    </main>
  );
}
