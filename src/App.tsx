import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import KanbanPage from "./pages/KanbanPage";
import LeadsPage from "./pages/LeadsPage";
import LoginPage from "./pages/LoginPage";
import FunilVendasPage from "./pages/FunilVendasPage";
import AtendimentosPage from "./pages/AtendimentosPage";
import PedidosPage from "./pages/PedidosPage";
import AgendaPage from "./pages/AgendaPage";
import EquipePage from "./pages/EquipePage";
import TemplatesPage from "./pages/TemplatesPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import { ConfiguracoesPage } from "./pages/PlaceholderPages";
import NotFound from "./pages/NotFound";

import { lazy, Suspense } from "react";
const ClientesPage = lazy(() => import("./pages/ClientesPage"));
const TarefasPage = lazy(() => import("./pages/TarefasPage"));
const FinanceiroPage = lazy(() => import("./pages/FinanceiroPage"));

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Carregando...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />
        <Route path="/funil" element={<ProtectedRoute><FunilVendasPage /></ProtectedRoute>} />
        <Route path="/atendimentos" element={<ProtectedRoute><AtendimentosPage /></ProtectedRoute>} />
        <Route path="/pedidos" element={<ProtectedRoute><PedidosPage /></ProtectedRoute>} />
        <Route path="/agenda" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
        <Route path="/equipe" element={<ProtectedRoute><EquipePage /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><ClientesPage /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
        <Route path="/tarefas" element={<ProtectedRoute><TarefasPage /></ProtectedRoute>} />
        <Route path="/financeiro" element={<ProtectedRoute><FinanceiroPage /></ProtectedRoute>} />
        <Route path="/relatorios" element={<ProtectedRoute><RelatoriosPage /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><ConfiguracoesPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
