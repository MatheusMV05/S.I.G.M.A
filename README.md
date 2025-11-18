<div align="center">

# S.I.G.M.A.

### Sistema Integrado de Gestao de Mercado e Atacado

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

Uma solucao completa e moderna para gestao de supermercados e estabelecimentos de atacado, desenvolvida com as mais recentes tecnologias do mercado.

[Funcionalidades](#funcionalidades) • [Instalacao](#instalacao) • [Uso](#como-usar) • [Arquitetura](#arquitetura) • [Documentacao](#documentacao)

</div>

---

## Sobre o Projeto

O **S.I.G.M.A.** e um sistema ERP completo desenvolvido especificamente para operacoes de varejo e atacado. Oferece controle total sobre vendas, estoque, produtos, funcionarios, clientes e relatorios gerenciais atraves de uma interface moderna e intuitiva.

### Caracteristicas Principais

- **Gestao Completa de Vendas**: PDV integrado com controle de pagamentos, devolucoes e historico
- **Controle de Estoque Inteligente**: Monitoramento em tempo real, alertas automaticos e movimentacoes
- **Gerenciamento de Produtos**: Cadastro completo com categorias, promocoes e precos dinamicos
- **Gestao de Funcionarios**: Controle de ponto, ferias, documentos e historico profissional
- **Analytics Avancado**: Dashboard estatistico com 6+ graficos e indicadores de performance
- **Sistema de Caixa**: Abertura, fechamento e controle de movimentacoes financeiras
- **Gestao de Clientes**: Cadastro de pessoas fisicas e juridicas com historico de compras
- **Controle de Fornecedores**: Gerenciamento completo de fornecedores e condicoes comerciais

---

## Stack Tecnologica

### Frontend
```
React 18                    Framework JavaScript moderno
TypeScript 5.0              Tipagem estatica e maior confiabilidade
Vite                        Build tool de alta performance
Tailwind CSS                Framework CSS utilitario
shadcn/ui                   Componentes UI modernos (Radix UI)
React Router v6             Roteamento SPA
React Hook Form             Gerenciamento de formularios
Recharts                    Biblioteca de graficos
Framer Motion               Animacoes fluidas
```

### Backend
```
Spring Boot 3.2.4           Framework Java empresarial
Java 21                     Ultima versao LTS do Java
JDBC Template               Acesso direto ao banco (sem ORM)
Spring Security             Autenticacao e autorizacao
JWT                         Tokens de sessao seguros
Maven                       Gerenciamento de dependencias
```

### Banco de Dados
```
MySQL 8.0+                  Sistema de gerenciamento de banco de dados
Views                       Consultas complexas otimizadas
Stored Procedures           Logica de negocio no banco
Functions                   Calculos e transformacoes
Triggers                    Automacoes e auditoria
```

---

## Pre-requisitos

Antes de iniciar, certifique-se de ter instalado em seu ambiente:

| Ferramenta | Versao Minima | Descricao |
|-----------|---------------|-----------|
| **Java JDK** | 21 | Runtime e compilador Java |
| **Node.js** | 18.x | Runtime JavaScript |
| **npm** | 9.x | Gerenciador de pacotes Node |
| **MySQL** | 8.0 | Banco de dados relacional |
| **Maven** | 3.8+ | Gerenciador de dependencias Java |
| **Git** | 2.x | Controle de versao |

### Ferramentas Recomendadas

- **IDE Backend**: IntelliJ IDEA, Eclipse ou VS Code com Java Extension Pack
- **IDE Frontend**: VS Code com extensoes React/TypeScript
- **Cliente MySQL**: MySQL Workbench, DBeaver, DataGrip ou HeidiSQL
- **Cliente API**: Postman, Insomnia ou Thunder Client (VS Code)

---

## Instalacao

Siga este guia passo a passo para configurar o ambiente completo do S.I.G.M.A.

### 1. Clone o Repositorio

```bash
git clone https://github.com/seu-usuario/sigma.git
cd sigma
```

### 2. Configuracao do Banco de Dados

#### 2.1. Inicie o MySQL

Certifique-se de que o servidor MySQL esta em execucao:

```bash
# Linux/MacOS
sudo systemctl start mysql
# ou
sudo service mysql start

# Windows (executar como administrador)
net start MySQL80
```

#### 2.2. Execute o Script de Criacao e Populacao

O script `CriacaoEInsercao.sql` contem toda a estrutura do banco de dados e dados iniciais para testes.

**Opcao A: Via MySQL Workbench**

1. Abra o MySQL Workbench
2. Conecte-se ao servidor MySQL local
3. Clique em `File` > `Open SQL Script`
4. Navegue ate `Backend/sigma/scripts_sql/CriacaoEInsercao.sql`
5. Clique no icone de raio para executar todo o script
6. Aguarde a conclusao (pode levar alguns segundos)
7. Verifique a mensagem de sucesso no console

**Opcao B: Via DBeaver**

1. Abra o DBeaver
2. Conecte-se ao MySQL
3. Clique com botao direito na conexao > `SQL Editor` > `Open SQL Script`
4. Selecione o arquivo `Backend/sigma/scripts_sql/CriacaoEInsercao.sql`
5. Clique em `Execute SQL Statement` (Ctrl+Enter)
6. Confirme a execucao e aguarde

**Opcao C: Via Linha de Comando**

```bash
# Navegue ate o diretorio dos scripts
cd Backend/sigma/scripts_sql

# Execute o script
mysql -u root -p < CriacaoEInsercao.sql

# Digite sua senha quando solicitado
```

#### 2.3. Verifique a Instalacao

Execute as seguintes consultas para confirmar que o banco foi criado corretamente:

```sql
USE SIGMA;

-- Verificar tabelas criadas
SHOW TABLES;

-- Verificar dados de exemplo
SELECT COUNT(*) as total_produtos FROM Produto;
SELECT COUNT(*) as total_clientes FROM Cliente;
SELECT COUNT(*) as total_funcionarios FROM Funcionario;
```

**Resultado Esperado:**
- 30+ tabelas criadas
- ~100 produtos cadastrados
- ~65 clientes cadastrados
- ~35 funcionarios cadastrados

### 3. Configuracao do Backend

#### 3.1. Configure o application.properties

Navegue ate `Backend/sigma/src/main/resources/application.properties` e ajuste as credenciais do banco:

```properties
# Configuracoes do Banco de Dados
spring.datasource.url=jdbc:mysql://localhost:3306/SIGMA?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI

# Configuracoes do Spring
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=none

# Configuracoes do Servidor
server.port=8080

# Configuracoes JWT (opcional - ajustar em producao)
jwt.secret=sua_chave_secreta_super_segura_aqui
jwt.expiration=86400000
```

#### 3.2. Instale as Dependencias Maven

```bash
# Navegue ate o diretorio do backend
cd Backend/sigma

# Limpe e instale dependencias
mvn clean install

# Ou compile sem executar os testes (mais rapido)
mvn clean install -DskipTests
```

**Tempo estimado:** 2-5 minutos (primeira vez, devido ao download de dependencias)

#### 3.3. Verifique a Compilacao

```bash
# Compile o projeto
mvn compile

# Deve exibir "BUILD SUCCESS" ao final
```

### 4. Configuracao do Frontend

#### 4.1. Instale as Dependencias Node

```bash
# Navegue ate o diretorio do frontend
cd Frontend

# Instale as dependencias
npm install

# Aguarde a conclusao do download
```

**Tempo estimado:** 1-3 minutos

#### 4.2. Configure as Variaveis de Ambiente (Opcional)

Crie um arquivo `.env` no diretorio `Frontend/` se necessario:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=S.I.G.M.A.
```

**Nota:** O sistema ja vem configurado com os valores padrao. Este passo e opcional.

### 5. Verificacao Final

Antes de executar o sistema, verifique se:

- [ ] MySQL esta rodando na porta 3306
- [ ] Banco de dados SIGMA foi criado com sucesso
- [ ] Backend compilou sem erros
- [ ] Frontend instalou todas as dependencias
- [ ] Portas 8080 (backend) e 5173 (frontend) estao disponiveis

---

## Como Usar

### Iniciando o Sistema

Voce precisara de **3 terminais abertos** simultaneamente:

#### Terminal 1: MySQL (se nao estiver como servico)
```bash
# Apenas se o MySQL nao estiver rodando como servico
mysqld
```

#### Terminal 2: Backend
```bash
cd Backend/sigma
mvn spring-boot:run

# Aguarde a mensagem: "Started SigmaApplication in X seconds"
# Backend estara disponivel em: http://localhost:8080
```

#### Terminal 3: Frontend
```bash
cd Frontend
npm run dev

# Aguarde a mensagem com o endereco local
# Frontend estara disponivel em: http://localhost:5173
```

### Acessando o Sistema

1. Abra seu navegador
2. Acesse: `http://localhost:5173`
3. Use as credenciais padrao:

**Usuario Administrador:**
```
Usuario: admin
Senha: admin123
```

**Usuario Gerente:**
```
Usuario: gerente
Senha: gerente123
```

**Usuario Operador de Caixa:**
```
Usuario: caixa01
Senha: caixa123
```

### Parando o Sistema

Para parar os servicos de forma segura:

1. **Frontend**: Pressione `Ctrl + C` no terminal
2. **Backend**: Pressione `Ctrl + C` no terminal
3. **MySQL**: Se iniciado manualmente, pressione `Ctrl + C`

---

## Arquitetura

### Estrutura de Diretorios

```
sigma/
├── Backend/
│   └── sigma/
│       ├── src/
│       │   └── main/
│       │       ├── java/com/project/sigma/
│       │       │   ├── controller/         # Endpoints REST
│       │       │   ├── service/            # Regras de negocio
│       │       │   ├── repository/         # Acesso a dados (JDBC)
│       │       │   ├── model/              # Entidades do dominio
│       │       │   ├── dto/                # Data Transfer Objects
│       │       │   ├── config/             # Configuracoes
│       │       │   └── security/           # Autenticacao e JWT
│       │       └── resources/
│       │           └── application.properties
│       ├── scripts_sql/
│       │   ├── CriacaoEInsercao.sql       # Script principal
│       │   └── script_completo_etapas_04_05.sql
│       └── pom.xml                         # Dependencias Maven
│
└── Frontend/
    ├── src/
    │   ├── components/                     # Componentes React
    │   ├── pages/                          # Paginas principais
    │   ├── services/                       # Integracao com API
    │   ├── hooks/                          # Custom hooks
    │   ├── contexts/                       # Context API
    │   ├── lib/                            # Utilitarios
    │   └── types/                          # Definicoes TypeScript
    ├── package.json                        # Dependencias Node
    └── vite.config.ts                      # Configuracao Vite
```

### Fluxo de Dados

```
┌─────────────────┐
│   React/TS      │  Camada de Apresentacao
│   Frontend      │  (Interface do Usuario)
└────────┬────────┘
         │ HTTP/REST
         │ JSON
┌────────▼────────┐
│  Spring Boot    │  Camada de Aplicacao
│   Controllers   │  (Logica de Negocio)
└────────┬────────┘
         │ JDBC
         │ SQL
┌────────▼────────┐
│     MySQL       │  Camada de Dados
│   Database      │  (Persistencia)
└─────────────────┘
```

### Principais Endpoints da API

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/auth/login` | Autenticacao de usuario |
| GET | `/api/produtos` | Listar produtos |
| POST | `/api/produtos` | Criar produto |
| GET | `/api/vendas` | Listar vendas |
| POST | `/api/vendas` | Registrar venda |
| GET | `/api/dashboard/estatisticas` | Estatisticas gerais |
| GET | `/api/funcionarios` | Listar funcionarios |
| POST | `/api/caixas/abrir` | Abrir caixa |

---

## Funcionalidades

### Modulo de Vendas (PDV)
- Registro de vendas com multiplos produtos
- Suporte a diversos metodos de pagamento
- Calculo automatico de descontos e promocoes
- Emissao de cupom fiscal
- Controle de devolucoes e trocas

### Gestao de Estoque
- Controle de entrada e saida de produtos
- Alertas de estoque minimo
- Movimentacoes com historico completo
- Inventario periodico
- Relatorios de movimentacao

### Administracao de Produtos
- Cadastro completo de produtos
- Gestao de categorias
- Controle de precos (custo e venda)
- Sistema de promocoes
- Gerenciamento de codigo de barras

### Recursos Humanos
- Cadastro de funcionarios
- Controle de ponto eletronico
- Gestao de ferias
- Armazenamento de documentos
- Historico profissional

### Analytics e Relatorios
- Dashboard com indicadores-chave
- 6+ graficos estatisticos interativos
- Relatorios de vendas por periodo
- Analise de produtos mais vendidos
- Metricas de desempenho

### Financeiro
- Controle de caixa
- Movimentacoes de entrada/saida
- Fechamento de caixa com conferencia
- Relatorios financeiros
- Controle de metas de vendas

### Gestao de Clientes
- Cadastro de pessoas fisicas
- Cadastro de pessoas juridicas
- Historico de compras
- Programa de fidelidade
- Controle de credito

### Fornecedores
- Cadastro completo
- Condicoes comerciais
- Historico de pedidos
- Avaliacao de fornecedores
- Controle de prazos

---

## Banco de Dados

### Estrutura Principal

O banco de dados SIGMA possui 30+ tabelas organizadas em modulos:

**Modulo Base:**
- Pessoa (tabela central)
- Telefone

**Modulo de Vendas:**
- Venda
- ItemVenda
- Caixa
- MovimentacaoCaixa

**Modulo de Produtos:**
- Produto
- Categoria
- Promocao
- ProdutoPromocao

**Modulo RH:**
- Funcionario
- Usuario
- RegistroPonto
- Ferias

**Modulo de Estoque:**
- MovimentacaoEstoque
- Alerta

### Recursos Avancados

**Views (Visoes):**
- `view_produtos_estoque_critico` - Produtos com estoque baixo
- `view_vendas_detalhadas` - Relatorio completo de vendas

**Functions (Funcoes):**
- `calcular_desconto_progressivo()` - Calculo de descontos por quantidade
- `verificar_meta_atingida()` - Verificacao de cumprimento de metas

**Procedures (Procedimentos):**
- `sp_atualizar_precos_categoria()` - Atualizacao em massa de precos
- `sp_processar_fechamento_caixa()` - Processamento de fechamento com cursor

**Triggers (Gatilhos):**
- Atualizacao automatica de estoque
- Registro de auditoria
- Validacoes de integridade

---

## Troubleshooting

### Problemas Comuns e Solucoes

#### Backend nao inicia

**Erro: "Unable to acquire JDBC Connection"**
```
Solucao:
1. Verifique se o MySQL esta rodando
2. Confirme usuario e senha em application.properties
3. Teste conexao: mysql -u root -p
```

**Erro: "Port 8080 already in use"**
```
Solucao:
1. Identifique processo: netstat -ano | findstr :8080 (Windows)
                        lsof -i :8080 (Linux/Mac)
2. Mate o processo ou altere a porta em application.properties
```

#### Frontend nao carrega

**Erro: "Failed to fetch"**
```
Solucao:
1. Verifique se o backend esta rodando
2. Confirme a URL da API (http://localhost:8080)
3. Verifique configuracao de CORS no backend
```

**Erro: "npm install falha"**
```
Solucao:
1. Limpe cache: npm cache clean --force
2. Delete node_modules e package-lock.json
3. Execute novamente: npm install
```

#### Banco de Dados

**Erro: "Table doesn't exist"**
```
Solucao:
1. Execute novamente CriacaoEInsercao.sql
2. Verifique se esta usando o banco correto: USE SIGMA;
```

**Erro: "Access denied for user"**
```
Solucao:
1. Crie usuario MySQL: CREATE USER 'sigma'@'localhost' IDENTIFIED BY 'senha';
2. Conceda permissoes: GRANT ALL PRIVILEGES ON SIGMA.* TO 'sigma'@'localhost';
```

#### Problemas de Autenticacao

**Token JWT expirado**
```
Solucao:
1. Faca logout do sistema
2. Limpe localStorage no navegador
3. Faca login novamente
```

---

## Requisitos Academicos

Este projeto foi desenvolvido como trabalho da disciplina de Banco de Dados, atendendo aos seguintes requisitos:

**Etapa 04 - Consultas Avancadas, Visoes e Indices:**
- 2+ indices otimizados
- 4 consultas avancadas (anti join, full outer join, subconsultas)
- 2 views elaboradas com 3+ joins

**Etapa 05 - Funcoes, Procedimentos e Triggers:**
- 2 funcoes com justificativa semantica
- 2 procedimentos (atualizacao e cursor)
- 2 triggers com auditoria

**Etapa 06 - Interface Funcional com Dashboard:**
- CRUD para 4+ tabelas
- Integracao com funcoes/procedimentos/triggers
- Dashboard com 6+ graficos estatisticos
- Visualizacao de consultas e views

**Importante:** O projeto utiliza JDBC puro (sem ORM) conforme exigido pela disciplina.

---

## Tecnologias e Padroes

### Design Patterns Implementados
- **MVC** - Separacao de responsabilidades
- **Repository Pattern** - Acesso a dados
- **DTO Pattern** - Transferencia de dados
- **Service Layer** - Logica de negocio
- **Singleton** - Instancias unicas de servicos

### Boas Praticas
- Codigo limpo e documentado
- Nomenclatura significativa
- Tratamento de erros
- Validacoes client-side e server-side
- Seguranca (JWT, hash de senhas)
- Responsividade mobile-first

---

## Deploy em Producao

O S.I.G.M.A. esta pronto para deploy em producao! Consulte o arquivo **[DEPLOY.md](DEPLOY.md)** para instrucoes detalhadas de como fazer deploy:

- **Frontend**: Vercel
- **Backend**: Railway
- **Banco de Dados**: MySQL (Railway ou externo)

### Arquivos de Configuracao para Deploy

- `Frontend/vercel.json` - Configuracao do Vercel
- `Frontend/.env.example` - Variaveis de ambiente do frontend
- `Frontend/.env.production.example` - Variaveis de ambiente para producao
- `Backend/sigma/Procfile` - Comando de start para Railway
- `Backend/sigma/railway.json` - Configuracao do Railway
- `Backend/sigma/nixpacks.toml` - Configuracao do Nixpacks
- `Backend/sigma/src/main/resources/application-prod.properties.example` - Configuracao de producao do Spring Boot

---

## Licenca

Este projeto e proprietario e foi desenvolvido exclusivamente para fins academicos e comerciais especificos. Todos os direitos reservados 2025.

---

<div align="center">

**Desenvolvido com dedicacao para revolucionar a gestao de supermercados e atacados**

[![Made with Java](https://img.shields.io/badge/Made%20with-Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.java.com)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Powered by MySQL](https://img.shields.io/badge/Powered%20by-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>