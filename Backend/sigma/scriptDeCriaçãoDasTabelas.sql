DROP DATABASE IF EXISTS SIGMA;
CREATE DATABASE SIGMA;
USE SIGMA;

-- =================================================================
-- TABELAS BASE (PESSOA E CONTATOS)
-- =================================================================

-- Tabela central de Pessoa (base para Cliente, Funcionário, Fornecedor)
CREATE TABLE Pessoa (
                        id_pessoa BIGINT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(255) NOT NULL,
                        email VARCHAR(255),
                        rua VARCHAR(255),
                        numero VARCHAR(20),
                        bairro VARCHAR(100),
                        cidade VARCHAR(100),
                        cep VARCHAR(10),
                        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Tabela base para todas as pessoas do sistema (clientes, funcionários, fornecedores).';

-- Tabela de Telefones (relacionamento 1:N com Pessoa)
CREATE TABLE Telefone (
                          id_telefone BIGINT AUTO_INCREMENT PRIMARY KEY,
                          id_pessoa BIGINT NOT NULL,
                          numero VARCHAR(20) NOT NULL,
                          tipo ENUM('RESIDENCIAL', 'COMERCIAL', 'CELULAR', 'OUTRO') DEFAULT 'CELULAR',

                          FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa)
                              ON DELETE CASCADE
                              ON UPDATE CASCADE
) COMMENT 'Telefones associados a pessoas (pode ter múltiplos por pessoa).';

-- =================================================================
-- TABELAS DE USUÁRIOS E FUNCIONÁRIOS
-- =================================================================

-- Tabela de Funcionários (especialização de Pessoa)
CREATE TABLE Funcionario (
                             id_pessoa BIGINT PRIMARY KEY,
                             matricula VARCHAR(20) UNIQUE NOT NULL,
                             salario DECIMAL(10, 2) NOT NULL,
                             cargo VARCHAR(100),
                             setor VARCHAR(100),
                             id_supervisor BIGINT NULL,
                             status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
                             data_admissao DATE,

                             FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa) ON DELETE CASCADE,
                             FOREIGN KEY (id_supervisor) REFERENCES Funcionario(id_pessoa) ON DELETE SET NULL
) COMMENT 'Funcionários da empresa.';

-- Tabela de Usuários do Sistema (funcionários com acesso ao sistema)
CREATE TABLE Usuario (
                         id_pessoa BIGINT PRIMARY KEY,
                         username VARCHAR(100) NOT NULL UNIQUE,
                         password VARCHAR(255) NOT NULL,
                         role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
                         status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
                         ultimo_acesso TIMESTAMP NULL,

                         FOREIGN KEY (id_pessoa) REFERENCES Funcionario(id_pessoa) ON DELETE CASCADE
) COMMENT 'Usuários que podem acessar o sistema (subconjunto de funcionários).';

-- =================================================================
-- TABELAS DE CLIENTES
-- =================================================================

-- Tabela de Clientes (especialização de Pessoa)
CREATE TABLE Cliente (
                         id_pessoa BIGINT PRIMARY KEY,
                         tipo_pessoa ENUM('FISICA', 'JURIDICA') NOT NULL,
                         ativo BOOLEAN NOT NULL DEFAULT TRUE,
                         ranking INT NOT NULL DEFAULT 1,
                         total_gasto DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                         data_ultima_compra DATE,

                         FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa) ON DELETE CASCADE
) COMMENT 'Clientes que compram produtos.';

-- Tabela para Clientes Pessoa Física
CREATE TABLE ClienteFisica (
                               id_pessoa BIGINT PRIMARY KEY,
                               cpf VARCHAR(14) UNIQUE NOT NULL,
                               data_nascimento DATE,

                               FOREIGN KEY (id_pessoa) REFERENCES Cliente(id_pessoa) ON DELETE CASCADE
) COMMENT 'Dados específicos de clientes pessoa física.';

-- Tabela para Clientes Pessoa Jurídica
CREATE TABLE ClienteJuridica (
                                 id_pessoa BIGINT PRIMARY KEY,
                                 cnpj VARCHAR(18) UNIQUE NOT NULL,
                                 razao_social VARCHAR(255),
                                 inscricao_estadual VARCHAR(20),

                                 FOREIGN KEY (id_pessoa) REFERENCES Cliente(id_pessoa) ON DELETE CASCADE
) COMMENT 'Dados específicos de clientes pessoa jurídica.';

-- =================================================================
-- TABELAS DE FORNECEDORES
-- =================================================================

-- Tabela de Fornecedores (pode ser ligada a Pessoa ou independente)
CREATE TABLE Fornecedor (
                            id_fornecedor BIGINT AUTO_INCREMENT PRIMARY KEY,
                            id_pessoa BIGINT NULL,
                            nome_fantasia VARCHAR(255) NOT NULL,
                            razao_social VARCHAR(255),
                            cnpj VARCHAR(18) UNIQUE NOT NULL,
                            email VARCHAR(255),
                            telefone VARCHAR(20),
                            endereco_completo VARCHAR(255),
                            contato_principal VARCHAR(100),
                            status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',

                            FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa) ON DELETE SET NULL
) COMMENT 'Empresas que fornecem produtos.';

-- =================================================================
-- TABELAS DE PRODUTOS E CATEGORIAS
-- =================================================================

-- Tabela de Categorias
CREATE TABLE Categoria (
                           id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nome VARCHAR(100) NOT NULL UNIQUE,
                           descricao TEXT,
                           status ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'ATIVA'
) COMMENT 'Categorias para organizar produtos.';

-- Tabela de Produtos
CREATE TABLE Produto (
                         id_produto BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nome VARCHAR(255) NOT NULL,
                         marca VARCHAR(100),
                         descricao TEXT,
                         id_categoria BIGINT,
                         id_fornecedor BIGINT,

    -- Preços
                         preco_custo DECIMAL(10, 2),
                         preco_venda DECIMAL(10, 2) NOT NULL,

    -- Estoque
                         estoque INT NOT NULL DEFAULT 0,
                         estoque_minimo INT DEFAULT 0,
                         estoque_maximo INT DEFAULT 1000,

    -- Outros dados
                         localizacao_prateleira VARCHAR(100),
                         data_validade DATE,
                         codigo_barras VARCHAR(50),
                         status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',

                         FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE SET NULL,
                         FOREIGN KEY (id_fornecedor) REFERENCES Fornecedor(id_fornecedor) ON DELETE SET NULL
) COMMENT 'Produtos disponíveis para venda.';

-- Tabela de relacionamento Fornecedor-Produto (histórico de compras)
CREATE TABLE Fornece (
                         id_fornecedor BIGINT NOT NULL,
                         id_produto BIGINT NOT NULL,
                         quantidade_recebida INT NOT NULL,
                         valor_de_compra DECIMAL(10, 2) NOT NULL,
                         data_da_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
                         numero_nota_fiscal VARCHAR(50),

                         PRIMARY KEY (id_fornecedor, id_produto, data_da_compra),
                         FOREIGN KEY (id_fornecedor) REFERENCES Fornecedor(id_fornecedor) ON DELETE CASCADE,
                         FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE
) COMMENT 'Histórico de compras de produtos de fornecedores.';

-- =================================================================
-- TABELAS DE PRATELEIRAS E LOCALIZAÇÃO
-- =================================================================

-- Tabela de Prateleiras
CREATE TABLE Prateleira (
                            id_prateleira BIGINT AUTO_INCREMENT PRIMARY KEY,
                            localizacao VARCHAR(255) NOT NULL,
                            id_categoria BIGINT NULL,
                            capacidade_maxima INT DEFAULT 1000,

                            FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE SET NULL
) COMMENT 'Prateleiras físicas do estoque.';

-- Tabela de relacionamento Produto-Prateleira
CREATE TABLE Guardado (
                          id_prateleira BIGINT NOT NULL,
                          id_produto BIGINT NOT NULL,
                          quantidade_em_prateleira INT NOT NULL DEFAULT 0,

                          PRIMARY KEY (id_prateleira, id_produto),
                          FOREIGN KEY (id_prateleira) REFERENCES Prateleira(id_prateleira) ON DELETE CASCADE,
                          FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE
) COMMENT 'Distribuição de produtos nas prateleiras.';

-- =================================================================
-- TABELAS DE VENDAS
-- =================================================================

-- Tabela de Vendas (cabeçalho)
CREATE TABLE Venda (
                       id_venda BIGINT AUTO_INCREMENT PRIMARY KEY,
                       id_cliente BIGINT,
                       id_funcionario BIGINT NOT NULL,
                       data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
                       valor_total DECIMAL(10, 2) NOT NULL,
                       desconto DECIMAL(10, 2) DEFAULT 0.00,
                       valor_final DECIMAL(10, 2) NOT NULL,
                       metodo_pagamento VARCHAR(50),
                       status ENUM('CONCLUIDA', 'CANCELADA') DEFAULT 'CONCLUIDA',
                       observacoes TEXT,

                       FOREIGN KEY (id_cliente) REFERENCES Cliente(id_pessoa) ON DELETE SET NULL,
                       FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE RESTRICT
) COMMENT 'Registro de vendas realizadas.';

-- Tabela de Itens da Venda
CREATE TABLE VendaItem (
                           id_venda_item BIGINT AUTO_INCREMENT PRIMARY KEY,
                           id_venda BIGINT NOT NULL,
                           id_produto BIGINT NOT NULL,
                           quantidade INT NOT NULL,
                           preco_unitario_venda DECIMAL(10, 2) NOT NULL,
                           desconto_item DECIMAL(10, 2) DEFAULT 0.00,
                           subtotal DECIMAL(10, 2) NOT NULL,

                           FOREIGN KEY (id_venda) REFERENCES Venda(id_venda) ON DELETE CASCADE,
                           FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE RESTRICT
) COMMENT 'Itens individuais de cada venda.';

-- =================================================================
-- TABELAS DE MOVIMENTAÇÃO DE ESTOQUE
-- =================================================================

-- Tabela de Movimentações de Estoque
CREATE TABLE MovimentacaoEstoque (
                                     id_movimentacao BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     id_produto BIGINT NOT NULL,
                                     id_usuario BIGINT,
                                     data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                                     tipo ENUM('ENTRADA', 'SAIDA_VENDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'DEVOLUCAO') NOT NULL,
                                     quantidade INT NOT NULL,
                                     estoque_anterior INT NOT NULL,
                                     estoque_atual INT NOT NULL,
                                     observacao TEXT,

                                     FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE,
                                     FOREIGN KEY (id_usuario) REFERENCES Usuario(id_pessoa) ON DELETE SET NULL
) COMMENT 'Log completo de movimentações de estoque.';

-- =================================================================
-- TABELAS DE PROMOÇÕES
-- =================================================================

-- Tabela de Promoções
CREATE TABLE Promocao (
                          id_promocao BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nome VARCHAR(255) NOT NULL,
                          descricao TEXT,
                          percentual_desconto DECIMAL(5, 2) NOT NULL,
                          data_inicio DATE NOT NULL,
                          data_fim DATE NOT NULL,
                          status ENUM('ATIVA', 'INATIVA', 'AGENDADA') NOT NULL DEFAULT 'AGENDADA',

                          CHECK (percentual_desconto > 0 AND percentual_desconto <= 100),
                          CHECK (data_fim >= data_inicio)
) COMMENT 'Promoções aplicáveis a produtos.';

-- Tabela de relacionamento Promoção-Produto
CREATE TABLE PromocaoProduto (
                                 id_promocao BIGINT NOT NULL,
                                 id_produto BIGINT NOT NULL,

                                 PRIMARY KEY (id_promocao, id_produto),
                                 FOREIGN KEY (id_promocao) REFERENCES Promocao(id_promocao) ON DELETE CASCADE,
                                 FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE
) COMMENT 'Define quais produtos participam de cada promoção.';

-- =================================================================
-- ÍNDICES PARA PERFORMANCE
-- =================================================================

CREATE INDEX idx_pessoa_nome ON Pessoa(nome);
CREATE INDEX idx_pessoa_email ON Pessoa(email);
CREATE INDEX idx_cliente_tipo ON Cliente(tipo_pessoa);
CREATE INDEX idx_produto_nome ON Produto(nome);
CREATE INDEX idx_produto_categoria ON Produto(id_categoria);
CREATE INDEX idx_venda_data ON Venda(data_venda);
CREATE INDEX idx_venda_cliente ON Venda(id_cliente);
CREATE INDEX idx_movimentacao_data ON MovimentacaoEstoque(data_movimentacao);

-- =================================================================
-- DADOS INICIAIS PARA TESTE
-- =================================================================

-- Inserir pessoa para o administrador
INSERT INTO Pessoa (nome, email, cidade)
VALUES ('Administrador do Sistema', 'admin@sigma.com', 'Sistema');

-- Inserir funcionário administrador
INSERT INTO Funcionario (id_pessoa, matricula, salario, cargo, setor, data_admissao)
VALUES (1, 'ADM001', 5000.00, 'Administrador de Sistemas', 'TI', CURDATE());

-- Inserir usuário administrador (senha: 'admin' com bcrypt)
INSERT INTO Usuario (id_pessoa, username, password, role)
VALUES (1, 'admin', '$2a$10$88s7f.E.3WLOG8s52iAmGe.Z5c2kSgXwztm2f2.vnbkr8vTR.JE5S', 'ADMIN');

-- Inserir categorias de exemplo
INSERT INTO Categoria (nome, descricao) VALUES
                                            ('Eletrônicos', 'Dispositivos e acessórios eletrônicos.'),
                                            ('Material de Escritório', 'Itens para escritório e papelaria.'),
                                            ('Alimentos', 'Produtos alimentícios diversos.');

-- Inserir fornecedores de exemplo
INSERT INTO Fornecedor (nome_fantasia, razao_social, cnpj, email, telefone) VALUES
                                                                                ('Tech Distribuidora', 'Tech Distribuidora LTDA', '11.222.333/0001-44', 'contato@techdist.com', '(11) 3333-4444'),
                                                                                ('Papelaria Central', 'Central de Suprimentos S.A.', '44.555.666/0001-77', 'vendas@papcentral.com', '(11) 5555-6666');

-- Inserir produtos de exemplo
INSERT INTO Produto (nome, marca, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo) VALUES
                                                                                                                      ('Mouse Sem Fio UltraSlim', 'Logitech', 1, 1, 75.50, 149.90, 50, 10),
                                                                                                                      ('Teclado Mecânico RGB', 'Razer', 1, 1, 220.00, 449.99, 30, 5),
                                                                                                                      ('Pacote 500 Folhas A4', 'Chamex', 2, 2, 18.00, 24.90, 200, 50);

-- Inserir cliente de exemplo
INSERT INTO Pessoa (nome, email, rua, numero, bairro, cidade, cep)
VALUES ('João da Silva', 'joao.silva@email.com', 'Rua das Flores', '123', 'Centro', 'São Paulo', '01234-567');

INSERT INTO Cliente (id_pessoa, tipo_pessoa)
VALUES (2, 'FISICA');

INSERT INTO ClienteFisica (id_pessoa, cpf, data_nascimento)
VALUES (2, '123.456.789-00', '1990-05-15');

INSERT INTO Telefone (id_pessoa, numero, tipo)
VALUES (2, '(11) 98765-4321', 'CELULAR');