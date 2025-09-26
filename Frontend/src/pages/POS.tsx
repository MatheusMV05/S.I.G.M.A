import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CreditCard,
} from 'lucide-react';

// Interface para definir a estrutura de um produto
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
}

// Interface para itens no carrinho
interface CartItem {
  product: Product;
  quantity: number;
}

// Dados mocados de produtos
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Arroz Branco Tipo 1 - 5kg',
    price: 15.90,
    stock: 50,
    category: 'Grãos e Cereais',
    barcode: '7891234567890',
  },
  {
    id: '2',
    name: 'Feijão Preto - 1kg',
    price: 8.50,
    stock: 30,
    category: 'Grãos e Cereais',
    barcode: '7891234567891',
  },
  {
    id: '3',
    name: 'Açúcar Cristal - 1kg',
    price: 4.20,
    stock: 25,
    category: 'Açúcar e Adoçantes',
    barcode: '7891234567892',
  },
  {
    id: '4',
    name: 'Óleo de Soja - 900ml',
    price: 6.80,
    stock: 40,
    category: 'Óleos',
    barcode: '7891234567893',
  },
  {
    id: '5',
    name: 'Leite Integral - 1L',
    price: 4.50,
    stock: 60,
    category: 'Laticínios',
    barcode: '7891234567894',
  },
  {
    id: '6',
    name: 'Pão de Forma Integral',
    price: 5.90,
    stock: 15,
    category: 'Padaria',
    barcode: '7891234567895',
  },
  {
    id: '7',
    name: 'Banana Nanica - kg',
    price: 3.50,
    stock: 100,
    category: 'Frutas',
    barcode: '7891234567896',
  },
  {
    id: '8',
    name: 'Detergente Líquido - 500ml',
    price: 2.90,
    stock: 35,
    category: 'Limpeza',
    barcode: '7891234567897',
  },
  {
    id: '9',
    name: 'Sabonete Neutro - 90g',
    price: 1.80,
    stock: 80,
    category: 'Higiene',
    barcode: '7891234567898',
  },
  {
    id: '10',
    name: 'Refrigerante Cola - 2L',
    price: 7.20,
    stock: 20,
    category: 'Bebidas',
    barcode: '7891234567899',
  },
];

const POS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Filtrar produtos baseado no termo de busca
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return mockProducts;
    
    return mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
    );
  }, [searchTerm]);

  // Calcular total da venda
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  // Adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Produto indisponível",
        description: "Este produto não possui estoque disponível.",
        variant: "destructive",
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast({
            title: "Estoque insuficiente",
            description: `Apenas ${product.stock} unidades disponíveis.`,
            variant: "destructive",
          });
          return prevCart;
        }
        
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });

    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  // Atualizar quantidade de um item no carrinho
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = mockProducts.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      toast({
        title: "Estoque insuficiente",
        description: `Apenas ${product.stock} unidades disponíveis.`,
        variant: "destructive",
      });
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remover item do carrinho
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho.",
    });
  };

  // Finalizar venda
  const finalizeSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para finalizar a venda.",
        variant: "destructive",
      });
      return;
    }

    // Simular processamento da venda
    setCart([]);
    
    toast({
      title: "Venda finalizada com sucesso!",
      description: `Total da venda: R$ ${totalAmount.toFixed(2)}`,
    });
  };

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho.",
    });
  };

  return (
    <div className="h-full p-6 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Ponto de Venda</h1>
        <p className="text-muted-foreground">Sistema de vendas do S.I.G.M.A</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        {/* Seção de Seleção de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Produtos Disponíveis
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm h-10 overflow-hidden">{product.name}</h3>
                        <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} un.` : "Sem estoque"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção do Carrinho */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrinho de Compras
                </div>
                {cart.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-[calc(100%-120px)] flex flex-col">
              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Carrinho vazio</p>
                    <p className="text-sm">Adicione produtos para iniciar a venda</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto space-y-2">
                    {cart.map((item) => (
                      <Card key={item.product.id} className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm overflow-hidden">
                              {item.product.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                R$ {item.product.price.toFixed(2)} cada
                              </p>
                              <p className="font-semibold">
                                R$ {(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">R$ {totalAmount.toFixed(2)}</span>
                    </div>

                    <Button
                      onClick={finalizeSale}
                      className="w-full"
                      size="lg"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Finalizar Venda
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POS;