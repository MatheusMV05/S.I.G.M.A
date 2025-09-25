import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
          <p className="text-muted-foreground max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="hero">
            <a href="/dashboard">Voltar ao Dashboard</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/login">Fazer Login</a>
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Erro 404 - S.I.G.M.A. Sistema Integrado
        </div>
      </div>
    </div>
  );
};

export default NotFound;
