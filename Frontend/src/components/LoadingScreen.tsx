import React from 'react';
import { SigmaLogo } from '@/components/SigmaLogo';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  variant?: 'default' | 'compact' | 'fullscreen';
  showLogo?: boolean;
}

export function LoadingScreen({ 
  message = "Carregando...", 
  submessage,
  variant = 'default',
  showLogo = true 
}: LoadingScreenProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <div>
            <p className="font-medium text-foreground">{message}</p>
            {submessage && (
              <p className="text-sm text-muted-foreground">{submessage}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center space-y-6 animate-fade-in">
          {showLogo && (
            <div className="mb-8">
              <SigmaLogo size="xl" showText className="mx-auto animate-glow" />
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h2 className="text-2xl font-bold text-foreground">{message}</h2>
            </div>
            
            {submessage && (
              <p className="text-muted-foreground text-lg">{submessage}</p>
            )}
          </div>

          {/* Barra de progresso animada */}
          <div className="w-64 mx-auto">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant 'default'
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        {showLogo && (
          <SigmaLogo size="lg" showText className="mx-auto opacity-80" />
        )}
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-lg font-semibold text-foreground">{message}</p>
          </div>
          
          {submessage && (
            <p className="text-muted-foreground">{submessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para loading de transição de página
export function PageTransitionLoader() {
  return (
    <LoadingScreen 
      variant="fullscreen"
      message="Carregando seu dashboard..."
      submessage="Preparando a melhor experiência para você"
    />
  );
}

// Componente para skeleton de tabelas
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-4 bg-muted rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="h-8 bg-muted/50 rounded animate-pulse"
              style={{ animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Componente para skeleton de cards
export function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-8 w-8 bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted/60 rounded w-1/2" />
      </div>
    </div>
  );
}

// Componente para skeleton de gráficos
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
      <div 
        className="bg-muted/30 rounded-lg animate-pulse flex items-end justify-center gap-2 p-4"
        style={{ height: `${height}px` }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted rounded-t"
            style={{
              width: '20px',
              height: `${Math.random() * 80 + 20}%`,
              animationDelay: `${i * 100}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
}
