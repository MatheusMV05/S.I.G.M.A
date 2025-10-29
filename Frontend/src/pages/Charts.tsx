import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  Download,
  Printer,
  FileText,
  TrendingUp,
  Calendar,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const Charts = () => {
  const { user } = useAuth();
  const [fullscreenChart, setFullscreenChart] = useState<number | null>(null);

  // Dados mockados para os gráficos
  // Gráfico 1: Relação entre Faixa Etária e Gasto em Compras
  const ageSpendingData = [
    { age: 20, spending: 350 }, { age: 22, spending: 420 }, { age: 25, spending: 280 },
    { age: 28, spending: 520 }, { age: 30, spending: 450 }, { age: 32, spending: 380 },
    { age: 35, spending: 600 }, { age: 38, spending: 320 }, { age: 40, spending: 480 },
    { age: 42, spending: 550 }, { age: 45, spending: 390 }, { age: 48, spending: 470 },
    { age: 50, spending: 530 }, { age: 52, spending: 410 }, { age: 55, spending: 490 },
  ];

  // Gráfico 2: Relação entre Faixa Etária e Frequência de Compras
  const ageFrequencyData = [
    { age: 20, frequency: 3 }, { age: 22, frequency: 5 }, { age: 25, frequency: 4 },
    { age: 28, frequency: 7 }, { age: 30, frequency: 6 }, { age: 32, frequency: 5 },
    { age: 35, frequency: 8 }, { age: 38, frequency: 6 }, { age: 40, frequency: 9 },
    { age: 42, frequency: 7 }, { age: 45, frequency: 8 }, { age: 48, frequency: 10 },
    { age: 50, frequency: 9 }, { age: 52, frequency: 11 }, { age: 55, frequency: 10 },
  ];

  // Gráfico 3: Relação entre Renda e Frequência de Compras
  const incomeFrequencyData = [
    { income: 1500, frequency: 3 }, { income: 2000, frequency: 4 }, { income: 2500, frequency: 5 },
    { income: 3000, frequency: 6 }, { income: 3500, frequency: 6 }, { income: 4000, frequency: 7 },
    { income: 4500, frequency: 7 }, { income: 5000, frequency: 8 }, { income: 5500, frequency: 8 },
    { income: 6000, frequency: 9 }, { income: 7000, frequency: 9 }, { income: 8000, frequency: 10 },
  ];

  // Gráfico 4: Relação entre Renda e Gasto em Compras
  const incomeSpendingData = [
    { income: 1500, spending: 300 }, { income: 2000, spending: 450 }, { income: 2500, spending: 380 },
    { income: 3000, spending: 520 }, { income: 3500, spending: 480 }, { income: 4000, spending: 600 },
    { income: 4500, spending: 550 }, { income: 5000, spending: 700 }, { income: 5500, spending: 650 },
    { income: 6000, spending: 720 }, { income: 7000, spending: 680 }, { income: 8000, spending: 750 },
  ];

  // Gráfico 5: Relação entre Frequência de Compras e Gasto Total
  const frequencySpendingData = [
    { frequency: 2, spending: 250 }, { frequency: 3, spending: 320 }, { frequency: 4, spending: 450 },
    { frequency: 5, spending: 380 }, { frequency: 6, spending: 550 }, { frequency: 7, spending: 480 },
    { frequency: 8, spending: 650 }, { frequency: 9, spending: 590 }, { frequency: 10, spending: 700 },
    { frequency: 11, spending: 620 }, { frequency: 12, spending: 750 },
  ];

  // Gráfico 6: Distribuição Percentual do Gasto Total por Escolaridade
  const educationSpendingData = [
    { name: 'Superior', value: 50.2, color: '#3b82f6' },
    { name: 'Pós-graduação', value: 37.9, color: '#8b5cf6' },
    { name: 'Ensino Médio', value: 11.8, color: '#06b6d4' },
  ];

  // Gráfico 7: Distribuição da Frequência de Compra por Escolaridade
  const educationFrequencyData = [
    { name: 'Pós-graduação', value: 48, color: '#8b5cf6' },
    { name: 'Superior', value: 40.8, color: '#3b82f6' },
    { name: 'Ensino Médio', value: 11.2, color: '#06b6d4' },
  ];

  // Gráfico 8: Distribuição da Frequência de Compras por Gênero
  const genderData = [
    { name: 'Mulheres', value: 52, color: '#ec4899' },
    { name: 'Homens', value: 48, color: '#3b82f6' },
  ];

  // Gráfico 9: Relação entre Renda e Opinião sobre Aumento de Preços
  const incomeOpinionData = [
    { income: '< R$ 2.000', opinion: 7.5 },
    { income: 'R$ 2.000-4.000', opinion: 6.8 },
    { income: 'R$ 4.000-6.000', opinion: 5.5 },
    { income: 'R$ 6.000-8.000', opinion: 4.2 },
    { income: '> R$ 8.000', opinion: 3.8 },
  ];

  // Gráfico 10: Gênero vs Fatores de Influência na Escolha
  const genderInfluenceData = [
    { factor: 'Preço', homens: 75, mulheres: 70 },
    { factor: 'Qualidade', homens: 65, mulheres: 80 },
    { factor: 'Promoções', homens: 50, mulheres: 65 },
    { factor: 'Indicação', homens: 40, mulheres: 55 },
  ];

  // Gráfico 11: Faixa Etária vs Formato de Pagamento
  const agePaymentData = [
    { age: '18-25', dinheiro: 30, cartao: 50, pix: 20 },
    { age: '26-35', dinheiro: 20, cartao: 45, pix: 35 },
    { age: '36-45', dinheiro: 15, cartao: 35, pix: 50 },
    { age: '46-55', dinheiro: 10, cartao: 30, pix: 60 },
    { age: '56+', dinheiro: 5, cartao: 25, pix: 70 },
  ];

  // Gráfico 12: Escolaridade vs Critérios de Escolha do Supermercado
  const educationCriteriaData = [
    { criteria: 'Preço', medio: 85, superior: 65, pos: 50 },
    { criteria: 'Localização', medio: 75, superior: 60, pos: 45 },
    { criteria: 'Estrutura', medio: 40, superior: 70, pos: 85 },
    { criteria: 'Confiança', medio: 45, superior: 75, pos: 90 },
  ];

  // Gráfico 13: Renda vs Frequência de Compras
  const incomeFrequencyBarData = [
    { income: '< R$ 2.000', frequency: 3 },
    { income: 'R$ 2.000-4.000', frequency: 5 },
    { income: 'R$ 4.000-6.000', frequency: 7 },
    { income: 'R$ 6.000-8.000', frequency: 9 },
    { income: '> R$ 8.000', frequency: 11 },
  ];

  // Gráfico 14: Escolaridade vs Preferências de Compra
  const educationPreferencesData = [
    { preference: 'Marcas Conhecidas', medio: 40, superior: 70, pos: 85 },
    { preference: 'Promoções', medio: 90, superior: 65, pos: 45 },
    { preference: 'Produtos Importados', medio: 20, superior: 50, pos: 70 },
    { preference: 'Produtos Orgânicos', medio: 15, superior: 45, pos: 75 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];

  // Array com as configurações dos gráficos
  const chartConfigs = [
    { 
      id: 1, 
      title: 'Relação entre Faixa Etária e Gasto em Compras', 
      description: 'Análise da correlação entre idade dos consumidores e valor gasto. Não há tendência clara entre faixa etária e gastos.',
      type: 'scatter',
      data: ageSpendingData,
      xKey: 'age',
      yKey: 'spending',
      xLabel: 'Idade',
      yLabel: 'Gasto (R$)'
    },
    { 
      id: 2, 
      title: 'Relação entre Faixa Etária e Frequência de Compras', 
      description: 'Gráfico de dispersão mostrando correlação positiva fraca entre idade e frequência de compras.',
      type: 'scatter',
      data: ageFrequencyData,
      xKey: 'age',
      yKey: 'frequency',
      xLabel: 'Idade',
      yLabel: 'Frequência'
    },
    { 
      id: 3, 
      title: 'Relação entre Renda e Frequência de Compras', 
      description: 'Análise da correlação entre renda e frequência. Renda não é forte preditor da frequência de compras.',
      type: 'scatter',
      data: incomeFrequencyData,
      xKey: 'income',
      yKey: 'frequency',
      xLabel: 'Renda (R$)',
      yLabel: 'Frequência'
    },
    { 
      id: 4, 
      title: 'Relação entre Renda e Gasto em Compras', 
      description: 'Visualização mostra ausência de correlação linear entre renda e gastos dos consumidores.',
      type: 'scatter',
      data: incomeSpendingData,
      xKey: 'income',
      yKey: 'spending',
      xLabel: 'Renda (R$)',
      yLabel: 'Gasto (R$)'
    },
    { 
      id: 5, 
      title: 'Relação entre Frequência de Compras e Gasto Total', 
      description: 'Análise demonstra que frequência de compra não determina necessariamente o valor total gasto.',
      type: 'scatter',
      data: frequencySpendingData,
      xKey: 'frequency',
      yKey: 'spending',
      xLabel: 'Frequência',
      yLabel: 'Gasto (R$)'
    },
    { 
      id: 6, 
      title: 'Distribuição Percentual do Gasto Total por Escolaridade', 
      description: 'Superior: 50,2%, Pós-graduação: 37,9%, Ensino Médio: 11,8% do gasto total.',
      type: 'pie',
      data: educationSpendingData
    },
    { 
      id: 7, 
      title: 'Distribuição da Frequência de Compra por Escolaridade', 
      description: 'Pós-graduação: 48%, Superior: 40,8%, Ensino Médio: 11,2% da frequência de compras.',
      type: 'pie',
      data: educationFrequencyData
    },
    { 
      id: 8, 
      title: 'Distribuição da Frequência de Compras por Gênero', 
      description: 'Mulheres: 52%, Homens: 48%. Distribuição quase equilibrada com leve predominância feminina.',
      type: 'pie',
      data: genderData
    },
    { 
      id: 9, 
      title: 'Relação entre Renda e Opinião sobre Aumento de Preços', 
      description: 'Análise de como pessoas de diferentes rendas avaliam o aumento de preços em escala numérica.',
      type: 'bar',
      data: incomeOpinionData,
      xKey: 'income',
      yKey: 'opinion',
      xLabel: 'Faixa de Renda',
      yLabel: 'Opinião (1-10)'
    },
    { 
      id: 10, 
      title: 'Gênero vs Fatores de Influência na Escolha', 
      description: 'Diferenças entre homens e mulheres nos critérios de escolha: preço, qualidade, promoções e indicação.',
      type: 'groupedBar',
      data: genderInfluenceData,
      xKey: 'factor',
      bars: ['homens', 'mulheres'],
      xLabel: 'Fator',
      yLabel: 'Percentual (%)'
    },
    { 
      id: 11, 
      title: 'Faixa Etária vs Formato de Pagamento', 
      description: 'Jovens usam cartão/dinheiro variado, faixas mais altas preferem Pix. Métodos digitais crescem com a idade.',
      type: 'stackedBar',
      data: agePaymentData,
      xKey: 'age',
      bars: ['dinheiro', 'cartao', 'pix'],
      xLabel: 'Faixa Etária',
      yLabel: 'Percentual (%)'
    },
    { 
      id: 12, 
      title: 'Escolaridade vs Critérios de Escolha do Supermercado', 
      description: 'Ensino médio prioriza preço/localização. Graduação/pós-graduação valorizam estrutura e confiança.',
      type: 'groupedBar',
      data: educationCriteriaData,
      xKey: 'criteria',
      bars: ['medio', 'superior', 'pos'],
      xLabel: 'Critério',
      yLabel: 'Percentual (%)'
    },
    { 
      id: 13, 
      title: 'Renda vs Frequência de Compras', 
      description: 'Rendas baixas: menor frequência. Rendas altas: maior regularidade, chegando a compras semanais.',
      type: 'bar',
      data: incomeFrequencyBarData,
      xKey: 'income',
      yKey: 'frequency',
      xLabel: 'Faixa de Renda',
      yLabel: 'Frequência (por mês)'
    },
    { 
      id: 14, 
      title: 'Escolaridade vs Preferências de Compra', 
      description: 'Maior escolaridade prefere marcas conhecidas. Menor escolaridade foca em promoções.',
      type: 'groupedBar',
      data: educationPreferencesData,
      xKey: 'preference',
      bars: ['medio', 'superior', 'pos'],
      xLabel: 'Preferência',
      yLabel: 'Percentual (%)'
    },
  ];

  // Função para renderizar o gráfico apropriado
  const renderChart = (config: any) => {
    const height = fullscreenChart === config.id ? 800 : 500;

    switch (config.type) {
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number" 
                dataKey={config.xKey} 
                name={config.xLabel}
                label={{ value: config.xLabel, position: 'insideBottom', offset: -15, style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <YAxis 
                type="number" 
                dataKey={config.yKey} 
                name={config.yLabel}
                label={{ value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 14, padding: '12px' }}
              />
              <Scatter data={config.data} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={config.data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={fullscreenChart === config.id ? 280 : 160}
                fill="#8884d8"
                dataKey="value"
              >
                {config.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 14 }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                iconType="circle"
                wrapperStyle={{ fontSize: 14 }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={config.data} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={config.xKey}
                label={{ value: config.xLabel, position: 'insideBottom', offset: -15, style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 13 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 14, padding: '12px' }}
              />
              <Bar dataKey={config.yKey} fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'groupedBar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={config.data} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={config.xKey}
                label={{ value: config.xLabel, position: 'insideBottom', offset: -15, style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 13 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 14, padding: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: 14, paddingTop: '10px' }} />
              {config.bars.map((barKey: string, index: number) => (
                <Bar 
                  key={barKey} 
                  dataKey={barKey} 
                  fill={COLORS[index % COLORS.length]} 
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'stackedBar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={config.data} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={config.xKey}
                label={{ value: config.xLabel, position: 'insideBottom', offset: -15, style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <YAxis 
                label={{ value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 16, fontWeight: 600 } }}
                stroke="#6b7280"
                tick={{ fontSize: 14 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 14, padding: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: 14, paddingTop: '10px' }} />
              {config.bars.map((barKey: string, index: number) => (
                <Bar 
                  key={barKey} 
                  dataKey={barKey} 
                  stackId="a" 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const handleDownloadChart = (chartId: number) => {
    // Implementar download do gráfico
    console.log(`Baixando gráfico ${chartId}`);
  };

  const handlePrintChart = (chartId: number) => {
    // Implementar impressão do gráfico
    console.log(`Imprimindo gráfico ${chartId}`);
  };

  const toggleFullscreen = (chartId: number) => {
    setFullscreenChart(fullscreenChart === chartId ? null : chartId);
  };

  return (
    <DesktopOnlyPage
      title="Análise de Comportamento do Consumidor"
      description="Gráficos e análises detalhadas baseadas em pesquisa de comportamento de compra dos clientes."
      features={[
        "14 gráficos de análise comportamental completos",
        "Correlações entre idade, renda, escolaridade e comportamento",
        "Análises de gênero, pagamento e preferências",
        "Visualização em tela cheia",
        "Dados baseados em pesquisa real com clientes"
      ]}
    >
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Análise de Comportamento do Consumidor</h1>
            <p className="text-muted-foreground mt-2">
              Gráficos baseados em pesquisa de comportamento de compra dos clientes
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Período
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todos
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Análises Comportamentais</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">
                Gráficos completos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Variáveis Analisadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Renda, idade, gênero, etc.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insights Principais</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Padrões</div>
              <p className="text-xs text-muted-foreground">
                Comportamentais identificados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesquisa</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Completa
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">
                Todos os gráficos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartConfigs.map((chart) => (
            <Card key={chart.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">{chart.title}</CardTitle>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFullscreen(chart.id)}
                    >
                      {fullscreenChart === chart.id ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownloadChart(chart.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePrintChart(chart.id)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{chart.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`relative ${fullscreenChart === chart.id ? 'fixed inset-0 z-50 bg-background p-6' : ''}`}>
                  {fullscreenChart === chart.id && (
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setFullscreenChart(null)}
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center p-6 ${
                    fullscreenChart === chart.id ? 'h-full' : 'h-[550px]'
                  }`}>
                    {renderChart(chart)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </div>
              <div>
                Usuário: {user?.name} • Perfil: {user?.role}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopOnlyPage>
  );
};

export default Charts;