USE SIGMA;

-- Remover índices caso existam
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

-- ================================================================
-- ÍNDICE 1: Produtos por Fornecedor e Status
-- ================================================================
-- Justificativa: Otimiza consultas que buscam produtos ativos de um fornecedor específico
-- Usado nas consultas avançadas (FULL OUTER JOIN) e views de estoque
-- Melhora performance ao filtrar produtos por fornecedor e status simultaneamente
CREATE INDEX idx_produto_fornecedor_status ON Produto(id_fornecedor, status);

-- ================================================================
-- ÍNDICE 2: Vendas por Cliente e Data
-- ================================================================
-- Justificativa: Acelera consultas de histórico de compras por cliente
-- Usado nas subconsultas de clientes VIP e relatórios de vendas
-- Essencial para dashboards que filtram vendas por cliente e período
CREATE INDEX idx_venda_cliente_data ON Venda(id_cliente, data_venda);
