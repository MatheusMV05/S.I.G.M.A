import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Plus, Edit2, Trash2, Users, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Phone {
  id: string;
  number: string;
  type: 'celular' | 'residencial' | 'comercial';
}

interface Customer {
  id: string;
  name: string;
  type: 'pf' | 'pj';
  document: string; // CPF ou CNPJ
  email?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phones: Phone[];
  createdAt: string;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    type: 'pf',
    document: '123.456.789-00',
    email: 'joao@email.com',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apt 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    phones: [
      { id: '1', number: '(11) 99999-9999', type: 'celular' },
      { id: '2', number: '(11) 3333-3333', type: 'residencial' }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Empresa ABC Ltda',
    type: 'pj',
    document: '12.345.678/0001-90',
    email: 'contato@empresaabc.com',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    phones: [
      { id: '3', number: '(11) 4444-4444', type: 'comercial' }
    ],
    createdAt: '2024-02-10'
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    type: 'pf',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    phones: []
  });
  const { toast } = useToast();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.document.includes(searchTerm.replace(/\D/g, '')) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPhone = () => {
    const newPhone: Phone = {
      id: Date.now().toString(),
      number: '',
      type: 'celular'
    };
    setFormData({
      ...formData,
      phones: [...(formData.phones || []), newPhone]
    });
  };

  const updatePhone = (phoneId: string, field: keyof Phone, value: string) => {
    const updatedPhones = (formData.phones || []).map(phone =>
      phone.id === phoneId ? { ...phone, [field]: value } : phone
    );
    setFormData({ ...formData, phones: updatedPhones });
  };

  const removePhone = (phoneId: string) => {
    const updatedPhones = (formData.phones || []).filter(phone => phone.id !== phoneId);
    setFormData({ ...formData, phones: updatedPhones });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.document) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e documento são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name!,
      type: formData.type!,
      document: formData.document!,
      email: formData.email,
      address: formData.address!,
      phones: formData.phones || [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomers([...customers, newCustomer]);
    setFormData({ type: 'pf', address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' }, phones: [] });
    setIsAddDialogOpen(false);
    toast({
      title: "Cliente adicionado",
      description: "Cliente cadastrado com sucesso"
    });
  };

  const handleEdit = () => {
    if (!selectedCustomer) return;

    setCustomers(customers.map(c =>
      c.id === selectedCustomer.id
        ? { ...selectedCustomer, ...formData }
        : c
    ));

    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
    setFormData({ type: 'pf', address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' }, phones: [] });
    toast({
      title: "Cliente atualizado",
      description: "Cliente editado com sucesso"
    });
  };

  const handleDelete = () => {
    if (!selectedCustomer) return;

    setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
    toast({
      title: "Cliente removido",
      description: "Cliente excluído com sucesso"
    });
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const formatDocument = (doc: string) => {
    const clean = doc.replace(/\D/g, '');
    if (clean.length === 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (clean.length === 14) {
      return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            Clientes
          </h1>
          <p className="text-muted-foreground">Cadastro e gerenciamento de clientes</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Tipo de Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo de Cliente *</Label>
                  <Select value={formData.type} onValueChange={(value: 'pf' | 'pj') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pf">Pessoa Física</SelectItem>
                      <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="document">{formData.type === 'pf' ? 'CPF' : 'CNPJ'} *</Label>
                  <Input
                    id="document"
                    placeholder={formData.type === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
                    value={formData.document || ''}
                    onChange={(e) => setFormData({...formData, document: e.target.value})}
                  />
                </div>
              </div>

              {/* Dados Básicos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{formData.type === 'pf' ? 'Nome Completo' : 'Razão Social'} *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Endereço</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      placeholder="00000-000"
                      value={formData.address?.zipCode || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, zipCode: e.target.value}
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="street">Logradouro</Label>
                    <Input
                      id="street"
                      value={formData.address?.street || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, street: e.target.value}
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={formData.address?.number || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, number: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={formData.address?.complement || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, complement: e.target.value}
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.address?.neighborhood || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, neighborhood: e.target.value}
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.address?.city || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, city: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      maxLength={2}
                      value={formData.address?.state || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, state: e.target.value.toUpperCase()}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Telefones */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Telefones</h3>
                  <Button type="button" variant="outline" onClick={addPhone}>
                    <Phone className="h-4 w-4 mr-2" />
                    Adicionar Telefone
                  </Button>
                </div>
                {(formData.phones || []).map((phone) => (
                  <div key={phone.id} className="grid grid-cols-5 gap-4 items-end">
                    <div className="col-span-2">
                      <Label>Número</Label>
                      <Input
                        placeholder="(00) 00000-0000"
                        value={phone.number}
                        onChange={(e) => updatePhone(phone.id, 'number', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select 
                        value={phone.type} 
                        onValueChange={(value: 'celular' | 'residencial' | 'comercial') => 
                          updatePhone(phone.id, 'type', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="celular">Celular</SelectItem>
                          <SelectItem value="residencial">Residencial</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        onClick={() => removePhone(phone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, documento ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <span className={customer.type === 'pf' ? 'text-blue-600' : 'text-green-600'}>
                      {customer.type === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">{formatDocument(customer.document)}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>
                    {customer.phones.length > 0 ? customer.phones[0].number : '-'}
                    {customer.phones.length > 1 && (
                      <span className="text-muted-foreground ml-2">
                        +{customer.phones.length - 1} mais
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(customer)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(customer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{selectedCustomer?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}