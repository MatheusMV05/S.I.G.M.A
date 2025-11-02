import React, { useState } from 'react';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  DollarSign,
  Save,
  X,
  User,
  Briefcase,
  Clock,
  UserCheck,
  TrendingUp,
  Calendar,
  Award,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployees, useEmployeeOptions } from '@/hooks/useEmployees';
import { 
  type Funcionario, 
  type CreateFuncionarioRequest,
  StatusFuncionario,
  TurnoTrabalho,
  TipoContrato,
  employeeService
} from '@/services/employeeService';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function EmployeesManagement() {
  const { user } = useAuth();
  const { 
    employees, 
    loading, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    toggleEmployeeStatus,
    updateFilters,
    clearFilters 
  } = useEmployees();
  
  const { departments, positions, supervisors, loading: optionsLoading } = useEmployeeOptions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Funcionario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateFuncionarioRequest>>({});
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Funções de formatação
  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf?: string) => {
    if (!cpf) return '-';
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  // Formatação de enums
  const getTurnoLabel = (turno: TurnoTrabalho) => {
    const labels = {
      MANHA: 'Manhã',
      TARDE: 'Tarde',
      NOITE: 'Noite',
      INTEGRAL: 'Integral'
    };
    return labels[turno];
  };

  const getContratoLabel = (tipo: TipoContrato) => {
    const labels = {
      CLT: 'CLT',
      PJ: 'PJ',
      ESTAGIO: 'Estágio',
      TEMPORARIO: 'Temporário',
      AUTONOMO: 'Autônomo'
    };
    return labels[tipo];
  };

  const getStatusBadgeVariant = (status: StatusFuncionario) => {
    return status === StatusFuncionario.ATIVO ? 'default' : 'secondary';
  };

  // Filtrar funcionários
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cpf.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: employees.length,
    ativos: employees.filter(e => e.status === StatusFuncionario.ATIVO).length,
    inativos: employees.filter(e => e.status === StatusFuncionario.INATIVO).length,
    departamentos: new Set(employees.map(e => e.setor)).size,
    folhaMensal: employees
      .filter(e => e.status === StatusFuncionario.ATIVO)
      .reduce((sum, e) => sum + e.salario, 0)
  };

  // Handlers
  const handleEdit = (employee: Funcionario) => {
    setFormData({
      nome: employee.nome,
      cpf: employee.cpf,
      data_nascimento: employee.data_nascimento,
      rua: employee.rua,
      numero: employee.numero,
      bairro: employee.bairro,
      cidade: employee.cidade,
      estado: employee.estado,
      cep: employee.cep,
      email: employee.email,
      telefones: employee.telefones,
      matricula: employee.matricula,
      cargo: employee.cargo,
      setor: employee.setor,
      salario: employee.salario,
      data_admissao: employee.data_admissao,
      id_supervisor: employee.id_supervisor,
      turno: employee.turno,
      tipo_contrato: employee.tipo_contrato,
      carga_horaria_semanal: employee.carga_horaria_semanal,
      comissao_percentual: employee.comissao_percentual,
      meta_mensal: employee.meta_mensal,
      beneficios: employee.beneficios,
      observacoes: employee.observacoes,
      foto_url: employee.foto_url
    });
    setSelectedEmployee(employee);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    // Gerar próxima matrícula
    const nextNumber = employees.length + 1;
    const nextMatricula = `FUNC${String(nextNumber).padStart(4, '0')}`;
    
    setFormData({
      matricula: nextMatricula,
      nome: '',
      cpf: '',
      data_nascimento: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      email: '',
      telefones: [''],
      cargo: '',
      setor: '',
      salario: 0,
      data_admissao: new Date().toISOString().split('T')[0],
      turno: TurnoTrabalho.INTEGRAL,
      tipo_contrato: TipoContrato.CLT,
      carga_horaria_semanal: 40,
      comissao_percentual: 0,
      meta_mensal: 0,
      beneficios: '',
      observacoes: ''
    });
    setSelectedEmployee(null);
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (employee: Funcionario) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editMode && selectedEmployee) {
        await updateEmployee(selectedEmployee.id_funcionario, formData);
      } else {
        await createEmployee(formData as CreateFuncionarioRequest);
      }
      setIsDialogOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (employee: Funcionario) => {
    await deleteEmployee(employee.id_funcionario, employee.nome);
  };

  const handleToggleStatus = async (employee: Funcionario) => {
    await toggleEmployeeStatus(employee.id_funcionario, employee.status);
  };

  // Adicionar telefone
  const addPhone = () => {
    setFormData({
      ...formData,
      telefones: [...(formData.telefones || []), '']
    });
  };

  const updatePhone = (index: number, value: string) => {
    const phones = [...(formData.telefones || [])];
    phones[index] = value;
    setFormData({ ...formData, telefones: phones });
  };

  const removePhone = (index: number) => {
    const phones = formData.telefones?.filter((_, i) => i !== index);
    setFormData({ ...formData, telefones: phones });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DesktopOnlyPage
      title="Gestão de Funcionários"
      description="Sistema completo de recursos humanos com controle de funcionários, escalas e folha de pagamento."
      features={[
        "Cadastro completo de funcionários com dados pessoais e profissionais",
        "Controle de turnos, contratos e carga horária",
        "Gestão de comissões e metas de vendas",
        "Hierarquia organizacional com supervisores",
        "Acompanhamento de tempo de empresa e vendas",
        "Relatórios de RH e estatísticas por setor",
        "Gestão de benefícios e observações"
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Funcionários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie funcionários, cargos, salários, turnos e hierarquia organizacional
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleNew} className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold text-success">{stats.ativos}</p>
                </div>
                <UserCheck className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inativos</p>
                  <p className="text-2xl font-bold text-muted-foreground">{stats.inativos}</p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Setores</p>
                  <p className="text-2xl font-bold">{stats.departamentos}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Folha Mensal</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(stats.folhaMensal)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, matrícula, CPF ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ATIVO">Ativos</SelectItem>
              <SelectItem value="INATIVO">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela de Funcionários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Funcionários ({filteredEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Salário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id_funcionario}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{employee.nome}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{employee.email || '-'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-medium">{employee.matricula}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.cargo}</Badge>
                    </TableCell>
                    <TableCell>{employee.setor}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getTurnoLabel(employee.turno)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getContratoLabel(employee.tipo_contrato)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-success">
                        {formatCurrency(employee.salario)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(employee.status)}>
                        {employee.status === StatusFuncionario.ATIVO ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDetails(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o funcionário "{employee.nome}"? 
                                Esta ação não pode ser desfeita e removerá todos os dados associados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(employee)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog de Cadastro/Edição */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editMode ? 'Editar Funcionário' : 'Novo Funcionário'}
              </DialogTitle>
              <DialogDescription>
                {editMode ? 'Altere os dados do funcionário' : 'Cadastre um novo funcionário no sistema'}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="professional">Dados Profissionais</TabsTrigger>
                <TabsTrigger value="hr">Dados de RH</TabsTrigger>
                <TabsTrigger value="hierarchy">Hierarquia</TabsTrigger>
              </TabsList>

              {/* Dados Pessoais */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1 - Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informações Básicas
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={formData.nome || ''}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        placeholder="Nome completo do funcionário"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf || ''}
                        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                        placeholder="000.000.000-00"
                        maxLength={14}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                      <Input
                        id="data_nascimento"
                        type="date"
                        value={formData.data_nascimento || ''}
                        onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="funcionario@comprebem.com"
                      />
                    </div>

                    {/* Telefones */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Telefones</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={addPhone}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                      {formData.telefones?.map((phone, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={phone}
                            onChange={(e) => updatePhone(index, e.target.value)}
                            placeholder="(11) 99999-9999"
                          />
                          {formData.telefones && formData.telefones.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePhone(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coluna 2 - Endereço */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="rua">Rua/Avenida</Label>
                        <Input
                          id="rua"
                          value={formData.rua || ''}
                          onChange={(e) => setFormData({...formData, rua: e.target.value})}
                          placeholder="Nome da rua"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          value={formData.numero || ''}
                          onChange={(e) => setFormData({...formData, numero: e.target.value})}
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        value={formData.bairro || ''}
                        onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                        placeholder="Nome do bairro"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          value={formData.cidade || ''}
                          onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                          placeholder="Nome da cidade"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select 
                          value={formData.estado || ''} 
                          onValueChange={(value) => setFormData({...formData, estado: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="AC" value="AC">AC</SelectItem>
                            <SelectItem key="AL" value="AL">AL</SelectItem>
                            <SelectItem key="AP" value="AP">AP</SelectItem>
                            <SelectItem key="AM" value="AM">AM</SelectItem>
                            <SelectItem key="BA" value="BA">BA</SelectItem>
                            <SelectItem key="CE" value="CE">CE</SelectItem>
                            <SelectItem key="DF" value="DF">DF</SelectItem>
                            <SelectItem key="ES" value="ES">ES</SelectItem>
                            <SelectItem key="GO" value="GO">GO</SelectItem>
                            <SelectItem key="MA" value="MA">MA</SelectItem>
                            <SelectItem key="MT" value="MT">MT</SelectItem>
                            <SelectItem key="MS" value="MS">MS</SelectItem>
                            <SelectItem key="MG" value="MG">MG</SelectItem>
                            <SelectItem key="PA" value="PA">PA</SelectItem>
                            <SelectItem key="PB" value="PB">PB</SelectItem>
                            <SelectItem key="PR" value="PR">PR</SelectItem>
                            <SelectItem key="PE" value="PE">PE</SelectItem>
                            <SelectItem key="PI" value="PI">PI</SelectItem>
                            <SelectItem key="RJ" value="RJ">RJ</SelectItem>
                            <SelectItem key="RN" value="RN">RN</SelectItem>
                            <SelectItem key="RS" value="RS">RS</SelectItem>
                            <SelectItem key="RO" value="RO">RO</SelectItem>
                            <SelectItem key="RR" value="RR">RR</SelectItem>
                            <SelectItem key="SC" value="SC">SC</SelectItem>
                            <SelectItem key="SP" value="SP">SP</SelectItem>
                            <SelectItem key="SE" value="SE">SE</SelectItem>
                            <SelectItem key="TO" value="TO">TO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={formData.cep || ''}
                        onChange={(e) => setFormData({...formData, cep: e.target.value})}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Dados Profissionais */}
              <TabsContent value="professional" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1 - Cargo e Setor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Informações do Cargo
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="matricula">Matrícula *</Label>
                      <Input
                        id="matricula"
                        value={formData.matricula || ''}
                        onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                        placeholder="FUNC0001"
                        disabled={editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo *</Label>
                      <Input
                        id="cargo"
                        value={formData.cargo || ''}
                        onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                        placeholder="Ex: Gerente de Vendas"
                        list="cargos-list"
                      />
                      <datalist id="cargos-list">
                        {positions.map((pos) => (
                          <option key={pos} value={pos} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="setor">Setor *</Label>
                      <Input
                        id="setor"
                        value={formData.setor || ''}
                        onChange={(e) => setFormData({...formData, setor: e.target.value})}
                        placeholder="Ex: Vendas"
                        list="setores-list"
                      />
                      <datalist id="setores-list">
                        {departments.map((dept) => (
                          <option key={dept} value={dept} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_admissao">Data de Admissão *</Label>
                      <Input
                        id="data_admissao"
                        type="date"
                        value={formData.data_admissao || ''}
                        onChange={(e) => setFormData({...formData, data_admissao: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Coluna 2 - Remuneração */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Remuneração
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salario">Salário Base (R$) *</Label>
                      <Input
                        id="salario"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.salario || ''}
                        onChange={(e) => setFormData({...formData, salario: parseFloat(e.target.value) || 0})}
                        placeholder="2000.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comissao">Comissão (%) </Label>
                      <Input
                        id="comissao"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.comissao_percentual || ''}
                        onChange={(e) => setFormData({...formData, comissao_percentual: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Percentual de comissão sobre vendas
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta">Meta Mensal (R$)</Label>
                      <Input
                        id="meta"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.meta_mensal || ''}
                        onChange={(e) => setFormData({...formData, meta_mensal: parseFloat(e.target.value) || 0})}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground">
                        Meta de vendas mensal para o funcionário
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="beneficios">Benefícios</Label>
                      <Input
                        id="beneficios"
                        value={formData.beneficios || ''}
                        onChange={(e) => setFormData({...formData, beneficios: e.target.value})}
                        placeholder="Ex: Vale-transporte, Vale-refeição"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Dados de RH */}
              <TabsContent value="hr" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1 - Turno e Contrato */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Escala e Contrato
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="turno">Turno de Trabalho *</Label>
                      <Select 
                        value={formData.turno || TurnoTrabalho.INTEGRAL} 
                        onValueChange={(value) => setFormData({...formData, turno: value as TurnoTrabalho})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TurnoTrabalho.MANHA}>Manhã (06:00 - 14:00)</SelectItem>
                          <SelectItem value={TurnoTrabalho.TARDE}>Tarde (14:00 - 22:00)</SelectItem>
                          <SelectItem value={TurnoTrabalho.NOITE}>Noite (22:00 - 06:00)</SelectItem>
                          <SelectItem value={TurnoTrabalho.INTEGRAL}>Integral (08:00 - 18:00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo_contrato">Tipo de Contrato *</Label>
                      <Select 
                        value={formData.tipo_contrato || TipoContrato.CLT} 
                        onValueChange={(value) => setFormData({...formData, tipo_contrato: value as TipoContrato})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TipoContrato.CLT}>CLT - Consolidação das Leis do Trabalho</SelectItem>
                          <SelectItem value={TipoContrato.PJ}>PJ - Pessoa Jurídica</SelectItem>
                          <SelectItem value={TipoContrato.ESTAGIO}>Estágio</SelectItem>
                          <SelectItem value={TipoContrato.TEMPORARIO}>Temporário</SelectItem>
                          <SelectItem value={TipoContrato.AUTONOMO}>Autônomo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carga_horaria">Carga Horária Semanal</Label>
                      <Input
                        id="carga_horaria"
                        type="number"
                        min="0"
                        max="44"
                        value={formData.carga_horaria_semanal || 40}
                        onChange={(e) => setFormData({...formData, carga_horaria_semanal: parseInt(e.target.value) || 40})}
                        placeholder="40"
                      />
                      <p className="text-xs text-muted-foreground">
                        Horas semanais de trabalho (máximo 44h)
                      </p>
                    </div>
                  </div>

                  {/* Coluna 2 - Observações */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informações Adicionais
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <textarea
                        id="observacoes"
                        className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none"
                        value={formData.observacoes || ''}
                        onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                        placeholder="Observações gerais sobre o funcionário..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="foto_url">URL da Foto</Label>
                      <Input
                        id="foto_url"
                        value={formData.foto_url || ''}
                        onChange={(e) => setFormData({...formData, foto_url: e.target.value})}
                        placeholder="https://exemplo.com/foto.jpg"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL da foto do funcionário (opcional)
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Hierarquia */}
              <TabsContent value="hierarchy" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Estrutura Hierárquica
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Select 
                      value={formData.id_supervisor?.toString() || 'none'} 
                      onValueChange={(value) => setFormData({...formData, id_supervisor: value === 'none' ? undefined : parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o supervisor (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem supervisor</SelectItem>
                        {supervisors
                          .filter(sup => !selectedEmployee || sup.id_funcionario !== selectedEmployee.id_funcionario)
                          .map(supervisor => (
                            <SelectItem 
                              key={supervisor.id_funcionario || `sup-${supervisor.nome}`} 
                              value={supervisor.id_funcionario?.toString() || 'none'}
                            >
                              {supervisor.nome} - {supervisor.cargo}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Dica:</strong> O supervisor é responsável por gerenciar este funcionário 
                      e pode ter acesso a relatórios de desempenho e outras informações relevantes.
                      Apenas gerentes e supervisores aparecem nesta lista.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-primary hover:bg-primary-hover"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Funcionário
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de Detalhes */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Funcionário</DialogTitle>
              <DialogDescription>
                Informações completas e histórico profissional
              </DialogDescription>
            </DialogHeader>
            
            {selectedEmployee && (
              <div className="space-y-6">
                {/* Cabeçalho com informações principais */}
                <div className="flex items-start gap-6 p-6 bg-muted/30 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold">{selectedEmployee.nome}</h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant={getStatusBadgeVariant(selectedEmployee.status)} className="text-sm">
                        {selectedEmployee.status === StatusFuncionario.ATIVO ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Matrícula: <strong className="font-mono">{selectedEmployee.matricula}</strong>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        CPF: <strong>{formatCPF(selectedEmployee.cpf)}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">Salário Base</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(selectedEmployee.salario)}
                    </p>
                  </div>
                </div>

                {/* Grid de informações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dados Pessoais */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Dados Pessoais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedEmployee.data_nascimento && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                          <p className="font-medium">{formatDate(selectedEmployee.data_nascimento)}</p>
                        </div>
                      )}
                      {selectedEmployee.email && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                          <p className="font-medium break-all">{selectedEmployee.email}</p>
                        </div>
                      )}
                      {selectedEmployee.telefones && selectedEmployee.telefones.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Telefones</Label>
                          <div className="space-y-1">
                            {selectedEmployee.telefones.map((phone, idx) => (
                              <p key={idx} className="font-medium">{formatPhone(phone)}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      {(selectedEmployee.rua || selectedEmployee.cidade) && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                          <div className="space-y-1">
                            {selectedEmployee.rua && (
                              <p className="font-medium">
                                {selectedEmployee.rua}{selectedEmployee.numero ? `, ${selectedEmployee.numero}` : ''}
                              </p>
                            )}
                            {selectedEmployee.bairro && <p className="font-medium">{selectedEmployee.bairro}</p>}
                            {selectedEmployee.cidade && (
                              <p className="font-medium">
                                {selectedEmployee.cidade}{selectedEmployee.estado ? ` - ${selectedEmployee.estado}` : ''}
                              </p>
                            )}
                            {selectedEmployee.cep && <p className="font-medium">CEP: {selectedEmployee.cep}</p>}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Dados Profissionais */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Dados Profissionais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Cargo</Label>
                        <Badge variant="outline" className="mt-1">{selectedEmployee.cargo}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                        <p className="font-medium">{selectedEmployee.setor}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Data de Admissão</Label>
                        <p className="font-medium">{formatDate(selectedEmployee.data_admissao)}</p>
                      </div>
                      {selectedEmployee.meses_empresa !== undefined && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Tempo de Empresa</Label>
                          <p className="font-medium">
                            {selectedEmployee.anos_empresa ? 
                              `${selectedEmployee.anos_empresa} ano(s) e ${selectedEmployee.meses_empresa % 12} mês(es)` :
                              `${selectedEmployee.meses_empresa} mês(es)`
                            }
                          </p>
                        </div>
                      )}
                      {selectedEmployee.nome_supervisor && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Supervisor</Label>
                          <p className="font-medium">{selectedEmployee.nome_supervisor}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Dados de RH */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Escala e Contrato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Turno</Label>
                        <Badge variant="secondary" className="mt-1">
                          {getTurnoLabel(selectedEmployee.turno)}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Tipo de Contrato</Label>
                        <Badge variant="outline" className="mt-1">
                          {getContratoLabel(selectedEmployee.tipo_contrato)}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Carga Horária Semanal</Label>
                        <p className="font-medium">{selectedEmployee.carga_horaria_semanal}h</p>
                      </div>
                      {selectedEmployee.beneficios && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Benefícios</Label>
                          <p className="font-medium">{selectedEmployee.beneficios}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Remuneração e Metas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Remuneração e Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Salário Base</Label>
                        <p className="text-xl font-bold text-success">{formatCurrency(selectedEmployee.salario)}</p>
                      </div>
                      {selectedEmployee.comissao_percentual > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Comissão</Label>
                          <p className="font-medium">{selectedEmployee.comissao_percentual.toFixed(2)}%</p>
                        </div>
                      )}
                      {selectedEmployee.meta_mensal > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Meta Mensal</Label>
                          <p className="font-medium">{formatCurrency(selectedEmployee.meta_mensal)}</p>
                        </div>
                      )}
                      {selectedEmployee.vendas_mes_atual !== undefined && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Vendas no Mês Atual</Label>
                          <p className="font-medium">
                            {selectedEmployee.vendas_mes_atual} venda(s)
                          </p>
                          {selectedEmployee.valor_vendas_mes_atual !== undefined && (
                            <p className="text-sm text-success font-semibold">
                              {formatCurrency(selectedEmployee.valor_vendas_mes_atual)}
                            </p>
                          )}
                        </div>
                      )}
                      {selectedEmployee.data_ultima_promocao && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Última Promoção</Label>
                          <p className="font-medium">{formatDate(selectedEmployee.data_ultima_promocao)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Observações */}
                {selectedEmployee.observacoes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Observações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{selectedEmployee.observacoes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Ações rápidas */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleEdit(selectedEmployee);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant={selectedEmployee.status === StatusFuncionario.ATIVO ? 'secondary' : 'default'}
                    onClick={() => {
                      handleToggleStatus(selectedEmployee);
                      setIsDetailsOpen(false);
                    }}
                  >
                    {selectedEmployee.status === StatusFuncionario.ATIVO ? 'Inativar' : 'Ativar'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DesktopOnlyPage>
  );
}
