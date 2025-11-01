import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Database, TrendingUp, Users, Package } from 'lucide-react';
import { advancedQueriesService } from '@/services/advancedFeaturesService';
import type {
  ProdutoNuncaVendido,
  ProdutoFornecedor,
  ProdutoAcimaMedia,
  ClienteVIP,
  RelatorioVenda,
  EstoqueCompleto,
} from '@/services/advancedFeaturesService';

const AdvancedQueries = () => {
  const [activeTab, setActiveTab] = useState('anti-join');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State para cada consulta
  const [produtosNuncaVendidos, setProdutosNuncaVendidos] = useState<ProdutoNuncaVendido[]>([]);
  const [produtosFornecedores, setProdutosFornecedores] = useState<ProdutoFornecedor[]>([]);
  const [produtosAcimaMedia, setProdutosAcimaMedia] = useState<ProdutoAcimaMedia[]>([]);
  const [clientesVIP, setClientesVIP] = useState<ClienteVIP[]>([]);
  const [relatorioVendas, setRelatorioVendas] = useState<RelatorioVenda[]>([]);
  const [estoqueCompleto, setEstoqueCompleto] = useState<EstoqueCompleto[]>([]);

  // Carregar dados ao mudar de tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'anti-join':
          const produtosNV = await advancedQueriesService.getProdutosNuncaVendidos();
          setProdutosNuncaVendidos(produtosNV);
          break;
        case 'full-outer':
          const produtosF = await advancedQueriesService.getProdutosEFornecedores();
          setProdutosFornecedores(produtosF);
          break;
        case 'subconsulta-1':
          const produtosAM = await advancedQueriesService.getProdutosAcimaDaMedia();
          setProdutosAcimaMedia(produtosAM);
          break;
        case 'subconsulta-2':
          const clientesV = await advancedQueriesService.getClientesVIP();
          setClientesVIP(clientesV);
          break;
        case 'view-vendas':
          const relatorio = await advancedQueriesService.getRelatorioVendas();
          setRelatorioVendas(relatorio);
          break;
        case 'view-estoque':
          const estoque = await advancedQueriesService.getEstoqueCompleto();
          setEstoqueCompleto(estoque);
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar dados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Consultas Avançadas</h1>
          <p className="text-muted-foreground">
            Visualize queries complexas e views do banco de dados
          </p>
        </div>
        <Button onClick={loadData} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Atualizar
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="anti-join">ANTI JOIN</TabsTrigger>
          <TabsTrigger value="full-outer">FULL OUTER</TabsTrigger>
          <TabsTrigger value="subconsulta-1">Subconsulta 1</TabsTrigger>
          <TabsTrigger value="subconsulta-2">Subconsulta 2</TabsTrigger>
          <TabsTrigger value="view-vendas">View Vendas</TabsTrigger>
          <TabsTrigger value="view-estoque">View Estoque</TabsTrigger>
        </TabsList>

        {/* ANTI JOIN - Produtos Nunca Vendidos */}
        <TabsContent value="anti-join">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle>Produtos Nunca Vendidos</CardTitle>
              </div>
              <CardDescription>
                Query usando ANTI JOIN para encontrar produtos sem vendas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosNuncaVendidos.map((produto) => (
                      <TableRow key={produto.produtoId}>
                        <TableCell>{produto.produtoId}</TableCell>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{produto.categoria}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(produto.precoVenda)}</TableCell>
                        <TableCell>{produto.quantidadeEstoque}</TableCell>
                      </TableRow>
                    ))}
                    {produtosNuncaVendidos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FULL OUTER JOIN - Produtos e Fornecedores */}
        <TabsContent value="full-outer">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>Produtos e Fornecedores (FULL OUTER)</CardTitle>
              </div>
              <CardDescription>
                Query usando FULL OUTER JOIN para mostrar todos produtos e fornecedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto ID</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Fornecedor ID</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosFornecedores.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.produtoId || '-'}</TableCell>
                        <TableCell className="font-medium">
                          {item.produtoNome || (
                            <span className="text-muted-foreground">Sem produto</span>
                          )}
                        </TableCell>
                        <TableCell>{item.fornecedorId || '-'}</TableCell>
                        <TableCell>
                          {item.fornecedorNome || (
                            <span className="text-muted-foreground">Sem fornecedor</span>
                          )}
                        </TableCell>
                        <TableCell>{item.telefone || '-'}</TableCell>
                        <TableCell>{item.email || '-'}</TableCell>
                      </TableRow>
                    ))}
                    {produtosFornecedores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Nenhum dado encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUBCONSULTA 1 - Produtos Acima da Média */}
        <TabsContent value="subconsulta-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>Produtos Acima da Média de Preço</CardTitle>
              </div>
              <CardDescription>
                Subconsulta comparando preço de cada produto com a média geral
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Preço Venda</TableHead>
                      <TableHead>Preço Médio</TableHead>
                      <TableHead>Diferença</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosAcimaMedia.map((produto) => (
                      <TableRow key={produto.produtoId}>
                        <TableCell>{produto.produtoId}</TableCell>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>{formatCurrency(produto.precoVenda)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatCurrency(produto.precoMedio)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            +{formatCurrency(produto.diferencaPreco)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {produtosAcimaMedia.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUBCONSULTA 2 - Clientes VIP */}
        <TabsContent value="subconsulta-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>Clientes VIP</CardTitle>
              </div>
              <CardDescription>
                Clientes que gastaram acima da média usando subconsulta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Total Gasto</TableHead>
                      <TableHead>Média Geral</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesVIP.map((cliente) => (
                      <TableRow key={cliente.clienteId}>
                        <TableCell>{cliente.clienteId}</TableCell>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>{cliente.cpf}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            {formatCurrency(cliente.totalGasto)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatCurrency(cliente.mediaGeral)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {clientesVIP.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Nenhum cliente VIP encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIEW - Relatório de Vendas */}
        <TabsContent value="view-vendas">
          <Card>
            <CardHeader>
              <CardTitle>View: Relatório de Vendas</CardTitle>
              <CardDescription>
                View com 3+ joins mostrando detalhes completos de vendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Venda ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Funcionário</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead>Preço Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatorioVendas.map((venda, index) => (
                        <TableRow key={index}>
                          <TableCell>{venda.vendaId}</TableCell>
                          <TableCell>{formatDate(venda.dataVenda)}</TableCell>
                          <TableCell className="font-medium">{venda.clienteNome}</TableCell>
                          <TableCell>{venda.funcionarioNome}</TableCell>
                          <TableCell>{venda.produtoNome}</TableCell>
                          <TableCell>{venda.quantidade}</TableCell>
                          <TableCell>{formatCurrency(venda.precoUnitario)}</TableCell>
                          <TableCell>{formatCurrency(venda.subtotal)}</TableCell>
                          <TableCell>
                            <Badge>{formatCurrency(venda.valorTotal)}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {relatorioVendas.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-muted-foreground">
                            Nenhuma venda encontrada
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIEW - Estoque Completo */}
        <TabsContent value="view-estoque">
          <Card>
            <CardHeader>
              <CardTitle>View: Estoque Completo</CardTitle>
              <CardDescription>
                View com 3+ joins mostrando estoque detalhado com fornecedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Telefone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estoqueCompleto.map((item) => (
                      <TableRow key={item.produtoId}>
                        <TableCell>{item.produtoId}</TableCell>
                        <TableCell className="font-medium">{item.produtoNome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.categoriaNome}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.quantidadeEstoque < 10 ? 'destructive' : 'secondary'}
                          >
                            {item.quantidadeEstoque}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(item.precoVenda)}</TableCell>
                        <TableCell>{item.fornecedorNome}</TableCell>
                        <TableCell>{item.fornecedorTelefone}</TableCell>
                      </TableRow>
                    ))}
                    {estoqueCompleto.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          Nenhum item no estoque
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedQueries;
