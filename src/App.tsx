import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Mensagem } from '@/components/atoms';
import { AppShell } from '@/components/layout/AppShell';
import { AvisosProvider } from '@/components/layout/AvisosProvider';
import { CartoesCarregando } from '@/components/molecules';
import { useSessao } from '@/hooks';
import { ROTAS } from '@/lib/rotas';
import { supabaseConfigurado } from '@/lib/supabase';
import ConfiguracaoPendentePage from '@/pages/ConfiguracaoPendentePage';
import LoginPage from '@/pages/LoginPage';

// Cada tela é baixada só quando é aberta.
const InicioPage = lazy(() => import('@/pages/InicioPage'));
const EstoquePage = lazy(() => import('@/pages/EstoquePage'));
const LotesPage = lazy(() => import('@/pages/LotesPage'));
const PrecosPage = lazy(() => import('@/pages/PrecosPage'));
const DesossaPage = lazy(() => import('@/pages/DesossaPage'));
const FiadoPage = lazy(() => import('@/pages/FiadoPage'));
const FinanceiroPage = lazy(() => import('@/pages/FinanceiroPage'));
const PrivacidadePage = lazy(() => import('@/pages/PrivacidadePage'));

// Toda gravação já recarrega as listas que mudou; trocar de tela dentro de 1 minuto não busca de novo.
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

const AreaLogada = () => {
  const { sessao, carregando } = useSessao();

  if (carregando) return <Mensagem>Carregando...</Mensagem>;
  if (!sessao) return <LoginPage />;

  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<CartoesCarregando />}>
          <Routes>
            <Route path={ROTAS.inicio} element={<InicioPage />} />
            <Route path={ROTAS.estoque} element={<EstoquePage />} />
            <Route path={ROTAS.lotes} element={<LotesPage />} />
            <Route path={ROTAS.precos} element={<PrecosPage />} />
            <Route path={ROTAS.desossa} element={<DesossaPage />} />
            <Route path={ROTAS.fiado} element={<FiadoPage />} />
            <Route path={ROTAS.financeiro} element={<FinanceiroPage />} />
            <Route path={ROTAS.privacidade} element={<PrivacidadePage />} />
            <Route path="*" element={<Navigate to={ROTAS.inicio} replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AvisosProvider>
      {supabaseConfigurado ? <AreaLogada /> : <ConfiguracaoPendentePage />}
    </AvisosProvider>
  </QueryClientProvider>
);

export default App;
