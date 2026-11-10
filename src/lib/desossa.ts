export interface AnaliseDesossa {
  rendimento: number;
  sobraKg: number;
  excedeu: boolean;
}

// Usada no card de cada desossa e na prévia da janela de registro.
export function analisarDesossa(pesoKg: number, aproveitadoKg: number): AnaliseDesossa {
  return {
    rendimento: pesoKg > 0 ? (aproveitadoKg / pesoKg) * 100 : 0,
    sobraKg: Math.max(0, pesoKg - aproveitadoKg),
    excedeu: pesoKg > 0 && aproveitadoKg > pesoKg,
  };
}
