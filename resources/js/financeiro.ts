interface NovaTransacao {
  id: number;
  tag: string;
  tipo: 'despesa' | 'receita';
  desc: string;
  valor: number;
  data: string;
}

interface TotaisFinanceiros {
  acougue: number;
  familia: number;
  saldo: number;
}

interface RespostaTransacao {
  success: boolean;
  transacao: NovaTransacao;
  totais: TotaisFinanceiros;
  message?: string;
  errors?: Record<string, string[]>;
}

export function initFinanceiro(): void {
  const botoes = document.querySelectorAll<HTMLButtonElement>('.btn-filtro');
  const modal = document.getElementById('modalTransacao');
  const form = document.getElementById('formTransacao') as HTMLFormElement | null;
  const erro = document.getElementById('erroTransacao');
  const lista = document.getElementById('listaTransacoes');
  const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
  let filtroAtivo = 'Todos';

  botoes.forEach((btn) => {
    btn.addEventListener('click', () => {
      filtroAtivo = btn.dataset.filtro ?? 'Todos';
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
          tag: valores.get('tag'),
          desc: valores.get('desc'),
          valor: Number(valores.get('valor')),
        }),
      });
      const data = await response.json() as RespostaTransacao;

      if (!response.ok || !data.success) {
        const detalhe = data.errors ? Object.values(data.errors).flat()[0] : data.message;
        throw new Error(detalhe ?? 'Não foi possível adicionar o lançamento.');
      }

      if (lista) lista.prepend(criarLinha(data.transacao));
      atualizarTotais(data.totais);
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

  document.querySelectorAll<HTMLDivElement>('#listaTransacoes > div').forEach((linha) => {
    linha.style.display = filtro === 'Todos' || linha.dataset.tag === filtro ? 'flex' : 'none';
  });
}

function atualizarTotais(totais: TotaisFinanceiros): void {
  atualizarSaldo('saldoAcougue', totais.acougue);
  atualizarSaldo('saldoFamilia', totais.familia);
  atualizarSaldo('saldoGeral', totais.saldo);
}

function atualizarSaldo(id: string, valor: number): void {
  const elemento = document.getElementById(id);
  if (!elemento) return;

  elemento.dataset.value = String(valor);
  elemento.textContent = `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  elemento.classList.toggle('text-green-700', valor >= 0);
  elemento.classList.toggle('text-red-700', valor < 0);
}

function criarLinha(transacao: NovaTransacao): HTMLDivElement {
  const linha = document.createElement('div');
  linha.className = 'flex justify-between items-center p-3 gap-3';
  linha.dataset.tag = transacao.tag;
  linha.dataset.tipo = transacao.tipo;

  const detalhes = document.createElement('div');
  const categoria = document.createElement('span');
  categoria.className = `text-xs px-2 py-0.5 rounded-full ${transacao.tag === 'Açougue' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`;
  categoria.textContent = `[${transacao.tag}]`;

  const descricao = document.createElement('span');
  descricao.className = 'ml-2';
  descricao.textContent = transacao.desc;

  const data = document.createElement('span');
  data.className = 'ml-2 text-xs text-gray-400';
  data.textContent = formatarData(transacao.data);
  detalhes.append(categoria, descricao, data);

  const valor = document.createElement('span');
  valor.className = `font-semibold ${transacao.tipo === 'receita' ? 'text-green-700' : 'text-red-700'}`;
  const sinal = transacao.tipo === 'receita' ? '+' : '-';
  valor.textContent = `${sinal} R$ ${transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  linha.append(detalhes, valor);
  return linha;
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
