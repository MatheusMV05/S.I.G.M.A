import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Truck, UserCheck, FolderOpen, Tag, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Registrations() {
  const registrationCategories = [
    {
      id: 'customers',
      title: 'Clientes',
      description: 'Cadastro de pessoas físicas e jurídicas',
      icon: Users,
      path: '/customers',
      count: 1250
    },
    {
      id: 'suppliers',
      title: 'Fornecedores',
      description: 'Empresas e fornecedores de produtos',
      icon: Truck,
      path: '/suppliers',
      count: 45
    },
    {
      id: 'employees',
      title: 'Funcionários',
      description: 'Colaboradores e hierarquia organizacional',
      icon: UserCheck,
      path: '/employees',
      count: 28
    },
    {
      id: 'categories',
      title: 'Categorias',
      description: 'Categorias de produtos e organização',
      icon: FolderOpen,
      path: '/categories',
      count: 12
    },
    {
      id: 'promotions',
      title: 'Promoções',
      description: 'Campanhas promocionais e descontos',
      icon: Tag,
      path: '/promotions',
      count: 8
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Cadastros Gerais
          </h1>
          <p className="text-muted-foreground">Gerenciamento de cadastros e registros do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registrationCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{category.count}</p>
                    <p className="text-sm text-muted-foreground">registros</p>
                  </div>
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Link to={category.path}>
                  <Button className="w-full">
                    Gerenciar {category.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Seção de Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">CADASTROS RECENTES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-sm text-success">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">CLIENTES ATIVOS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">892</div>
            <p className="text-sm text-success">+5.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">FORNECEDORES ATIVOS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">38</div>
            <p className="text-sm text-muted-foreground">Estável</p>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Navegação Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Cadastros de Pessoas</h3>
              <div className="space-y-2">
                <Link to="/customers">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Clientes (PF/PJ)
                  </Button>
                </Link>
                <Link to="/employees">
                  <Button variant="ghost" className="w-full justify-start">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Funcionários
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Cadastros de Produtos</h3>
              <div className="space-y-2">
                <Link to="/suppliers">
                  <Button variant="ghost" className="w-full justify-start">
                    <Truck className="h-4 w-4 mr-2" />
                    Fornecedores
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="ghost" className="w-full justify-start">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Categorias
                  </Button>
                </Link>
                <Link to="/promotions">
                  <Button variant="ghost" className="w-full justify-start">
                    <Tag className="h-4 w-4 mr-2" />
                    Promoções
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}