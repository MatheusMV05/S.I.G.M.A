package com.project.sigma.repository;

import com.project.sigma.model.FeriasFuncionario;
import com.project.sigma.model.FeriasFuncionario.StatusFerias;
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
public class FeriasFuncionarioRepository implements BaseRepository<FeriasFuncionario, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO FeriasFuncionario (id_funcionario, periodo_aquisitivo_inicio, periodo_aquisitivo_fim, " +
            "data_inicio_ferias, data_fim_ferias, dias_gozados, abono_pecuniario, status_ferias, observacoes) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT f.*, " +
            "p.nome as nome_funcionario, " +
            "func.matricula as matricula_funcionario, " +
            "func.cargo as cargo_funcionario, " +
            "func.setor as setor_funcionario " +
            "FROM FeriasFuncionario f " +
            "LEFT JOIN Funcionario func ON f.id_funcionario = func.id_pessoa " +
            "LEFT JOIN Pessoa p ON func.id_pessoa = p.id_pessoa " +
            "WHERE f.id_ferias = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT f.*, " +
            "p.nome as nome_funcionario, " +
            "func.matricula as matricula_funcionario, " +
            "func.cargo as cargo_funcionario, " +
            "func.setor as setor_funcionario " +
            "FROM FeriasFuncionario f " +
            "LEFT JOIN Funcionario func ON f.id_funcionario = func.id_pessoa " +
            "LEFT JOIN Pessoa p ON func.id_pessoa = p.id_pessoa " +
            "ORDER BY f.data_inicio_ferias DESC";

    private static final String UPDATE_SQL =
            "UPDATE FeriasFuncionario SET periodo_aquisitivo_inicio = ?, periodo_aquisitivo_fim = ?, " +
            "data_inicio_ferias = ?, data_fim_ferias = ?, dias_gozados = ?, abono_pecuniario = ?, " +
            "status_ferias = ?, observacoes = ? WHERE id_ferias = ?";

    private static final String DELETE_SQL =
            "DELETE FROM FeriasFuncionario WHERE id_ferias = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM FeriasFuncionario WHERE id_ferias = ?";

    @Override
    public FeriasFuncionario save(FeriasFuncionario ferias) {
        if (ferias.getIdFerias() != null && existsById(ferias.getIdFerias())) {
            return update(ferias);
        } else {
            return insert(ferias);
        }
    }

    private FeriasFuncionario insert(FeriasFuncionario ferias) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, ferias.getIdFuncionario());
            ps.setDate(2, ferias.getPeriodoAquisitivoInicio() != null ? Date.valueOf(ferias.getPeriodoAquisitivoInicio()) : null);
            ps.setDate(3, ferias.getPeriodoAquisitivoFim() != null ? Date.valueOf(ferias.getPeriodoAquisitivoFim()) : null);
            ps.setDate(4, ferias.getDataInicioFerias() != null ? Date.valueOf(ferias.getDataInicioFerias()) : null);
            ps.setDate(5, ferias.getDataFimFerias() != null ? Date.valueOf(ferias.getDataFimFerias()) : null);
            ps.setInt(6, ferias.getDiasGozados());
            ps.setBoolean(7, ferias.getAbonoPecuniario() != null ? ferias.getAbonoPecuniario() : false);
            ps.setString(8, ferias.getStatusFerias() != null ? ferias.getStatusFerias().name() : StatusFerias.PROGRAMADAS.name());
            ps.setString(9, ferias.getObservacoes());
            return ps;
        }, keyHolder);

        ferias.setIdFerias(keyHolder.getKey().longValue());
        return ferias;
    }

    private FeriasFuncionario update(FeriasFuncionario ferias) {
        jdbcTemplate.update(UPDATE_SQL,
                ferias.getPeriodoAquisitivoInicio() != null ? Date.valueOf(ferias.getPeriodoAquisitivoInicio()) : null,
                ferias.getPeriodoAquisitivoFim() != null ? Date.valueOf(ferias.getPeriodoAquisitivoFim()) : null,
                ferias.getDataInicioFerias() != null ? Date.valueOf(ferias.getDataInicioFerias()) : null,
                ferias.getDataFimFerias() != null ? Date.valueOf(ferias.getDataFimFerias()) : null,
                ferias.getDiasGozados(),
                ferias.getAbonoPecuniario() != null ? ferias.getAbonoPecuniario() : false,
                ferias.getStatusFerias() != null ? ferias.getStatusFerias().name() : StatusFerias.PROGRAMADAS.name(),
                ferias.getObservacoes(),
                ferias.getIdFerias());
        return ferias;
    }

    @Override
    public Optional<FeriasFuncionario> findById(Long id) {
        try {
            FeriasFuncionario ferias = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, feriasRowMapper(), id);
            return Optional.ofNullable(ferias);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<FeriasFuncionario> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, feriasRowMapper());
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
     * Busca férias por funcionário
     */
    public List<FeriasFuncionario> findByFuncionario(Long idFuncionario) {
        String sql = "SELECT f.*, " +
                "p.nome as nome_funcionario, " +
                "func.matricula as matricula_funcionario, " +
                "func.cargo as cargo_funcionario, " +
                "func.setor as setor_funcionario " +
                "FROM FeriasFuncionario f " +
                "LEFT JOIN Funcionario func ON f.id_funcionario = func.id_pessoa " +
                "LEFT JOIN Pessoa p ON func.id_pessoa = p.id_pessoa " +
                "WHERE f.id_funcionario = ? " +
                "ORDER BY f.data_inicio_ferias DESC";
        
        return jdbcTemplate.query(sql, feriasRowMapper(), idFuncionario);
    }

    /**
     * Busca férias por status
     */
    public List<FeriasFuncionario> findByStatus(StatusFerias status) {
        String sql = "SELECT f.*, " +
                "p.nome as nome_funcionario, " +
                "func.matricula as matricula_funcionario, " +
                "func.cargo as cargo_funcionario, " +
                "func.setor as setor_funcionario " +
                "FROM FeriasFuncionario f " +
                "LEFT JOIN Funcionario func ON f.id_funcionario = func.id_pessoa " +
                "LEFT JOIN Pessoa p ON func.id_pessoa = p.id_pessoa " +
                "WHERE f.status_ferias = ? " +
                "ORDER BY f.data_inicio_ferias";
        
        return jdbcTemplate.query(sql, feriasRowMapper(), status.name());
    }

    /**
     * Busca férias por período
     */
    public List<FeriasFuncionario> findByPeriodo(java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        String sql = "SELECT f.*, " +
                "p.nome as nome_funcionario, " +
                "func.matricula as matricula_funcionario, " +
                "func.cargo as cargo_funcionario, " +
                "func.setor as setor_funcionario " +
                "FROM FeriasFuncionario f " +
                "LEFT JOIN Funcionario func ON f.id_funcionario = func.id_pessoa " +
                "LEFT JOIN Pessoa p ON func.id_pessoa = p.id_pessoa " +
                "WHERE f.data_inicio_ferias >= ? AND f.data_fim_ferias <= ? " +
                "ORDER BY f.data_inicio_ferias";
        
        return jdbcTemplate.query(sql, feriasRowMapper(), 
                Date.valueOf(dataInicio), Date.valueOf(dataFim));
    }

    /**
     * Busca férias em andamento
     */
    public List<FeriasFuncionario> findFeriasEmAndamento() {
        String sql = "SELECT f.*, " +
                "p.nome as nome_funcionario, " +
                "func.matricula as matricula_funcionario, " +
                "func.cargo as cargo_funcionario, " +
                "func.setor as setor_funcionario " +
                "FROM FeriasFuncionario f " +
                "LEFT JOIN Funcionario func ON f.id_funcionario = func.id_pessoa " +
                "LEFT JOIN Pessoa p ON func.id_pessoa = p.id_pessoa " +
                "WHERE f.data_inicio_ferias <= CURDATE() " +
                "AND f.data_fim_ferias >= CURDATE() " +
                "AND f.status_ferias = 'EM_ANDAMENTO' " +
                "ORDER BY p.nome";
        
        return jdbcTemplate.query(sql, feriasRowMapper());
    }

    /**
     * Busca férias programadas para os próximos dias
     */
    public List<FeriasFuncionario> findFeriasProgramadasProximos(int dias) {
        String sql = "SELECT f.*, " +
                "p.nome as nome_funcionario, " +
                "func.matricula as matricula_funcionario, " +
                "func.cargo as cargo_funcionario, " +
                "func.setor as setor_funcionario " +
                "FROM FeriasFuncionario f " +
                "LEFT JOIN Funcionario func ON f.id_funcionario = func.id_pessoa " +
                "LEFT JOIN Pessoa p ON func.id_pessoa = p.id_pessoa " +
                "WHERE f.data_inicio_ferias BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) " +
                "AND f.status_ferias = 'PROGRAMADAS' " +
                "ORDER BY f.data_inicio_ferias";
        
        return jdbcTemplate.query(sql, feriasRowMapper(), dias);
    }

    /**
     * Verifica conflito de férias para o mesmo funcionário
     */
    public boolean hasConflito(Long idFuncionario, java.time.LocalDate dataInicio, java.time.LocalDate dataFim, Long idFeriasExcluir) {
        String sql = "SELECT COUNT(*) FROM FeriasFuncionario " +
                "WHERE id_funcionario = ? " +
                "AND status_ferias NOT IN ('CANCELADAS', 'CONCLUIDAS') " +
                "AND ((data_inicio_ferias <= ? AND data_fim_ferias >= ?) " +
                "  OR (data_inicio_ferias <= ? AND data_fim_ferias >= ?) " +
                "  OR (data_inicio_ferias >= ? AND data_fim_ferias <= ?)) " +
                (idFeriasExcluir != null ? "AND id_ferias != ? " : "");
        
        Object[] params = idFeriasExcluir != null 
                ? new Object[]{idFuncionario, Date.valueOf(dataInicio), Date.valueOf(dataInicio), 
                              Date.valueOf(dataFim), Date.valueOf(dataFim), 
                              Date.valueOf(dataInicio), Date.valueOf(dataFim), idFeriasExcluir}
                : new Object[]{idFuncionario, Date.valueOf(dataInicio), Date.valueOf(dataInicio), 
                              Date.valueOf(dataFim), Date.valueOf(dataFim), 
                              Date.valueOf(dataInicio), Date.valueOf(dataFim)};
        
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, params);
        return count != null && count > 0;
    }

    private RowMapper<FeriasFuncionario> feriasRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            FeriasFuncionario ferias = new FeriasFuncionario();
            ferias.setIdFerias(rs.getLong("id_ferias"));
            ferias.setIdFuncionario(rs.getLong("id_funcionario"));
            
            Date periodoAquisitivoInicio = rs.getDate("periodo_aquisitivo_inicio");
            if (periodoAquisitivoInicio != null) {
                ferias.setPeriodoAquisitivoInicio(periodoAquisitivoInicio.toLocalDate());
            }
            
            Date periodoAquisitivoFim = rs.getDate("periodo_aquisitivo_fim");
            if (periodoAquisitivoFim != null) {
                ferias.setPeriodoAquisitivoFim(periodoAquisitivoFim.toLocalDate());
            }
            
            Date dataInicioFerias = rs.getDate("data_inicio_ferias");
            if (dataInicioFerias != null) {
                ferias.setDataInicioFerias(dataInicioFerias.toLocalDate());
            }
            
            Date dataFimFerias = rs.getDate("data_fim_ferias");
            if (dataFimFerias != null) {
                ferias.setDataFimFerias(dataFimFerias.toLocalDate());
            }
            
            ferias.setDiasGozados(rs.getInt("dias_gozados"));
            ferias.setAbonoPecuniario(rs.getBoolean("abono_pecuniario"));
            ferias.setStatusFerias(StatusFerias.valueOf(rs.getString("status_ferias")));
            ferias.setObservacoes(rs.getString("observacoes"));
            
            Timestamp dataCadastro = rs.getTimestamp("data_cadastro");
            if (dataCadastro != null) {
                ferias.setDataCadastro(dataCadastro.toLocalDateTime());
            }
            
            // Informações adicionais
            ferias.setNomeFuncionario(rs.getString("nome_funcionario"));
            ferias.setMatriculaFuncionario(rs.getString("matricula_funcionario"));
            ferias.setCargoFuncionario(rs.getString("cargo_funcionario"));
            ferias.setSetorFuncionario(rs.getString("setor_funcionario"));
            
            return ferias;
        };
    }
}
