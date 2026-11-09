import { initEstoque } from './estoque';
import { initFinanceiro } from './financeiro';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'estoque') initEstoque();
  if (page === 'financeiro') initFinanceiro();
});
