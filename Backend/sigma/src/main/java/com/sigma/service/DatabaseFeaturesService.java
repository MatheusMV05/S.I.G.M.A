package com.sigma.service;

import com.sigma.dto.DatabaseFeaturesDTOs.*;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Serviço centralizado para executar funcionalidades avançadas do banco de dados
 * Utiliza JDBC puro (sem JPA/Hibernate) conforme requisito do projeto
 * 
 * Funcionalidades:
 * - Execução de Funções
 * - Execução de Procedimentos (Stored Procedures)
 * - Consultas Avançadas (Anti Join, Full Outer Join, Subconsultas)
 * - Consultas em Views
 * - Consultas na tabela de Auditoria
 */
public class DatabaseFeaturesService {
    
    private final Connection connection;
    
    public DatabaseFeaturesService(Connection connection) {
        this.connection = connection;
    }
    
    // ================================================================
    // FUNÇÕES
    // ================================================================
    
    /**
     * Calcula desconto progressivo baseado no valor da compra
     * Função: fn_calcular_desconto_progressivo
     */
    public BigDecimal calcularDescontoProgressivo(BigDecimal valorCompra) throws SQLException {
        String sql = "SELECT fn_calcular_desconto_progressivo(?) AS desconto";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setBigDecimal(1, valorCompra);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getBigDecimal("desconto");
                }
            }
        }
        
        return BigDecimal.ZERO;
    }
    
    /**
     * Classifica cliente baseado no total gasto
     * Função: fn_classificar_cliente
     */
    public String classificarCliente(BigDecimal totalGasto) throws SQLException {
        String sql = "SELECT fn_classificar_cliente(?) AS classificacao";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setBigDecimal(1, totalGasto);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("classificacao");
                }
            }
        }
        
        return "BRONZE";
    }
    
    // ================================================================
    // PROCEDIMENTOS ARMAZENADOS
    // ================================================================
    
    /**
     * Reajusta preços de produtos de uma categoria
     * Procedimento: sp_reajustar_precos_categoria
     */
    public ReajusteResult reajustarPrecosCategoria(
        Long idCategoria, 
        BigDecimal percentual, 
        boolean aplicarCusto
    ) throws SQLException {
        
        String sql = "{CALL sp_reajustar_precos_categoria(?, ?, ?)}";
        
        try (CallableStatement stmt = connection.prepareCall(sql)) {
            stmt.setLong(1, idCategoria);
            stmt.setBigDecimal(2, percentual);
            stmt.setBoolean(3, aplicarCusto);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new ReajusteResult(
                        rs.getString("categoria"),
                        rs.getInt("produtos_reajustados"),
                        rs.getBigDecimal("percentual_aplicado"),
                        rs.getBoolean("reajustou_custo"),
                        rs.getBigDecimal("valor_estoque_antes"),
                        rs.getBigDecimal("valor_estoque_depois"),
                        rs.getBigDecimal("diferenca_valor"),
                        rs.getTimestamp("data_hora_reajuste")
                    );
                }
            }
        }
        
        return null;
    }
    
    /**
     * Gera relatório de produtos críticos (estoque baixo, vencidos, etc)
     * Procedimento: sp_relatorio_produtos_criticos
     */
    public RelatoriosCriticosResponse gerarRelatorioProdutosCriticos() throws SQLException {
        String sql = "{CALL sp_relatorio_produtos_criticos()}";
        
        List<ProdutoCritico> produtos = new ArrayList<>();
        ResumoRelatorio resumo = null;
        
        try (CallableStatement stmt = connection.prepareCall(sql)) {
            boolean hasResults = stmt.execute();
            
            // Primeiro ResultSet - Lista de produtos críticos
            if (hasResults) {
                try (ResultSet rs = stmt.getResultSet()) {
                    while (rs.next()) {
                        produtos.add(new ProdutoCritico(
                            rs.getLong("id_produto"),
                            rs.getString("nome_produto"),
                            rs.getString("categoria"),
                            rs.getInt("estoque_atual"),
                            rs.getInt("estoque_minimo"),
                            rs.getInt("deficit"),
                            rs.getBigDecimal("preco_custo"),
                            rs.getBigDecimal("preco_venda"),
                            rs.getBigDecimal("valor_reposicao_necessaria"),
                            rs.getString("fornecedor"),
                            rs.getString("telefone_fornecedor"),
                            rs.getDate("data_validade"),
                            rs.getInt("dias_ate_vencimento"),
                            rs.getInt("dias_desde_cadastro"),
                            rs.getString("criticidade"),
                            rs.getString("motivo_criticidade"),
                            rs.getString("acao_recomendada"),
                            rs.getInt("prioridade")
                        ));
                    }
                }
                
                // Segundo ResultSet - Resumo
                if (stmt.getMoreResults()) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        if (rs.next()) {
                            resumo = new ResumoRelatorio(
                                rs.getInt("total_produtos_criticos"),
                                rs.getInt("criticos"),
                                rs.getInt("urgentes"),
                                rs.getInt("atencao"),
                                rs.getBigDecimal("valor_total_reposicao"),
                                rs.getTimestamp("data_hora_relatorio")
                            );
                        }
                    }
                }
            }
        }
        
        return new RelatoriosCriticosResponse(produtos, resumo);
    }
    
    // ================================================================
    // CONSULTAS AVANÇADAS
    // ================================================================
    
    /**
     * Anti Join - Produtos que nunca foram vendidos
     */
    public List<ProdutoNuncaVendido> consultarProdutosNuncaVendidos() throws SQLException {
        String sql = 
            "SELECT " +
            "    p.id_produto, " +
            "    p.nome AS produto_nome, " +
            "    p.marca, " +
            "    p.preco_venda, " +
            "    p.estoque, " +
            "    c.nome AS categoria_nome, " +
            "    f.nome_fantasia AS fornecedor_nome, " +
            "    (p.preco_custo * p.estoque) AS valor_investido, " +
            "    (p.preco_venda * p.estoque) AS valor_potencial_venda, " +
            "    DATEDIFF(CURDATE(), p.data_cadastro) AS dias_sem_venda " +
            "FROM Produto p " +
            "LEFT JOIN VendaItem vi ON p.id_produto = vi.id_produto " +
            "LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria " +
            "LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor " +
            "WHERE vi.id_venda_item IS NULL " +
            "  AND p.status = 'ATIVO' " +
            "ORDER BY valor_investido DESC, dias_sem_venda DESC";
        
        List<ProdutoNuncaVendido> resultados = new ArrayList<>();
        
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                resultados.add(new ProdutoNuncaVendido(
                    rs.getLong("id_produto"),
                    rs.getString("produto_nome"),
                    rs.getString("marca"),
                    rs.getBigDecimal("preco_venda"),
                    rs.getInt("estoque"),
                    rs.getString("categoria_nome"),
                    rs.getString("fornecedor_nome"),
                    rs.getBigDecimal("valor_investido"),
                    rs.getBigDecimal("valor_potencial_venda"),
                    rs.getInt("dias_sem_venda")
                ));
            }
        }
        
        return resultados;
    }
    
    /**
     * Subconsulta - Produtos com preço acima da média da categoria
     */
    public List<ProdutoPremium> consultarProdutosPremium() throws SQLException {
        String sql = 
            "SELECT " +
            "    p.id_produto, " +
            "    p.nome AS produto_nome, " +
            "    p.marca, " +
            "    p.preco_venda, " +
            "    p.preco_custo, " +
            "    p.margem_lucro, " +
            "    c.nome AS categoria_nome, " +
            "    (SELECT ROUND(AVG(p2.preco_venda), 2) " +
            "     FROM Produto p2 " +
            "     WHERE p2.id_categoria = p.id_categoria " +
            "       AND p2.status = 'ATIVO') AS preco_medio_categoria, " +
            "    ROUND(p.preco_venda - (SELECT AVG(p2.preco_venda) " +
            "                           FROM Produto p2 " +
            "                           WHERE p2.id_categoria = p.id_categoria " +
            "                             AND p2.status = 'ATIVO'), 2) AS diferenca_media, " +
            "    ROUND(((p.preco_venda / (SELECT AVG(p2.preco_venda) " +
            "                             FROM Produto p2 " +
            "                             WHERE p2.id_categoria = p.id_categoria " +
            "                               AND p2.status = 'ATIVO')) - 1) * 100, 2) AS percentual_acima_media " +
            "FROM Produto p " +
            "INNER JOIN Categoria c ON p.id_categoria = c.id_categoria " +
            "WHERE p.preco_venda > (SELECT AVG(p2.preco_venda) " +
            "                       FROM Produto p2 " +
            "                       WHERE p2.id_categoria = p.id_categoria " +
            "                         AND p2.status = 'ATIVO') " +
            "  AND p.status = 'ATIVO' " +
            "ORDER BY percentual_acima_media DESC";
        
        List<ProdutoPremium> resultados = new ArrayList<>();
        
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                resultados.add(new ProdutoPremium(
                    rs.getLong("id_produto"),
                    rs.getString("produto_nome"),
                    rs.getString("marca"),
                    rs.getBigDecimal("preco_venda"),
                    rs.getBigDecimal("preco_custo"),
                    rs.getBigDecimal("margem_lucro"),
                    rs.getString("categoria_nome"),
                    rs.getBigDecimal("preco_medio_categoria"),
                    rs.getBigDecimal("diferenca_media"),
                    rs.getBigDecimal("percentual_acima_media")
                ));
            }
        }
        
        return resultados;
    }
    
    /**
     * Subconsulta - Clientes VIP (total gasto acima da média)
     */
    public List<ClienteVIP> consultarClientesVIP() throws SQLException {
        String sql = 
            "SELECT " +
            "    c.id_pessoa, " +
            "    p.nome AS cliente_nome, " +
            "    p.email AS cliente_email, " +
            "    c.tipo_pessoa, " +
            "    c.ranking, " +
            "    c.total_gasto, " +
            "    c.data_ultima_compra, " +
            "    COUNT(v.id_venda) AS total_compras, " +
            "    ROUND(c.total_gasto / NULLIF(COUNT(v.id_venda), 0), 2) AS ticket_medio, " +
            "    (SELECT ROUND(AVG(total_gasto), 2) FROM Cliente WHERE ativo = TRUE) AS media_gasto_geral, " +
            "    ROUND(c.total_gasto - (SELECT AVG(total_gasto) FROM Cliente WHERE ativo = TRUE), 2) AS diferenca_media, " +
            "    ROUND(((c.total_gasto / (SELECT AVG(total_gasto) FROM Cliente WHERE ativo = TRUE)) - 1) * 100, 2) AS percentual_acima_media " +
            "FROM Cliente c " +
            "INNER JOIN Pessoa p ON c.id_pessoa = p.id_pessoa " +
            "LEFT JOIN Venda v ON c.id_pessoa = v.id_cliente AND v.status = 'CONCLUIDA' " +
            "WHERE c.ativo = TRUE " +
            "  AND c.total_gasto > (SELECT AVG(total_gasto) FROM Cliente WHERE ativo = TRUE) " +
            "GROUP BY c.id_pessoa, p.nome, p.email, c.tipo_pessoa, c.ranking, c.total_gasto, c.data_ultima_compra " +
            "HAVING COUNT(v.id_venda) > 0 " +
            "ORDER BY c.total_gasto DESC, total_compras DESC";
        
        List<ClienteVIP> resultados = new ArrayList<>();
        
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                resultados.add(new ClienteVIP(
                    rs.getLong("id_pessoa"),
                    rs.getString("cliente_nome"),
                    rs.getString("cliente_email"),
                    rs.getString("tipo_pessoa"),
                    rs.getInt("ranking"),
                    rs.getBigDecimal("total_gasto"),
                    rs.getDate("data_ultima_compra"),
                    rs.getInt("total_compras"),
                    rs.getBigDecimal("ticket_medio"),
                    rs.getBigDecimal("media_gasto_geral"),
                    rs.getBigDecimal("diferenca_media"),
                    rs.getBigDecimal("percentual_acima_media")
                ));
            }
        }
        
        return resultados;
    }
    
    // ================================================================
    // CONSULTAS NAS VIEWS
    // ================================================================
    
    /**
     * Consulta na view vw_analise_vendas_completa
     */
    public List<VendaCompleta> getAnaliseVendasCompleta(
        LocalDate dataInicio, 
        LocalDate dataFim
    ) throws SQLException {
        
        String sql = 
            "SELECT * FROM vw_analise_vendas_completa " +
            "WHERE data_venda_simples BETWEEN ? AND ? " +
            "  AND status_venda = 'CONCLUIDA' " +
            "ORDER BY data_venda DESC";
        
        List<VendaCompleta> resultados = new ArrayList<>();
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setDate(1, Date.valueOf(dataInicio));
            stmt.setDate(2, Date.valueOf(dataFim));
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    resultados.add(new VendaCompleta(
                        rs.getLong("id_venda"),
                        rs.getTimestamp("data_venda"),
                        rs.getBigDecimal("valor_total"),
                        rs.getBigDecimal("desconto"),
                        rs.getBigDecimal("valor_final"),
                        rs.getString("metodo_pagamento"),
                        rs.getString("cliente_nome"),
                        rs.getString("cliente_email"),
                        rs.getInt("ranking_cliente"),
                        rs.getString("vendedor_nome"),
                        rs.getString("vendedor_cargo"),
                        rs.getBigDecimal("percentual_desconto"),
                        rs.getInt("quantidade_itens")
                    ));
                }
            }
        }
        
        return resultados;
    }
    
    /**
     * Consulta na view vw_inventario_rentabilidade
     */
    public List<InventarioRentabilidade> getInventarioRentabilidade(
        String statusEstoque
    ) throws SQLException {
        
        String sql = "SELECT * FROM vw_inventario_rentabilidade WHERE status_produto = 'ATIVO'";
        
        if (statusEstoque != null && !statusEstoque.isEmpty()) {
            sql += " AND status_estoque = ?";
        }
        
        sql += " ORDER BY lucro_potencial_estoque DESC";
        
        List<InventarioRentabilidade> resultados = new ArrayList<>();
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            if (statusEstoque != null && !statusEstoque.isEmpty()) {
                stmt.setString(1, statusEstoque);
            }
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    resultados.add(new InventarioRentabilidade(
                        rs.getLong("id_produto"),
                        rs.getString("produto_nome"),
                        rs.getString("marca"),
                        rs.getBigDecimal("preco_custo"),
                        rs.getBigDecimal("preco_venda"),
                        rs.getBigDecimal("margem_lucro_percentual"),
                        rs.getInt("estoque"),
                        rs.getInt("estoque_minimo"),
                        rs.getBigDecimal("valor_estoque_venda"),
                        rs.getBigDecimal("lucro_potencial_estoque"),
                        rs.getString("categoria_nome"),
                        rs.getString("fornecedor_nome"),
                        rs.getString("status_estoque"),
                        rs.getString("classificacao_rentabilidade"),
                        rs.getString("acao_recomendada")
                    ));
                }
            }
        }
        
        return resultados;
    }
    
    // ================================================================
    // AUDITORIA
    // ================================================================
    
    /**
     * Consulta logs de auditoria recentes
     */
    public List<LogAuditoria> getLogsRecentes(int horas) throws SQLException {
        String sql = 
            "SELECT * FROM AuditoriaLog " +
            "WHERE data_hora >= DATE_SUB(NOW(), INTERVAL ? HOUR) " +
            "ORDER BY data_hora DESC " +
            "LIMIT 100";
        
        List<LogAuditoria> resultados = new ArrayList<>();
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, horas);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    resultados.add(new LogAuditoria(
                        rs.getLong("id_log"),
                        rs.getString("tabela_afetada"),
                        rs.getString("operacao"),
                        rs.getLong("id_registro"),
                        rs.getString("dados_antigos"),
                        rs.getString("dados_novos"),
                        rs.getString("descricao"),
                        rs.getTimestamp("data_hora")
                    ));
                }
            }
        }
        
        return resultados;
    }
    
    /**
     * Consulta histórico de alterações de um produto específico
     */
    public List<LogAuditoria> getHistoricoProduto(Long idProduto) throws SQLException {
        String sql = 
            "SELECT * FROM AuditoriaLog " +
            "WHERE tabela_afetada = 'Produto' " +
            "  AND id_registro = ? " +
            "ORDER BY data_hora DESC";
        
        List<LogAuditoria> resultados = new ArrayList<>();
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setLong(1, idProduto);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    resultados.add(new LogAuditoria(
                        rs.getLong("id_log"),
                        rs.getString("tabela_afetada"),
                        rs.getString("operacao"),
                        rs.getLong("id_registro"),
                        rs.getString("dados_antigos"),
                        rs.getString("dados_novos"),
                        rs.getString("descricao"),
                        rs.getTimestamp("data_hora")
                    ));
                }
            }
        }
        
        return resultados;
    }
}

// ================================================================
// CLASSES DE DADOS (DTOs)
// ================================================================

class ReajusteResult {
    private String categoria;
    private int produtosReajustados;
    private BigDecimal percentualAplicado;
    private boolean reajustouCusto;
    private BigDecimal valorEstoqueAntes;
    private BigDecimal valorEstoqueDepois;
    private BigDecimal diferencaValor;
    private Timestamp dataHoraReajuste;
    
    // Construtores, getters e setters
    public ReajusteResult(String categoria, int produtosReajustados, BigDecimal percentualAplicado,
                         boolean reajustouCusto, BigDecimal valorEstoqueAntes, BigDecimal valorEstoqueDepois,
                         BigDecimal diferencaValor, Timestamp dataHoraReajuste) {
        this.categoria = categoria;
        this.produtosReajustados = produtosReajustados;
        this.percentualAplicado = percentualAplicado;
        this.reajustouCusto = reajustouCusto;
        this.valorEstoqueAntes = valorEstoqueAntes;
        this.valorEstoqueDepois = valorEstoqueDepois;
        this.diferencaValor = diferencaValor;
        this.dataHoraReajuste = dataHoraReajuste;
    }
    
    // Getters e Setters omitidos por brevidade
}

// Outras classes de dados seguem o mesmo padrão...
// ProdutoCritico, ResumoRelatorio, RelatoriosCriticosResponse, etc.
