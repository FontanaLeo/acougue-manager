function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// A busca ignora acentos e maiúsculas: "acem" encontra "Acém".
export function contemTexto(texto: string, busca: string): boolean {
  return normalizar(texto).includes(normalizar(busca.trim()));
}

export function plural(quantidade: number, singular: string, varios: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : varios}`;
}
