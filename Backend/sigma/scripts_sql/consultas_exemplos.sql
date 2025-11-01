-- ================================================================
-- CONSULTAS DE EXEMPLO E DEMONSTRAÇÃO
-- Sistema S.I.G.M.A - Para testes e apresentação
-- ================================================================

USE SIGMA;

-- ================================================================
-- CONSULTAS AVANÇADAS - ETAPA 04
-- ================================================================

-- 1. ANTI JOIN - Produtos que NUNCA foram vendidos
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


-- 2. FULL OUTER JOIN - Produtos e Fornecedores (relacionamento completo)
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


-- 3. SUBCONSULTA 1 - Produtos com preço acima da média da categoria
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


-- 4. SUBCONSULTA 2 - Clientes VIP (total gasto acima da média)
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


-- ================================================================
-- CONSULTAS NAS VIEWS CRIADAS
-- ================================================================

-- Vendas do mês atual
SELECT * FROM vw_analise_vendas_completa 
WHERE MONTH(data_venda) = MONTH(CURDATE()) 
  AND YEAR(data_venda) = YEAR(CURDATE())
  AND status_venda = 'CONCLUIDA'
ORDER BY data_venda DESC
LIMIT 20;


-- Produtos com estoque crítico
SELECT * FROM vw_inventario_rentabilidade 
WHERE status_estoque IN ('CRÍTICO - SEM ESTOQUE', 'ALERTA - ESTOQUE BAIXO')
  AND status_produto = 'ATIVO'
ORDER BY estoque ASC
LIMIT 20;


-- Top 10 produtos mais rentáveis
SELECT 
    produto_nome, 
    categoria_nome, 
    margem_lucro_percentual, 
    lucro_potencial_estoque, 
    classificacao_rentabilidade
FROM vw_inventario_rentabilidade
WHERE status_produto = 'ATIVO'
ORDER BY lucro_potencial_estoque DESC
LIMIT 10;


-- Análise de vendas por vendedor
SELECT 
    vendedor_nome, 
    vendedor_setor,
    COUNT(*) AS total_vendas,
    SUM(valor_final) AS faturamento_total,
    ROUND(AVG(valor_final), 2) AS ticket_medio
FROM vw_analise_vendas_completa
WHERE status_venda = 'CONCLUIDA'
GROUP BY vendedor_nome, vendedor_setor
ORDER BY faturamento_total DESC;


-- ================================================================
-- TESTES DAS FUNÇÕES
-- ================================================================

-- Calcular desconto para diferentes valores
SELECT 
    150.00 AS valor_compra,
    fn_calcular_desconto_progressivo(150.00) AS desconto_percentual,
    150.00 * fn_calcular_desconto_progressivo(150.00) AS valor_desconto,
    150.00 - (150.00 * fn_calcular_desconto_progressivo(150.00)) AS valor_final
UNION ALL
SELECT 
    350.00,
    fn_calcular_desconto_progressivo(350.00),
    350.00 * fn_calcular_desconto_progressivo(350.00),
    350.00 - (350.00 * fn_calcular_desconto_progressivo(350.00))
UNION ALL
SELECT 
    750.00,
    fn_calcular_desconto_progressivo(750.00),
    750.00 * fn_calcular_desconto_progressivo(750.00),
    750.00 - (750.00 * fn_calcular_desconto_progressivo(750.00))
UNION ALL
SELECT 
    1500.00,
    fn_calcular_desconto_progressivo(1500.00),
    1500.00 * fn_calcular_desconto_progressivo(1500.00),
    1500.00 - (1500.00 * fn_calcular_desconto_progressivo(1500.00));


-- Classificar clientes por total gasto
SELECT 
    p.nome AS cliente_nome,
    c.total_gasto,
    c.ranking,
    fn_classificar_cliente(c.total_gasto) AS classificacao_automatica
FROM Cliente c
INNER JOIN Pessoa p ON c.id_pessoa = p.id_pessoa
WHERE c.ativo = TRUE
ORDER BY c.total_gasto DESC
LIMIT 20;


-- ================================================================
-- TESTES DOS PROCEDIMENTOS
-- ================================================================

-- Relatório de produtos críticos
CALL sp_relatorio_produtos_criticos();


-- Reajustar preços (exemplo - ajuste conforme necessário)
-- CALL sp_reajustar_precos_categoria(1, 5.00, FALSE);


-- ================================================================
-- CONSULTAS NA TABELA DE AUDITORIA
-- ================================================================

-- Ver logs das últimas 24 horas
SELECT * FROM AuditoriaLog 
WHERE data_hora >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY data_hora DESC
LIMIT 50;


-- Ver histórico de alterações de produtos
SELECT 
    id_log,
    operacao,
    descricao,
    dados_antigos,
    dados_novos,
    data_hora
FROM AuditoriaLog 
WHERE tabela_afetada = 'Produto'
ORDER BY data_hora DESC
LIMIT 30;


-- Ver alterações de preços
SELECT * FROM AuditoriaLog 
WHERE tabela_afetada = 'Produto'
  AND (dados_antigos LIKE '%Preço%' OR dados_novos LIKE '%Preço%')
ORDER BY data_hora DESC
LIMIT 20;


-- Estatísticas de auditoria
SELECT 
    tabela_afetada,
    operacao,
    COUNT(*) AS total_operacoes,
    MAX(data_hora) AS ultima_operacao
FROM AuditoriaLog
GROUP BY tabela_afetada, operacao
ORDER BY total_operacoes DESC;


-- ================================================================
-- CONSULTAS ÚTEIS PARA DASHBOARD/RELATÓRIOS
-- ================================================================

-- Resumo de vendas por período
SELECT 
    DATE(data_venda) AS data,
    COUNT(*) AS qtd_vendas,
    SUM(valor_total) AS total_bruto,
    SUM(desconto) AS total_descontos,
    SUM(valor_final) AS faturamento,
    ROUND(AVG(valor_final), 2) AS ticket_medio
FROM Venda
WHERE status = 'CONCLUIDA'
  AND data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(data_venda)
ORDER BY data DESC;


-- Top produtos mais vendidos
SELECT 
    p.id_produto,
    p.nome,
    p.marca,
    c.nome AS categoria,
    COUNT(vi.id_venda_item) AS qtd_vendas,
    SUM(vi.quantidade) AS total_unidades_vendidas,
    SUM(vi.subtotal) AS faturamento_total
FROM VendaItem vi
INNER JOIN Produto p ON vi.id_produto = p.id_produto
INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
INNER JOIN Venda v ON vi.id_venda = v.id_venda
WHERE v.status = 'CONCLUIDA'
  AND v.data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY p.id_produto, p.nome, p.marca, c.nome
ORDER BY total_unidades_vendidas DESC
LIMIT 10;


-- Análise de estoque por categoria
SELECT 
    c.nome AS categoria,
    COUNT(p.id_produto) AS total_produtos,
    SUM(p.estoque) AS estoque_total,
    ROUND(SUM(p.preco_custo * p.estoque), 2) AS valor_estoque_custo,
    ROUND(SUM(p.preco_venda * p.estoque), 2) AS valor_estoque_venda,
    ROUND(AVG(p.margem_lucro), 2) AS margem_media
FROM Categoria c
LEFT JOIN Produto p ON c.id_categoria = p.id_categoria AND p.status = 'ATIVO'
WHERE c.status = 'ATIVA'
GROUP BY c.id_categoria, c.nome
ORDER BY valor_estoque_venda DESC;
