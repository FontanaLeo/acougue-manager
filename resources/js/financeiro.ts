interface RespostaTransacao {
  success: boolean;
  html_resumo?: string;
  html_transacoes?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export function initFinanceiro(): void {
  const botoes = document.querySelectorAll<HTMLButtonElement>('.btn-filtro');
  const modal = document.getElementById('modalTransacao');
  const form = document.getElementById('formTransacao') as HTMLFormElement | null;
  const erro = document.getElementById('erroTransacao');
  const lista = document.getElementById('listaTransacoes');
  const resumo = document.getElementById('resumoFinanceiro');
  const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
  let filtroAtivo = 'todos';

  botoes.forEach((btn) => {
    btn.addEventListener('click', () => {
      filtroAtivo = btn.dataset.filtro ?? 'todos';
      atualizarFiltro(botoes, filtroAtivo);
    });
  });

  const fecharModal = (): void => modal?.classList.add('hidden');
  document.getElementById('btnNovaTransacao')?.addEventListener('click', () => {
    erro?.classList.add('hidden');
    modal?.classList.remove('hidden');
    form?.querySelector<HTMLSelectElement>('select[name="tipo"]')?.focus();
  });
  document.getElementById('btnFecharTransacao')?.addEventListener('click', fecharModal);
  document.getElementById('btnCancelarTransacao')?.addEventListener('click', fecharModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) fecharModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') fecharModal();
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    erro?.classList.add('hidden');

    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;

    try {
      const valores = new FormData(form);
      const response = await fetch('/financeiro/transacoes', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({
          tipo: valores.get('tipo'),
          categoria_id: Number(valores.get('categoria_id')),
          descricao: valores.get('descricao'),
          valor: Number(valores.get('valor')),
        }),
      });
      const data = await response.json() as RespostaTransacao;

      if (!response.ok || !data.success) {
        const detalhe = data.errors ? Object.values(data.errors).flat()[0] : data.message;
        throw new Error(detalhe ?? 'Não foi possível adicionar o lançamento.');
      }

      if (lista) lista.innerHTML = data.html_transacoes ?? '';
      if (resumo) resumo.innerHTML = data.html_resumo ?? '';
      atualizarFiltro(botoes, filtroAtivo);
      form.reset();
      fecharModal();
    } catch (requestError) {
      if (erro) {
        erro.textContent = requestError instanceof Error ? requestError.message : 'Erro ao comunicar com o servidor.';
        erro.classList.remove('hidden');
      }
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}

function atualizarFiltro(botoes: NodeListOf<HTMLButtonElement>, filtro: string): void {
  botoes.forEach((botao) => {
    const ativo = botao.dataset.filtro === filtro;
    botao.classList.toggle('bg-red-800', ativo);
    botao.classList.toggle('text-white', ativo);
    botao.classList.toggle('bg-white', !ativo);
    botao.classList.toggle('border', !ativo);
  });

  const cards = document.querySelectorAll<HTMLDivElement>('#listaTransacoes > [data-categoria]');
  let visiveis = 0;
  cards.forEach((card) => {
    const visivel = filtro === 'todos' || card.dataset.categoria === filtro;
    card.classList.toggle('hidden', !visivel);
    if (visivel) visiveis += 1;
  });

  document.getElementById('semResultados')?.classList.toggle('hidden', cards.length === 0 || visiveis > 0);
}
