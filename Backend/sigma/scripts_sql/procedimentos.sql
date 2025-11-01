-- ================================================================
-- PROCEDIMENTOS ARMAZENADOS (STORED PROCEDURES)
-- Sistema S.I.G.M.A - Etapa 05
-- ================================================================

-- ================================================================
-- PROCEDIMENTO 1: Atualizar Preços por Categoria (ATUALIZAÇÃO EM LOTE)
-- ================================================================
-- Aplica reajuste percentual em todos os produtos de uma categoria
-- Exemplo: Aumentar 10% nos preços da categoria "Eletrônicos"
DELIMITER //

CREATE PROCEDURE atualizar_precos_categoria(
    IN p_id_categoria INT,
    IN p_percentual DECIMAL(5,2)
)
BEGIN
    DECLARE produtos_atualizados INT;

    -- Atualizar preço de venda dos produtos da categoria
    UPDATE Produto
    SET preco_venda = preco_venda * (1 + p_percentual / 100)
    WHERE id_categoria = p_id_categoria;

    -- Obter quantidade de produtos atualizados
    SET produtos_atualizados = ROW_COUNT();

    -- Retornar resultado
    SELECT 
        produtos_atualizados AS total_produtos_atualizados,
        p_percentual AS percentual_aplicado,
        c.nome AS categoria_nome
    FROM Categoria c
    WHERE c.id_categoria = p_id_categoria;
END//

DELIMITER ;


-- ================================================================
-- PROCEDIMENTO 2: Relatório de Produtos com Estoque Baixo (COM CURSOR)
-- ================================================================
-- Gera relatório detalhado de produtos com estoque abaixo do mínimo
-- Utiliza CURSOR para iterar pelos registros
DELIMITER //

CREATE PROCEDURE relatorio_estoque_baixo(IN p_estoque_minimo INT)
BEGIN
    DECLARE v_id_produto INT;
    DECLARE v_nome VARCHAR(100);
    DECLARE v_quantidade INT;
    DECLARE v_estoque_minimo INT;
    DECLARE v_fornecedor VARCHAR(100);
    DECLARE v_telefone_fornecedor VARCHAR(20);
    DECLARE v_preco_custo DECIMAL(10,2);
    DECLARE v_categoria VARCHAR(100);
    DECLARE done INT DEFAULT FALSE;

    -- Declarar cursor para produtos com estoque baixo
    DECLARE cur_produtos CURSOR FOR
        SELECT 
            p.id_produto, 
            p.nome, 
            p.quantidade_estoque,
            p.estoque_minimo,
            p.preco_custo,
            COALESCE(f.nome, 'Sem fornecedor') AS fornecedor_nome,
            COALESCE(f.telefone, 'N/A') AS fornecedor_telefone,
            c.nome AS categoria_nome
        FROM Produto p
        LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
        INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
        WHERE p.quantidade_estoque < p_estoque_minimo
        ORDER BY p.quantidade_estoque ASC;

    -- Handler para fim do cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Criar tabela temporária para armazenar resultados
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_estoque_baixo (
        id_produto INT,
        nome_produto VARCHAR(100),
        quantidade_atual INT,
        estoque_minimo INT,
        deficit INT,
        preco_custo DECIMAL(10,2),
        valor_reposicao DECIMAL(10,2),
        categoria VARCHAR(100),
        fornecedor VARCHAR(100),
        telefone_fornecedor VARCHAR(20),
        status_criticidade VARCHAR(50)
    );

    -- Limpar tabela temporária caso já exista
    TRUNCATE TABLE temp_estoque_baixo;

    -- Abrir cursor
    OPEN cur_produtos;

    -- Loop de leitura do cursor
    read_loop: LOOP
        FETCH cur_produtos INTO 
            v_id_produto, 
            v_nome, 
            v_quantidade,
            v_estoque_minimo,
            v_preco_custo,
            v_fornecedor, 
            v_telefone_fornecedor,
            v_categoria;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Inserir na tabela temporária com análise de criticidade
        INSERT INTO temp_estoque_baixo
        VALUES (
            v_id_produto, 
            v_nome, 
            v_quantidade,
            v_estoque_minimo,
            v_estoque_minimo - v_quantidade, -- Deficit
            v_preco_custo,
            (v_estoque_minimo - v_quantidade) * v_preco_custo, -- Valor para reposição
            v_categoria,
            v_fornecedor, 
            v_telefone_fornecedor,
            CASE 
                WHEN v_quantidade = 0 THEN 'CRÍTICO - SEM ESTOQUE'
                WHEN v_quantidade < (v_estoque_minimo * 0.5) THEN 'URGENTE'
                ELSE 'ATENÇÃO'
            END
        );
    END LOOP;

    -- Fechar cursor
    CLOSE cur_produtos;

    -- Retornar resultados ordenados por criticidade
    SELECT 
        *,
        CONCAT('Repor ', deficit, ' unidades') AS acao_recomendada
    FROM temp_estoque_baixo
    ORDER BY 
        CASE status_criticidade
            WHEN 'CRÍTICO - SEM ESTOQUE' THEN 1
            WHEN 'URGENTE' THEN 2
            WHEN 'ATENÇÃO' THEN 3
        END,
        deficit DESC;

    -- Limpar tabela temporária
    DROP TEMPORARY TABLE IF EXISTS temp_estoque_baixo;
END//

DELIMITER ;


-- ================================================================
-- EXEMPLOS DE USO DOS PROCEDIMENTOS
-- ================================================================

-- Exemplo 1: Aumentar 5% nos preços da categoria ID 1
-- CALL atualizar_precos_categoria(1, 5.00);

-- Exemplo 2: Relatório de produtos com estoque menor que 10 unidades
-- CALL relatorio_estoque_baixo(10);

-- Exemplo 3: Verificar produtos críticos (estoque menor que 5)
-- CALL relatorio_estoque_baixo(5);
