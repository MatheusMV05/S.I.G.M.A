-- ================================================================
-- CONSULTAS AVANÇADAS COM JOINS E SUBCONSULTAS
-- Sistema S.I.G.M.A - Etapa 04
-- ================================================================

-- ================================================================
-- 1. ANTI JOIN (LEFT JOIN + WHERE NULL) 
-- Produtos que NUNCA foram vendidos
-- ================================================================
-- Útil para identificar produtos parados em estoque
SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.preco_venda,
    p.quantidade_estoque,
    c.nome AS categoria_nome,
    (p.preco_venda * p.quantidade_estoque) AS valor_estoque_parado
FROM Produto p
LEFT JOIN ItemVenda iv ON p.id_produto = iv.id_produto
INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
WHERE iv.id_item IS NULL
ORDER BY valor_estoque_parado DESC;


-- ================================================================
-- 2. FULL OUTER JOIN (Simulado com UNION)
-- Todos produtos e fornecedores (mesmo sem relação)
-- ================================================================
-- MySQL não suporta FULL OUTER JOIN nativamente
-- Mostra produtos sem fornecedor E fornecedores sem produtos
SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.preco_venda,
    f.id_fornecedor,
    f.nome AS fornecedor_nome,
    f.telefone AS fornecedor_telefone,
    CASE 
        WHEN p.id_produto IS NULL THEN 'Fornecedor sem produtos cadastrados'
        WHEN f.id_fornecedor IS NULL THEN 'Produto sem fornecedor vinculado'
        ELSE 'Relação completa'
    END AS status_vinculo
FROM Produto p
LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor

UNION

SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.preco_venda,
    f.id_fornecedor,
    f.nome AS fornecedor_nome,
    f.telefone AS fornecedor_telefone,
    CASE 
        WHEN p.id_produto IS NULL THEN 'Fornecedor sem produtos cadastrados'
        WHEN f.id_fornecedor IS NULL THEN 'Produto sem fornecedor vinculado'
        ELSE 'Relação completa'
    END AS status_vinculo
FROM Produto p
RIGHT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
ORDER BY status_vinculo, fornecedor_nome;


-- ================================================================
-- 3. SUBCONSULTA 1: Produtos com preço ACIMA DA MÉDIA
-- ================================================================
-- Identifica produtos premium ou com margem alta
SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.preco_venda,
    c.nome AS categoria_nome,
    ROUND((p.preco_venda - (SELECT AVG(preco_venda) FROM Produto)), 2) AS diferenca_media,
    ROUND(((p.preco_venda / (SELECT AVG(preco_venda) FROM Produto)) - 1) * 100, 2) AS percentual_acima_media
FROM Produto p
INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
WHERE p.preco_venda > (SELECT AVG(preco_venda) FROM Produto)
ORDER BY p.preco_venda DESC;


-- ================================================================
-- 4. SUBCONSULTA 2: Clientes que compraram MAIS QUE A MÉDIA
-- ================================================================
-- Identifica clientes VIP/frequentes para programas de fidelidade
SELECT 
    c.id_cliente,
    c.nome AS cliente_nome,
    c.cpf,
    c.telefone,
    COUNT(v.id_venda) AS total_compras,
    ROUND(AVG(v.valor_total), 2) AS ticket_medio,
    ROUND(SUM(v.valor_total), 2) AS valor_total_gasto,
    (
        SELECT ROUND(AVG(compras_por_cliente), 2)
        FROM (
            SELECT COUNT(*) as compras_por_cliente
            FROM Venda
            GROUP BY id_cliente
        ) AS subquery
    ) AS media_compras_geral
FROM Cliente c
INNER JOIN Venda v ON c.id_cliente = v.id_cliente
GROUP BY c.id_cliente, c.nome, c.cpf, c.telefone
HAVING COUNT(v.id_venda) > (
    SELECT AVG(compras_por_cliente)
    FROM (
        SELECT COUNT(*) as compras_por_cliente
        FROM Venda
        GROUP BY id_cliente
    ) AS subquery2
)
ORDER BY total_compras DESC, valor_total_gasto DESC;


-- ================================================================
-- BONUS: Subconsulta 3 - Categorias com faturamento acima da média
-- ================================================================
SELECT 
    c.id_categoria,
    c.nome AS categoria_nome,
    COUNT(DISTINCT p.id_produto) AS total_produtos,
    ROUND(SUM(iv.quantidade * iv.preco_unitario), 2) AS faturamento_total,
    ROUND(AVG(iv.preco_unitario), 2) AS preco_medio_venda,
    (
        SELECT ROUND(AVG(faturamento_categoria), 2)
        FROM (
            SELECT SUM(iv2.quantidade * iv2.preco_unitario) as faturamento_categoria
            FROM Categoria c2
            INNER JOIN Produto p2 ON c2.id_categoria = p2.id_categoria
            LEFT JOIN ItemVenda iv2 ON p2.id_produto = iv2.id_produto
            GROUP BY c2.id_categoria
        ) AS fat_medio
    ) AS media_faturamento_geral
FROM Categoria c
INNER JOIN Produto p ON c.id_categoria = p.id_categoria
INNER JOIN ItemVenda iv ON p.id_produto = iv.id_produto
GROUP BY c.id_categoria, c.nome
HAVING SUM(iv.quantidade * iv.preco_unitario) > (
    SELECT AVG(faturamento_categoria)
    FROM (
        SELECT SUM(iv3.quantidade * iv3.preco_unitario) as faturamento_categoria
        FROM Categoria c3
        INNER JOIN Produto p3 ON c3.id_categoria = p3.id_categoria
        LEFT JOIN ItemVenda iv3 ON p3.id_produto = iv3.id_produto
        GROUP BY c3.id_categoria
    ) AS fat_medio2
)
ORDER BY faturamento_total DESC;
