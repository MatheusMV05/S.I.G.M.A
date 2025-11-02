import React, { useState, useEffect } from 'react';
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
import {
  Truck,
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
  Filter,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSuppliers } from '@/hooks/useSuppliers';
import type { Fornecedor, CreateFornecedorRequest } from '@/services/supplierService';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function SuppliersManagement() {
  const { user } = useAuth();
  const { suppliers, loading, createSupplier, updateSupplier, deleteSupplier, fetchSuppliers } = useSuppliers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Fornecedor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateFornecedorRequest>>({});
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Atualizar fornecedores quando o termo de busca mudar (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchSuppliers(searchTerm);
      } else {
        fetchSuppliers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const formatCNPJ = (cnpj: string) => {
    const cleaned = cnpj.replace(/\D/g, '');
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const filteredSuppliers = suppliers;

  const handleEdit = (supplier: Fornecedor) => {
    setFormData({
      nome_fantasia: supplier.nome_fantasia,
      razao_social: supplier.razao_social,
      cnpj: supplier.cnpj,
      email: supplier.email,
      telefone: supplier.telefone,
      rua: supplier.rua,
      numero: supplier.numero,
      bairro: supplier.bairro,
      cidade: supplier.cidade,
      estado: supplier.estado,
      cep: supplier.cep,
      contato_principal: supplier.contato_principal,
      condicoes_pagamento: supplier.condicoes_pagamento,
      prazo_entrega_dias: supplier.prazo_entrega_dias,
      avaliacao: supplier.avaliacao,
    });
    setSelectedSupplier(supplier);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData({
      nome_fantasia: '',
      razao_social: '',
      cnpj: '',
      email: '',
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      contato_principal: '',
      condicoes_pagamento: '',
      prazo_entrega_dias: undefined,
      avaliacao: undefined,
    });
    setSelectedSupplier(null);
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (supplier: Fornecedor) => {
    setSelectedSupplier(supplier);
    setIsDetailsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome_fantasia || !formData.cnpj) {
      return;
    }

    setIsSaving(true);
    try {
      if (editMode && selectedSupplier) {
        await updateSupplier(selectedSupplier.id_fornecedor, formData);
      } else {
        await createSupplier(formData as CreateFornecedorRequest);
      }
      setIsDialogOpen(false);
      setFormData({});
      setSelectedSupplier(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteSupplier(id);
  };

  if (loading && suppliers.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <DesktopOnlyPage
      title="Gestão de Fornecedores"
      description="Sistema de gerenciamento de fornecedores com contratos e histórico de compras."
      features={[
        "Cadastro completo de fornecedores (PF e PJ)",
        "Gestão de contratos e condições comerciais",
        "Histórico de compras e entregas",
        "Avaliação de performance dos fornecedores",
        "Controle de documentação e certificações",
        "Relatórios de compras por fornecedor",
        "Gestão de prazos de pagamento"
      ]}
    >
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Fornecedores</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de gerenciamento de fornecedores com contratos e histórico de compras.
            Gerencie todos os fornecedores e acompanhe histórico de pedidos
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleNew} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Fornecedores</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fornecedores Ativos</p>
                <p className="text-2xl font-bold text-success">
                  {suppliers.filter(s => s.status === 'ATIVO').length}
                </p>
              </div>
              <Building className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold">
                  {suppliers.reduce((sum, s) => sum + (s.total_produtos || 0), 0)}
                </p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume Total</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(suppliers.reduce((sum, s) => sum + (s.valor_total_compras || 0), 0))}
                </p>
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
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabela de Fornecedores */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Carregando fornecedores...</p>
                  </TableCell>
                </TableRow>
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Nenhum fornecedor encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id_fornecedor}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{supplier.nome_fantasia}</p>
                        <p className="text-sm text-muted-foreground">{supplier.contato_principal}</p>
                        {supplier.razao_social && (
                          <p className="text-xs text-muted-foreground">{supplier.razao_social}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{formatCNPJ(supplier.cnpj)}</span>
                    </TableCell>
                    <TableCell>
                      {supplier.telefone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{supplier.telefone}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {supplier.cidade && supplier.estado && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{supplier.cidade}, {supplier.estado}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === 'ATIVO' ? 'default' : 'secondary'}>
                        {supplier.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{formatDate(supplier.data_cadastro)}</p>
                        <p className="text-xs text-muted-foreground">
                          {supplier.total_produtos || 0} produtos
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDetails(supplier)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(supplier)}
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
                                Tem certeza que deseja excluir o fornecedor "{supplier.nome_fantasia}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(supplier.id_fornecedor)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </DialogTitle>
            <DialogDescription>
              {editMode ? 'Altere os dados do fornecedor' : 'Cadastre um novo fornecedor'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Básicos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados da Empresa</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia *</Label>
                <Input
                  id="nome_fantasia"
                  value={formData.nome_fantasia || ''}
                  onChange={(e) => setFormData({...formData, nome_fantasia: e.target.value})}
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social</Label>
                <Input
                  id="razao_social"
                  value={formData.razao_social || ''}
                  onChange={(e) => setFormData({...formData, razao_social: e.target.value})}
                  placeholder="Razão social da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj || ''}
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contato_principal">Pessoa de Contato</Label>
                <Input
                  id="contato_principal"
                  value={formData.contato_principal || ''}
                  onChange={(e) => setFormData({...formData, contato_principal: e.target.value})}
                  placeholder="Nome do responsável"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contato@empresa.com.br"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone || ''}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazo_entrega_dias">Prazo de Entrega (dias)</Label>
                <Input
                  id="prazo_entrega_dias"
                  type="number"
                  value={formData.prazo_entrega_dias || ''}
                  onChange={(e) => setFormData({...formData, prazo_entrega_dias: parseInt(e.target.value) || undefined})}
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Endereço</h3>
              
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
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="BA">BA</SelectItem>
                      <SelectItem value="GO">GO</SelectItem>
                      <SelectItem value="PE">PE</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
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
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="condicoes_pagamento">Condições de Pagamento</Label>
                <Input
                  id="condicoes_pagamento"
                  value={formData.condicoes_pagamento || ''}
                  onChange={(e) => setFormData({...formData, condicoes_pagamento: e.target.value})}
                  placeholder="Ex: 30 dias"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avaliacao">Avaliação (0-5)</Label>
                <Input
                  id="avaliacao"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.avaliacao || ''}
                  onChange={(e) => setFormData({...formData, avaliacao: parseFloat(e.target.value) || undefined})}
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setFormData({});
                setSelectedSupplier(null);
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-primary hover:bg-primary-hover"
              disabled={isSaving || !formData.nome_fantasia || !formData.cnpj}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Fornecedor</DialogTitle>
            <DialogDescription>
              Informações completas do fornecedor
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados da Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome Fantasia</Label>
                      <p className="font-medium">{selectedSupplier.nome_fantasia}</p>
                    </div>
                    {selectedSupplier.razao_social && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Razão Social</Label>
                        <p>{selectedSupplier.razao_social}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                      <p className="font-mono">{formatCNPJ(selectedSupplier.cnpj)}</p>
                    </div>
                    {selectedSupplier.contato_principal && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Contato Principal</Label>
                        <p>{selectedSupplier.contato_principal}</p>
                      </div>
                    )}
                    {selectedSupplier.email && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {selectedSupplier.email}
                        </p>
                      </div>
                    )}
                    {selectedSupplier.telefone && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {selectedSupplier.telefone}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={selectedSupplier.status === 'ATIVO' ? 'default' : 'secondary'}>
                        {selectedSupplier.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Endereço e Informações Comerciais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(selectedSupplier.rua || selectedSupplier.cidade) && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Endereço Completo</Label>
                        <div className="space-y-1 text-sm">
                          {selectedSupplier.rua && (
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span>
                                {selectedSupplier.rua}{selectedSupplier.numero ? `, ${selectedSupplier.numero}` : ''}
                              </span>
                            </p>
                          )}
                          {selectedSupplier.bairro && <p className="ml-6">{selectedSupplier.bairro}</p>}
                          {selectedSupplier.cidade && selectedSupplier.estado && (
                            <p className="ml-6">{selectedSupplier.cidade}, {selectedSupplier.estado}</p>
                          )}
                          {selectedSupplier.cep && <p className="ml-6">CEP: {selectedSupplier.cep}</p>}
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    {selectedSupplier.condicoes_pagamento && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Condições de Pagamento</Label>
                        <p className="text-sm">{selectedSupplier.condicoes_pagamento}</p>
                      </div>
                    )}
                    
                    {selectedSupplier.prazo_entrega_dias && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Prazo de Entrega</Label>
                        <p className="text-sm">{selectedSupplier.prazo_entrega_dias} dias</p>
                      </div>
                    )}
                    
                    {selectedSupplier.avaliacao && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Avaliação</Label>
                        <p className="text-sm font-bold text-yellow-600">
                          {selectedSupplier.avaliacao.toFixed(1)} / 5.0
                        </p>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total de Produtos</Label>
                        <p className="text-xl font-bold">{selectedSupplier.total_produtos || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Volume de Compras</Label>
                        <p className="text-xl font-bold text-success">
                          {formatCurrency(selectedSupplier.valor_total_compras)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Cadastrado em</Label>
                      <p className="text-sm">{formatDate(selectedSupplier.data_cadastro)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </DesktopOnlyPage>
  );
}