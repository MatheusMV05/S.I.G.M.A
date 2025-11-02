package com.project.sigma.repository;

import com.project.sigma.model.Funcionario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class FuncionarioRepository implements BaseRepository<Funcionario, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO Funcionario (id_pessoa, matricula, salario, cargo, setor, id_supervisor, status, data_admissao, " +
            "turno, tipo_contrato, carga_horaria_semanal, comissao_percentual, meta_mensal, beneficios, observacoes) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT * FROM Funcionario WHERE id_pessoa = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT * FROM Funcionario ORDER BY nome";

    private static final String UPDATE_SQL =
            "UPDATE Funcionario SET matricula = ?, salario = ?, cargo = ?, setor = ?, id_supervisor = ?, status = ?, " +
            "data_admissao = ?, turno = ?, tipo_contrato = ?, carga_horaria_semanal = ?, comissao_percentual = ?, " +
            "meta_mensal = ?, beneficios = ?, observacoes = ?, foto_url = ?, data_ultima_promocao = ? " +
            "WHERE id_pessoa = ?";

    private static final String DELETE_SQL =
            "DELETE FROM Funcionario WHERE id_pessoa = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM Funcionario WHERE id_pessoa = ?";

    @Override
    public Funcionario save(Funcionario funcionario) {
        if (existsById(funcionario.getId_pessoa())) {
            return update(funcionario);
        } else {
            return insert(funcionario);
        }
    }

    private Funcionario insert(Funcionario funcionario) {
        jdbcTemplate.update(INSERT_SQL,
                funcionario.getId_pessoa(),
                funcionario.getMatricula(),
                funcionario.getSalario(),
                funcionario.getCargo(),
                funcionario.getSetor(),
                funcionario.getId_supervisor(),
                funcionario.getStatus().name(),
                funcionario.getData_admissao() != null ? Date.valueOf(funcionario.getData_admissao()) : null,
                funcionario.getTurno() != null ? funcionario.getTurno().name() : "INTEGRAL",
                funcionario.getTipo_contrato() != null ? funcionario.getTipo_contrato().name() : "CLT",
                funcionario.getCarga_horaria_semanal() != null ? funcionario.getCarga_horaria_semanal() : 40,
                funcionario.getComissao_percentual() != null ? funcionario.getComissao_percentual() : BigDecimal.ZERO,
                funcionario.getMeta_mensal() != null ? funcionario.getMeta_mensal() : BigDecimal.ZERO,
                funcionario.getBeneficios(),
                funcionario.getObservacoes());
        return funcionario;
    }

    private Funcionario update(Funcionario funcionario) {
        jdbcTemplate.update(UPDATE_SQL,
                funcionario.getMatricula(),
                funcionario.getSalario(),
                funcionario.getCargo(),
                funcionario.getSetor(),
                funcionario.getId_supervisor(),
                funcionario.getStatus().name(),
                funcionario.getData_admissao() != null ? Date.valueOf(funcionario.getData_admissao()) : null,
                funcionario.getTurno() != null ? funcionario.getTurno().name() : "INTEGRAL",
                funcionario.getTipo_contrato() != null ? funcionario.getTipo_contrato().name() : "CLT",
                funcionario.getCarga_horaria_semanal() != null ? funcionario.getCarga_horaria_semanal() : 40,
                funcionario.getComissao_percentual() != null ? funcionario.getComissao_percentual() : BigDecimal.ZERO,
                funcionario.getMeta_mensal() != null ? funcionario.getMeta_mensal() : BigDecimal.ZERO,
                funcionario.getBeneficios(),
                funcionario.getObservacoes(),
                funcionario.getFoto_url(),
                funcionario.getData_ultima_promocao() != null ? Date.valueOf(funcionario.getData_ultima_promocao()) : null,
                funcionario.getId_pessoa());
        return funcionario;
    }

    @Override
    public Optional<Funcionario> findById(Long id) {
        try {
            Funcionario funcionario = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, funcionarioRowMapper(), id);
            return Optional.ofNullable(funcionario);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Funcionario> findAll() {
        return jdbcTemplate.query(
                "SELECT f.*, p.nome FROM Funcionario f JOIN Pessoa p ON f.id_pessoa = p.id_pessoa ORDER BY p.nome",
                funcionarioRowMapper());
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

    public Optional<Funcionario> findByMatricula(String matricula) {
        try {
            Funcionario funcionario = jdbcTemplate.queryForObject(
                    "SELECT * FROM Funcionario WHERE matricula = ?",
                    funcionarioRowMapper(),
                    matricula);
            return Optional.ofNullable(funcionario);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Funcionario> findByStatus(Funcionario.StatusFuncionario status) {
        return jdbcTemplate.query(
                "SELECT f.*, p.nome FROM Funcionario f JOIN Pessoa p ON f.id_pessoa = p.id_pessoa WHERE f.status = ? ORDER BY p.nome",
                funcionarioRowMapper(),
                status.name());
    }

    public List<Funcionario> findBySetor(String setor) {
        return jdbcTemplate.query(
                "SELECT f.*, p.nome FROM Funcionario f JOIN Pessoa p ON f.id_pessoa = p.id_pessoa WHERE f.setor = ? ORDER BY p.nome",
                funcionarioRowMapper(),
                setor);
    }
    
    /**
     * Busca informações calculadas do funcionário (vendas, tempo de empresa, etc)
     */
    public java.util.Map<String, Object> getStatsFuncionario(Long idFuncionario) {
        String sql = "SELECT " +
                "TIMESTAMPDIFF(MONTH, f.data_admissao, COALESCE(f.data_desligamento, CURDATE())) as meses_empresa, " +
                "TIMESTAMPDIFF(YEAR, f.data_admissao, COALESCE(f.data_desligamento, CURDATE())) as anos_empresa, " +
                "(SELECT COUNT(*) FROM Venda v WHERE v.id_funcionario = f.id_pessoa " +
                " AND MONTH(v.data_venda) = MONTH(CURDATE()) AND YEAR(v.data_venda) = YEAR(CURDATE())) as vendas_mes_atual, " +
                "(SELECT COALESCE(SUM(v.valor_final), 0) FROM Venda v WHERE v.id_funcionario = f.id_pessoa " +
                " AND MONTH(v.data_venda) = MONTH(CURDATE()) AND YEAR(v.data_venda) = YEAR(CURDATE()) AND v.status = 'CONCLUIDA') as valor_vendas_mes_atual " +
                "FROM Funcionario f WHERE f.id_pessoa = ?";
        
        try {
            return jdbcTemplate.queryForMap(sql, idFuncionario);
        } catch (Exception e) {
            java.util.Map<String, Object> emptyStats = new java.util.HashMap<>();
            emptyStats.put("meses_empresa", 0);
            emptyStats.put("anos_empresa", 0);
            emptyStats.put("vendas_mes_atual", 0);
            emptyStats.put("valor_vendas_mes_atual", BigDecimal.ZERO);
            return emptyStats;
        }
    }
    
    /**
     * Busca funcionários por turno
     */
    public List<Funcionario> findByTurno(String turno) {
        return jdbcTemplate.query(
                "SELECT f.*, p.nome FROM Funcionario f JOIN Pessoa p ON f.id_pessoa = p.id_pessoa WHERE f.turno = ? ORDER BY p.nome",
                funcionarioRowMapper(),
                turno);
    }
    
    /**
     * Busca funcionários com vendas acima da meta
     */
    public List<Funcionario> findAcimaMetaMensal() {
        String sql = "SELECT f.* FROM Funcionario f " +
                "WHERE f.meta_mensal > 0 AND f.status = 'ATIVO' " +
                "AND (SELECT COALESCE(SUM(v.valor_final), 0) FROM Venda v " +
                "     WHERE v.id_funcionario = f.id_pessoa " +
                "     AND MONTH(v.data_venda) = MONTH(CURDATE()) " +
                "     AND YEAR(v.data_venda) = YEAR(CURDATE()) " +
                "     AND v.status = 'CONCLUIDA') >= f.meta_mensal " +
                "ORDER BY f.cargo";
        
        return jdbcTemplate.query(sql, funcionarioRowMapper());
    }

    private RowMapper<Funcionario> funcionarioRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Funcionario funcionario = new Funcionario();
            funcionario.setId_pessoa(rs.getLong("id_pessoa"));
            funcionario.setMatricula(rs.getString("matricula"));
            funcionario.setSalario(rs.getBigDecimal("salario"));
            funcionario.setCargo(rs.getString("cargo"));
            funcionario.setSetor(rs.getString("setor"));
            funcionario.setId_supervisor(rs.getObject("id_supervisor", Long.class));
            funcionario.setStatus(Funcionario.StatusFuncionario.valueOf(rs.getString("status")));

            Date dataAdmissao = rs.getDate("data_admissao");
            if (dataAdmissao != null) {
                funcionario.setData_admissao(dataAdmissao.toLocalDate());
            }
            
            // Novos campos
            String turno = rs.getString("turno");
            if (turno != null) {
                funcionario.setTurno(Funcionario.TurnoTrabalho.valueOf(turno));
            }
            
            String tipoContrato = rs.getString("tipo_contrato");
            if (tipoContrato != null) {
                funcionario.setTipo_contrato(Funcionario.TipoContrato.valueOf(tipoContrato));
            }
            
            funcionario.setCarga_horaria_semanal(rs.getObject("carga_horaria_semanal", Integer.class));
            
            Date dataDesligamento = rs.getDate("data_desligamento");
            if (dataDesligamento != null) {
                funcionario.setData_desligamento(dataDesligamento.toLocalDate());
            }
            
            funcionario.setMotivo_desligamento(rs.getString("motivo_desligamento"));
            funcionario.setBeneficios(rs.getString("beneficios"));
            funcionario.setObservacoes(rs.getString("observacoes"));
            funcionario.setFoto_url(rs.getString("foto_url"));
            
            Date dataUltimaPromocao = rs.getDate("data_ultima_promocao");
            if (dataUltimaPromocao != null) {
                funcionario.setData_ultima_promocao(dataUltimaPromocao.toLocalDate());
            }
            
            funcionario.setComissao_percentual(rs.getBigDecimal("comissao_percentual"));
            funcionario.setMeta_mensal(rs.getBigDecimal("meta_mensal"));

            return funcionario;
        };
    }
}
