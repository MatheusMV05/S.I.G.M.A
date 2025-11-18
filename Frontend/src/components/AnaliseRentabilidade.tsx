import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Package, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useInventarioRentabilidade, useAltaRentabilidade, useRentabilidadeCritica } from '@/hooks/useInventarioRentabilidade';
import { InventarioRentabilidadeDTO } from '@/services/inventarioRentabilidadeService';

/**
 * Componente para exibir análise de rentabilidade de produtos
 * Integra a VIEW vw_inventario_rentabilidade na página de Produtos
 */
export function AnaliseRentabilidade() {
  const [activeTab, setActiveTab] = useState('todos');
  
  const { data: inventarioCompleto, isLoading: loadingCompleto } = useInventarioRentabilidade();
  const { data: altaRentabilidade, isLoading: loadingAlta } = useAltaRentabilidade();
  const { data: rentabilidadeCritica, isLoading: loadingCritica } = useRentabilidadeCritica();

  // Função para renderizar badge de rentabilidade
  const getRentabilidadeBadge = (classificacao: string) => {
    const configs = {
      'ALTA RENTABILIDADE': { variant: 'default' as const, icon: TrendingUp, color: 'text-green-600' },
      'RENTABILIDADE MÉDIA': { variant: 'secondary' as const, icon: Target, color: 'text-blue-600' },
      'RENTABILIDADE BAIXA': { variant: 'outline' as const, icon: TrendingDown, color: 'text-orange-600' },
      'RENTABILIDADE CRÍTICA': { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' }
    };
    
    const config = configs[classificacao as keyof typeof configs] || configs['RENTABILIDADE MÉDIA'];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {classificacao}
      </Badge>
    );
  };

  // Função para renderizar badge de status de estoque
  const getStatusEstoqueBadge = (status: string) => {
    const configs = {
      'CRÍTICO - SEM ESTOQUE': { variant: 'destructive' as const, icon: AlertTriangle },
      'ALERTA - ESTOQUE BAIXO': { variant: 'outline' as const, icon: AlertTriangle },
      'ATENÇÃO - ESTOQUE ALTO': { variant: 'secondary' as const, icon: Package },
      'ESTOQUE NORMAL': { variant: 'default' as const, icon: Package }
    };
    
    const config = configs[status as keyof typeof configs] || configs['ESTOQUE NORMAL'];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  // Componente de tabela reutilizável
  const RentabilidadeTable = ({ data, loading }: { data?: InventarioRentabilidadeDTO[], loading: boolean }) => {
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
          <AlertDescription>Nenhum produto encontrado.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="text-right">Margem</TableHead>
              <TableHead className="text-right">Lucro Unit.</TableHead>
              <TableHead className="text-right">Lucro Potencial</TableHead>
              <TableHead>Rentabilidade</TableHead>
              <TableHead>Status Estoque</TableHead>
              <TableHead>Ação Recomendada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.idProduto}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.produtoNome}</div>
                    {item.marca && <div className="text-sm text-muted-foreground">{item.marca}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.categoriaNome}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">{item.estoque}</div>
                  <div className="text-xs text-muted-foreground">
                    Min: {item.estoqueMinimo} | Max: {item.estoqueMaximo}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {(item.margemLucroPercentual || 0) >= 30 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">{(item.margemLucroPercentual || 0).toFixed(1)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium text-green-600">
                    R$ {(item.lucroUnitario || 0).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <div className="font-medium text-green-600">
                      R$ {(item.lucroPotencialEstoque || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Valor: R$ {(item.valorEstoqueVenda || 0).toFixed(2)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getRentabilidadeBadge(item.classificacaoRentabilidade)}
                </TableCell>
                <TableCell>
                  {getStatusEstoqueBadge(item.statusEstoque)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {item.acaoRecomendada !== 'Estoque adequado' ? (
                      <Badge variant="outline" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {item.acaoRecomendada}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">{item.acaoRecomendada}</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Calcular métricas resumidas
  const calcularMetricas = (data?: InventarioRentabilidadeDTO[]) => {
    if (!data || data.length === 0) return null;

    const totalLucroPotencial = data.reduce((sum, item) => sum + (item.lucroPotencialEstoque || 0), 0);
    const margemMedia = data.reduce((sum, item) => sum + (item.margemLucroPercentual || 0), 0) / data.length;
    const produtosEstoqueBaixo = data.filter(item => 
      item.statusEstoque === 'CRÍTICO - SEM ESTOQUE' || item.statusEstoque === 'ALERTA - ESTOQUE BAIXO'
    ).length;

    return { totalLucroPotencial, margemMedia, produtosEstoqueBaixo };
  };

  const metricas = calcularMetricas(inventarioCompleto);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Análise de Rentabilidade
        </CardTitle>
        <CardDescription>
          Visão detalhada da rentabilidade e performance dos produtos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas Resumidas */}
        {metricas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  R$ {metricas.totalLucroPotencial.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Lucro Potencial Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {metricas.margemMedia.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Margem Média</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">
                  {metricas.produtosEstoqueBaixo}
                </div>
                <p className="text-xs text-muted-foreground">Produtos com Estoque Baixo</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs de Análise */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todos">Todos os Produtos</TabsTrigger>
            <TabsTrigger value="alta">Alta Rentabilidade</TabsTrigger>
            <TabsTrigger value="critica">Rentabilidade Crítica</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="space-y-4">
            <RentabilidadeTable data={inventarioCompleto} loading={loadingCompleto} />
          </TabsContent>
          
          <TabsContent value="alta" className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Produtos com margem de lucro igual ou superior a 50%
              </AlertDescription>
            </Alert>
            <RentabilidadeTable data={altaRentabilidade} loading={loadingAlta} />
          </TabsContent>
          
          <TabsContent value="critica" className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Produtos com margem de lucro inferior a 15% - Requerem atenção!
              </AlertDescription>
            </Alert>
            <RentabilidadeTable data={rentabilidadeCritica} loading={loadingCritica} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
