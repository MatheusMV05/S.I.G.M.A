# Sistema de Perfis de Usuário S.I.G.M.A

## 🔐 Credenciais de Acesso por Perfil

### 1. **Administrador/Dono** 👑
- **E-mail**: `admin@comprebem.com`
- **Senha**: `admin123`
- **Descrição**: Acesso total ao sistema. Pode criar, editar e remover usuários. Acompanha relatórios financeiros, de vendas e de estoque. Aprova mudanças críticas (ex.: reajuste de preço em massa, promoções).
- **Permissões**:
  - ✅ Acesso total
  - ✅ Gestão de usuários
  - ✅ Relatórios financeiros
  - ✅ Relatórios de vendas e estoque
  - ✅ Ajuste de preços
  - ✅ Gestão de promoções
  - ✅ Configurações do sistema
  - ✅ Backup e restauração

### 2. **Gerente** 💼
- **E-mail**: `gerente@comprebem.com`
- **Senha**: `gerente123`
- **Descrição**: Gerência de Estoque: cadastra produtos, controla entrada e saída, confere relatórios de perdas. Gerência de Funcionários: cria escalas, aprova férias, controla permissões básicas. Visualiza relatórios de vendas e desempenho da loja. Não tem acesso a exclusão de usuários nem a configurações globais.
- **Permissões**:
  - ✅ Gestão de estoque
  - ✅ Cadastro de produtos
  - ✅ Controle de estoque
  - ✅ Escalas de funcionários
  - ✅ Aprovação de férias
  - ✅ Permissões básicas
  - ✅ Relatórios de vendas
  - ✅ Relatórios de performance
  - ✅ Relatórios de perdas

### 3. **Supervisor** 🛡️
- **E-mail**: `supervisor@comprebem.com`
- **Senha**: `super123`
- **Descrição**: Consulta relatórios de estoque e vendas. Autoriza cancelamentos de compras ou devoluções acima de certo valor. Auxilia no fechamento de caixa. Não gerencia funcionários nem acessa dados sensíveis (como salários).
- **Permissões**:
  - ✅ Relatórios de estoque
  - ✅ Relatórios de vendas
  - ✅ Aprovação de cancelamentos
  - ✅ Aprovação de devoluções
  - ✅ Fechamento de caixa
  - ✅ Consulta de produtos
  - ✅ Atendimento ao cliente

### 4. **Operador de Caixa** 💳
- **E-mail**: `caixa@comprebem.com`
- **Senha**: `caixa123`
- **Descrição**: Registra vendas. Realiza cancelamentos simples (ex.: item passado errado). Consulta preços e disponibilidade de produtos. Não tem acesso a relatórios de estoque nem a informações de funcionários.
- **Permissões**:
  - ✅ Registro de vendas
  - ✅ Cancelamentos simples
  - ✅ Consulta de preços
  - ✅ Consulta de disponibilidade
  - ✅ Atendimento ao cliente
  - ✅ Processamento de pagamentos

### 5. **Estoquista** 📦
- **E-mail**: `estoque@comprebem.com`
- **Senha**: `estoque123`
- **Descrição**: Dá entrada e saída de mercadorias. Consulta saldo de estoque. Reporta perdas (quebra, validade vencida). Não cadastra novos produtos nem altera preços.
- **Permissões**:
  - ✅ Entrada de estoque
  - ✅ Saída de estoque
  - ✅ Consulta de inventário
  - ✅ Relatório de perdas
  - ✅ Recebimento de produtos
  - ✅ Contagem de estoque

## 🎯 Acesso aos Módulos por Perfil

| Módulo | Admin | Gerente | Supervisor | Caixa | Estoque |
|--------|--------|---------|------------|-------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| POS | ✅ | ❌ | ✅ | ✅ | ❌ |
| Produtos | ✅ | ✅ | ❌ | ❌ | ✅ |
| Estoque | ✅ | ✅ | ✅ | ❌ | ✅ |
| Clientes | ✅ | ✅ | ✅ | ❌ | ❌ |
| Fornecedores | ✅ | ✅ | ❌ | ❌ | ❌ |
| Funcionários | ✅ | ✅ | ❌ | ❌ | ❌ |
| Categorias | ✅ | ✅ | ❌ | ❌ | ❌ |
| Promoções | ✅ | ❌ | ❌ | ❌ | ❌ |
| Relatórios | ✅ | ✅ | ✅ | ❌ | ❌ |
| Usuários | ✅ | ❌ | ❌ | ❌ | ❌ |

## 🔑 Como Testar:

1. **Acesse**: http://localhost:8080
2. **Faça logout** se já estiver logado
3. **Use as credenciais** de qualquer perfil acima
4. **Explore os menus** disponíveis para cada perfil
5. **Teste as permissões** tentando acessar áreas restritas

## 🛡️ Segurança Implementada:

- ✅ **Rotas Protegidas**: Cada rota verifica permissões
- ✅ **Menu Dinâmico**: Só aparecem opções permitidas
- ✅ **Validação de Acesso**: Componentes verificam permissões
- ✅ **Sessão Persistente**: Login mantido no localStorage
- ✅ **Logout Seguro**: Limpeza completa da sessão

## 📝 Observações:

- O sistema agora suporta **5 perfis distintos** de usuário
- Cada perfil tem **permissões específicas** baseadas em suas responsabilidades
- A **hierarquia organizacional** é respeitada nas funcionalidades
- **Dados sensíveis** (como salários) são restritos ao administrador
- O **menu lateral** se adapta automaticamente ao perfil logado

---

**S.I.G.M.A - Sistema Integrado de Gestão para Mercados e Atacados**
*Versão com Sistema Completo de Perfis de Usuário* 🚀