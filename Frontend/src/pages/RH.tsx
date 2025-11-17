import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  FileText, 
  Calendar, 
  Clock, 
  Plus, 
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  History,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useHistoricoFuncionario } from '@/hooks/useHistoricoFuncionario';
import { useDocumentosFuncionario } from '@/hooks/useDocumentosFuncionario';
import { useFeriasFuncionario } from '@/hooks/useFeriasFuncionario';
import { usePontoEletronico } from '@/hooks/usePontoEletronico';
import { LoadingScreen } from '@/components/LoadingScreen';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const RHPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFuncionario, setSelectedFuncionario] = useState<number | null>(null);
  const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
  const [isDocumentoModalOpen, setIsDocumentoModalOpen] = useState(false);
  const [isFeriasModalOpen, setIsFeriasModalOpen] = useState(false);
  const [isPontoModalOpen, setIsPontoModalOpen] = useState(false);
  
  // Estados para visualização de detalhes
  const [selectedDocumento, setSelectedDocumento] = useState<any>(null);
  const [selectedFerias, setSelectedFerias] = useState<any>(null);
  const [selectedPonto, setSelectedPonto] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
  
  // Estados para modais de documentos vencidos/a vencer
  const [isDocVencidosModalOpen, setIsDocVencidosModalOpen] = useState(false);
  const [isDocAVencerModalOpen, setIsDocAVencerModalOpen] = useState(false);
  const [documentosAlerta, setDocumentosAlerta] = useState<any[]>([]);

  // Ref para evitar múltiplas chamadas
  const statsLoadedRef = useRef(false);

  // Hooks reais
  const { employees, loading: loadingEmployees } = useEmployees();
  const { historicos, loading: loadingHistorico, createHistorico } = useHistoricoFuncionario();
  const { documentos, loading: loadingDocumentos, fetchVencidos, fetchVencendoEm, fetchStatusDocumentos, createDocumento } = useDocumentosFuncionario();
  const { ferias, loading: loadingFerias, fetchStatusFerias, fetchProgramadasProximos, createFerias } = useFeriasFuncionario();
  const { pontos, loading: loadingPontos, createPonto } = usePontoEletronico();

  // Estados para estatísticas
  const [statusDocumentos, setStatusDocumentos] = useState({ total: 0, validos: 0, vencidos: 0, aVencer: 0 });
  const [statusFerias, setStatusFerias] = useState({ total: 0, programadas: 0, emAndamento: 0, concluidas: 0, canceladas: 0 });
  const [docVencidos, setDocVencidos] = useState(0);
  const [docAVencer, setDocAVencer] = useState(0);
  const [feriasProximas, setFeriasProximas] = useState(0);
  const [horasExtrasMes, setHorasExtrasMes] = useState(0);

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    // Evita carregar múltiplas vezes
    if (statsLoadedRef.current || loadingDocumentos || loadingFerias || loadingPontos) {
      return;
    }

    const loadStats = async () => {
      statsLoadedRef.current = true;
      
      try {
        // Status de documentos - com tratamento de erro
        try {
          const statusDoc = await fetchStatusDocumentos();
          if (statusDoc) {
            setStatusDocumentos(statusDoc);
            setDocVencidos(statusDoc.vencidos);
            setDocAVencer(statusDoc.aVencer);
          }
        } catch (err) {
          console.error('Erro ao carregar status de documentos:', err);
          // Continua mesmo com erro
        }

        // Status de férias - com tratamento de erro
        try {
          const statusFer = await fetchStatusFerias();
          if (statusFer) {
            setStatusFerias(statusFer);
          }
        } catch (err) {
          console.error('Erro ao carregar status de férias:', err);
        }

        // Férias programadas próximos 30 dias - com tratamento de erro
        try {
          const proximasFerias = await fetchProgramadasProximos(30);
          setFeriasProximas(proximasFerias?.length || 0);
        } catch (err) {
          console.error('Erro ao carregar férias próximas:', err);
        }

        // Calcular horas extras do mês atual
        if (pontos.length > 0) {
          const hoje = new Date();
          const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
          
          const pontosDoMes = pontos.filter(p => {
            const dataPonto = new Date(p.dataPonto);
            return dataPonto >= primeiroDia && dataPonto <= ultimoDia;
          });

          const totalHorasExtras = pontosDoMes.reduce((acc, p) => acc + (p.horasExtras || 0), 0);
          setHorasExtrasMes(Math.round(totalHorasExtras));
        }

      } catch (error) {
        console.error('Erro geral ao carregar estatísticas:', error);
      }
    };

    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingDocumentos, loadingFerias, loadingPontos]);

  // Filtrar funcionários ativos
  const funcionariosAtivos = employees.filter(emp => 
    emp.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cpf?.includes(searchTerm)
  );

  // Calcular variação de funcionários (mock - implementar lógica real depois)
  const variacaoFuncionarios = '+3 este mês';

  const stats = [
    { 
      title: 'Total Funcionários', 
      value: employees.length.toString(), 
      change: variacaoFuncionarios,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Documentos Vencidos', 
      value: docVencidos.toString(), 
      change: docVencidos > 0 ? 'Ação necessária' : 'Tudo ok',
      icon: AlertCircle,
      color: docVencidos > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: docVencidos > 0 ? 'bg-red-100' : 'bg-green-100'
    },
    { 
      title: 'Férias Programadas', 
      value: feriasProximas.toString(), 
      change: 'Próximos 30 dias',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Horas Extras (Mês)', 
      value: `${horasExtrasMes}h`, 
      change: 'Mês atual',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ];

  // Loading state
  const isLoading = loadingEmployees || loadingHistorico || loadingDocumentos || loadingFerias || loadingPontos;

  if (isLoading) {
    return <LoadingScreen message="Carregando dados de RH..." />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de RH</h1>
          <p className="text-muted-foreground">
            Gerencie histórico, documentos, férias e ponto dos funcionários
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="ferias">Férias</TabsTrigger>
          <TabsTrigger value="ponto">Ponto Eletrônico</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários Ativos</CardTitle>
              <CardDescription>Lista de todos os funcionários cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar funcionário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionariosAtivos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum funcionário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    funcionariosAtivos.map((func) => (
                      <TableRow key={func.id_pessoa}>
                        <TableCell className="font-medium">{func.nome}</TableCell>
                        <TableCell>{func.cargo || 'N/A'}</TableCell>
                        <TableCell>{func.setor || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            ATIVO
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedFuncionario(func.id_pessoa);
                              setIsFuncionarioModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico Tab */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Histórico de Eventos</CardTitle>
                  <CardDescription>Registro de admissões, promoções, mudanças e desligamentos</CardDescription>
                </div>
                <Button onClick={() => setIsHistoricoModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMISSAO">Admissão</SelectItem>
                      <SelectItem value="PROMOCAO">Promoção</SelectItem>
                      <SelectItem value="MUDANCA_SETOR">Mudança de Setor</SelectItem>
                      <SelectItem value="AUMENTO_SALARIAL">Aumento Salarial</SelectItem>
                      <SelectItem value="DESLIGAMENTO">Desligamento</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" placeholder="Data Início" />
                  <Input type="date" placeholder="Data Fim" />
                </div>

                {/* Timeline de Eventos */}
                <div className="space-y-3 mt-6">
                  {historicos.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum evento registrado
                    </div>
                  ) : (
                    historicos.slice(0, 10).map((evento) => {
                      // Mapear ícones por tipo de evento
                      const eventIcons: Record<string, { icon: any; color: string }> = {
                        'PROMOCAO': { icon: TrendingUp, color: 'green' },
                        'ADMISSAO': { icon: CheckCircle, color: 'blue' },
                        'DESLIGAMENTO': { icon: XCircle, color: 'red' },
                        'AUMENTO_SALARIAL': { icon: TrendingUp, color: 'green' },
                        'MUDANCA_SETOR': { icon: History, color: 'orange' },
                        'MUDANCA_CARGO': { icon: History, color: 'orange' },
                        'ADVERTENCIA': { icon: AlertCircle, color: 'yellow' },
                        'SUSPENSAO': { icon: AlertCircle, color: 'red' },
                      };

                      const eventConfig = eventIcons[evento.tipoEvento] || { icon: History, color: 'gray' };
                      const IconComponent = eventConfig.icon;

                      return (
                        <div key={evento.idHistorico} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`p-2 rounded-full bg-${eventConfig.color}-100`}>
                            <IconComponent className={`h-5 w-5 text-${eventConfig.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{evento.nomeFuncionario || 'Funcionário'}</p>
                                <p className="text-sm text-muted-foreground">
                                  {evento.tipoEvento.replace(/_/g, ' ')} 
                                  {evento.descricao && ` - ${evento.descricao}`}
                                </p>
                                {evento.cargoAnterior && evento.cargoNovo && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {evento.cargoAnterior} → {evento.cargoNovo}
                                  </p>
                                )}
                                {evento.salarioAnterior && evento.salarioNovo && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    R$ {evento.salarioAnterior.toFixed(2)} → R$ {evento.salarioNovo.toFixed(2)}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos Tab */}
        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Documentos dos Funcionários</CardTitle>
                  <CardDescription>Gerencie RG, CPF, CTPS, CNH e outros documentos</CardDescription>
                </div>
                <Button onClick={() => setIsDocumentoModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Documento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Alertas de Documentos */}
              <div className="space-y-3 mb-6">
                {docVencidos > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-900">{docVencidos} documentos vencidos</p>
                      <p className="text-xs text-red-700">Requer atenção imediata</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={async () => {
                        const vencidos = await fetchVencidos();
                        setDocumentosAlerta(vencidos || []);
                        setIsDocVencidosModalOpen(true);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                )}
                {docAVencer > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">{docAVencer} documentos vencem em 30 dias</p>
                      <p className="text-xs text-orange-700">Planeje a renovação</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={async () => {
                        const aVencer = await fetchVencendoEm(30);
                        setDocumentosAlerta(aVencer || []);
                        setIsDocAVencerModalOpen(true);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                )}
              </div>

              {/* Tabela de Documentos */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhum documento cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    documentos.slice(0, 20).map((doc) => {
                      // Calcular status do documento
                      let status = 'VÁLIDO';
                      let statusVariant: 'default' | 'secondary' | 'destructive' = 'default';
                      
                      if (doc.dataValidade) {
                        const hoje = new Date();
                        const validade = new Date(doc.dataValidade);
                        const diasRestantes = Math.floor((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
                        
                        if (diasRestantes < 0) {
                          status = 'VENCIDO';
                          statusVariant = 'destructive';
                        } else if (diasRestantes <= 30) {
                          status = 'A VENCER';
                          statusVariant = 'secondary';
                        }
                      }

                      return (
                        <TableRow key={doc.idDocumento}>
                          <TableCell className="font-medium">
                            {employees.find(e => e.id_pessoa === doc.idFuncionario)?.nome || `ID: ${doc.idFuncionario}`}
                          </TableCell>
                          <TableCell>{doc.tipoDocumento.replace(/_/g, ' ')}</TableCell>
                          <TableCell>{doc.numeroDocumento}</TableCell>
                          <TableCell>
                            {doc.dataValidade 
                              ? new Date(doc.dataValidade).toLocaleDateString('pt-BR')
                              : 'Indeterminada'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant}>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedDocumento(doc);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Férias Tab */}
        <TabsContent value="ferias" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Controle de Férias</CardTitle>
                  <CardDescription>Gerencie férias programadas, em andamento e concluídas</CardDescription>
                </div>
                <Button onClick={() => setIsFeriasModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Programar Férias
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Status de Férias */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                  { id: 'programadas', label: 'Programadas', value: statusFerias.programadas, color: 'blue' },
                  { id: 'em-andamento', label: 'Em Andamento', value: statusFerias.emAndamento, color: 'green' },
                  { id: 'concluidas', label: 'Concluídas', value: statusFerias.concluidas, color: 'gray' },
                  { id: 'canceladas', label: 'Canceladas', value: statusFerias.canceladas, color: 'red' },
                ].map((stat) => (
                  <Card key={stat.id}>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tabela de Férias */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ferias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhuma férias cadastrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    ferias.slice(0, 20).map((feria) => (
                      <TableRow key={feria.idFerias}>
                        <TableCell className="font-medium">
                          {feria.nomeFuncionario || employees.find(e => e.id_pessoa === feria.idFuncionario)?.nome || `ID: ${feria.idFuncionario}`}
                        </TableCell>
                        <TableCell>
                          {new Date(feria.dataInicioFerias).toLocaleDateString('pt-BR')} a {new Date(feria.dataFimFerias).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{feria.diasGozados} dias</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              feria.statusFerias === 'PROGRAMADAS' ? 'secondary' : 
                              feria.statusFerias === 'EM_ANDAMENTO' ? 'default' : 
                              'outline'
                            }
                          >
                            {feria.statusFerias?.replace('_', ' ') || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedFerias(feria);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ponto Eletrônico Tab */}
        <TabsContent value="ponto" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Ponto Eletrônico</CardTitle>
                  <CardDescription>Controle de horários, horas trabalhadas e horas extras</CardDescription>
                </div>
                <Button onClick={() => setIsPontoModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Ponto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Resumo de Horas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {(() => {
                  const hoje = new Date();
                  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                  const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
                  
                  const pontosDoMes = pontos.filter(p => {
                    const dataPonto = new Date(p.dataPonto);
                    return dataPonto >= primeiroDia && dataPonto <= ultimoDia;
                  });

                  const totalHoras = pontosDoMes.reduce((acc, p) => acc + (p.horasTrabalhadas || 0), 0);
                  const totalExtras = pontosDoMes.reduce((acc, p) => acc + (p.horasExtras || 0), 0);

                  return [
                    { id: 'horas-trabalhadas', label: 'Horas Trabalhadas (Mês)', value: `${Math.round(totalHoras)}h`, icon: Clock },
                    { id: 'horas-extras', label: 'Horas Extras (Mês)', value: `${Math.round(totalExtras)}h`, icon: TrendingUp },
                    { id: 'funcionarios-registro', label: 'Funcionários com Registro', value: new Set(pontosDoMes.map(p => p.idFuncionario)).size.toString(), icon: Users },
                  ].map((stat) => (
                    <Card key={stat.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          </div>
                          <stat.icon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ));
                })()}
              </div>

              {/* Registros de Ponto */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída Almoço</TableHead>
                    <TableHead>Retorno Almoço</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Extras</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pontos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        Nenhum registro de ponto
                      </TableCell>
                    </TableRow>
                  ) : (
                    pontos
                      .sort((a, b) => new Date(b.dataPonto).getTime() - new Date(a.dataPonto).getTime())
                      .slice(0, 20)
                      .map((ponto) => (
                        <TableRow key={ponto.idPonto}>
                          <TableCell className="font-medium">
                            {ponto.nomeFuncionario || employees.find(e => e.id_pessoa === ponto.idFuncionario)?.nome || `ID: ${ponto.idFuncionario}`}
                          </TableCell>
                          <TableCell>{new Date(ponto.dataPonto).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{ponto.horaEntrada || '-'}</TableCell>
                          <TableCell>{ponto.horaSaidaAlmoco || '-'}</TableCell>
                          <TableCell>{ponto.horaRetornoAlmoco || '-'}</TableCell>
                          <TableCell>{ponto.horaSaida || '-'}</TableCell>
                          <TableCell>{ponto.horasTrabalhadas ? `${ponto.horasTrabalhadas.toFixed(1)}h` : '-'}</TableCell>
                          <TableCell>
                            {ponto.horasExtras && ponto.horasExtras > 0 ? (
                              <Badge variant="secondary">{ponto.horasExtras.toFixed(1)}h</Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedPonto(ponto);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Novo Evento no Histórico */}
      <Dialog open={isHistoricoModalOpen} onOpenChange={setIsHistoricoModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Novo Evento</DialogTitle>
            <DialogDescription>Adicione um novo evento ao histórico do funcionário</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const historico = {
              idFuncionario: Number(formData.get('idFuncionario')),
              tipoEvento: formData.get('tipoEvento') as any,
              dataEvento: formData.get('dataEvento') as string,
              cargoAnterior: formData.get('cargoAnterior') as string || undefined,
              cargoNovo: formData.get('cargoNovo') as string || undefined,
              setorAnterior: formData.get('setorAnterior') as string || undefined,
              setorNovo: formData.get('setorNovo') as string || undefined,
              salarioAnterior: formData.get('salarioAnterior') ? Number(formData.get('salarioAnterior')) : undefined,
              salarioNovo: formData.get('salarioNovo') ? Number(formData.get('salarioNovo')) : undefined,
              descricao: formData.get('descricao') as string || undefined,
            };
            try {
              await createHistorico(historico);
              setIsHistoricoModalOpen(false);
              // Recarregar dados
              window.location.reload();
            } catch (err: any) {
              console.error('Erro ao criar evento:', err);
              const errorMessage = err?.message || 'Erro ao criar evento. Verifique os dados e tente novamente.';
              alert(errorMessage);
            }
          }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idFuncionario">Funcionário *</Label>
                  <Select name="idFuncionario" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id_pessoa} value={emp.id_pessoa.toString()}>
                          {emp.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipoEvento">Tipo de Evento *</Label>
                  <Select name="tipoEvento" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMISSAO">Admissão</SelectItem>
                      <SelectItem value="PROMOCAO">Promoção</SelectItem>
                      <SelectItem value="MUDANCA_SETOR">Mudança de Setor</SelectItem>
                      <SelectItem value="MUDANCA_CARGO">Mudança de Cargo</SelectItem>
                      <SelectItem value="AUMENTO_SALARIAL">Aumento Salarial</SelectItem>
                      <SelectItem value="DESLIGAMENTO">Desligamento</SelectItem>
                      <SelectItem value="FERIAS">Férias</SelectItem>
                      <SelectItem value="AFASTAMENTO">Afastamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dataEvento">Data do Evento *</Label>
                <Input type="date" name="dataEvento" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargoAnterior">Cargo Anterior</Label>
                  <Input type="text" name="cargoAnterior" placeholder="Cargo anterior (se aplicável)" />
                </div>
                <div>
                  <Label htmlFor="cargoNovo">Cargo Novo</Label>
                  <Input type="text" name="cargoNovo" placeholder="Novo cargo (se aplicável)" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="setorAnterior">Setor Anterior</Label>
                  <Input type="text" name="setorAnterior" placeholder="Setor anterior (se aplicável)" />
                </div>
                <div>
                  <Label htmlFor="setorNovo">Setor Novo</Label>
                  <Input type="text" name="setorNovo" placeholder="Novo setor (se aplicável)" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salarioAnterior">Salário Anterior (R$)</Label>
                  <Input type="number" step="0.01" name="salarioAnterior" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="salarioNovo">Salário Novo (R$)</Label>
                  <Input type="number" step="0.01" name="salarioNovo" placeholder="0.00" />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input type="text" name="descricao" placeholder="Observações sobre o evento" />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsHistoricoModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Evento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Novo Documento */}
      <Dialog open={isDocumentoModalOpen} onOpenChange={setIsDocumentoModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Documento</DialogTitle>
            <DialogDescription>Cadastre um novo documento do funcionário</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const documento = {
              idFuncionario: Number(formData.get('idFuncionario')),
              tipoDocumento: formData.get('tipoDocumento') as any,
              numeroDocumento: formData.get('numeroDocumento') as string,
              dataEmissao: formData.get('dataEmissao') as string || undefined,
              dataValidade: formData.get('dataValidade') as string || undefined,
              observacoes: formData.get('observacoes') as string || undefined,
            };
            try {
              await createDocumento(documento);
              setIsDocumentoModalOpen(false);
              window.location.reload();
            } catch (err: any) {
              console.error('Erro ao criar documento:', err);
              const errorMessage = err?.message || 'Erro ao criar documento. Verifique os dados e tente novamente.';
              alert(errorMessage);
            }
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="idFuncionario">Funcionário *</Label>
                <Select name="idFuncionario" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id_pessoa} value={emp.id_pessoa.toString()}>
                        {emp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                  <Select name="tipoDocumento" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RG">RG</SelectItem>
                      <SelectItem value="CPF">CPF</SelectItem>
                      <SelectItem value="CTPS">CTPS</SelectItem>
                      <SelectItem value="CNH">CNH</SelectItem>
                      <SelectItem value="TITULO_ELEITOR">Título de Eleitor</SelectItem>
                      <SelectItem value="RESERVISTA">Reservista</SelectItem>
                      <SelectItem value="PIS_PASEP">PIS/PASEP</SelectItem>
                      <SelectItem value="CERTIDAO_NASCIMENTO">Certidão de Nascimento</SelectItem>
                      <SelectItem value="CERTIDAO_CASAMENTO">Certidão de Casamento</SelectItem>
                      <SelectItem value="COMPROVANTE_RESIDENCIA">Comprovante de Residência</SelectItem>
                      <SelectItem value="OUTRO">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numeroDocumento">Número do Documento *</Label>
                  <Input type="text" name="numeroDocumento" required placeholder="Ex: 12.345.678-9" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataEmissao">Data de Emissão</Label>
                  <Input type="date" name="dataEmissao" />
                </div>
                <div>
                  <Label htmlFor="dataValidade">Data de Validade</Label>
                  <Input type="date" name="dataValidade" />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input type="text" name="observacoes" placeholder="Informações adicionais" />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDocumentoModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar Documento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Programar Férias */}
      <Dialog open={isFeriasModalOpen} onOpenChange={setIsFeriasModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Programar Férias</DialogTitle>
            <DialogDescription>Programe as férias de um funcionário</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            // Parse das datas corretamente
            const dataInicioStr = formData.get('dataInicioFerias') as string;
            const dataFimStr = formData.get('dataFimFerias') as string;
            
            // Criar objetos Date em UTC para evitar problemas de timezone
            const dataInicio = new Date(dataInicioStr + 'T00:00:00');
            const dataFim = new Date(dataFimStr + 'T00:00:00');
            
            // Calcular dias de férias (incluindo o primeiro e último dia)
            const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
            const diasGozados = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            console.log('📅 Calculando férias:');
            console.log('  Data Início:', dataInicioStr, '→', dataInicio);
            console.log('  Data Fim:', dataFimStr, '→', dataFim);
            console.log('  Dias Gozados:', diasGozados);
            
            // Validação antes de enviar
            if (diasGozados < 1 || diasGozados > 30) {
              alert(`Erro: Quantidade de dias deve estar entre 1 e 30. Você selecionou ${diasGozados} dias.`);
              return;
            }
            
            const ferias = {
              idFuncionario: Number(formData.get('idFuncionario')),
              periodoAquisitivoInicio: formData.get('periodoAquisitivoInicio') as string || undefined,
              periodoAquisitivoFim: formData.get('periodoAquisitivoFim') as string || undefined,
              dataInicioFerias: dataInicioStr,
              dataFimFerias: dataFimStr,
              diasGozados: diasGozados,
              abonoPecuniario: formData.get('abonoPecuniario') === 'on',
              statusFerias: 'PROGRAMADAS' as any,
              observacoes: formData.get('observacoes') as string || undefined,
            };
            
            console.log('📤 Enviando férias:', ferias);
            
            try {
              await createFerias(ferias);
              setIsFeriasModalOpen(false);
              window.location.reload();
            } catch (err: any) {
              console.error('Erro ao programar férias:', err);
              const errorMessage = err?.message || 'Erro ao programar férias. Verifique os dados e tente novamente.';
              alert(errorMessage);
            }
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="idFuncionario">Funcionário *</Label>
                <Select name="idFuncionario" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id_pessoa} value={emp.id_pessoa.toString()}>
                        {emp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="periodoAquisitivoInicio">Período Aquisitivo - Início</Label>
                  <Input type="date" name="periodoAquisitivoInicio" />
                </div>
                <div>
                  <Label htmlFor="periodoAquisitivoFim">Período Aquisitivo - Fim</Label>
                  <Input type="date" name="periodoAquisitivoFim" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataInicioFerias">Data Início das Férias *</Label>
                  <Input type="date" name="dataInicioFerias" required />
                </div>
                <div>
                  <Label htmlFor="dataFimFerias">Data Fim das Férias *</Label>
                  <Input type="date" name="dataFimFerias" required />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="abonoPecuniario" 
                  name="abonoPecuniario"
                  className="w-4 h-4"
                />
                <Label htmlFor="abonoPecuniario" className="cursor-pointer">
                  Abono Pecuniário (venda de 10 dias)
                </Label>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input type="text" name="observacoes" placeholder="Informações adicionais" />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsFeriasModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Programar Férias
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Registrar Ponto */}
      <Dialog open={isPontoModalOpen} onOpenChange={setIsPontoModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Ponto Eletrônico</DialogTitle>
            <DialogDescription>Registre ou corrija o ponto de um funcionário</DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            // Calcular horas trabalhadas e extras
            const entrada = formData.get('horaEntrada') as string;
            const saidaAlmoco = formData.get('horaSaidaAlmoco') as string;
            const retornoAlmoco = formData.get('horaRetornoAlmoco') as string;
            const saida = formData.get('horaSaida') as string;
            
            let horasTrabalhadas = 0;
            let horasExtras = 0;
            
            if (entrada && saida) {
              const [hE, mE] = entrada.split(':').map(Number);
              const [hS, mS] = saida.split(':').map(Number);
              let minutosTrabalhados = (hS * 60 + mS) - (hE * 60 + mE);
              
              // Subtrair almoço se informado
              if (saidaAlmoco && retornoAlmoco) {
                const [hSA, mSA] = saidaAlmoco.split(':').map(Number);
                const [hRA, mRA] = retornoAlmoco.split(':').map(Number);
                const minutosAlmoco = (hRA * 60 + mRA) - (hSA * 60 + mSA);
                minutosTrabalhados -= minutosAlmoco;
              }
              
              horasTrabalhadas = minutosTrabalhados / 60;
              
              // Horas extras (acima de 8h)
              if (horasTrabalhadas > 8) {
                horasExtras = horasTrabalhadas - 8;
                horasTrabalhadas = 8;
              }
            }
            
            const ponto = {
              idFuncionario: Number(formData.get('idFuncionario')),
              dataPonto: formData.get('dataPonto') as string,
              horaEntrada: entrada || undefined,
              horaSaidaAlmoco: saidaAlmoco || undefined,
              horaRetornoAlmoco: retornoAlmoco || undefined,
              horaSaida: saida || undefined,
              horasTrabalhadas: horasTrabalhadas,
              horasExtras: horasExtras,
              statusPonto: (formData.get('statusPonto') as any) || 'NORMAL',
              observacoes: formData.get('observacoes') as string || undefined,
            };
            try {
              await createPonto(ponto);
              setIsPontoModalOpen(false);
              window.location.reload();
            } catch (err: any) {
              console.error('Erro ao registrar ponto:', err);
              const errorMessage = err?.message || 'Erro ao registrar ponto. Verifique os dados e tente novamente.';
              alert(errorMessage);
            }
          }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idFuncionario">Funcionário *</Label>
                  <Select name="idFuncionario" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id_pessoa} value={emp.id_pessoa.toString()}>
                          {emp.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dataPonto">Data do Ponto *</Label>
                  <Input type="date" name="dataPonto" required />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="horaEntrada">Entrada</Label>
                  <Input type="time" name="horaEntrada" placeholder="08:00" />
                </div>
                <div>
                  <Label htmlFor="horaSaidaAlmoco">Saída Almoço</Label>
                  <Input type="time" name="horaSaidaAlmoco" placeholder="12:00" />
                </div>
                <div>
                  <Label htmlFor="horaRetornoAlmoco">Retorno Almoço</Label>
                  <Input type="time" name="horaRetornoAlmoco" placeholder="13:00" />
                </div>
                <div>
                  <Label htmlFor="horaSaida">Saída</Label>
                  <Input type="time" name="horaSaida" placeholder="17:00" />
                </div>
              </div>

              <div>
                <Label htmlFor="statusPonto">Status</Label>
                <Select name="statusPonto">
                  <SelectTrigger>
                    <SelectValue placeholder="NORMAL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="FALTA">Falta</SelectItem>
                    <SelectItem value="ATESTADO">Atestado</SelectItem>
                    <SelectItem value="FERIAS">Férias</SelectItem>
                    <SelectItem value="FOLGA">Folga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input type="text" name="observacoes" placeholder="Informações adicionais" />
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> As horas trabalhadas e extras serão calculadas automaticamente com base nos horários informados.
                  Jornada padrão: 8 horas. Horas acima de 8h serão contabilizadas como extras.
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsPontoModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Ponto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Funcionário */}
      <Dialog open={isFuncionarioModalOpen} onOpenChange={(open) => {
        setIsFuncionarioModalOpen(open);
        if (!open) setSelectedFuncionario(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Funcionário</DialogTitle>
          </DialogHeader>
          
          {selectedFuncionario && (() => {
            const funcionario = employees.find(e => e.id_pessoa === selectedFuncionario);
            if (!funcionario) return <p>Funcionário não encontrado</p>;

            const historicoFuncionario = historicos.filter(h => h.idFuncionario === selectedFuncionario);
            const documentosFuncionario = documentos.filter(d => d.idFuncionario === selectedFuncionario);
            const feriasFuncionario = ferias.filter(f => f.idFuncionario === selectedFuncionario);
            const pontosFuncionario = pontos.filter(p => p.idFuncionario === selectedFuncionario).slice(0, 10);

            return (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <p className="text-sm mt-1 font-medium">{funcionario.nome}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
                      <p className="text-sm mt-1">{funcionario.cpf || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Cargo</Label>
                      <p className="text-sm mt-1">{funcionario.cargo || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                      <p className="text-sm mt-1">{funcionario.setor || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-sm mt-1">{funcionario.email || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                      <p className="text-sm mt-1">{funcionario.telefones?.[0] || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Documentos */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documentos ({documentosFuncionario.length})
                  </h3>
                  {documentosFuncionario.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum documento cadastrado</p>
                  ) : (
                    <div className="space-y-2">
                      {documentosFuncionario.slice(0, 5).map((doc) => (
                        <div key={doc.idDocumento} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.tipoDocumento.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-muted-foreground">{doc.numeroDocumento || 'Sem número'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Validade: {doc.dataValidade 
                                ? new Date(doc.dataValidade).toLocaleDateString('pt-BR')
                                : 'Indeterminada'
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Férias */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Férias ({feriasFuncionario.length})
                  </h3>
                  {feriasFuncionario.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma férias cadastrada</p>
                  ) : (
                    <div className="space-y-2">
                      {feriasFuncionario.slice(0, 5).map((feria) => (
                        <div key={feria.idFerias} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(feria.dataInicioFerias).toLocaleDateString('pt-BR')} a {new Date(feria.dataFimFerias).toLocaleDateString('pt-BR')}
                              </p>
                              <p className="text-xs text-muted-foreground">{feria.diasGozados} dias</p>
                            </div>
                          </div>
                          <Badge 
                            variant={
                              feria.statusFerias === 'PROGRAMADAS' ? 'secondary' : 
                              feria.statusFerias === 'EM_ANDAMENTO' ? 'default' : 
                              'outline'
                            }
                          >
                            {feria.statusFerias?.replace('_', ' ') || 'N/A'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Histórico */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Histórico de Eventos ({historicoFuncionario.length})
                  </h3>
                  {historicoFuncionario.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum evento registrado</p>
                  ) : (
                    <div className="space-y-2">
                      {historicoFuncionario.slice(0, 5).map((evento) => (
                        <div key={evento.idHistorico} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-full bg-blue-100">
                              <History className="h-3 w-3 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{evento.tipoEvento.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-muted-foreground">{evento.descricao || 'Sem descrição'}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ponto Eletrônico (últimos 10 registros) */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Últimos Registros de Ponto ({pontosFuncionario.length})
                  </h3>
                  {pontosFuncionario.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum registro de ponto</p>
                  ) : (
                    <div className="space-y-2">
                      {pontosFuncionario.map((ponto) => (
                        <div key={ponto.idPonto} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(ponto.dataPonto).toLocaleDateString('pt-BR')}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {ponto.horaEntrada || '--:--'} | {ponto.horaSaida || '--:--'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium">
                              {ponto.horasTrabalhadas ? `${ponto.horasTrabalhadas.toFixed(1)}h` : '-'}
                            </p>
                            {ponto.horasExtras && ponto.horasExtras > 0 && (
                              <p className="text-xs text-green-600">+{ponto.horasExtras.toFixed(1)}h extras</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFuncionarioModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Detalhes */}
      <Dialog open={isViewModalOpen} onOpenChange={(open) => {
        setIsViewModalOpen(open);
        if (!open) {
          setSelectedDocumento(null);
          setSelectedFerias(null);
          setSelectedPonto(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDocumento && 'Detalhes do Documento'}
              {selectedFerias && 'Detalhes das Férias'}
              {selectedPonto && 'Detalhes do Ponto'}
            </DialogTitle>
          </DialogHeader>
          
          {/* Detalhes de Documento */}
          {selectedDocumento && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Funcionário</Label>
                  <p className="text-sm mt-1">{selectedDocumento.nomeFuncionario || `ID: ${selectedDocumento.idFuncionario}`}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Matrícula</Label>
                  <p className="text-sm mt-1">{selectedDocumento.matriculaFuncionario || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo de Documento</Label>
                  <p className="text-sm mt-1">{selectedDocumento.tipoDocumento.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Número</Label>
                  <p className="text-sm mt-1">{selectedDocumento.numeroDocumento || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data de Emissão</Label>
                  <p className="text-sm mt-1">
                    {selectedDocumento.dataEmissao 
                      ? new Date(selectedDocumento.dataEmissao).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data de Validade</Label>
                  <p className="text-sm mt-1">
                    {selectedDocumento.dataValidade 
                      ? new Date(selectedDocumento.dataValidade).toLocaleDateString('pt-BR')
                      : 'Indeterminada'
                    }
                  </p>
                </div>
                {selectedDocumento.arquivoUrl && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Arquivo</Label>
                    <p className="text-sm mt-1">
                      <a href={selectedDocumento.arquivoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Ver documento
                      </a>
                    </p>
                  </div>
                )}
                {selectedDocumento.observacoes && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                    <p className="text-sm mt-1">{selectedDocumento.observacoes}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cadastrado em</Label>
                  <p className="text-sm mt-1">
                    {selectedDocumento.dataCadastro 
                      ? new Date(selectedDocumento.dataCadastro).toLocaleString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detalhes de Férias */}
          {selectedFerias && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Funcionário</Label>
                  <p className="text-sm mt-1">{selectedFerias.nomeFuncionario || `ID: ${selectedFerias.idFuncionario}`}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Matrícula</Label>
                  <p className="text-sm mt-1">{selectedFerias.matriculaFuncionario || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cargo</Label>
                  <p className="text-sm mt-1">{selectedFerias.cargoFuncionario || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                  <p className="text-sm mt-1">{selectedFerias.setorFuncionario || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Período Aquisitivo</Label>
                  <p className="text-sm mt-1">
                    {selectedFerias.periodoAquisitivoInicio && selectedFerias.periodoAquisitivoFim
                      ? `${new Date(selectedFerias.periodoAquisitivoInicio).toLocaleDateString('pt-BR')} a ${new Date(selectedFerias.periodoAquisitivoFim).toLocaleDateString('pt-BR')}`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="text-sm mt-1">
                    <Badge 
                      variant={
                        selectedFerias.statusFerias === 'PROGRAMADAS' ? 'secondary' : 
                        selectedFerias.statusFerias === 'EM_ANDAMENTO' ? 'default' : 
                        'outline'
                      }
                    >
                      {selectedFerias.statusFerias?.replace('_', ' ') || 'N/A'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Período de Férias</Label>
                  <p className="text-sm mt-1">
                    {new Date(selectedFerias.dataInicioFerias).toLocaleDateString('pt-BR')} a {new Date(selectedFerias.dataFimFerias).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Dias Gozados</Label>
                  <p className="text-sm mt-1">{selectedFerias.diasGozados} dias</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Abono Pecuniário</Label>
                  <p className="text-sm mt-1">{selectedFerias.abonoPecuniario ? 'Sim' : 'Não'}</p>
                </div>
                {selectedFerias.observacoes && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                    <p className="text-sm mt-1">{selectedFerias.observacoes}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cadastrado em</Label>
                  <p className="text-sm mt-1">
                    {selectedFerias.dataCadastro 
                      ? new Date(selectedFerias.dataCadastro).toLocaleString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detalhes de Ponto */}
          {selectedPonto && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Funcionário</Label>
                  <p className="text-sm mt-1">{selectedPonto.nomeFuncionario || `ID: ${selectedPonto.idFuncionario}`}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Matrícula</Label>
                  <p className="text-sm mt-1">{selectedPonto.matriculaFuncionario || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cargo</Label>
                  <p className="text-sm mt-1">{selectedPonto.cargoFuncionario || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                  <p className="text-sm mt-1">{selectedPonto.setorFuncionario || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Data</Label>
                  <p className="text-sm mt-1">{new Date(selectedPonto.dataPonto).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="text-sm mt-1">
                    <Badge>
                      {selectedPonto.statusPonto || 'NORMAL'}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Horários</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Entrada</Label>
                    <p className="text-sm mt-1 font-mono">{selectedPonto.horaEntrada || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Saída para Almoço</Label>
                    <p className="text-sm mt-1 font-mono">{selectedPonto.horaSaidaAlmoco || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Retorno do Almoço</Label>
                    <p className="text-sm mt-1 font-mono">{selectedPonto.horaRetornoAlmoco || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Saída</Label>
                    <p className="text-sm mt-1 font-mono">{selectedPonto.horaSaida || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Cálculo de Horas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Horas Trabalhadas</Label>
                    <p className="text-sm mt-1 font-semibold">{selectedPonto.horasTrabalhadas ? `${selectedPonto.horasTrabalhadas.toFixed(2)}h` : '0h'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Horas Extras</Label>
                    <p className="text-sm mt-1 font-semibold text-green-600">
                      {selectedPonto.horasExtras ? `${selectedPonto.horasExtras.toFixed(2)}h` : '0h'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedPonto.observacoes && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                  <p className="text-sm mt-1">{selectedPonto.observacoes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-muted-foreground">Registrado em</Label>
                <p className="text-sm mt-1">
                  {selectedPonto.dataRegistro 
                    ? new Date(selectedPonto.dataRegistro).toLocaleString('pt-BR')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Documentos Vencidos */}
      <Dialog open={isDocVencidosModalOpen} onOpenChange={setIsDocVencidosModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Documentos Vencidos
            </DialogTitle>
            <DialogDescription>
              Documentos que já ultrapassaram a data de validade e precisam ser renovados imediatamente
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {documentosAlerta.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>Nenhum documento vencido encontrado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documentosAlerta.map((doc) => {
                  const funcionario = employees.find(e => e.id_pessoa === doc.idFuncionario);
                  const nomeFunc = funcionario?.nome || `Funcionário ID: ${doc.idFuncionario}`;
                  const matricula = funcionario?.matricula || 'N/A';
                  
                  const dataValidade = doc.dataValidade ? new Date(doc.dataValidade) : null;
                  const hoje = new Date();
                  const diasVencido = dataValidade 
                    ? Math.floor((hoje.getTime() - dataValidade.getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                  
                  return (
                    <Card key={doc.idDocumento} className="border-red-200 bg-red-50/50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Funcionário</Label>
                            <p className="text-sm font-medium mt-1">{nomeFunc}</p>
                            <p className="text-xs text-muted-foreground">Mat: {matricula}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Tipo</Label>
                            <p className="text-sm font-medium mt-1">
                              {doc.tipoDocumento?.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.numeroDocumento || 'Sem número'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Validade</Label>
                            <p className="text-sm font-medium mt-1 text-red-600">
                              {dataValidade 
                                ? dataValidade.toLocaleDateString('pt-BR')
                                : 'Não informada'
                              }
                            </p>
                            <p className="text-xs text-red-600 font-medium">
                              Vencido há {diasVencido} dias
                            </p>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDocumento(doc);
                                setIsViewModalOpen(true);
                                setIsDocVencidosModalOpen(false);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Mais
                            </Button>
                          </div>
                        </div>
                        {doc.observacoes && (
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <Label className="text-xs font-medium text-muted-foreground">Observações</Label>
                            <p className="text-xs mt-1">{doc.observacoes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocVencidosModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Documentos a Vencer */}
      <Dialog open={isDocAVencerModalOpen} onOpenChange={setIsDocAVencerModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              Documentos a Vencer (próximos 30 dias)
            </DialogTitle>
            <DialogDescription>
              Documentos que vencerão em breve - planeje a renovação antecipadamente
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {documentosAlerta.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>Nenhum documento vencendo nos próximos 30 dias</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documentosAlerta.map((doc) => {
                  const funcionario = employees.find(e => e.id_pessoa === doc.idFuncionario);
                  const nomeFunc = funcionario?.nome || `Funcionário ID: ${doc.idFuncionario}`;
                  const matricula = funcionario?.matricula || 'N/A';
                  
                  const dataValidade = doc.dataValidade ? new Date(doc.dataValidade) : null;
                  const hoje = new Date();
                  const diasRestantes = dataValidade 
                    ? Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                  
                  const bgColor = diasRestantes <= 7 ? 'bg-red-50/50' : diasRestantes <= 15 ? 'bg-orange-50/50' : 'bg-yellow-50/50';
                  const borderColor = diasRestantes <= 7 ? 'border-red-200' : diasRestantes <= 15 ? 'border-orange-200' : 'border-yellow-200';
                  const textColor = diasRestantes <= 7 ? 'text-red-600' : diasRestantes <= 15 ? 'text-orange-600' : 'text-yellow-600';
                  
                  return (
                    <Card key={doc.idDocumento} className={`${borderColor} ${bgColor}`}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Funcionário</Label>
                            <p className="text-sm font-medium mt-1">{nomeFunc}</p>
                            <p className="text-xs text-muted-foreground">Mat: {matricula}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Tipo</Label>
                            <p className="text-sm font-medium mt-1">
                              {doc.tipoDocumento?.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.numeroDocumento || 'Sem número'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground">Validade</Label>
                            <p className="text-sm font-medium mt-1">
                              {dataValidade 
                                ? dataValidade.toLocaleDateString('pt-BR')
                                : 'Não informada'
                              }
                            </p>
                            <p className={`text-xs ${textColor} font-medium`}>
                              {diasRestantes === 0 ? 'Vence hoje!' : 
                               diasRestantes === 1 ? 'Vence amanhã!' :
                               `Vence em ${diasRestantes} dias`}
                            </p>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDocumento(doc);
                                setIsViewModalOpen(true);
                                setIsDocAVencerModalOpen(false);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Mais
                            </Button>
                          </div>
                        </div>
                        {doc.observacoes && (
                          <div className={`mt-3 pt-3 border-t ${borderColor}`}>
                            <Label className="text-xs font-medium text-muted-foreground">Observações</Label>
                            <p className="text-xs mt-1">{doc.observacoes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocAVencerModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RHPage;
