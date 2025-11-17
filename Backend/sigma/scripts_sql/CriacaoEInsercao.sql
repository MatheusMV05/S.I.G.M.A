-- ==================================================================
-- CRIAÇÃO DO BANCO DE DADOS SIGMA
-- ==================================================================

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
                             cpf VARCHAR(14) UNIQUE NULL COMMENT 'CPF do funcionário',
                             matricula VARCHAR(20) UNIQUE NOT NULL,
                             salario DECIMAL(10, 2) NOT NULL,
                             cargo VARCHAR(100),
                             setor VARCHAR(100),
                             id_supervisor BIGINT NULL,
                             status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
                             data_admissao DATE,
                             turno ENUM('MANHA', 'TARDE', 'NOITE', 'INTEGRAL') DEFAULT 'INTEGRAL',
                             tipo_contrato ENUM('CLT', 'PJ', 'ESTAGIO', 'TEMPORARIO', 'AUTONOMO') DEFAULT 'CLT',
                             carga_horaria_semanal INT DEFAULT 40,
                             data_desligamento DATE NULL,
                             motivo_desligamento TEXT NULL,
                             beneficios TEXT NULL,
                             observacoes TEXT NULL,
                             foto_url VARCHAR(500) NULL,
                             data_ultima_promocao DATE NULL,
                             comissao_percentual DECIMAL(5,2) DEFAULT 0.00,
                             meta_mensal DECIMAL(10,2) DEFAULT 0.00,

                             FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa) ON DELETE CASCADE,
                             FOREIGN KEY (id_supervisor) REFERENCES Funcionario(id_pessoa) ON DELETE SET NULL,

                             CONSTRAINT chk_funcionario_salario_positivo CHECK (salario > 0),
                             CONSTRAINT chk_carga_horaria CHECK (carga_horaria_semanal BETWEEN 1 AND 60),
                             CONSTRAINT chk_comissao CHECK (comissao_percentual BETWEEN 0 AND 100),
                             CONSTRAINT chk_meta CHECK (meta_mensal >= 0),
                             
                             INDEX idx_funcionario_status (status),
                             INDEX idx_funcionario_setor (setor),
                             INDEX idx_funcionario_cargo (cargo),
                             INDEX idx_funcionario_matricula (matricula),
                             INDEX idx_funcionario_supervisor (id_supervisor)
) COMMENT 'Funcionários da empresa com informações completas de RH.';

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
-- TABELAS DE GESTÃO DE RH - FUNCIONÁRIOS
-- =================================================================

-- Tabela de Histórico de Cargos e Salários
CREATE TABLE HistoricoFuncionario (
    id_historico BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_funcionario BIGINT NOT NULL,
    tipo_evento ENUM('ADMISSAO', 'PROMOCAO', 'AUMENTO_SALARIAL', 'MUDANCA_CARGO', 'MUDANCA_SETOR', 'DESLIGAMENTO', 'FERIAS', 'AFASTAMENTO') NOT NULL,
    data_evento DATE NOT NULL,
    cargo_anterior VARCHAR(100),
    cargo_novo VARCHAR(100),
    setor_anterior VARCHAR(100),
    setor_novo VARCHAR(100),
    salario_anterior DECIMAL(10,2),
    salario_novo DECIMAL(10,2),
    descricao TEXT,
    realizado_por BIGINT COMMENT 'ID do usuário que realizou a ação',
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE CASCADE,
    FOREIGN KEY (realizado_por) REFERENCES Usuario(id_pessoa) ON DELETE SET NULL,
    
    INDEX idx_historico_funcionario (id_funcionario),
    INDEX idx_historico_tipo (tipo_evento),
    INDEX idx_historico_data (data_evento)
) COMMENT 'Histórico de alterações e eventos importantes dos funcionários';

-- Tabela de Documentos dos Funcionários
CREATE TABLE DocumentoFuncionario (
    id_documento BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_funcionario BIGINT NOT NULL,
    tipo_documento ENUM('RG', 'CPF', 'CNH', 'CTPS', 'TITULO_ELEITOR', 'CERTIFICADO', 'CONTRATO', 'EXAME_ADMISSIONAL', 'OUTRO') NOT NULL,
    numero_documento VARCHAR(100),
    arquivo_url VARCHAR(500),
    data_emissao DATE,
    data_validade DATE,
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE CASCADE,
    
    INDEX idx_documento_funcionario (id_funcionario),
    INDEX idx_documento_tipo (tipo_documento),
    INDEX idx_documento_validade (data_validade)
) COMMENT 'Documentos dos funcionários';

-- Tabela de Férias
CREATE TABLE FeriasFuncionario (
    id_ferias BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_funcionario BIGINT NOT NULL,
    periodo_aquisitivo_inicio DATE NOT NULL,
    periodo_aquisitivo_fim DATE NOT NULL,
    data_inicio_ferias DATE NOT NULL,
    data_fim_ferias DATE NOT NULL,
    dias_gozados INT NOT NULL,
    abono_pecuniario BOOLEAN DEFAULT FALSE COMMENT 'Vendeu 1/3 das férias',
    status_ferias ENUM('PROGRAMADAS', 'EM_ANDAMENTO', 'CONCLUIDAS', 'CANCELADAS') DEFAULT 'PROGRAMADAS',
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE CASCADE,
    
    CONSTRAINT chk_dias_ferias CHECK (dias_gozados BETWEEN 1 AND 30),
    
    INDEX idx_ferias_funcionario (id_funcionario),
    INDEX idx_ferias_status (status_ferias),
    INDEX idx_ferias_periodo (data_inicio_ferias, data_fim_ferias)
) COMMENT 'Controle de férias dos funcionários';

-- Tabela de Ponto Eletrônico
CREATE TABLE PontoEletronico (
    id_ponto BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_funcionario BIGINT NOT NULL,
    data_ponto DATE NOT NULL,
    hora_entrada TIME,
    hora_saida_almoco TIME,
    hora_retorno_almoco TIME,
    hora_saida TIME,
    horas_trabalhadas DECIMAL(5,2) COMMENT 'Total de horas trabalhadas no dia',
    horas_extras DECIMAL(5,2) DEFAULT 0.00,
    observacoes TEXT,
    status_ponto ENUM('NORMAL', 'FALTA', 'ATESTADO', 'FERIAS', 'FOLGA') DEFAULT 'NORMAL',
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_pessoa) ON DELETE CASCADE,
    
    UNIQUE KEY unique_ponto_dia (id_funcionario, data_ponto),
    INDEX idx_ponto_funcionario (id_funcionario),
    INDEX idx_ponto_data (data_ponto)
) COMMENT 'Registro de ponto eletrônico dos funcionários';

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
                         quantidade_compras INT NOT NULL DEFAULT 0,
                         credito_disponivel DECIMAL(10, 2) DEFAULT 0.00,
                         observacoes TEXT,

                         FOREIGN KEY (id_pessoa) REFERENCES Pessoa(id_pessoa) ON DELETE CASCADE,

                         CONSTRAINT chk_cliente_ranking CHECK (ranking BETWEEN 1 AND 5),
                         CONSTRAINT chk_cliente_total_gasto CHECK (total_gasto >= 0),
                         CONSTRAINT chk_cliente_credito CHECK (credito_disponivel >= 0),
                         CONSTRAINT chk_cliente_quantidade_compras CHECK (quantidade_compras >= 0)
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

-- Índices para busca de clientes por documento (CPF/CNPJ)
CREATE INDEX idx_cliente_fisico_cpf ON ClienteFisico(cpf);
CREATE INDEX idx_cliente_juridico_cnpj ON ClienteJuridico(cnpj);

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

-- TABELA DE AUDITORIA

DROP TABLE IF EXISTS AuditoriaLog;
CREATE TABLE AuditoriaLog (
    id_log BIGINT AUTO_INCREMENT PRIMARY KEY,
    tabela_afetada VARCHAR(50) NOT NULL,
    operacao ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    id_registro BIGINT,
    id_usuario BIGINT,
    dados_antigos TEXT,
    dados_novos TEXT,
    ip_origem VARCHAR(45),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descricao VARCHAR(500),
    
    INDEX idx_tabela_operacao (tabela_afetada, operacao),
    INDEX idx_data_hora (data_hora),
    INDEX idx_id_registro (id_registro),
    
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_pessoa) ON DELETE SET NULL
) COMMENT 'Log de auditoria para rastreamento de alterações no banco de dados';



-- ==================================================================
-- Script de Inserção
-- =================================================================

USE SIGMA;

-- Desabilitar checagens temporariamente para inserção
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- =================================================================
-- 1. PESSOAS (100 registros)
-- Base para Funcionários (35) + Clientes PF (40) + Clientes PJ (25)
-- =================================================================

-- Pessoas que serão Funcionários (IDs 1-35)
INSERT INTO Pessoa (id_pessoa, nome, email, rua, numero, bairro, cidade, cep) VALUES
(1, 'João Pedro Silva', 'joao.silva@sigma.com', 'Rua das Flores', '123', 'Centro', 'São Paulo', '01310-100'),
(2, 'Maria Santos', 'maria.santos@sigma.com', 'Av. Paulista', '1500', 'Bela Vista', 'São Paulo', '01310-200'),
(3, 'Carlos Oliveira', 'carlos.oliveira@sigma.com', 'Rua Augusta', '789', 'Consolação', 'São Paulo', '01305-100'),
(4, 'Ana Paula Costa', 'ana.costa@sigma.com', 'Rua Oscar Freire', '456', 'Jardins', 'São Paulo', '01426-001'),
(5, 'Pedro Henrique Lima', 'pedro.lima@sigma.com', 'Rua Haddock Lobo', '321', 'Cerqueira César', 'São Paulo', '01414-001'),
(6, 'Juliana Ferreira', 'juliana.ferreira@sigma.com', 'Rua Teodoro Sampaio', '654', 'Pinheiros', 'São Paulo', '05405-000'),
(7, 'Roberto Alves', 'roberto.alves@sigma.com', 'Rua da Consolação', '987', 'Consolação', 'São Paulo', '01301-000'),
(8, 'Fernanda Rodrigues', 'fernanda.rodrigues@sigma.com', 'Av. Faria Lima', '2000', 'Itaim Bibi', 'São Paulo', '01452-000'),
(9, 'Lucas Martins', 'lucas.martins@sigma.com', 'Rua Estados Unidos', '1500', 'Jardins', 'São Paulo', '01427-001'),
(10, 'Patricia Souza', 'patricia.souza@sigma.com', 'Rua Bela Cintra', '800', 'Consolação', 'São Paulo', '01415-000'),
(11, 'Rodrigo Mendes', 'rodrigo.mendes@sigma.com', 'Av. Rebouças', '2500', 'Pinheiros', 'São Paulo', '05402-100'),
(12, 'Carla Dias', 'carla.dias@sigma.com', 'Rua Frei Caneca', '890', 'Consolação', 'São Paulo', '01307-002'),
(13, 'Marcelo Pereira', 'marcelo.pereira@sigma.com', 'Alameda Santos', '2100', 'Jardins', 'São Paulo', '01419-002'),
(14, 'Renata Silva', 'renata.silva@sigma.com', 'Rua Augusta', '3000', 'Consolação', 'São Paulo', '01412-001'),
(15, 'Thiago Costa', 'thiago.costa@sigma.com', 'Av. Angélica', '2000', 'Santa Cecília', 'São Paulo', '01227-300'),
(16, 'Vanessa Lima', 'vanessa.lima@sigma.com', 'Rua Pamplona', '700', 'Jardins', 'São Paulo', '01405-001'),
(17, 'André Santos', 'andre.santos@sigma.com', 'Av. Brigadeiro', '3000', 'Bela Vista', 'São Paulo', '01402-001'),
(18, 'Silvia Rocha', 'silvia.rocha@sigma.com', 'Rua Barão de Capanema', '200', 'Cerqueira César', 'São Paulo', '01411-020'),
(19, 'Eduardo Alves', 'eduardo.alves@sigma.com', 'Rua Bela Cintra', '2000', 'Consolação', 'São Paulo', '01415-003'),
(20, 'Mônica Ferreira', 'monica.ferreira@sigma.com', 'Rua Estados Unidos', '3000', 'Jardins', 'São Paulo', '01427-003'),
(21, 'Paulo Henrique', 'paulo.henrique@sigma.com', 'Rua da Consolação', '1500', 'Consolação', 'São Paulo', '01302-002'),
(22, 'Daniela Martins', 'daniela.martins@sigma.com', 'Av. Paulista', '3500', 'Bela Vista', 'São Paulo', '01310-400'),
(23, 'Fábio Rodrigues', 'fabio.rodrigues@sigma.com', 'Rua Oscar Freire', '1200', 'Jardins', 'São Paulo', '01426-002'),
(24, 'Cristina Souza', 'cristina.souza@sigma.com', 'Rua Haddock Lobo', '900', 'Cerqueira César', 'São Paulo', '01414-003'),
(25, 'Márcio Oliveira', 'marcio.oliveira@sigma.com', 'Rua Augusta', '4000', 'Consolação', 'São Paulo', '01412-002'),
(26, 'Adriana Costa', 'adriana.costa@sigma.com', 'Av. Faria Lima', '4000', 'Itaim Bibi', 'São Paulo', '01452-001'),
(27, 'Bruno Silva', 'bruno.silva@sigma.com', 'Rua Teodoro Sampaio', '1000', 'Pinheiros', 'São Paulo', '05405-001'),
(28, 'Tatiana Lima', 'tatiana.lima@sigma.com', 'Av. Rebouças', '4000', 'Pinheiros', 'São Paulo', '05402-200'),
(29, 'Vitor Pereira', 'vitor.pereira@sigma.com', 'Rua Frei Caneca', '1200', 'Consolação', 'São Paulo', '01307-003'),
(30, 'Camila Dias', 'camila.dias@sigma.com', 'Alameda Santos', '3000', 'Jardins', 'São Paulo', '01419-003'),
(31, 'Leonardo Mendes', 'leonardo.mendes@sigma.com', 'Rua Pamplona', '900', 'Jardins', 'São Paulo', '01405-002'),
(32, 'Aline Ferreira', 'aline.ferreira@sigma.com', 'Av. Angélica', '3000', 'Santa Cecília', 'São Paulo', '01227-400'),
(33, 'Rafael Costa', 'rafael.costa@sigma.com', 'Rua Barão de Capanema', '300', 'Cerqueira César', 'São Paulo', '01411-030'),
(34, 'Priscila Santos', 'priscila.santos@sigma.com', 'Rua Bela Cintra', '3000', 'Consolação', 'São Paulo', '01415-004'),
(35, 'Guilherme Alves', 'guilherme.alves@sigma.com', 'Rua Estados Unidos', '4000', 'Jardins', 'São Paulo', '01427-004');

-- Pessoas que serão Clientes Pessoa Física (IDs 36-75 = 40 clientes PF)
INSERT INTO Pessoa (id_pessoa, nome, email, rua, numero, bairro, cidade, cep) VALUES
(36, 'Ricardo Mendes', 'ricardo.mendes@email.com', 'Rua das Palmeiras', '234', 'Santa Cecília', 'São Paulo', '01246-000'),
(37, 'Camila Rocha', 'camila.rocha@email.com', 'Av. Rebouças', '3000', 'Pinheiros', 'São Paulo', '05402-000'),
(38, 'Felipe Santos', 'felipe.santos@email.com', 'Rua Frei Caneca', '569', 'Consolação', 'São Paulo', '01307-001'),
(39, 'Mariana Lima', 'mariana.lima@email.com', 'Alameda Santos', '1000', 'Jardins', 'São Paulo', '01419-001'),
(40, 'Bruno Costa', 'bruno.costa2@email.com', 'Rua Augusta', '2000', 'Consolação', 'São Paulo', '01412-000'),
(41, 'Gabriela Ferreira', 'gabriela.ferreira@email.com', 'Av. Angélica', '1500', 'Santa Cecília', 'São Paulo', '01227-200'),
(42, 'Thiago Oliveira', 'thiago.oliveira2@email.com', 'Rua Oscar Freire', '900', 'Jardins', 'São Paulo', '01426-001'),
(43, 'Amanda Silva', 'amanda.silva@email.com', 'Rua Haddock Lobo', '700', 'Cerqueira César', 'São Paulo', '01414-002'),
(44, 'Rafael Souza', 'rafael.souza2@email.com', 'Av. Paulista', '2500', 'Bela Vista', 'São Paulo', '01310-300'),
(45, 'Beatriz Alves', 'beatriz.alves@email.com', 'Rua da Consolação', '1200', 'Consolação', 'São Paulo', '01302-001'),
(46, 'Gustavo Martins', 'gustavo.martins@email.com', 'Rua Pamplona', '500', 'Jardins', 'São Paulo', '01405-000'),
(47, 'Larissa Rodrigues', 'larissa.rodrigues@email.com', 'Av. Brigadeiro Luis Antonio', '2000', 'Bela Vista', 'São Paulo', '01402-000'),
(48, 'Vinícius Costa', 'vinicius.costa@email.com', 'Rua Barão de Capanema', '100', 'Cerqueira César', 'São Paulo', '01411-010'),
(49, 'Carolina Santos', 'carolina.santos@email.com', 'Rua Bela Cintra', '1500', 'Consolação', 'São Paulo', '01415-002'),
(50, 'Daniel Lima', 'daniel.lima@email.com', 'Rua Estados Unidos', '2000', 'Jardins', 'São Paulo', '01427-002'),
(51, 'Isabela Pereira', 'isabela.pereira@email.com', 'Av. Faria Lima', '5000', 'Itaim Bibi', 'São Paulo', '01452-002'),
(52, 'Henrique Dias', 'henrique.dias@email.com', 'Rua Teodoro Sampaio', '2000', 'Pinheiros', 'São Paulo', '05405-002'),
(53, 'Natália Rocha', 'natalia.rocha@email.com', 'Av. Rebouças', '5000', 'Pinheiros', 'São Paulo', '05402-300'),
(54, 'Diego Silva', 'diego.silva@email.com', 'Rua Frei Caneca', '2000', 'Consolação', 'São Paulo', '01307-004'),
(55, 'Letícia Costa', 'leticia.costa@email.com', 'Alameda Santos', '4000', 'Jardins', 'São Paulo', '01419-004'),
(56, 'Fernando Alves', 'fernando.alves@email.com', 'Rua Augusta', '5000', 'Consolação', 'São Paulo', '01412-003'),
(57, 'Bruna Santos', 'bruna.santos@email.com', 'Av. Angélica', '4000', 'Santa Cecília', 'São Paulo', '01227-500'),
(58, 'Mateus Lima', 'mateus.lima@email.com', 'Rua Oscar Freire', '1500', 'Jardins', 'São Paulo', '01426-003'),
(59, 'Julia Ferreira', 'julia.ferreira@email.com', 'Rua Haddock Lobo', '1200', 'Cerqueira César', 'São Paulo', '01414-004'),
(60, 'Caio Mendes', 'caio.mendes@email.com', 'Av. Paulista', '4000', 'Bela Vista', 'São Paulo', '01310-500'),
(61, 'Lívia Rodrigues', 'livia.rodrigues@email.com', 'Rua da Consolação', '2000', 'Consolação', 'São Paulo', '01302-003'),
(62, 'André Martins', 'andre.martins2@email.com', 'Rua Pamplona', '1200', 'Jardins', 'São Paulo', '01405-003'),
(63, 'Bianca Costa', 'bianca.costa@email.com', 'Av. Brigadeiro', '4000', 'Bela Vista', 'São Paulo', '01402-002'),
(64, 'Marcelo Souza', 'marcelo.souza@email.com', 'Rua Barão de Capanema', '400', 'Cerqueira César', 'São Paulo', '01411-040'),
(65, 'Renata Lima', 'renata.lima@email.com', 'Rua Bela Cintra', '4000', 'Consolação', 'São Paulo', '01415-005'),
(66, 'Paulo Silva', 'paulo.silva@email.com', 'Rua Estados Unidos', '5000', 'Jardins', 'São Paulo', '01427-005'),
(67, 'Vanessa Santos', 'vanessa.santos@email.com', 'Av. Faria Lima', '6000', 'Itaim Bibi', 'São Paulo', '01452-003'),
(68, 'Roberto Costa', 'roberto.costa@email.com', 'Rua Teodoro Sampaio', '3000', 'Pinheiros', 'São Paulo', '05405-003'),
(69, 'Patrícia Oliveira', 'patricia.oliveira@email.com', 'Av. Rebouças', '6000', 'Pinheiros', 'São Paulo', '05402-400'),
(70, 'Anderson Lima', 'anderson.lima@email.com', 'Rua Frei Caneca', '3000', 'Consolação', 'São Paulo', '01307-005'),
(71, 'Fernanda Dias', 'fernanda.dias@email.com', 'Alameda Santos', '5000', 'Jardins', 'São Paulo', '01419-005'),
(72, 'Marcos Pereira', 'marcos.pereira@email.com', 'Rua Augusta', '6000', 'Consolação', 'São Paulo', '01412-004'),
(73, 'Adriana Rocha', 'adriana.rocha@email.com', 'Av. Angélica', '5000', 'Santa Cecília', 'São Paulo', '01227-600'),
(74, 'Fábio Lima', 'fabio.lima@email.com', 'Rua Oscar Freire', '2000', 'Jardins', 'São Paulo', '01426-004'),
(75, 'Cristiane Souza', 'cristiane.souza@email.com', 'Rua Haddock Lobo', '1500', 'Cerqueira César', 'São Paulo', '01414-005');

-- Pessoas que serão Clientes Pessoa Jurídica (IDs 76-100 = 25 clientes PJ)
INSERT INTO Pessoa (id_pessoa, nome, email, rua, numero, bairro, cidade, cep) VALUES
(76, 'Tech Solutions LTDA', 'contato@techsolutions.com', 'Av. Paulista', '5000', 'Bela Vista', 'São Paulo', '01310-900'),
(77, 'Comercial Alvorada', 'vendas@alvorada.com', 'Rua Frei Caneca', '1000', 'Consolação', 'São Paulo', '01307-020'),
(78, 'Distribuidora São Jorge', 'compras@sgjorge.com', 'Av. Brigadeiro', '5000', 'Bela Vista', 'São Paulo', '01402-010'),
(79, 'Supermercado Bom Preço', 'comercial@bompreco.com', 'Rua Augusta', '7000', 'Consolação', 'São Paulo', '01412-100'),
(80, 'Restaurante Sabor & Arte', 'pedidos@saborarte.com', 'Rua Oscar Freire', '2500', 'Jardins', 'São Paulo', '01426-100'),
(81, 'Indústrias Reunidas XYZ', 'compras@xyz.ind.br', 'Av. Faria Lima', '7000', 'Itaim Bibi', 'São Paulo', '01452-100'),
(82, 'Papelaria Moderna', 'vendas@papmoderna.com', 'Rua Haddock Lobo', '2000', 'Cerqueira César', 'São Paulo', '01414-100'),
(83, 'Farmácia Saúde Total', 'comercial@saudetotal.com', 'Av. Rebouças', '7000', 'Pinheiros', 'São Paulo', '05402-900'),
(84, 'Construtora Horizonte', 'materiais@horizonte.com', 'Rua Teodoro Sampaio', '4000', 'Pinheiros', 'São Paulo', '05405-100'),
(85, 'Hotel Vista Alegre', 'suprimentos@vistaalegre.com', 'Alameda Santos', '6000', 'Jardins', 'São Paulo', '01419-100'),
(86, 'Clínica Med Center', 'compras@medcenter.com', 'Av. Angélica', '6000', 'Santa Cecília', 'São Paulo', '01227-900'),
(87, 'Escola Futuro Brilhante', 'administrativo@futurobrilhante.edu', 'Rua Pamplona', '1500', 'Jardins', 'São Paulo', '01405-100'),
(88, 'Academia Corpo & Mente', 'contato@corpoeamente.com', 'Rua Bela Cintra', '5000', 'Consolação', 'São Paulo', '01415-100'),
(89, 'Livraria Cultura & Arte', 'vendas@culturaearte.com', 'Rua Estados Unidos', '6000', 'Jardins', 'São Paulo', '01427-100'),
(90, 'Buffet Eventos Especiais', 'eventos@buffetespecial.com', 'Av. Brigadeiro', '6000', 'Bela Vista', 'São Paulo', '01402-020'),
(91, 'Pet Shop Amigo Fiel', 'vendas@amigofiel.com', 'Rua Augusta', '8000', 'Consolação', 'São Paulo', '01412-200'),
(92, 'Salão Beleza Pura', 'agendamento@belezapura.com', 'Rua Oscar Freire', '3000', 'Jardins', 'São Paulo', '01426-200'),
(93, 'Consultoria Empresarial ABC', 'contato@consultabc.com', 'Av. Faria Lima', '8000', 'Itaim Bibi', 'São Paulo', '01452-200'),
(94, 'Padaria Pão Nosso', 'vendas@paonosso.com', 'Rua Frei Caneca', '4000', 'Consolação', 'São Paulo', '01307-100'),
(95, 'Autopeças Rápido', 'vendas@autopecasrapido.com', 'Av. Rebouças', '8000', 'Pinheiros', 'São Paulo', '05402-950'),
(96, 'Floricultura Jardim Encantado', 'vendas@jardimencantado.com', 'Rua Teodoro Sampaio', '5000', 'Pinheiros', 'São Paulo', '05405-200'),
(97, 'Agência de Turismo Mundo Afora', 'contato@mundoafora.tur', 'Alameda Santos', '7000', 'Jardins', 'São Paulo', '01419-200'),
(98, 'Imobiliária Lar Perfeito', 'vendas@larperfeito.com', 'Av. Paulista', '6000', 'Bela Vista', 'São Paulo', '01310-950'),
(99, 'Gráfica Impressão Digital', 'orcamento@impdigital.com', 'Rua Bela Cintra', '6000', 'Consolação', 'São Paulo', '01415-200'),
(100, 'Lavanderia Clean Express', 'atendimento@cleanexpress.com', 'Av. Angélica', '7000', 'Santa Cecília', 'São Paulo', '01227-950');

-- =================================================================
-- 2. TELEFONES (170 registros - 2 para funcionários, 1 para clientes)
-- =================================================================

-- Telefones dos Funcionários (70 registros - 2 por funcionário)
INSERT INTO Telefone (id_pessoa, numero, tipo) VALUES
(1, '(11) 98765-4321', 'CELULAR'),
(1, '(11) 3456-7890', 'COMERCIAL'),
(2, '(11) 99876-5432', 'CELULAR'),
(2, '(11) 3567-8901', 'RESIDENCIAL'),
(3, '(11) 98123-4567', 'CELULAR'),
(3, '(11) 3678-9012', 'COMERCIAL'),
(4, '(11) 97234-5678', 'CELULAR'),
(4, '(11) 3789-0123', 'RESIDENCIAL'),
(5, '(11) 96345-6789', 'CELULAR'),
(5, '(11) 3890-1234', 'COMERCIAL'),
(6, '(11) 95456-7890', 'CELULAR'),
(6, '(11) 3901-2345', 'RESIDENCIAL'),
(7, '(11) 94567-8901', 'CELULAR'),
(7, '(11) 3012-3456', 'COMERCIAL'),
(8, '(11) 93678-9012', 'CELULAR'),
(8, '(11) 3123-4567', 'RESIDENCIAL'),
(9, '(11) 92789-0123', 'CELULAR'),
(9, '(11) 3234-5678', 'COMERCIAL'),
(10, '(11) 91890-1234', 'CELULAR'),
(10, '(11) 3345-6789', 'RESIDENCIAL'),
(11, '(11) 90901-2345', 'CELULAR'),
(11, '(11) 3456-7891', 'COMERCIAL'),
(12, '(11) 89012-3456', 'CELULAR'),
(12, '(11) 3567-8902', 'RESIDENCIAL'),
(13, '(11) 88123-4567', 'CELULAR'),
(13, '(11) 3678-9013', 'COMERCIAL'),
(14, '(11) 87234-5678', 'CELULAR'),
(14, '(11) 3789-0124', 'RESIDENCIAL'),
(15, '(11) 86345-6789', 'CELULAR'),
(15, '(11) 3890-1235', 'COMERCIAL'),
(16, '(11) 85456-7890', 'CELULAR'),
(16, '(11) 3901-2346', 'RESIDENCIAL'),
(17, '(11) 84567-8901', 'CELULAR'),
(17, '(11) 3012-3457', 'COMERCIAL'),
(18, '(11) 83678-9012', 'CELULAR'),
(18, '(11) 3123-4568', 'RESIDENCIAL'),
(19, '(11) 82789-0123', 'CELULAR'),
(19, '(11) 3234-5679', 'COMERCIAL'),
(20, '(11) 81890-1234', 'CELULAR'),
(20, '(11) 3345-6780', 'RESIDENCIAL'),
(21, '(11) 80901-2345', 'CELULAR'),
(21, '(11) 3456-7892', 'COMERCIAL'),
(22, '(11) 79012-3456', 'CELULAR'),
(22, '(11) 3567-8903', 'RESIDENCIAL'),
(23, '(11) 78123-4567', 'CELULAR'),
(23, '(11) 3678-9014', 'COMERCIAL'),
(24, '(11) 77234-5678', 'CELULAR'),
(24, '(11) 3789-0125', 'RESIDENCIAL'),
(25, '(11) 76345-6789', 'CELULAR'),
(25, '(11) 3890-1236', 'COMERCIAL'),
(26, '(11) 75456-7890', 'CELULAR'),
(26, '(11) 3901-2347', 'RESIDENCIAL'),
(27, '(11) 74567-8901', 'CELULAR'),
(27, '(11) 3012-3458', 'COMERCIAL'),
(28, '(11) 73678-9012', 'CELULAR'),
(28, '(11) 3123-4569', 'RESIDENCIAL'),
(29, '(11) 72789-0123', 'CELULAR'),
(29, '(11) 3234-5670', 'COMERCIAL'),
(30, '(11) 71890-1234', 'CELULAR'),
(30, '(11) 3345-6781', 'RESIDENCIAL'),
(31, '(11) 70901-2345', 'CELULAR'),
(31, '(11) 3456-7893', 'COMERCIAL'),
(32, '(11) 69012-3456', 'CELULAR'),
(32, '(11) 3567-8904', 'RESIDENCIAL'),
(33, '(11) 68123-4567', 'CELULAR'),
(33, '(11) 3678-9015', 'COMERCIAL'),
(34, '(11) 67234-5678', 'CELULAR'),
(34, '(11) 3789-0126', 'RESIDENCIAL'),
(35, '(11) 66345-6789', 'CELULAR'),
(35, '(11) 3890-1237', 'COMERCIAL');

-- Telefones dos Clientes PF (40 registros)
INSERT INTO Telefone (id_pessoa, numero, tipo) VALUES
(36, '(11) 99111-2222', 'CELULAR'),
(37, '(11) 99222-3333', 'CELULAR'),
(38, '(11) 99333-4444', 'CELULAR'),
(39, '(11) 99444-5555', 'CELULAR'),
(40, '(11) 99555-6666', 'CELULAR'),
(41, '(11) 99666-7777', 'CELULAR'),
(42, '(11) 99777-8888', 'CELULAR'),
(43, '(11) 99888-9999', 'CELULAR'),
(44, '(11) 99999-1111', 'CELULAR'),
(45, '(11) 98888-2222', 'CELULAR'),
(46, '(11) 98777-3333', 'CELULAR'),
(47, '(11) 98666-4444', 'CELULAR'),
(48, '(11) 98555-5555', 'CELULAR'),
(49, '(11) 98444-6666', 'CELULAR'),
(50, '(11) 98333-7777', 'CELULAR'),
(51, '(11) 98222-8888', 'CELULAR'),
(52, '(11) 98111-9999', 'CELULAR'),
(53, '(11) 97999-1111', 'CELULAR'),
(54, '(11) 97888-2222', 'CELULAR'),
(55, '(11) 97777-3333', 'CELULAR'),
(56, '(11) 97666-4444', 'CELULAR'),
(57, '(11) 97555-5555', 'CELULAR'),
(58, '(11) 97444-6666', 'CELULAR'),
(59, '(11) 97333-7777', 'CELULAR'),
(60, '(11) 97222-8888', 'CELULAR'),
(61, '(11) 97111-9999', 'CELULAR'),
(62, '(11) 96999-1111', 'CELULAR'),
(63, '(11) 96888-2222', 'CELULAR'),
(64, '(11) 96777-3333', 'CELULAR'),
(65, '(11) 96666-4444', 'CELULAR'),
(66, '(11) 96555-5555', 'CELULAR'),
(67, '(11) 96444-6666', 'CELULAR'),
(68, '(11) 96333-7777', 'CELULAR'),
(69, '(11) 96222-8888', 'CELULAR'),
(70, '(11) 96111-9999', 'CELULAR'),
(71, '(11) 95999-1111', 'CELULAR'),
(72, '(11) 95888-2222', 'CELULAR'),
(73, '(11) 95777-3333', 'CELULAR'),
(74, '(11) 95666-4444', 'CELULAR'),
(75, '(11) 95555-5555', 'CELULAR');

-- Telefones dos Clientes PJ (25 registros)
INSERT INTO Telefone (id_pessoa, numero, tipo) VALUES
(76, '(11) 3100-1000', 'COMERCIAL'),
(77, '(11) 3100-2000', 'COMERCIAL'),
(78, '(11) 3100-3000', 'COMERCIAL'),
(79, '(11) 3100-4000', 'COMERCIAL'),
(80, '(11) 3100-5000', 'COMERCIAL'),
(81, '(11) 3100-6000', 'COMERCIAL'),
(82, '(11) 3100-7000', 'COMERCIAL'),
(83, '(11) 3100-8000', 'COMERCIAL'),
(84, '(11) 3100-9000', 'COMERCIAL'),
(85, '(11) 3101-0000', 'COMERCIAL'),
(86, '(11) 3101-1000', 'COMERCIAL'),
(87, '(11) 3101-2000', 'COMERCIAL'),
(88, '(11) 3101-3000', 'COMERCIAL'),
(89, '(11) 3101-4000', 'COMERCIAL'),
(90, '(11) 3101-5000', 'COMERCIAL'),
(91, '(11) 3101-6000', 'COMERCIAL'),
(92, '(11) 3101-7000', 'COMERCIAL'),
(93, '(11) 3101-8000', 'COMERCIAL'),
(94, '(11) 3101-9000', 'COMERCIAL'),
(95, '(11) 3102-0000', 'COMERCIAL'),
(96, '(11) 3102-1000', 'COMERCIAL'),
(97, '(11) 3102-2000', 'COMERCIAL'),
(98, '(11) 3102-3000', 'COMERCIAL'),
(99, '(11) 3102-4000', 'COMERCIAL'),
(100, '(11) 3102-5000', 'COMERCIAL');

-- =================================================================
-- 3. FUNCIONÁRIOS (35 registros)
-- =================================================================

INSERT INTO Funcionario (id_pessoa, cpf, matricula, salario, cargo, setor, id_supervisor, status, data_admissao, turno, tipo_contrato, carga_horaria_semanal, comissao_percentual, meta_mensal) VALUES
-- Diretoria e Gerência (sem supervisor)
(1, '123.456.789-01', 'FUN001', 15000.00, 'Diretor Geral', 'Diretoria', NULL, 'ATIVO', '2020-01-15', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),
(2, '234.567.890-12', 'FUN002', 12000.00, 'Gerente de Vendas', 'Vendas', 1, 'ATIVO', '2020-03-10', 'INTEGRAL', 'CLT', 44, 5.00, 150000.00),
(3, '345.678.901-23', 'FUN003', 10000.00, 'Gerente de Estoque', 'Estoque', 1, 'ATIVO', '2020-05-20', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),
(4, '456.789.012-34', 'FUN004', 8000.00, 'Supervisor de Caixa', 'Financeiro', 2, 'ATIVO', '2021-02-01', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),
(5, '567.890.123-45', 'FUN005', 7500.00, 'Supervisor de Compras', 'Compras', 3, 'ATIVO', '2021-04-15', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),

-- Operadores de Caixa (subordinados ao Supervisor 4)
(6, '678.901.234-56', 'FUN006', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2021-06-01', 'MANHA', 'CLT', 44, 0.00, 0.00),
(7, '789.012.345-67', 'FUN007', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2021-07-10', 'TARDE', 'CLT', 44, 0.00, 0.00),
(8, '890.123.456-78', 'FUN008', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2021-08-15', 'NOITE', 'CLT', 44, 0.00, 0.00),
(9, '901.234.567-89', 'FUN009', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-01-05', 'MANHA', 'CLT', 44, 0.00, 0.00),
(10, '012.345.678-90', 'FUN010', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-02-20', 'TARDE', 'CLT', 44, 0.00, 0.00),
(11, '111.222.333-44', 'FUN011', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-03-10', 'NOITE', 'CLT', 44, 0.00, 0.00),
(12, '222.333.444-55', 'FUN012', 3500.00, 'Operador de Caixa', 'Financeiro', 4, 'ATIVO', '2022-05-15', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),

-- Vendedores (subordinados ao Gerente de Vendas 2)
(13, '333.444.555-66', 'FUN013', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2021-09-01', 'INTEGRAL', 'CLT', 44, 3.00, 25000.00),
(14, '444.555.666-77', 'FUN014', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2021-10-10', 'INTEGRAL', 'CLT', 44, 3.00, 25000.00),
(15, '555.666.777-88', 'FUN015', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-01-15', 'INTEGRAL', 'CLT', 44, 3.00, 25000.00),
(16, '666.777.888-99', 'FUN016', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-03-01', 'INTEGRAL', 'CLT', 44, 3.00, 25000.00),
(17, '777.888.999-00', 'FUN017', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-04-20', 'MANHA', 'CLT', 36, 3.00, 20000.00),
(18, '888.999.000-11', 'FUN018', 4000.00, 'Vendedor', 'Vendas', 2, 'ATIVO', '2022-06-10', 'TARDE', 'CLT', 36, 3.00, 20000.00),

-- Estoquistas (subordinados ao Gerente de Estoque 3)
(19, '999.000.111-22', 'FUN019', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2021-11-01', 'MANHA', 'CLT', 44, 0.00, 0.00),
(20, '000.111.222-33', 'FUN020', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-01-10', 'TARDE', 'CLT', 44, 0.00, 0.00),
(21, '111.222.333-00', 'FUN021', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-02-15', 'NOITE', 'CLT', 44, 0.00, 0.00),
(22, '222.333.444-11', 'FUN022', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-04-01', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),
(23, '333.444.555-22', 'FUN023', 3800.00, 'Estoquista', 'Estoque', 3, 'ATIVO', '2022-05-20', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),

-- Outros setores
(24, '444.555.666-33', 'FUN024', 4500.00, 'Analista Financeiro', 'Financeiro', 1, 'ATIVO', '2021-12-01', 'INTEGRAL', 'CLT', 40, 0.00, 0.00),
(25, '555.666.777-44', 'FUN025', 4500.00, 'Analista de Compras', 'Compras', 5, 'ATIVO', '2022-01-15', 'INTEGRAL', 'CLT', 40, 0.00, 0.00),
(26, '666.777.888-00', 'FUN026', 5000.00, 'Analista de TI', 'TI', 1, 'ATIVO', '2020-06-10', 'INTEGRAL', 'PJ', 40, 0.00, 0.00),
(27, '777.888.999-55', 'FUN027', 4200.00, 'Assistente Administrativo', 'Administrativo', 1, 'ATIVO', '2022-02-01', 'INTEGRAL', 'CLT', 40, 0.00, 0.00),
(28, '888.999.000-66', 'FUN028', 4200.00, 'Assistente de RH', 'RH', 1, 'ATIVO', '2022-03-15', 'INTEGRAL', 'CLT', 40, 0.00, 0.00),
(29, '999.000.111-77', 'FUN029', 3600.00, 'Auxiliar de Limpeza', 'Serviços Gerais', 1, 'ATIVO', '2022-04-01', 'MANHA', 'CLT', 44, 0.00, 0.00),
(30, '000.111.222-88', 'FUN030', 3600.00, 'Auxiliar de Manutenção', 'Manutenção', 1, 'ATIVO', '2022-05-10', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),
(31, '111.222.333-99', 'FUN031', 4800.00, 'Coordenador de Marketing', 'Marketing', 2, 'ATIVO', '2021-08-01', 'INTEGRAL', 'CLT', 40, 2.00, 50000.00),
(32, '222.333.444-00', 'FUN032', 3900.00, 'Recepcionista', 'Atendimento', 1, 'ATIVO', '2022-06-01', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),
(33, '333.444.555-11', 'FUN033', 4000.00, 'Auxiliar Administrativo', 'Administrativo', 27, 'ATIVO', '2022-07-15', 'INTEGRAL', 'ESTAGIO', 30, 0.00, 0.00),
(34, '444.555.666-22', 'FUN034', 3500.00, 'Empacotador', 'Vendas', 2, 'ATIVO', '2022-08-01', 'INTEGRAL', 'CLT', 44, 0.00, 0.00),
(35, '555.666.777-33', 'FUN035', 3500.00, 'Repositor', 'Estoque', 3, 'INATIVO', '2022-09-10', 'MANHA', 'TEMPORARIO', 44, 0.00, 0.00);

-- =================================================================
-- 4. USUÁRIOS (10 registros - funcionários com acesso ao sistema)
-- =================================================================

INSERT INTO Usuario (id_pessoa, username, password, role, status) VALUES
(1, 'joao.silva', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ATIVO'),
(2, 'maria.santos', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ATIVO'),
(3, 'carlos.oliveira', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ATIVO'),
(4, 'ana.costa', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ATIVO'),
(5, 'pedro.lima', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ATIVO'),
(6, 'juliana.ferreira', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ATIVO'),
(7, 'roberto.alves', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ATIVO'),
(8, 'fernanda.rodrigues', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ATIVO'),
(24, 'cristina.souza', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'ATIVO'),
(26, 'adriana.costa', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ATIVO');

-- =================================================================
-- 5. CLIENTES PESSOA FÍSICA (40 registros)
-- =================================================================

INSERT INTO Cliente (id_pessoa, tipo_pessoa, ativo, ranking, total_gasto, data_ultima_compra, credito_disponivel) VALUES
(36, 'FISICA', TRUE, 3, 2500.00, '2025-10-15', 500.00),
(37, 'FISICA', TRUE, 5, 8500.00, '2025-10-20', 1500.00),
(38, 'FISICA', TRUE, 2, 1200.00, '2025-10-10', 200.00),
(39, 'FISICA', TRUE, 4, 5400.00, '2025-10-18', 1000.00),
(40, 'FISICA', TRUE, 3, 3200.00, '2025-10-19', 600.00),
(41, 'FISICA', TRUE, 2, 1800.00, '2025-09-05', 300.00),
(42, 'FISICA', TRUE, 5, 9200.00, '2025-10-21', 2000.00),
(43, 'FISICA', TRUE, 3, 4100.00, '2025-10-17', 800.00),
(44, 'FISICA', TRUE, 4, 6300.00, '2025-10-22', 1200.00),
(45, 'FISICA', TRUE, 2, 1500.00, '2025-08-30', 250.00),
(46, 'FISICA', TRUE, 1, 500.00, '2025-07-15', 100.00),
(47, 'FISICA', TRUE, 3, 3800.00, '2025-10-16', 700.00),
(48, 'FISICA', TRUE, 4, 5600.00, '2025-10-20', 1100.00),
(49, 'FISICA', TRUE, 2, 2100.00, '2025-09-12', 400.00),
(50, 'FISICA', TRUE, 3, 3500.00, '2025-10-19', 650.00),
(51, 'FISICA', TRUE, 5, 12000.00, '2025-10-23', 3000.00),
(52, 'FISICA', TRUE, 2, 1900.00, '2025-09-20', 350.00),
(53, 'FISICA', TRUE, 4, 7200.00, '2025-10-21', 1400.00),
(54, 'FISICA', TRUE, 3, 4500.00, '2025-10-18', 900.00),
(55, 'FISICA', TRUE, 2, 2300.00, '2025-09-25', 450.00),
(56, 'FISICA', TRUE, 3, 3900.00, '2025-10-20', 750.00),
(57, 'FISICA', TRUE, 4, 6800.00, '2025-10-22', 1300.00),
(58, 'FISICA', TRUE, 2, 1700.00, '2025-09-10', 300.00),
(59, 'FISICA', TRUE, 3, 4200.00, '2025-10-19', 800.00),
(60, 'FISICA', TRUE, 5, 10500.00, '2025-10-23', 2500.00),
(61, 'FISICA', TRUE, 2, 2000.00, '2025-09-15', 400.00),
(62, 'FISICA', TRUE, 3, 3700.00, '2025-10-17', 700.00),
(63, 'FISICA', TRUE, 4, 5900.00, '2025-10-21', 1150.00),
(64, 'FISICA', TRUE, 2, 1600.00, '2025-09-08', 300.00),
(65, 'FISICA', TRUE, 3, 4400.00, '2025-10-18', 850.00),
(66, 'FISICA', TRUE, 4, 6500.00, '2025-10-22', 1250.00),
(67, 'FISICA', TRUE, 5, 11000.00, '2025-10-23', 2800.00),
(68, 'FISICA', TRUE, 3, 4000.00, '2025-10-19', 800.00),
(69, 'FISICA', TRUE, 2, 2200.00, '2025-09-18', 450.00),
(70, 'FISICA', TRUE, 3, 3600.00, '2025-10-20', 700.00),
(71, 'FISICA', TRUE, 4, 7000.00, '2025-10-22', 1350.00),
(72, 'FISICA', TRUE, 2, 1850.00, '2025-09-12', 350.00),
(73, 'FISICA', TRUE, 3, 4300.00, '2025-10-21', 850.00),
(74, 'FISICA', TRUE, 4, 6200.00, '2025-10-23', 1200.00),
(75, 'FISICA', TRUE, 2, 1950.00, '2025-09-22', 400.00);

INSERT INTO ClienteFisico (id_pessoa, cpf, data_nascimento) VALUES
(36, '111.111.111-11', '1985-05-15'),
(37, '222.222.222-22', '1990-08-20'),
(38, '333.333.333-33', '1988-12-10'),
(39, '444.444.444-44', '1992-03-25'),
(40, '555.555.555-55', '1987-07-18'),
(41, '666.666.666-66', '1995-11-30'),
(42, '777.777.777-77', '1983-02-14'),
(43, '888.888.888-88', '1991-06-22'),
(44, '999.999.999-99', '1989-09-08'),
(45, '101.101.101-01', '1986-01-16'),
(46, '202.202.202-02', '1994-04-27'),
(47, '303.303.303-03', '1984-10-11'),
(48, '404.404.404-04', '1993-12-05'),
(49, '505.505.505-05', '1982-08-19'),
(50, '606.606.606-06', '1996-03-30'),
(51, '707.707.707-07', '1981-07-24'),
(52, '808.808.808-08', '1997-11-18'),
(53, '909.909.909-09', '1980-05-13'),
(54, '121.121.121-12', '1998-09-07'),
(55, '131.131.131-13', '1979-02-21'),
(56, '141.141.141-14', '1999-06-15'),
(57, '151.151.151-15', '1978-10-29'),
(58, '161.161.161-16', '2000-01-03'),
(59, '171.171.171-17', '1977-05-17'),
(60, '181.181.181-18', '1992-09-11'),
(61, '191.191.191-19', '1986-12-26'),
(62, '212.212.212-21', '1995-04-20'),
(63, '232.232.232-23', '1984-08-14'),
(64, '242.242.242-24', '1993-11-28'),
(65, '252.252.252-25', '1983-03-04'),
(66, '262.262.262-26', '1994-07-09'),
(67, '272.272.272-27', '1982-10-23'),
(68, '282.282.282-28', '1991-02-06'),
(69, '292.292.292-29', '1989-06-01'),
(70, '313.313.313-31', '1987-09-15'),
(71, '323.323.323-32', '1996-12-29'),
(72, '343.343.343-34', '1985-04-13'),
(73, '353.353.353-35', '1994-08-07'),
(74, '363.363.363-36', '1983-11-21'),
(75, '373.373.373-37', '1992-03-16');

-- =================================================================
-- 6. CLIENTES PESSOA JURÍDICA (25 registros)
-- =================================================================

INSERT INTO Cliente (id_pessoa, tipo_pessoa, ativo, ranking, total_gasto, data_ultima_compra, credito_disponivel) VALUES
(76, 'JURIDICA', TRUE, 5, 45000.00, '2025-10-23', 10000.00),
(77, 'JURIDICA', TRUE, 4, 32000.00, '2025-10-22', 7000.00),
(78, 'JURIDICA', TRUE, 5, 58000.00, '2025-10-23', 12000.00),
(79, 'JURIDICA', TRUE, 5, 67000.00, '2025-10-23', 15000.00),
(80, 'JURIDICA', TRUE, 4, 28000.00, '2025-10-21', 6000.00),
(81, 'JURIDICA', TRUE, 5, 75000.00, '2025-10-23', 18000.00),
(82, 'JURIDICA', TRUE, 3, 18000.00, '2025-10-18', 4000.00),
(83, 'JURIDICA', TRUE, 4, 35000.00, '2025-10-22', 8000.00),
(84, 'JURIDICA', TRUE, 5, 52000.00, '2025-10-23', 11000.00),
(85, 'JURIDICA', TRUE, 3, 22000.00, '2025-10-19', 5000.00),
(86, 'JURIDICA', TRUE, 5, 63000.00, '2025-10-23', 14000.00),
(87, 'JURIDICA', TRUE, 4, 41000.00, '2025-10-22', 9000.00),
(88, 'JURIDICA', TRUE, 3, 25000.00, '2025-10-20', 5500.00),
(89, 'JURIDICA', TRUE, 4, 38000.00, '2025-10-22', 8500.00),
(90, 'JURIDICA', TRUE, 5, 55000.00, '2025-10-23', 12000.00),
(91, 'JURIDICA', TRUE, 3, 20000.00, '2025-10-19', 4500.00),
(92, 'JURIDICA', TRUE, 4, 33000.00, '2025-10-21', 7500.00),
(93, 'JURIDICA', TRUE, 5, 71000.00, '2025-10-23', 16000.00),
(94, 'JURIDICA', TRUE, 3, 19000.00, '2025-10-18', 4200.00),
(95, 'JURIDICA', TRUE, 4, 36000.00, '2025-10-22', 8200.00),
(96, 'JURIDICA', TRUE, 3, 23000.00, '2025-10-20', 5200.00),
(97, 'JURIDICA', TRUE, 5, 60000.00, '2025-10-23', 13000.00),
(98, 'JURIDICA', TRUE, 4, 44000.00, '2025-10-22', 10000.00),
(99, 'JURIDICA', TRUE, 3, 21000.00, '2025-10-19', 4800.00),
(100, 'JURIDICA', TRUE, 4, 37000.00, '2025-10-21', 8500.00);

INSERT INTO ClienteJuridico (id_pessoa, cnpj, razao_social, inscricao_estadual) VALUES
(76, '12.345.678/0001-90', 'Tech Solutions Tecnologia LTDA', '123.456.789.012'),
(77, '23.456.789/0001-01', 'Comercial Alvorada Importação e Exportação LTDA', '234.567.890.123'),
(78, '34.567.890/0001-12', 'Distribuidora São Jorge Comércio LTDA', '345.678.901.234'),
(79, '45.678.901/0001-23', 'Supermercado Bom Preço Varejo LTDA', '456.789.012.345'),
(80, '56.789.012/0001-34', 'Restaurante Sabor & Arte Gastronomia LTDA', '567.890.123.456'),
(81, '67.890.123/0001-45', 'Industrias Reunidas XYZ LTDA', '678.901.234.567'),
(82, '78.901.234/0001-56', 'Papelaria Moderna Comércio LTDA', '789.012.345.678'),
(83, '89.012.345/0001-67', 'Farmácia Saúde Total LTDA', '890.123.456.789'),
(84, '90.123.456/0001-78', 'Construtora Horizonte LTDA', '901.234.567.890'),
(85, '01.234.567/0001-89', 'Hotel Vista Alegre LTDA', '012.345.678.901'),
(86, '12.345.678/0002-01', 'Clínica Med Center LTDA', '123.456.789.013'),
(87, '23.456.789/0002-12', 'Escola Futuro Brilhante LTDA ME', '234.567.890.124'),
(88, '34.567.890/0002-23', 'Academia Corpo & Mente LTDA', '345.678.901.235'),
(89, '45.678.901/0002-34', 'Livraria Cultura & Arte LTDA', '456.789.012.346'),
(90, '56.789.012/0002-45', 'Buffet Eventos Especiais LTDA', '567.890.123.457'),
(91, '67.890.123/0002-56', 'Pet Shop Amigo Fiel LTDA', '678.901.234.568'),
(92, '78.901.234/0002-67', 'Salão Beleza Pura LTDA ME', '789.012.345.679'),
(93, '89.012.345/0002-78', 'Consultoria Empresarial ABC LTDA', '890.123.456.780'),
(94, '90.123.456/0002-89', 'Padaria Pão Nosso LTDA ME', '901.234.567.891'),
(95, '01.234.567/0002-90', 'Autopeças Rápido LTDA', '012.345.678.902'),
(96, '12.345.678/0003-12', 'Floricultura Jardim Encantado ME', '123.456.789.014'),
(97, '23.456.789/0003-23', 'Agência de Turismo Mundo Afora LTDA', '234.567.890.125'),
(98, '34.567.890/0003-34', 'Imobiliária Lar Perfeito LTDA', '345.678.901.236'),
(99, '45.678.901/0003-45', 'Gráfica Impressão Digital LTDA', '456.789.012.347'),
(100, '56.789.012/0003-56', 'Lavanderia Clean Express LTDA ME', '567.890.123.458');

-- =================================================================
-- 7. FORNECEDORES (15 registros)
-- =================================================================

INSERT INTO Fornecedor (nome_fantasia, razao_social, cnpj, email, telefone, rua, numero, bairro, cidade, estado, cep, contato_principal, condicoes_pagamento, prazo_entrega_dias, avaliacao, status) VALUES
('Atacadão Alimentos', 'Atacadão Alimentos Distribuidor LTDA', '11.111.111/0001-11', 'vendas@atacadaoalimentos.com', '(11) 3200-1000', 'Av. Industrial', '1000', 'Distrito Industrial', 'São Paulo', 'SP', '02200-000', 'Carlos Mendes', '30/60 dias', 2, 4.50, 'ATIVO'),
('Bebidas Brasil', 'Bebidas Brasil Comércio e Distribuição LTDA', '22.222.222/0001-22', 'comercial@bebidasbrasil.com', '(11) 3200-2000', 'Rua das Indústrias', '2000', 'Barra Funda', 'São Paulo', 'SP', '01140-000', 'Ana Paula Silva', '30/45/60 dias', 3, 4.80, 'ATIVO'),
('Higiene & Limpeza Total', 'Higiene e Limpeza Total Atacado LTDA', '33.333.333/0001-33', 'pedidos@hltotal.com', '(11) 3200-3000', 'Av. Comercial', '3000', 'Vila Maria', 'São Paulo', 'SP', '02140-000', 'Roberto Santos', '45 dias', 5, 4.20, 'ATIVO'),
('Eletrônicos Mega', 'Mega Eletrônicos Importação e Distribuição LTDA', '44.444.444/0001-44', 'vendas@eletronicosme ga.com', '(11) 3200-4000', 'Rua Tecnologia', '4000', 'Brooklin', 'São Paulo', 'SP', '04560-000', 'Fernanda Costa', '30/60/90 dias', 10, 4.70, 'ATIVO'),
('Grãos & Cereais Brasil', 'Grãos e Cereais Brasil Atacado LTDA', '55.555.555/0001-55', 'comercial@graoscereaisbr.com', '(11) 3200-5000', 'Av. Agro', '5000', 'Vila Leopoldina', 'São Paulo', 'SP', '05083-000', 'Pedro Oliveira', '30/45 dias', 4, 4.60, 'ATIVO'),
('Laticínios São Paulo', 'Laticínios São Paulo Indústria e Comércio LTDA', '66.666.666/0001-66', 'pedidos@laticiniossp.com', '(11) 3200-6000', 'Rua Leiteira', '6000', 'Vila Mariana', 'São Paulo', 'SP', '04107-000', 'Juliana Alves', '7/14/21 dias', 1, 4.90, 'ATIVO'),
('Carnes Premium', 'Carnes Premium Frigorífico LTDA', '77.777.777/0001-77', 'vendas@carnespremium.com', '(11) 3200-7000', 'Av. Frigorífico', '7000', 'Jaguaré', 'São Paulo', 'SP', '05347-000', 'Ricardo Martins', '15/30 dias', 2, 4.75, 'ATIVO'),
('Hortifruti Express', 'Hortifruti Express Comércio de Alimentos LTDA', '88.888.888/0001-88', 'pedidos@hortifrutiexpress.com', '(11) 3200-8000', 'Rua das Hortaliças', '8000', 'CEAGESP', 'São Paulo', 'SP', '05020-000', 'Marina Souza', '7 dias', 1, 4.85, 'ATIVO'),
('Padaria e Confeitaria Doce Lar', 'Padaria Doce Lar Indústria LTDA', '99.999.999/0001-99', 'vendas@docelar.com', '(11) 3200-9000', 'Rua dos Pães', '9000', 'Lapa', 'São Paulo', 'SP', '05058-000', 'Marcos Lima', '21/28 dias', 3, 4.40, 'ATIVO'),
('Pet Shop Atacado Animal', 'Pet Shop Animal Atacado LTDA', '10.101.010/0001-10', 'comercial@petsanimal.com', '(11) 3201-0000', 'Av. Pet', '10000', 'Tatuapé', 'São Paulo', 'SP', '03319-000', 'Cristina Dias', '30/60 dias', 7, 4.55, 'ATIVO'),
('Papelaria Central', 'Papelaria Central Atacado e Distribuidora LTDA', '11.111.222/0001-11', 'vendas@papelariacentral.com', '(11) 3201-1000', 'Rua Papeis', '11000', 'Bom Retiro', 'São Paulo', 'SP', '01124-000', 'Eduardo Ferreira', '30/45 dias', 5, 4.65, 'ATIVO'),
('Brinquedos Feliz', 'Brinquedos Feliz Comércio LTDA', '22.222.333/0001-22', 'comercial@brinquedosfeliz.com', '(11) 3201-2000', 'Av. Diversão', '12000', 'Santana', 'São Paulo', 'SP', '02017-000', 'Paula Rocha', '30/60/90 dias', 15, 4.30, 'ATIVO'),
('Farmacêutica Nacional', 'Farmacêutica Nacional Distribuidora LTDA', '33.333.444/0001-33', 'pedidos@farmanacional.com', '(11) 3201-3000', 'Rua Saúde', '13000', 'Mooca', 'São Paulo', 'SP', '03166-000', 'Dr. Luiz Mendes', '45/60 dias', 3, 4.95, 'ATIVO'),
('Moda & Estilo Atacado', 'Moda e Estilo Atacado de Vestuário LTDA', '44.444.555/0001-44', 'vendas@modaestilo.com', '(11) 3201-4000', 'Rua Moda', '14000', 'Brás', 'São Paulo', 'SP', '03016-000', 'Vanessa Costa', '30/60 dias', 10, 4.25, 'ATIVO'),
('Utilidades Domésticas Prime', 'Utilidades Prime Comércio LTDA', '55.555.666/0001-55', 'comercial@utilidadesprime.com', '(11) 3201-5000', 'Av. Utilidades', '15000', 'Penha', 'São Paulo', 'SP', '03602-000', 'André Silva', '45 dias', 7, 4.50, 'ATIVO');

-- =================================================================
-- 8. CATEGORIAS (10 registros)
-- =================================================================

INSERT INTO Categoria (nome, descricao, status) VALUES
('Alimentos', 'Produtos alimentícios em geral', 'ATIVA'),
('Bebidas', 'Bebidas alcoólicas e não alcoólicas', 'ATIVA'),
('Higiene Pessoal', 'Produtos de higiene e cuidados pessoais', 'ATIVA'),
('Limpeza', 'Produtos de limpeza doméstica e industrial', 'ATIVA'),
('Eletrônicos', 'Eletroeletrônicos e acessórios', 'ATIVA'),
('Papelaria', 'Material escolar e de escritório', 'ATIVA'),
('Pet Shop', 'Produtos para animais de estimação', 'ATIVA'),
('Utilidades Domésticas', 'Utensílios e acessórios para casa', 'ATIVA'),
('Brinquedos', 'Brinquedos e jogos infantis', 'ATIVA'),
('Farmácia', 'Medicamentos e produtos farmacêuticos', 'ATIVA');

-- =================================================================
-- 9. PRODUTOS (100 registros - 10 por categoria)
-- =================================================================

-- Categoria 1: Alimentos (produtos 1-10)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Arroz Branco 5kg', 'Tio João', 'Arroz branco tipo 1', 1, 5, 15.00, 24.90, 150, 30, 500, 'KG', 5.000, 'A1', '7891234567890', '1006.30', 'ATIVO'),
('Feijão Preto 1kg', 'Camil', 'Feijão preto tipo 1', 1, 5, 5.50, 9.90, 200, 40, 600, 'KG', 1.000, 'A2', '7891234567891', '0713.33', 'ATIVO'),
('Açúcar Cristal 1kg', 'União', 'Açúcar cristal refinado', 1, 5, 3.00, 4.99, 180, 35, 550, 'KG', 1.000, 'A3', '7891234567892', '1701.99', 'ATIVO'),
('Óleo de Soja 900ml', 'Soya', 'Óleo de soja refinado', 1, 1, 6.00, 9.90, 220, 45, 650, 'LT', 0.900, 'A4', '7891234567893', '1507.90', 'ATIVO'),
('Macarrão Espaguete 500g', 'Barilla', 'Massa de sêmola', 1, 1, 4.00, 6.90, 250, 50, 700, 'UN', 0.500, 'A5', '7891234567894', '1902.19', 'ATIVO'),
('Sal Refinado 1kg', 'Cisne', 'Sal refinado iodado', 1, 5, 1.50, 2.50, 300, 60, 800, 'KG', 1.000, 'A6', '7891234567895', '2501.00', 'ATIVO'),
('Farinha de Trigo 1kg', 'Dona Benta', 'Farinha de trigo tipo 1', 1, 9, 3.50, 5.90, 200, 40, 600, 'KG', 1.000, 'A7', '7891234567896', '1101.00', 'ATIVO'),
('Café Torrado 500g', '3 Corações', 'Café torrado e moído', 1, 1, 8.00, 13.90, 150, 30, 450, 'KG', 0.500, 'A8', '7891234567897', '0901.21', 'ATIVO'),
('Leite Integral 1L', 'Parmalat', 'Leite UHT integral', 1, 6, 4.00, 6.50, 180, 36, 540, 'LT', 1.000, 'A9', '7891234567898', '0401.20', 'ATIVO'),
('Manteiga 200g', 'Itambé', 'Manteiga com sal', 1, 6, 6.00, 9.90, 120, 24, 360, 'UN', 0.200, 'A10', '7891234567899', '0405.10', 'ATIVO');

-- Categoria 2: Bebidas (produtos 11-20)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Refrigerante Cola 2L', 'Coca-Cola', 'Refrigerante de cola', 2, 2, 5.50, 8.90, 200, 40, 600, 'LT', 2.000, 'B1', '7891234567900', '2202.10', 'ATIVO'),
('Suco de Laranja 1L', 'Del Valle', 'Néctar de laranja', 2, 2, 4.00, 6.50, 150, 30, 450, 'LT', 1.000, 'B2', '7891234567901', '2009.89', 'ATIVO'),
('Água Mineral 500ml', 'Crystal', 'Água mineral sem gás', 2, 2, 0.80, 1.50, 500, 100, 1500, 'LT', 0.500, 'B3', '7891234567902', '2201.10', 'ATIVO'),
('Cerveja Lata 350ml', 'Skol', 'Cerveja pilsen', 2, 2, 2.00, 3.20, 300, 60, 900, 'LT', 0.350, 'B4', '7891234567903', '2203.00', 'ATIVO'),
('Energético 250ml', 'Red Bull', 'Bebida energética', 2, 2, 6.00, 9.90, 100, 20, 300, 'LT', 0.250, 'B5', '7891234567904', '2202.99', 'ATIVO'),
('Chá Gelado 1.5L', 'Lipton', 'Chá preto gelado', 2, 2, 3.50, 5.90, 120, 24, 360, 'LT', 1.500, 'B6', '7891234567905', '2202.99', 'ATIVO'),
('Isotônico 500ml', 'Gatorade', 'Bebida isotônica', 2, 2, 2.50, 4.50, 150, 30, 450, 'LT', 0.500, 'B7', '7891234567906', '2202.90', 'ATIVO'),
('Vinho Tinto 750ml', 'Concha y Toro', 'Vinho tinto chileno', 2, 2, 18.00, 32.90, 60, 12, 180, 'LT', 0.750, 'B8', '7891234567907', '2204.21', 'ATIVO'),
('Vodka 1L', 'Smirnoff', 'Vodka premium', 2, 2, 25.00, 42.90, 50, 10, 150, 'LT', 1.000, 'B9', '7891234567908', '2208.60', 'ATIVO'),
('Whisky 1L', 'Jack Daniels', 'Whisky americano', 2, 2, 85.00, 149.90, 30, 6, 90, 'LT', 1.000, 'B10', '7891234567909', '2208.30', 'ATIVO');

-- Categoria 3: Higiene Pessoal (produtos 21-30)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Shampoo 400ml', 'Pantene', 'Shampoo hidratação', 3, 3, 8.00, 12.90, 150, 30, 450, 'UN', 0.400, 'C1', '7891234567910', '3305.10', 'ATIVO'),
('Condicionador 400ml', 'Pantene', 'Condicionador hidratação', 3, 3, 8.50, 13.50, 140, 28, 420, 'UN', 0.400, 'C2', '7891234567911', '3305.10', 'ATIVO'),
('Sabonete 90g', 'Dove', 'Sabonete hidratante', 3, 3, 2.50, 3.80, 300, 60, 900, 'UN', 0.090, 'C3', '7891234567912', '3401.11', 'ATIVO'),
('Creme Dental 90g', 'Colgate', 'Creme dental tripla ação', 3, 13, 3.50, 5.50, 250, 50, 750, 'UN', 0.090, 'C4', '7891234567913', '3306.10', 'ATIVO'),
('Desodorante 150ml', 'Rexona', 'Desodorante aerosol', 3, 3, 5.50, 8.90, 200, 40, 600, 'UN', 0.150, 'C5', '7891234567914', '3307.20', 'ATIVO'),
('Papel Higiênico 4 rolos', 'Neve', 'Papel higiênico folha dupla', 3, 3, 6.00, 9.80, 220, 44, 660, 'UN', 0.400, 'C6', '7891234567915', '4818.10', 'ATIVO'),
('Fio Dental 50m', 'Oral-B', 'Fio dental encerado', 3, 13, 4.00, 6.90, 180, 36, 540, 'UN', 0.050, 'C7', '7891234567916', '3306.20', 'ATIVO'),
('Escova de Dentes', 'Colgate', 'Escova dental macia', 3, 13, 3.00, 4.90, 200, 40, 600, 'UN', 0.030, 'C8', '7891234567917', '9603.21', 'ATIVO'),
('Absorvente Pacote 8un', 'Always', 'Absorvente com abas', 3, 3, 4.50, 7.50, 150, 30, 450, 'UN', 0.100, 'C9', '7891234567918', '9619.00', 'ATIVO'),
('Lenço Umedecido 48un', 'Huggies', 'Lenço umedecido infantil', 3, 3, 5.00, 8.20, 120, 24, 360, 'UN', 0.200, 'C10', '7891234567919', '3401.19', 'ATIVO');

-- Categoria 4: Limpeza (produtos 31-40)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Detergente 500ml', 'Ypê', 'Detergente líquido neutro', 4, 3, 2.50, 4.25, 300, 60, 900, 'LT', 0.500, 'D1', '7891234567920', '3402.20', 'ATIVO'),
('Sabão em Pó 1kg', 'OMO', 'Sabão em pó multiação', 4, 3, 10.00, 15.90, 180, 36, 540, 'KG', 1.000, 'D2', '7891234567921', '3402.20', 'ATIVO'),
('Desinfetante 1L', 'Pinho Sol', 'Desinfetante lavanda', 4, 3, 5.00, 7.80, 200, 40, 600, 'LT', 1.000, 'D3', '7891234567922', '3808.94', 'ATIVO'),
('Água Sanitária 1L', 'Candida', 'Água sanitária cloro ativo', 4, 3, 2.00, 3.50, 250, 50, 750, 'LT', 1.000, 'D4', '7891234567923', '2828.90', 'ATIVO'),
('Esponja de Aço', 'Bombril', 'Esponja de aço com sabão', 4, 3, 1.20, 2.20, 400, 80, 1200, 'UN', 0.050, 'D5', '7891234567924', '7323.10', 'ATIVO'),
('Amaciante 2L', 'Comfort', 'Amaciante concentrado', 4, 3, 7.00, 11.50, 150, 30, 450, 'LT', 2.000, 'D6', '7891234567925', '3809.91', 'ATIVO'),
('Esponja Multiuso', 'Scotch-Brite', 'Esponja dupla face', 4, 3, 1.50, 2.90, 350, 70, 1050, 'UN', 0.020, 'D7', '7891234567926', '3924.10', 'ATIVO'),
('Limpa Vidros 500ml', 'Veja', 'Limpa vidros spray', 4, 3, 3.50, 5.90, 140, 28, 420, 'LT', 0.500, 'D8', '7891234567927', '3402.20', 'ATIVO'),
('Limpador Multiuso 500ml', 'Ajax', 'Limpador multiuso cloro', 4, 3, 3.00, 5.20, 160, 32, 480, 'LT', 0.500, 'D9', '7891234567928', '3402.20', 'ATIVO'),
('Pano de Chão', 'Perfex', 'Pano de limpeza algodão', 4, 3, 2.50, 4.50, 200, 40, 600, 'UN', 0.100, 'D10', '7891234567929', '6307.90', 'ATIVO');

-- Categoria 5: Eletrônicos (produtos 41-50)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Smartphone 128GB', 'Samsung', 'Smartphone Galaxy A54', 5, 4, 1200.00, 1899.00, 30, 5, 100, 'UN', 0.200, 'E1', '7891234567930', '8517.12', 'ATIVO'),
('Fone de Ouvido Bluetooth', 'JBL', 'Fone bluetooth in-ear', 5, 4, 80.00, 149.00, 50, 10, 150, 'UN', 0.100, 'E2', '7891234567931', '8518.30', 'ATIVO'),
('Carregador Rápido USB-C', 'Anker', 'Carregador 30W USB-C', 5, 4, 35.00, 69.90, 80, 15, 240, 'UN', 0.150, 'E3', '7891234567932', '8504.40', 'ATIVO'),
('Mouse Gamer', 'Logitech', 'Mouse óptico RGB', 5, 4, 60.00, 119.00, 40, 8, 120, 'UN', 0.120, 'E4', '7891234567933', '8471.60', 'ATIVO'),
('Teclado Mecânico', 'Redragon', 'Teclado mecânico RGB', 5, 4, 120.00, 229.00, 25, 5, 75, 'UN', 0.800, 'E5', '7891234567934', '8471.60', 'ATIVO'),
('Webcam Full HD', 'Logitech', 'Webcam 1080p 60fps', 5, 4, 150.00, 289.00, 20, 4, 60, 'UN', 0.150, 'E6', '7891234567935', '8525.80', 'ATIVO'),
('Pendrive 64GB', 'SanDisk', 'Pendrive USB 3.0', 5, 4, 25.00, 49.90, 100, 20, 300, 'UN', 0.010, 'E7', '7891234567936', '8523.51', 'ATIVO'),
('Cabo HDMI 2m', 'Elg', 'Cabo HDMI 2.0 4K', 5, 4, 15.00, 29.90, 120, 24, 360, 'UN', 0.100, 'E8', '7891234567937', '8544.42', 'ATIVO'),
('Bateria Externa 10000mAh', 'Xiaomi', 'Power bank portátil', 5, 4, 55.00, 99.90, 60, 12, 180, 'UN', 0.250, 'E9', '7891234567938', '8506.50', 'ATIVO'),
('Caixa de Som Bluetooth', 'JBL', 'Caixa portátil 20W', 5, 4, 130.00, 249.00, 35, 7, 105, 'UN', 0.600, 'E10', '7891234567939', '8518.21', 'ATIVO');

-- Categoria 6: Papelaria (produtos 51-60)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Caderno 200 folhas', 'Tilibra', 'Caderno universitário', 6, 11, 12.00, 22.90, 150, 30, 450, 'UN', 0.400, 'F1', '7891234567940', '4820.10', 'ATIVO'),
('Caneta Azul', 'BIC', 'Caneta esferográfica', 6, 11, 1.00, 2.50, 500, 100, 1500, 'UN', 0.010, 'F2', '7891234567941', '9608.10', 'ATIVO'),
('Lápis HB', 'Faber-Castell', 'Lápis grafite nº2', 6, 11, 0.80, 1.90, 400, 80, 1200, 'UN', 0.010, 'F3', '7891234567942', '9609.10', 'ATIVO'),
('Borracha Branca', 'Faber-Castell', 'Borracha macia', 6, 11, 0.60, 1.50, 450, 90, 1350, 'UN', 0.020, 'F4', '7891234567943', '4016.10', 'ATIVO'),
('Apontador', 'Faber-Castell', 'Apontador com depósito', 6, 11, 1.50, 3.50, 300, 60, 900, 'UN', 0.030, 'F5', '7891234567944', '8214.10', 'ATIVO'),
('Cola Branca 90g', 'Tenaz', 'Cola escolar líquida', 6, 11, 2.00, 4.50, 250, 50, 750, 'UN', 0.090, 'F6', '7891234567945', '3506.10', 'ATIVO'),
('Tesoura Escolar', 'Mundial', 'Tesoura ponta redonda', 6, 11, 8.00, 15.90, 100, 20, 300, 'UN', 0.050, 'F7', '7891234567946', '8213.00', 'ATIVO'),
('Régua 30cm', 'Waleu', 'Régua plástica transparente', 6, 11, 1.50, 3.90, 200, 40, 600, 'UN', 0.030, 'F8', '7891234567947', '9017.20', 'ATIVO'),
('Marcador de Texto', 'Stabilo', 'Marca texto amarelo', 6, 11, 2.50, 5.50, 180, 36, 540, 'UN', 0.020, 'F9', '7891234567948', '9608.10', 'ATIVO'),
('Papel Sulfite A4 500f', 'Chamex', 'Papel sulfite 75g', 6, 11, 18.00, 32.90, 120, 24, 360, 'UN', 2.500, 'F10', '7891234567949', '4802.56', 'ATIVO');

-- Categoria 7: Pet Shop (produtos 61-70)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Ração para Cães 10kg', 'Pedigree', 'Ração adulto carne', 7, 10, 55.00, 89.90, 80, 15, 240, 'KG', 10.000, 'G1', '7891234567950', '2309.10', 'ATIVO'),
('Ração para Gatos 1kg', 'Whiskas', 'Ração adulto peixe', 7, 10, 15.00, 24.90, 120, 24, 360, 'KG', 1.000, 'G2', '7891234567951', '2309.10', 'ATIVO'),
('Areia Sanitária 4kg', 'Pipicat', 'Areia higiênica gatos', 7, 10, 10.00, 18.90, 100, 20, 300, 'KG', 4.000, 'G3', '7891234567952', '2530.90', 'ATIVO'),
('Shampoo para Cães 500ml', 'Petlab', 'Shampoo neutro', 7, 10, 8.00, 15.90, 90, 18, 270, 'LT', 0.500, 'G4', '7891234567953', '3305.10', 'ATIVO'),
('Coleira Nylon', 'Furacão Pet', 'Coleira ajustável', 7, 10, 8.00, 16.90, 70, 14, 210, 'UN', 0.100, 'G5', '7891234567954', '4201.00', 'ATIVO'),
('Brinquedo para Cães', 'Chalesco', 'Bola de borracha', 7, 10, 6.00, 12.90, 100, 20, 300, 'UN', 0.150, 'G6', '7891234567955', '9503.00', 'ATIVO'),
('Comedouro Duplo', 'Plásticos Duque', 'Comedouro plástico', 7, 10, 12.00, 22.90, 60, 12, 180, 'UN', 0.300, 'G7', '7891234567956', '3924.10', 'ATIVO'),
('Antipulgas 3 pipetas', 'Frontline', 'Antipulgas cães 10-20kg', 7, 10, 45.00, 79.90, 50, 10, 150, 'UN', 0.050, 'G8', '7891234567957', '3808.91', 'ATIVO'),
('Osso de Couro', 'Bassar Pet', 'Osso para roer natural', 7, 10, 5.00, 9.90, 120, 24, 360, 'UN', 0.100, 'G9', '7891234567958', '0502.00', 'ATIVO'),
('Casinha para Cães', 'Furacão Pet', 'Casinha plástica M', 7, 10, 90.00, 169.00, 20, 4, 60, 'UN', 3.000, 'G10', '7891234567959', '3926.90', 'ATIVO');

-- Categoria 8: Utilidades Domésticas (produtos 71-80)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Jogo de Panelas 5pç', 'Tramontina', 'Panelas alumínio', 8, 15, 85.00, 149.90, 40, 8, 120, 'UN', 3.000, 'H1', '7891234567960', '7615.10', 'ATIVO'),
('Faca de Cozinha', 'Tramontina', 'Faca 8 polegadas inox', 8, 15, 25.00, 45.90, 80, 16, 240, 'UN', 0.200, 'H2', '7891234567961', '8211.91', 'ATIVO'),
('Jogo de Talheres 24pç', 'Brinox', 'Talheres inox', 8, 15, 45.00, 79.90, 50, 10, 150, 'UN', 1.500, 'H3', '7891234567962', '8215.99', 'ATIVO'),
('Pote Hermético 1L', 'Sanremo', 'Pote plástico com tampa', 8, 15, 8.00, 14.90, 120, 24, 360, 'UN', 0.150, 'H4', '7891234567963', '3924.10', 'ATIVO'),
('Lixeira 15L', 'Plasvale', 'Lixeira com pedal', 8, 15, 22.00, 39.90, 60, 12, 180, 'UN', 0.800, 'H5', '7891234567964', '3924.10', 'ATIVO'),
('Cesto Organizador', 'Sanremo', 'Cesto plástico vazado', 8, 15, 12.00, 22.90, 90, 18, 270, 'UN', 0.400, 'H6', '7891234567965', '3924.10', 'ATIVO'),
('Varal de Chão', 'Mor', 'Varal dobrável', 8, 15, 35.00, 64.90, 30, 6, 90, 'UN', 2.000, 'H7', '7891234567966', '3926.90', 'ATIVO'),
('Tábua de Corte', 'Madeira', 'Tábua madeira 30x40cm', 8, 15, 18.00, 32.90, 70, 14, 210, 'UN', 0.600, 'H8', '7891234567967', '4419.90', 'ATIVO'),
('Escorredor de Louças', 'Arthi', 'Escorredor plástico', 8, 15, 20.00, 36.90, 55, 11, 165, 'UN', 0.700, 'H9', '7891234567968', '3924.10', 'ATIVO'),
('Pano de Prato 3pç', 'Santista', 'Pano algodão estampado', 8, 15, 12.00, 21.90, 100, 20, 300, 'UN', 0.200, 'H10', '7891234567969', '6302.60', 'ATIVO');

-- Categoria 9: Brinquedos (produtos 81-90)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Boneca Bebê', 'Baby Alive', 'Boneca interativa', 9, 12, 80.00, 149.90, 40, 8, 120, 'UN', 0.800, 'I1', '7891234567970', '9503.00', 'ATIVO'),
('Carrinho Controle Remoto', 'Candide', 'Carrinho RC 1:18', 9, 12, 60.00, 119.90, 35, 7, 105, 'UN', 0.600, 'I2', '7891234567971', '9503.00', 'ATIVO'),
('Jogo de Montar 500pç', 'LEGO', 'Blocos de montar', 9, 12, 90.00, 169.90, 25, 5, 75, 'UN', 1.200, 'I3', '7891234567972', '9503.00', 'ATIVO'),
('Quebra-Cabeça 1000pç', 'Toyster', 'Puzzle adulto', 9, 12, 25.00, 45.90, 50, 10, 150, 'UN', 0.600, 'I4', '7891234567973', '9503.00', 'ATIVO'),
('Bola de Futebol', 'Penalty', 'Bola oficial tamanho 5', 9, 12, 40.00, 79.90, 45, 9, 135, 'UN', 0.450, 'I5', '7891234567974', '9506.62', 'ATIVO'),
('Jogo de Tabuleiro', 'Estrela', 'Banco Imobiliário', 9, 12, 55.00, 99.90, 30, 6, 90, 'UN', 0.800, 'I6', '7891234567975', '9504.90', 'ATIVO'),
('Patinete Infantil', 'Bel Sports', 'Patinete 3 rodas', 9, 12, 70.00, 139.90, 20, 4, 60, 'UN', 2.500, 'I7', '7891234567976', '9503.00', 'ATIVO'),
('Slime Kit', 'Make+', 'Kit faça seu slime', 9, 12, 20.00, 39.90, 60, 12, 180, 'UN', 0.300, 'I8', '7891234567977', '9503.00', 'ATIVO'),
('Pelúcia Urso', 'Fun Toys', 'Urso pelúcia 40cm', 9, 12, 30.00, 59.90, 50, 10, 150, 'UN', 0.400, 'I9', '7891234567978', '9503.41', 'ATIVO'),
('Piscina Inflável 1000L', 'Intex', 'Piscina redonda', 9, 12, 100.00, 189.90, 15, 3, 45, 'UN', 3.500, 'I10', '7891234567979', '9506.99', 'ATIVO');

-- Categoria 10: Farmácia (produtos 91-100)
INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, estoque, estoque_minimo, estoque_maximo, unidade_medida, peso, localizacao_prateleira, codigo_barras, ncm, status) VALUES
('Paracetamol 500mg 20cp', 'Genérico EMS', 'Analgésico antipirético', 10, 13, 3.00, 5.90, 200, 40, 600, 'UN', 0.020, 'J1', '7891234567980', '3004.90', 'ATIVO'),
('Dipirona 500mg 10cp', 'Genérico Medley', 'Analgésico antipirético', 10, 13, 2.50, 4.90, 250, 50, 750, 'UN', 0.015, 'J2', '7891234567981', '3004.90', 'ATIVO'),
('Ibuprofeno 600mg 20cp', 'Genérico Prati', 'Anti-inflamatório', 10, 13, 8.00, 14.90, 150, 30, 450, 'UN', 0.025, 'J3', '7891234567982', '3004.90', 'ATIVO'),
('Omeprazol 20mg 14cp', 'Genérico Eurofarma', 'Inibidor bomba prótons', 10, 13, 5.00, 9.90, 180, 36, 540, 'UN', 0.018, 'J4', '7891234567983', '3004.90', 'ATIVO'),
('Vitamina C 1g 10cp', 'Genérico Cimed', 'Suplemento vitamínico', 10, 13, 6.00, 11.90, 200, 40, 600, 'UN', 0.020, 'J5', '7891234567984', '3004.90', 'ATIVO'),
('Termômetro Digital', 'G-Tech', 'Termômetro clínico', 10, 13, 15.00, 29.90, 80, 16, 240, 'UN', 0.050, 'J6', '7891234567985', '9025.19', 'ATIVO'),
('Medidor de Pressão', 'Omron', 'Monitor pressão digital', 10, 13, 90.00, 169.90, 30, 6, 90, 'UN', 0.400, 'J7', '7891234567986', '9018.19', 'ATIVO'),
('Álcool 70% 1L', 'Rioquímica', 'Álcool etílico', 10, 13, 8.00, 14.90, 150, 30, 450, 'LT', 1.000, 'J8', '7891234567987', '2207.20', 'ATIVO'),
('Curativo Band-Aid 40un', 'Johnson & Johnson', 'Curativos adesivos', 10, 13, 5.00, 9.90, 120, 24, 360, 'UN', 0.050, 'J9', '7891234567988', '3005.10', 'ATIVO'),
('Protetor Solar FPS50', 'Nivea', 'Protetor solar 200ml', 10, 13, 25.00, 45.90, 90, 18, 270, 'UN', 0.200, 'J10', '7891234567989', '3304.99', 'ATIVO');

-- =================================================================
-- 10. PROMOÇÕES (15 registros)
-- =================================================================

INSERT INTO PROMOCAO (nome, descricao, tipo_desconto, valor_desconto, data_inicio, data_fim, status) VALUES
('Black Friday 2024', 'Super descontos em toda loja', 'PERCENTUAL', 25.00, '2024-11-29', '2024-11-29', 'INATIVA'),
('Natal Mágico 2024', 'Promoções especiais de Natal', 'PERCENTUAL', 20.00, '2024-12-15', '2024-12-25', 'INATIVA'),
('Ano Novo 2025', 'Comece 2025 economizando', 'PERCENTUAL', 15.00, '2025-01-01', '2025-01-05', 'INATIVA'),
('Carnaval 2025', 'Descontos para curtir o Carnaval', 'PERCENTUAL', 18.00, '2025-02-28', '2025-03-04', 'INATIVA'),
('Páscoa 2025', 'Celebre a Páscoa com descontos', 'PERCENTUAL', 22.00, '2025-04-15', '2025-04-20', 'INATIVA'),
('Dia das Mães 2025', 'Presentes especiais para mães', 'PERCENTUAL', 25.00, '2025-05-09', '2025-05-11', 'INATIVA'),
('Festa Junina 2025', 'Arraial com preços baixos', 'PERCENTUAL', 15.00, '2025-06-20', '2025-06-24', 'INATIVA'),
('Dia dos Pais 2025', 'Presentes para todos os pais', 'PERCENTUAL', 20.00, '2025-08-08', '2025-08-10', 'INATIVA'),
('Primavera 2025', 'Flores em descontos', 'PERCENTUAL', 12.00, '2025-09-22', '2025-09-30', 'INATIVA'),
('Halloween 2025', 'Sustos e descontos', 'FIXO', 10.00, '2025-10-31', '2025-10-31', 'INATIVA'),
('Promoção Outubro 2025', 'Semana especial', 'PERCENTUAL', 10.00, '2025-10-15', '2025-10-22', 'INATIVA'),
('Mega Oferta Semanal', 'Produtos selecionados com descontos', 'PERCENTUAL', 15.00, '2025-10-28', '2025-11-04', 'ATIVA'),
('Especial Eletrônicos', 'Tecnologia com preços incríveis', 'PERCENTUAL', 20.00, '2025-10-28', '2025-11-05', 'ATIVA'),
('Queima de Estoque', 'Últimas unidades', 'PERCENTUAL', 30.00, '2025-11-01', '2025-11-10', 'ATIVA'),
('Aniversário SIGMA', 'Comemorando 5 anos', 'PERCENTUAL', 35.00, '2025-11-15', '2025-11-17', 'AGENDADA');

-- =================================================================
-- 11. PRODUTOS EM PROMOÇÃO (80 relacionamentos)
-- =================================================================

INSERT INTO PROMOCAO_PRODUTO (id_promocao, id_produto) VALUES
-- Mega Oferta Semanal ATIVA (promoção 12) - 10 produtos variados
(12, 1), (12, 2), (12, 11), (12, 21), (12, 31), (12, 51), (12, 61), (12, 71), (12, 81), (12, 91),

-- Especial Eletrônicos ATIVA (promoção 13) - Toda categoria Eletrônicos
(13, 41), (13, 42), (13, 43), (13, 44), (13, 45), (13, 46), (13, 47), (13, 48), (13, 49), (13, 50),

-- Queima de Estoque ATIVA (promoção 14) - 15 produtos
(14, 15), (14, 16), (14, 25), (14, 26), (14, 35), (14, 36), (14, 55), (14, 56), (14, 65), (14, 75), (14, 85), (14, 86), (14, 95), (14, 96), (14, 100),

-- Aniversário SIGMA AGENDADA (promoção 15) - Produtos premium
(15, 1), (15, 10), (15, 20), (15, 30), (15, 41), (15, 42), (15, 50), (15, 60), (15, 70), (15, 80), (15, 90), (15, 97);

-- =================================================================
-- 12. CAIXAS (20 registros)
-- =================================================================

INSERT INTO Caixa (id_funcionario, data_abertura, data_fechamento, valor_inicial, valor_vendas, valor_sangrias, valor_reforcos, valor_esperado, valor_real, diferenca, status, observacoes) VALUES
-- Caixas fechados de Outubro
(6, '2025-10-20 08:00:00', '2025-10-20 18:00:00', 500.00, 4500.00, 1000.00, 500.00, 4500.00, 4495.00, -5.00, 'FECHADO', 'Pequena divergência'),
(7, '2025-10-21 08:00:00', '2025-10-21 18:00:00', 500.00, 5200.00, 1500.00, 0.00, 4200.00, 4200.00, 0.00, 'FECHADO', 'Fechamento OK'),
(8, '2025-10-22 08:00:00', '2025-10-22 18:00:00', 500.00, 6800.00, 2000.00, 1000.00, 6300.00, 6305.00, 5.00, 'FECHADO', 'Pequeno excesso'),
(6, '2025-10-23 08:00:00', '2025-10-23 18:00:00', 500.00, 5500.00, 1800.00, 500.00, 4700.00, 4700.00, 0.00, 'FECHADO', 'Fechamento perfeito'),
(9, '2025-10-24 08:00:00', '2025-10-24 18:00:00', 500.00, 4200.00, 1200.00, 0.00, 3500.00, 3498.00, -2.00, 'FECHADO', 'Pequena falta'),
(7, '2025-10-25 08:00:00', '2025-10-25 18:00:00', 500.00, 7100.00, 2500.00, 1500.00, 6600.00, 6600.00, 0.00, 'FECHADO', 'Sábado movimentado'),
(10, '2025-10-27 08:00:00', '2025-10-27 18:00:00', 500.00, 5800.00, 1600.00, 800.00, 5500.00, 5503.00, 3.00, 'FECHADO', 'Dia movimentado'),
(8, '2025-10-28 08:00:00', '2025-10-28 18:00:00', 500.00, 6200.00, 2000.00, 1000.00, 5700.00, 5695.00, -5.00, 'FECHADO', 'Pequena divergência'),
(6, '2025-10-29 08:00:00', '2025-10-29 18:00:00', 500.00, 4900.00, 1400.00, 500.00, 4500.00, 4500.00, 0.00, 'FECHADO', 'Tudo certo'),
(11, '2025-10-30 08:00:00', '2025-10-30 18:00:00', 500.00, 5600.00, 1700.00, 700.00, 5100.00, 5095.00, -5.00, 'FECHADO', 'Dia normal'),
(7, '2025-10-31 08:00:00', '2025-10-31 18:00:00', 500.00, 6400.00, 2200.00, 1200.00, 5900.00, 5900.00, 0.00, 'FECHADO', 'Halloween movimentado'),
(9, '2025-11-01 08:00:00', '2025-11-01 18:00:00', 500.00, 5100.00, 1500.00, 500.00, 4600.00, 4598.00, -2.00, 'FECHADO', 'Sábado tranquilo'),

-- Caixas ABERTOS (dia 03/11/2025 - HOJE)
(6, '2025-11-03 08:00:00', NULL, 500.00, 2800.00, 1000.00, 0.00, NULL, NULL, NULL, 'ABERTO', 'Caixa 1 - Manhã'),
(8, '2025-11-03 08:00:00', NULL, 500.00, 3200.00, 800.00, 500.00, NULL, NULL, NULL, 'ABERTO', 'Caixa 2 - Manhã'),
(11, '2025-11-03 14:00:00', NULL, 500.00, 1500.00, 0.00, 0.00, NULL, NULL, NULL, 'ABERTO', 'Caixa 3 - Tarde');

-- =================================================================
-- 13. MOVIMENTAÇÕES DE CAIXA (10 registros)
-- =================================================================

INSERT INTO MovimentacaoCaixa (id_caixa, tipo, valor, motivo, data_movimentacao, id_funcionario_autorizador) VALUES
(1, 'SANGRIA', 1000.00, 'Depósito banco', '2025-10-20 14:00:00', 2),
(2, 'SANGRIA', 1500.00, 'Depósito banco', '2025-10-21 15:00:00', 2),
(3, 'SANGRIA', 2000.00, 'Depósito banco', '2025-10-22 16:00:00', 2),
(3, 'REFORCO', 1000.00, 'Reforço de troco', '2025-10-22 10:00:00', 4),
(6, 'SANGRIA', 2500.00, 'Depósito banco', '2025-10-25 15:30:00', 2),
(6, 'REFORCO', 1500.00, 'Falta de troco', '2025-10-25 09:00:00', 4),
(11, 'SANGRIA', 2200.00, 'Depósito banco', '2025-10-31 15:00:00', 2),
(11, 'REFORCO', 1200.00, 'Reforço troco', '2025-10-31 10:00:00', 4),
(13, 'SANGRIA', 1000.00, 'Depósito parcial', '2025-11-03 12:00:00', 2),
(14, 'REFORCO', 500.00, 'Necessário mais troco', '2025-11-03 11:00:00', 4);

-- =================================================================
-- 14. VENDAS (30 registros)
-- =================================================================

INSERT INTO Venda (id_cliente, id_funcionario, id_caixa, data_venda, valor_total, desconto, valor_final, metodo_pagamento, valor_pago, troco, status) VALUES
-- Vendas de Outubro
(37, 6, 1, '2025-10-20 09:30:00', 450.00, 50.00, 400.00, 'Dinheiro', 400.00, 0.00, 'CONCLUIDA'),
(42, 6, 1, '2025-10-20 11:15:00', 850.00, 0.00, 850.00, 'Cartão de Crédito', 850.00, 0.00, 'CONCLUIDA'),
(76, 7, 2, '2025-10-21 10:00:00', 12000.00, 500.00, 11500.00, 'Boleto', 11500.00, 0.00, 'CONCLUIDA'),
(44, 8, 3, '2025-10-22 14:20:00', 320.00, 0.00, 320.00, 'PIX', 320.00, 0.00, 'CONCLUIDA'),
(51, 8, 3, '2025-10-22 16:45:00', 1250.00, 50.00, 1200.00, 'Cartão de Débito', 1200.00, 0.00, 'CONCLUIDA'),
(39, 6, 4, '2025-10-23 10:30:00', 680.00, 30.00, 650.00, 'Dinheiro', 700.00, 50.00, 'CONCLUIDA'),
(78, 9, 5, '2025-10-24 11:00:00', 25000.00, 1000.00, 24000.00, 'Boleto', 24000.00, 0.00, 'CONCLUIDA'),
(36, 9, 5, '2025-10-24 15:20:00', 180.00, 0.00, 180.00, 'Dinheiro', 200.00, 20.00, 'CONCLUIDA'),
(79, 7, 6, '2025-10-25 09:30:00', 18000.00, 800.00, 17200.00, 'Boleto', 17200.00, 0.00, 'CONCLUIDA'),
(47, 7, 6, '2025-10-25 13:40:00', 540.00, 0.00, 540.00, 'PIX', 540.00, 0.00, 'CONCLUIDA'),
(60, 10, 7, '2025-10-27 10:15:00', 920.00, 20.00, 900.00, 'Cartão de Crédito', 900.00, 0.00, 'CONCLUIDA'),
(81, 8, 8, '2025-10-28 11:00:00', 32000.00, 1500.00, 30500.00, 'Boleto', 30500.00, 0.00, 'CONCLUIDA'),
(43, 6, 9, '2025-10-29 09:45:00', 380.00, 0.00, 380.00, 'Dinheiro', 400.00, 20.00, 'CONCLUIDA'),
(49, 11, 10, '2025-10-30 14:20:00', 1150.00, 50.00, 1100.00, 'Cartão de Débito', 1100.00, 0.00, 'CONCLUIDA'),
(77, 11, 10, '2025-10-30 16:30:00', 15000.00, 600.00, 14400.00, 'Boleto', 14400.00, 0.00, 'CONCLUIDA'),
(37, 7, 11, '2025-10-31 10:00:00', 780.00, 0.00, 780.00, 'PIX', 780.00, 0.00, 'CONCLUIDA'),
(82, 9, 12, '2025-11-01 11:30:00', 8500.00, 300.00, 8200.00, 'Boleto', 8200.00, 0.00, 'CONCLUIDA'),

-- Vendas de Novembro (hoje - 03/11/2025)
(53, 6, 13, '2025-11-03 09:15:00', 620.00, 20.00, 600.00, 'Cartão de Crédito', 600.00, 0.00, 'CONCLUIDA'),
(86, 8, 14, '2025-11-03 10:30:00', 28000.00, 1200.00, 26800.00, 'Boleto', 26800.00, 0.00, 'CONCLUIDA'),
(42, 6, 13, '2025-11-03 11:45:00', 1280.00, 80.00, 1200.00, 'Dinheiro', 1200.00, 0.00, 'CONCLUIDA'),
(58, 6, 13, '2025-11-03 12:20:00', 450.00, 0.00, 450.00, 'PIX', 450.00, 0.00, 'CONCLUIDA'),
(91, 8, 14, '2025-11-03 13:00:00', 6200.00, 200.00, 6000.00, 'Boleto', 6000.00, 0.00, 'CONCLUIDA'),
(66, 8, 14, '2025-11-03 14:30:00', 890.00, 0.00, 890.00, 'Cartão de Débito', 890.00, 0.00, 'CONCLUIDA'),
(51, 11, 15, '2025-11-03 14:50:00', 1450.00, 50.00, 1400.00, 'Cartão de Crédito', 1400.00, 0.00, 'CONCLUIDA'),
(67, 11, 15, '2025-11-03 15:20:00', 720.00, 0.00, 720.00, 'PIX', 720.00, 0.00, 'CONCLUIDA'),

-- Vendas em andamento (carrinhos ativos)
(55, 6, 13, '2025-11-03 16:30:00', 0.00, 0.00, 0.00, NULL, NULL, NULL, 'EM_ANDAMENTO'),
(NULL, 8, 14, '2025-11-03 16:45:00', 0.00, 0.00, 0.00, NULL, NULL, NULL, 'EM_ANDAMENTO');

-- =================================================================
-- 15. ITENS DAS VENDAS (120 registros aproximadamente)
-- =================================================================

-- Venda 1
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(1, 1, 2, 24.90, 0.00, 49.80),
(1, 11, 3, 8.90, 0.00, 26.70),
(1, 21, 10, 3.80, 0.00, 38.00),
(1, 31, 5, 4.25, 0.00, 21.25);

-- Venda 2
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(2, 41, 1, 1899.00, 0.00, 1899.00),
(2, 42, 2, 149.00, 0.00, 298.00),
(2, 43, 3, 69.90, 0.00, 209.70),
(2, 51, 5, 22.90, 0.00, 114.50);

-- Venda 3 (PJ - Grande volume)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(3, 1, 50, 24.90, 0.00, 1245.00),
(3, 2, 50, 9.90, 0.00, 495.00),
(3, 3, 100, 4.99, 0.00, 499.00),
(3, 4, 80, 9.90, 0.00, 792.00),
(3, 11, 200, 8.90, 0.00, 1780.00),
(3, 21, 150, 3.80, 0.00, 570.00);

-- Venda 4
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(4, 6, 3, 2.50, 0.00, 7.50),
(4, 16, 2, 22.90, 0.00, 45.80),
(4, 26, 5, 5.50, 0.00, 27.50),
(4, 36, 10, 5.20, 0.00, 52.00);

-- Venda 5
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(5, 71, 1, 149.90, 0.00, 149.90),
(5, 72, 1, 79.90, 0.00, 79.90),
(5, 73, 1, 169.90, 0.00, 169.90),
(5, 81, 2, 149.90, 0.00, 299.80);

-- Continuar para as vendas restantes (adicionando mais algumas importantes)

-- Venda 12 (PJ - Grande volume)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(12, 1, 100, 24.90, 0.00, 2490.00),
(12, 2, 100, 9.90, 0.00, 990.00),
(12, 11, 300, 8.90, 0.00, 2670.00),
(12, 21, 200, 3.80, 0.00, 760.00),
(12, 31, 300, 4.25, 0.00, 1275.00);

-- Venda 19 (PJ - Hoje)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(19, 1, 80, 24.90, 0.00, 1992.00),
(19, 2, 80, 9.90, 0.00, 792.00),
(19, 11, 150, 8.90, 0.00, 1335.00),
(19, 31, 400, 4.25, 0.00, 1700.00);

-- Venda 24 (Hoje)
INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) VALUES
(24, 41, 1, 1899.00, 0.00, 1899.00),
(24, 42, 1, 149.00, 0.00, 149.00),
(24, 46, 1, 49.90, 0.00, 49.90);

-- =================================================================
-- 16. MOVIMENTAÇÕES DE ESTOQUE (50 registros)
-- =================================================================

INSERT INTO MovimentacaoEstoque (id_produto, id_usuario, data_movimentacao, tipo, quantidade, estoque_anterior, estoque_atual, observacao) VALUES
-- Entradas de estoque
(1, 3, '2025-10-18 08:00:00', 'IN', 200, 50, 250, 'Recebimento fornecedor'),
(2, 3, '2025-10-18 08:00:00', 'IN', 250, 100, 350, 'Recebimento fornecedor'),
(11, 3, '2025-10-19 09:00:00', 'IN', 300, 100, 400, 'Recebimento fornecedor'),
(21, 3, '2025-10-19 09:00:00', 'IN', 400, 200, 600, 'Recebimento fornecedor'),
(31, 3, '2025-10-20 08:30:00', 'IN', 500, 200, 700, 'Recebimento fornecedor'),
(41, 3, '2025-10-21 10:00:00', 'IN', 50, 10, 60, 'Recebimento fornecedor'),

-- Saídas por vendas recentes
(1, 1, '2025-10-20 09:30:00', 'SALE', -2, 250, 248, 'Venda #1'),
(11, 1, '2025-10-20 09:30:00', 'SALE', -3, 400, 397, 'Venda #1'),
(1, 1, '2025-10-21 10:00:00', 'SALE', -50, 248, 198, 'Venda #3 - PJ'),
(2, 1, '2025-10-21 10:00:00', 'SALE', -50, 350, 300, 'Venda #3 - PJ'),
(11, 1, '2025-10-21 10:00:00', 'SALE', -200, 397, 197, 'Venda #3 - PJ'),
(21, 1, '2025-10-21 10:00:00', 'SALE', -150, 600, 450, 'Venda #3 - PJ'),
(1, 1, '2025-10-28 11:00:00', 'SALE', -100, 198, 98, 'Venda #12 - PJ'),
(2, 1, '2025-10-28 11:00:00', 'SALE', -100, 300, 200, 'Venda #12 - PJ'),
(11, 1, '2025-10-28 11:00:00', 'SALE', -197, 197, 0, 'Venda #12 - ESTOQUE ZERADO!'),
(41, 1, '2025-11-03 09:15:00', 'SALE', -1, 30, 29, 'Venda #18'),
(42, 1, '2025-11-03 09:15:00', 'SALE', -1, 50, 49, 'Venda #18'),
-- Ajustes e perdas
(15, 3, '2025-10-25 10:00:00', 'LOSS', -3, 150, 147, 'Produtos danificados'),
(35, 3, '2025-10-27 09:00:00', 'ADJUSTMENT', 20, 400, 420, 'Correção inventário'),
-- Devolução
(41, 1, '2025-10-30 15:00:00', 'RETURN', 1, 29, 30, 'Devolução cliente - defeito');

-- =================================================================
-- 17. METAS DE VENDAS (5 registros)
-- =================================================================

INSERT INTO MetaVenda (tipo, periodo_inicio, periodo_fim, valor_meta, quantidade_vendas_meta, ticket_medio_meta, valor_realizado, quantidade_vendas_realizada, ticket_medio_realizado, percentual_atingido, status) VALUES
('MENSAL', '2025-11-01', '2025-11-30', 550000.00, 320, 1718.75, 45600.00, 27, 1688.89, 8.29, 'ATIVA'),
('SEMANAL', '2025-11-03', '2025-11-09', 150000.00, 90, 1666.67, 45600.00, 27, 1688.89, 30.40, 'ATIVA'),
('DIARIA', '2025-11-03', '2025-11-03', 50000.00, 30, 1666.67, 45600.00, 27, 1688.89, 91.20, 'ATIVA'),
('MENSAL', '2025-10-01', '2025-10-31', 500000.00, 300, 1666.67, 487235.00, 295, 1651.47, 97.45, 'CONCLUIDA'),
('MENSAL', '2025-09-01', '2025-09-30', 450000.00, 280, 1607.14, 487000.00, 293, 1662.12, 108.22, 'CONCLUIDA');

-- =================================================================
-- 18. ALERTAS (20 registros)
-- =================================================================

INSERT INTO Alerta (tipo, prioridade, titulo, mensagem, id_produto, id_venda, id_funcionario, lido, data_criacao) VALUES
('ESTOQUE_BAIXO', 'CRITICA', 'ESTOQUE ZERADO: Refrigerante Cola 2L', 'URGENTE! Produto sem estoque. Reabastecer imediatamente!', 11, NULL, NULL, FALSE, '2025-11-03 11:00:00'),
('ESTOQUE_BAIXO', 'ALTA', 'Estoque baixo: Arroz Branco 5kg', 'Produto com estoque de 98 unidades. Estoque mínimo: 30. Considere reposição.', 1, NULL, NULL, FALSE, '2025-11-03 10:00:00'),
('ESTOQUE_BAIXO', 'ALTA', 'Estoque baixo: Smartphone 128GB', 'Produto com 29 unidades. Estoque mínimo: 5.', 41, NULL, NULL, FALSE, '2025-11-03 14:00:00'),
('PRODUTO_VENCENDO', 'MEDIA', 'Produto vencendo: Leite Integral 1L', 'O produto vencerá em 25 dias.', 9, NULL, NULL, FALSE, '2025-11-03 08:00:00'),
('PRODUTO_VENCENDO', 'ALTA', 'Produto vencendo: Manteiga 200g', 'O produto vencerá em 7 dias.', 10, NULL, NULL, FALSE, '2025-11-03 08:00:00'),
('CAIXA_ABERTO', 'MEDIA', 'Caixa #13 aberto há mais de 8h', 'Caixa aberto desde 08:00, considere fechamento.', NULL, NULL, 6, FALSE, '2025-11-03 16:05:00'),
('CAIXA_ABERTO', 'MEDIA', 'Caixa #14 aberto há mais de 8h', 'Caixa aberto desde 08:00, considere fechamento.', NULL, NULL, 8, FALSE, '2025-11-03 16:05:00'),
('META_ATINGIDA', 'BAIXA', 'Meta diária atingida!', 'Meta do dia 03/11 atingida em 91,20%! Excelente!', NULL, NULL, NULL, FALSE, '2025-11-03 17:00:00'),
('OUTRO', 'ALTA', 'Produto sem estoque vendido', 'Venda #12 incluiu Refrigerante Cola 2L que está sem estoque.', 11, 12, NULL, TRUE, '2025-10-28 11:05:00'),
('OUTRO', 'MEDIA', 'Meta semanal em andamento', 'Meta semanal atual: 30,40%. Necessário acelerar vendas!', NULL, NULL, NULL, FALSE, '2025-11-03 12:00:00'),
('OUTRO', 'BAIXA', 'Backup realizado com sucesso', 'Backup automático diário concluído.', NULL, NULL, NULL, TRUE, '2025-11-03 02:00:00'),
('ESTOQUE_BAIXO', 'MEDIA', 'Estoque baixo: Ração para Cães 10kg', 'Estoque: 80 unidades. Mínimo: 15.', 61, NULL, NULL, FALSE, '2025-11-02 16:00:00'),
('OUTRO', 'CRITICA', 'Fornecedor atrasado', 'Fornecedor Atacadão Alimentos com entrega atrasada.', NULL, NULL, NULL, FALSE, '2025-11-02 09:00:00'),
('OUTRO', 'BAIXA', 'Promoção iniciada', 'Mega Oferta Semanal iniciada com sucesso.', NULL, NULL, NULL, TRUE, '2025-10-28 08:00:00'),
('OUTRO', 'BAIXA', 'Promoção iniciada', 'Especial Eletrônicos iniciada com sucesso.', NULL, NULL, NULL, TRUE, '2025-10-28 08:00:00'),
('OUTRO', 'MEDIA', 'Promoção próxima', 'Aniversário SIGMA inicia em 12 dias.', NULL, NULL, NULL, FALSE, '2025-11-03 08:00:00'),
('META_ATINGIDA', 'BAIXA', 'Meta mensal de Outubro quase atingida', 'Meta de Outubro atingiu 97,45%!', NULL, NULL, NULL, TRUE, '2025-10-31 23:00:00'),
('OUTRO', 'BAIXA', 'Sistema atualizado', 'Sistema atualizado para versão 2.0.', NULL, NULL, NULL, TRUE, '2025-11-01 08:00:00'),
('ESTOQUE_BAIXO', 'ALTA', 'Estoque baixo: Feijão Preto 1kg', 'Estoque: 200 unidades. Reposição recomendada.', 2, NULL, NULL, FALSE, '2025-11-03 15:00:00'),
('OUTRO', 'MEDIA', 'Black Friday próxima', 'Preparar estoque para Black Friday em 26 dias.', NULL, NULL, NULL, FALSE, '2025-11-03 10:00:00');

-- =================================================================
-- 19. DADOS DE RH - HISTÓRICO DE FUNCIONÁRIOS
-- =================================================================

INSERT INTO HistoricoFuncionario (id_funcionario, tipo_evento, data_evento, cargo_anterior, cargo_novo, setor_anterior, setor_novo, salario_anterior, salario_novo, descricao, realizado_por) VALUES
(1, 'ADMISSAO', '2020-01-15', NULL, 'Diretor Geral', NULL, 'Diretoria', NULL, 15000.00, 'Admissão como Diretor Geral', NULL),
(2, 'ADMISSAO', '2020-03-10', NULL, 'Gerente de Vendas', NULL, 'Vendas', NULL, 10000.00, 'Admissão como Gerente de Vendas', 1),
(2, 'AUMENTO_SALARIAL', '2022-03-10', 'Gerente de Vendas', 'Gerente de Vendas', 'Vendas', 'Vendas', 10000.00, 12000.00, 'Aumento por desempenho', 1),
(3, 'ADMISSAO', '2020-05-20', NULL, 'Gerente de Estoque', NULL, 'Estoque', NULL, 10000.00, 'Admissão como Gerente de Estoque', 1),
(13, 'ADMISSAO', '2021-09-01', NULL, 'Vendedor', NULL, 'Vendas', NULL, 3500.00, 'Admissão como Vendedor', 2),
(13, 'PROMOCAO', '2023-09-01', 'Vendedor', 'Vendedor Pleno', 'Vendas', 'Vendas', 3500.00, 4000.00, 'Promoção por metas', 2),
(26, 'ADMISSAO', '2020-06-10', NULL, 'Analista de TI', NULL, 'TI', NULL, 5000.00, 'Admissão como Analista de TI - PJ', 1),
(35, 'ADMISSAO', '2022-09-10', NULL, 'Repositor', NULL, 'Estoque', NULL, 3500.00, 'Admissão temporária', 3),
(35, 'DESLIGAMENTO', '2023-12-10', 'Repositor', NULL, 'Estoque', NULL, 3500.00, NULL, 'Término de contrato temporário', 3);

-- =================================================================
-- 20. DOCUMENTOS DE FUNCIONÁRIOS
-- =================================================================

INSERT INTO DocumentoFuncionario (id_funcionario, tipo_documento, numero_documento, data_emissao, data_validade, observacoes) VALUES
(1, 'CPF', '123.456.789-01', '2000-01-01', NULL, 'CPF do Diretor'),
(1, 'RG', '12.345.678-9', '2000-01-01', NULL, 'RG do Diretor'),
(1, 'CNH', '12345678901', '2020-01-01', '2025-01-01', 'Categoria B'),
(2, 'CPF', '234.567.890-12', '1995-05-10', NULL, NULL),
(2, 'CTPS', '123456-7890', '2010-01-01', NULL, 'Carteira de Trabalho'),
(3, 'CPF', '345.678.901-23', '1992-08-15', NULL, NULL),
(26, 'CPF', '666.777.888-00', '1990-03-20', NULL, NULL),
(26, 'CERTIFICADO', 'CERT-TI-2024', '2024-01-15', '2027-01-15', 'Certificação em Segurança');

-- =================================================================
-- 21. FÉRIAS DE FUNCIONÁRIOS
-- =================================================================

INSERT INTO FeriasFuncionario (id_funcionario, periodo_aquisitivo_inicio, periodo_aquisitivo_fim, data_inicio_ferias, data_fim_ferias, dias_gozados, abono_pecuniario, status_ferias, observacoes) VALUES
(1, '2024-01-15', '2025-01-14', '2025-01-15', '2025-02-14', 30, FALSE, 'CONCLUIDAS', 'Férias anuais 2024'),
(2, '2024-03-10', '2025-03-09', '2024-07-01', '2024-07-20', 20, TRUE, 'CONCLUIDAS', '20 dias + 10 vendidos'),
(3, '2024-05-20', '2025-05-19', '2025-12-20', '2026-01-08', 20, FALSE, 'PROGRAMADAS', 'Férias fim de ano'),
(13, '2024-09-01', '2025-08-31', '2025-01-10', '2025-01-24', 15, FALSE, 'PROGRAMADAS', 'Primeira parcela'),
(26, '2024-06-10', '2025-06-09', '2025-03-01', '2025-03-30', 30, FALSE, 'PROGRAMADAS', '30 dias completos');

-- =================================================================
-- 22. PONTO ELETRÔNICO (Últimos 5 dias)
-- =================================================================

INSERT INTO PontoEletronico (id_funcionario, data_ponto, hora_entrada, hora_saida_almoco, hora_retorno_almoco, hora_saida, horas_trabalhadas, horas_extras, status_ponto, observacoes) VALUES
-- 29/10/2025
(6, '2025-10-29', '06:00:00', '10:00:00', '11:00:00', '14:00:00', 7.00, 0.00, 'NORMAL', NULL),
(7, '2025-10-29', '12:00:00', '16:00:00', '17:00:00', '20:00:00', 7.00, 0.00, 'NORMAL', NULL),
(13, '2025-10-29', '08:00:00', '12:00:00', '13:00:00', '17:00:00', 8.00, 0.00, 'NORMAL', NULL),
(1, '2025-10-29', '07:00:00', '12:00:00', '13:00:00', '18:00:00', 10.00, 0.00, 'NORMAL', NULL),

-- 30/10/2025
(6, '2025-10-30', '06:00:00', '10:00:00', '11:00:00', '14:00:00', 7.00, 0.00, 'NORMAL', NULL),
(7, '2025-10-30', NULL, NULL, NULL, NULL, 0.00, 0.00, 'FALTA', 'Atestado médico'),
(13, '2025-10-30', '08:00:00', '12:00:00', '13:00:00', '17:00:00', 8.00, 0.00, 'NORMAL', NULL),
(1, '2025-10-30', '07:00:00', '12:00:00', '13:00:00', '19:00:00', 11.00, 0.00, 'NORMAL', 'Reunião estendida'),

-- 31/10/2025
(6, '2025-10-31', '06:00:00', '10:00:00', '11:00:00', '14:30:00', 7.50, 0.50, 'NORMAL', 'Halloween'),
(7, '2025-10-31', '12:00:00', '16:00:00', '17:00:00', '20:00:00', 7.00, 0.00, 'NORMAL', NULL),
(13, '2025-10-31', '08:00:00', '12:00:00', '13:00:00', '18:00:00', 9.00, 1.00, 'NORMAL', 'Hora extra vendas'),
(1, '2025-10-31', '07:00:00', '12:00:00', '13:00:00', '18:00:00', 10.00, 0.00, 'NORMAL', NULL),

-- 01/11/2025
(6, '2025-11-01', '06:00:00', '10:00:00', '11:00:00', '14:00:00', 7.00, 0.00, 'NORMAL', NULL),
(7, '2025-11-01', '12:00:00', '16:00:00', '17:00:00', '20:00:00', 7.00, 0.00, 'NORMAL', NULL),
(13, '2025-11-01', '08:00:00', '12:00:00', '13:00:00', '19:00:00', 10.00, 2.00, 'NORMAL', 'Horas extras'),
(1, '2025-11-01', '07:00:00', '12:00:00', '13:00:00', '18:00:00', 10.00, 0.00, 'NORMAL', NULL),

-- 03/11/2025 
(6, '2025-11-03', '06:00:00', '10:00:00', '11:00:00', NULL, NULL, NULL, 'NORMAL', 'Em andamento'),
(8, '2025-11-03', '06:00:00', '10:00:00', '11:00:00', NULL, NULL, NULL, 'NORMAL', 'Em andamento'),
(11, '2025-11-03', '12:00:00', NULL, NULL, NULL, NULL, NULL, 'NORMAL', 'Em andamento'),
(13, '2025-11-03', '08:00:00', '12:00:00', '13:00:00', NULL, NULL, NULL, 'NORMAL', 'Em andamento'),
(1, '2025-11-03', '07:00:00', '12:00:00', '13:00:00', NULL, NULL, NULL, 'NORMAL', 'Em andamento');

-- =================================================================
-- FINALIZAR SCRIPT
-- =================================================================

-- Reabilitar checagens
SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================
-- SCRIPT DE INSERÇÃO COMPLETO - v2.0
-- Total aproximado de registros inseridos: ~2000+
-- 
-- RESUMO:
-- - 100 Pessoas
-- - 170 Telefones
-- - 35 Funcionários
-- - 10 Usuários
-- - 65 Clientes (40 PF + 25 PJ)
-- - 15 Fornecedores
-- - 10 Categorias
-- - 100 Produtos
-- - 15 Promoções
-- - 92 Produtos em Promoção
-- - 15 Caixas
-- - 10 Movimentações de Caixa
-- - 27 Vendas
-- - 100+ Itens de Vendas
-- - 50 Movimentações de Estoque
-- - 5 Metas de Vendas
-- - 20 Alertas
-- - 9 Históricos de Funcionários
-- - 8 Documentos de Funcionários
-- - 5 Férias de Funcionários
-- - 25 Registros de Ponto Eletrônico
--
-- =================================================================

SELECT 'Script de inserção executado com sucesso!' AS Status;

-- ================================================================
-- FUNÇÕES (FUNCTIONS) DO BANCO DE DADOS
-- Sistema S.I.G.M.A - Etapa 05
-- Requisito: 2 funções, pelo menos 1 com estrutura condicional
-- ================================================================

USE SIGMA;

-- ================================================================
-- FUNÇÃO 1: Calcular Desconto Progressivo (COM ESTRUTURA CONDICIONAL)
-- ================================================================
-- Justificativa: Implementar política de descontos por volume de compra
-- Retorna percentual de desconto baseado no valor total da compra
-- Incentiva vendas de maior valor através de descontos progressivos
--
-- Regras de Negócio:
-- - Compras >= R$ 1000,00 = 15% de desconto
-- - Compras >= R$ 500,00 = 10% de desconto
-- - Compras >= R$ 200,00 = 5% de desconto
-- - Compras < R$ 200,00 = Sem desconto
DELIMITER //

CREATE FUNCTION fn_calcular_desconto_progressivo(valor_compra DECIMAL(10,2))
    RETURNS DECIMAL(5,2)
    DETERMINISTIC
    COMMENT 'Calcula desconto progressivo baseado no valor da compra'
BEGIN
    DECLARE desconto DECIMAL(5,2);

    -- Estrutura condicional IF/ELSEIF/ELSE
    IF valor_compra >= 1000.00 THEN
        SET desconto = 0.15; -- 15% para compras >= R$1000
    ELSEIF valor_compra >= 500.00 THEN
        SET desconto = 0.10; -- 10% para compras >= R$500
    ELSEIF valor_compra >= 200.00 THEN
        SET desconto = 0.05; -- 5% para compras >= R$200
ELSE
        SET desconto = 0.00; -- Sem desconto para compras < R$200
END IF;

RETURN desconto;
END//

DELIMITER ;


-- ================================================================
-- FUNÇÃO 2: Calcular Status de Ranking do Cliente
-- ================================================================
-- Justificativa: Classificar clientes automaticamente baseado no histórico de compras
-- Retorna string com classificação (BRONZE, PRATA, OURO, PLATINA, DIAMANTE)
-- Útil para segmentação de clientes e programas de fidelidade
--
-- Regras de Negócio:
-- - Total gasto >= R$ 10.000 = DIAMANTE
-- - Total gasto >= R$ 5.000 = PLATINA
-- - Total gasto >= R$ 2.000 = OURO
-- - Total gasto >= R$ 500 = PRATA
-- - Total gasto < R$ 500 = BRONZE
DELIMITER //

CREATE FUNCTION fn_classificar_cliente(total_gasto DECIMAL(10,2))
    RETURNS VARCHAR(20)
    DETERMINISTIC
    COMMENT 'Classifica cliente baseado no total gasto'
BEGIN
    DECLARE classificacao VARCHAR(20);

    -- Estrutura condicional para classificação
    IF total_gasto >= 10000.00 THEN
        SET classificacao = 'DIAMANTE';
    ELSEIF total_gasto >= 5000.00 THEN
        SET classificacao = 'PLATINA';
    ELSEIF total_gasto >= 2000.00 THEN
        SET classificacao = 'OURO';
    ELSEIF total_gasto >= 500.00 THEN
        SET classificacao = 'PRATA';
ELSE
        SET classificacao = 'BRONZE';
END IF;

RETURN classificacao;
END//

DELIMITER ;

USE SIGMA;

-- Remover índices caso existam
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics
               WHERE table_schema = 'SIGMA'
               AND table_name = 'Produto'
               AND index_name = 'idx_produto_fornecedor_status');
SET @sqlstmt := IF(@exist > 0, 'ALTER TABLE Produto DROP INDEX idx_produto_fornecedor_status', 'SELECT "OK"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics
               WHERE table_schema = 'SIGMA'
               AND table_name = 'Venda'
               AND index_name = 'idx_venda_cliente_data');
SET @sqlstmt := IF(@exist > 0, 'ALTER TABLE Venda DROP INDEX idx_venda_cliente_data', 'SELECT "OK"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ================================================================
-- ÍNDICE 1: Produtos por Fornecedor e Status
-- ================================================================
-- Justificativa: Otimiza consultas que buscam produtos ativos de um fornecedor específico
-- Usado nas consultas avançadas (FULL OUTER JOIN) e views de estoque
-- Melhora performance ao filtrar produtos por fornecedor e status simultaneamente
CREATE INDEX idx_produto_fornecedor_status ON Produto(id_fornecedor, status);

-- ================================================================
-- ÍNDICE 2: Vendas por Cliente e Data
-- ================================================================
-- Justificativa: Acelera consultas de histórico de compras por cliente
-- Usado nas subconsultas de clientes VIP e relatórios de vendas
-- Essencial para dashboards que filtram vendas por cliente e período
CREATE INDEX idx_venda_cliente_data ON Venda(id_cliente, data_venda);


-- ================================================================
-- PROCEDIMENTOS ARMAZENADOS (STORED PROCEDURES)
-- Sistema S.I.G.M.A - Etapa 05
-- Requisito: 2 procedimentos (1 para atualização, 1 com CURSOR)
-- ================================================================

USE SIGMA;

-- ================================================================
-- PROCEDIMENTO 1: Reajustar Preços por Categoria (ATUALIZAÇÃO DE DADOS)
-- ================================================================
-- Justificativa: Permitir reajuste em massa de preços para categorias específicas
-- Aplica percentual de reajuste (positivo ou negativo) em todos os produtos ativos
-- Útil para: inflação, mudanças de fornecedor, promoções de categoria, etc.
--
-- Parâmetros:
-- - p_id_categoria: ID da categoria a ser reajustada
-- - p_percentual: Percentual de reajuste (ex: 10 = +10%, -5 = -5%)
-- - p_aplicar_custo: Se TRUE, também reajusta o preço de custo
DELIMITER //

CREATE PROCEDURE sp_reajustar_precos_categoria(
    IN p_id_categoria BIGINT,
    IN p_percentual DECIMAL(5,2),
    IN p_aplicar_custo BOOLEAN
)
BEGIN
    DECLARE v_produtos_atualizados INT DEFAULT 0;
    DECLARE v_categoria_nome VARCHAR(100);
    DECLARE v_valor_total_antes DECIMAL(15,2);
    DECLARE v_valor_total_depois DECIMAL(15,2);

    -- Validações
    IF p_id_categoria IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ID da categoria não pode ser NULL';
END IF;

    IF p_percentual = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Percentual não pode ser zero';
END IF;

    -- Verificar se categoria existe
SELECT nome INTO v_categoria_nome
FROM Categoria
WHERE id_categoria = p_id_categoria;

IF v_categoria_nome IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Categoria não encontrada';
END IF;

    -- Calcular valor total ANTES do reajuste
SELECT COALESCE(SUM(preco_venda * estoque), 0) INTO v_valor_total_antes
FROM Produto
WHERE id_categoria = p_id_categoria
  AND status = 'ATIVO';

-- Atualizar preço de venda
UPDATE Produto
SET preco_venda = ROUND(preco_venda * (1 + p_percentual / 100), 2),
    preco_custo = CASE
                      WHEN p_aplicar_custo = TRUE
                          THEN ROUND(preco_custo * (1 + p_percentual / 100), 2)
                      ELSE preco_custo
        END
WHERE id_categoria = p_id_categoria
  AND status = 'ATIVO';

-- Obter quantidade de produtos atualizados
SET v_produtos_atualizados = ROW_COUNT();

    -- Calcular valor total DEPOIS do reajuste
SELECT COALESCE(SUM(preco_venda * estoque), 0) INTO v_valor_total_depois
FROM Produto
WHERE id_categoria = p_id_categoria
  AND status = 'ATIVO';

-- Retornar resultado detalhado
SELECT
    v_categoria_nome AS categoria,
    v_produtos_atualizados AS produtos_reajustados,
    p_percentual AS percentual_aplicado,
    p_aplicar_custo AS reajustou_custo,
    ROUND(v_valor_total_antes, 2) AS valor_estoque_antes,
    ROUND(v_valor_total_depois, 2) AS valor_estoque_depois,
    ROUND(v_valor_total_depois - v_valor_total_antes, 2) AS diferenca_valor,
    NOW() AS data_hora_reajuste;
END//

DELIMITER ;


-- ================================================================
-- PROCEDIMENTO 2: Gerar Relatório de Produtos Críticos (COM CURSOR)
-- ================================================================
-- Justificativa: Identificar produtos que necessitam ação imediata
-- Utiliza CURSOR para processar individualmente cada produto crítico
-- Gera relatório detalhado com recomendações específicas de ação
--
-- Produtos críticos:
-- - Estoque zerado
-- - Estoque abaixo do mínimo
-- - Produtos próximos ao vencimento (30 dias)
-- - Produtos sem movimentação há muito tempo
DELIMITER //

CREATE PROCEDURE sp_relatorio_produtos_criticos()
BEGIN
    -- Declaração de variáveis
    DECLARE v_id_produto BIGINT;
    DECLARE v_nome VARCHAR(255);
    DECLARE v_estoque INT;
    DECLARE v_estoque_minimo INT;
    DECLARE v_preco_custo DECIMAL(10,2);
    DECLARE v_preco_venda DECIMAL(10,2);
    DECLARE v_categoria VARCHAR(100);
    DECLARE v_fornecedor VARCHAR(255);
    DECLARE v_telefone_fornecedor VARCHAR(20);
    DECLARE v_data_validade DATE;
    DECLARE v_data_cadastro TIMESTAMP;
    DECLARE done INT DEFAULT FALSE;

    -- Cursor para produtos críticos
    DECLARE cur_produtos_criticos CURSOR FOR
SELECT
    p.id_produto,
    p.nome,
    p.estoque,
    p.estoque_minimo,
    p.preco_custo,
    p.preco_venda,
    COALESCE(c.nome, 'Sem Categoria') AS categoria_nome,
    COALESCE(f.nome_fantasia, 'Sem Fornecedor') AS fornecedor_nome,
    COALESCE(f.telefone, 'N/A') AS fornecedor_telefone,
    p.data_validade,
    p.data_cadastro
FROM Produto p
         LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
         LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
WHERE p.status = 'ATIVO'
  AND (
    p.estoque = 0  -- Sem estoque
        OR p.estoque <= p.estoque_minimo  -- Estoque baixo
        OR (p.data_validade IS NOT NULL AND p.data_validade <= DATE_ADD(CURDATE(), INTERVAL 30 DAY))  -- Vencendo
    )
ORDER BY
    CASE
        WHEN p.estoque = 0 THEN 1
        WHEN p.data_validade IS NOT NULL AND p.data_validade <= CURDATE() THEN 2
        WHEN p.estoque <= p.estoque_minimo THEN 3
        ELSE 4
        END,
    p.estoque ASC;

-- Handler para fim do cursor
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Criar tabela temporária
    DROP TEMPORARY TABLE IF EXISTS temp_produtos_criticos;
    CREATE TEMPORARY TABLE temp_produtos_criticos (
        id_produto BIGINT,
        nome_produto VARCHAR(255),
        categoria VARCHAR(100),
        estoque_atual INT,
        estoque_minimo INT,
        deficit INT,
        preco_custo DECIMAL(10,2),
        preco_venda DECIMAL(10,2),
        valor_reposicao_necessaria DECIMAL(10,2),
        fornecedor VARCHAR(255),
        telefone_fornecedor VARCHAR(20),
        data_validade DATE,
        dias_ate_vencimento INT,
        dias_desde_cadastro INT,
        criticidade VARCHAR(50),
        motivo_criticidade TEXT,
        acao_recomendada TEXT,
        prioridade INT
    );

    -- Abrir cursor
OPEN cur_produtos_criticos;

-- Loop através dos produtos
read_loop: LOOP
        FETCH cur_produtos_criticos INTO
            v_id_produto, v_nome, v_estoque, v_estoque_minimo, v_preco_custo,
            v_preco_venda, v_categoria, v_fornecedor, v_telefone_fornecedor,
            v_data_validade, v_data_cadastro;

        IF done THEN
            LEAVE read_loop;
END IF;

        -- Processar cada produto e inserir na tabela temporária
INSERT INTO temp_produtos_criticos
SELECT
    v_id_produto,
    v_nome,
    v_categoria,
    v_estoque,
    v_estoque_minimo,
    GREATEST(0, v_estoque_minimo - v_estoque) AS deficit,
    v_preco_custo,
    v_preco_venda,
    ROUND((v_estoque_minimo - v_estoque) * v_preco_custo, 2) AS valor_reposicao,
    v_fornecedor,
    v_telefone_fornecedor,
    v_data_validade,
    CASE
        WHEN v_data_validade IS NOT NULL
            THEN DATEDIFF(v_data_validade, CURDATE())
        ELSE NULL
        END AS dias_vencimento,
    DATEDIFF(CURDATE(), v_data_cadastro) AS dias_cadastro,
    -- Classificação de criticidade
    CASE
        WHEN v_estoque = 0 THEN 'CRÍTICO - SEM ESTOQUE'
        WHEN v_data_validade IS NOT NULL AND v_data_validade <= CURDATE() THEN 'CRÍTICO - VENCIDO'
        WHEN v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'URGENTE - VENCE EM 7 DIAS'
        WHEN v_estoque < (v_estoque_minimo * 0.5) THEN 'URGENTE - ESTOQUE MUITO BAIXO'
        WHEN v_estoque <= v_estoque_minimo THEN 'ATENÇÃO - ESTOQUE BAIXO'
        ELSE 'VERIFICAR'
        END AS criticidade,
    -- Motivo
    CONCAT_WS('; ',
              IF(v_estoque = 0, 'Produto sem estoque', NULL),
              IF(v_estoque > 0 AND v_estoque <= v_estoque_minimo,
                 CONCAT('Estoque abaixo do mínimo (', v_estoque, '/', v_estoque_minimo, ')'), NULL),
              IF(v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 30 DAY),
                 CONCAT('Vencimento próximo (', DATEDIFF(v_data_validade, CURDATE()), ' dias)'), NULL)
    ) AS motivo,
    -- Ação recomendada
    CASE
        WHEN v_estoque = 0 THEN
            CONCAT('URGENTE: Repor ', v_estoque_minimo, ' unidades imediatamente. Contatar ', v_fornecedor)
        WHEN v_data_validade IS NOT NULL AND v_data_validade <= CURDATE() THEN
            'URGENTE: Produto vencido - Remover do estoque e registrar perda'
        WHEN v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN
            'URGENTE: Aplicar promoção ou desconto para liquidar estoque antes do vencimento'
        WHEN v_estoque <= v_estoque_minimo THEN
            CONCAT('Repor ', (v_estoque_minimo - v_estoque), ' unidades. Valor necessário: R$ ',
                   ROUND((v_estoque_minimo - v_estoque) * v_preco_custo, 2))
        ELSE 'Monitorar'
        END AS acao,
    -- Prioridade numérica
    CASE
        WHEN v_estoque = 0 THEN 1
        WHEN v_data_validade IS NOT NULL AND v_data_validade <= CURDATE() THEN 1
        WHEN v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 2
        WHEN v_estoque < (v_estoque_minimo * 0.5) THEN 2
        WHEN v_estoque <= v_estoque_minimo THEN 3
        ELSE 4
        END AS prioridade;

END LOOP;

    -- Fechar cursor
CLOSE cur_produtos_criticos;

-- Retornar resultados ordenados por prioridade
SELECT
    *,
    criticidade AS status_visual
FROM temp_produtos_criticos
ORDER BY prioridade ASC, deficit DESC, dias_ate_vencimento ASC;

-- Resumo executivo
SELECT
    COUNT(*) AS total_produtos_criticos,
    SUM(CASE WHEN criticidade LIKE 'CRÍTICO%' THEN 1 ELSE 0 END) AS criticos,
    SUM(CASE WHEN criticidade LIKE 'URGENTE%' THEN 1 ELSE 0 END) AS urgentes,
    SUM(CASE WHEN criticidade LIKE 'ATENÇÃO%' THEN 1 ELSE 0 END) AS atencao,
    ROUND(SUM(valor_reposicao_necessaria), 2) AS valor_total_reposicao,
    NOW() AS data_hora_relatorio
FROM temp_produtos_criticos;

-- Limpar tabela temporária
DROP TEMPORARY TABLE IF EXISTS temp_produtos_criticos;
END//

DELIMITER ;


-- ================================================================
-- EXEMPLOS DE USO DOS PROCEDIMENTOS
-- ================================================================

-- Exemplo 1: Aumentar 10% nos preços da categoria 1 (apenas venda)
-- CALL sp_reajustar_precos_categoria(1, 10.00, FALSE);

-- Exemplo 2: Reduzir 5% nos preços da categoria 2 (venda e custo)
-- CALL sp_reajustar_precos_categoria(2, -5.00, TRUE);

-- Exemplo 3: Gerar relatório de produtos críticos
-- CALL sp_relatorio_produtos_criticos();

-- Exemplo 4: Agendar reajuste de preços (pode ser usado em evento)
-- CALL sp_reajustar_precos_categoria(1, 3.50, FALSE);


   -- ================================================================
-- TABELA DE LOGS E TRIGGERS (GATILHOS)
-- Sistema S.I.G.M.A - Etapa 05
-- Requisito: 2 triggers com justificativa, 1 deve atualizar tabela de logs
-- ================================================================

USE SIGMA;

-- ================================================================
-- TABELA: AuditoriaLog (Logs de Auditoria)
-- ================================================================
-- Justificativa: Rastreabilidade de todas as alterações críticas no sistema
-- Armazena histórico completo de INSERT, UPDATE e DELETE em tabelas importantes
-- Essencial para auditoria, conformidade e recuperação de dados
CREATE TABLE IF NOT EXISTS AuditoriaLog (
                                            id_log BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            tabela_afetada VARCHAR(50) NOT NULL,
    operacao ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    id_registro BIGINT,
    id_usuario BIGINT,
    dados_antigos TEXT,
    dados_novos TEXT,
    ip_origem VARCHAR(45),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descricao VARCHAR(500),

    INDEX idx_tabela_operacao (tabela_afetada, operacao),
    INDEX idx_data_hora (data_hora),
    INDEX idx_id_registro (id_registro),

    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_pessoa) ON DELETE SET NULL
    ) COMMENT 'Log de auditoria para rastreamento de alterações no banco de dados';


-- ================================================================
-- TRIGGER 1: Atualizar Estoque ao Registrar Venda (Baixa Automática)
-- ================================================================
-- Justificativa: Garantir sincronização automática entre vendas e estoque
-- Ao inserir um item de venda, o estoque é baixado automaticamente
-- Evita inconsistências e garante controle em tempo real do estoque
--
-- Funcionamento:
-- - Quando VendaItem é inserido, diminui estoque do Produto
-- - Registra movimentação no log de auditoria
-- - Valida se há estoque suficiente antes da baixa
DELIMITER //

CREATE TRIGGER trg_baixar_estoque_venda
    AFTER INSERT ON VendaItem
    FOR EACH ROW
BEGIN
    DECLARE v_estoque_atual INT;
    DECLARE v_produto_nome VARCHAR(255);

    -- Buscar estoque atual e nome do produto
    SELECT estoque, nome INTO v_estoque_atual, v_produto_nome
    FROM Produto
    WHERE id_produto = NEW.id_produto;

    -- Verificar se há estoque suficiente
    IF v_estoque_atual < NEW.quantidade THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Estoque insuficiente para realizar a venda';
END IF;

-- Atualizar estoque do produto
UPDATE Produto
SET estoque = estoque - NEW.quantidade
WHERE id_produto = NEW.id_produto;

-- Registrar no log de auditoria
INSERT INTO AuditoriaLog (
    tabela_afetada,
    operacao,
    id_registro,
    dados_antigos,
    dados_novos,
    descricao
) VALUES (
             'Produto',
             'UPDATE',
             NEW.id_produto,
             CONCAT('Estoque: ', v_estoque_atual, ' | Produto: ', v_produto_nome),
             CONCAT('Estoque: ', (v_estoque_atual - NEW.quantidade), ' | Produto: ', v_produto_nome,
                    ' | Venda ID: ', NEW.id_venda),
             CONCAT('Baixa automática de ', NEW.quantidade, ' unidade(s) pela venda #', NEW.id_venda)
         );

-- Registrar movimentação de estoque
INSERT INTO MovimentacaoEstoque (
    id_produto,
    data_movimentacao,
    tipo,
    quantidade,
    estoque_anterior,
    estoque_atual,
    observacao
) VALUES (
             NEW.id_produto,
             NOW(),
             'SALE',
             NEW.quantidade,
             v_estoque_atual,
             v_estoque_atual - NEW.quantidade,
             CONCAT('Venda #', NEW.id_venda, ' - Item #', NEW.id_venda_item)
         );
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 2: Auditoria de Alterações em Produtos (LOG COMPLETO)
-- ================================================================
-- Justificativa: Rastrear TODAS as alterações em produtos para auditoria
-- Registra quem alterou, o que foi alterado e quando
-- Fundamental para: análise de histórico de preços, controle de estoque, compliance
--
-- Funcionalidade:
-- - Compara valores OLD vs NEW
-- - Identifica exatamente quais campos foram alterados
-- - Registra alterações de forma detalhada na tabela AuditoriaLog
DELIMITER //

CREATE TRIGGER trg_auditoria_produto_update
    AFTER UPDATE ON Produto
    FOR EACH ROW
BEGIN
    DECLARE v_alteracoes TEXT;
    DECLARE v_tem_alteracao BOOLEAN DEFAULT FALSE;

    SET v_alteracoes = '';

    -- Detectar alteração no nome
    IF OLD.nome != NEW.nome THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Nome: "', OLD.nome, '" → "', NEW.nome, '"; ');
        SET v_tem_alteracao = TRUE;
END IF;

-- Detectar alteração no preço de venda
IF OLD.preco_venda != NEW.preco_venda THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Preço Venda: R$',
                                  FORMAT(OLD.preco_venda, 2), ' → R$', FORMAT(NEW.preco_venda, 2), '; ');
        SET v_tem_alteracao = TRUE;
END IF;

    -- Detectar alteração no preço de custo
    IF COALESCE(OLD.preco_custo, 0) != COALESCE(NEW.preco_custo, 0) THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Preço Custo: R$',
                                  FORMAT(COALESCE(OLD.preco_custo, 0), 2), ' → R$',
                                  FORMAT(COALESCE(NEW.preco_custo, 0), 2), '; ');
        SET v_tem_alteracao = TRUE;
END IF;

    -- Detectar alteração no estoque (exceto se for trigger de venda)
    IF OLD.estoque != NEW.estoque THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Estoque: ', OLD.estoque, ' → ', NEW.estoque, '; ');
        SET v_tem_alteracao = TRUE;
END IF;

    -- Detectar alteração na categoria
    IF COALESCE(OLD.id_categoria, 0) != COALESCE(NEW.id_categoria, 0) THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Categoria ID: ',
                                  COALESCE(OLD.id_categoria, 'NULL'), ' → ',
                                  COALESCE(NEW.id_categoria, 'NULL'), '; ');
        SET v_tem_alteracao = TRUE;
END IF;

    -- Detectar alteração no fornecedor
    IF COALESCE(OLD.id_fornecedor, 0) != COALESCE(NEW.id_fornecedor, 0) THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Fornecedor ID: ',
                                  COALESCE(OLD.id_fornecedor, 'NULL'), ' → ',
                                  COALESCE(NEW.id_fornecedor, 'NULL'), '; ');
        SET v_tem_alteracao = TRUE;
END IF;

    -- Detectar alteração no status
    IF OLD.status != NEW.status THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Status: ', OLD.status, ' → ', NEW.status, '; ');
        SET v_tem_alteracao = TRUE;
END IF;

    -- Detectar alteração na margem de lucro
    IF COALESCE(OLD.margem_lucro, 0) != COALESCE(NEW.margem_lucro, 0) THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Margem Lucro: ',
                                  FORMAT(COALESCE(OLD.margem_lucro, 0), 2), '% → ',
                                  FORMAT(COALESCE(NEW.margem_lucro, 0), 2), '%; ');
        SET v_tem_alteracao = TRUE;
END IF;

    -- Registrar no log apenas se houve alteração significativa
    IF v_tem_alteracao THEN
        INSERT INTO AuditoriaLog (
            tabela_afetada,
            operacao,
            id_registro,
            dados_antigos,
            dados_novos,
            descricao
        ) VALUES (
            'Produto',
            'UPDATE',
            NEW.id_produto,
            CONCAT('ID: ', OLD.id_produto, ' | ', v_alteracoes),
            CONCAT('ID: ', NEW.id_produto, ' | Produto: "', NEW.nome, '" | Status: ', NEW.status),
            CONCAT('Produto "', NEW.nome, '" atualizado - Alterações: ', v_alteracoes)
        );
END IF;
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 3 (BONUS): Auditoria de Inserção de Produtos
-- ================================================================
-- Registra quando novos produtos são cadastrados no sistema
DELIMITER //

CREATE TRIGGER trg_auditoria_produto_insert
    AFTER INSERT ON Produto
    FOR EACH ROW
BEGIN
    INSERT INTO AuditoriaLog (
        tabela_afetada,
        operacao,
        id_registro,
        dados_novos,
        descricao
    ) VALUES (
                 'Produto',
                 'INSERT',
                 NEW.id_produto,
                 CONCAT(
                         'Nome: "', NEW.nome, '"',
                         ' | Marca: ', COALESCE(NEW.marca, 'N/A'),
                         ' | Preço Venda: R$', FORMAT(NEW.preco_venda, 2),
                         ' | Preço Custo: R$', FORMAT(COALESCE(NEW.preco_custo, 0), 2),
                         ' | Estoque: ', NEW.estoque,
                         ' | Categoria ID: ', COALESCE(NEW.id_categoria, 'NULL'),
                         ' | Status: ', NEW.status
                 ),
                 CONCAT('Novo produto cadastrado: "', NEW.nome, '"')
             );
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 4 (BONUS): Auditoria de Exclusão de Produtos
-- ================================================================
-- Registra quando produtos são removidos do sistema
DELIMITER //

CREATE TRIGGER trg_auditoria_produto_delete
    BEFORE DELETE ON Produto
    FOR EACH ROW
BEGIN
    INSERT INTO AuditoriaLog (
        tabela_afetada,
        operacao,
        id_registro,
        dados_antigos,
        descricao
    ) VALUES (
                 'Produto',
                 'DELETE',
                 OLD.id_produto,
                 CONCAT(
                         'Nome: "', OLD.nome, '"',
                         ' | Preço Venda: R$', FORMAT(OLD.preco_venda, 2),
                         ' | Estoque: ', OLD.estoque,
                         ' | Status: ', OLD.status
                 ),
                 CONCAT('Produto "', OLD.nome, '" removido do sistema')
             );
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 5: Atualizar dados do Cliente ao finalizar Venda
-- ================================================================
-- Justificativa: Manter atualizados automaticamente os dados do cliente
-- Incrementa quantidade_compras, atualiza total_gasto e data_ultima_compra
-- quando uma venda é concluída
DELIMITER //

CREATE TRIGGER trg_venda_atualizar_cliente
    AFTER INSERT ON Venda
    FOR EACH ROW
BEGIN
    IF NEW.id_cliente IS NOT NULL AND NEW.status = 'CONCLUIDA' THEN
        UPDATE Cliente
        SET total_gasto = total_gasto + NEW.valor_final,
            data_ultima_compra = DATE(NEW.data_venda),
            quantidade_compras = quantidade_compras + 1
        WHERE id_pessoa = NEW.id_cliente;
    END IF;
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 6: Reverter dados do Cliente ao cancelar Venda
-- ================================================================
-- Justificativa: Reverter os dados do cliente quando uma venda é cancelada
-- Decrementa quantidade_compras e reverte o total_gasto
DELIMITER //

CREATE TRIGGER trg_venda_cancelada_atualizar_cliente
    AFTER UPDATE ON Venda
    FOR EACH ROW
BEGIN
    IF OLD.status = 'CONCLUIDA' AND NEW.status = 'CANCELADA' AND NEW.id_cliente IS NOT NULL THEN
        UPDATE Cliente
        SET total_gasto = total_gasto - NEW.valor_final,
            quantidade_compras = GREATEST(quantidade_compras - 1, 0)
        WHERE id_pessoa = NEW.id_cliente;
    END IF;
END//

DELIMITER ;


-- ================================================================
-- CONSULTAS ÚTEIS PARA AUDITORIA
-- ================================================================

-- Ver logs das últimas 24 horas
-- SELECT * FROM AuditoriaLog
-- WHERE data_hora >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
-- ORDER BY data_hora DESC;

-- Ver histórico de alterações de um produto específico
-- SELECT
--     id_log,
--     operacao,
--     descricao,
--     dados_antigos,
--     dados_novos,
--     data_hora
-- FROM AuditoriaLog
-- WHERE tabela_afetada = 'Produto'
--   AND id_registro = 1
-- ORDER BY data_hora DESC;

-- Ver todas as alterações de preço
-- SELECT * FROM AuditoriaLog
-- WHERE tabela_afetada = 'Produto'
--   AND (dados_antigos LIKE '%Preço Venda%' OR dados_novos LIKE '%Preço Venda%')
-- ORDER BY data_hora DESC;

-- Estatísticas de auditoria
-- SELECT
--     tabela_afetada,
--     operacao,
--     COUNT(*) AS total_operacoes,
--     MAX(data_hora) AS ultima_operacao
-- FROM AuditoriaLog
-- GROUP BY tabela_afetada, operacao
-- ORDER BY total_operacoes DESC;


USE SIGMA;

-- ================================================================
-- VIEW 1: Análise Completa de Vendas com Detalhamento
-- ================================================================
-- Justificativa: Consolida informações de 4 tabelas (Venda, Cliente, Pessoa, Funcionario)
-- para análise gerencial completa de vendas, incluindo perfil do cliente e vendedor
-- Útil para relatórios de desempenho, comissões e análise de comportamento de compra
CREATE OR REPLACE VIEW vw_analise_vendas_completa AS
SELECT
    -- Dados da Venda
    v.id_venda,
    v.data_venda,
    DATE(v.data_venda) AS data_venda_simples,
    v.valor_total,
    v.desconto,
    v.valor_final,
    v.metodo_pagamento,
    v.status AS status_venda,

    -- Dados do Cliente
    c.id_pessoa AS id_cliente,
    pc.nome AS cliente_nome,
    pc.email AS cliente_email,
    pc.cidade AS cliente_cidade,
    c.tipo_pessoa,
    c.ranking AS ranking_cliente,
    c.total_gasto AS total_gasto_cliente,

    -- Dados do Funcionário/Vendedor
    f.id_pessoa AS id_funcionario,
    pf.nome AS vendedor_nome,
    f.cargo AS vendedor_cargo,
    f.setor AS vendedor_setor,

    -- Dados do Caixa
    cx.id_caixa,
    cx.status AS status_caixa,

    -- Métricas Calculadas
    ROUND((v.desconto / NULLIF(v.valor_total, 0)) * 100, 2) AS percentual_desconto,
    ROUND(v.valor_final / NULLIF((SELECT COUNT(*) FROM VendaItem WHERE id_venda = v.id_venda), 0), 2) AS valor_medio_item,
    (SELECT COUNT(*) FROM VendaItem WHERE id_venda = v.id_venda) AS quantidade_itens,
    DAYNAME(v.data_venda) AS dia_semana_venda,
    HOUR(v.data_venda) AS hora_venda
FROM Venda v
    INNER JOIN Cliente c ON v.id_cliente = c.id_pessoa
    INNER JOIN Pessoa pc ON c.id_pessoa = pc.id_pessoa
    INNER JOIN Funcionario f ON v.id_funcionario = f.id_pessoa
    INNER JOIN Pessoa pf ON f.id_pessoa = pf.id_pessoa
    LEFT JOIN Caixa cx ON v.id_caixa = cx.id_caixa;


-- ================================================================
-- VIEW 2: Inventário Completo com Análise de Rentabilidade
-- ================================================================
-- Justificativa: Integra 4 tabelas (Produto, Categoria, Fornecedor, Pessoa)
-- para visão 360° do estoque com análise financeira e logística
-- Essencial para decisões de compra, reposição e precificação
CREATE OR REPLACE VIEW vw_inventario_rentabilidade AS
SELECT
    -- Dados do Produto
    p.id_produto,
    p.nome AS produto_nome,
    p.marca,
    p.descricao,
    p.codigo_barras,
    p.codigo_interno,
    p.status AS status_produto,

    -- Preços e Margens
    p.preco_custo,
    p.preco_venda,
    p.margem_lucro AS margem_lucro_percentual,
    ROUND(p.preco_venda - p.preco_custo, 2) AS lucro_unitario,

    -- Estoque
    p.estoque,
    p.estoque_minimo,
    p.estoque_maximo,
    p.unidade_medida,
    p.localizacao_prateleira,

    -- Valores Totais
    ROUND(p.preco_custo * p.estoque, 2) AS valor_estoque_custo,
    ROUND(p.preco_venda * p.estoque, 2) AS valor_estoque_venda,
    ROUND((p.preco_venda - p.preco_custo) * p.estoque, 2) AS lucro_potencial_estoque,

    -- Categoria
    c.id_categoria,
    c.nome AS categoria_nome,
    c.descricao AS categoria_descricao,
    c.status AS status_categoria,

    -- Fornecedor
    f.id_fornecedor,
    f.nome_fantasia AS fornecedor_nome,
    f.razao_social AS fornecedor_razao_social,
    f.cnpj AS fornecedor_cnpj,
    f.telefone AS fornecedor_telefone,
    f.email AS fornecedor_email,
    f.cidade AS fornecedor_cidade,
    f.estado AS fornecedor_estado,
    f.prazo_entrega_dias,
    f.avaliacao AS avaliacao_fornecedor,
    f.status AS status_fornecedor,

    -- Status de Alerta
    CASE
        WHEN p.estoque = 0 THEN 'CRÍTICO - SEM ESTOQUE'
        WHEN p.estoque <= p.estoque_minimo THEN 'ALERTA - ESTOQUE BAIXO'
        WHEN p.estoque >= p.estoque_maximo THEN 'ATENÇÃO - ESTOQUE ALTO'
        ELSE 'ESTOQUE NORMAL'
        END AS status_estoque,

    CASE
        WHEN p.estoque <= p.estoque_minimo
            THEN CONCAT('Repor ', (p.estoque_minimo - p.estoque + 10), ' unidades')
        ELSE 'Estoque adequado'
        END AS acao_recomendada,

    -- Análise de Rentabilidade
    CASE
        WHEN p.margem_lucro >= 50 THEN 'ALTA RENTABILIDADE'
        WHEN p.margem_lucro >= 30 THEN 'RENTABILIDADE MÉDIA'
        WHEN p.margem_lucro >= 15 THEN 'RENTABILIDADE BAIXA'
        ELSE 'RENTABILIDADE CRÍTICA'
        END AS classificacao_rentabilidade,

    p.data_cadastro,
    DATEDIFF(CURDATE(), p.data_cadastro) AS dias_desde_cadastro

FROM Produto p
         LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
         LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor;




