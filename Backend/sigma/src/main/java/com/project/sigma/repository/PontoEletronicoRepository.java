package com.project.sigma.repository;

import com.project.sigma.model.PontoEletronico;
import com.project.sigma.model.PontoEletronico.StatusPonto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public class PontoEletronicoRepository implements BaseRepository<PontoEletronico, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO PontoEletronico (id_funcionario, data_ponto, hora_entrada, hora_saida_almoco, " +
            "hora_retorno_almoco, hora_saida, horas_trabalhadas, horas_extras, observacoes, status_ponto) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT p.*, " +
            "pes.nome as nome_funcionario, " +
            "f.matricula as matricula_funcionario, " +
            "f.cargo as cargo_funcionario, " +
            "f.setor as setor_funcionario " +
            "FROM PontoEletronico p " +
            "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
            "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
            "WHERE p.id_ponto = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT p.*, " +
            "pes.nome as nome_funcionario, " +
            "f.matricula as matricula_funcionario, " +
            "f.cargo as cargo_funcionario, " +
            "f.setor as setor_funcionario " +
            "FROM PontoEletronico p " +
            "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
            "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
            "ORDER BY p.data_ponto DESC, pes.nome";

    private static final String UPDATE_SQL =
            "UPDATE PontoEletronico SET hora_entrada = ?, hora_saida_almoco = ?, hora_retorno_almoco = ?, " +
            "hora_saida = ?, horas_trabalhadas = ?, horas_extras = ?, observacoes = ?, status_ponto = ? " +
            "WHERE id_ponto = ?";

    private static final String DELETE_SQL =
            "DELETE FROM PontoEletronico WHERE id_ponto = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM PontoEletronico WHERE id_ponto = ?";

    @Override
    public PontoEletronico save(PontoEletronico ponto) {
        if (ponto.getIdPonto() != null && existsById(ponto.getIdPonto())) {
            return update(ponto);
        } else {
            return insert(ponto);
        }
    }

    private PontoEletronico insert(PontoEletronico ponto) {
        // Calcular horas trabalhadas antes de inserir
        calcularHorasTrabalhadas(ponto);
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, ponto.getIdFuncionario());
            ps.setDate(2, ponto.getDataPonto() != null ? Date.valueOf(ponto.getDataPonto()) : null);
            ps.setTime(3, ponto.getHoraEntrada() != null ? Time.valueOf(ponto.getHoraEntrada()) : null);
            ps.setTime(4, ponto.getHoraSaidaAlmoco() != null ? Time.valueOf(ponto.getHoraSaidaAlmoco()) : null);
            ps.setTime(5, ponto.getHoraRetornoAlmoco() != null ? Time.valueOf(ponto.getHoraRetornoAlmoco()) : null);
            ps.setTime(6, ponto.getHoraSaida() != null ? Time.valueOf(ponto.getHoraSaida()) : null);
            ps.setBigDecimal(7, ponto.getHorasTrabalhadas());
            ps.setBigDecimal(8, ponto.getHorasExtras());
            ps.setString(9, ponto.getObservacoes());
            ps.setString(10, ponto.getStatusPonto() != null ? ponto.getStatusPonto().name() : StatusPonto.NORMAL.name());
            return ps;
        }, keyHolder);

        ponto.setIdPonto(keyHolder.getKey().longValue());
        return ponto;
    }

    private PontoEletronico update(PontoEletronico ponto) {
        // Calcular horas trabalhadas antes de atualizar
        calcularHorasTrabalhadas(ponto);
        
        jdbcTemplate.update(UPDATE_SQL,
                ponto.getHoraEntrada() != null ? Time.valueOf(ponto.getHoraEntrada()) : null,
                ponto.getHoraSaidaAlmoco() != null ? Time.valueOf(ponto.getHoraSaidaAlmoco()) : null,
                ponto.getHoraRetornoAlmoco() != null ? Time.valueOf(ponto.getHoraRetornoAlmoco()) : null,
                ponto.getHoraSaida() != null ? Time.valueOf(ponto.getHoraSaida()) : null,
                ponto.getHorasTrabalhadas(),
                ponto.getHorasExtras(),
                ponto.getObservacoes(),
                ponto.getStatusPonto() != null ? ponto.getStatusPonto().name() : StatusPonto.NORMAL.name(),
                ponto.getIdPonto());
        return ponto;
    }

    @Override
    public Optional<PontoEletronico> findById(Long id) {
        try {
            PontoEletronico ponto = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, pontoRowMapper(), id);
            return Optional.ofNullable(ponto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<PontoEletronico> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, pontoRowMapper());
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
     * Busca pontos por funcionário
     */
    public List<PontoEletronico> findByFuncionario(Long idFuncionario) {
        String sql = "SELECT p.*, " +
                "pes.nome as nome_funcionario, " +
                "f.matricula as matricula_funcionario, " +
                "f.cargo as cargo_funcionario, " +
                "f.setor as setor_funcionario " +
                "FROM PontoEletronico p " +
                "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
                "WHERE p.id_funcionario = ? " +
                "ORDER BY p.data_ponto DESC";
        
        return jdbcTemplate.query(sql, pontoRowMapper(), idFuncionario);
    }

    /**
     * Busca ponto por funcionário e data
     */
    public Optional<PontoEletronico> findByFuncionarioAndData(Long idFuncionario, java.time.LocalDate data) {
        String sql = "SELECT p.*, " +
                "pes.nome as nome_funcionario, " +
                "f.matricula as matricula_funcionario, " +
                "f.cargo as cargo_funcionario, " +
                "f.setor as setor_funcionario " +
                "FROM PontoEletronico p " +
                "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
                "WHERE p.id_funcionario = ? AND p.data_ponto = ?";
        
        try {
            PontoEletronico ponto = jdbcTemplate.queryForObject(sql, pontoRowMapper(), 
                    idFuncionario, Date.valueOf(data));
            return Optional.ofNullable(ponto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Busca pontos por período
     */
    public List<PontoEletronico> findByPeriodo(java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        String sql = "SELECT p.*, " +
                "pes.nome as nome_funcionario, " +
                "f.matricula as matricula_funcionario, " +
                "f.cargo as cargo_funcionario, " +
                "f.setor as setor_funcionario " +
                "FROM PontoEletronico p " +
                "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
                "WHERE p.data_ponto BETWEEN ? AND ? " +
                "ORDER BY p.data_ponto, pes.nome";
        
        return jdbcTemplate.query(sql, pontoRowMapper(), 
                Date.valueOf(dataInicio), Date.valueOf(dataFim));
    }

    /**
     * Busca pontos por funcionário e período
     */
    public List<PontoEletronico> findByFuncionarioAndPeriodo(Long idFuncionario, 
            java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        String sql = "SELECT p.*, " +
                "pes.nome as nome_funcionario, " +
                "f.matricula as matricula_funcionario, " +
                "f.cargo as cargo_funcionario, " +
                "f.setor as setor_funcionario " +
                "FROM PontoEletronico p " +
                "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
                "WHERE p.id_funcionario = ? AND p.data_ponto BETWEEN ? AND ? " +
                "ORDER BY p.data_ponto";
        
        return jdbcTemplate.query(sql, pontoRowMapper(), 
                idFuncionario, Date.valueOf(dataInicio), Date.valueOf(dataFim));
    }

    /**
     * Busca pontos por status
     */
    public List<PontoEletronico> findByStatus(StatusPonto status) {
        String sql = "SELECT p.*, " +
                "pes.nome as nome_funcionario, " +
                "f.matricula as matricula_funcionario, " +
                "f.cargo as cargo_funcionario, " +
                "f.setor as setor_funcionario " +
                "FROM PontoEletronico p " +
                "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
                "WHERE p.status_ponto = ? " +
                "ORDER BY p.data_ponto DESC";
        
        return jdbcTemplate.query(sql, pontoRowMapper(), status.name());
    }

    /**
     * Busca pontos com horas extras
     */
    public List<PontoEletronico> findComHorasExtras(java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        String sql = "SELECT p.*, " +
                "pes.nome as nome_funcionario, " +
                "f.matricula as matricula_funcionario, " +
                "f.cargo as cargo_funcionario, " +
                "f.setor as setor_funcionario " +
                "FROM PontoEletronico p " +
                "LEFT JOIN Funcionario f ON p.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa pes ON f.id_pessoa = pes.id_pessoa " +
                "WHERE p.horas_extras > 0 AND p.data_ponto BETWEEN ? AND ? " +
                "ORDER BY p.horas_extras DESC, p.data_ponto DESC";
        
        return jdbcTemplate.query(sql, pontoRowMapper(), 
                Date.valueOf(dataInicio), Date.valueOf(dataFim));
    }

    /**
     * Calcula total de horas trabalhadas por funcionário em um período
     */
    public BigDecimal getTotalHorasFuncionario(Long idFuncionario, java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        String sql = "SELECT COALESCE(SUM(horas_trabalhadas), 0) FROM PontoEletronico " +
                "WHERE id_funcionario = ? AND data_ponto BETWEEN ? AND ? AND status_ponto = 'NORMAL'";
        
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, 
                idFuncionario, Date.valueOf(dataInicio), Date.valueOf(dataFim));
    }

    /**
     * Calcula total de horas extras por funcionário em um período
     */
    public BigDecimal getTotalHorasExtrasFuncionario(Long idFuncionario, java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        String sql = "SELECT COALESCE(SUM(horas_extras), 0) FROM PontoEletronico " +
                "WHERE id_funcionario = ? AND data_ponto BETWEEN ? AND ?";
        
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, 
                idFuncionario, Date.valueOf(dataInicio), Date.valueOf(dataFim));
    }

    /**
     * Calcula horas trabalhadas e horas extras
     */
    private void calcularHorasTrabalhadas(PontoEletronico ponto) {
        if (ponto.getStatusPonto() != StatusPonto.NORMAL) {
            ponto.setHorasTrabalhadas(BigDecimal.ZERO);
            ponto.setHorasExtras(BigDecimal.ZERO);
            return;
        }

        if (ponto.getHoraEntrada() == null || ponto.getHoraSaida() == null) {
            ponto.setHorasTrabalhadas(BigDecimal.ZERO);
            ponto.setHorasExtras(BigDecimal.ZERO);
            return;
        }

        // Calcular horas da manhã
        LocalTime entrada = ponto.getHoraEntrada();
        LocalTime saidaAlmoco = ponto.getHoraSaidaAlmoco() != null ? ponto.getHoraSaidaAlmoco() : ponto.getHoraSaida();
        long minutosManha = Duration.between(entrada, saidaAlmoco).toMinutes();

        // Calcular horas da tarde
        long minutosTarde = 0;
        if (ponto.getHoraRetornoAlmoco() != null) {
            LocalTime retornoAlmoco = ponto.getHoraRetornoAlmoco();
            LocalTime saida = ponto.getHoraSaida();
            minutosTarde = Duration.between(retornoAlmoco, saida).toMinutes();
        }

        // Total de minutos trabalhados
        long totalMinutos = minutosManha + minutosTarde;
        BigDecimal horasTrabalhadas = BigDecimal.valueOf(totalMinutos).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        ponto.setHorasTrabalhadas(horasTrabalhadas);

        // Calcular horas extras (acima de 8 horas)
        BigDecimal horasExtras = horasTrabalhadas.subtract(BigDecimal.valueOf(8));
        if (horasExtras.compareTo(BigDecimal.ZERO) > 0) {
            ponto.setHorasExtras(horasExtras);
        } else {
            ponto.setHorasExtras(BigDecimal.ZERO);
        }
    }

    private RowMapper<PontoEletronico> pontoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            PontoEletronico ponto = new PontoEletronico();
            ponto.setIdPonto(rs.getLong("id_ponto"));
            ponto.setIdFuncionario(rs.getLong("id_funcionario"));
            
            Date dataPonto = rs.getDate("data_ponto");
            if (dataPonto != null) {
                ponto.setDataPonto(dataPonto.toLocalDate());
            }
            
            Time horaEntrada = rs.getTime("hora_entrada");
            if (horaEntrada != null) {
                ponto.setHoraEntrada(horaEntrada.toLocalTime());
            }
            
            Time horaSaidaAlmoco = rs.getTime("hora_saida_almoco");
            if (horaSaidaAlmoco != null) {
                ponto.setHoraSaidaAlmoco(horaSaidaAlmoco.toLocalTime());
            }
            
            Time horaRetornoAlmoco = rs.getTime("hora_retorno_almoco");
            if (horaRetornoAlmoco != null) {
                ponto.setHoraRetornoAlmoco(horaRetornoAlmoco.toLocalTime());
            }
            
            Time horaSaida = rs.getTime("hora_saida");
            if (horaSaida != null) {
                ponto.setHoraSaida(horaSaida.toLocalTime());
            }
            
            ponto.setHorasTrabalhadas(rs.getBigDecimal("horas_trabalhadas"));
            ponto.setHorasExtras(rs.getBigDecimal("horas_extras"));
            ponto.setObservacoes(rs.getString("observacoes"));
            ponto.setStatusPonto(StatusPonto.valueOf(rs.getString("status_ponto")));
            
            Timestamp dataRegistro = rs.getTimestamp("data_registro");
            if (dataRegistro != null) {
                ponto.setDataRegistro(dataRegistro.toLocalDateTime());
            }
            
            // Informações adicionais
            ponto.setNomeFuncionario(rs.getString("nome_funcionario"));
            ponto.setMatriculaFuncionario(rs.getString("matricula_funcionario"));
            ponto.setCargoFuncionario(rs.getString("cargo_funcionario"));
            ponto.setSetorFuncionario(rs.getString("setor_funcionario"));
            
            return ponto;
        };
    }
}
