-- ============================================================================
-- SCRIPT DE CORREÇÃO: VENDAS DE FUNCIONÁRIOS NÃO AUTORIZADOS
-- Remove vendas de funcionários que não deveriam realizar vendas
-- e transfere para funcionários autorizados
-- ============================================================================

USE SIGMA;

SET SQL_SAFE_UPDATES = 0;

-- ============================================================================
-- PASSO 1: Identificar cargos autorizados a realizar vendas
-- ============================================================================

-- Cargos que PODEM fazer vendas:
-- ✅ Administrador
-- ✅ Gerente de Vendas
-- ✅ Supervisor de Caixa
-- ✅ Operador de Caixa
-- ✅ Vendedor

-- Cargos que NÃO PODEM fazer vendas:
-- ❌ Gerente de Estoque
-- ❌ Supervisor de Compras
-- ❌ Auxiliar de Estoque
-- ❌ Analista de TI
-- ❌ Analista de RH
-- ❌ Contador
-- ❌ Designer
-- ❌ Assistente Administrativo
-- etc.

-- ============================================================================
-- PASSO 2: Criar view de funcionários autorizados
-- ============================================================================

DROP VIEW IF EXISTS FuncionariosAutorizadosVenda;

CREATE VIEW FuncionariosAutorizadosVenda AS
SELECT 
    f.id_pessoa,
    p.nome,
    f.matricula,
    f.cargo,
    f.setor,
    f.status
FROM Funcionario f
JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
WHERE f.cargo IN (
    'Administrador',
    'Gerente de Vendas',
    'Supervisor de Caixa',
    'Operador de Caixa',
    'Vendedor'
)
AND f.status = 'ATIVO';

-- ============================================================================
-- PASSO 3: Verificar vendas de funcionários não autorizados
-- ============================================================================

SELECT 
    f.id_pessoa,
    p.nome AS funcionario,
    f.cargo,
    COUNT(v.id_venda) AS total_vendas,
    SUM(v.valor_final) AS valor_total
FROM Venda v
JOIN Funcionario f ON v.id_funcionario = f.id_pessoa
JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
WHERE f.cargo NOT IN (
    'Administrador',
    'Gerente de Vendas',
    'Supervisor de Caixa',
    'Operador de Caixa',
    'Vendedor'
)
GROUP BY f.id_pessoa, p.nome, f.cargo
ORDER BY total_vendas DESC;

-- ============================================================================
-- PASSO 4: Transferir vendas para funcionário autorizado (Administrador)
-- ============================================================================

-- Pega o ID do Administrador (cargo com maior autoridade)
SELECT @admin_id := id_pessoa 
FROM Funcionario 
WHERE cargo = 'Administrador' 
  AND status = 'ATIVO' 
LIMIT 1;

-- Exibe o funcionário que receberá as vendas
SELECT 
    @admin_id AS id_funcionario,
    p.nome AS funcionario,
    f.cargo
FROM Funcionario f
JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
WHERE f.id_pessoa = @admin_id;

-- ============================================================================
-- PASSO 5: Atualizar vendas de funcionários não autorizados
-- ============================================================================

UPDATE Venda v
JOIN Funcionario f ON v.id_funcionario = f.id_pessoa
SET v.id_funcionario = @admin_id,
    v.observacoes = CONCAT(
        COALESCE(v.observacoes, ''), 
        '\n[CORREÇÃO AUTOMÁTICA] Venda originalmente registrada para: ',
        (SELECT nome FROM Pessoa WHERE id_pessoa = f.id_pessoa),
        ' (',
        f.cargo,
        ')'
    )
WHERE f.cargo NOT IN (
    'Administrador',
    'Gerente de Vendas',
    'Supervisor de Caixa',
    'Operador de Caixa',
    'Vendedor'
);

-- ============================================================================
-- PASSO 6: Verificação final
-- ============================================================================

-- Deve retornar 0 linhas se a correção foi bem-sucedida
SELECT 
    f.id_pessoa,
    p.nome AS funcionario,
    f.cargo,
    COUNT(v.id_venda) AS total_vendas
FROM Venda v
JOIN Funcionario f ON v.id_funcionario = f.id_pessoa
JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
WHERE f.cargo NOT IN (
    'Administrador',
    'Gerente de Vendas',
    'Supervisor de Caixa',
    'Operador de Caixa',
    'Vendedor'
)
GROUP BY f.id_pessoa, p.nome, f.cargo;

-- ============================================================================
-- PASSO 7: Estatísticas de vendas por cargo (após correção)
-- ============================================================================

SELECT 
    f.cargo,
    COUNT(DISTINCT v.id_funcionario) AS num_funcionarios,
    COUNT(v.id_venda) AS total_vendas,
    ROUND(SUM(v.valor_final), 2) AS valor_total,
    ROUND(AVG(v.valor_final), 2) AS ticket_medio
FROM Venda v
JOIN Funcionario f ON v.id_funcionario = f.id_pessoa
WHERE v.status = 'CONCLUIDA'
GROUP BY f.cargo
ORDER BY total_vendas DESC;

-- ============================================================================
-- MENSAGENS DE CONCLUSÃO
-- ============================================================================

SELECT '✅ CORREÇÃO CONCLUÍDA!' AS Status,
       'Vendas transferidas para funcionários autorizados' AS Mensagem;

SET SQL_SAFE_UPDATES = 1;
