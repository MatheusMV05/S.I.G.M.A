package com.project.sigma.repository;

import com.project.sigma.dto.LogAuditoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Repository para gerenciar logs de auditoria
 * Implementa consultas na tabela LogsAuditoria criada pelos triggers
 */
@Repository
public class LogAuditoriaRepository implements BaseRepository<LogAuditoriaDTO, Integer> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String SELECT_ALL_SQL = 
        "SELECT * FROM LogsAuditoria ORDER BY data_hora DESC";

    private static final String SELECT_BY_ID_SQL = 
        "SELECT * FROM LogsAuditoria WHERE id_log = ?";

    private static final String DELETE_SQL = 
        "DELETE FROM LogsAuditoria WHERE id_log = ?";

    private static final String EXISTS_SQL = 
        "SELECT COUNT(*) FROM LogsAuditoria WHERE id_log = ?";

    // ================================================================
    // IMPLEMENTAÇÃO DA INTERFACE BaseRepository
    // ================================================================

    @Override
    public LogAuditoriaDTO save(LogAuditoriaDTO log) {
        throw new UnsupportedOperationException("Logs de auditoria são criados automaticamente pelos triggers");
    }

    @Override
    public Optional<LogAuditoriaDTO> findById(Integer id) {
        try {
            LogAuditoriaDTO log = jdbcTemplate.queryForObject(
                SELECT_BY_ID_SQL,
                logAuditoriaRowMapper(),
                id
            );
            return Optional.ofNullable(log);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<LogAuditoriaDTO> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, logAuditoriaRowMapper());
    }

    @Override
    public void deleteById(Integer id) {
        jdbcTemplate.update(DELETE_SQL, id);
    }

    @Override
    public boolean existsById(Integer id) {
        Integer count = jdbcTemplate.queryForObject(EXISTS_SQL, Integer.class, id);
        return count != null && count > 0;
    }

    // ================================================================
    // CONSULTAS ESPECÍFICAS
    // ================================================================

    /**
     * Busca logs com filtros opcionais
     */
    public List<LogAuditoriaDTO> buscarComFiltros(
            String tabela,
            String operacao,
            LocalDateTime dataInicio,
            LocalDateTime dataFim,
            Integer limit) {

        StringBuilder sql = new StringBuilder(
            "SELECT * FROM LogsAuditoria WHERE 1=1 "
        );
        List<Object> params = new ArrayList<>();

        if (tabela != null && !tabela.trim().isEmpty()) {
            sql.append("AND tabela = ? ");
            params.add(tabela);
        }

        if (operacao != null && !operacao.trim().isEmpty()) {
            sql.append("AND operacao = ? ");
            params.add(operacao);
        }

        if (dataInicio != null) {
            sql.append("AND data_hora >= ? ");
            params.add(Timestamp.valueOf(dataInicio));
        }

        if (dataFim != null) {
            sql.append("AND data_hora <= ? ");
            params.add(Timestamp.valueOf(dataFim));
        }

        sql.append("ORDER BY data_hora DESC ");

        if (limit != null && limit > 0) {
            sql.append("LIMIT ?");
            params.add(limit);
        }

        return jdbcTemplate.query(sql.toString(), params.toArray(), logAuditoriaRowMapper());
    }

    /**
     * Busca logs das últimas 24 horas
     */
    public List<LogAuditoriaDTO> buscarLogsRecentes() {
        LocalDateTime dataInicio = LocalDateTime.now().minusHours(24);
        return buscarComFiltros(null, null, dataInicio, null, 100);
    }

    /**
     * Busca logs das últimas N horas
     */
    public List<LogAuditoriaDTO> buscarLogsPorHoras(int horas, Integer limit) {
        LocalDateTime dataInicio = LocalDateTime.now().minusHours(horas);
        return buscarComFiltros(null, null, dataInicio, null, limit);
    }

    /**
     * Busca logs por tabela específica
     */
    public List<LogAuditoriaDTO> buscarPorTabela(String tabela, Integer limit) {
        return buscarComFiltros(tabela, null, null, null, limit);
    }

    /**
     * Busca logs por tipo de operação
     */
    public List<LogAuditoriaDTO> buscarPorOperacao(String operacao, Integer limit) {
        return buscarComFiltros(null, operacao, null, null, limit);
    }

    /**
     * Busca logs por tabela e operação
     */
    public List<LogAuditoriaDTO> buscarPorTabelaEOperacao(String tabela, String operacao, Integer limit) {
        return buscarComFiltros(tabela, operacao, null, null, limit);
    }

    /**
     * Busca logs de um registro específico
     */
    public List<LogAuditoriaDTO> buscarPorRegistro(String tabela, Integer registroId) {
        String sql = "SELECT * FROM LogsAuditoria " +
                    "WHERE tabela = ? AND registro_id = ? " +
                    "ORDER BY data_hora DESC";

        return jdbcTemplate.query(sql, logAuditoriaRowMapper(), tabela, registroId);
    }

    /**
     * Busca logs por usuário
     */
    public List<LogAuditoriaDTO> buscarPorUsuario(Integer idUsuario, Integer limit) {
        String sql = "SELECT * FROM LogsAuditoria " +
                    "WHERE id_usuario = ? " +
                    "ORDER BY data_hora DESC " +
                    "LIMIT ?";

        return jdbcTemplate.query(sql, logAuditoriaRowMapper(), idUsuario, limit);
    }

    /**
     * Conta total de logs
     */
    public Long contarTodos() {
        return jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM LogsAuditoria",
            Long.class
        );
    }

    /**
     * Conta logs por tabela
     */
    public Long contarPorTabela(String tabela) {
        return jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM LogsAuditoria WHERE tabela = ?",
            Long.class,
            tabela
        );
    }

    /**
     * Conta logs por operação
     */
    public Long contarPorOperacao(String operacao) {
        return jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM LogsAuditoria WHERE operacao = ?",
            Long.class,
            operacao
        );
    }

    /**
     * Lista todas as tabelas que possuem logs
     */
    public List<String> listarTabelasComLogs() {
        return jdbcTemplate.query(
            "SELECT DISTINCT tabela FROM LogsAuditoria ORDER BY tabela",
            (rs, rowNum) -> rs.getString("tabela")
        );
    }

    /**
     * Deleta logs mais antigos que X dias
     */
    public int deletarLogsAntigos(int dias) {
        LocalDateTime dataLimite = LocalDateTime.now().minusDays(dias);
        String sql = "DELETE FROM LogsAuditoria WHERE data_hora < ?";
        return jdbcTemplate.update(sql, Timestamp.valueOf(dataLimite));
    }

    /**
     * Deleta todos os logs de uma tabela específica
     */
    public int deletarLogsPorTabela(String tabela) {
        String sql = "DELETE FROM LogsAuditoria WHERE tabela = ?";
        return jdbcTemplate.update(sql, tabela);
    }

    /**
     * Verifica se a tabela LogsAuditoria existe
     */
    public boolean tabelaLogsExiste() {
        try {
            String sql = "SHOW TABLES LIKE 'LogsAuditoria'";
            List<String> resultado = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString(1));
            return !resultado.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    // ================================================================
    // ROW MAPPER
    // ================================================================

    private RowMapper<LogAuditoriaDTO> logAuditoriaRowMapper() {
        return (ResultSet rs, int rowNum) -> {
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
            return dto;
        };
    }
}
