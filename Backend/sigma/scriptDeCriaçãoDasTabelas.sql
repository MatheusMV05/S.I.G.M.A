-- Garante que estamos começando do zero para evitar conflitos.
DROP DATABASE IF EXISTS SIGMA;
CREATE DATABASE SIGMA;
USE SIGMA;

-- =================================================================
-- TABELAS CENTRAIS (CORE)
-- =================================================================

-- Tabela para usuários do sistema (funcionários, administradores)
CREATE TABLE Usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL COMMENT 'Nível de acesso do usuário',
    status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO' COMMENT 'Status da conta do usuário',
    email VARCHAR(255) UNIQUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Usuários que podem logar e operar o sistema.';

-- Tabela para categorias de produtos
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Categorias para organizar os produtos.';

-- Tabela para fornecedores de produtos
CREATE TABLE Fornecedor (
    id_fornecedor BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_fantasia VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco_completo VARCHAR(255),
    contato_principal VARCHAR(100)
) COMMENT 'Empresas que fornecem produtos para o estoque.';

-- Tabela de Produtos, completa com todos os campos necessários para o frontend
CREATE TABLE Produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    descricao TEXT,
    quant_em_estoque INT DEFAULT 0,
    valor_unitario DECIMAL(10,2) NOT NULL,
    data_validade DATE,
    id_categoria INT,
    estoque_minimo INT DEFAULT 0,
    estoque_maximo INT DEFAULT 1000,
    preco_custo DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ATIVO',
    codigo_barras VARCHAR(50),
    unidade VARCHAR(20) DEFAULT 'un',
    peso DECIMAL(8,3),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_fornecedor BIGINT,
    localizacao_prateleira VARCHAR(100),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE SET NULL,
    FOREIGN KEY (id_fornecedor) REFERENCES Fornecedor(id_fornecedor) ON DELETE SET NULL
) COMMENT 'O coração do inventário, todos os itens vendáveis.';

-- =================================================================
-- TABELAS DE TRANSAÇÕES E MOVIMENTAÇÕES
-- =================================================================

-- Tabela para clientes (pessoa física ou jurídica)
CREATE TABLE Cliente (
    id_cliente BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    cpf_cnpj VARCHAR(18) UNIQUE,
    tipo_pessoa ENUM('FISICA', 'JURIDICA') NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endereco_completo VARCHAR(255)
) COMMENT 'Clientes que compram os produtos.';

-- Tabela "mestre" de uma Venda (cabeçalho do recibo)
CREATE TABLE Venda (
    id_venda BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente BIGINT,
    id_usuario BIGINT COMMENT 'Funcionário que realizou a venda',
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2) NOT NULL,
    desconto DECIMAL(10, 2) DEFAULT 0.00,
    valor_final DECIMAL(10, 2) NOT NULL,
    metodo_pagamento VARCHAR(50),
    status ENUM('CONCLUIDA', 'CANCELADA') DEFAULT 'CONCLUIDA',

    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE SET NULL
) COMMENT 'Registra cada transação de venda concluída no PDV.';

-- Tabela "detalhe" de uma Venda (os itens do recibo)
CREATE TABLE VendaItem (
    id_venda_item BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_venda BIGINT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario_venda DECIMAL(10, 2) NOT NULL COMMENT 'Preço do produto no momento da venda',

    FOREIGN KEY (id_venda) REFERENCES Venda(id_venda) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto)
) COMMENT 'Cada produto dentro de uma venda.';

-- Tabela para controle de inventário (entradas, saídas, ajustes)
CREATE TABLE MovimentacaoEstoque (
    id_movimentacao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_usuario BIGINT,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('ENTRADA', 'SAIDA_VENDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'DEVOLUCAO') NOT NULL,
    quantidade INT NOT NULL,
    observacao TEXT,

    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE SET NULL
) COMMENT 'Log de toda e qualquer alteração no estoque de um produto.';

-- =================================================================
-- TABELAS ADICIONAIS (PROMOÇÕES, ETC.)
-- =================================================================

-- Tabela para gerenciar promoções
CREATE TABLE Promocao (
    id_promocao BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    percentual_desconto DECIMAL(5, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status ENUM('ATIVA', 'INATIVA', 'AGENDADA') NOT NULL DEFAULT 'AGENDADA'
) COMMENT 'Promoções aplicáveis a produtos ou categorias.';

-- Tabela de ligação para aplicar uma promoção a múltiplos produtos
CREATE TABLE PromocaoProduto (
    id_promocao BIGINT NOT NULL,
    id_produto INT NOT NULL,
    PRIMARY KEY (id_promocao, id_produto),
    FOREIGN KEY (id_promocao) REFERENCES Promocao(id_promocao) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE
) COMMENT 'Define quais produtos participam de qual promoção.';

-- =================================================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- =================================================================

CREATE INDEX idx_produto_nome ON Produto(nome);
CREATE INDEX idx_produto_status ON Produto(status);
CREATE INDEX idx_produto_categoria ON Produto(id_categoria);
CREATE INDEX idx_produto_codigo_barras ON Produto(codigo_barras);
CREATE INDEX idx_produto_marca ON Produto(marca);

-- =================================================================
-- DADOS INICIAIS PARA TESTE
-- =================================================================

-- Insere o usuário administrador padrão
-- ATENÇÃO: A senha hash abaixo é para 'admin'.
INSERT INTO Usuario (nome, username, password, role)
VALUES ('Administrador Padrão', 'admin', '$2a$10$N.zmdr9k7uOIlXdOvpc/6eUJafOWnHKjgY5Y6gKL8C4UKN5Sz1uRm', 'ADMIN');

-- Inserir categorias padrão
INSERT INTO Categoria (nome, descricao) VALUES
('Alimentação', 'Produtos alimentícios em geral'),
('Bebidas', 'Bebidas alcoólicas e não alcoólicas'),
('Higiene', 'Produtos de higiene pessoal e cuidados'),
('Limpeza', 'Produtos de limpeza doméstica e comercial'),
('Diversos', 'Produtos diversos e variados'),
('Eletrônicos', 'Dispositivos e acessórios eletrônicos'),
('Material de Escritório', 'Itens para escritório e papelaria');

-- Insere dados de exemplo para facilitar os testes iniciais
INSERT INTO Fornecedor (nome_fantasia, razao_social, cnpj) VALUES
('Distribuidora Alimentos', 'Distribuidora de Alimentos LTDA', '11.222.333/0001-44'),
('Bebidas & Cia', 'Bebidas e Companhia S.A.', '22.333.444/0001-55'),
('Tech Distribuidora', 'Tech Distribuidora LTDA', '33.444.555/0001-66'),
('Papelaria Central', 'Central de Suprimentos S.A.', '44.555.666/0001-77');

-- Inserir produtos de exemplo com todos os campos necessários
INSERT INTO Produto (nome, marca, descricao, quant_em_estoque, valor_unitario, id_categoria, estoque_minimo, estoque_maximo, preco_custo, status, codigo_barras, unidade, peso, id_fornecedor) VALUES
('Arroz Branco 5kg', 'Tio João', 'Arroz branco tipo 1, pacote de 5kg', 50, 25.90, 1, 10, 100, 18.13, 'ATIVO', '7891234567890', 'un', 5.0, 1),
('Feijão Preto 1kg', 'Camil', 'Feijão preto tipo 1, pacote de 1kg', 30, 8.50, 1, 5, 80, 5.95, 'ATIVO', '7891234567891', 'un', 1.0, 1),
('Coca-Cola 2L', 'Coca-Cola', 'Refrigerante Coca-Cola garrafa 2 litros', 25, 6.90, 2, 10, 50, 4.83, 'ATIVO', '7891234567892', 'un', 2.1, 2),
('Sabonete Dove', 'Dove', 'Sabonete hidratante Dove 90g', 40, 3.50, 3, 15, 100, 2.45, 'ATIVO', '7891234567893', 'un', 0.09, 1),
('Detergente Ypê', 'Ypê', 'Detergente líquido neutro 500ml', 35, 2.80, 4, 10, 70, 1.96, 'ATIVO', '7891234567894', 'un', 0.5, 1),
('Mouse Sem Fio UltraSlim', 'Logitech', 'Mouse óptico sem fio com design ultra slim', 50, 149.90, 6, 10, 100, 75.50, 'ATIVO', '7891234567895', 'un', 0.12, 3),
('Teclado Mecânico RGB', 'Razer', 'Teclado mecânico com iluminação RGB', 30, 449.99, 6, 5, 50, 220.00, 'ATIVO', '7891234567896', 'un', 1.2, 3),
('Pacote 500 Folhas A4', 'Chamex', 'Papel sulfite A4 branco 75g/m²', 200, 24.90, 7, 50, 500, 18.00, 'ATIVO', '7891234567897', 'un', 2.5, 4);

-- Verificações finais
SELECT 'Configuração concluída com sucesso!' as Status;
SELECT COUNT(*) as Total_Produtos FROM Produto;
SELECT COUNT(*) as Total_Categorias FROM Categoria;
SELECT COUNT(*) as Total_Fornecedores FROM Fornecedor;
