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
            COALESCE(pf.telefone, 'N/A') AS fornecedor_telefone,
            p.data_validade,
            p.data_cadastro
        FROM Produto p
        LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
        LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
        LEFT JOIN Pessoa pf ON f.id_pessoa = pf.id_pessoa
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
        CONCAT('🔴 ', criticidade) AS status_visual
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
