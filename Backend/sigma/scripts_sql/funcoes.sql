-- ================================================================
-- FUNÇÕES (FUNCTIONS) DO BANCO DE DADOS
-- Sistema S.I.G.M.A - Etapa 05
-- ================================================================

-- ================================================================
-- FUNÇÃO 1: Calcular Desconto Progressivo (COM CONDICIONAL IF/ELSE)
-- ================================================================
-- Retorna o percentual de desconto baseado no valor da compra
-- Exemplo: R$1500 = 15% de desconto
DELIMITER //

CREATE FUNCTION calcular_desconto(valor_compra DECIMAL(10,2))
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE desconto DECIMAL(5,2);

    -- Estrutura condicional IF/ELSEIF/ELSE
    IF valor_compra >= 1000 THEN
        SET desconto = 0.15; -- 15% para compras >= R$1000
    ELSEIF valor_compra >= 500 THEN
        SET desconto = 0.10; -- 10% para compras >= R$500
    ELSEIF valor_compra >= 200 THEN
        SET desconto = 0.05; -- 5% para compras >= R$200
    ELSE
        SET desconto = 0.00; -- Sem desconto para compras < R$200
    END IF;

    RETURN desconto;
END//

DELIMITER ;

-- ================================================================
-- FUNÇÃO 2: Verificar Disponibilidade de Estoque
-- ================================================================
-- Retorna TRUE se há estoque suficiente, FALSE caso contrário
-- Útil para validação antes de registrar vendas
DELIMITER //

CREATE FUNCTION verificar_estoque_disponivel(p_id_produto INT, p_quantidade INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE estoque_atual INT;
    DECLARE disponivel BOOLEAN;

    -- Buscar quantidade em estoque
    SELECT quantidade_estoque INTO estoque_atual
    FROM Produto
    WHERE id_produto = p_id_produto;

    -- Verificar se há estoque suficiente
    IF estoque_atual IS NULL THEN
        SET disponivel = FALSE; -- Produto não existe
    ELSEIF estoque_atual >= p_quantidade THEN
        SET disponivel = TRUE; -- Estoque suficiente
    ELSE
        SET disponivel = FALSE; -- Estoque insuficiente
    END IF;

    RETURN disponivel;
END//

DELIMITER ;


-- ================================================================
-- EXEMPLOS DE USO DAS FUNÇÕES
-- ================================================================

-- Exemplo 1: Calcular desconto para uma compra de R$850
-- SELECT calcular_desconto(850.00) AS percentual_desconto;
-- Resultado esperado: 0.10 (10%)

-- Exemplo 2: Verificar se há 5 unidades do produto ID 1
-- SELECT verificar_estoque_disponivel(1, 5) AS tem_estoque;
-- Resultado: 1 (true) ou 0 (false)

-- Exemplo 3: Aplicar desconto em uma venda
-- SELECT 
--     v.id_venda,
--     v.valor_total,
--     calcular_desconto(v.valor_total) AS desconto_percentual,
--     v.valor_total * calcular_desconto(v.valor_total) AS valor_desconto,
--     v.valor_total - (v.valor_total * calcular_desconto(v.valor_total)) AS valor_final
-- FROM Venda v
-- WHERE v.id_venda = 1;
