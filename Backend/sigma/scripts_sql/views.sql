
USE SIGMA;

-- ================================================================
-- VIEW 1: Análise Completa de Vendas com Detalhamento
-- ================================================================
-- Justificativa: Consolida informações de 4 tabelas (Venda, Cliente, Pessoa, Funcionario)
-- para análise gerencial completa de vendas, incluindo perfil do cliente e vendedor
-- Útil para relatórios de desempenho, comissões e análise de comportamento de compra
CREATE OR REPLACE VIEW vw_analise_vendas_completa AS
SELECT
    -- Dados da Venda
    v.id_venda,
    v.data_venda,
    DATE(v.data_venda) AS data_venda_simples,
    v.valor_total,
    v.desconto,
    v.valor_final,
    v.metodo_pagamento,
    v.status AS status_venda,
    
    -- Dados do Cliente
    c.id_pessoa AS id_cliente,
    pc.nome AS cliente_nome,
    pc.email AS cliente_email,
    pc.cidade AS cliente_cidade,
    c.tipo_pessoa,
    c.ranking AS ranking_cliente,
    c.total_gasto AS total_gasto_cliente,
    
    -- Dados do Funcionário/Vendedor
    f.id_pessoa AS id_funcionario,
    pf.nome AS vendedor_nome,
    f.cargo AS vendedor_cargo,
    f.setor AS vendedor_setor,
    
    -- Dados do Caixa
    cx.id_caixa,
    cx.status AS status_caixa,
    
    -- Métricas Calculadas
    ROUND((v.desconto / NULLIF(v.valor_total, 0)) * 100, 2) AS percentual_desconto,
    ROUND(v.valor_final / NULLIF((SELECT COUNT(*) FROM VendaItem WHERE id_venda = v.id_venda), 0), 2) AS valor_medio_item,
    (SELECT COUNT(*) FROM VendaItem WHERE id_venda = v.id_venda) AS quantidade_itens,
    DAYNAME(v.data_venda) AS dia_semana_venda,
    HOUR(v.data_venda) AS hora_venda
FROM Venda v
INNER JOIN Cliente c ON v.id_cliente = c.id_pessoa
INNER JOIN Pessoa pc ON c.id_pessoa = pc.id_pessoa
INNER JOIN Funcionario f ON v.id_funcionario = f.id_pessoa
INNER JOIN Pessoa pf ON f.id_pessoa = pf.id_pessoa
LEFT JOIN Caixa cx ON v.id_caixa = cx.id_caixa;


-- ================================================================
-- VIEW 2: Inventário Completo com Análise de Rentabilidade
-- ================================================================
-- Justificativa: Integra 4 tabelas (Produto, Categoria, Fornecedor, Pessoa)
-- para visão 360° do estoque com análise financeira e logística
-- Essencial para decisões de compra, reposição e precificação
CREATE OR REPLACE VIEW vw_inventario_rentabilidade AS
SELECT
    -- Dados do Produto
    p.id_produto,
    p.nome AS produto_nome,
    p.marca,
    p.descricao,
    p.codigo_barras,
    p.codigo_interno,
    p.status AS status_produto,
    
    -- Preços e Margens
    p.preco_custo,
    p.preco_venda,
    -- Calcular margem de lucro: ((preco_venda - preco_custo) / preco_custo) * 100
    ROUND(
        CASE 
            WHEN p.preco_custo > 0 THEN ((p.preco_venda - p.preco_custo) / p.preco_custo) * 100
            ELSE 0
        END, 
    2) AS margem_lucro_percentual,
    ROUND(p.preco_venda - p.preco_custo, 2) AS lucro_unitario,
    
    -- Estoque
    p.estoque,
    p.estoque_minimo,
    p.estoque_maximo,
    p.unidade_medida,
    p.localizacao_prateleira,
    
    -- Valores Totais
    ROUND(p.preco_custo * p.estoque, 2) AS valor_estoque_custo,
    ROUND(p.preco_venda * p.estoque, 2) AS valor_estoque_venda,
    ROUND((p.preco_venda - p.preco_custo) * p.estoque, 2) AS lucro_potencial_estoque,
    
    -- Categoria
    c.id_categoria,
    c.nome AS categoria_nome,
    c.descricao AS categoria_descricao,
    c.status AS status_categoria,
    
    -- Fornecedor
    f.id_fornecedor,
    f.nome_fantasia AS fornecedor_nome,
    f.razao_social AS fornecedor_razao_social,
    f.cnpj AS fornecedor_cnpj,
    f.telefone AS fornecedor_telefone,
    f.email AS fornecedor_email,
    f.cidade AS fornecedor_cidade,
    f.estado AS fornecedor_estado,
    f.prazo_entrega_dias,
    f.avaliacao AS avaliacao_fornecedor,
    f.status AS status_fornecedor,
    
    -- Status de Alerta
    CASE 
        WHEN p.estoque = 0 THEN 'CRÍTICO - SEM ESTOQUE'
        WHEN p.estoque <= p.estoque_minimo THEN 'ALERTA - ESTOQUE BAIXO'
        WHEN p.estoque >= p.estoque_maximo THEN 'ATENÇÃO - ESTOQUE ALTO'
        ELSE 'ESTOQUE NORMAL'
    END AS status_estoque,
    
    CASE 
        WHEN p.estoque <= p.estoque_minimo 
        THEN CONCAT('Repor ', (p.estoque_minimo - p.estoque + 10), ' unidades')
        ELSE 'Estoque adequado'
    END AS acao_recomendada,
    
    -- Análise de Rentabilidade
    CASE 
        WHEN p.preco_custo > 0 AND ((p.preco_venda - p.preco_custo) / p.preco_custo) * 100 >= 50 THEN 'ALTA RENTABILIDADE'
        WHEN p.preco_custo > 0 AND ((p.preco_venda - p.preco_custo) / p.preco_custo) * 100 >= 30 THEN 'RENTABILIDADE MÉDIA'
        WHEN p.preco_custo > 0 AND ((p.preco_venda - p.preco_custo) / p.preco_custo) * 100 >= 15 THEN 'RENTABILIDADE BAIXA'
        ELSE 'RENTABILIDADE CRÍTICA'
    END AS classificacao_rentabilidade,
    
    p.data_cadastro,
    DATEDIFF(CURDATE(), p.data_cadastro) AS dias_desde_cadastro
    
FROM Produto p
LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor;



