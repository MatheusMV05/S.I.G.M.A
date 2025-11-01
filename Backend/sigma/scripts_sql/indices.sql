-- ================================================================
-- ÍNDICES ESTRATÉGICOS PARA OTIMIZAÇÃO DE CONSULTAS
-- Sistema S.I.G.M.A - Etapa 04
-- ================================================================

-- Índice 1: Para buscas de produtos por categoria
-- Melhora performance em queries que filtram/agrupam por categoria
CREATE INDEX idx_produto_categoria ON Produto(id_categoria);

-- Índice 2: Para consultas de vendas por período
-- Acelera relatórios e dashboards que filtram por data
CREATE INDEX idx_venda_data ON Venda(data_venda);

-- Índice 3: Para movimentações por produto e período
-- Otimiza rastreamento de histórico de estoque
CREATE INDEX idx_movimentacao_produto ON MovimentacaoEstoque(id_produto, data_movimentacao);

-- ================================================================
-- VERIFICAÇÃO DOS ÍNDICES CRIADOS
-- ================================================================
-- Para verificar os índices criados, execute:
-- SHOW INDEX FROM Produto;
-- SHOW INDEX FROM Venda;
-- SHOW INDEX FROM MovimentacaoEstoque;
