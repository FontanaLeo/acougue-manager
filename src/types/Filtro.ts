export interface OpcaoFiltro<T> {
  rotulo: string;
  aceita: (item: T) => boolean;
}
