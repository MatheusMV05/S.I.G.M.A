import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import POS from "@/pages/POS";
import Products from "@/pages/Products";
import Inventory from "@/pages/Inventory";
import Reports from "@/pages/Reports";
import Customers from "@/pages/Customers";
import Registrations from "@/pages/Registrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout principal da aplicação
function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-header border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border" />
              <h2 className="font-semibold text-foreground">Sistema S.I.G.M.A.</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Compre Bem Supermercado
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// Componente de roteamento principal
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* System Routes */}
      <Route path="/pos" element={<ProtectedRoute requiredRoles={['cashier', 'admin']}><POS /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute requiredRoles={['admin', 'stock']}><Products /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute requiredRoles={['admin', 'stock']}><Inventory /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute requiredRoles={['admin', 'supervisor']}><Reports /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute requiredRoles={['admin']}><Customers /></ProtectedRoute>} />
      <Route path="/registrations" element={<ProtectedRoute requiredRoles={['admin']}><Registrations /></ProtectedRoute>} />

      {/* Páginas de erro */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">403</h1>
              <p className="text-xl text-muted-foreground">Acesso não autorizado</p>
            </div>
          </div>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
