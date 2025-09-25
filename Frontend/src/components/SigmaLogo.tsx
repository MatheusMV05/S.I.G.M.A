import React from 'react';
import { cn } from '@/lib/utils';

interface SigmaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'compact';
}

const sizeClasses = {
  sm: {
    container: 'w-6 h-6',
    text: 'text-xs',
    logoText: 'text-sm',
    subtitle: 'text-xs'
  },
  md: {
    container: 'w-8 h-8',
    text: 'text-sm',
    logoText: 'text-base',
    subtitle: 'text-xs'
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-lg',
    logoText: 'text-xl',
    subtitle: 'text-sm'
  },
  xl: {
    container: 'w-16 h-16',
    text: 'text-2xl',
    logoText: 'text-3xl',
    subtitle: 'text-base'
  }
};

export function SigmaLogo({ 
  size = 'md', 
  className, 
  showText = false,
  variant = 'default'
}: SigmaLogoProps) {
  const sizes = sizeClasses[size];
  
  const logoElement = (
    <div className={cn(
      sizes.container,
      'bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden',
      className
    )}>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-sm opacity-50"></div>
      
      {/* Sigma symbol */}
      <span className={cn(
        sizes.text,
        'font-black text-primary-foreground tracking-wider relative z-10'
      )}>
        Σ
      </span>
    </div>
  );

  if (!showText) {
    return logoElement;
  }

  return (
    <div className="flex items-center gap-3">
      {logoElement}
      {variant === 'default' ? (
        <div className="flex flex-col">
          <span className={cn(sizes.logoText, 'font-black text-foreground tracking-tight')}>
            S.I.G.M.A.
          </span>
          <span className={cn(sizes.subtitle, 'text-muted-foreground/80 font-medium uppercase tracking-wide')}>
            Sistema Empresarial
          </span>
        </div>
      ) : (
        <span className={cn(sizes.logoText, 'font-black text-foreground tracking-tight')}>
          S.I.G.M.A.
        </span>
      )}
    </div>
  );
}

export default SigmaLogo;