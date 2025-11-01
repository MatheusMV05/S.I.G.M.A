-- ============================================
-- SCRIPT DE GERAÇÃO DE VENDAS DE TESTE
-- Simula vendas de um mês inteiro com dados realísticos
-- ============================================

-- Desabilitar verificações temporariamente para melhor performance
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;

-- ============================================
-- 1. PREPARAÇÃO: Garantir dados base existentes
-- ============================================

-- Verificar se temos clientes
SELECT CONCAT('📊 Total de clientes disponíveis: ', COUNT(*)) as info FROM Cliente;

-- Verificar se temos produtos
SELECT CONCAT('📦 Total de produtos disponíveis: ', COUNT(*)) as info FROM Produto WHERE status = 'ATIVO';

-- Verificar se temos funcionários
SELECT CONCAT('👤 Total de funcionários disponíveis: ', COUNT(*)) as info FROM Funcionario;

-- ============================================
-- 2. CRIAR PROCEDURE PARA GERAR VENDAS
-- ============================================

DELIMITER $$

DROP PROCEDURE IF EXISTS GerarVendasTeste$$

CREATE PROCEDURE GerarVendasTeste(
    IN dias_atras INT,
    IN vendas_por_dia INT
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE dia_atual INT DEFAULT 0;
    DECLARE venda_id BIGINT;
    DECLARE cliente_id BIGINT;
    DECLARE funcionario_id BIGINT;
    DECLARE produto_id BIGINT;
    DECLARE metodo_pagamento VARCHAR(50);
    DECLARE status_venda VARCHAR(20);
    DECLARE hora_venda TIME;
    DECLARE data_venda DATETIME;
    DECLARE quantidade INT;
    DECLARE preco_unitario DECIMAL(10,2);
    DECLARE desconto_item DECIMAL(10,2);
    DECLARE subtotal DECIMAL(10,2);
    DECLARE valor_total_venda DECIMAL(10,2);
    DECLARE desconto_total_venda DECIMAL(10,2);
    DECLARE num_itens INT;
    DECLARE item_count INT;
    
    -- Variáveis para armazenar IDs disponíveis
    DECLARE total_clientes INT;
    DECLARE total_funcionarios INT;
    DECLARE total_produtos INT;
    
    -- Contar totais
    SELECT COUNT(*) INTO total_clientes FROM Cliente WHERE ativo = TRUE;
    SELECT COUNT(*) INTO total_funcionarios FROM Funcionario WHERE status = 'ATIVO';
    SELECT COUNT(*) INTO total_produtos FROM Produto WHERE status = 'ATIVO' AND estoque > 0;
    
    -- Verificar se há dados suficientes
    IF total_clientes = 0 OR total_funcionarios = 0 OR total_produtos = 0 THEN
        SELECT '❌ ERRO: Não há clientes, funcionários ou produtos suficientes!' as erro;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Dados base insuficientes';
    END IF;
    
    SELECT CONCAT('🚀 Iniciando geração de vendas: ', vendas_por_dia, ' vendas por dia, últimos ', dias_atras, ' dias') as info;
    
    -- Loop pelos dias
    WHILE dia_atual < dias_atras DO
        SET i = 0;
        
        -- Loop pelas vendas do dia
        WHILE i < vendas_por_dia DO
            -- Selecionar cliente aleatório (id_pessoa da tabela Cliente)
            SELECT id_pessoa INTO cliente_id 
            FROM Cliente 
            WHERE ativo = TRUE 
            ORDER BY RAND() 
            LIMIT 1;
            
            -- Selecionar funcionário aleatório (id_pessoa da tabela Funcionario)
            SELECT id_pessoa INTO funcionario_id 
            FROM Funcionario 
            WHERE status = 'ATIVO' 
            ORDER BY RAND() 
            LIMIT 1;
            
            -- Determinar horário da venda (horário comercial: 8h às 20h)
            SET hora_venda = SEC_TO_TIME(FLOOR(RAND() * (20 - 8) * 3600 + 8 * 3600));
            
            -- Data da venda (dias atrás + hora)
            SET data_venda = DATE_SUB(NOW(), INTERVAL dia_atual DAY) + INTERVAL TIME_TO_SEC(hora_venda) SECOND;
            
            -- Método de pagamento aleatório
            SET metodo_pagamento = ELT(FLOOR(1 + RAND() * 5), 'DINHEIRO', 'CREDITO', 'DEBITO', 'PIX', 'PIX');
            
            -- Status da venda (95% concluídas, 5% canceladas)
            SET status_venda = IF(RAND() < 0.95, 'CONCLUIDA', 'CANCELADA');
            
            -- Número de itens na venda (1 a 5)
            SET num_itens = FLOOR(1 + RAND() * 5);
            SET valor_total_venda = 0;
            SET desconto_total_venda = 0;
            
            -- Inserir a venda
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
                data_venda,
                metodo_pagamento,
                status_venda,
                0, -- Será atualizado depois
                0,
                0
            );
            
            SET venda_id = LAST_INSERT_ID();
            SET item_count = 0;
            
            -- Adicionar itens à venda
            WHILE item_count < num_itens DO
                -- Selecionar produto aleatório
                SELECT id_produto, preco_venda INTO produto_id, preco_unitario
                FROM Produto 
                WHERE status = 'ATIVO' AND estoque > 0
                ORDER BY RAND() 
                LIMIT 1;
                
                -- Quantidade (1 a 3 unidades)
                SET quantidade = FLOOR(1 + RAND() * 3);
                
                -- Desconto aleatório (0% a 15%)
                SET desconto_item = ROUND(preco_unitario * quantidade * (RAND() * 0.15), 2);
                
                -- Subtotal do item
                SET subtotal = (preco_unitario * quantidade) - desconto_item;
                SET valor_total_venda = valor_total_venda + (preco_unitario * quantidade);
                SET desconto_total_venda = desconto_total_venda + desconto_item;
                
                -- Inserir item da venda
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
                    quantidade,
                    preco_unitario,
                    desconto_item,
                    subtotal
                );
                
                -- Atualizar estoque do produto (se venda concluída)
                IF status_venda = 'CONCLUIDA' THEN
                    UPDATE Produto 
                    SET estoque = GREATEST(0, estoque - quantidade)
                    WHERE id_produto = produto_id;
                END IF;
                
                SET item_count = item_count + 1;
            END WHILE;
            
            -- Atualizar valor total da venda
            UPDATE Venda 
            SET valor_total = valor_total_venda,
                desconto = desconto_total_venda,
                valor_final = valor_total_venda - desconto_total_venda
            WHERE id_venda = venda_id;
            
            SET i = i + 1;
        END WHILE;
        
        SET dia_atual = dia_atual + 1;
    END WHILE;
    
    SELECT CONCAT('✅ Geração concluída! Total de vendas criadas: ', dias_atras * vendas_por_dia) as resultado;
    
END$$

DELIMITER ;

-- ============================================
-- 3. EXECUTAR GERAÇÃO DE VENDAS
-- ============================================

-- Opção 1: Gerar vendas dos últimos 30 dias (10 vendas por dia = 300 vendas)
CALL GerarVendasTeste(30, 10);

-- Descomente as opções abaixo conforme necessário:

-- Opção 2: Gerar apenas vendas de hoje (20 vendas)
CALL GerarVendasTeste(0, 20);

-- Opção 3: Gerar vendas dos últimos 7 dias (15 vendas por dia = 105 vendas)
-- CALL GerarVendasTeste(7, 15);

-- Opção 4: Gerar vendas dos últimos 60 dias (8 vendas por dia = 480 vendas)
 --CALL GerarVendasTeste(60, 8);

-- Opção 5: Gerar vendas dos últimos 90 dias (5 vendas por dia = 450 vendas)
-- CALL GerarVendasTeste(90, 5);

-- ============================================
-- 4. ADICIONAR ALGUMAS PROMOÇÕES ATIVAS
-- ============================================

-- Criar promoções ativas para teste
INSERT INTO Promocao (nome, descricao, tipo_desconto, valor_desconto, data_inicio, data_fim, status)
VALUES 
    ('Black Friday 2025', 'Descontos especiais de novembro', 'PERCENTUAL', 20.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'ATIVA'),
    ('Queima de Estoque', 'Produtos selecionados com desconto', 'PERCENTUAL', 30.00, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'ATIVA'),
    ('Promoção de Aniversário', 'Celebrando nosso aniversário', 'FIXO', 50.00, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ATIVA'),
    ('Combo Especial', 'Compre mais, pague menos', 'PERCENTUAL', 15.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'ATIVA'),
    ('Promoção Relâmpago', 'Apenas por tempo limitado', 'PERCENTUAL', 25.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'ATIVA')
ON DUPLICATE KEY UPDATE status = status;

-- ============================================
-- 5. CONSULTAS DE VERIFICAÇÃO
-- ============================================

SELECT '📊 ESTATÍSTICAS DAS VENDAS GERADAS' as '====================';

-- Total de vendas
SELECT 
    COUNT(*) as total_vendas,
    SUM(CASE WHEN status = 'FINALIZADA' THEN 1 ELSE 0 END) as vendas_finalizadas,
    SUM(CASE WHEN status = 'CANCELADA' THEN 1 ELSE 0 END) as vendas_canceladas
FROM Venda;

-- Faturamento por período
SELECT 
    '💰 FATURAMENTO' as tipo,
    CONCAT('R$ ', FORMAT(SUM(CASE WHEN DATE(data_venda) = CURDATE() THEN valor_total ELSE 0 END), 2)) as hoje,
    CONCAT('R$ ', FORMAT(SUM(CASE WHEN DATE(data_venda) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN valor_total ELSE 0 END), 2)) as ontem,
    CONCAT('R$ ', FORMAT(SUM(CASE WHEN data_venda >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN valor_total ELSE 0 END), 2)) as ultimos_7_dias,
    CONCAT('R$ ', FORMAT(SUM(CASE WHEN data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN valor_total ELSE 0 END), 2)) as ultimos_30_dias,
    CONCAT('R$ ', FORMAT(SUM(valor_total), 2)) as total
FROM Venda 
WHERE status IN ('FINALIZADA', 'PAGA');

-- Vendas por dia
SELECT 
    DATE(data_venda) as data,
    COUNT(*) as total_vendas,
    CONCAT('R$ ', FORMAT(SUM(valor_total), 2)) as faturamento,
    CONCAT('R$ ', FORMAT(AVG(valor_total), 2)) as ticket_medio
FROM Venda 
WHERE status IN ('FINALIZADA', 'PAGA')
GROUP BY DATE(data_venda)
ORDER BY data DESC
LIMIT 10;

-- Vendas por forma de pagamento
SELECT 
    forma_pagamento,
    COUNT(*) as quantidade,
    CONCAT('R$ ', FORMAT(SUM(valor_total), 2)) as total,
    CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Venda WHERE status IN ('FINALIZADA', 'PAGA')), 1), '%') as percentual
FROM Venda 
WHERE status IN ('FINALIZADA', 'PAGA')
GROUP BY forma_pagamento
ORDER BY quantidade DESC;

-- Produtos mais vendidos
SELECT 
    p.nome as produto,
    SUM(vi.quantidade) as quantidade_vendida,
    CONCAT('R$ ', FORMAT(SUM(vi.valor_total), 2)) as receita_total,
    p.estoque as estoque_atual
FROM VendaItem vi
INNER JOIN Produto p ON vi.id_produto = p.id_produto
INNER JOIN Venda v ON vi.id_venda = v.id_venda
WHERE v.status IN ('FINALIZADA', 'PAGA')
GROUP BY p.id_produto, p.nome, p.estoque
ORDER BY quantidade_vendida DESC
LIMIT 10;

-- Promoções ativas
SELECT 
    COUNT(*) as total_promocoes_ativas,
    GROUP_CONCAT(nome SEPARATOR ', ') as promocoes
FROM Promocao 
WHERE status = 'ATIVA' 
  AND CURDATE() >= data_inicio 
  AND CURDATE() <= data_fim;

SELECT '✅ Script de vendas de teste executado com sucesso!' as '====================';

-- Reabilitar verificações
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;
