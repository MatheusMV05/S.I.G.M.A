import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type NotificationType = 'stock' | 'user_action' | 'system' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  productId?: string;
  actionBy?: string;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Mock data de notificações para simular o sistema
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'stock',
    title: 'Produto em Falta',
    message: 'Óleo de Soja Soya 900ml está sem estoque',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min atrás
    read: false,
    priority: 'critical',
    productId: '7891234567892'
  },
  {
    id: '2',
    type: 'stock',
    title: 'Estoque Baixo',
    message: 'Açúcar Cristal União 1kg está com estoque abaixo do mínimo (8 unidades)',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    read: false,
    priority: 'high',
    productId: '7891234567891'
  },
  {
    id: '3',
    type: 'user_action',
    title: 'Produto Adicionado',
    message: 'Maria Santos adicionou um novo produto: Sabonete Dove 90g',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    read: true,
    priority: 'medium',
    actionBy: 'Maria Santos'
  },
  {
    id: '4',
    type: 'user_action',
    title: 'Preço Alterado',
    message: 'João Silva alterou o preço do Arroz Branco Tio João 5kg de R$ 18,90 para R$ 19,50',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h atrás
    read: false,
    priority: 'medium',
    actionBy: 'João Silva',
    productId: '7891234567890'
  },
  {
    id: '5',
    type: 'user_action',
    title: 'Movimentação de Estoque',
    message: 'Carlos Pereira registrou entrada de 50 unidades de Leite Integral Parmalat 1L',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h atrás
    read: true,
    priority: 'low',
    actionBy: 'Carlos Pereira',
    productId: '7891234567893'
  }
];

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Simular notificações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular verificação de estoque baixo
      checkLowStockProducts();
      
      // Simular ações de outros usuários (apenas para admins)
      if (user?.role === 'ADMIN') {
        simulateUserActions();
      }
    }, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, [user]);

  const checkLowStockProducts = () => {
    // Mock produtos com estoque baixo
    const lowStockProducts = [
      { id: '7891234567894', name: 'Detergente Ypê 500ml', stock: 5, minStock: 12 }
    ];

    lowStockProducts.forEach(product => {
      if (product.stock <= product.minStock) {
        const existingNotification = notifications.find(n => 
          n.type === 'stock' && 
          n.productId === product.id && 
          n.message.includes('estoque abaixo')
        );

        if (!existingNotification) {
          addNotification({
            type: 'stock',
            title: 'Estoque Baixo',
            message: `${product.name} está com estoque abaixo do mínimo (${product.stock} unidades)`,
            priority: 'high',
            productId: product.id
          });
        }
      }
    });
  };

  const simulateUserActions = () => {
    // Simular ações aleatórias de usuários
    const actions = [
      {
        type: 'user_action' as NotificationType,
        title: 'Novo Usuário',
        message: 'Ana Costa foi adicionada como Operador de Caixa',
        priority: 'medium' as const,
        actionBy: 'Sistema'
      },
      {
        type: 'user_action' as NotificationType,
        title: 'Categoria Criada',
        message: 'Pedro Lima criou uma nova categoria: Bebidas Geladas',
        priority: 'low' as const,
        actionBy: 'Pedro Lima'
      }
    ];

    // Chance de 10% de gerar uma nova notificação a cada verificação
    if (Math.random() < 0.1) {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      addNotification(randomAction);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type: NotificationType) => {
    return notifications.filter(notification => notification.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByType
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};