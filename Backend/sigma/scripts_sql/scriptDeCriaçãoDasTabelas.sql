-- =================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS SIGMA
-- Versão 2.0 - Revisado
-- Data: 23 de Outubro de 2025
-- =================================================================

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
                             FOREIGN KEY (id_supervisor) REFERENCES Funcionario(id_pessoa) ON DELETE SET NULL,

                             CONSTRAINT chk_funcionario_salario_positivo CHECK (salario > 0)
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
                         credito_disponivel DECIMAL(10, 2) DEFAULT 0.00,
                         observacoes TEXT,

                         FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa) ON DELETE CASCADE,

                         CONSTRAINT chk_cliente_ranking CHECK (ranking BETWEEN 1 AND 5),
                         CONSTRAINT chk_cliente_total_gasto CHECK (total_gasto >= 0),
                         CONSTRAINT chk_cliente_credito CHECK (credito_disponivel >= 0)
) COMMENT 'Clientes que compram produtos.';

-- Tabela para Clientes Pessoa Física
CREATE TABLE ClienteFisico (
                               id_pessoa BIGINT PRIMARY KEY,
                               cpf VARCHAR(14) UNIQUE NOT NULL,
                               data_nascimento DATE,

                               FOREIGN KEY (id_pessoa) REFERENCES Cliente(id_pessoa) ON DELETE CASCADE
) COMMENT 'Dados específicos de clientes pessoa física.';

-- Tabela para Clientes Pessoa Jurídica
CREATE TABLE ClienteJuridico (
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

    -- Endereço detalhado
                            rua VARCHAR(255),
                            numero VARCHAR(20),
                            bairro VARCHAR(100),
                            cidade VARCHAR(100),
                            estado VARCHAR(2),
                            cep VARCHAR(10),

                            contato_principal VARCHAR(100),

    -- Campos de gestão
                            condicoes_pagamento TEXT,
                            prazo_entrega_dias INT,
                            avaliacao DECIMAL(3, 2),

                            status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
                            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                            FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa) ON DELETE SET NULL,

                            CONSTRAINT chk_fornecedor_avaliacao CHECK (avaliacao IS NULL OR (avaliacao >= 0 AND avaliacao <= 5))
) COMMENT 'Empresas que fornecem produtos.';

-- =================================================================
-- TABELAS DE PRODUTOS E CATEGORIAS
-- =================================================================

-- Tabela de Categorias
CREATE TABLE Categoria (
                           id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nome VARCHAR(100) NOT NULL UNIQUE,
                           descricao TEXT,
                           status ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'ATIVA',
                           data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
                         margem_lucro DECIMAL(5, 2),

    -- Estoque
                         estoque INT NOT NULL DEFAULT 0,
                         estoque_minimo INT DEFAULT 0,
                         estoque_maximo INT DEFAULT 1000,

    -- Medidas e características
                         unidade_medida ENUM('UN', 'KG', 'LT', 'CX', 'PC', 'MT') DEFAULT 'UN',
                         peso DECIMAL(10, 3),
                         altura DECIMAL(10, 2),
                         largura DECIMAL(10, 2),
                         profundidade DECIMAL(10, 2),

    -- Localização e identificação
                         localizacao_prateleira VARCHAR(100),
                         codigo_barras VARCHAR(50),
                         codigo_interno VARCHAR(50),
                         ncm VARCHAR(10),

    -- Validade e controle
                         data_validade DATE,
                         lote VARCHAR(50),

    -- Imagens
                         imagem_url VARCHAR(500),

                         status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
                         data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                         FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE SET NULL,
                         FOREIGN KEY (id_fornecedor) REFERENCES Fornecedor(id_fornecedor) ON DELETE SET NULL,

                         CONSTRAINT chk_produto_preco_venda CHECK (preco_venda >= preco_custo OR preco_custo IS NULL),
                         CONSTRAINT chk_produto_estoque_positivo CHECK (estoque >= 0),
                         CONSTRAINT chk_produto_estoque_minimo CHECK (estoque_minimo >= 0)
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
-- TABELAS DE CONTROLE DE CAIXA
-- =================================================================

-- Tabela de Controle de Caixa
CREATE TABLE Caixa (
                       id_caixa BIGINT AUTO_INCREMENT PRIMARY KEY,
                       id_funcionario BIGINT NOT NULL,
                       data_abertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       data_fechamento DATETIME,

    -- Valores iniciais
                       valor_inicial DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    -- Valores finais (preenchidos no fechamento)
                       valor_vendas DECIMAL(10, 2) DEFAULT 0.00,
                       valor_sangrias DECIMAL(10, 2) DEFAULT 0.00,
                       valor_reforcos DECIMAL(10, 2) DEFAULT 0.00,
                       valor_esperado DECIMAL(10, 2),
                       valor_real DECIMAL(10, 2),
                       diferenca DECIMAL(10, 2),

    -- Status
                       status ENUM('ABERTO', 'FECHADO') NOT NULL DEFAULT 'ABERTO',
                       observacoes TEXT,

                       FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE RESTRICT,

                       CONSTRAINT chk_caixa_valor_inicial CHECK (valor_inicial >= 0)
) COMMENT 'Controle de abertura e fechamento de caixa do PDV.';

-- Tabela de Movimentações de Caixa (sangrias e reforços)
CREATE TABLE MovimentacaoCaixa (
                                   id_movimentacao BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   id_caixa BIGINT NOT NULL,
                                   tipo ENUM('SANGRIA', 'REFORCO') NOT NULL,
                                   valor DECIMAL(10, 2) NOT NULL,
                                   motivo TEXT,
                                   data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                                   id_funcionario_autorizador BIGINT,

                                   FOREIGN KEY (id_caixa) REFERENCES Caixa(id_caixa) ON DELETE CASCADE,
                                   FOREIGN KEY (id_funcionario_autorizador) REFERENCES Funcionario(id_pessoa) ON DELETE SET NULL
) COMMENT 'Registro de sangrias e reforços de caixa.';

-- =================================================================
-- TABELAS DE VENDAS
-- =================================================================

-- Tabela de Vendas (cabeçalho)
CREATE TABLE Venda (
                       id_venda BIGINT AUTO_INCREMENT PRIMARY KEY,
                       id_cliente BIGINT,
                       id_funcionario BIGINT NOT NULL,
                       id_caixa BIGINT,
                       data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Valores
                       valor_total DECIMAL(10, 2) NOT NULL,
                       desconto DECIMAL(10, 2) DEFAULT 0.00,
                       valor_final DECIMAL(10, 2) NOT NULL,

    -- Pagamento
                       metodo_pagamento VARCHAR(50),
                       valor_pago DECIMAL(10, 2),
                       troco DECIMAL(10, 2),

    -- Controle
                       status ENUM('CONCLUIDA', 'CANCELADA', 'EM_ANDAMENTO') DEFAULT 'EM_ANDAMENTO',
                       motivo_cancelamento TEXT,
                       observacoes TEXT,

    -- Cupom fiscal
                       numero_cupom_fiscal VARCHAR(50),
                       chave_nfe VARCHAR(44),

                       FOREIGN KEY (id_cliente) REFERENCES Cliente(id_pessoa) ON DELETE SET NULL,
                       FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE RESTRICT,
                       FOREIGN KEY (id_caixa) REFERENCES Caixa(id_caixa) ON DELETE SET NULL,

                       CONSTRAINT chk_venda_valor_final_positivo CHECK (valor_final >= 0),
                       CONSTRAINT chk_venda_desconto CHECK (desconto <= valor_total),
                       CONSTRAINT chk_venda_troco CHECK (troco IS NULL OR troco >= 0)
) COMMENT 'Registro de vendas realizadas.';

-- Tabela de Promoções
CREATE TABLE PROMOCAO (
                          id_promocao BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nome VARCHAR(255) NOT NULL,
                          descricao TEXT,
                          tipo_desconto ENUM('PERCENTUAL', 'FIXO') NOT NULL,
                          valor_desconto DECIMAL(10, 2) NOT NULL,
                          data_inicio DATE NOT NULL,
                          data_fim DATE NOT NULL,
                          status ENUM('ATIVA', 'INATIVA', 'AGENDADA') NOT NULL DEFAULT 'AGENDADA',
                          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT chk_promocao_datas CHECK (data_fim >= data_inicio),
                          CONSTRAINT chk_promocao_desconto_positivo CHECK (valor_desconto > 0)
) COMMENT 'Promoções aplicáveis a produtos.';

-- Tabela de Itens da Venda
CREATE TABLE VendaItem (
                           id_venda_item BIGINT AUTO_INCREMENT PRIMARY KEY,
                           id_venda BIGINT NOT NULL,
                           id_produto BIGINT NOT NULL,
                           id_promocao BIGINT NULL,
                           quantidade INT NOT NULL,
                           preco_unitario_venda DECIMAL(10, 2) NOT NULL,
                           desconto_item DECIMAL(10, 2) DEFAULT 0.00,
                           subtotal DECIMAL(10, 2) NOT NULL,

                           FOREIGN KEY (id_venda) REFERENCES Venda(id_venda) ON DELETE CASCADE,
                           FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE RESTRICT,
                           FOREIGN KEY (id_promocao) REFERENCES PROMOCAO(id_promocao) ON DELETE SET NULL
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
                                     tipo ENUM('IN', 'OUT', 'ADJUSTMENT', 'LOSS', 'RETURN', 'SALE') NOT NULL,
                                     quantidade INT NOT NULL,
                                     estoque_anterior INT NOT NULL,
                                     estoque_atual INT NOT NULL,
                                     observacao TEXT,

                                     FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE,
                                     FOREIGN KEY (id_usuario) REFERENCES Usuario(id_pessoa) ON DELETE SET NULL
) COMMENT 'Log de movimentações: IN=Entrada, OUT=Saída, ADJUSTMENT=Ajuste, LOSS=Perda, RETURN=Devolução, SALE=Venda';

-- =================================================================
-- TABELAS DE PROMOÇÕES
-- =================================================================

-- Tabela de relacionamento Promoção-Produto
CREATE TABLE PROMOCAO_PRODUTO (
                                  id_promocao BIGINT NOT NULL,
                                  id_produto BIGINT NOT NULL,
                                  PRIMARY KEY (id_promocao, id_produto),
                                  FOREIGN KEY (id_promocao) REFERENCES PROMOCAO(id_promocao) ON DELETE CASCADE,
                                  FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE
) COMMENT 'Define quais produtos participam de cada promoção.';

-- =================================================================
-- TABELAS DE METAS E ALERTAS
-- =================================================================

-- Tabela de Metas de Vendas
CREATE TABLE MetaVenda (
                           id_meta BIGINT AUTO_INCREMENT PRIMARY KEY,
                           tipo ENUM('DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL') NOT NULL,
                           periodo_inicio DATE NOT NULL,
                           periodo_fim DATE NOT NULL,

    -- Valores da meta
                           valor_meta DECIMAL(10, 2) NOT NULL,
                           quantidade_vendas_meta INT,
                           ticket_medio_meta DECIMAL(10, 2),

    -- Realizado (atualizado automaticamente)
                           valor_realizado DECIMAL(10, 2) DEFAULT 0.00,
                           quantidade_vendas_realizada INT DEFAULT 0,
                           ticket_medio_realizado DECIMAL(10, 2),
                           percentual_atingido DECIMAL(5, 2),

                           status ENUM('ATIVA', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'ATIVA',
                           observacoes TEXT,
                           data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Metas de vendas para controle de performance.';

-- Tabela de Alertas do Sistema
CREATE TABLE Alerta (
                        id_alerta BIGINT AUTO_INCREMENT PRIMARY KEY,
                        tipo ENUM('ESTOQUE_BAIXO', 'PRODUTO_VENCIDO', 'PRODUTO_VENCENDO',
              'META_ATINGIDA', 'VENDA_CANCELADA', 'CAIXA_ABERTO', 'OUTRO') NOT NULL,
                        prioridade ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL,

                        titulo VARCHAR(255) NOT NULL,
                        mensagem TEXT NOT NULL,

    -- Referências opcionais
                        id_produto BIGINT,
                        id_venda BIGINT,
                        id_funcionario BIGINT,

    -- Controle
                        lido BOOLEAN DEFAULT FALSE,
                        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        data_leitura TIMESTAMP,

                        FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE,
                        FOREIGN KEY (id_venda) REFERENCES Venda(id_venda) ON DELETE CASCADE,
                        FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE CASCADE
) COMMENT 'Sistema de alertas e notificações do sistema.';

-- =================================================================
-- ÍNDICES PARA PERFORMANCE
-- =================================================================

-- Índices para Produto
CREATE INDEX idx_produto_categoria ON Produto(id_categoria);
CREATE INDEX idx_produto_fornecedor ON Produto(id_fornecedor);
CREATE INDEX idx_produto_codigo_barras ON Produto(codigo_barras);
CREATE INDEX idx_produto_status ON Produto(status);
CREATE INDEX idx_produto_nome ON Produto(nome);

-- Índices para Venda
CREATE INDEX idx_venda_cliente ON Venda(id_cliente);
CREATE INDEX idx_venda_funcionario ON Venda(id_funcionario);
CREATE INDEX idx_venda_data ON Venda(data_venda);
CREATE INDEX idx_venda_status ON Venda(status);
CREATE INDEX idx_venda_caixa ON Venda(id_caixa);

-- Índices para VendaItem
CREATE INDEX idx_venda_item_venda ON VendaItem(id_venda);
CREATE INDEX idx_venda_item_produto ON VendaItem(id_produto);

-- Índices para MovimentacaoEstoque
CREATE INDEX idx_movimentacao_produto ON MovimentacaoEstoque(id_produto);
CREATE INDEX idx_movimentacao_data ON MovimentacaoEstoque(data_movimentacao);
CREATE INDEX idx_movimentacao_tipo ON MovimentacaoEstoque(tipo);

-- Índices para Cliente
CREATE INDEX idx_cliente_tipo ON Cliente(tipo_pessoa);
CREATE INDEX idx_cliente_ativo ON Cliente(ativo);
CREATE INDEX idx_cliente_ranking ON Cliente(ranking);

-- Índices para Funcionario
CREATE INDEX idx_funcionario_status ON Funcionario(status);
CREATE INDEX idx_funcionario_setor ON Funcionario(setor);

-- Índices para Promocao
CREATE INDEX idx_promocao_status ON PROMOCAO(status);
CREATE INDEX idx_promocao_datas ON PROMOCAO(data_inicio, data_fim);

-- Índices para Categoria
CREATE INDEX idx_categoria_status ON Categoria(status);

-- Índices para Fornecedor
CREATE INDEX idx_fornecedor_status ON Fornecedor(status);
CREATE INDEX idx_fornecedor_cnpj ON Fornecedor(cnpj);

-- Índices para Caixa
CREATE INDEX idx_caixa_funcionario ON Caixa(id_funcionario);
CREATE INDEX idx_caixa_status ON Caixa(status);
CREATE INDEX idx_caixa_data_abertura ON Caixa(data_abertura);

-- Índices para Alerta
CREATE INDEX idx_alerta_tipo ON Alerta(tipo);
CREATE INDEX idx_alerta_prioridade ON Alerta(prioridade);
CREATE INDEX idx_alerta_lido ON Alerta(lido);
CREATE INDEX idx_alerta_data ON Alerta(data_criacao);

-- =================================================================
-- TRIGGERS PARA AUTOMAÇÃO
-- =================================================================

DELIMITER //

-- Trigger para calcular margem de lucro automaticamente
CREATE TRIGGER trg_produto_calcular_margem
    BEFORE INSERT ON Produto
    FOR EACH ROW
BEGIN
    IF NEW.preco_custo > 0 THEN
        SET NEW.margem_lucro = ((NEW.preco_venda - NEW.preco_custo) / NEW.preco_custo) * 100;
END IF;
END//

CREATE TRIGGER trg_produto_calcular_margem_update
    BEFORE UPDATE ON Produto
    FOR EACH ROW
BEGIN
    IF NEW.preco_custo > 0 THEN
        SET NEW.margem_lucro = ((NEW.preco_venda - NEW.preco_custo) / NEW.preco_custo) * 100;
END IF;
END//

-- Trigger para criar alerta de estoque baixo
CREATE TRIGGER trg_alerta_estoque_baixo
    AFTER UPDATE ON Produto
    FOR EACH ROW
BEGIN
    IF NEW.estoque <= NEW.estoque_minimo AND OLD.estoque > OLD.estoque_minimo THEN
        INSERT INTO Alerta (tipo, prioridade, titulo, mensagem, id_produto)
        VALUES (
            'ESTOQUE_BAIXO', 
            'ALTA',
            CONCAT('Estoque baixo: ', NEW.nome),
            CONCAT('O produto "', NEW.nome, '" está com estoque de ', NEW.estoque, 
                   ' unidades. Estoque mínimo: ', NEW.estoque_minimo, ' unidades.'),
            NEW.id_produto
        );
END IF;
END//

-- Trigger para atualizar total_gasto do cliente
CREATE TRIGGER trg_venda_atualizar_cliente
    AFTER INSERT ON Venda
    FOR EACH ROW
BEGIN
    IF NEW.id_cliente IS NOT NULL AND NEW.status = 'CONCLUIDA' THEN
    UPDATE Cliente
    SET total_gasto = total_gasto + NEW.valor_final,
        data_ultima_compra = DATE(NEW.data_venda)
    WHERE id_pessoa = NEW.id_cliente;
END IF;
END//

-- Trigger para reverter total_gasto quando venda cancelada
CREATE TRIGGER trg_venda_cancelada_atualizar_cliente
    AFTER UPDATE ON Venda
    FOR EACH ROW
BEGIN
    IF OLD.status = 'CONCLUIDA' AND NEW.status = 'CANCELADA' AND NEW.id_cliente IS NOT NULL THEN
    UPDATE Cliente
    SET total_gasto = total_gasto - NEW.valor_final
    WHERE id_pessoa = NEW.id_cliente;
END IF;
END//

-- Trigger para atualizar valores do caixa
CREATE TRIGGER trg_venda_atualizar_caixa
    AFTER INSERT ON Venda
    FOR EACH ROW
BEGIN
    IF NEW.id_caixa IS NOT NULL AND NEW.status = 'CONCLUIDA' THEN
    UPDATE Caixa
    SET valor_vendas = valor_vendas + NEW.valor_final
    WHERE id_caixa = NEW.id_caixa;
END IF;
END//

-- Trigger para atualizar valores em movimentações de caixa
CREATE TRIGGER trg_movimentacao_caixa_atualizar
    AFTER INSERT ON MovimentacaoCaixa
    FOR EACH ROW
BEGIN
    IF NEW.tipo = 'SANGRIA' THEN
    UPDATE Caixa
    SET valor_sangrias = valor_sangrias + NEW.valor
    WHERE id_caixa = NEW.id_caixa;
    ELSEIF NEW.tipo = 'REFORCO' THEN
    UPDATE Caixa
    SET valor_reforcos = valor_reforcos + NEW.valor
    WHERE id_caixa = NEW.id_caixa;
END IF;
END//

DELIMITER ;

-- =================================================================
-- VIEWS ÚTEIS
-- =================================================================

-- View de produtos com estoque baixo
CREATE OR REPLACE VIEW vw_produtos_estoque_baixo AS
SELECT
    p.id_produto,
    p.nome,
    p.marca,
    c.nome as categoria,
    p.estoque,
    p.estoque_minimo,
    (p.estoque_minimo - p.estoque) as deficit,
    p.preco_custo,
    ((p.estoque_minimo - p.estoque) * p.preco_custo) as valor_reposicao_necessaria,
    f.nome_fantasia as fornecedor,
    f.telefone as telefone_fornecedor
FROM Produto p
         LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
         LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
WHERE p.estoque <= p.estoque_minimo
  AND p.status = 'ATIVO'
ORDER BY deficit DESC;

-- View de vendas diárias
CREATE OR REPLACE VIEW vw_vendas_diarias AS
SELECT
    DATE(v.data_venda) as data,
    COUNT(v.id_venda) as quantidade_vendas,
    SUM(v.valor_total) as valor_total,
    SUM(v.desconto) as desconto_total,
    SUM(v.valor_final) as faturamento,
    AVG(v.valor_final) as ticket_medio
FROM Venda v
WHERE v.status = 'CONCLUIDA'
GROUP BY DATE(v.data_venda)
ORDER BY data DESC;
