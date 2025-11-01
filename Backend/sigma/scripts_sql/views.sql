-- ================================================================
-- VIEWS (VISÕES) PARA CONSULTAS COMPLEXAS
-- Sistema S.I.G.M.A - Etapa 04
-- ================================================================

-- ================================================================
-- VIEW 1: Relatório Completo de Vendas
-- ================================================================
-- Junta informações de Venda, Cliente, Funcionário e Itens
-- Facilita geração de relatórios gerenciais
CREATE OR REPLACE VIEW vw_relatorio_vendas AS
SELECT
    v.id_venda,
    v.data_venda,
    v.valor_total,
    v.forma_pagamento,
    c.id_cliente,
    c.nome AS cliente_nome,
    c.cpf AS cliente_cpf,
    c.telefone AS cliente_telefone,
    c.email AS cliente_email,
    f.id_funcionario,
    f.nome AS funcionario_nome,
    f.cargo AS funcionario_cargo,
    COUNT(iv.id_item) AS total_itens_venda,
    COALESCE(SUM(iv.quantidade), 0) AS quantidade_total_produtos
FROM Venda v
INNER JOIN Cliente c ON v.id_cliente = c.id_cliente
INNER JOIN Funcionario f ON v.id_funcionario = f.id_funcionario
LEFT JOIN ItemVenda iv ON v.id_venda = iv.id_venda
GROUP BY 
    v.id_venda, 
    v.data_venda, 
    v.valor_total, 
    v.forma_pagamento,
    c.id_cliente,
    c.nome, 
    c.cpf, 
    c.telefone,
    c.email,
    f.id_funcionario,
    f.nome, 
    f.cargo;


-- ================================================================
-- VIEW 2: Estoque Completo com Informações de Categoria e Fornecedor
-- ================================================================
-- Consolida informações de Produto, Categoria e Fornecedor
-- Útil para relatórios de inventário e reposição
CREATE OR REPLACE VIEW vw_estoque_completo AS
SELECT
    p.id_produto,
    p.nome AS produto_nome,
    p.descricao AS produto_descricao,
    p.preco_venda,
    p.preco_custo,
    p.quantidade_estoque,
    p.estoque_minimo,
    c.id_categoria,
    c.nome AS categoria_nome,
    c.descricao AS categoria_descricao,
    f.id_fornecedor,
    f.nome AS fornecedor_nome,
    f.telefone AS fornecedor_telefone,
    f.email AS fornecedor_email,
    f.cnpj AS fornecedor_cnpj,
    (p.preco_venda * p.quantidade_estoque) AS valor_total_estoque,
    (p.preco_custo * p.quantidade_estoque) AS custo_total_estoque,
    ((p.preco_venda - p.preco_custo) * p.quantidade_estoque) AS lucro_potencial,
    CASE 
        WHEN p.quantidade_estoque = 0 THEN 'SEM ESTOQUE'
        WHEN p.quantidade_estoque < p.estoque_minimo THEN 'ESTOQUE BAIXO'
        WHEN p.quantidade_estoque >= p.estoque_minimo * 2 THEN 'ESTOQUE OK'
        ELSE 'ESTOQUE ADEQUADO'
    END AS status_estoque,
    ROUND(((p.preco_venda - p.preco_custo) / p.preco_custo) * 100, 2) AS margem_lucro_percentual
FROM Produto p
INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor;


-- ================================================================
-- CONSULTAS DE EXEMPLO PARA AS VIEWS
-- ================================================================

-- Exemplo 1: Vendas do último mês com cliente e funcionário
-- SELECT * FROM vw_relatorio_vendas 
-- WHERE data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
-- ORDER BY data_venda DESC;

-- Exemplo 2: Produtos com estoque baixo
-- SELECT * FROM vw_estoque_completo 
-- WHERE status_estoque IN ('SEM ESTOQUE', 'ESTOQUE BAIXO')
-- ORDER BY quantidade_estoque ASC;

-- Exemplo 3: Produtos mais lucrativos
-- SELECT produto_nome, preco_venda, lucro_potencial, margem_lucro_percentual
-- FROM vw_estoque_completo
-- ORDER BY lucro_potencial DESC
-- LIMIT 10;
