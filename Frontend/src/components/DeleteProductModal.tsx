import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Package, DollarSign, Warehouse } from 'lucide-react';
import { useDeleteProduct } from '@/hooks/useProducts';
import { toast } from 'sonner';

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
  category: { id: string; nome: string; }; // Updated to string
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
}

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductAPI | null;
}

export function DeleteProductModal({ open, onOpenChange, product }: DeleteProductModalProps) {
  const deleteProduct = useDeleteProduct();

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct.mutateAsync(product.id_produto.toString());
      toast.success('Produto excluído com sucesso!');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto. Tente novamente.');
    }
  };

  if (!product) return null;

  const valorEstoque = product.estoque * product.preco_custo;
  const hasStock = product.estoque > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão de Produto
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Esta ação não pode ser desfeita. O produto será permanentemente removido do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Detalhes do Produto */}
        <Card className="my-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Cabeçalho do Produto */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {product.nome}
                  </h3>
                  <p className="text-muted-foreground">{product.marca}</p>
                  <p className="text-sm text-muted-foreground">{product.category?.nome}</p>
                </div>
                <Badge variant={product.status === 'ATIVO' ? 'default' : 'secondary'}>
                  {product.status}
                </Badge>
              </div>

              {/* Informações Financeiras */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Preço de Venda</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(product.preco_venda)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Warehouse className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Estoque</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {product.estoque} {product.unidade}
                  </p>
                </div>
              </div>

              {/* Alertas Importantes */}
              {hasStock && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Atenção: Produto com Estoque</span>
                  </div>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>• Este produto possui <strong>{product.estoque} unidades</strong> em estoque</p>
                    <p>• Valor total do estoque: <strong>{formatCurrency(valorEstoque)}</strong></p>
                    <p>• Considere zerar o estoque antes da exclusão para evitar perdas</p>
                  </div>
                </div>
              )}

              {product.codigo_barras && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Código de Barras</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Este produto tem código de barras: <strong>{product.codigo_barras}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Verifique se não há vendas ou movimentações pendentes
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Consequências da Exclusão */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Consequências da Exclusão:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• O produto será removido permanentemente do sistema</li>
            <li>• Histórico de vendas será mantido, mas produto ficará como "excluído"</li>
            <li>• Não será possível recuperar os dados do produto</li>
            {hasStock && <li>• <strong>Estoque atual será perdido ({product.estoque} unidades)</strong></li>}
            <li>• Relatórios futuros não incluirão este produto</li>
          </ul>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProduct.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteProduct.isPending ? 'Excluindo...' : 'Sim, Excluir Produto'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}