import React, { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useToggleCategoryStatus,
} from '@/hooks/useCategories';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Package,
  MapPin,
  BarChart3,
  TrendingUp,
  Save,
  X,
  Filter,
  Grid,
  List,
  DollarSign,
  Percent,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CategoryFormData {
  name: string;
  description?: string;
  active?: boolean;
}

export default function CategoriesManagementBackend() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estado local
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    active: true
  });
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  // Hooks do backend
  const { 
    data: categoriesResponse, 
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useCategories({
    page: currentPage,
    size: pageSize,
    search: searchTerm || undefined,
    active: true // Por padrão, mostrar apenas categorias ativas
  });

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const toggleStatusMutation = useToggleCategoryStatus();

  // Formatação
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Handlers
  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      description: category.description,
      active: category.active
    });
    setSelectedCategory(category);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData({
      name: '',
      description: '',
      active: true
    });
    setSelectedCategory(null);
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (category: any) => {
    setSelectedCategory(category);
    setIsDetailsOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editMode && selectedCategory) {
        // Atualizar categoria existente
        await updateCategoryMutation.mutateAsync({
          id: selectedCategory.id,
          data: formData
        });
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        });
      } else {
        // Criar nova categoria
        await createCategoryMutation.mutateAsync(formData);
        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso!",
        });
      }
      
      setIsDialogOpen(false);
      setFormData({ name: '', description: '', active: true });
      refetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar categoria",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });
      refetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir categoria",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: categoryId,
        active: !currentStatus
      });
      toast({
        title: "Sucesso",
        description: `Categoria ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`,
      });
      refetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status da categoria",
        variant: "destructive",
      });
    }
  };

  // Busca com debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0); // Reset para primeira página ao buscar
      refetchCategories();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Loading state
  if (isLoadingCategories) {
    return (
      <DesktopOnlyPage 
        title="Gerenciamento de Categorias"
        description="Gerencie as categorias de produtos do seu estoque"
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando categorias...</span>
          </div>
        </div>
      </DesktopOnlyPage>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <DesktopOnlyPage 
        title="Gerenciamento de Categorias"
        description="Gerencie as categorias de produtos do seu estoque"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar categorias: {categoriesError.message}</p>
            <Button onClick={() => refetchCategories()}>Tentar novamente</Button>
          </div>
        </div>
      </DesktopOnlyPage>
    );
  }

  const categories = (categoriesResponse?.content || []).filter(category => category.id && category.id !== '');
  const totalElements = categoriesResponse?.totalElements || 0;
  const totalPages = categoriesResponse?.totalPages || 0;

  return (
    <DesktopOnlyPage 
      title="Gerenciamento de Categorias"
      description="Gerencie as categorias de produtos do seu estoque"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
            <p className="text-muted-foreground">
              Gerencie as categorias de produtos do seu estoque
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleNew} className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Categorias</p>
                  <p className="text-2xl font-bold">{totalElements}</p>
                </div>
                <Tag className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categorias Ativas</p>
                  <p className="text-2xl font-bold">
                    {categories.filter(c => c.active).length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Páginas</p>
                  <p className="text-2xl font-bold">{totalPages}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Página Atual</p>
                  <p className="text-2xl font-bold">{currentPage + 1}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 por página</SelectItem>
              <SelectItem value="12">12 por página</SelectItem>
              <SelectItem value="24">24 por página</SelectItem>
              <SelectItem value="48">48 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conteúdo Principal */}
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant={category.active ? 'default' : 'secondary'}>
                      {category.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description || 'Sem descrição'}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Criada em: {formatDate(category.createdAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDetails(category)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a categoria "{category.name}"?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || 'Sem descrição'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.active ? 'default' : 'secondary'}>
                        {category.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetails(category)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a categoria "{category.name}"?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          </Card>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {categories.length} de {totalElements} categorias
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Anterior
              </Button>
              <span className="flex items-center px-3 text-sm">
                Página {currentPage + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}

        {/* Dialog de Criação/Edição */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editMode ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {editMode ? 'Atualize as informações da categoria' : 'Preencha os dados da nova categoria'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome da categoria"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da categoria"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="active">Categoria ativa</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.name || createCategoryMutation.isPending || updateCategoryMutation.isPending}
                className="flex-1"
              >
                {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de Detalhes */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Categoria</DialogTitle>
              <DialogDescription>
                Informações completas da categoria
              </DialogDescription>
            </DialogHeader>
            
            {selectedCategory && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Informações da Categoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <p className="font-medium text-lg">{selectedCategory.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                      <p>{selectedCategory.description || 'Sem descrição'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={selectedCategory.active ? 'default' : 'secondary'}>
                        {selectedCategory.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                      <p>{formatDate(selectedCategory.createdAt)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Última Atualização</Label>
                      <p>{formatDate(selectedCategory.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(selectedCategory)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStatus(selectedCategory.id, selectedCategory.active)}
                    className="flex-1"
                  >
                    {selectedCategory.active ? 'Desativar' : 'Ativar'}
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