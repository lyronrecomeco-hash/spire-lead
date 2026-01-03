import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import KanbanPage from "./pages/KanbanPage";
import ClientesPage from "./pages/ClientesPage";
import TarefasPage from "./pages/TarefasPage";
import FinanceiroPage from "./pages/FinanceiroPage";
import { LeadsPage, WhatsAppPage, RelatoriosPage, AutomacoesPage, ConfiguracoesPage } from "./pages/PlaceholderPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/tarefas" element={<TarefasPage />} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/automacoes" element={<AutomacoesPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
