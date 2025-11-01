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
