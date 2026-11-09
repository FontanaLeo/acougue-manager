interface RespostaDeErro {
  message?: string;
  errors?: Record<string, string[]>;
}

const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

async function requisitar<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
  });

  if (!response.ok) {
    const erro = (await response.json().catch(() => ({}))) as RespostaDeErro;
    const detalhe = erro.errors ? Object.values(erro.errors).flat()[0] : erro.message;
    throw new Error(detalhe ?? 'Erro ao comunicar com o servidor.');
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const http = {
  get: <T>(url: string) => requisitar<T>(url),
  post: <T = void>(url: string, corpo: unknown) =>
    requisitar<T>(url, { method: 'POST', body: JSON.stringify(corpo) }),
};
