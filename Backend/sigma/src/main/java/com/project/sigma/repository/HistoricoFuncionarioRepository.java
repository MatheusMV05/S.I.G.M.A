package com.project.sigma.repository;

import com.project.sigma.model.HistoricoFuncionario;
import com.project.sigma.model.HistoricoFuncionario.TipoEvento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class HistoricoFuncionarioRepository implements BaseRepository<HistoricoFuncionario, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO HistoricoFuncionario (id_funcionario, tipo_evento, data_evento, cargo_anterior, cargo_novo, " +
            "setor_anterior, setor_novo, salario_anterior, salario_novo, descricao, realizado_por) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT h.*, " +
            "p1.nome as nome_funcionario, " +
            "p2.nome as nome_realizador " +
            "FROM HistoricoFuncionario h " +
            "LEFT JOIN Funcionario f ON h.id_funcionario = f.id_pessoa " +
            "LEFT JOIN Pessoa p1 ON f.id_pessoa = p1.id_pessoa " +
            "LEFT JOIN Usuario u ON h.realizado_por = u.id_pessoa " +
            "LEFT JOIN Pessoa p2 ON u.id_pessoa = p2.id_pessoa " +
            "WHERE h.id_historico = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT h.*, " +
            "p1.nome as nome_funcionario, " +
            "p2.nome as nome_realizador " +
            "FROM HistoricoFuncionario h " +
            "LEFT JOIN Funcionario f ON h.id_funcionario = f.id_pessoa " +
            "LEFT JOIN Pessoa p1 ON f.id_pessoa = p1.id_pessoa " +
            "LEFT JOIN Usuario u ON h.realizado_por = u.id_pessoa " +
            "LEFT JOIN Pessoa p2 ON u.id_pessoa = p2.id_pessoa " +
            "ORDER BY h.data_evento DESC, h.data_registro DESC";

    private static final String UPDATE_SQL =
            "UPDATE HistoricoFuncionario SET tipo_evento = ?, data_evento = ?, cargo_anterior = ?, cargo_novo = ?, " +
            "setor_anterior = ?, setor_novo = ?, salario_anterior = ?, salario_novo = ?, descricao = ?, realizado_por = ? " +
            "WHERE id_historico = ?";

    private static final String DELETE_SQL =
            "DELETE FROM HistoricoFuncionario WHERE id_historico = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM HistoricoFuncionario WHERE id_historico = ?";

    @Override
    public HistoricoFuncionario save(HistoricoFuncionario historico) {
        if (historico.getIdHistorico() != null && existsById(historico.getIdHistorico())) {
            return update(historico);
        } else {
            return insert(historico);
        }
    }

    private HistoricoFuncionario insert(HistoricoFuncionario historico) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, historico.getIdFuncionario());
            ps.setString(2, historico.getTipoEvento().name());
            ps.setDate(3, historico.getDataEvento() != null ? Date.valueOf(historico.getDataEvento()) : null);
            ps.setString(4, historico.getCargoAnterior());
            ps.setString(5, historico.getCargoNovo());
            ps.setString(6, historico.getSetorAnterior());
            ps.setString(7, historico.getSetorNovo());
            ps.setBigDecimal(8, historico.getSalarioAnterior());
            ps.setBigDecimal(9, historico.getSalarioNovo());
            ps.setString(10, historico.getDescricao());
            if (historico.getRealizadoPor() != null) {
                ps.setLong(11, historico.getRealizadoPor());
            } else {
                ps.setNull(11, java.sql.Types.BIGINT);
            }
            return ps;
        }, keyHolder);

        historico.setIdHistorico(keyHolder.getKey().longValue());
        return historico;
    }

    private HistoricoFuncionario update(HistoricoFuncionario historico) {
        jdbcTemplate.update(UPDATE_SQL,
                historico.getTipoEvento().name(),
                historico.getDataEvento() != null ? Date.valueOf(historico.getDataEvento()) : null,
                historico.getCargoAnterior(),
                historico.getCargoNovo(),
                historico.getSetorAnterior(),
                historico.getSetorNovo(),
                historico.getSalarioAnterior(),
                historico.getSalarioNovo(),
                historico.getDescricao(),
                historico.getRealizadoPor(),
                historico.getIdHistorico());
        return historico;
    }

    @Override
    public Optional<HistoricoFuncionario> findById(Long id) {
        try {
            HistoricoFuncionario historico = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, historicoRowMapper(), id);
            return Optional.ofNullable(historico);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<HistoricoFuncionario> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, historicoRowMapper());
    }

    @Override
    public void deleteById(Long id) {
        jdbcTemplate.update(DELETE_SQL, id);
    }

    @Override
    public boolean existsById(Long id) {
        Integer count = jdbcTemplate.queryForObject(EXISTS_SQL, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Busca histórico por funcionário
     */
    public List<HistoricoFuncionario> findByFuncionario(Long idFuncionario) {
        String sql = "SELECT h.*, " +
                "p1.nome as nome_funcionario, " +
                "p2.nome as nome_realizador " +
                "FROM HistoricoFuncionario h " +
                "LEFT JOIN Funcionario f ON h.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p1 ON f.id_pessoa = p1.id_pessoa " +
                "LEFT JOIN Usuario u ON h.realizado_por = u.id_pessoa " +
                "LEFT JOIN Pessoa p2 ON u.id_pessoa = p2.id_pessoa " +
                "WHERE h.id_funcionario = ? " +
                "ORDER BY h.data_evento DESC, h.data_registro DESC";
        
        return jdbcTemplate.query(sql, historicoRowMapper(), idFuncionario);
    }

    /**
     * Busca histórico por tipo de evento
     */
    public List<HistoricoFuncionario> findByTipoEvento(TipoEvento tipoEvento) {
        String sql = "SELECT h.*, " +
                "p1.nome as nome_funcionario, " +
                "p2.nome as nome_realizador " +
                "FROM HistoricoFuncionario h " +
                "LEFT JOIN Funcionario f ON h.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p1 ON f.id_pessoa = p1.id_pessoa " +
                "LEFT JOIN Usuario u ON h.realizado_por = u.id_pessoa " +
                "LEFT JOIN Pessoa p2 ON u.id_pessoa = p2.id_pessoa " +
                "WHERE h.tipo_evento = ? " +
                "ORDER BY h.data_evento DESC";
        
        return jdbcTemplate.query(sql, historicoRowMapper(), tipoEvento.name());
    }

    /**
     * Busca histórico por período
     */
    public List<HistoricoFuncionario> findByPeriodo(java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        String sql = "SELECT h.*, " +
                "p1.nome as nome_funcionario, " +
                "p2.nome as nome_realizador " +
                "FROM HistoricoFuncionario h " +
                "LEFT JOIN Funcionario f ON h.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p1 ON f.id_pessoa = p1.id_pessoa " +
                "LEFT JOIN Usuario u ON h.realizado_por = u.id_pessoa " +
                "LEFT JOIN Pessoa p2 ON u.id_pessoa = p2.id_pessoa " +
                "WHERE h.data_evento BETWEEN ? AND ? " +
                "ORDER BY h.data_evento DESC";
        
        return jdbcTemplate.query(sql, historicoRowMapper(), 
                Date.valueOf(dataInicio), Date.valueOf(dataFim));
    }

    private RowMapper<HistoricoFuncionario> historicoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            HistoricoFuncionario historico = new HistoricoFuncionario();
            historico.setIdHistorico(rs.getLong("id_historico"));
            historico.setIdFuncionario(rs.getLong("id_funcionario"));
            historico.setTipoEvento(TipoEvento.valueOf(rs.getString("tipo_evento")));
            
            Date dataEvento = rs.getDate("data_evento");
            if (dataEvento != null) {
                historico.setDataEvento(dataEvento.toLocalDate());
            }
            
            historico.setCargoAnterior(rs.getString("cargo_anterior"));
            historico.setCargoNovo(rs.getString("cargo_novo"));
            historico.setSetorAnterior(rs.getString("setor_anterior"));
            historico.setSetorNovo(rs.getString("setor_novo"));
            historico.setSalarioAnterior(rs.getBigDecimal("salario_anterior"));
            historico.setSalarioNovo(rs.getBigDecimal("salario_novo"));
            historico.setDescricao(rs.getString("descricao"));
            
            Long realizadoPor = rs.getObject("realizado_por", Long.class);
            historico.setRealizadoPor(realizadoPor);
            
            Timestamp dataRegistro = rs.getTimestamp("data_registro");
            if (dataRegistro != null) {
                historico.setDataRegistro(dataRegistro.toLocalDateTime());
            }
            
            // Informações adicionais
            historico.setNomeFuncionario(rs.getString("nome_funcionario"));
            historico.setNomeRealizador(rs.getString("nome_realizador"));
            
            return historico;
        };
    }
}
