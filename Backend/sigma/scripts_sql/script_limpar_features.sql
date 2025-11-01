-- ================================================================
-- SCRIPT PARA LIMPAR FUNCIONALIDADES AVANÇADAS
-- Execute este script ANTES de executar o script_completo_SIMPLES.sql
-- caso já tenha executado anteriormente
-- ================================================================

USE SIGMA;

-- Remover triggers
DROP TRIGGER IF EXISTS trg_baixar_estoque_venda;
DROP TRIGGER IF EXISTS trg_auditoria_produto_update;

-- Remover procedimentos
DROP PROCEDURE IF EXISTS sp_reajustar_precos_categoria;
DROP PROCEDURE IF EXISTS sp_relatorio_produtos_criticos;

-- Remover funções
DROP FUNCTION IF EXISTS fn_calcular_desconto_progressivo;
DROP FUNCTION IF EXISTS fn_classificar_cliente;

-- Remover views
DROP VIEW IF EXISTS vw_analise_vendas_completa;
DROP VIEW IF EXISTS vw_inventario_rentabilidade;

-- Remover tabela de auditoria
DROP TABLE IF EXISTS AuditoriaLog;

-- Remover índices (com verificação condicional)
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
               WHERE table_schema = 'SIGMA' 
               AND table_name = 'Produto' 
               AND index_name = 'idx_produto_fornecedor_status');
SET @sqlstmt := IF(@exist > 0, 'ALTER TABLE Produto DROP INDEX idx_produto_fornecedor_status', 'SELECT "OK"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
               WHERE table_schema = 'SIGMA' 
               AND table_name = 'Venda' 
               AND index_name = 'idx_venda_cliente_data');
SET @sqlstmt := IF(@exist > 0, 'ALTER TABLE Venda DROP INDEX idx_venda_cliente_data', 'SELECT "OK"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Limpeza concluída! Agora você pode executar o script_completo_SIMPLES.sql' AS status;
