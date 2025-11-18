import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  User, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Calendar,
  CreditCard,
  Award
} from 'lucide-react';
import { useAnaliseVendasCompleta, useTopVendas, useVendasComAltoDesconto } from '@/hooks/useAnaliseVendas';
import { AnaliseVendasCompletaDTO } from '@/services/analiseVendasService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Componente para exibir análise detalhada de vendas
 * Integra a VIEW vw_analise_vendas_completa no Dashboard
 */
export function AnaliseVendasDetalhada() {
  const [activeTab, setActiveTab] = useState('recentes');
  const [diasAnalise, setDiasAnalise] = useState(30);
  
  const { data: vendasRecentes, isLoading: loadingRecentes } = useAnaliseVendasCompleta(diasAnalise);
  const { data: topVendas, isLoading: loadingTop } = useTopVendas(10);
  const { data: vendasDesconto, isLoading: loadingDesconto } = useVendasComAltoDesconto(10);

  // Função para formatar data
  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      return format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dataStr;
    }
  };

  // Função para renderizar badge de método de pagamento
  const getMetodoPagamentoBadge = (metodo: string) => {
    const configs: Record<string, { variant: any, icon: any }> = {
      'DINHEIRO': { variant: 'default', icon: DollarSign },
      'CARTAO_CREDITO': { variant: 'secondary', icon: CreditCard },
      'CARTAO_DEBITO': { variant: 'outline', icon: CreditCard },
      'PIX': { variant: 'default', icon: TrendingUp },
    };
    
    const config = configs[metodo] || { variant: 'outline', icon: CreditCard };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {metodo?.replace('_', ' ')}
      </Badge>
    );
  };

  // Componente de tabela reutilizável
  const VendasTable = ({ data, loading, showDesconto = false }: { 
    data?: AnaliseVendasCompletaDTO[], 
    loading: boolean,
    showDesconto?: boolean 
  }) => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Alert>
          <AlertDescription>Nenhuma venda encontrada.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              {showDesconto && <TableHead className="text-right">Desconto</TableHead>}
              <TableHead className="text-right">Valor Final</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Itens</TableHead>
              <TableHead className="text-right">Ticket Médio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((venda) => (
              <TableRow key={venda.idVenda}>
                <TableCell className="font-medium">#{venda.idVenda}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div className="text-sm">
                      {formatarData(venda.dataVenda)}
                      <div className="text-xs text-muted-foreground">
                        {venda.diaSemanaVenda} - {venda.horaVenda}h
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{venda.clienteNome}</div>
                      <div className="text-xs text-muted-foreground">
                        {venda.clienteCidade} - Ranking: {venda.rankingCliente}⭐
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{venda.vendedorNome}</div>
                    <div className="text-xs text-muted-foreground">{venda.vendedorCargo}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">
                    R$ {(venda.valorTotal || 0).toFixed(2)}
                  </span>
                </TableCell>
                {showDesconto && (
                  <TableCell className="text-right">
                    <div>
                      <div className="font-medium text-orange-600">
                        R$ {(venda.desconto || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(venda.percentualDesconto || 0).toFixed(1)}%
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <span className="font-bold text-green-600">
                    R$ {(venda.valorFinal || 0).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  {getMetodoPagamentoBadge(venda.metodoPagamento)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{venda.quantidadeItens || 0} itens</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">
                    R$ {(venda.valorMedioItem || 0).toFixed(2)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Calcular métricas resumidas
  const calcularMetricas = (data?: AnaliseVendasCompletaDTO[]) => {
    if (!data || data.length === 0) return null;

    const totalVendas = data.length;
    const valorTotal = data.reduce((sum, v) => sum + (v.valorFinal || 0), 0);
    const descontoTotal = data.reduce((sum, v) => sum + (v.desconto || 0), 0);
    const ticketMedio = valorTotal / totalVendas;

    return { totalVendas, valorTotal, descontoTotal, ticketMedio };
  };

  const metricas = calcularMetricas(vendasRecentes);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Análise Detalhada de Vendas
        </CardTitle>
        <CardDescription>
          Visão completa das vendas com dados de clientes, vendedores e métricas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas Resumidas */}
        {metricas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {metricas.totalVendas}
                </div>
                <p className="text-xs text-muted-foreground">Total de Vendas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  R$ {metricas.valorTotal.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Valor Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">
                  R$ {metricas.descontoTotal.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Descontos Concedidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  R$ {metricas.ticketMedio.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Ticket Médio</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs de Análise */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recentes">Vendas Recentes</TabsTrigger>
            <TabsTrigger value="top">Top Vendas</TabsTrigger>
            <TabsTrigger value="desconto">Alto Desconto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recentes" className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">
                Últimas {diasAnalise} dias
              </span>
            </div>
            <VendasTable data={vendasRecentes} loading={loadingRecentes} />
          </TabsContent>
          
          <TabsContent value="top" className="space-y-4">
            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                As 10 maiores vendas dos últimos 30 dias
              </AlertDescription>
            </Alert>
            <VendasTable data={topVendas} loading={loadingTop} />
          </TabsContent>
          
          <TabsContent value="desconto" className="space-y-4">
            <Alert variant="default">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Vendas com desconto igual ou superior a 10%
              </AlertDescription>
            </Alert>
            <VendasTable data={vendasDesconto} loading={loadingDesconto} showDesconto={true} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
