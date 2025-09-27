import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SigmaLogo } from '@/components/SigmaLogo';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Eye, EyeOff, Loader2, ShoppingCart, BarChart3, Package, Users, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      setLoginSuccess(true);
      // O redirecionamento será feito automaticamente pelo Navigate no topo
    } else {
      setError('Credenciais inválidas. Tente novamente.');
      setIsLoading(false);
    }
  };

  // Tela de transição pós-login bem-sucedido
  if (loginSuccess) {
    return (
      <LoadingScreen 
        variant="fullscreen"
        message="Login realizado com sucesso!"
        submessage="Redirecionando para seu dashboard..."
      />
    );
  }

  // Animação de background com ícones flutuantes
  const floatingIcons = [
    { Icon: ShoppingCart, delay: '0s', top: '20%', left: '10%' },
    { Icon: BarChart3, delay: '2s', top: '60%', left: '15%' },
    { Icon: Package, delay: '4s', top: '30%', left: '85%' },
    { Icon: Users, delay: '6s', top: '70%', left: '80%' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden mobile-container">
      {/* Background com gradiente e animações */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        {/* Efeitos de partículas animadas */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Ícones flutuantes no fundo */}
      {floatingIcons.map(({ Icon, delay, top, left }, index) => (
        <div
          key={index}
          className="absolute opacity-10 animate-float hover:opacity-20 transition-opacity duration-1000"
          style={{
            top,
            left,
            animationDelay: delay,
            animationDuration: '6s'
          }}
        >
          <Icon className="w-12 h-12 text-primary drop-shadow-lg" />
        </div>
      ))}

      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-20 animate-shimmer"></div>
      
      {/* Círculos decorativos */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Header com logo e título */}
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <SigmaLogo size="2xl" showText className="mx-auto mb-6 drop-shadow-lg" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Bem-vindo ao S.I.G.M.A. 
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium">
            Sistema Integrado de Gestão e Movimentação de Ativos
          </p>
        </div>

        {/* Card de login */}
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 animate-scale-in hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
          {/* Efeito de borda animada */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <CardHeader className="space-y-2 pb-6 relative z-10">
            <CardTitle className="text-xl sm:text-2xl text-center font-bold animate-fade-in">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Digite suas credenciais para entrar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Label htmlFor="email" className="text-sm font-semibold">
                  Login / E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-12 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50 focus:scale-[1.02] focus:shadow-lg"
                />
              </div>
              
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Label htmlFor="password" className="text-sm font-semibold">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 sm:h-12 text-sm sm:text-base pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50 focus:scale-[1.02] focus:shadow-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 sm:h-10 sm:w-10 hover:bg-muted/50 transition-all duration-200 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-fade-in animate-pulse">
                  <AlertDescription className="text-center">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold bg-primary hover:bg-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
                style={{ animationDelay: '0.8s' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span className="animate-pulse">Entrando...</span>
                  </>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>

            {/* Informações de teste */}
            <div className="pt-4 border-t border-border/50">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground font-medium">
                  Credenciais para demonstração:
                </p>
                <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-2 text-left">
                  <div className="grid gap-1 sm:gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-muted-foreground">Admin:</span>
                      <span className="font-mono text-xs text-foreground truncate">admin@comprebem.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-muted-foreground">Gerente:</span>
                      <span className="font-mono text-xs text-foreground truncate">gerente@comprebem.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-muted-foreground">Supervisor:</span>
                      <span className="font-mono text-xs text-foreground truncate">supervisor@comprebem.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-muted-foreground">Caixa:</span>
                      <span className="font-mono text-xs text-foreground truncate">caixa@comprebem.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-muted-foreground">Estoque:</span>
                      <span className="font-mono text-xs text-foreground truncate">estoque@comprebem.com</span>
                    </div>
                    <div className="border-t border-border/30 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-muted-foreground">Senha (todos):</span>
                        <span className="font-mono text-sm font-bold text-primary">123456</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-1 animate-fade-in">
          <p className="font-semibold">© 2024 Compre Bem Supermercado</p>
          <p className="hidden sm:block">Sistema desenvolvido para gestão completa</p>
        </div>
      </div>
    </div>
  );
}