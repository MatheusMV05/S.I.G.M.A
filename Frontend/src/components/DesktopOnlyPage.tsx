import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SigmaLogo } from '@/components/SigmaLogo';
import { Monitor, Smartphone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DesktopOnlyPageProps {
  title: string;
  description: string;
  features?: string[];
  children?: React.ReactNode;
}

export function DesktopOnlyPage({ 
  title, 
  description, 
  features = [],
  children 
}: DesktopOnlyPageProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop Content */}
      <div className="hidden md:block">
        {children}
      </div>

      {/* Mobile Warning */}
      <div className="md:hidden min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <SigmaLogo size="lg" showText className="mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {description}
              </p>
            </div>
          </div>

          {/* Warning Card */}
          <Card className="border-warning/20 bg-warning/5">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="p-3 bg-warning/10 rounded-full">
                  <Smartphone className="h-6 w-6 text-warning" />
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-lg text-warning">
                Acesso via Desktop Recomendado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Esta funcionalidade foi otimizada para telas maiores e oferece melhor experiência em computadores desktop ou tablets.
              </p>

              {features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Recursos disponíveis no desktop:
                  </h4>
                  <ul className="space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    Para acessar esta funcionalidade:
                  </p>
                  <div className="bg-muted/30 rounded-lg p-3 text-left space-y-1">
                    <p className="text-xs text-foreground">
                      <strong>1.</strong> Abra em um computador ou tablet
                    </p>
                    <p className="text-xs text-foreground">
                      <strong>2.</strong> Use resolução mínima de 768px
                    </p>
                    <p className="text-xs text-foreground">
                      <strong>3.</strong> Navegador atualizado recomendado
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                  variant="outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 S.I.G.M.A. - Sistema Integrado de Gestão
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook para detectar se está em mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
