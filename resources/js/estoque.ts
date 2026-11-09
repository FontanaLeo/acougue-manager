import type { MovimentarResponse } from './types';

export function initEstoque(): void {
  const grid = document.getElementById('gridEstoque');
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

      if (grid) grid.innerHTML = data.html ?? '';
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
