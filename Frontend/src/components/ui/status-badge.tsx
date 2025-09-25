import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  active: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    dot: 'bg-success'
  },
  inactive: {
    bg: 'bg-muted/30',
    border: 'border-muted-foreground/20',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground'
  },
  pending: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    text: 'text-warning',
    dot: 'bg-warning'
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/20',
    text: 'text-success',
    dot: 'bg-success'
  },
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    text: 'text-destructive',
    dot: 'bg-destructive'
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    text: 'text-warning',
    dot: 'bg-warning'
  }
};

const sizeConfig = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    dot: 'w-1.5 h-1.5',
    icon: 'w-3 h-3'
  },
  md: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    dot: 'w-2 h-2',
    icon: 'w-4 h-4'
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-base',
    dot: 'w-2.5 h-2.5',
    icon: 'w-5 h-5'
  }
};

export function StatusBadge({ 
  status, 
  children, 
  icon: Icon, 
  className, 
  size = 'md' 
}: StatusBadgeProps) {
  const statusStyles = statusConfig[status];
  const sizeStyles = sizeConfig[size];

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-full border font-medium backdrop-blur-sm transition-all duration-200',
      statusStyles.bg,
      statusStyles.border,
      statusStyles.text,
      sizeStyles.padding,
      sizeStyles.text,
      className
    )}>
      {/* Status dot with pulse animation for active states */}
      <div className={cn(
        'rounded-full',
        sizeStyles.dot,
        statusStyles.dot,
        (status === 'active' || status === 'pending') && 'animate-pulse'
      )} />
      
      {/* Optional icon */}
      {Icon && (
        <Icon className={cn(sizeStyles.icon)} />
      )}
      
      {/* Badge content */}
      <span className="font-semibold">
        {children}
      </span>
    </div>
  );
}

export default StatusBadge;