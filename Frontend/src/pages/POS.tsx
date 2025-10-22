/**
 * PONTO DE VENDA (POS) INTEGRADO - VERSÃO CORRIGIDA
 * Endpoint correto: /api/products (não /api/produto)
 */

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, X, CheckCircle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Tipos
interface Product {
  id_produto: number;
  nome: string;
  marca: string;
  descricao: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  status: string;
  categoria?: {
    id: number;
    nome: string;
  };
  codigo_barras?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface SalePayload {
  id_funcionario: number;
  id_cliente: number | null;
  itens: {
    id_produto: number;
    quantidade: number;
    preco_unitario_venda: number;
    desconto_item: number;
  }[];
  metodo_pagamento: string;
  desconto: number;
  observacoes?: string;
}

export default function POS() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('DINHEIRO');
  const [saleDiscount, setSaleDiscount] = useState(0);

  // URL da API
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  // Carregar produtos do backend
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // ENDPOINT CORRETO: /api/products (não /api/produto)
      const response = await fetch(`${API_URL}/products?page=0&size=100`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Produtos carregados:', data);
      
      // Adaptar resposta do backend
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.content && Array.isArray(data.content)) {
        setProducts(data.content);
      } else if (data.data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error('Formato de resposta inesperado:', data);
        setProducts([]);
      }
      
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro ao carregar produtos',
        description: 'Não foi possível carregar os produtos do sistema.',
        variant: 'destructive',
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.nome?.toLowerCase().includes(searchLower) ||
      product.marca?.toLowerCase().includes(searchLower) ||
      product.categoria?.nome?.toLowerCase().includes(searchLower) ||
      product.codigo_barras?.toLowerCase().includes(searchLower)
    );
  });

  // Calcular totais
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.preco_venda * item.quantity,
    0
  );
  const totalAmount = subtotal - saleDiscount;

  // Adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    if (product.status !== 'ATIVO') {
      toast({
        title: 'Produto inativo',
        description: 'Este produto não está disponível para venda.',
        variant: 'destructive',
      });
      return;
    }

    if (product.estoque <= 0) {
      toast({
        title: 'Produto sem estoque',
        description: 'Este produto não tem unidades disponíveis.',
        variant: 'destructive',
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id_produto === product.id_produto);
      
      if (existingItem) {
        if (existingItem.quantity >= product.estoque) {
          toast({
            title: 'Estoque insuficiente',
            description: `Apenas ${product.estoque} unidades disponíveis.`,
            variant: 'destructive',
          });
          return prevCart;
        }
        
        return prevCart.map((item) =>
          item.product.id_produto === product.id_produto
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });

    toast({
      title: 'Produto adicionado',
      description: `${product.nome} foi adicionado ao carrinho.`,
    });
  };

  // Atualizar quantidade no carrinho
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id_produto === productId);
    if (product && newQuantity > product.estoque) {
      toast({
        title: 'Estoque insuficiente',
        description: `Apenas ${product.estoque} unidades disponíveis.`,
        variant: 'destructive',
      });
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id_produto === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remover item do carrinho
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id_produto !== productId));
    toast({
      title: 'Item removido',
      description: 'O item foi removido do carrinho.',
    });
  };

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
    setSaleDiscount(0);
    toast({
      title: 'Carrinho limpo',
      description: 'Todos os itens foram removidos do carrinho.',
    });
  };

  // Finalizar venda - INTEGRADO COM BACKEND
  const finalizeSale = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho para finalizar a venda.',
        variant: 'destructive',
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: 'Método de pagamento',
        description: 'Selecione um método de pagamento.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      // Preparar dados da venda
      const salePayload: SalePayload = {
        id_funcionario: 1, // TODO: Pegar do contexto de autenticação
        id_cliente: null,
        itens: cart.map(item => ({
          id_produto: item.product.id_produto,
          quantidade: item.quantity,
          preco_unitario_venda: item.product.preco_venda,
          desconto_item: 0
        })),
        metodo_pagamento: paymentMethod,
        desconto: saleDiscount,
        observacoes: `Venda PDV - ${new Date().toLocaleString()}`
      };

      console.log('Enviando venda:', salePayload);

      // Enviar venda para o backend
      const response = await fetch(`${API_URL}/vendas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(salePayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro do servidor:', errorData);
        throw new Error('Erro ao processar venda');
      }

      const saleResult = await response.json();
      console.log('Venda criada:', saleResult);

      // Limpar carrinho e resetar estado
      setCart([]);
      setSaleDiscount(0);
      setShowCheckoutDialog(false);
      setPaymentMethod('DINHEIRO');

      // Recarregar produtos para atualizar estoque
      await loadProducts();

      toast({
        title: 'Venda finalizada com sucesso!',
        description: `Total: R$ ${totalAmount.toFixed(2)} - Venda #${saleResult.id_venda}`,
      });

    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      toast({
        title: 'Erro ao finalizar venda',
        description: error instanceof Error ? error.message : 'Não foi possível processar a venda.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DesktopOnlyPage
      title="Ponto de Venda (POS)"
      description="Sistema completo de vendas com integração ao backend."
      features={[
        "Interface otimizada para caixas registradoras",
        "Busca rápida de produtos integrada ao banco de dados",
        "Carrinho de compras com controle de estoque em tempo real",
        "Finalização de vendas com persistência no backend",
        "Múltiplas formas de pagamento",
        "Atualização automática de estoque"
      ]}
    >
      <div className="h-full p-6 bg-background">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Ponto de Venda</h1>
          <p className="text-muted-foreground">Sistema de vendas do S.I.G.M.A - Integrado</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Seção de Seleção de Produtos */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Produtos Disponíveis ({products.length})
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos por nome, categoria ou código de barras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="overflow-auto h-[calc(100%-120px)]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Carregando produtos...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-muted-foreground mb-2">Nenhum produto encontrado</p>
                    <Button onClick={loadProducts} variant="outline">
                      Recarregar Produtos
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id_produto}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => addToCart(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm h-10 overflow-hidden">
                              {product.nome}
                            </h3>
                            <Badge
                              variant={
                                product.estoque > 10
                                  ? 'default'
                                  : product.estoque > 0
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {product.estoque > 0 ? `${product.estoque} un.` : 'Sem estoque'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {product.marca} | {product.categoria?.nome || 'Sem categoria'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-primary">
                              R$ {product.preco_venda?.toFixed(2) || '0.00'}
                            </span>
                            <Button size="sm" variant="outline">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Seção do Carrinho */}
          <div className="space-y-4">
            <Card className="h-[calc(100vh-280px)]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Carrinho ({cart.length})
                  </span>
                  {cart.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto h-[calc(100%-120px)]">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Carrinho vazio</p>
                    <p className="text-sm text-muted-foreground">
                      Adicione produtos para iniciar a venda
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <Card key={item.product.id_produto}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.product.nome}</h4>
                              <p className="text-xs text-muted-foreground">
                                R$ {item.product.preco_venda.toFixed(2)} cada
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product.id_produto)}
                              className="text-destructive h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.product.id_produto, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.product.id_produto, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.product.estoque}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-bold">
                              R$ {(item.product.preco_venda * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumo e Finalização */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span className="font-medium text-destructive">
                      - R$ {saleDiscount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        R$ {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowCheckoutDialog(true)}
                  disabled={cart.length === 0 || loading}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Finalizar Venda
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog de Finalização */}
        <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finalizar Venda</DialogTitle>
              <DialogDescription>
                Confirme os detalhes da venda antes de finalizar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Método de Pagamento</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                    <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Desconto (R$)</label>
                <Input
                  type="number"
                  min="0"
                  max={subtotal}
                  step="0.01"
                  value={saleDiscount}
                  onChange={(e) => setSaleDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total a pagar:</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCheckoutDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={finalizeSale}
                    disabled={loading}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    {loading ? 'Processando...' : 'Confirmar Venda'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DesktopOnlyPage>
  );
}