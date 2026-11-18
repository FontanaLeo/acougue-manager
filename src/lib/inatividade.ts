const CHAVE_ATIVIDADE = 'acougue-ultima-atividade';
const CHAVE_AVISO = 'acougue-aviso-inatividade';

export const LIMITE_INATIVIDADE_MS = 30 * 60 * 1000;

export function registrarAtividade(): void {
  localStorage.setItem(CHAVE_ATIVIDADE, String(Date.now()));
}

export function atividadeJaRegistrada(): boolean {
  return localStorage.getItem(CHAVE_ATIVIDADE) !== null;
}

// Apagada quando a sessão termina, para não derrubar o próximo login.
export function esquecerAtividade(): void {
  localStorage.removeItem(CHAVE_ATIVIDADE);
}

export function inativoDemais(): boolean {
  const ultima = Number(localStorage.getItem(CHAVE_ATIVIDADE));

  return ultima > 0 && Date.now() - ultima > LIMITE_INATIVIDADE_MS;
}

export function marcarSaidaPorInatividade(): void {
  sessionStorage.setItem(CHAVE_AVISO, '1');
}

// Lê uma vez só, para o aviso não voltar ao recarregar a página.
export function consumirSaidaPorInatividade(): boolean {
  const saiu = sessionStorage.getItem(CHAVE_AVISO) === '1';

  sessionStorage.removeItem(CHAVE_AVISO);

  return saiu;
}
