import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User } from 'lucide-react';
import { SigmaLogo } from '@/components/SigmaLogo';

interface MobileHeaderProps {
  showMenuButton?: boolean;
}

export function MobileHeader({ showMenuButton = true }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="mobile-header bg-card/50 backdrop-blur-sm border-b border-border px-4 flex items-center justify-between md:hidden">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <SidebarTrigger className="p-2" />
        )}
        <SigmaLogo size="sm" hideTextCompletely={true} />
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="p-2">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          {user && (
            <div className="text-right hidden xs:block">
              <div className="text-xs font-medium text-foreground truncate max-w-20">
                {user.name.split(' ')[0]}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {user.role === 'admin' ? 'Admin' : 
                 user.role === 'manager' ? 'Gerente' :
                 user.role === 'supervisor' ? 'Supervisor' :
                 user.role === 'cashier' ? 'Caixa' : 'Estoque'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
