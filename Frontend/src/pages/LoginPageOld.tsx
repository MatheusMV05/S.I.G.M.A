import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SigmaLogo } from '@/components/SigmaLogo';
import { AlertCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <SigmaLogo 
              size="xl" 
              className="w-20 h-20 rounded-2xl shadow-2xl"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-foreground tracking-tight">
              S.I.G.M.A.
            </h1>
            <div className="space-y-1">
              <p className="text-xl font-medium text-muted-foreground">
                Sistema Integrado de Gestão
              </p>
              <p className="text-sm text-muted-foreground/80 font-medium uppercase tracking-wide">
                Compre Bem Supermercado
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="border-border/30 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-black text-center text-foreground tracking-tight">
              Acesso ao Sistema
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center font-medium">
              Entre com suas credenciais para continuar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-mail / Login
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@comprebem.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Entrar no Sistema
                  </>
                )}
              </Button>
            </form>

            {/* Informações de Teste */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Contas de Teste (senha: 123456):
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-medium text-foreground">Admin:</p>
                  <p className="text-muted-foreground">admin@comprebem.com</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Supervisor:</p>
                  <p className="text-muted-foreground">supervisor@comprebem.com</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Caixa:</p>
                  <p className="text-muted-foreground">caixa@comprebem.com</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Estoque:</p>
                  <p className="text-muted-foreground">estoque@comprebem.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2024 S.I.G.M.A. - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}