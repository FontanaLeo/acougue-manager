import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const chavePublica = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigurado = Boolean(url && chavePublica);

// Sem configuração o App mostra as instruções e não faz nenhuma chamada.
export const supabase = createClient(url || 'http://localhost', chavePublica || 'nao-configurada');
