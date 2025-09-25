import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Percent,
  Receipt,
  User,
  Clock,
  Calculator,
  Banknote,
  QrCode,
  ScanLine,
  CheckCircle,
  XCircle,
  ArrowRight,
  Keyboard,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data para produtos disponíveis
const availableProducts = [
  {
    id: '7891234567890',
    name: 'Arroz Branco Tipo 1 5kg',
    brand: 'Tio João',
    price: 18.90,
    stock: 45,
    category: 'Grãos e Cereais'
  },
  {
    id: '7891234567891',
    name: 'Coca-Cola Original 2L',
    brand: 'Coca-Cola',
    price: 7.50,
    stock: 28,
    category: 'Bebidas'
  },
  {
    id: '7891234567892',
    name: 'Pão de Forma Integral 500g',
    brand: 'Wickbold',
    price: 6.90,
    stock: 8,
    category: 'Padaria'
  },
  {
    id: '7891234567893',
    name: 'Leite Integral UHT 1L',
    brand: 'Parmalat',
    price: 4.50,
    stock: 62,
    category: 'Laticínios'
  },
  {
    id: '7891234567894',
    name: 'Detergente Líquido 500ml',
    brand: 'Ypê',
    price: 3.20,
    stock: 24,
    category: 'Limpeza'
  }
];

// Mock data para clientes
const customers = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', type: 'Pessoa Física' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 88888-8888', type: 'Pessoa Física' },
  { id: '3', name: 'Empresa ABC Ltda', email: 'contato@abc.com', phone: '(11) 77777-7777', type: 'Pessoa Jurídica' }
];

// Promoções ativas
const activePromotions = [
  { productId: '7891234567891', discount: 10, description: 'Desconto de 10% na Coca-Cola' },
  { productId: '7891234567892', discount: 15, description: 'Promoção Pão Integral - 15% off' }
];

type CartItem = {
  product: typeof availableProducts[0];
  quantity: number;
  subtotal: number;
  appliedDiscount?: number;
};

type PaymentMethod = 'cash' | 'card' | 'pix' | 'multiple';

export default function POS() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<string>('');
  
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus no campo de código de barras
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  // Filtrar produtos pela busca
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.includes(searchTerm)
  );

  // Calcular totais
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.appliedDiscount || 0), 0);
  const total = subtotal - totalDiscount;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Adicionar produto ao carrinho
  const addToCart = (product: typeof availableProducts[0], quantity: number = 1) => {
    if (product.stock < quantity) {
      alert('Estoque insuficiente!');
      return;
    }

    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      const newQuantity = newCart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        alert('Estoque insuficiente!');
        return;
      }
      
      newCart[existingItemIndex].quantity = newQuantity;
      newCart[existingItemIndex].subtotal = newQuantity * product.price;
      
      // Aplicar promoção se houver
      const promotion = activePromotions.find(p => p.productId === product.id);
      if (promotion) {
        newCart[existingItemIndex].appliedDiscount = (newQuantity * product.price * promotion.discount) / 100;
      }
      
      setCart(newCart);
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        subtotal: quantity * product.price,
        appliedDiscount: 0
      };
      
      // Aplicar promoção se houver
      const promotion = activePromotions.find(p => p.productId === product.id);
      if (promotion) {
        newItem.appliedDiscount = (quantity * product.price * promotion.discount) / 100;
      }
      
      setCart([...cart, newItem]);
    }
    
    setSearchTerm('');
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  // Atualizar quantidade do item
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = availableProducts.find(p => p.id === productId);
    if (!product || newQuantity > product.stock) {
      alert('Quantidade inválida ou estoque insuficiente!');
      return;
    }

    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.product.price,
          appliedDiscount: 0
        };
        
        // Recalcular promoção
        const promotion = activePromotions.find(p => p.productId === productId);
        if (promotion) {
          updatedItem.appliedDiscount = (newQuantity * item.product.price * promotion.discount) / 100;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setCart(newCart);
  };

  // Remover item do carrinho
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  // Processar venda
  const processSale = async () => {
    if (cart.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    if (paymentMethod === 'cash' && cashReceived < total) {
      alert('Valor recebido insuficiente!');
      return;
    }

    // Simular processamento da venda
    const saleId = `VND-${Date.now()}`;
    
    // Aqui seria feita a integração com o backend
    console.log('Processando venda:', {
      saleId,
      cashier: user?.name,
      customer: selectedCustomer,
      items: cart,
      paymentMethod,
      subtotal,
      totalDiscount,
      total,
      cashReceived: paymentMethod === 'cash' ? cashReceived : total,
      change: paymentMethod === 'cash' ? cashReceived - total : 0,
      timestamp: new Date().toISOString()
    });

    setLastSaleId(saleId);
    setSaleCompleted(true);
    setIsPaymentDialogOpen(false);
    
    // Limpar dados após venda
    setTimeout(() => {
      clearCart();
      setCashReceived(0);
      setSaleCompleted(false);
    }, 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const change = paymentMethod === 'cash' ? Math.max(0, cashReceived - total) : 0;

  return (
    <div className="p-4 space-y-4 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ponto de Venda (PDV)</h1>
          <p className="text-muted-foreground">Operador: {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleTimeString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
        {/* Produtos e Busca */}
        <div className="lg:col-span-2 space-y-4">
          {/* Campo de busca/código de barras */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <ScanLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={barcodeInputRef}
                    placeholder="Digite o código de barras ou nome do produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && filteredProducts.length > 0) {
                        addToCart(filteredProducts[0]);
                      }
                    }}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => filteredProducts.length > 0 && addToCart(filteredProducts[0])}
                  disabled={filteredProducts.length === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de produtos */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Produtos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => addToCart(product)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{formatCurrency(product.price)}</p>
                            <p className="text-xs text-muted-foreground">Est: {product.stock}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          {activePromotions.find(p => p.productId === product.id) && (
                            <Badge variant="destructive" className="text-xs">
                              -{activePromotions.find(p => p.productId === product.id)?.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum produto encontrado para "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Digite o código de barras ou nome do produto</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrinho e Checkout */}
        <div className="space-y-4">
          {/* Seleção de Cliente */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cliente (Opcional)
                </Label>
                <Select
                  value={selectedCustomer?.id || ''}
                  onValueChange={(value) => {
                    const customer = customers.find(c => c.id === value);
                    setSelectedCustomer(customer || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Venda sem cliente</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Carrinho */}
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
                </CardTitle>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cart.length > 0 ? (
                <>
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableBody>
                        {cart.map((item) => (
                          <TableRow key={item.product.id}>
                            <TableCell className="p-3">
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-primary">
                                    {formatCurrency(item.product.price)}
                                  </span>
                                  {item.appliedDiscount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      -{formatCurrency(item.appliedDiscount)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="mx-2 min-w-[2rem] text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-sm font-semibold mt-1">
                                {formatCurrency(item.subtotal - (item.appliedDiscount || 0))}
                              </p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <Separator />
                  
                  {/* Totais */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Desconto:</span>
                        <span>-{formatCurrency(totalDiscount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Botão de Finalizar */}
                  <div className="p-4 pt-0">
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full h-12 text-base font-semibold bg-success hover:bg-success/90">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Finalizar Venda
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Finalizar Venda</DialogTitle>
                          <DialogDescription>
                            Selecione a forma de pagamento e confirme a venda
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          {/* Resumo da venda */}
                          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Itens:</span>
                              <span>{itemCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>{formatCurrency(subtotal)}</span>
                            </div>
                            {totalDiscount > 0 && (
                              <div className="flex justify-between text-sm text-success">
                                <span>Desconto:</span>
                                <span>-{formatCurrency(totalDiscount)}</span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span className="text-primary">{formatCurrency(total)}</span>
                            </div>
                          </div>

                          {/* Forma de pagamento */}
                          <div className="space-y-3">
                            <Label>Forma de Pagamento</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod('cash')}
                                className="flex items-center gap-2 h-12"
                              >
                                <Banknote className="h-4 w-4" />
                                Dinheiro
                              </Button>
                              <Button
                                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod('card')}
                                className="flex items-center gap-2 h-12"
                              >
                                <CreditCard className="h-4 w-4" />
                                Cartão
                              </Button>
                              <Button
                                variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod('pix')}
                                className="flex items-center gap-2 h-12"
                              >
                                <QrCode className="h-4 w-4" />
                                PIX
                              </Button>
                              <Button
                                variant={paymentMethod === 'multiple' ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod('multiple')}
                                className="flex items-center gap-2 h-12"
                              >
                                <Calculator className="h-4 w-4" />
                                Misto
                              </Button>
                            </div>
                          </div>

                          {/* Campo de valor recebido para dinheiro */}
                          {paymentMethod === 'cash' && (
                            <div className="space-y-2">
                              <Label>Valor Recebido</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={cashReceived || ''}
                                onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                                placeholder="0,00"
                                className="text-right text-lg font-semibold"
                              />
                              {change > 0 && (
                                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span className="text-success font-medium">Troco:</span>
                                    <span className="text-success font-bold text-lg">
                                      {formatCurrency(change)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Botões de ação */}
                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsPaymentDialogOpen(false)}
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={processSale}
                              disabled={paymentMethod === 'cash' && cashReceived < total}
                              className="flex-1 bg-success hover:bg-success/90"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Carrinho vazio</p>
                  <p className="text-sm">Adicione produtos para iniciar uma venda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de venda concluída */}
      {saleCompleted && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-96 border-success">
            <CardContent className="p-6 text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-success mx-auto" />
              <h2 className="text-2xl font-bold text-success">Venda Concluída!</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">Venda #{lastSaleId}</p>
                <p className="text-2xl font-bold">{formatCurrency(total)}</p>
                {paymentMethod === 'cash' && change > 0 && (
                  <p className="text-lg">
                    <span className="text-muted-foreground">Troco: </span>
                    <span className="font-semibold text-success">{formatCurrency(change)}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Receipt className="h-4 w-4 mr-2" />
                  Imprimir Cupom
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}