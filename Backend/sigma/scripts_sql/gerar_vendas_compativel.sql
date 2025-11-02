-- ============================================
-- SCRIPT DE GERAÇÃO DE VENDAS - COMPATÍVEL
-- Simula vendas adaptadas para o backend atual
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;

-- ============================================
-- PASSO 1: Limpar vendas antigas (OPCIONAL)
-- ============================================

-- DESCOMENTE as linhas abaixo se quiser limpar vendas anteriores:
-- DELETE FROM VendaItem;
-- DELETE FROM Venda;
-- ALTER TABLE Venda AUTO_INCREMENT = 1;
-- ALTER TABLE VendaItem AUTO_INCREMENT = 1;

-- ============================================
-- PASSO 2: Criar PROCEDURE simplificada
-- ============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS GerarVendasSimples$$

CREATE PROCEDURE GerarVendasSimples(
    IN total_vendas INT
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE venda_id BIGINT;
    DECLARE cliente_id BIGINT;
    DECLARE funcionario_id BIGINT;
    DECLARE produto_id BIGINT;
    DECLARE pagamento VARCHAR(50);
    DECLARE venda_status VARCHAR(20);
    DECLARE data_venda_var DATETIME;
    DECLARE qtd INT;
    DECLARE preco DECIMAL(10,2);
    DECLARE desc_item DECIMAL(10,2);
    DECLARE subt DECIMAL(10,2);
    DECLARE val_total DECIMAL(10,2);
    DECLARE desc_total DECIMAL(10,2);
    DECLARE num_itens INT;
    DECLARE j INT;
    DECLARE estoque_disponivel INT;
    
    -- Handler para continuar em caso de erro
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Ignora erros de estoque e continua
        GET DIAGNOSTICS CONDITION 1 @p1 = MESSAGE_TEXT;
    END;
    
    WHILE i < total_vendas DO
        -- Cliente aleatório (id_pessoa)
        SELECT id_pessoa INTO cliente_id 
        FROM Cliente 
        WHERE ativo = TRUE 
        ORDER BY RAND() LIMIT 1;
        
        -- ⚠️ IMPORTANTE: Apenas funcionários autorizados a fazer vendas
        -- Cargos permitidos: Administrador, Gerente de Vendas, Supervisor de Caixa, 
        --                    Operador de Caixa, Vendedor
        SELECT id_pessoa INTO funcionario_id 
        FROM Funcionario 
        WHERE status = 'ATIVO' 
          AND cargo IN (
              'Administrador',
              'Gerente de Vendas',
              'Supervisor de Caixa',
              'Operador de Caixa',
              'Vendedor'
          )
        ORDER BY RAND() LIMIT 1;
        
        -- Data nos últimos 30 dias, hora 8h-20h
        SET data_venda_var = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY) 
                            + INTERVAL FLOOR(RAND() * 12 + 8) HOUR
                            + INTERVAL FLOOR(RAND() * 60) MINUTE;
        
        -- Forma de pagamento
        SET pagamento = ELT(FLOOR(1 + RAND() * 5), 'DINHEIRO', 'CREDITO', 'DEBITO', 'PIX', 'PIX');
        
        -- Status (usar CONCLUIDA para compatibilidade)
        SET venda_status = IF(RAND() < 0.95, 'CONCLUIDA', 'CANCELADA');
        
        -- Número de itens (1 a 4)
        SET num_itens = FLOOR(1 + RAND() * 4);
        SET val_total = 0;
        SET desc_total = 0;
        
        -- Inserir venda
        INSERT INTO Venda (
            id_cliente,
            id_funcionario,
            data_venda,
            metodo_pagamento,
            status,
            valor_total,
            desconto,
            valor_final
        ) VALUES (
            cliente_id,
            funcionario_id,
            data_venda_var,
            pagamento,
            venda_status,
            0,
            0,
            0
        );
        
        SET venda_id = LAST_INSERT_ID();
        SET j = 0;
        
        -- Adicionar itens
        WHILE j < num_itens DO
            -- Selecionar produto aleatório com estoque
            SELECT id_produto, preco_venda, estoque INTO produto_id, preco, estoque_disponivel
            FROM Produto 
            WHERE status = 'ATIVO' AND estoque > 5
            ORDER BY RAND() LIMIT 1;
            
            -- Quantidade limitada ao estoque
            SET qtd = LEAST(FLOOR(1 + RAND() * 3), estoque_disponivel);
            
            -- Verificar se tem estoque suficiente
            IF qtd > 0 AND estoque_disponivel >= qtd THEN
                SET desc_item = ROUND(preco * qtd * (RAND() * 0.1), 2);
                SET subt = (preco * qtd) - desc_item;
                SET val_total = val_total + (preco * qtd);
                SET desc_total = desc_total + desc_item;
                
                INSERT INTO VendaItem (
                    id_venda,
                    id_produto,
                    quantidade,
                    preco_unitario_venda,
                    desconto_item,
                    subtotal
                ) VALUES (
                    venda_id,
                    produto_id,
                    qtd,
                    preco,
                    desc_item,
                    subt
                );
                
                IF venda_status = 'CONCLUIDA' THEN
                    UPDATE Produto 
                    SET estoque = estoque - qtd
                    WHERE id_produto = produto_id;
                END IF;
            END IF;
            
            SET j = j + 1;
        END WHILE;
        
        -- Atualizar totais
        UPDATE Venda 
        SET valor_total = val_total,
            desconto = desc_total,
            valor_final = val_total - desc_total
        WHERE id_venda = venda_id;
        
        SET i = i + 1;
    END WHILE;
    
    SELECT CONCAT('✅ ', total_vendas, ' vendas criadas com sucesso!') as resultado;
END$$

DELIMITER ;

-- ============================================
-- PASSO 3: EXECUTAR - Gerar 300 vendas
-- ============================================

CALL GerarVendasSimples(300);

-- ============================================
-- PASSO 4: Criar promoções ativas
-- ============================================

INSERT INTO PROMOCAO (nome, descricao, tipo_desconto, valor_desconto, data_inicio, data_fim, status)
VALUES 
    ('Black Friday 2025', 'Descontos especiais de novembro', 'PERCENTUAL', 20.00, 
     DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'ATIVA'),
    ('Queima de Estoque', 'Produtos selecionados com desconto', 'PERCENTUAL', 30.00, 
     DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'ATIVA'),
    ('Promoção Relâmpago', 'Apenas por tempo limitado', 'PERCENTUAL', 25.00, 
     CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'ATIVA'),
    ('Combo Especial', 'Compre mais, pague menos', 'PERCENTUAL', 15.00, 
     CURDATE(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'ATIVA'),
    ('Mega Oferta', 'Oportunidade única', 'FIXO', 50.00, 
     DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ATIVA')
ON DUPLICATE KEY UPDATE status = status;

-- ============================================
-- PASSO 5: Estatísticas
-- ============================================

SELECT '📊 ESTATÍSTICAS DAS VENDAS' as '========================================';

SELECT 
    COUNT(*) as total_vendas,
    SUM(CASE WHEN status = 'CONCLUIDA' THEN 1 ELSE 0 END) as concluidas,
    SUM(CASE WHEN status = 'CANCELADA' THEN 1 ELSE 0 END) as canceladas
FROM Venda;

SELECT '💰 FATURAMENTO' as tipo, 
    CONCAT('R$ ', FORMAT(SUM(CASE WHEN DATE(data_venda) = CURDATE() THEN valor_final ELSE 0 END), 2)) as hoje,
    CONCAT('R$ ', FORMAT(SUM(CASE WHEN DATE(data_venda) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN valor_final ELSE 0 END), 2)) as ontem,
    CONCAT('R$ ', FORMAT(SUM(CASE WHEN data_venda >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN valor_final ELSE 0 END), 2)) as ultimos_7_dias,
    CONCAT('R$ ', FORMAT(SUM(valor_final), 2)) as total
FROM Venda WHERE status = 'CONCLUIDA';

SELECT 
    DATE(data_venda) as data,
    COUNT(*) as vendas,
    CONCAT('R$ ', FORMAT(SUM(valor_final), 2)) as faturamento
FROM Venda 
WHERE status = 'CONCLUIDA'
GROUP BY DATE(data_venda)
ORDER BY data DESC
LIMIT 10;

SELECT 
    metodo_pagamento,
    COUNT(*) as quantidade,
    CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Venda WHERE status = 'CONCLUIDA'), 1), '%') as percentual
FROM Venda 
WHERE status = 'CONCLUIDA'
GROUP BY metodo_pagamento;

SELECT 
    COUNT(*) as promocoes_ativas
FROM PROMOCAO 
WHERE status = 'ATIVA' 
  AND CURDATE() BETWEEN data_inicio AND data_fim;

SELECT '✅ Script concluído com sucesso!' as status;

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;
