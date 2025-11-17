import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRequestPasswordReset } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Eye, EyeOff, Loader2, ShoppingCart, BarChart3, Package, Users, CheckCircle, Mail, ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const requestPasswordReset = useRequestPasswordReset();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Estados para recuperação de senha
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(username, password);
    
    if (success) {
      setLoginSuccess(true);
      // O redirecionamento será feito automaticamente pelo Navigate no topo
    } else {
      setError('Credenciais inválidas. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    setResetError('');

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError('Por favor, digite um email válido.');
      setIsResetLoading(false);
      return;
    }

    try {
      await requestPasswordReset.mutateAsync(resetEmail);
      
      setResetSuccess(true);
      
      // Fechar o diálogo após 3 segundos
      setTimeout(() => {
        setIsForgotPasswordOpen(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
      
    } catch (error) {
      setResetError('Erro ao enviar email. Verifique o endereço e tente novamente.');
    } finally {
      setIsResetLoading(false);
    }
  };

  const openForgotPassword = () => {
    setIsForgotPasswordOpen(true);
    setResetEmail(''); // Limpar campo de email para recuperação
    setResetError('');
    setResetSuccess(false);
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
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[linear-gradient(#D946EF_1px,transparent_1px),linear-gradient(90deg,#D946EF_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      
      {/* Purple Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] 
                   bg-[#D946EF] rounded-full blur-[150px] opacity-30"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] 
                   bg-[#9333EA] rounded-full blur-[150px] opacity-20"
      />
      
      {/* Ícones flutuantes no fundo */}
      {floatingIcons.map(({ Icon, delay, top, left }, index) => (
        <motion.div
          key={index}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: parseInt(delay) }}
          className="absolute opacity-10"
          style={{ top, left }}
        >
          <Icon className="w-12 h-12 text-[#D946EF] drop-shadow-lg" />
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-md space-y-6 sm:space-y-8 p-4 sm:p-6">
        {/* Header com logo e título */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo SIGMA */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-[#D946EF] blur-[40px] opacity-30"
              />
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#D946EF] to-[#9333EA] 
                            rounded-2xl flex items-center justify-center 
                            shadow-[0_0_40px_rgba(217,70,239,0.5)]">
                <span className="text-white font-bold text-4xl">Σ</span>
              </div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight"
          >
            Bem-vindo ao{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] to-[#9333EA]">
              SIGMA
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[#A1A1AA] text-base sm:text-lg font-medium"
          >
            Sistema Integrado de Gestão
          </motion.p>
        </motion.div>

        {/* Card de login */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ y: -5 }}
          className="bg-[#0A0A0A] border border-[#1F1F23] rounded-2xl p-8 
                   shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-[#2D2D33]
                   hover:shadow-[0_0_60px_rgba(217,70,239,0.15)] 
                   transition-all duration-500 relative overflow-hidden"
        >
          {/* Glow effect no hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D946EF]/5 to-transparent 
                        opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="space-y-2 mb-8 relative z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-2xl font-bold text-white text-center"
            >
              Acesso ao Sistema
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center text-[#A1A1AA]"
            >
              Digite suas credenciais para entrar
            </motion.p>
          </div>
          
          <div className="space-y-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-sm font-medium text-[#A1A1AA]">
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 bg-black border-[#1F1F23] text-white placeholder-[#52525B]
                           focus:border-[#D946EF] focus:shadow-[0_0_20px_rgba(217,70,239,0.2)]
                           hover:border-[#2D2D33] transition-all duration-300"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-sm font-medium text-[#A1A1AA]">
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
                    className="h-12 pr-12 bg-black border-[#1F1F23] text-white placeholder-[#52525B]
                             focus:border-[#D946EF] focus:shadow-[0_0_20px_rgba(217,70,239,0.2)]
                             hover:border-[#2D2D33] transition-all duration-300"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] 
                             hover:text-[#D946EF] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                      <AlertDescription className="text-center text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-[#D946EF] text-white font-semibold rounded-xl
                           shadow-[0_0_30px_rgba(217,70,239,0.4)] 
                           hover:shadow-[0_0_50px_rgba(217,70,239,0.6)]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-5 w-5" />
                      </motion.div>
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Entrar no Sistema</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Link Esqueci minha senha */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={openForgotPassword}
                className="text-[#D946EF] hover:text-[#C026D3] text-sm font-medium 
                         hover:underline transition-colors"
              >
                Esqueci minha senha
              </motion.button>
            </motion.div>
            
            {/* Features rápidas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1F1F23]"
            >
              {[
                { icon: Shield, text: 'Seguro' },
                { icon: Zap, text: 'Rápido' },
                { icon: CheckCircle, text: 'Confiável' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 + (index * 0.1) }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#D946EF]/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-[#D946EF]" />
                  </div>
                  <span className="text-xs text-[#A1A1AA]">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-[#A1A1AA]">
            2025 <span className="text-white font-semibold">SIGMA</span>
          </p>
          <p className="text-xs text-[#71717A]">
            Sistema Integrado de Gestão
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.href = '/'}
            className="text-xs text-[#D946EF] hover:text-[#C026D3] transition-colors"
          >
            ← Voltar para o site
          </motion.button>
        </motion.div>
      </div>

      {/* Dialog de Esqueci minha senha */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Recuperar Senha
            </DialogTitle>
            <DialogDescription>
              Digite seu email para receber instruções de recuperação de senha
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {!resetSuccess ? (
              <>
                {/* Informações sobre o processo */}
                <div className="bg-muted/20 p-4 rounded-lg border border-muted/40">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Como funciona
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Digite o email da sua conta</li>
                    <li>• Receba um link seguro por email</li>
                    <li>• Clique no link para criar nova senha</li>
                    <li>• O link expira em 30 minutos</li>
                  </ul>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email da conta</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="h-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {resetError && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">
                        {resetError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsForgotPasswordOpen(false)}
                      disabled={isResetLoading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isResetLoading}
                      className="bg-primary hover:bg-primary-hover"
                    >
                      {isResetLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Tela de sucesso */
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-success">Email enviado com sucesso!</h3>
                  <p className="text-sm text-muted-foreground">
                    Enviamos instruções de recuperação para:
                  </p>
                  <p className="text-sm font-medium text-foreground bg-muted/30 px-3 py-2 rounded-md">
                    {resetEmail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Verifique sua caixa de entrada e spam. Este diálogo fechará automaticamente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}