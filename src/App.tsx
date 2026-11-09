import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Mensagem } from '@/components/atoms';
import { AppShell } from '@/components/layout/AppShell';
import { useSessao } from '@/hooks';
import { supabaseConfigurado } from '@/lib/supabase';
import ConfiguracaoPendentePage from '@/pages/ConfiguracaoPendentePage';
import EstoquePage from '@/pages/EstoquePage';
import FinanceiroPage from '@/pages/FinanceiroPage';
import InicioPage from '@/pages/InicioPage';
import LoginPage from '@/pages/LoginPage';

const queryClient = new QueryClient();

const AreaLogada = () => {
  const { sessao, carregando } = useSessao();

  if (carregando) return <Mensagem>Carregando...</Mensagem>;
  if (!sessao) return <LoginPage />;

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    {supabaseConfigurado ? <AreaLogada /> : <ConfiguracaoPendentePage />}
  </QueryClientProvider>
);

export default App;
