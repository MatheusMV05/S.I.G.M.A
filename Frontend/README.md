# 🛒 S.I.G.M.A - Sistema Integrado de Gestão para Mercados e Atacados

![Sigma Logo](src/assets/sigma-logo.png)

## 📋 Visão Geral

O **S.I.G.M.A** é um sistema completo de gestão desenvolvido especificamente para o **Supermercado 'Compre Bem'**. Esta aplicação web profissional oferece uma solução moderna, responsiva e intuitiva para gerenciar todos os aspectos de um supermercado.

## 🚀 Tecnologias Utilizadas

### Frontend Framework
- **React 18.3.1** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite 5.4.19** - Build tool moderna e rápida

### UI/UX Libraries
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos baseados em Radix UI
- **Radix UI** - Primitivos de UI acessíveis e customizáveis
- **Lucide React** - Biblioteca de ícones moderna e elegante

### Data Visualization
- **Recharts 2.15.4** - Biblioteca de gráficos para React

### Routing & Navigation
- **React Router DOM 6.30.1** - Roteamento para aplicações React

### Typography
- **Montserrat** - Fonte profissional via Google Fonts

## 🎨 Design System

### Paleta de Cores Sigma
- **Primary**: `#9933FF` (Roxo Sigma)
- **Secondary**: `#FF33CC` (Magenta Vibrante)
- **Success**: `#00FF7F` (Verde Sucesso)
- **Warning**: `#FFD700` (Amarelo Alerta)
- **Destructive**: `#FF3333` (Vermelho Erro)
- **Background**: `#0A0A0A` (Preto Profundo)
- **Foreground**: `#FAFAFA` (Branco Suave)

### Características do Design
- **Dark Mode** como padrão
- **Design Responsivo** para todos os dispositivos
- **Animações suaves** e transições elegantes
- **Tipografia profissional** com Montserrat
- **Componentes acessíveis** seguindo padrões WCAG

## 🏗️ Arquitetura do Sistema

### Estrutura de Pastas
```
src/
├── assets/              # Recursos estáticos (imagens, ícones)
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes da interface (shadcn/ui)
│   ├── AppSidebar.tsx  # Sidebar principal
│   ├── ProtectedRoute.tsx # Proteção de rotas
│   └── SigmaLogo.tsx   # Logo componente
├── contexts/           # Contextos React (AuthContext)
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── LoginPage.tsx   # Página de login
│   ├── Products.tsx    # Gestão de produtos
│   ├── POS.tsx         # Sistema PDV
│   ├── Customers.tsx   # Gestão de clientes
│   ├── Inventory.tsx   # Controle de estoque
│   ├── Registrations.tsx # Central de cadastros
│   └── Reports.tsx     # Relatórios e analytics
└── main.tsx            # Ponto de entrada da aplicação
```

## 🔧 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Login seguro com validação
- Controle de acesso por níveis de usuário
- Proteção de rotas sensíveis
- Sessão persistente

### 📊 Dashboard Executivo
- **KPIs em tempo real**: Vendas, lucro, produtos vendidos, ticket médio
- **Gráficos interativos**: Evolução de vendas, análise de produtos
- **Cards informativos**: Estatísticas principais com indicadores de crescimento
- **Interface tabular**: Navegação entre diferentes métricas

### 🛍️ Gestão de Produtos
- **CRUD completo**: Criar, listar, editar e excluir produtos
- **Busca avançada**: Por nome, código de barras, categoria
- **Filtros inteligentes**: Por status, categoria, faixa de preço
- **Análise de preços**: Comparação de custos e margens
- **Status do estoque**: Indicadores visuais de disponibilidade

### 💰 Sistema PDV (Ponto de Venda)
- **Interface intuitiva**: Design otimizado para operadores de caixa
- **Leitura de código de barras**: Busca rápida de produtos
- **Carrinho de compras**: Adição, remoção e edição de itens
- **Múltiplas formas de pagamento**: Dinheiro, cartão, PIX
- **Seleção de clientes**: Integração com base de clientes
- **Cálculos automáticos**: Subtotal, desconto, total, troco

### 👥 Gestão de Clientes (CRM)
- **Cadastro completo**: Dados pessoais, endereço, contato
- **Sistema de tiers**: Básico, Regular, Premium, VIP
- **Histórico de compras**: Rastreamento completo de transações
- **Métricas de engajamento**: Frequência, ticket médio, LTV

### 📦 Controle de Inventário
- **Estoque em tempo real**: Acompanhamento de quantidades
- **Alertas inteligentes**: Produtos em falta ou com estoque baixo
- **Movimentações**: Histórico completo de entradas e saídas
- **Localização**: Sistema de endereçamento no estoque
- **Previsões**: Estimativa de dias para ruptura
- **Relatórios**: Giro de estoque, investimento por categoria

### 📋 Central de Cadastros
#### Funcionários
- **Gestão completa**: Dados pessoais, cargos, departamentos
- **Controle salarial**: Folha de pagamento, histórico
- **Níveis de acesso**: Admin, Supervisor, Operador, Estoquista

#### Fornecedores
- **Dados empresariais**: CNPJ, contato, endereço
- **Categorias**: Classificação por tipo de produto
- **Histórico comercial**: Pedidos, valores, performance

#### Categorias de Produtos
- **Organização**: Estrutura hierárquica de produtos
- **Estatísticas**: Contagem de produtos por categoria
- **Descrições**: Detalhamento de cada categoria

#### Promoções
- **Campanhas**: Criação e gestão de promoções
- **Descontos**: Percentuais e valores fixos
- **Períodos**: Controle de datas de início e fim
- **Performance**: Acompanhamento de resultados

### 📈 Relatórios e Analytics
#### Vendas
- **Evolução temporal**: Gráficos de vendas mensais
- **Top produtos**: Ranking de mais vendidos
- **Análise por categoria**: Distribuição de vendas
- **Crescimento**: Indicadores de performance

#### Estoque
- **Produtos críticos**: Alertas de ruptura
- **Movimentação**: Fluxo de entrada e saída
- **Investimento**: Valor total em estoque
- **Giro**: Rotatividade por categoria

#### Clientes
- **Segmentação**: Análise por tiers
- **Crescimento da base**: Novos clientes
- **Comportamento**: Padrões de compra
- **Fidelização**: Métricas de retenção

#### Financeiro
- **Receita**: Acompanhamento de faturamento
- **Lucro**: Margens e rentabilidade
- **Custos**: Análise detalhada de despesas
- **Fluxo de caixa**: Entradas e saídas

## 🎯 Características Técnicas

### Performance
- **Build otimizado** com Vite
- **Code splitting** automático
- **Lazy loading** de componentes
- **Caching inteligente**

### Responsividade
- **Mobile-first** design
- **Breakpoints** otimizados
- **Touch-friendly** interfaces
- **Adaptação automática** de layout

### Acessibilidade
- **WCAG 2.1** compliance
- **Keyboard navigation** completa
- **Screen reader** support
- **Contraste adequado** de cores

### Segurança
- **Sanitização** de inputs
- **Validação** client-side e server-side
- **Proteção XSS** e CSRF
- **Autenticação** robusta

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [repository-url]

# Entre no diretório
cd Frontend

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Acessos do Sistema
- **URL**: http://localhost:8080
- **Login Demo**: 
  - Email: admin@comprebem.com
  - Senha: admin123

## 📱 Screenshots

### Dashboard Principal
Interface moderna com KPIs em tempo real e gráficos interativos

### Sistema PDV
Tela otimizada para operadores de caixa com fluxo intuitivo

### Gestão de Produtos
CRUD completo com filtros avançados e análises de preços

### Relatórios
Analytics detalhados com visualizações profissionais

## 🔄 Próximas Funcionalidades

### Em Desenvolvimento
- [ ] Integração com APIs de pagamento
- [ ] Módulo de compras e pedidos
- [ ] Sistema de comissões
- [ ] App mobile nativo
- [ ] Integração com balanças
- [ ] Sistema de delivery

### Roadmap
- [ ] BI avançado com machine learning
- [ ] Integração com ERP
- [ ] Sistema de fidelidade avançado
- [ ] Multi-lojas
- [ ] API pública
- [ ] Marketplace integration

## 👥 Equipe de Desenvolvimento

**Frontend Developer**: Sistema desenvolvido com foco em UX/UI profissional

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- **Email**: suporte@sigma-system.com.br
- **Documentação**: [Link para docs]
- **Issues**: [Link para GitHub Issues]

## 📄 Licença

Sistema proprietário desenvolvido para o Supermercado 'Compre Bem'.

---

**S.I.G.M.A** - *Sistema Integrado de Gestão para Mercados e Atacados*
Desenvolvido com ❤️ para o **Supermercado 'Compre Bem'**