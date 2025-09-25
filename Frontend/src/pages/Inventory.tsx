import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Warehouse, Search, AlertTriangle, Calendar, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProductLocation {
  id: string;
  productName: string;
  productCode: string;
  shelf: string;
  section: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
}

interface StockAlert {
  id: string;
  productName: string;
  productCode: string;
  currentStock: number;
  minStock: number;
  unit: string;
  category: string;
  lastRestock?: string;
}

interface ExpiryAlert {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  daysToExpire: number;
  shelf: string;
}

// Mock data
const mockLocations: ProductLocation[] = [
  {
    id: '1',
    productName: 'Arroz Tio João 5kg',
    productCode: '001',
    shelf: 'A1-01',
    section: 'Grãos',
    quantity: 25,
    unit: 'un',
    expiryDate: '2024-12-31'
  },
  {
    id: '2',
    productName: 'Arroz Tio João 5kg',
    productCode: '001',
    shelf: 'A1-02',
    section: 'Grãos',
    quantity: 25,
    unit: 'un',
    expiryDate: '2024-12-31'
  },
  {
    id: '3',
    productName: 'Feijão Preto 1kg',
    productCode: '002',
    shelf: 'A2-01',
    section: 'Grãos',
    quantity: 5,
    unit: 'un',
    expiryDate: '2024-11-15'
  }
];

const mockStockAlerts: StockAlert[] = [
  {
    id: '1',
    productName: 'Feijão Preto 1kg',
    productCode: '002',
    currentStock: 5,
    minStock: 10,
    unit: 'un',
    category: 'Grãos',
    lastRestock: '2024-10-01'
  },
  {
    id: '2',
    productName: 'Leite Integral 1L',
    productCode: '005',
    currentStock: 2,
    minStock: 15,
    unit: 'un',
    category: 'Laticínios',
    lastRestock: '2024-09-28'
  },
  {
    id: '3',
    productName: 'Óleo de Soja 900ml',
    productCode: '004',
    currentStock: 8,
    minStock: 20,
    unit: 'un',
    category: 'Óleos',
    lastRestock: '2024-10-05'
  }
];

const mockExpiryAlerts: ExpiryAlert[] = [
  {
    id: '1',
    productName: 'Iogurte Natural',
    productCode: '006',
    quantity: 12,
    unit: 'un',
    expiryDate: '2024-10-25',
    daysToExpire: 3,
    shelf: 'C1-01'
  },
  {
    id: '2',
    productName: 'Pão de Forma',
    productCode: '007',
    quantity: 8,
    unit: 'un',
    expiryDate: '2024-10-24',
    daysToExpire: 2,
    shelf: 'D2-01'
  },
  {
    id: '3',
    productName: 'Queijo Mussarela',
    productCode: '008',
    quantity: 5,
    unit: 'kg',
    expiryDate: '2024-10-26',
    daysToExpire: 4,
    shelf: 'C2-03'
  }
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<ProductLocation[]>([]);

  const handleProductSearch = () => {
    if (!selectedProduct && !searchTerm) {
      setFilteredLocations([]);
      return;
    }

    const filtered = mockLocations.filter(location => {
      const matchesProduct = !selectedProduct || location.productCode === selectedProduct;
      const matchesSearch = !searchTerm || 
        location.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.productCode.includes(searchTerm);
      return matchesProduct && matchesSearch;
    });

    setFilteredLocations(filtered);
  };

  const getStockPercentage = (current: number, min: number) => {
    return Math.min((current / (min * 2)) * 100, 100);
  };

  const getStockVariant = (current: number, min: number) => {
    if (current === 0) return "destructive";
    if (current <= min) return "secondary";
    return "default";
  };

  const getExpiryVariant = (days: number) => {
    if (days <= 1) return "destructive";
    if (days <= 3) return "secondary";
    return "outline";
  };

  const uniqueProducts = [...new Set(mockLocations.map(l => ({ code: l.productCode, name: l.productName })))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Warehouse className="h-8 w-8" />
            Controle de Estoque
          </h1>
          <p className="text-muted-foreground">Gestão de localização e alertas de estoque</p>
        </div>
      </div>

      <Tabs defaultValue="location" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Localização
          </TabsTrigger>
          <TabsTrigger value="stock-alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Estoque Baixo
          </TabsTrigger>
          <TabsTrigger value="expiry-alerts" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Próximo ao Vencimento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consulta de Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os produtos</SelectItem>
                    {uniqueProducts.map(product => (
                      <SelectItem key={product.code} value={product.code}>
                        {product.code} - {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleProductSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              {filteredLocations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Localizações Encontradas</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Prateleira</TableHead>
                        <TableHead>Seção</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Validade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLocations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">{location.productName}</TableCell>
                          <TableCell className="font-mono">{location.productCode}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{location.shelf}</Badge>
                          </TableCell>
                          <TableCell>{location.section}</TableCell>
                          <TableCell>{location.quantity} {location.unit}</TableCell>
                          <TableCell>
                            {location.expiryDate ? new Date(location.expiryDate).toLocaleDateString() : '-'}
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

        <TabsContent value="stock-alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Produtos com Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque Atual</TableHead>
                    <TableHead>Estoque Mínimo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Reposição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStockAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.productName}</TableCell>
                      <TableCell className="font-mono">{alert.productCode}</TableCell>
                      <TableCell>{alert.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{alert.currentStock} {alert.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alert.minStock} {alert.unit}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={getStockVariant(alert.currentStock, alert.minStock)}>
                            {alert.currentStock === 0 ? 'Esgotado' : 
                             alert.currentStock <= alert.minStock ? 'Baixo' : 'Normal'}
                          </Badge>
                          <Progress 
                            value={getStockPercentage(alert.currentStock, alert.minStock)} 
                            className="w-24 h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {alert.lastRestock ? new Date(alert.lastRestock).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry-alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-warning" />
                Produtos Próximos ao Vencimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Data de Validade</TableHead>
                    <TableHead>Dias Restantes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExpiryAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.productName}</TableCell>
                      <TableCell className="font-mono">{alert.productCode}</TableCell>
                      <TableCell>{alert.quantity} {alert.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{alert.shelf}</Badge>
                      </TableCell>
                      <TableCell>{new Date(alert.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">
                        {alert.daysToExpire === 0 ? 'Hoje' :
                         alert.daysToExpire === 1 ? '1 dia' :
                         `${alert.daysToExpire} dias`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getExpiryVariant(alert.daysToExpire)}>
                          {alert.daysToExpire <= 1 ? 'Urgente' :
                           alert.daysToExpire <= 3 ? 'Atenção' : 'Monitorar'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}