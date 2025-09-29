import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Package, DollarSign, Warehouse, Info } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { toast } from 'sonner';

// Tipos para o formulário baseados na API do backend
interface ProductFormData {
  nome: string;
  marca: string;
  descricao: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  categoria_id: string;
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
}

interface ProductAPI {
  id_produto: number;
  nome: string;
  marca: string;
  descricao: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  status: 'ATIVO' | 'INATIVO';
  category: { id: number; nome: string; };
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
  data_criacao?: string;
  data_atualizacao?: string;
}

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductAPI | null;
  mode: 'create' | 'edit';
}

const unidades = [
  'UN', 'PC', 'KG', 'G', 'L', 'ML', 'M', 'CM', 'M²', 'M³',
  'CX', 'PCT', 'DZ', 'PAR', 'KIT', 'ROL', 'TB', 'FR'
];

export function ProductModal({ open, onOpenChange, product, mode }: ProductModalProps) {
  const { data: categoriesData } = useCategories({ active: true });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const categories = (categoriesData?.content ?? []) as unknown as Array<{ id: number; nome: string }>;

  const form = useForm<ProductFormData>({
    defaultValues: {
      nome: '',
      marca: '',
      descricao: '',
      preco_custo: 0,
      preco_venda: 0,
      estoque: 0,
      estoque_minimo: 1,
      categoria_id: '',
      codigo_barras: '',
      unidade: 'UN',
      peso: 0,
    }
  });

  // Preencher formulário quando em modo de edição
  useEffect(() => {
    if (mode === 'edit' && product) {
      form.reset({
        nome: product.nome,
        marca: product.marca,
        descricao: product.descricao,
        preco_custo: product.preco_custo,
        preco_venda: product.preco_venda,
        estoque: product.estoque,
        estoque_minimo: product.estoque_minimo,
        categoria_id: product.category?.id?.toString() || '',
        codigo_barras: product.codigo_barras || '',
        unidade: product.unidade || 'UN',
        peso: product.peso || 0,
      });
    } else if (mode === 'create') {
      form.reset({
        nome: '',
        marca: '',
        descricao: '',
        preco_custo: 0,
        preco_venda: 0,
        estoque: 0,
        estoque_minimo: 1,
        categoria_id: '',
        codigo_barras: '',
        unidade: 'UN',
        peso: 0,
      });
    }
  }, [mode, product, form]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (mode === 'create') {
        const createData = {
          nome: data.nome,
          marca: data.marca,
          descricao: data.descricao,
          preco_venda: data.preco_venda,
          preco_custo: data.preco_custo,
          estoque: data.estoque,
          estoque_minimo: data.estoque_minimo,
          categoria_id: data.categoria_id,
          codigo_barras: data.codigo_barras || '',
          unidade: data.unidade || 'UN',
          peso: data.peso || 0,
          status: 'ATIVO',
        };
        
        await createProduct.mutateAsync(createData as any);
        toast.success('Produto criado com sucesso!');
      } else {
        const updateData = {
          nome: data.nome,
          marca: data.marca,
          descricao: data.descricao,
          preco_venda: data.preco_venda,
          preco_custo: data.preco_custo,
          estoque: data.estoque,
          estoque_minimo: data.estoque_minimo,
          categoria_id: data.categoria_id,
          codigo_barras: data.codigo_barras || '',
          unidade: data.unidade || 'UN',
          peso: data.peso || 0,
          status: 'ATIVO',
        };
        
        await updateProduct.mutateAsync({
          id: product!.id_produto.toString(),
          data: updateData as any
        });
        toast.success('Produto atualizado com sucesso!');
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error(
        mode === 'create' 
          ? 'Erro ao criar produto. Verifique os dados e tente novamente.'
          : 'Erro ao atualizar produto. Verifique os dados e tente novamente.'
      );
    }
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;



  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Preços e Valores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="preco_custo"
              rules={{ 
                required: "Preço de custo é obrigatório",
                min: { value: 0, message: "Preço deve ser maior que zero" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Custo (R$) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Quanto você paga pelo produto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preco_venda"
              rules={{ 
                required: "Preço de venda é obrigatório",
                min: { value: 0, message: "Preço deve ser maior que zero" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Venda (R$) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0,00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Preço para o cliente final
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Indicador de Margem */}
          {form.watch('preco_custo') > 0 && form.watch('preco_venda') > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Análise de Margem</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Margem: </span>
                    <Badge variant="outline">
                      {(((form.watch('preco_venda') - form.watch('preco_custo')) / form.watch('preco_venda')) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div>
                    <span className="text-blue-600">Lucro: </span>
                    <Badge variant="outline">
                      R$ {(form.watch('preco_venda') - form.watch('preco_custo')).toFixed(2)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-blue-600">Markup: </span>
                    <Badge variant="outline">
                      {(form.watch('preco_venda') / form.watch('preco_custo')).toFixed(2)}x
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Estoque e Medidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="estoque"
              rules={{ 
                required: "Estoque inicial é obrigatório",
                min: { value: 0, message: "Estoque não pode ser negativo" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque Inicial *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Quantidade atual em estoque
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estoque_minimo"
              rules={{ 
                required: "Estoque mínimo é obrigatório",
                min: { value: 0, message: "Estoque mínimo deve ser positivo" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque Mínimo *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Alerta quando atingir este valor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de Medida</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade} value={unidade}>
                          {unidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Como o produto é medido/contado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="peso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.001" 
                    placeholder="0.000"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Peso em quilogramas (opcional, útil para frete)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alertas de estoque */}
          {form.watch('estoque') <= form.watch('estoque_minimo') && form.watch('estoque_minimo') > 0 && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-900">Atenção: Estoque Baixo</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  O estoque atual está igual ou abaixo do mínimo. Considere reabastecer.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === 'create' ? 'Adicionar Novo Produto' : `Editar Produto: ${product?.nome}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Preencha as informações abaixo para cadastrar um novo produto no sistema.'
              : 'Atualize as informações do produto conforme necessário.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Todos os campos em uma única página */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    rules={{ required: "Nome do produto é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Smartphone Samsung Galaxy" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nome comercial do produto que aparecerá nas vendas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marca"
                      rules={{ required: "Marca é obrigatória" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Samsung, Apple, Nike" {...field} />
                          </FormControl>
                          <FormDescription>
                            Marca ou fabricante do produto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoria_id"
                      rules={{ required: "Categoria é obrigatória" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Categoria para organizar o produto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preco_custo"
                      rules={{ 
                        required: "Preço de custo é obrigatório",
                        min: { value: 0, message: "Preço deve ser maior que zero" }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço de Custo (R$) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0,00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Quanto você paga pelo produto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preco_venda"
                      rules={{ 
                        required: "Preço de venda é obrigatório",
                        min: { value: 0, message: "Preço deve ser maior que zero" }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço de Venda (R$) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0,00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Preço para o cliente final
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="estoque"
                      rules={{ 
                        required: "Estoque inicial é obrigatório",
                        min: { value: 0, message: "Estoque não pode ser negativo" }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estoque Inicial *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Quantidade atual em estoque
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estoque_minimo"
                      rules={{ 
                        required: "Estoque mínimo é obrigatório",
                        min: { value: 0, message: "Estoque mínimo deve ser positivo" }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estoque Mínimo *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Alerta quando atingir este valor
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="codigo_barras"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Barras</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 1234567890123" {...field} />
                          </FormControl>
                          <FormDescription>
                            Para identificação rápida no PDV
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva as características principais do produto..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Descrição detalhada do produto (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (mode === 'create' ? 'Criar Produto' : 'Salvar Alterações')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}