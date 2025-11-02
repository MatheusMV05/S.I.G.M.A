package com.project.sigma.repository;

import com.project.sigma.dto.SazonalidadeDTO;
import com.project.sigma.dto.ProdutoBaixaRotatividadeDTO;
import com.project.sigma.dto.AnaliseABCDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para Insights Avançados usando JDBC puro
 * Implementa consultas SQL complexas para análises estratégicas
 */
@Repository
public class InsightsRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Análise de Sazonalidade - Vendas por Mês
     * Identifica padrões de vendas mensais
     */
    public List<SazonalidadeDTO> analisarSazonalidadeMensal(Integer dias) {
        String sql = 
            "SELECT " +
            "   DATE_FORMAT(v.data_venda, '%Y-%m') as periodo, " +
            "   COUNT(DISTINCT v.id_venda) as quantidade_vendas, " +
            "   COALESCE(SUM(v.valor_total), 0) as valor_total_vendas, " +
            "   COALESCE(AVG(v.valor_total), 0) as ticket_medio, " +
            "   RANK() OVER (ORDER BY SUM(v.valor_total) DESC) as ranking_periodo " +
            "FROM Venda v " +
            "WHERE v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
            "  AND v.status = 'CONCLUIDA' " +
            "GROUP BY DATE_FORMAT(v.data_venda, '%Y-%m') " +
            "ORDER BY periodo DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new SazonalidadeDTO(
            rs.getString("periodo"),
            rs.getInt("quantidade_vendas"),
            rs.getDouble("valor_total_vendas"),
            rs.getDouble("ticket_medio"),
            rs.getInt("ranking_periodo")
        ), dias);
    }

    /**
     * Análise de Sazonalidade - Vendas por Dia da Semana
     */
    public List<SazonalidadeDTO> analisarSazonalidadeSemanal(Integer dias) {
        String sql = 
            "SELECT " +
            "   CASE DAYOFWEEK(v.data_venda) " +
            "       WHEN 1 THEN 'Domingo' " +
            "       WHEN 2 THEN 'Segunda-feira' " +
            "       WHEN 3 THEN 'Terça-feira' " +
            "       WHEN 4 THEN 'Quarta-feira' " +
            "       WHEN 5 THEN 'Quinta-feira' " +
            "       WHEN 6 THEN 'Sexta-feira' " +
            "       WHEN 7 THEN 'Sábado' " +
            "   END as periodo, " +
            "   COUNT(DISTINCT v.id_venda) as quantidade_vendas, " +
            "   COALESCE(SUM(v.valor_total), 0) as valor_total_vendas, " +
            "   COALESCE(AVG(v.valor_total), 0) as ticket_medio, " +
            "   DAYOFWEEK(v.data_venda) as ranking_periodo " +
            "FROM Venda v " +
            "WHERE v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
            "  AND v.status = 'CONCLUIDA' " +
            "GROUP BY DAYOFWEEK(v.data_venda), periodo " +
            "ORDER BY ranking_periodo";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new SazonalidadeDTO(
            rs.getString("periodo"),
            rs.getInt("quantidade_vendas"),
            rs.getDouble("valor_total_vendas"),
            rs.getDouble("ticket_medio"),
            rs.getInt("ranking_periodo")
        ), dias);
    }

    /**
     * Análise de Sazonalidade - Vendas por Hora do Dia
     */
    public List<SazonalidadeDTO> analisarSazonalidadeHoraria(Integer dias) {
        String sql = 
            "SELECT " +
            "   CONCAT(LPAD(HOUR(v.data_venda), 2, '0'), ':00 - ', LPAD(HOUR(v.data_venda) + 1, 2, '0'), ':00') as periodo, " +
            "   COUNT(DISTINCT v.id_venda) as quantidade_vendas, " +
            "   COALESCE(SUM(v.valor_total), 0) as valor_total_vendas, " +
            "   COALESCE(AVG(v.valor_total), 0) as ticket_medio, " +
            "   HOUR(v.data_venda) as ranking_periodo " +
            "FROM Venda v " +
            "WHERE v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
            "  AND v.status = 'CONCLUIDA' " +
            "GROUP BY HOUR(v.data_venda), periodo " +
            "ORDER BY ranking_periodo";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new SazonalidadeDTO(
            rs.getString("periodo"),
            rs.getInt("quantidade_vendas"),
            rs.getDouble("valor_total_vendas"),
            rs.getDouble("ticket_medio"),
            rs.getInt("ranking_periodo")
        ), dias);
    }

    /**
     * Produtos com Baixa Rotatividade
     * Identifica produtos que vendem pouco em relação ao estoque
     */
    public List<ProdutoBaixaRotatividadeDTO> buscarProdutosBaixaRotatividade(Integer limit) {
        String sql = 
            "SELECT " +
            "   p.id_produto, " +
            "   p.nome as nome_produto, " +
            "   c.nome as categoria_nome, " +
            "   p.estoque as estoque_atual, " +
            "   COALESCE(SUM(vi.quantidade), 0) as quantidade_vendida_30dias, " +
            "   CASE " +
            "       WHEN p.estoque > 0 THEN COALESCE(SUM(vi.quantidade), 0) / p.estoque " +
            "       ELSE 0 " +
            "   END as taxa_rotatividade, " +
            "   CASE " +
            "       WHEN COALESCE(SUM(vi.quantidade), 0) > 0 THEN (p.estoque * 30.0) / SUM(vi.quantidade) " +
            "       ELSE 999 " +
            "   END as dias_para_zerar_estoque, " +
            "   p.estoque * p.preco_venda as valor_estoque_parado " +
            "FROM Produto p " +
            "INNER JOIN Categoria c ON p.id_categoria = c.id_categoria " +
            "LEFT JOIN VendaItem vi ON p.id_produto = vi.id_produto " +
            "LEFT JOIN Venda v ON vi.id_venda = v.id_venda " +
            "   AND v.data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
            "   AND v.status = 'CONCLUIDA' " +
            "WHERE p.status = 'ATIVO' " +
            "  AND p.estoque > 0 " +
            "GROUP BY p.id_produto, p.nome, c.nome, p.estoque, p.preco_venda " +
            "HAVING taxa_rotatividade < 0.3 " + // Rotatividade menor que 30%
            "ORDER BY dias_para_zerar_estoque DESC, valor_estoque_parado DESC " +
            "LIMIT ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new ProdutoBaixaRotatividadeDTO(
            rs.getLong("id_produto"),
            rs.getString("nome_produto"),
            rs.getString("categoria_nome"),
            rs.getInt("estoque_atual"),
            rs.getInt("quantidade_vendida_30dias"),
            rs.getDouble("taxa_rotatividade"),
            rs.getDouble("dias_para_zerar_estoque"),
            rs.getDouble("valor_estoque_parado")
        ), limit);
    }

    /**
     * Análise ABC de Produtos (Curva de Pareto)
     * Classifica produtos em A (80% faturamento), B (15%), C (5%)
     */
    public List<AnaliseABCDTO> buscarAnaliseABC(Integer dias) {
        String sql = 
            "WITH FaturamentoProdutos AS ( " +
            "   SELECT " +
            "       p.id_produto, " +
            "       p.nome as nome_produto, " +
            "       c.nome as categoria_nome, " +
            "       COALESCE(SUM(vi.quantidade * vi.preco_unitario_venda), 0) as faturamento_total, " +
            "       COALESCE(SUM(vi.quantidade), 0) as quantidade_vendida " +
            "   FROM Produto p " +
            "   INNER JOIN Categoria c ON p.id_categoria = c.id_categoria " +
            "   LEFT JOIN VendaItem vi ON p.id_produto = vi.id_produto " +
            "   LEFT JOIN Venda v ON vi.id_venda = v.id_venda " +
            "       AND v.data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
            "       AND v.status = 'CONCLUIDA' " +
            "   WHERE p.status = 'ATIVO' " +
            "   GROUP BY p.id_produto, p.nome, c.nome " +
            "   HAVING faturamento_total > 0 " +
            "), " +
            "FaturamentoTotal AS ( " +
            "   SELECT SUM(faturamento_total) as total FROM FaturamentoProdutos " +
            "), " +
            "ProdutosComPercentual AS ( " +
            "   SELECT " +
            "       fp.*, " +
            "       (fp.faturamento_total / ft.total * 100) as percentual_faturamento, " +
            "       SUM(fp.faturamento_total / ft.total * 100) OVER (ORDER BY fp.faturamento_total DESC) as percentual_acumulado, " +
            "       ROW_NUMBER() OVER (ORDER BY fp.faturamento_total DESC) as ranking_faturamento " +
            "   FROM FaturamentoProdutos fp " +
            "   CROSS JOIN FaturamentoTotal ft " +
            ") " +
            "SELECT " +
            "   id_produto, " +
            "   nome_produto, " +
            "   categoria_nome, " +
            "   faturamento_total, " +
            "   percentual_faturamento, " +
            "   percentual_acumulado, " +
            "   CASE " +
            "       WHEN percentual_acumulado <= 80 THEN 'A' " +
            "       WHEN percentual_acumulado <= 95 THEN 'B' " +
            "       ELSE 'C' " +
            "   END as classificacao_abc, " +
            "   quantidade_vendida, " +
            "   ranking_faturamento " +
            "FROM ProdutosComPercentual " +
            "ORDER BY ranking_faturamento";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new AnaliseABCDTO(
            rs.getLong("id_produto"),
            rs.getString("nome_produto"),
            rs.getString("categoria_nome"),
            rs.getDouble("faturamento_total"),
            rs.getDouble("percentual_faturamento"),
            rs.getDouble("percentual_acumulado"),
            rs.getString("classificacao_abc"),
            rs.getInt("quantidade_vendida"),
            rs.getInt("ranking_faturamento")
        ), dias);
    }
}
