package com.project.sigma.repository;

import com.project.sigma.model.Funcionario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class FuncionarioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // CREATE
    public Funcionario salvar(Funcionario funcionario) {
        String sql = "INSERT INTO funcionario (id_pessoa, matricula, salario, cargo, setor, id_supervisor) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                funcionario.getId_pessoa(),
                funcionario.getMatricula(),
                funcionario.getSalario(),
                funcionario.getCargo(),
                funcionario.getSetor(),
                funcionario.getId_supervisor()
        );
        return funcionario;
    }

    // READ (by ID)
    public Optional<Funcionario> buscarPorId(Long id) {
        String sql = "SELECT * FROM funcionario WHERE id_pessoa = ?";
        try {
            Funcionario funcionario = jdbcTemplate.queryForObject(sql, new Object[]{id}, new FuncionarioRowMapper());
            return Optional.ofNullable(funcionario);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    // READ (all)
    public List<Funcionario> buscarTodos() {
        String sql = "SELECT * FROM funcionario";
        return jdbcTemplate.query(sql, new FuncionarioRowMapper());
    }

    // UPDATE
    public int atualizar(Funcionario funcionario) {
        String sql = "UPDATE funcionario SET matricula = ?, salario = ?, cargo = ?, setor = ?, id_supervisor = ? WHERE id_pessoa = ?";
        return jdbcTemplate.update(sql,
                funcionario.getMatricula(),
                funcionario.getSalario(),
                funcionario.getCargo(),
                funcionario.getSetor(),
                funcionario.getId_supervisor(),
                funcionario.getId_pessoa()
        );
    }

    // DELETE
    public int deletarPorId(Long id) {
        String sql = "DELETE FROM funcionario WHERE id_pessoa = ?";
        return jdbcTemplate.update(sql, id);
    }

    private static class FuncionarioRowMapper implements RowMapper<Funcionario> {
        @Override
        public Funcionario mapRow(ResultSet rs, int rowNum) throws SQLException {
            Funcionario funcionario = new Funcionario();
            funcionario.setId_pessoa(rs.getLong("id_pessoa"));
            funcionario.setMatricula(rs.getString("matricula"));
            funcionario.setSalario(rs.getBigDecimal("salario"));
            funcionario.setCargo(rs.getString("cargo"));
            funcionario.setSetor(rs.getString("setor"));
            // Importante: verificar se o id_supervisor é nulo
            long supervisorId = rs.getLong("id_supervisor");
            if (!rs.wasNull()) {
                funcionario.setId_supervisor(supervisorId);
            }
            return funcionario;
        }
    }
}
