import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell } from "@/components/NotificationSystem";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MobileHeader } from "@/components/MobileHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Inventory from "@/pages/Inventory";
import Insights from "@/pages/Insights";
import Customers from "@/pages/Customers";
import Registrations from "@/pages/Registrations";
import SuppliersManagement from "@/pages/SuppliersManagement";
import EmployeesManagement from "@/pages/EmployeesManagement";
import CategoriesManagementBackend from "@/pages/CategoriesManagementBackend";
import PromotionsManagement from "@/pages/PromotionsManagement";
import UserManagement from "@/pages/UserManagement";
import MyProfile from "@/pages/MyProfile";
import Charts from "@/pages/Charts";
import POS from "@/pages/POS";
import RH from "@/pages/RH";
import NotFound from "./pages/NotFound";
import LandingPage from "@/pages/LandingPage";
import AnaliseRentabilidadePage from "@/pages/AnaliseRentabilidadePage";
import AnaliseVendasPage from "@/pages/AnaliseVendasPage";

const queryClient = new QueryClient();

// Layout principal da aplicação
function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Páginas que não devem ter o layout do sistema
  const noLayoutPages = ['/', '/login'];
  const isNoLayoutPage = noLayoutPages.includes(location.pathname);

  // Tela de carregamento inicial
  if (isLoading && !isNoLayoutPage) {
    return (
      <LoadingScreen 
        variant="fullscreen"
        message="Inicializando S.I.G.M.A."
        submessage="Carregando seu ambiente de trabalho..."
      />
    );
  }

  // Landing page e login não precisam de autenticação
  if (!isAuthenticated || isNoLayoutPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Mobile Header - visible only on mobile */}
          <MobileHeader />
          
          {/* Desktop Header - hidden on mobile */}
          <header className="hidden md:flex h-header border-b border-border bg-card/50 backdrop-blur-sm px-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">Compre Bem Supermercado</div>
                <div className="text-xs text-muted-foreground">Sistema Integrado de Gestão</div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto mobile-container">
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* System Routes */}
      <Route path="/pos" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR', 'CASHIER']}><POS /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'STOCK']}><Products /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR', 'STOCK']}><Inventory /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}><Insights /></ProtectedRoute>} />
      <Route path="/reports" element={<Navigate to="/insights" replace />} />
      <Route path="/charts" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}><Charts /></ProtectedRoute>} />
      <Route path="/analise-rentabilidade" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}><AnaliseRentabilidadePage /></ProtectedRoute>} />
      <Route path="/analise-vendas" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}><AnaliseVendasPage /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}><Customers /></ProtectedRoute>} />
      <Route path="/registrations" element={<ProtectedRoute requiredRoles={['ADMIN']}><Registrations /></ProtectedRoute>} />
      
      {/* Management Routes */}
      <Route path="/suppliers" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}><SuppliersManagement /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}><EmployeesManagement /></ProtectedRoute>} />
      <Route path="/rh" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}><RH /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}><CategoriesManagementBackend /></ProtectedRoute>} />
      <Route path="/promotions" element={<ProtectedRoute requiredRoles={['ADMIN']}><PromotionsManagement /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute requiredRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
      
      {/* User Profile - Available to all authenticated users */}
      <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />

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
          <NotificationProvider>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
