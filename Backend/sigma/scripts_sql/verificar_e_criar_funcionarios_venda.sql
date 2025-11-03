-- ============================================================================
-- Script: Verificar e criar funcionários autorizados para vendas
-- ============================================================================

USE SIGMA;

-- ============================================================================
-- 1. Verificar funcionários existentes e seus cargos
-- ============================================================================

SELECT 
    f.id_pessoa,
    p.nome,
    f.cargo,
    f.setor,
    CASE 
        WHEN f.cargo IN ('Administrador', 'Gerente de Vendas', 'Supervisor de Caixa', 'Operador de Caixa', 'Vendedor') 
        THEN '✅ AUTORIZADO'
        ELSE '❌ NÃO AUTORIZADO'
    END AS status_venda
FROM Funcionario f
JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
ORDER BY f.cargo;

-- ============================================================================
-- 2. Atualizar funcionário ID 1 para cargo autorizado (se existir)
-- ============================================================================

UPDATE Funcionario
SET cargo = 'Operador de Caixa',
    setor = 'Vendas'
WHERE id_pessoa = 1;

-- ============================================================================
-- 3. Verificar se a atualização foi bem-sucedida
-- ============================================================================

SELECT 
    f.id_pessoa,
    p.nome,
    f.cargo,
    f.setor,
    '✅ AUTORIZADO PARA VENDAS' AS status
FROM Funcionario f
JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
WHERE f.id_pessoa = 1;

-- ============================================================================
-- 4. Se não existir funcionário com ID 1, criar um operador de caixa padrão
-- ============================================================================

-- Verificar se existe pessoa com ID 1
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM Pessoa WHERE id_pessoa = 1) THEN '✅ Pessoa ID 1 existe'
        ELSE '❌ Pessoa ID 1 não existe - criar manualmente'
    END AS status_pessoa;

-- ============================================================================
-- 5. Listar todos os funcionários autorizados para vendas
-- ============================================================================

SELECT 
    f.id_pessoa,
    p.nome,
    f.cargo,
    f.setor,
    f.salario
FROM Funcionario f
JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
WHERE f.cargo IN ('Administrador', 'Gerente de Vendas', 'Supervisor de Caixa', 'Operador de Caixa', 'Vendedor')
ORDER BY f.cargo, p.nome;

SELECT '✅ SCRIPT EXECUTADO COM SUCESSO!' AS Status;
