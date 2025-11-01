-- ================================================================
-- TABELA DE LOGS E TRIGGERS (GATILHOS)
-- Sistema S.I.G.M.A - Etapa 05
-- ================================================================

-- ================================================================
-- TABELA: LogsAuditoria
-- ================================================================
-- Armazena histórico de alterações para auditoria
CREATE TABLE IF NOT EXISTS LogsAuditoria (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    tabela VARCHAR(50) NOT NULL,
    operacao ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    id_usuario INT,
    registro_id INT,
    dados_antigos TEXT,
    dados_novos TEXT,
    ip_origem VARCHAR(45),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descricao VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE SET NULL,
    INDEX idx_tabela_operacao (tabela, operacao),
    INDEX idx_data_hora (data_hora)
);


-- ================================================================
-- TRIGGER 1: Atualizar Estoque Automaticamente ao Registrar Venda
-- ================================================================
-- Quando um item de venda é inserido, baixa automaticamente do estoque
DELIMITER //

CREATE TRIGGER trg_atualizar_estoque_venda
AFTER INSERT ON ItemVenda
FOR EACH ROW
BEGIN
    -- Atualizar quantidade em estoque
    UPDATE Produto
    SET quantidade_estoque = quantidade_estoque - NEW.quantidade
    WHERE id_produto = NEW.id_produto;

    -- Registrar log da movimentação
    INSERT INTO LogsAuditoria (
        tabela, 
        operacao, 
        registro_id, 
        dados_novos,
        descricao
    )
    VALUES (
        'Produto',
        'UPDATE',
        NEW.id_produto,
        CONCAT('Estoque reduzido em ', NEW.quantidade, ' unidades pela venda ID ', NEW.id_venda),
        'Baixa automática de estoque por venda'
    );
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 2: Registrar Alterações em Produtos (LOG DE AUDITORIA)
-- ================================================================
-- Registra todas as alterações feitas em produtos para rastreabilidade
DELIMITER //

CREATE TRIGGER trg_log_produto_update
AFTER UPDATE ON Produto
FOR EACH ROW
BEGIN
    DECLARE alteracoes TEXT;
    DECLARE tem_alteracao BOOLEAN DEFAULT FALSE;

    SET alteracoes = '';

    -- Verificar alteração no nome
    IF OLD.nome != NEW.nome THEN
        SET alteracoes = CONCAT(alteracoes, 'Nome: "', OLD.nome, '" → "', NEW.nome, '"; ');
        SET tem_alteracao = TRUE;
    END IF;

    -- Verificar alteração no preço de venda
    IF OLD.preco_venda != NEW.preco_venda THEN
        SET alteracoes = CONCAT(alteracoes, 'Preço Venda: R$', OLD.preco_venda, ' → R$', NEW.preco_venda, '; ');
        SET tem_alteracao = TRUE;
    END IF;

    -- Verificar alteração no preço de custo
    IF OLD.preco_custo != NEW.preco_custo THEN
        SET alteracoes = CONCAT(alteracoes, 'Preço Custo: R$', OLD.preco_custo, ' → R$', NEW.preco_custo, '; ');
        SET tem_alteracao = TRUE;
    END IF;

    -- Verificar alteração no estoque (apenas se não foi trigger de venda)
    IF OLD.quantidade_estoque != NEW.quantidade_estoque THEN
        SET alteracoes = CONCAT(alteracoes, 'Estoque: ', OLD.quantidade_estoque, ' → ', NEW.quantidade_estoque, '; ');
        SET tem_alteracao = TRUE;
    END IF;

    -- Verificar alteração na categoria
    IF OLD.id_categoria != NEW.id_categoria THEN
        SET alteracoes = CONCAT(alteracoes, 'Categoria ID: ', OLD.id_categoria, ' → ', NEW.id_categoria, '; ');
        SET tem_alteracao = TRUE;
    END IF;

    -- Verificar alteração no fornecedor
    IF COALESCE(OLD.id_fornecedor, 0) != COALESCE(NEW.id_fornecedor, 0) THEN
        SET alteracoes = CONCAT(alteracoes, 'Fornecedor ID: ', COALESCE(OLD.id_fornecedor, 'NULL'), ' → ', COALESCE(NEW.id_fornecedor, 'NULL'), '; ');
        SET tem_alteracao = TRUE;
    END IF;

    -- Registrar log apenas se houve alteração relevante
    IF tem_alteracao THEN
        INSERT INTO LogsAuditoria (
            tabela, 
            operacao, 
            registro_id, 
            dados_antigos, 
            dados_novos,
            descricao
        )
        VALUES (
            'Produto',
            'UPDATE',
            NEW.id_produto,
            CONCAT('ID:', OLD.id_produto, ' | ', alteracoes),
            CONCAT('ID:', NEW.id_produto, ' | Produto: ', NEW.nome),
            'Atualização de produto'
        );
    END IF;
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 3 (BONUS): Registrar Inserção de Novos Produtos
-- ================================================================
DELIMITER //

CREATE TRIGGER trg_log_produto_insert
AFTER INSERT ON Produto
FOR EACH ROW
BEGIN
    INSERT INTO LogsAuditoria (
        tabela, 
        operacao, 
        registro_id, 
        dados_novos,
        descricao
    )
    VALUES (
        'Produto',
        'INSERT',
        NEW.id_produto,
        CONCAT(
            'Nome: ', NEW.nome, 
            ' | Preço Venda: R$', NEW.preco_venda,
            ' | Preço Custo: R$', NEW.preco_custo,
            ' | Estoque: ', NEW.quantidade_estoque,
            ' | Categoria ID: ', NEW.id_categoria
        ),
        'Novo produto cadastrado'
    );
END//

DELIMITER ;


-- ================================================================
-- TRIGGER 4 (BONUS): Registrar Exclusão de Produtos
-- ================================================================
DELIMITER //

CREATE TRIGGER trg_log_produto_delete
BEFORE DELETE ON Produto
FOR EACH ROW
BEGIN
    INSERT INTO LogsAuditoria (
        tabela, 
        operacao, 
        registro_id, 
        dados_antigos,
        descricao
    )
    VALUES (
        'Produto',
        'DELETE',
        OLD.id_produto,
        CONCAT(
            'Nome: ', OLD.nome, 
            ' | Preço Venda: R$', OLD.preco_venda,
            ' | Estoque: ', OLD.quantidade_estoque
        ),
        'Produto excluído do sistema'
    );
END//

DELIMITER ;


-- ================================================================
-- CONSULTAS ÚTEIS PARA LOGS
-- ================================================================

-- Ver todos os logs das últimas 24h
-- SELECT * FROM LogsAuditoria 
-- WHERE data_hora >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
-- ORDER BY data_hora DESC;

-- Ver logs de uma tabela específica
-- SELECT * FROM LogsAuditoria 
-- WHERE tabela = 'Produto'
-- ORDER BY data_hora DESC
-- LIMIT 50;

-- Ver logs de um produto específico
-- SELECT * FROM LogsAuditoria 
-- WHERE tabela = 'Produto' AND registro_id = 1
-- ORDER BY data_hora DESC;
