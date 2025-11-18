package com.project.sigma.repository;

import com.project.sigma.dto.AnaliseVendasCompletaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository para acessar a VIEW vw_analise_vendas_completa
 * Fornece análise completa de vendas com dados de cliente e vendedor
 */
@Repository
public class AnaliseVendasCompletaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Busca todas as vendas da view
     */
    public List<AnaliseVendasCompletaDTO> findAll() {
        String sql = "SELECT * FROM vw_analise_vendas_completa ORDER BY data_venda DESC LIMIT 100";
        return jdbcTemplate.query(sql, analiseVendasRowMapper());
    }

    /**
     * Busca vendas por período
     */
    public List<AnaliseVendasCompletaDTO> findByPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE data_venda_simples BETWEEN ? AND ? " +
                     "ORDER BY data_venda DESC";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), dataInicio, dataFim);
    }

    /**
     * Busca vendas dos últimos N dias
     */
    public List<AnaliseVendasCompletaDTO> findUltimosDias(int dias) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE data_venda >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
                     "ORDER BY data_venda DESC";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), dias);
    }

    /**
     * Busca vendas por cliente
     */
    public List<AnaliseVendasCompletaDTO> findByCliente(Long idCliente) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE id_cliente = ? " +
                     "ORDER BY data_venda DESC";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), idCliente);
    }

    /**
     * Busca vendas por vendedor/funcionário
     */
    public List<AnaliseVendasCompletaDTO> findByVendedor(Long idFuncionario) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE id_funcionario = ? " +
                     "ORDER BY data_venda DESC";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), idFuncionario);
    }

    /**
     * Busca vendas por método de pagamento
     */
    public List<AnaliseVendasCompletaDTO> findByMetodoPagamento(String metodoPagamento) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE metodo_pagamento = ? " +
                     "ORDER BY data_venda DESC " +
                     "LIMIT 100";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), metodoPagamento);
    }

    /**
     * Busca vendas com desconto acima de um percentual
     */
    public List<AnaliseVendasCompletaDTO> findComDescontoAcimaDe(Double percentual) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE percentual_desconto >= ? " +
                     "ORDER BY percentual_desconto DESC " +
                     "LIMIT 50";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), percentual);
    }

    /**
     * Busca vendas por dia da semana
     */
    public List<AnaliseVendasCompletaDTO> findByDiaSemana(String diaSemana) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE dia_semana_venda = ? " +
                     "AND data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
                     "ORDER BY data_venda DESC";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), diaSemana);
    }

    /**
     * Busca vendas por faixa horária
     */
    public List<AnaliseVendasCompletaDTO> findByHora(Integer horaInicio, Integer horaFim) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE hora_venda BETWEEN ? AND ? " +
                     "AND data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
                     "ORDER BY data_venda DESC";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), horaInicio, horaFim);
    }

    /**
     * Busca top vendas por valor
     */
    public List<AnaliseVendasCompletaDTO> findTopVendasPorValor(int limit) {
        String sql = "SELECT * FROM vw_analise_vendas_completa " +
                     "WHERE data_venda >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) " +
                     "ORDER BY valor_final DESC " +
                     "LIMIT ?";
        return jdbcTemplate.query(sql, analiseVendasRowMapper(), limit);
    }

    /**
     * RowMapper para converter ResultSet em AnaliseVendasCompletaDTO
     */
    private RowMapper<AnaliseVendasCompletaDTO> analiseVendasRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            AnaliseVendasCompletaDTO dto = new AnaliseVendasCompletaDTO();
            
            // Dados da Venda
            dto.setIdVenda(rs.getLong("id_venda"));
            
            Timestamp dataVenda = rs.getTimestamp("data_venda");
            if (dataVenda != null) {
                dto.setDataVenda(dataVenda.toLocalDateTime());
            }
            
            Date dataVendaSimples = rs.getDate("data_venda_simples");
            if (dataVendaSimples != null) {
                dto.setDataVendaSimples(dataVendaSimples.toLocalDate());
            }
            
            dto.setValorTotal(rs.getBigDecimal("valor_total"));
            dto.setDesconto(rs.getBigDecimal("desconto"));
            dto.setValorFinal(rs.getBigDecimal("valor_final"));
            dto.setMetodoPagamento(rs.getString("metodo_pagamento"));
            dto.setStatusVenda(rs.getString("status_venda"));
            
            // Dados do Cliente
            dto.setIdCliente(rs.getLong("id_cliente"));
            dto.setClienteNome(rs.getString("cliente_nome"));
            dto.setClienteEmail(rs.getString("cliente_email"));
            dto.setClienteCidade(rs.getString("cliente_cidade"));
            dto.setTipoPessoa(rs.getString("tipo_pessoa"));
            dto.setRankingCliente(rs.getObject("ranking_cliente", Integer.class));
            dto.setTotalGastoCliente(rs.getBigDecimal("total_gasto_cliente"));
            
            // Dados do Funcionário/Vendedor
            dto.setIdFuncionario(rs.getLong("id_funcionario"));
            dto.setVendedorNome(rs.getString("vendedor_nome"));
            dto.setVendedorCargo(rs.getString("vendedor_cargo"));
            dto.setVendedorSetor(rs.getString("vendedor_setor"));
            
            // Dados do Caixa
            Long idCaixa = rs.getObject("id_caixa", Long.class);
            dto.setIdCaixa(idCaixa);
            dto.setStatusCaixa(rs.getString("status_caixa"));
            
            // Métricas Calculadas
            dto.setPercentualDesconto(rs.getBigDecimal("percentual_desconto"));
            dto.setValorMedioItem(rs.getBigDecimal("valor_medio_item"));
            dto.setQuantidadeItens(rs.getObject("quantidade_itens", Integer.class));
            dto.setDiaSemanaVenda(rs.getString("dia_semana_venda"));
            dto.setHoraVenda(rs.getObject("hora_venda", Integer.class));
            
            return dto;
        };
    }
}
