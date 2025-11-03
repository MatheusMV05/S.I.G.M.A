-- ============================================================================
-- FIX: Corrigir triggers de validação de vendas
-- Mensagem de erro reduzida para caber no limite do MySQL (128 caracteres)
-- ============================================================================

USE SIGMA;

DELIMITER $$

-- ============================================================================
-- REMOVER TRIGGERS ANTIGAS
-- ============================================================================

DROP TRIGGER IF EXISTS before_venda_insert_validar_funcionario$$
DROP TRIGGER IF EXISTS before_venda_update_validar_funcionario$$

-- ============================================================================
-- TRIGGER: Antes de INSERIR uma venda (CORRIGIDA)
-- ============================================================================

CREATE TRIGGER before_venda_insert_validar_funcionario
BEFORE INSERT ON Venda
FOR EACH ROW
BEGIN
    DECLARE cargo_funcionario VARCHAR(100);
    
    -- Buscar cargo do funcionário
    SELECT f.cargo
    INTO cargo_funcionario
    FROM Funcionario f
    WHERE f.id_pessoa = NEW.id_funcionario;
    
    -- Validar se o cargo é autorizado
    IF cargo_funcionario NOT IN (
        'Administrador',
        'Gerente de Vendas',
        'Supervisor de Caixa',
        'Operador de Caixa',
        'Vendedor'
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Funcionario nao autorizado para vendas';
    END IF;
END$$

-- ============================================================================
-- TRIGGER: Antes de ATUALIZAR uma venda (CORRIGIDA)
-- ============================================================================

CREATE TRIGGER before_venda_update_validar_funcionario
BEFORE UPDATE ON Venda
FOR EACH ROW
BEGIN
    DECLARE cargo_funcionario VARCHAR(100);
    
    -- Só valida se o id_funcionario foi alterado
    IF NEW.id_funcionario != OLD.id_funcionario THEN
        -- Buscar cargo do novo funcionário
        SELECT f.cargo
        INTO cargo_funcionario
        FROM Funcionario f
        WHERE f.id_pessoa = NEW.id_funcionario;
        
        -- Validar se o cargo é autorizado
        IF cargo_funcionario NOT IN (
            'Administrador',
            'Gerente de Vendas',
            'Supervisor de Caixa',
            'Operador de Caixa',
            'Vendedor'
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Funcionario nao autorizado para vendas';
        END IF;
    END IF;
END$$

DELIMITER ;

-- ============================================================================
-- Verificar triggers criadas
-- ============================================================================

SHOW TRIGGERS WHERE `Table` = 'Venda';

SELECT '✅ TRIGGERS CORRIGIDAS COM SUCESSO!' AS Status;
