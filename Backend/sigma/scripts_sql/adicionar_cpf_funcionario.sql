-- ================================================================
-- ADICIONAR CAMPO CPF NA TABELA FUNCIONARIO
-- ================================================================
-- Descrição: Adiciona campo cpf diretamente na tabela Funcionario
--            Similar à estrutura de ClienteFisico que já possui CPF
-- ================================================================
-- NOTA: Se você está executando o script de criação atualizado,
--       este script não é necessário. Use apenas para migração
--       de bancos existentes.
-- ================================================================

USE sigma;

-- Verificar se a coluna já existe
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'sigma' 
  AND TABLE_NAME = 'Funcionario' 
  AND COLUMN_NAME = 'cpf';

-- Adicionar coluna CPF na tabela Funcionario apenas se não existir
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE Funcionario ADD COLUMN cpf VARCHAR(14) UNIQUE NULL COMMENT ''CPF do funcionário'' AFTER id_pessoa',
    'SELECT ''Coluna cpf já existe na tabela Funcionario'' AS aviso');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrar CPFs existentes de DocumentoFuncionario para Funcionario (se houver)
UPDATE Funcionario f
INNER JOIN DocumentoFuncionario d ON f.id_pessoa = d.id_funcionario
SET f.cpf = d.numero_documento
WHERE d.tipo_documento = 'CPF' AND f.cpf IS NULL;

-- Verificar migração
SELECT 
    f.id_pessoa,
    f.matricula,
    p.nome,
    f.cpf,
    CASE 
        WHEN f.cpf IS NOT NULL THEN '✓ CPF Cadastrado'
        ELSE '✗ Sem CPF'
    END as status_cpf
FROM Funcionario f
INNER JOIN Pessoa p ON f.id_pessoa = p.id_pessoa
ORDER BY f.id_pessoa;

SELECT '✓ Script executado com sucesso!' as resultado;
