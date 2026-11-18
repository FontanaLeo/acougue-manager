// Um lugar só para os caminhos: errar um nome passa a ser erro de compilação.
export const ROTAS = {
  inicio: '/',
  estoque: '/estoque',
  lotes: '/lotes',
  precos: '/precos',
  desossa: '/desossa',
  fiado: '/fiado',
  financeiro: '/financeiro',
  privacidade: '/privacidade',
} as const;

export type Rota = (typeof ROTAS)[keyof typeof ROTAS];
