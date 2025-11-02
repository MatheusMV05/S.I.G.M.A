-- ============================================================================
-- TRIGGER: Validar Funcionário em Vendas
-- Garante que apenas funcionários autorizados possam fazer vendas
-- ============================================================================

USE SIGMA;

DELIMITER $$

-- ============================================================================
-- TRIGGER: Antes de INSERIR uma venda
-- ============================================================================

DROP TRIGGER IF EXISTS before_venda_insert_validar_funcionario$$

CREATE TRIGGER before_venda_insert_validar_funcionario
BEFORE INSERT ON Venda
FOR EACH ROW
BEGIN
    DECLARE cargo_funcionario VARCHAR(100);
    DECLARE nome_funcionario VARCHAR(255);
    
    -- Buscar cargo do funcionário
    SELECT f.cargo, p.nome
    INTO cargo_funcionario, nome_funcionario
    FROM Funcionario f
    JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
    WHERE f.id_pessoa = NEW.id_funcionario;
    
    -- Validar se o cargo é autorizado
    IF cargo_funcionario NOT IN (
        'Administrador',
        'Gerente de Vendas',
        'Supervisor de Caixa',
        'Operador de Caixa',
        'Vendedor'
    ) THEN
        SET @error_msg = CONCAT(
            'Funcionário não autorizado a realizar vendas. ',
            'Cargo: ', cargo_funcionario, 
            '. Apenas Administradores, Gerentes de Vendas, ',
            'Supervisores de Caixa, Operadores de Caixa e Vendedores ',
            'podem realizar vendas.'
        );
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = @error_msg;
    END IF;
END$$

-- ============================================================================
-- TRIGGER: Antes de ATUALIZAR uma venda (mudança de funcionário)
-- ============================================================================

DROP TRIGGER IF EXISTS before_venda_update_validar_funcionario$$

CREATE TRIGGER before_venda_update_validar_funcionario
BEFORE UPDATE ON Venda
FOR EACH ROW
BEGIN
    DECLARE cargo_funcionario VARCHAR(100);
    DECLARE nome_funcionario VARCHAR(255);
    
    -- Só valida se o id_funcionario foi alterado
    IF NEW.id_funcionario != OLD.id_funcionario THEN
        -- Buscar cargo do novo funcionário
        SELECT f.cargo, p.nome
        INTO cargo_funcionario, nome_funcionario
        FROM Funcionario f
        JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
        WHERE f.id_pessoa = NEW.id_funcionario;
        
        -- Validar se o cargo é autorizado
        IF cargo_funcionario NOT IN (
            'Administrador',
            'Gerente de Vendas',
            'Supervisor de Caixa',
            'Operador de Caixa',
            'Vendedor'
        ) THEN
            SET @error_msg = CONCAT(
                'Funcionário não autorizado a realizar vendas. ',
                'Cargo: ', cargo_funcionario, 
                '. Apenas Administradores, Gerentes de Vendas, ',
                'Supervisores de Caixa, Operadores de Caixa e Vendedores ',
                'podem realizar vendas.'
            );
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = @error_msg;
        END IF;
    END IF;
END$$

DELIMITER ;

-- ============================================================================
-- TESTES
-- ============================================================================

-- Teste 1: Tentar inserir venda com funcionário não autorizado
-- (deve dar erro)
/*
INSERT INTO Venda (
    id_cliente,
    id_funcionario,
    data_venda,
    metodo_pagamento,
    status,
    valor_total,
    desconto,
    valor_final
)
SELECT 
    (SELECT id_pessoa FROM Cliente LIMIT 1),
    (SELECT id_pessoa FROM Funcionario WHERE cargo = 'Analista de TI' LIMIT 1),
    NOW(),
    'DINHEIRO',
    'CONCLUIDA',
    100.00,
    0.00,
    100.00;
*/

-- Teste 2: Inserir venda com funcionário autorizado
-- (deve funcionar)
/*
INSERT INTO Venda (
    id_cliente,
    id_funcionario,
    data_venda,
    metodo_pagamento,
    status,
    valor_total,
    desconto,
    valor_final
)
SELECT 
    (SELECT id_pessoa FROM Cliente LIMIT 1),
    (SELECT id_pessoa FROM Funcionario WHERE cargo = 'Operador de Caixa' LIMIT 1),
    NOW(),
    'DINHEIRO',
    'CONCLUIDA',
    100.00,
    0.00,
    100.00;
*/

-- ============================================================================
-- Verificar triggers criadas
-- ============================================================================

SHOW TRIGGERS WHERE `Table` = 'Venda';

SELECT '✅ TRIGGERS CRIADAS COM SUCESSO!' AS Status,
       'Vendas agora exigem funcionários autorizados' AS Mensagem;
