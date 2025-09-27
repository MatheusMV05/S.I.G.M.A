import React from 'react';
import { cn } from '@/lib/utils';
import sigmaLogoImg from '../assets/sigma-logo.png';

interface SigmaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'compact';
  hideTextCompletely?: boolean;
}

const sizeClasses = {
  sm: {
    container: 'w-8 h-8',
    text: 'text-sm',
    logoText: 'text-base',
    subtitle: 'text-xs'
  },
  md: {
    container: 'w-12 h-12',
    text: 'text-base',
    logoText: 'text-lg',
    subtitle: 'text-sm'
  },
  lg: {
    container: 'w-16 h-16',
    text: 'text-xl',
    logoText: 'text-2xl',
    subtitle: 'text-base'
  },
  xl: {
    container: 'w-20 h-20',
    text: 'text-3xl',
    logoText: 'text-4xl',
    subtitle: 'text-lg'
  },
  '2xl': {
    container: 'w-24 h-24',
    text: 'text-4xl',
    logoText: 'text-5xl',
    subtitle: 'text-xl'
  }
};

export function SigmaLogo({ 
  size = 'md', 
  className, 
  showText = false,
  variant = 'default',
  hideTextCompletely = false
}: SigmaLogoProps) {
  const sizes = sizeClasses[size];
  
  const logoElement = (
    <div className={cn(
      sizes.container,
      'bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden p-0.5',
      className
    )}>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-sm opacity-50"></div>
      
      {/* Sigma logo image */}
      <img 
        src={sigmaLogoImg} 
        alt="Sigma Logo" 
        className={cn(
          'relative z-10 object-contain mt-3',
          size === 'sm' && 'w-6 h-6',
          size === 'md' && 'w-9 h-9', 
          size === 'lg' && 'w-16 h-16',
          size === 'xl' && 'w-20 h-20',
          size === '2xl' && 'w-24 h-24'
        )}
      />
    </div>
  );

  if (!showText || hideTextCompletely) {
    return logoElement;
  }

  return (
    <div className="flex items-center gap-3">
      {logoElement}
      {variant === 'default' ? (
        <div className="flex flex-col">
          
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