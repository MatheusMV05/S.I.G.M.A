import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SigmaLogo } from '@/components/SigmaLogo';
import { Eye, EyeOff, Loader2, ShoppingCart, BarChart3, Package, Users } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Credenciais inválidas. Tente novamente.');
    }
    
    setIsLoading(false);
  };

  // Animação de background com ícones flutuantes
  const floatingIcons = [
    { Icon: ShoppingCart, delay: '0s', top: '20%', left: '10%' },
    { Icon: BarChart3, delay: '2s', top: '60%', left: '15%' },
    { Icon: Package, delay: '4s', top: '30%', left: '85%' },
    { Icon: Users, delay: '6s', top: '70%', left: '80%' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background com gradiente e animações */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      
      {/* Ícones flutuantes no fundo */}
      {floatingIcons.map(({ Icon, delay, top, left }, index) => (
        <div
          key={index}
          className="absolute opacity-10 animate-float"
          style={{
            top,
            left,
            animationDelay: delay,
            animationDuration: '6s'
          }}
        >
          <Icon className="w-12 h-12 text-primary" />
        </div>
      ))}

      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-20 animate-shimmer"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 p-4">
        {/* Header com logo e título */}
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <SigmaLogo size="xl" showText className="mx-auto mb-6 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            S.I.G.M.A.
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Sistema Integrado de Gestão
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Mercados e Afins
          </p>
        </div>

        {/* Card de login */}
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 animate-scale-in">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-center font-bold">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center text-base">
              Digite suas credenciais para entrar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
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
                  className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
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
                    className="h-12 text-base pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 hover:bg-muted/50 transition-colors"
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
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription className="text-center">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>

            {/* Informações de teste */}
            <div className="pt-4 border-t border-border/50">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Credenciais para demonstração:
                </p>
                <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                  <p className="font-mono text-xs text-foreground">
                    <strong>Admin:</strong> admin@comprebem.com
                  </p>
                  <p className="font-mono text-xs text-foreground">
                    <strong>Senha:</strong> 123456
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-1 animate-fade-in">
          <p className="font-semibold">© 2024 Compre Bem Supermercado</p>
          <p>Sistema desenvolvido para gestão completa</p>
        </div>
      </div>
    </div>
  );
}