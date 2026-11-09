import type { MovimentarResponse } from './types';

type ItemEstoqueLike = { id: number; kg: number; estoque_minimo: number };

export function initEstoque(): void {
  const modal = document.getElementById('modalMovimentar') as HTMLDivElement;
  const btnAbrir = document.getElementById('btnAbrirModal');
  const btnFechar = document.getElementById('btnFecharModal');
  const form = document.getElementById('formMovimentar') as HTMLFormElement;
  const erro = document.getElementById('erroMovimentar');
  const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

  btnAbrir?.addEventListener('click', () => modal.classList.remove('hidden'));
  btnFechar?.addEventListener('click', () => modal.classList.add('hidden'));
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.add('hidden');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') modal?.classList.add('hidden');
  });

  form?.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    erro?.classList.add('hidden');
    const fd = new FormData(form);
    const payload = {
      id: Number(fd.get('id')),
      tipo: String(fd.get('tipo')),
      quantidade: Number(fd.get('quantidade')),
    };

    const botao = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (botao) botao.disabled = true;

    try {
      const res = await fetch('/estoque/movimentar', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token ?? '',
        },
        body: JSON.stringify(payload),
      });

      const data: MovimentarResponse = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? 'Não foi possível movimentar o estoque.');

      atualizarCards(data.itens);
      modal.classList.add('hidden');
      form.reset();
    } catch (error) {
      if (erro) {
        erro.textContent = error instanceof Error ? error.message : 'Erro ao comunicar com o servidor.';
        erro.classList.remove('hidden');
      }
    } finally {
      if (botao) botao.disabled = false;
    }
  });
}

function atualizarCards(itens: ItemEstoqueLike[]): void {
  itens.forEach((item) => {
    const container = document.querySelector<HTMLElement>(`[data-id="${item.id}"]`);
    const valor = container?.querySelector<HTMLElement>('.kg-valor');
    const alerta = container?.querySelector<HTMLElement>('[data-alerta-estoque]');
    const estoqueBaixo = item.kg < item.estoque_minimo;

    if (valor) valor.innerHTML = `${item.kg.toFixed(1)} <span class="text-sm font-normal">kg</span>`;
    container?.classList.toggle('border-red-600', estoqueBaixo);
    container?.classList.toggle('border-green-600', !estoqueBaixo);
    alerta?.classList.toggle('hidden', !estoqueBaixo);
  });
}
