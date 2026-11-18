export interface Categoria {
  id: number;
  nome: string;
  cor: string;
}

export type NovaCategoria = Omit<Categoria, 'id'>;
