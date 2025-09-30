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

const Charts = () => {
  const { user } = useAuth();
  const [fullscreenChart, setFullscreenChart] = useState<number | null>(null);

  // Array com as imagens de gráficos (expandido para 14 como solicitado)
  const chartImages = [
    { id: 1, title: 'Relação entre Faixa Etária e Gasto em Compras', description: 'Análise da correlação entre idade dos consumidores e valor gasto. Não há tendência clara entre faixa etária e gastos.', filename: 'image1.png', available: true },
    { id: 2, title: 'Relação entre Faixa Etária e Frequência de Compras', description: 'Gráfico de dispersão mostrando correlação positiva fraca entre idade e frequência de compras.', filename: 'image2.png', available: true },
    { id: 3, title: 'Relação entre Renda e Frequência de Compras', description: 'Análise da correlação entre renda e frequência. Renda não é forte preditor da frequência de compras.', filename: 'image3.png', available: true },
    { id: 4, title: 'Relação entre Renda e Gasto em Compras', description: 'Visualização mostra ausência de correlação linear entre renda e gastos dos consumidores.', filename: 'image4.png', available: true },
    { id: 5, title: 'Relação entre Frequência de Compras e Gasto Total', description: 'Análise demonstra que frequência de compra não determina necessariamente o valor total gasto.', filename: 'image5.png', available: true },
    { id: 6, title: 'Distribuição Percentual do Gasto Total por Escolaridade', description: 'Superior: 50,2%, Pós-graduação: 37,9%, Ensino Médio: 11,8% do gasto total.', filename: 'image6.png', available: true },
    { id: 7, title: 'Distribuição da Frequência de Compra por Escolaridade', description: 'Pós-graduação: 48%, Superior: 40,8%, Ensino Médio: 11,2% da frequência de compras.', filename: 'image7.png', available: true },
    { id: 8, title: 'Distribuição da Frequência de Compras por Gênero', description: 'Mulheres: 52%, Homens: 48%. Distribuição quase equilibrada com leve predominância feminina.', filename: 'image8.png', available: true },
    // Placeholders para as 6 imagens adicionais
    { id: 9, title: 'Relação entre Renda e Opinião sobre Aumento de Preços', description: 'Análise de como pessoas de diferentes rendas avaliam o aumento de preços em escala numérica.', filename: 'image9.png', available: true },
    { id: 10, title: 'Gênero vs Fatores de Influência na Escolha', description: 'Diferenças entre homens e mulheres nos critérios de escolha: preço, qualidade, promoções e indicação.', filename: 'image10.png', available: true },
    { id: 11, title: 'Faixa Etária vs Formato de Pagamento', description: 'Jovens usam cartão/dinheiro variado, faixas mais altas preferem Pix. Métodos digitais crescem com a idade.', filename: 'image11.png', available: true },
    { id: 12, title: 'Escolaridade vs Critérios de Escolha do Supermercado', description: 'Ensino médio prioriza preço/localização. Graduação/pós-graduação valorizam estrutura e confiança.', filename: 'image12.png', available: true },
    { id: 13, title: 'Renda vs Frequência de Compras', description: 'Rendas baixas: menor frequência. Rendas altas: maior regularidade, chegando a compras semanais.', filename: 'image13.png', available: true },
    { id: 14, title: 'Escolaridade vs Preferências de Compra', description: 'Maior escolaridade prefere marcas conhecidas. Menor escolaridade foca em promoções.', filename: 'image14.png', available: true },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chartImages.map((chart) => (
            <Card key={chart.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{chart.title}</CardTitle>
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
                <p className="text-sm text-muted-foreground">{chart.description}</p>
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
                  <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${
                    fullscreenChart === chart.id ? 'h-full' : 'h-48'
                  }`}>
                    {/* Verificar se a imagem existe, caso contrário mostrar placeholder */}
                    {chart.available ? (
                      <img
                        src={`graficos/${chart.filename}`}
                        alt={chart.title}
                        className={`object-contain rounded-lg ${
                          fullscreenChart === chart.id ? 'max-h-full max-w-full' : 'w-full h-full'
                        }`}
                        onError={(e) => {
                          // Se a imagem não carregar, mostrar placeholder
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex flex-col items-center justify-center text-muted-foreground h-full">
                                <BarChart3 class="h-12 w-12 mb-2" />
                                <p class="text-sm">Gráfico ${chart.id}</p>
                                <p class="text-xs opacity-75">Erro ao carregar</p>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mb-2" />
                        <p className="text-sm">Gráfico {chart.id}</p>
                        <p className="text-xs opacity-75">Em breve</p>
                      </div>
                    )}
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