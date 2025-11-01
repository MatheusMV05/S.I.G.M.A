package com.project.sigma.service;

import com.project.sigma.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Service para executar funções, procedimentos e consultar logs
 * Utiliza JDBC puro (sem JPA) conforme requisitos do projeto
 */
@Service
public class DatabaseFeaturesService {

    @Autowired
    private DataSource dataSource;

    /**
     * FUNÇÃO 1: Calcular desconto progressivo
     */
    public CalculoDescontoDTO calcularDesconto(BigDecimal valorCompra) {
        BigDecimal descontoPercentual = BigDecimal.ZERO;
        
        String sql = "SELECT calcular_desconto(?) AS desconto";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setBigDecimal(1, valorCompra);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    descontoPercentual = rs.getBigDecimal("desconto");
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao calcular desconto", e);
        }

        // Calcular valores derivados
        BigDecimal valorDesconto = valorCompra.multiply(descontoPercentual);
        BigDecimal valorFinal = valorCompra.subtract(valorDesconto);

        return new CalculoDescontoDTO(valorCompra, descontoPercentual, valorDesconto, valorFinal);
    }

    /**
     * FUNÇÃO 2: Verificar estoque disponível
     */
    public boolean verificarEstoqueDisponivel(Integer idProduto, Integer quantidade) {
        boolean disponivel = false;
        
        String sql = "SELECT verificar_estoque_disponivel(?, ?) AS disponivel";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idProduto);
            pstmt.setInt(2, quantidade);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    disponivel = rs.getBoolean("disponivel");
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao verificar estoque disponível", e);
        }

        return disponivel;
    }

    /**
     * PROCEDIMENTO 1: Atualizar preços por categoria
     */
    public AtualizacaoPrecoResultDTO atualizarPrecosCategoria(Integer idCategoria, Double percentual) {
        AtualizacaoPrecoResultDTO resultado = new AtualizacaoPrecoResultDTO();
        
        String sql = "{CALL atualizar_precos_categoria(?, ?)}";

        try (Connection conn = dataSource.getConnection();
             CallableStatement cstmt = conn.prepareCall(sql)) {

            cstmt.setInt(1, idCategoria);
            cstmt.setDouble(2, percentual);

            // Executar procedimento e obter resultado
            boolean hasResultSet = cstmt.execute();
            
            if (hasResultSet) {
                try (ResultSet rs = cstmt.getResultSet()) {
                    if (rs.next()) {
                        resultado.setTotalProdutosAtualizados(rs.getInt("total_produtos_atualizados"));
                        resultado.setPercentualAplicado(rs.getDouble("percentual_aplicado"));
                        resultado.setCategoriaNome(rs.getString("categoria_nome"));
                    }
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar preços da categoria", e);
        }

        return resultado;
    }

    /**
     * PROCEDIMENTO 2: Relatório de estoque baixo (COM CURSOR)
     */
    public List<EstoqueBaixoDTO> relatorioEstoqueBaixo(Integer estoqueMinimo) {
        List<EstoqueBaixoDTO> resultados = new ArrayList<>();
        
        String sql = "{CALL relatorio_estoque_baixo(?)}";

        try (Connection conn = dataSource.getConnection();
             CallableStatement cstmt = conn.prepareCall(sql)) {

            cstmt.setInt(1, estoqueMinimo);

            // Executar procedimento e obter resultado
            boolean hasResultSet = cstmt.execute();
            
            if (hasResultSet) {
                try (ResultSet rs = cstmt.getResultSet()) {
                    while (rs.next()) {
                        EstoqueBaixoDTO dto = new EstoqueBaixoDTO();
                        dto.setIdProduto(rs.getInt("id_produto"));
                        dto.setNomeProduto(rs.getString("nome_produto"));
                        dto.setQuantidadeAtual(rs.getInt("quantidade_atual"));
                        dto.setEstoqueMinimo(rs.getInt("estoque_minimo"));
                        dto.setDeficit(rs.getInt("deficit"));
                        dto.setPrecoCusto(rs.getBigDecimal("preco_custo"));
                        dto.setValorReposicao(rs.getBigDecimal("valor_reposicao"));
                        dto.setCategoria(rs.getString("categoria"));
                        dto.setFornecedor(rs.getString("fornecedor"));
                        dto.setTelefoneFornecedor(rs.getString("telefone_fornecedor"));
                        dto.setStatusCriticidade(rs.getString("status_criticidade"));
                        dto.setAcaoRecomendada(rs.getString("acao_recomendada"));
                        resultados.add(dto);
                    }
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao gerar relatório de estoque baixo", e);
        }

        return resultados;
    }

    /**
     * Buscar logs de auditoria com filtros opcionais
     */
    public List<LogAuditoriaDTO> getLogsAuditoria(String tabela, String operacao, 
                                                   LocalDateTime dataInicio, LocalDateTime dataFim,
                                                   int limit) {
        List<LogAuditoriaDTO> resultados = new ArrayList<>();
        
        StringBuilder sql = new StringBuilder(
            "SELECT * FROM LogsAuditoria WHERE 1=1 "
        );

        if (tabela != null && !tabela.isEmpty()) {
            sql.append("AND tabela = ? ");
        }
        if (operacao != null && !operacao.isEmpty()) {
            sql.append("AND operacao = ? ");
        }
        if (dataInicio != null) {
            sql.append("AND data_hora >= ? ");
        }
        if (dataFim != null) {
            sql.append("AND data_hora <= ? ");
        }

        sql.append("ORDER BY data_hora DESC LIMIT ?");

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {

            int paramIndex = 1;
            
            if (tabela != null && !tabela.isEmpty()) {
                pstmt.setString(paramIndex++, tabela);
            }
            if (operacao != null && !operacao.isEmpty()) {
                pstmt.setString(paramIndex++, operacao);
            }
            if (dataInicio != null) {
                pstmt.setTimestamp(paramIndex++, Timestamp.valueOf(dataInicio));
            }
            if (dataFim != null) {
                pstmt.setTimestamp(paramIndex++, Timestamp.valueOf(dataFim));
            }
            pstmt.setInt(paramIndex, limit);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    LogAuditoriaDTO dto = new LogAuditoriaDTO();
                    dto.setIdLog(rs.getInt("id_log"));
                    dto.setTabela(rs.getString("tabela"));
                    dto.setOperacao(rs.getString("operacao"));
                    dto.setIdUsuario((Integer) rs.getObject("id_usuario"));
                    dto.setRegistroId(rs.getInt("registro_id"));
                    dto.setDadosAntigos(rs.getString("dados_antigos"));
                    dto.setDadosNovos(rs.getString("dados_novos"));
                    dto.setIpOrigem(rs.getString("ip_origem"));
                    
                    Timestamp timestamp = rs.getTimestamp("data_hora");
                    if (timestamp != null) {
                        dto.setDataHora(timestamp.toLocalDateTime());
                    }
                    
                    dto.setDescricao(rs.getString("descricao"));
                    resultados.add(dto);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar logs de auditoria", e);
        }

        return resultados;
    }

    /**
     * Buscar logs recentes (últimas 24h)
     */
    public List<LogAuditoriaDTO> getLogsRecentes() {
        LocalDateTime dataInicio = LocalDateTime.now().minusHours(24);
        return getLogsAuditoria(null, null, dataInicio, null, 100);
    }

    /**
     * Buscar logs por tabela
     */
    public List<LogAuditoriaDTO> getLogsPorTabela(String tabela, int limit) {
        return getLogsAuditoria(tabela, null, null, null, limit);
    }

    /**
     * Buscar logs por registro específico
     */
    public List<LogAuditoriaDTO> getLogsPorRegistro(String tabela, Integer registroId) {
        List<LogAuditoriaDTO> resultados = new ArrayList<>();
        
        String sql = "SELECT * FROM LogsAuditoria " +
                    "WHERE tabela = ? AND registro_id = ? " +
                    "ORDER BY data_hora DESC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, tabela);
            pstmt.setInt(2, registroId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    LogAuditoriaDTO dto = new LogAuditoriaDTO();
                    dto.setIdLog(rs.getInt("id_log"));
                    dto.setTabela(rs.getString("tabela"));
                    dto.setOperacao(rs.getString("operacao"));
                    dto.setIdUsuario((Integer) rs.getObject("id_usuario"));
                    dto.setRegistroId(rs.getInt("registro_id"));
                    dto.setDadosAntigos(rs.getString("dados_antigos"));
                    dto.setDadosNovos(rs.getString("dados_novos"));
                    dto.setIpOrigem(rs.getString("ip_origem"));
                    
                    Timestamp timestamp = rs.getTimestamp("data_hora");
                    if (timestamp != null) {
                        dto.setDataHora(timestamp.toLocalDateTime());
                    }
                    
                    dto.setDescricao(rs.getString("descricao"));
                    resultados.add(dto);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar logs do registro", e);
        }

        return resultados;
    }
}
