import { createContext, useContext } from 'react';

export type Avisar = (mensagem: string) => void;

export const AvisosContext = createContext<Avisar>(() => undefined);

export function useAvisar(): Avisar {
  return useContext(AvisosContext);
}
