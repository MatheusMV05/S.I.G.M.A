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
            "INSERT INTO Funcionario (id_pessoa, matricula, salario, cargo, setor, id_supervisor, status, data_admissao) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT * FROM Funcionario WHERE id_pessoa = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT * FROM Funcionario ORDER BY nome";

    private static final String UPDATE_SQL =
            "UPDATE Funcionario SET matricula = ?, salario = ?, cargo = ?, setor = ?, id_supervisor = ?, status = ?, data_admissao = ? " +
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
                funcionario.getData_admissao() != null ? Date.valueOf(funcionario.getData_admissao()) : null);
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

            return funcionario;
        };
    }
}
