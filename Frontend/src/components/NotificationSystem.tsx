import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  BellRing,
  Package,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Trash2,
  Eye,
  Clock,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/10 hover:bg-red-50 dark:hover:bg-red-950/20';
    case 'high':
      return 'border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/10 hover:bg-orange-50 dark:hover:bg-orange-950/20';
    case 'medium':
      return 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/20';
    case 'low':
      return 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/10 hover:bg-green-50 dark:hover:bg-green-950/20';
    default:
      return 'border-l-4 border-l-muted-foreground/30 bg-muted/20 hover:bg-muted/40';
  }
};

const getNotificationRoute = (type: string, metadata?: any) => {
  switch (type) {
    case 'stock':
      return '/inventory';
    case 'user_action':
      return '/user-management';
    case 'product':
      return '/products';
    case 'customer':
      return '/customers';
    case 'employee':
      return '/employees';
    case 'supplier':
      return '/suppliers';
    case 'category':
      return '/categories';
    case 'promotion':
      return '/promotions';
    case 'report':
      return '/reports';
    case 'pos':
      return '/pos';
    default:
      return '/dashboard';
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'stock':
      return <Package className="h-4 w-4" />;
    case 'user_action':
      return <User className="h-4 w-4" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4" />;
    case 'success':
      return <CheckCircle className="h-4 w-4" />;
    case 'error':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    const route = getNotificationRoute(notification.type, notification.metadata);
    navigate(route);
    setIsOpen(false);
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const recentNotifications = notifications.slice(0, 10);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between py-3">
          <span className="font-semibold">Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs hover:text-primary"
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {recentNotifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Nenhuma notificação</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Você está em dia!</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-1 p-1">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="relative group">
                  <DropdownMenuItem
                    className={`flex flex-col items-start p-3 cursor-pointer transition-all duration-200 ${getPriorityColor(
                      notification.priority
                    )} ${!notification.read ? 'bg-accent/50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-0.5 flex-shrink-0 p-1.5 rounded-full bg-background/80 shadow-sm">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm truncate pr-2">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex items-center gap-2 text-primary hover:text-primary/80"
                onClick={() => {
                  navigate('/dashboard?tab=notifications');
                  setIsOpen(false);
                }}
              >
                <Eye className="h-4 w-4" />
                Ver todas as notificações
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NotificationPanel() {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications,
    getNotificationsByType 
  } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'stock' | 'user_action'>('all');

  const stockNotifications = getNotificationsByType('stock');
  const userActionNotifications = getNotificationsByType('user_action');

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    const route = getNotificationRoute(notification.type, notification.metadata);
    navigate(route);
  };

  const filteredNotifications = () => {
    switch (filter) {
      case 'stock':
        return stockNotifications;
      case 'user_action':
        return userActionNotifications;
      default:
        return notifications;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Centro de Notificações</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {notifications.filter(n => !n.read).length} não lidas de {notifications.length} total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {notifications.some(n => !n.read) && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="hover:bg-green-50 hover:text-green-700 hover:border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={clearAllNotifications} className="hover:bg-red-50 hover:text-red-700 hover:border-red-200">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar todas
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-1">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'shadow-sm' : 'hover:bg-accent'}
          >
            Todas ({notifications.length})
          </Button>
          <Button 
            variant={filter === 'stock' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('stock')}
            className={filter === 'stock' ? 'shadow-sm' : 'hover:bg-accent'}
          >
            <Package className="h-4 w-4 mr-1" />
            Estoque ({stockNotifications.length})
          </Button>
          <Button 
            variant={filter === 'user_action' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('user_action')}
            className={filter === 'user_action' ? 'shadow-sm' : 'hover:bg-accent'}
          >
            <User className="h-4 w-4 mr-1" />
            Atividades ({userActionNotifications.length})
          </Button>
        </div>
      </Card>

      {/* Lista de Notificações Filtradas */}
      {filteredNotifications().length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications().map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group ${
                !notification.read ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-0">
                <div className={`p-5 rounded-lg ${getPriorityColor(notification.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1 flex-shrink-0 p-2.5 rounded-full bg-white dark:bg-gray-800 shadow-md border">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm pr-2 text-foreground">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1 animate-pulse ring-2 ring-primary/30"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-muted-foreground flex items-center gap-2 bg-background/50 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp.toLocaleString('pt-BR')}
                          </span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-muted-foreground font-medium">Clique para acessar</span>
                            <ExternalLink className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-all hover:bg-green-100 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-lg text-muted-foreground mb-2">
              Nenhuma notificação encontrada
            </h3>
            <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto">
              {filter === 'all' ? 'Você não tem notificações no momento. Quando houver novidades, elas aparecerão aqui.' :
               filter === 'stock' ? 'Nenhum alerta de estoque no momento. Seus níveis de inventário estão adequados.' :
               'Nenhuma atividade de usuário recente. As ações dos usuários serão exibidas aqui.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}