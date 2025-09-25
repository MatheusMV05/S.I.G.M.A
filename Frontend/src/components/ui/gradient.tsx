import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export function GradientText({ children, className, variant = 'primary' }: GradientTextProps) {
  const gradientClasses = {
    primary: 'bg-gradient-to-r from-primary via-primary to-primary/80',
    secondary: 'bg-gradient-to-r from-secondary via-secondary to-secondary/80',
    accent: 'bg-gradient-to-r from-primary via-chart-2 to-chart-3'
  };

  return (
    <span className={cn(
      'bg-clip-text text-transparent font-black tracking-tight',
      gradientClasses[variant],
      className
    )}>
      {children}
    </span>
  );
}

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function GradientCard({ children, className, variant = 'default' }: GradientCardProps) {
  const gradientClasses = {
    default: 'bg-gradient-to-br from-card via-card to-card/50 border-border/30',
    success: 'bg-gradient-to-br from-success/10 via-card to-card/50 border-success/20',
    warning: 'bg-gradient-to-br from-warning/10 via-card to-card/50 border-warning/20',
    error: 'bg-gradient-to-br from-destructive/10 via-card to-card/50 border-destructive/20'
  };

  return (
    <div className={cn(
      'rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg',
      gradientClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedButton({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: AnimatedButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary-hover hover:to-primary-hover/80',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary-hover hover:to-secondary-hover/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
  };

  return (
    <button
      className={cn(
        'font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default {
  GradientText,
  GradientCard,
  AnimatedButton
};