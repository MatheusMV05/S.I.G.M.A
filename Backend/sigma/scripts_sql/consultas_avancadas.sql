-- ================================================================
-- CONSULTAS AVANÇADAS COM JOINS E SUBCONSULTAS
-- Sistema S.I.G.M.A - Etapa 04
-- Requisitos: 1 Anti Join, 1 Full Outer Join, 2 Subconsultas
-- ================================================================

USE SIGMA;

-- ================================================================
-- 1. ANTI JOIN (LEFT JOIN + WHERE NULL) 
-- Produtos que NUNCA foram vendidos
-- ================================================================
-- Justificativa: Identificar produtos parados em estoque que nunca geraram receita
-- Útil para decisões de descontinuação ou promoção de produtos
SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.marca,
    p.preco_venda,
    p.estoque,
    c.nome AS categoria_nome,
    f.nome_fantasia AS fornecedor_nome,
    (p.preco_custo * p.estoque) AS valor_investido,
    (p.preco_venda * p.estoque) AS valor_potencial_venda,
    DATEDIFF(CURDATE(), p.data_cadastro) AS dias_sem_venda
FROM Produto p
LEFT JOIN VendaItem vi ON p.id_produto = vi.id_produto
LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
WHERE vi.id_venda_item IS NULL
  AND p.status = 'ATIVO'
ORDER BY valor_investido DESC, dias_sem_venda DESC;


-- ================================================================
-- 2. FULL OUTER JOIN (Simulado com UNION)
-- Produtos e Fornecedores - Relacionamento Completo
-- ================================================================
-- Justificativa: Identificar produtos sem fornecedor E fornecedores sem produtos
-- MySQL não suporta FULL OUTER JOIN nativamente, por isso usamos UNION
-- Útil para manutenção de cadastros e garantia de integridade referencial
SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.preco_venda,
    p.estoque,
    f.id_fornecedor,
    f.nome_fantasia AS fornecedor_nome,
    f.telefone AS fornecedor_telefone,
    f.status AS fornecedor_status,
    CASE 
        WHEN p.id_produto IS NULL THEN 'Fornecedor sem produtos cadastrados'
        WHEN f.id_fornecedor IS NULL THEN 'Produto sem fornecedor vinculado'
        ELSE 'Relacionamento OK'
    END AS status_vinculo
FROM Produto p
LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor

UNION

SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.preco_venda,
    p.estoque,
    f.id_fornecedor,
    f.nome_fantasia AS fornecedor_nome,
    f.telefone AS fornecedor_telefone,
    f.status AS fornecedor_status,
    CASE 
        WHEN p.id_produto IS NULL THEN 'Fornecedor sem produtos cadastrados'
        WHEN f.id_fornecedor IS NULL THEN 'Produto sem fornecedor vinculado'
        ELSE 'Relacionamento OK'
    END AS status_vinculo
FROM Produto p
RIGHT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
ORDER BY status_vinculo DESC, fornecedor_nome;


-- ================================================================
-- 3. SUBCONSULTA 1: Produtos com Preço Acima da Média por Categoria
-- ================================================================
-- Justificativa: Identificar produtos premium ou com margem de lucro elevada
-- Útil para estratégias de pricing e análise de competitividade
SELECT 
    p.id_produto,
    p.nome AS produto_nome,
    p.marca,
    p.preco_venda,
    p.preco_custo,
    p.margem_lucro,
    c.nome AS categoria_nome,
    (SELECT ROUND(AVG(p2.preco_venda), 2) 
     FROM Produto p2 
     WHERE p2.id_categoria = p.id_categoria 
       AND p2.status = 'ATIVO') AS preco_medio_categoria,
    ROUND(p.preco_venda - (SELECT AVG(p2.preco_venda) 
                           FROM Produto p2 
                           WHERE p2.id_categoria = p.id_categoria 
                             AND p2.status = 'ATIVO'), 2) AS diferenca_media,
    ROUND(((p.preco_venda / (SELECT AVG(p2.preco_venda) 
                             FROM Produto p2 
                             WHERE p2.id_categoria = p.id_categoria 
                               AND p2.status = 'ATIVO')) - 1) * 100, 2) AS percentual_acima_media
FROM Produto p
INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
WHERE p.preco_venda > (SELECT AVG(p2.preco_venda) 
                       FROM Produto p2 
                       WHERE p2.id_categoria = p.id_categoria 
                         AND p2.status = 'ATIVO')
  AND p.status = 'ATIVO'
ORDER BY percentual_acima_media DESC;


-- ================================================================
-- 4. SUBCONSULTA 2: Clientes VIP (Total Gasto Acima da Média)
-- ================================================================
-- Justificativa: Identificar clientes de alto valor para programas de fidelidade
-- Permite segmentação de clientes para marketing direcionado
SELECT 
    c.id_pessoa,
    p.nome AS cliente_nome,
    p.email AS cliente_email,
    c.tipo_pessoa,
    c.ranking,
    c.total_gasto,
    c.data_ultima_compra,
    COUNT(v.id_venda) AS total_compras,
    ROUND(c.total_gasto / NULLIF(COUNT(v.id_venda), 0), 2) AS ticket_medio,
    (SELECT ROUND(AVG(total_gasto), 2) 
     FROM Cliente 
     WHERE ativo = TRUE) AS media_gasto_geral,
    ROUND(c.total_gasto - (SELECT AVG(total_gasto) 
                           FROM Cliente 
                           WHERE ativo = TRUE), 2) AS diferenca_media,
    ROUND(((c.total_gasto / (SELECT AVG(total_gasto) 
                             FROM Cliente 
                             WHERE ativo = TRUE)) - 1) * 100, 2) AS percentual_acima_media
FROM Cliente c
INNER JOIN Pessoa p ON c.id_pessoa = p.id_pessoa
LEFT JOIN Venda v ON c.id_pessoa = v.id_cliente AND v.status = 'CONCLUIDA'
WHERE c.ativo = TRUE
  AND c.total_gasto > (SELECT AVG(total_gasto) 
                       FROM Cliente 
                       WHERE ativo = TRUE)
GROUP BY c.id_pessoa, p.nome, p.email, c.tipo_pessoa, c.ranking, 
         c.total_gasto, c.data_ultima_compra
HAVING COUNT(v.id_venda) > 0
ORDER BY c.total_gasto DESC, total_compras DESC;
