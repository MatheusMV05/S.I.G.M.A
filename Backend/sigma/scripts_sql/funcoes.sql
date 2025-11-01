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


-- ================================================================
-- EXEMPLOS DE USO DAS FUNÇÕES
-- ================================================================

-- Exemplo 1: Calcular desconto para uma compra de R$850,00
-- SELECT fn_calcular_desconto_progressivo(850.00) AS percentual_desconto;
-- Resultado esperado: 0.10 (10%)

-- Exemplo 2: Calcular desconto e valor final
-- SELECT 
--     1250.00 AS valor_original,
--     fn_calcular_desconto_progressivo(1250.00) AS desconto_percentual,
--     1250.00 * fn_calcular_desconto_progressivo(1250.00) AS valor_desconto,
--     1250.00 - (1250.00 * fn_calcular_desconto_progressivo(1250.00)) AS valor_final;

-- Exemplo 3: Aplicar função em consulta de vendas
-- SELECT 
--     v.id_venda,
--     v.valor_total,
--     fn_calcular_desconto_progressivo(v.valor_total) AS desconto_sugerido,
--     ROUND(v.valor_total * fn_calcular_desconto_progressivo(v.valor_total), 2) AS economia,
--     ROUND(v.valor_total - (v.valor_total * fn_calcular_desconto_progressivo(v.valor_total)), 2) AS valor_com_desconto
-- FROM Venda v
-- WHERE v.status = 'CONCLUIDA'
-- ORDER BY v.valor_total DESC
-- LIMIT 10;

-- Exemplo 4: Classificar clientes por ranking
-- SELECT 
--     p.nome,
--     c.total_gasto,
--     c.ranking,
--     fn_classificar_cliente(c.total_gasto) AS classificacao_automatica
-- FROM Cliente c
-- INNER JOIN Pessoa p ON c.id_pessoa = p.id_pessoa
-- WHERE c.ativo = TRUE
-- ORDER BY c.total_gasto DESC;

-- Exemplo 5: Atualizar ranking de clientes usando a função
-- UPDATE Cliente
-- SET ranking = CASE fn_classificar_cliente(total_gasto)
--     WHEN 'DIAMANTE' THEN 5
--     WHEN 'PLATINA' THEN 4
--     WHEN 'OURO' THEN 3
--     WHEN 'PRATA' THEN 2
--     ELSE 1
-- END
-- WHERE ativo = TRUE;
