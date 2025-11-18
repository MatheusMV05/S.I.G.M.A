import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Award,
  PackageX,
  ArrowUpCircle,
  Crown,
  RefreshCw,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Zap,
  Brain,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProdutosNuncaVendidos, useProdutosAcimaMedia, useClientesVIP } from '@/hooks/useReports';
import {
  useSazonalidadeMensal,
  useSazonalidadeSemanal,
  useSazonalidadeHoraria,
  useProdutosBaixaRotatividade,
  useAnaliseABC
} from '@/hooks/useInsights';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

export default function Insights() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('strategic');
  const [periodoDias, setPeriodoDias] = useState(60);

  // Hooks existentes
  const { data: produtosNuncaVendidos, isLoading: loadingNuncaVendidos, refetch: refetchNuncaVendidos } = useProdutosNuncaVendidos(20);
  const { data: produtosAcimaMedia, isLoading: loadingAcimaMedia, refetch: refetchAcimaMedia } = useProdutosAcimaMedia(15);
  const { data: clientesVIP, isLoading: loadingVIP, refetch: refetchVIP } = useClientesVIP(15);

  // Novos hooks de insights avançados
  const { data: sazonalidadeMensal, isLoading: loadingSazonalidadeMensal } = useSazonalidadeMensal(periodoDias);
  const { data: sazonalidadeSemanal, isLoading: loadingSazonalidadeSemanal } = useSazonalidadeSemanal(periodoDias);
  const { data: sazonalidadeHoraria, isLoading: loadingSazonalidadeHoraria } = useSazonalidadeHoraria(periodoDias);
  const { data: produtosBaixaRotatividade, isLoading: loadingBaixaRotatividade } = useProdutosBaixaRotatividade(20);
  const { data: analiseABC, isLoading: loadingAnaliseABC } = useAnaliseABC(periodoDias);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DesktopOnlyPage
      title="Insights Estratégicos"
      description="Análises inteligentes e insights avançados baseados em dados para tomada de decisão estratégica."
      features={[
        "Identificação de produtos parados sem vendas",
        "Análise de produtos premium acima da média",
        "Segmentação de clientes VIP por valor",
        "Insights de sazonalidade e tendências (em breve)",
        "Correlação categoria-horário de vendas (em breve)",
        "Análise ABC de produtos (em breve)",
        "Previsão de demanda e estoque (em breve)"
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              Insights Estratégicos
            </h1>
            <p className="text-muted-foreground mt-1">
              Análises inteligentes para decisões mais assertivas
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              refetchNuncaVendidos();
              refetchAcimaMedia();
              refetchVIP();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>

        {/* Tabs de Insights */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategic" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Insights Estratégicos
            </TabsTrigger>
            <TabsTrigger value="seasonality" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Sazonalidade
            </TabsTrigger>
            <TabsTrigger value="abc" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Análise ABC
            </TabsTrigger>
          </TabsList>

          {/* Tab: Insights Estratégicos */}
          <TabsContent value="strategic" className="space-y-6">
            {/* Grid de Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Produtos Nunca Vendidos (ANTI JOIN) */}
              <Card className="border-orange-200 dark:border-orange-800 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PackageX className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Produtos Nunca Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  {loadingNuncaVendidos ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : produtosNuncaVendidos && produtosNuncaVendidos.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50">
                      {produtosNuncaVendidos.map((produto) => (
                        <div key={produto.idProduto} className="p-3 border rounded-lg hover:bg-orange-200/50 dark:hover:bg-orange-950/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm line-clamp-1">{produto.produtoNome}</p>
                              <p className="text-xs text-muted-foreground">{produto.categoriaNome}</p>
                            </div>
                            <Badge variant="destructive" className="text-xs">Parado</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Estoque:</span>
                              <p className="font-semibold">{produto.quantidadeEstoque} un</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Valor parado:</span>
                              <p className="font-semibold text-orange-600 dark:text-orange-400">{formatCurrency(produto.valorEstoqueParado)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <PackageX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum produto parado encontrado</p>
                      <p className="text-xs mt-1">Todos os produtos geraram vendas!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card 2: Produtos Acima da Média (SUBCONSULTA) */}
              <Card className="border-blue-200 dark:border-blue-800 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowUpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Produtos Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  {loadingAcimaMedia ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : produtosAcimaMedia && produtosAcimaMedia.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
                      {produtosAcimaMedia.map((produto) => (
                        <div key={produto.idProduto} className="p-3 border rounded-lg hover:bg-blue-200/50 dark:hover:bg-blue-950/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm line-clamp-1">{produto.produtoNome}</p>
                              <p className="text-xs text-muted-foreground">{produto.categoriaNome}</p>
                            </div>
                            <Badge variant="default" className="text-xs bg-blue-600">
                              +{produto.percentualAcimaMedia.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Preço:</span>
                              <p className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(produto.precoVenda)}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Acima em:</span>
                              <p className="font-semibold">{formatCurrency(produto.diferencaMedia)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ArrowUpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum produto premium encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card 3: Clientes VIP (SUBCONSULTA) */}
              <Card className="border-purple-200 dark:border-purple-800 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Clientes VIP
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  {loadingVIP ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : clientesVIP && clientesVIP.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                      {clientesVIP.map((cliente) => (
                        <div key={cliente.idCliente} className="p-3 border rounded-lg hover:bg-purple-200/50 dark:hover:bg-purple-950/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm line-clamp-1">{cliente.clienteNome}</p>
                              <p className="text-xs text-muted-foreground">{cliente.totalCompras} compras</p>
                            </div>
                            <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Total gasto:</span>
                              <p className="font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(cliente.valorTotalGasto)}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Ticket médio:</span>
                              <p className="font-semibold">{formatCurrency(cliente.ticketMedio)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Crown className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum cliente VIP encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumo Estatístico */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Estatístico dos Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-2">
                      <PackageX className="h-5 w-5 text-orange-700 dark:text-orange-400" />
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100">Produtos Parados</h4>
                    </div>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                      {produtosNuncaVendidos?.length || 0}
                    </p>
                    <p className="text-sm text-orange-800 dark:text-orange-300 mt-1">
                      Valor total: {formatCurrency(
                        produtosNuncaVendidos?.reduce((sum, p) => sum + p.valorEstoqueParado, 0) || 0
                      )}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-2">
                      <ArrowUpCircle className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">Produtos Premium</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {produtosAcimaMedia?.length || 0}
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                      Média de preço: {formatCurrency(
                        produtosAcimaMedia?.reduce((sum, p) => sum + p.precoVenda, 0) / (produtosAcimaMedia?.length || 1) || 0
                      )}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">Clientes VIP</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {clientesVIP?.length || 0}
                    </p>
                    <p className="text-sm text-purple-800 dark:text-purple-300 mt-1">
                      Faturamento total: {formatCurrency(
                        clientesVIP?.reduce((sum, c) => sum + c.valorTotalGasto, 0) || 0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tabs futuras: Sazonalidade, Correlações, Previsões */}
          <TabsContent value="seasonality" className="space-y-6">
            {/* Filtro de período */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Análise de Sazonalidade de Vendas</h3>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Período:</label>
                <select 
                  value={periodoDias}
                  onChange={(e) => setPeriodoDias(Number(e.target.value))}
                  className="px-3 py-1 rounded-md border border-border bg-background text-sm"
                >
                  <option value={30}>30 dias</option>
                  <option value={60}>60 dias</option>
                  <option value={90}>90 dias</option>
                  <option value={180}>180 dias</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico: Sazonalidade Horária */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Vendas por Hora do Dia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSazonalidadeHoraria ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-sm text-muted-foreground">Carregando dados...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={sazonalidadeHoraria || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                        <XAxis dataKey="periodo" stroke="#888" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="quantidadeVendas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico: Sazonalidade Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Tendência Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSazonalidadeMensal ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-sm text-muted-foreground">Carregando dados...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={sazonalidadeMensal || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                        <XAxis dataKey="periodo" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="valorTotalVendas" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Card de Produtos com Baixa Rotatividade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageX className="h-5 w-5 text-orange-500" />
                  Produtos com Baixa Rotatividade
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Produtos que vendem pouco em relação ao estoque disponível (rotatividade &lt; 30%)
                </p>
              </CardHeader>
              <CardContent>
                {loadingBaixaRotatividade ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : produtosBaixaRotatividade && produtosBaixaRotatividade.length > 0 ? (
                  <div className="space-y-3">
                    {produtosBaixaRotatividade.slice(0, 10).map((produto: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{produto.nomeProduto}</p>
                            <p className="text-xs text-muted-foreground">{produto.categoriaNome}</p>
                          </div>
                          <Badge variant="warning" className="text-xs">
                            {(produto.taxaRotatividade * 100).toFixed(1)}% rotatividade
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Estoque:</span>
                            <p className="font-semibold">{produto.estoqueAtual} un</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vendidos (30d):</span>
                            <p className="font-semibold">{produto.quantidadeVendidaUltimos30Dias} un</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Dias p/ zerar:</span>
                            <p className="font-semibold">{produto.diasParaZerarEstoque > 365 ? '365+' : Math.round(produto.diasParaZerarEstoque)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Valor parado:</span>
                            <p className="font-semibold text-orange-600">{formatCurrency(produto.valorEstoqueParado)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PackageX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum produto com baixa rotatividade encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Análise ABC */}
          <TabsContent value="abc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Análise ABC - Curva de Pareto
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Classificação de produtos: Classe A (80% do faturamento), B (15%), C (5%)
                </p>
              </CardHeader>
              <CardContent>
                {loadingAnaliseABC ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-sm text-muted-foreground">Carregando análise ABC...</div>
                  </div>
                ) : analiseABC && analiseABC.length > 0 ? (
                  <>
                    {/* Resumo por Classe */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Card className="border-purple-200 dark:border-purple-800">
                        <CardContent className="p-4 text-center">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Classe A</h4>
                          <p className="text-3xl font-bold text-purple-600">
                            {analiseABC.filter((p: any) => p.classificacaoABC === 'A').length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">80% do faturamento</p>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4 text-center">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Classe B</h4>
                          <p className="text-3xl font-bold text-blue-600">
                            {analiseABC.filter((p: any) => p.classificacaoABC === 'B').length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">15% do faturamento</p>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200 dark:border-gray-800">
                        <CardContent className="p-4 text-center">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Classe C</h4>
                          <p className="text-3xl font-bold text-gray-600">
                            {analiseABC.filter((p: any) => p.classificacaoABC === 'C').length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">5% do faturamento</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Lista de Produtos por Classificação */}
                    <div className="space-y-6">
                      {['A', 'B', 'C'].map((classe) => {
                        const produtos = analiseABC.filter((p: any) => p.classificacaoABC === classe);
                        const corClasse = classe === 'A' ? 'purple' : classe === 'B' ? 'blue' : 'gray';
                        
                        return produtos.length > 0 && (
                          <div key={classe}>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Badge className={`bg-${corClasse}-600`}>Classe {classe}</Badge>
                              <span className="text-sm text-muted-foreground">
                                ({produtos.length} produtos)
                              </span>
                            </h4>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                              {produtos.map((produto: any, index: number) => (
                                <div key={index} className={`p-3 border border-${corClasse}-200 dark:border-${corClasse}-800 rounded-lg hover:bg-${corClasse}-200/30 dark:hover:bg-${corClasse}-950/50 transition-colors`}>
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{produto.nomeProduto}</p>
                                      <p className="text-xs text-muted-foreground">{produto.categoriaNome}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-success">
                                        {formatCurrency(produto.faturamentoTotal)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {produto.percentualFaturamento.toFixed(2)}% do total
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">Ranking:</span>
                                      <span className="font-semibold ml-1">#{produto.rankingFaturamento}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Qtd Vendida:</span>
                                      <span className="font-semibold ml-1">{produto.quantidadeVendida} un</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Acumulado:</span>
                                      <span className="font-semibold ml-1">{produto.percentualAcumulado.toFixed(1)}%</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Sem dados suficientes para análise ABC</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Análise de Correlações</h3>
                <p className="text-muted-foreground mb-4">
                  Em breve: Correlação entre categorias, horários de pico e métodos de pagamento
                </p>
                <Badge variant="outline">Em desenvolvimento</Badge>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Previsões e Tendências</h3>
                <p className="text-muted-foreground mb-4">
                  Em breve: Previsão de demanda, análise ABC e sugestões de reposição
                </p>
                <Badge variant="outline">Em desenvolvimento</Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopOnlyPage>
  );
}
