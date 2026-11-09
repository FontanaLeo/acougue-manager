import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import EstoquePage from '@/pages/EstoquePage';
import FinanceiroPage from '@/pages/FinanceiroPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
