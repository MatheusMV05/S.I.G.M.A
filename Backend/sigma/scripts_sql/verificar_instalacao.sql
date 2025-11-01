-- =====================================================
-- SCRIPT DE VERIFICAÇÃO DA INSTALAÇÃO
-- =====================================================
-- Este script verifica se todos os objetos foram criados corretamente
-- Execute após rodar o script_completo_etapas_04_05.sql

USE SIGMA;

-- =====================================================
-- 1. VERIFICAR ÍNDICES
-- =====================================================
SELECT 'VERIFICANDO ÍNDICES' AS Status;
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'SIGMA'
  AND INDEX_NAME IN ('idx_produto_fornecedor_status', 'idx_venda_cliente_data')
ORDER BY INDEX_NAME, SEQ_IN_INDEX;

-- =====================================================
-- 2. VERIFICAR VIEWS
-- =====================================================
SELECT '\nVERIFICANDO VIEWS' AS Status;
SELECT 
    TABLE_NAME,
    VIEW_DEFINITION
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'SIGMA'
  AND TABLE_NAME IN ('vw_analise_vendas_completa', 'vw_inventario_rentabilidade');

-- =====================================================
-- 3. VERIFICAR FUNÇÕES
-- =====================================================
SELECT '\nVERIFICANDO FUNÇÕES' AS Status;
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    DATA_TYPE AS RETURN_TYPE
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'SIGMA'
  AND ROUTINE_TYPE = 'FUNCTION'
  AND ROUTINE_NAME IN ('fn_calcular_desconto_progressivo', 'fn_classificar_cliente');

-- =====================================================
-- 4. VERIFICAR PROCEDURES
-- =====================================================
SELECT '\nVERIFICANDO PROCEDURES' AS Status;
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'SIGMA'
  AND ROUTINE_TYPE = 'PROCEDURE'
  AND ROUTINE_NAME IN ('sp_reajustar_precos_categoria', 'sp_relatorio_produtos_criticos');

-- =====================================================
-- 5. VERIFICAR TRIGGERS
-- =====================================================
SELECT '\nVERIFICANDO TRIGGERS' AS Status;
SELECT 
    TRIGGER_NAME,
    EVENT_MANIPULATION,
    EVENT_OBJECT_TABLE,
    ACTION_TIMING
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'SIGMA'
  AND TRIGGER_NAME IN ('trg_baixar_estoque_venda', 'trg_auditoria_produto_update');

-- =====================================================
-- 6. VERIFICAR TABELA DE AUDITORIA
-- =====================================================
SELECT '\nVERIFICANDO TABELA DE AUDITORIA' AS Status;
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'SIGMA'
  AND TABLE_NAME = 'AuditoriaLog'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- RESUMO FINAL
-- =====================================================
SELECT '\n\n===== RESUMO DA INSTALAÇÃO =====' AS '';
SELECT 
    'Índices' AS Tipo,
    COUNT(*) AS Encontrados,
    '2' AS Esperados
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'SIGMA'
  AND INDEX_NAME IN ('idx_produto_fornecedor_status', 'idx_venda_cliente_data')
UNION ALL
SELECT 
    'Views' AS Tipo,
    COUNT(*) AS Encontrados,
    '2' AS Esperados
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'SIGMA'
  AND TABLE_NAME IN ('vw_analise_vendas_completa', 'vw_inventario_rentabilidade')
UNION ALL
SELECT 
    'Funções' AS Tipo,
    COUNT(*) AS Encontrados,
    '2' AS Esperados
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'SIGMA'
  AND ROUTINE_TYPE = 'FUNCTION'
  AND ROUTINE_NAME IN ('fn_calcular_desconto_progressivo', 'fn_classificar_cliente')
UNION ALL
SELECT 
    'Procedures' AS Tipo,
    COUNT(*) AS Encontrados,
    '2' AS Esperados
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'SIGMA'
  AND ROUTINE_TYPE = 'PROCEDURE'
  AND ROUTINE_NAME IN ('sp_reajustar_precos_categoria', 'sp_relatorio_produtos_criticos')
UNION ALL
SELECT 
    'Triggers' AS Tipo,
    COUNT(*) AS Encontrados,
    '2' AS Esperados
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'SIGMA'
  AND TRIGGER_NAME IN ('trg_baixar_estoque_venda', 'trg_auditoria_produto_update');
