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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Calculator,
  Package,
  TrendingUp,
  FileText,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { databaseFeaturesService } from '@/services/advancedFeaturesService';
import type {
  CalculoDesconto,
  AtualizacaoPrecoResult,
  EstoqueBaixo,
  LogAuditoria,
  FiltroLogsAuditoria,
} from '@/services/advancedFeaturesService';
import { useToast } from '@/hooks/use-toast';

const DatabaseFeatures = () => {
  const [activeTab, setActiveTab] = useState('funcoes');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estados para Funções
  const [precoDesconto, setPrecoDesconto] = useState('');
  const [resultadoDesconto, setResultadoDesconto] = useState<CalculoDesconto | null>(null);
  const [produtoIdEstoque, setProdutoIdEstoque] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [estoqueDisponivel, setEstoqueDisponivel] = useState<boolean | null>(null);

  // Estados para Procedimentos
  const [categoriaId, setCategoriaId] = useState('');
  const [percentualAumento, setPercentualAumento] = useState('');
  const [resultadoAtualizacao, setResultadoAtualizacao] =
    useState<AtualizacaoPrecoResult | null>(null);
  const [estoqueBaixo, setEstoqueBaixo] = useState<EstoqueBaixo[]>([]);

  // Estados para Logs
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [filtroTabela, setFiltroTabela] = useState('');
  const [filtroOperacao, setFiltroOperacao] = useState('');
  const [limiteLogs, setLimiteLogs] = useState('50');
  const [diasDeletar, setDiasDeletar] = useState('30');
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    if (activeTab === 'logs') {
      carregarLogsRecentes();
      contarLogs();
    }
  }, [activeTab]);

  // ========== FUNÇÕES ==========
  const handleCalcularDesconto = async () => {
    if (!precoDesconto) {
      toast({ title: 'Erro', description: 'Por favor, insira um preço', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const resultado = await databaseFeaturesService.calcularDesconto(parseFloat(precoDesconto));
      setResultadoDesconto(resultado);
      toast({ title: 'Sucesso', description: 'Desconto calculado com sucesso!' });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message || 'Erro ao calcular desconto', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarEstoque = async () => {
    if (!produtoIdEstoque || !quantidadeEstoque) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const disponivel = await databaseFeaturesService.verificarEstoque(
        parseInt(produtoIdEstoque),
        parseInt(quantidadeEstoque)
      );
      setEstoqueDisponivel(disponivel);
      toast({ 
        title: disponivel ? 'Sucesso' : 'Atenção', 
        description: disponivel ? 'Estoque disponível!' : 'Estoque insuficiente!',
        variant: disponivel ? 'default' : 'destructive'
      });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message || 'Erro ao verificar estoque', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // ========== PROCEDIMENTOS ==========
  const handleAtualizarPrecos = async () => {
    if (!categoriaId || !percentualAumento) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const resultado = await databaseFeaturesService.atualizarPrecos(
        parseInt(categoriaId),
        parseFloat(percentualAumento)
      );
      setResultadoAtualizacao(resultado);
      toast({ title: 'Sucesso', description: resultado.mensagem });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message || 'Erro ao atualizar preços', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRelatorioEstoqueBaixo = async () => {
    setLoading(true);
    try {
      const relatorio = await databaseFeaturesService.getRelatorioEstoqueBaixo();
      setEstoqueBaixo(relatorio);
      toast({ title: 'Relatório Gerado', description: `Encontrados ${relatorio.length} produtos com estoque baixo` });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message || 'Erro ao gerar relatório', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // ========== LOGS DE AUDITORIA ==========
  const carregarLogsRecentes = async () => {
    setLoading(true);
    try {
      const logsRecentes = await databaseFeaturesService.getLogsRecentes(parseInt(limiteLogs));
      setLogs(logsRecentes);
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message || 'Erro ao carregar logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrarLogs = async () => {
    setLoading(true);
    try {
      const filtros: FiltroLogsAuditoria = {
        ...(filtroTabela && { tabela: filtroTabela }),
        ...(filtroOperacao && { operacao: filtroOperacao }),
        limit: parseInt(limiteLogs),
      };
      const logsFiltrados = await databaseFeaturesService.getLogsComFiltros(filtros);
      setLogs(logsFiltrados);
      toast({ title: 'Filtros Aplicados', description: `${logsFiltrados.length} logs encontrados` });
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message || 'Erro ao filtrar logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const contarLogs = async () => {
    try {
      const total = await databaseFeaturesService.contarLogs();
      setTotalLogs(total);
    } catch (error) {
      console.error('Erro ao contar logs:', error);
    }
  };

  const handleDeletarLogsAntigos = async () => {
    if (!diasDeletar) {
      toast({ title: 'Erro', description: 'Informe o número de dias', variant: 'destructive' });
      return;
    }
    if (!confirm(`Tem certeza que deseja deletar logs com mais de ${diasDeletar} dias?`)) {
      return;
    }
    setLoading(true);
    try {
      const deletados = await databaseFeaturesService.deletarLogsAntigos(parseInt(diasDeletar));
      toast({ title: 'Sucesso', description: `${deletados} logs deletados com sucesso!` });
      carregarLogsRecentes();
      contarLogs();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message || 'Erro ao deletar logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Database Features</h1>
        <p className="text-muted-foreground">
          Teste funções, procedimentos armazenados e visualize logs de auditoria
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="funcoes">Funções</TabsTrigger>
          <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
          <TabsTrigger value="logs">Logs Auditoria</TabsTrigger>
        </TabsList>

        {/* ========== TAB FUNÇÕES ========== */}
        <TabsContent value="funcoes" className="space-y-6">
          {/* Função 1: Calcular Desconto */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <CardTitle>Calcular Desconto</CardTitle>
              </div>
              <CardDescription>
                Função que calcula desconto progressivo baseado no valor (IF/ELSE)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 850.00"
                    value={precoDesconto}
                    onChange={(e) => setPrecoDesconto(e.target.value)}
                  />
                </div>
                <Button onClick={handleCalcularDesconto} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calcular'}
                </Button>
              </div>

              {resultadoDesconto && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Preço Original:</span>
                        <strong>{formatCurrency(resultadoDesconto.precoOriginal)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Desconto Aplicado:</span>
                        <Badge variant="secondary">
                          {resultadoDesconto.descontoAplicado.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>Preço Final:</span>
                        <strong className="text-green-600">
                          {formatCurrency(resultadoDesconto.precoFinal)}
                        </strong>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Função 2: Verificar Estoque */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle>Verificar Estoque Disponível</CardTitle>
              </div>
              <CardDescription>
                Função booleana que verifica se há estoque suficiente para venda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="produtoId">ID do Produto</Label>
                  <Input
                    id="produtoId"
                    type="number"
                    placeholder="Ex: 1"
                    value={produtoIdEstoque}
                    onChange={(e) => setProdutoIdEstoque(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Ex: 10"
                    value={quantidadeEstoque}
                    onChange={(e) => setQuantidadeEstoque(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleVerificarEstoque} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verificar'}
              </Button>

              {estoqueDisponivel !== null && (
                <Alert variant={estoqueDisponivel ? 'default' : 'destructive'}>
                  <AlertDescription className="flex items-center gap-2">
                    {estoqueDisponivel ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">Estoque disponível!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span className="font-semibold">Estoque insuficiente!</span>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== TAB PROCEDIMENTOS ========== */}
        <TabsContent value="procedimentos" className="space-y-6">
          {/* Procedimento 1: Atualizar Preços */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>Atualizar Preços por Categoria</CardTitle>
              </div>
              <CardDescription>
                Procedimento com UPDATE que aumenta preços de todos produtos de uma categoria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoriaId">ID da Categoria</Label>
                  <Input
                    id="categoriaId"
                    type="number"
                    placeholder="Ex: 1"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="percentual">Aumento (%)</Label>
                  <Input
                    id="percentual"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 10.5"
                    value={percentualAumento}
                    onChange={(e) => setPercentualAumento(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAtualizarPrecos} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Atualizar Preços'}
              </Button>

              {resultadoAtualizacao && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">{resultadoAtualizacao.mensagem}</p>
                      <p>
                        Produtos atualizados:{' '}
                        <Badge>{resultadoAtualizacao.produtosAtualizados}</Badge>
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Procedimento 2: Relatório Estoque Baixo */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Relatório de Estoque Baixo</CardTitle>
              </div>
              <CardDescription>
                Procedimento com CURSOR que lista produtos abaixo do estoque mínimo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleRelatorioEstoqueBaixo} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Gerar Relatório'
                )}
              </Button>

              {estoqueBaixo.length > 0 && (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Estoque Atual</TableHead>
                        <TableHead>Estoque Mínimo</TableHead>
                        <TableHead>Diferença</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {estoqueBaixo.map((item) => (
                        <TableRow key={item.produtoId}>
                          <TableCell>{item.produtoId}</TableCell>
                          <TableCell className="font-medium">{item.nome}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{item.quantidadeEstoque}</Badge>
                          </TableCell>
                          <TableCell>{item.estoqueMinimo}</TableCell>
                          <TableCell className="text-red-600 font-semibold">
                            {item.diferenca}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== TAB LOGS DE AUDITORIA ========== */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>
                Visualize e gerencie logs gerados automaticamente pelos triggers
              </CardDescription>
              <div className="flex gap-2 text-sm">
                <Badge variant="outline">Total de Logs: {totalLogs}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="filtroTabela">Tabela</Label>
                  <Select value={filtroTabela} onValueChange={setFiltroTabela}>
                    <SelectTrigger id="filtroTabela">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="Produtos">Produtos</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Clientes">Clientes</SelectItem>
                      <SelectItem value="Categorias">Categorias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filtroOperacao">Operação</Label>
                  <Select value={filtroOperacao} onValueChange={setFiltroOperacao}>
                    <SelectTrigger id="filtroOperacao">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="INSERT">INSERT</SelectItem>
                      <SelectItem value="UPDATE">UPDATE</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="limite">Limite</Label>
                  <Input
                    id="limite"
                    type="number"
                    value={limiteLogs}
                    onChange={(e) => setLimiteLogs(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleFiltrarLogs} disabled={loading} className="w-full">
                    Filtrar
                  </Button>
                </div>
              </div>

              {/* Botão Deletar Logs Antigos */}
              <div className="flex gap-4 items-end p-4 bg-muted rounded-md">
                <div className="flex-1">
                  <Label htmlFor="diasDeletar">Deletar logs com mais de (dias):</Label>
                  <Input
                    id="diasDeletar"
                    type="number"
                    value={diasDeletar}
                    onChange={(e) => setDiasDeletar(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleDeletarLogsAntigos}
                  disabled={loading}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar Antigos
                </Button>
              </div>

              {/* Tabela de Logs */}
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="border rounded-md max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tabela</TableHead>
                        <TableHead>Operação</TableHead>
                        <TableHead>Registro ID</TableHead>
                        <TableHead>Usuário ID</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.logId}>
                          <TableCell>{log.logId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.tabelaAfetada}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                log.operacao === 'INSERT'
                                  ? 'default'
                                  : log.operacao === 'UPDATE'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {log.operacao}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.registroId}</TableCell>
                          <TableCell>{log.usuarioId}</TableCell>
                          <TableCell className="text-xs">{formatDate(log.dataHora)}</TableCell>
                          <TableCell className="max-w-md truncate">{log.descricao}</TableCell>
                        </TableRow>
                      ))}
                      {logs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            Nenhum log encontrado
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
      </Tabs>
    </div>
  );
};

export default DatabaseFeatures;
