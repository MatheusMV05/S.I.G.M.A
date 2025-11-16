-- ================================================================
-- SCRIPT COMPLETO - ETAPAS 04 E 05
-- Sistema S.I.G.M.A - Projeto de Banco de Dados
-- ================================================================
-- IMPORTANTE: Executar este script APÓS o scriptDeCriaçãoDasTabelas.sql
-- 
-- Conteúdo:
-- 1. ETAPA 04 - Índices
-- 2. ETAPA 04 - Consultas Avançadas (Anti Join, Full Outer Join, Subconsultas)
-- 3. ETAPA 04 - Views (Visões)
-- 4. ETAPA 05 - Tabela de Auditoria
-- 5. ETAPA 05 - Funções
-- 6. ETAPA 05 - Procedimentos
-- 7. ETAPA 05 - Triggers
-- ================================================================

USE SIGMA;

-- ================================================================
-- ETAPA 04 - PARTE 1: ÍNDICES
-- ================================================================
-- Requisito: 2 novos índices utilizados nas consultas/views

-- Verificar e remover índices se existirem
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

-- Índice 1: Produtos por Fornecedor e Status
-- Justificativa: Otimiza consultas que buscam produtos ativos de um fornecedor específico
CREATE INDEX idx_produto_fornecedor_status ON Produto(id_fornecedor, status);

-- Índice 2: Vendas por Cliente e Data
-- Justificativa: Acelera consultas de histórico de compras por cliente
CREATE INDEX idx_venda_cliente_data ON Venda(id_cliente, data_venda);


-- ================================================================
-- ETAPA 04 - PARTE 2: VIEWS (VISÕES)
-- ================================================================
-- Requisito: 2 views com pelo menos 3 joins e justificativa semântica

-- VIEW 1: Análise Completa de Vendas
-- Justificativa: Consolida 4 tabelas para análise gerencial de vendas
DROP VIEW IF EXISTS vw_analise_vendas_completa;
CREATE VIEW vw_analise_vendas_completa AS
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


-- VIEW 2: Inventário Completo com Análise de Rentabilidade
-- Justificativa: Integra 4 tabelas para visão 360° do estoque
DROP VIEW IF EXISTS vw_inventario_rentabilidade;
CREATE VIEW vw_inventario_rentabilidade AS
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




-- ================================================================
-- ETAPA 05 - PARTE 2: FUNÇÕES
-- ================================================================
-- Requisito: 2 funções, pelo menos 1 com estrutura condicional

DELIMITER //

-- FUNÇÃO 1: Calcular Desconto Progressivo (COM ESTRUTURA CONDICIONAL)
DROP FUNCTION IF EXISTS fn_calcular_desconto_progressivo//
CREATE FUNCTION fn_calcular_desconto_progressivo(valor_compra DECIMAL(10,2))
RETURNS DECIMAL(5,2)
DETERMINISTIC
COMMENT 'Calcula desconto progressivo baseado no valor da compra'
BEGIN
    DECLARE desconto DECIMAL(5,2);

    IF valor_compra >= 1000.00 THEN
        SET desconto = 0.15; -- 15%
    ELSEIF valor_compra >= 500.00 THEN
        SET desconto = 0.10; -- 10%
    ELSEIF valor_compra >= 200.00 THEN
        SET desconto = 0.05; -- 5%
    ELSE
        SET desconto = 0.00; -- 0%
    END IF;

    RETURN desconto;
END//

-- FUNÇÃO 2: Classificar Cliente por Total Gasto
DROP FUNCTION IF EXISTS fn_classificar_cliente//
CREATE FUNCTION fn_classificar_cliente(total_gasto DECIMAL(10,2))
RETURNS VARCHAR(20)
DETERMINISTIC
COMMENT 'Classifica cliente baseado no total gasto'
BEGIN
    DECLARE classificacao VARCHAR(20);

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


-- ================================================================
-- ETAPA 05 - PARTE 3: PROCEDIMENTOS
-- ================================================================
-- Requisito: 2 procedimentos (1 para atualização, 1 com CURSOR)

DELIMITER //

-- PROCEDIMENTO 1: Reajustar Preços por Categoria (ATUALIZAÇÃO)
DROP PROCEDURE IF EXISTS sp_reajustar_precos_categoria//
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
    
    -- Valor total ANTES
    SELECT COALESCE(SUM(preco_venda * estoque), 0) INTO v_valor_total_antes
    FROM Produto
    WHERE id_categoria = p_id_categoria AND status = 'ATIVO';
    
    -- Atualizar preços
    UPDATE Produto
    SET preco_venda = ROUND(preco_venda * (1 + p_percentual / 100), 2),
        preco_custo = CASE 
            WHEN p_aplicar_custo = TRUE 
            THEN ROUND(preco_custo * (1 + p_percentual / 100), 2)
            ELSE preco_custo
        END
    WHERE id_categoria = p_id_categoria AND status = 'ATIVO';
    
    SET v_produtos_atualizados = ROW_COUNT();
    
    -- Valor total DEPOIS
    SELECT COALESCE(SUM(preco_venda * estoque), 0) INTO v_valor_total_depois
    FROM Produto
    WHERE id_categoria = p_id_categoria AND status = 'ATIVO';
    
    -- Resultado
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


-- PROCEDIMENTO 2: Gerar Relatório de Produtos Críticos (COM CURSOR)
DROP PROCEDURE IF EXISTS sp_relatorio_produtos_criticos//
CREATE PROCEDURE sp_relatorio_produtos_criticos()
BEGIN
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
    
    DECLARE cur_produtos_criticos CURSOR FOR
        SELECT 
            p.id_produto, p.nome, p.estoque, p.estoque_minimo,
            p.preco_custo, p.preco_venda,
            COALESCE(c.nome, 'Sem Categoria') AS categoria_nome,
            COALESCE(f.nome_fantasia, 'Sem Fornecedor') AS fornecedor_nome,
            COALESCE(f.telefone, 'N/A') AS fornecedor_telefone,
            p.data_validade, p.data_cadastro
        FROM Produto p
        LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
        LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
        WHERE p.status = 'ATIVO'
          AND (p.estoque = 0 
               OR p.estoque <= p.estoque_minimo
               OR (p.data_validade IS NOT NULL 
                   AND p.data_validade <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)))
        ORDER BY CASE 
            WHEN p.estoque = 0 THEN 1
            WHEN p.data_validade IS NOT NULL AND p.data_validade <= CURDATE() THEN 2
            WHEN p.estoque <= p.estoque_minimo THEN 3
            ELSE 4
        END, p.estoque ASC;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
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
    
    OPEN cur_produtos_criticos;
    
    read_loop: LOOP
        FETCH cur_produtos_criticos INTO 
            v_id_produto, v_nome, v_estoque, v_estoque_minimo, v_preco_custo,
            v_preco_venda, v_categoria, v_fornecedor, v_telefone_fornecedor,
            v_data_validade, v_data_cadastro;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        INSERT INTO temp_produtos_criticos
        SELECT
            v_id_produto, v_nome, v_categoria, v_estoque, v_estoque_minimo,
            GREATEST(0, v_estoque_minimo - v_estoque) AS deficit,
            v_preco_custo, v_preco_venda,
            ROUND((v_estoque_minimo - v_estoque) * v_preco_custo, 2) AS valor_reposicao,
            v_fornecedor, v_telefone_fornecedor, v_data_validade,
            CASE 
                WHEN v_data_validade IS NOT NULL 
                THEN DATEDIFF(v_data_validade, CURDATE())
                ELSE NULL
            END AS dias_vencimento,
            DATEDIFF(CURDATE(), v_data_cadastro) AS dias_cadastro,
            CASE 
                WHEN v_estoque = 0 THEN 'CRÍTICO - SEM ESTOQUE'
                WHEN v_data_validade IS NOT NULL AND v_data_validade <= CURDATE() THEN 'CRÍTICO - VENCIDO'
                WHEN v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'URGENTE - VENCE EM 7 DIAS'
                WHEN v_estoque < (v_estoque_minimo * 0.5) THEN 'URGENTE - ESTOQUE MUITO BAIXO'
                WHEN v_estoque <= v_estoque_minimo THEN 'ATENÇÃO - ESTOQUE BAIXO'
                ELSE 'VERIFICAR'
            END AS criticidade,
            CONCAT_WS('; ',
                IF(v_estoque = 0, 'Produto sem estoque', NULL),
                IF(v_estoque > 0 AND v_estoque <= v_estoque_minimo, 
                   CONCAT('Estoque abaixo do mínimo (', v_estoque, '/', v_estoque_minimo, ')'), NULL),
                IF(v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 30 DAY),
                   CONCAT('Vencimento próximo (', DATEDIFF(v_data_validade, CURDATE()), ' dias)'), NULL)
            ) AS motivo,
            CASE 
                WHEN v_estoque = 0 THEN 
                    CONCAT('URGENTE: Repor ', v_estoque_minimo, ' unidades. Contatar ', v_fornecedor)
                WHEN v_data_validade IS NOT NULL AND v_data_validade <= CURDATE() THEN
                    'URGENTE: Produto vencido - Remover do estoque'
                WHEN v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN
                    'URGENTE: Aplicar promoção para liquidar'
                WHEN v_estoque <= v_estoque_minimo THEN
                    CONCAT('Repor ', (v_estoque_minimo - v_estoque), ' unidades')
                ELSE 'Monitorar'
            END AS acao,
            CASE 
                WHEN v_estoque = 0 THEN 1
                WHEN v_data_validade IS NOT NULL AND v_data_validade <= CURDATE() THEN 1
                WHEN v_data_validade IS NOT NULL AND v_data_validade <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 2
                WHEN v_estoque < (v_estoque_minimo * 0.5) THEN 2
                WHEN v_estoque <= v_estoque_minimo THEN 3
                ELSE 4
            END AS prioridade;
    END LOOP;
    
    CLOSE cur_produtos_criticos;
    
    -- Resultados
    SELECT * FROM temp_produtos_criticos
    ORDER BY prioridade ASC, deficit DESC, dias_ate_vencimento ASC;
    
    -- Resumo
    SELECT 
        COUNT(*) AS total_produtos_criticos,
        SUM(CASE WHEN criticidade LIKE 'CRÍTICO%' THEN 1 ELSE 0 END) AS criticos,
        SUM(CASE WHEN criticidade LIKE 'URGENTE%' THEN 1 ELSE 0 END) AS urgentes,
        SUM(CASE WHEN criticidade LIKE 'ATENÇÃO%' THEN 1 ELSE 0 END) AS atencao,
        ROUND(SUM(valor_reposicao_necessaria), 2) AS valor_total_reposicao,
        NOW() AS data_hora_relatorio
    FROM temp_produtos_criticos;
    
    DROP TEMPORARY TABLE IF EXISTS temp_produtos_criticos;
END//

DELIMITER ;


-- ================================================================
-- ETAPA 05 - PARTE 4: TRIGGERS
-- ================================================================
-- Requisito: 2 triggers, 1 deve atualizar tabela de logs

DELIMITER //

-- TRIGGER 1: Baixar Estoque ao Registrar Venda
DROP TRIGGER IF EXISTS trg_baixar_estoque_venda//
CREATE TRIGGER trg_baixar_estoque_venda
AFTER INSERT ON VendaItem
FOR EACH ROW
BEGIN
    DECLARE v_estoque_atual INT;
    DECLARE v_produto_nome VARCHAR(255);
    
    SELECT estoque, nome INTO v_estoque_atual, v_produto_nome
    FROM Produto WHERE id_produto = NEW.id_produto;
    
    IF v_estoque_atual < NEW.quantidade THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Estoque insuficiente para realizar a venda';
    END IF;
    
    UPDATE Produto
    SET estoque = estoque - NEW.quantidade
    WHERE id_produto = NEW.id_produto;
    
    -- LOG DE AUDITORIA
    INSERT INTO AuditoriaLog (
        tabela_afetada, operacao, id_registro,
        dados_antigos, dados_novos, descricao
    ) VALUES (
        'Produto', 'UPDATE', NEW.id_produto,
        CONCAT('Estoque: ', v_estoque_atual, ' | Produto: ', v_produto_nome),
        CONCAT('Estoque: ', (v_estoque_atual - NEW.quantidade), ' | Venda ID: ', NEW.id_venda),
        CONCAT('Baixa automática de ', NEW.quantidade, ' unidade(s) pela venda #', NEW.id_venda)
    );
    
    INSERT INTO MovimentacaoEstoque (
        id_produto, data_movimentacao, tipo, quantidade,
        estoque_anterior, estoque_atual, observacao
    ) VALUES (
        NEW.id_produto, NOW(), 'SALE', NEW.quantidade,
        v_estoque_atual, v_estoque_atual - NEW.quantidade,
        CONCAT('Venda #', NEW.id_venda, ' - Item #', NEW.id_venda_item)
    );
END//


-- TRIGGER 2: Auditoria de Alterações em Produtos (LOG COMPLETO)
DROP TRIGGER IF EXISTS trg_auditoria_produto_update//
CREATE TRIGGER trg_auditoria_produto_update
AFTER UPDATE ON Produto
FOR EACH ROW
BEGIN
    DECLARE v_alteracoes TEXT;
    DECLARE v_tem_alteracao BOOLEAN DEFAULT FALSE;
    
    SET v_alteracoes = '';
    
    IF OLD.nome != NEW.nome THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Nome: "', OLD.nome, '" → "', NEW.nome, '"; ');
        SET v_tem_alteracao = TRUE;
    END IF;
    
    IF OLD.preco_venda != NEW.preco_venda THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Preço Venda: R$', 
                                  FORMAT(OLD.preco_venda, 2), ' → R$', FORMAT(NEW.preco_venda, 2), '; ');
        SET v_tem_alteracao = TRUE;
    END IF;
    
    IF COALESCE(OLD.preco_custo, 0) != COALESCE(NEW.preco_custo, 0) THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Preço Custo: R$', 
                                  FORMAT(COALESCE(OLD.preco_custo, 0), 2), ' → R$', 
                                  FORMAT(COALESCE(NEW.preco_custo, 0), 2), '; ');
        SET v_tem_alteracao = TRUE;
    END IF;
    
    IF OLD.estoque != NEW.estoque THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Estoque: ', OLD.estoque, ' → ', NEW.estoque, '; ');
        SET v_tem_alteracao = TRUE;
    END IF;
    
    IF COALESCE(OLD.id_categoria, 0) != COALESCE(NEW.id_categoria, 0) THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Categoria ID: ', 
                                  COALESCE(OLD.id_categoria, 'NULL'), ' → ', 
                                  COALESCE(NEW.id_categoria, 'NULL'), '; ');
        SET v_tem_alteracao = TRUE;
    END IF;
    
    IF OLD.status != NEW.status THEN
        SET v_alteracoes = CONCAT(v_alteracoes, 'Status: ', OLD.status, ' → ', NEW.status, '; ');
        SET v_tem_alteracao = TRUE;
    END IF;
    
    IF v_tem_alteracao THEN
        INSERT INTO AuditoriaLog (
            tabela_afetada, operacao, id_registro,
            dados_antigos, dados_novos, descricao
        ) VALUES (
            'Produto', 'UPDATE', NEW.id_produto,
            CONCAT('ID: ', OLD.id_produto, ' | ', v_alteracoes),
            CONCAT('ID: ', NEW.id_produto, ' | Produto: "', NEW.nome, '" | Status: ', NEW.status),
            CONCAT('Produto "', NEW.nome, '" atualizado - Alterações: ', v_alteracoes)
        );
    END IF;
END//

DELIMITER ;


-- ================================================================
-- FIM DO SCRIPT COMPLETO
-- ================================================================
-- Verificações recomendadas:
-- 1. SHOW INDEX FROM Produto;
-- 2. SHOW INDEX FROM Venda;
-- 3. SELECT * FROM vw_analise_vendas_completa LIMIT 5;
-- 4. SELECT * FROM vw_inventario_rentabilidade LIMIT 5;
-- 5. SELECT fn_calcular_desconto_progressivo(750.00);
-- 6. SELECT fn_classificar_cliente(3500.00);
-- 7. CALL sp_reajustar_precos_categoria(1, 5.00, FALSE);
-- 8. CALL sp_relatorio_produtos_criticos();
-- ================================================================
