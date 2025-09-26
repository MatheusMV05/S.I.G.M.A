import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GradientCard } from '@/components/ui/gradient';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Search, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

const iconMap = {
  cart: ShoppingCart,
  package: Package,
  users: Users,
  file: FileText,
  search: Search,
  plus: Plus,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  sparkles: Sparkles
};

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  size = 'md',
  showAnimation = true
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'h-8 w-8',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      container: 'p-8',
      icon: 'h-12 w-12',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4'
    },
    lg: {
      container: 'p-12',
      icon: 'h-16 w-16',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6'
    }
  };

  const variantClasses = {
    default: {
      icon: 'text-muted-foreground',
      title: 'text-foreground',
      description: 'text-muted-foreground'
    },
    success: {
      icon: 'text-success',
      title: 'text-success',
      description: 'text-muted-foreground'
    },
    warning: {
      icon: 'text-warning',
      title: 'text-warning',
      description: 'text-muted-foreground'
    },
    info: {
      icon: 'text-primary',
      title: 'text-primary',
      description: 'text-muted-foreground'
    }
  };

  const Icon = IconComponent || iconMap.info;
  const classes = sizeClasses[size];
  const colors = variantClasses[variant];

  return (
    <div className={`text-center ${classes.container} ${showAnimation ? 'animate-fade-in' : ''}`}>
      <div className={classes.spacing}>
        <div className="flex justify-center">
          <div className={`${colors.icon} ${showAnimation ? 'animate-float' : ''}`}>
            <Icon className={`${classes.icon} opacity-60`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className={`font-semibold ${classes.title} ${colors.title}`}>
            {title}
          </h3>
          <p className={`${classes.description} ${colors.description} max-w-md mx-auto leading-relaxed`}>
            {description}
          </p>
        </div>
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className={`
              transition-all duration-200 hover:scale-105 hover:shadow-lg
              ${showAnimation ? 'animate-fade-in' : ''}
            `}
            style={{ animationDelay: '0.3s' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// Componentes pré-configurados para casos comuns
export function EmptyCart({ onAddProducts }: { onAddProducts?: () => void }) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Carrinho vazio"
      description="Adicione produtos para iniciar uma nova venda. Use o leitor de código de barras ou busque pelo nome do produto."
      actionLabel="Buscar Produtos"
      onAction={onAddProducts}
      variant="default"
    />
  );
}

export function EmptyProducts({ onAddProduct }: { onAddProduct?: () => void }) {
  return (
    <GradientCard>
      <EmptyState
        icon={Package}
        title="Nenhum produto encontrado"
        description="Não encontramos produtos com os critérios de busca. Tente ajustar os filtros ou cadastre um novo produto."
        actionLabel="Cadastrar Produto"
        onAction={onAddProduct}
        variant="info"
      />
    </GradientCard>
  );
}

export function EmptyCustomers({ onAddCustomer }: { onAddCustomer?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Nenhum cliente cadastrado"
      description="Comece cadastrando seus primeiros clientes para acompanhar o histórico de compras e oferecer um atendimento personalizado."
      actionLabel="Cadastrar Cliente"
      onAction={onAddCustomer}
      variant="info"
    />
  );
}

export function EmptySearch({ searchTerm, onClearSearch }: { searchTerm: string; onClearSearch?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${searchTerm}". Tente usar termos diferentes ou verifique a ortografia.`}
      actionLabel="Limpar Busca"
      onAction={onClearSearch}
      variant="default"
    />
  );
}

export function EmptyReports({ onCreateReport }: { onCreateReport?: () => void }) {
  return (
    <GradientCard>
      <EmptyState
        icon={FileText}
        title="Nenhum relatório disponível"
        description="Gere relatórios detalhados sobre vendas, estoque e desempenho para tomar decisões mais inteligentes."
        actionLabel="Gerar Relatório"
        onAction={onCreateReport}
        variant="info"
        size="lg"
      />
    </GradientCard>
  );
}

export function EmptyPromotions({ onCreatePromotion }: { onCreatePromotion?: () => void }) {
  return (
    <GradientCard variant="default">
      <EmptyState
        icon={Sparkles}
        title="Nenhuma promoção ativa"
        description="Crie promoções atrativas para impulsionar suas vendas e fidelizar clientes. Defina descontos, períodos e produtos específicos."
        actionLabel="Criar Promoção"
        onAction={onCreatePromotion}
        variant="info"
        size="lg"
      />
    </GradientCard>
  );
}

export function LoadingEmptyState() {
  return (
    <div className="text-center p-8 space-y-4">
      <div className="flex justify-center">
        <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-muted rounded w-48 mx-auto animate-pulse" />
        <div className="h-4 bg-muted/60 rounded w-64 mx-auto animate-pulse" />
      </div>
    </div>
  );
}

export function ErrorEmptyState({ 
  onRetry, 
  error = "Ocorreu um erro ao carregar os dados" 
}: { 
  onRetry?: () => void;
  error?: string;
}) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Erro ao carregar"
      description={error}
      actionLabel="Tentar Novamente"
      onAction={onRetry}
      variant="warning"
    />
  );
}
