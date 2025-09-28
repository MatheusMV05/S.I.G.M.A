package com.project.sigma.repository;

import com.project.sigma.dto.FuncionarioDTO;
import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Pessoa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
public class FuncionarioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Salva uma nova Pessoa, um novo Funcionario e um novo Telefone em uma única transação.
     * @param funcionarioDTO O DTO contendo todos os dados.
     * @return O DTO com o ID da pessoa preenchido.
     */
    @Transactional
    public FuncionarioDTO save(FuncionarioDTO funcionarioDTO) {
        // 1. Salvar na tabela Pessoa e obter o ID gerado
        String pessoaSql = "INSERT INTO Pessoa (nome, rua, numero, bairro, cidade) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(pessoaSql, Statement.RETURN_GENERATED_KEYS);
            Pessoa pessoa = funcionarioDTO.getPessoa();
            ps.setString(1, pessoa.getNome());
            ps.setString(2, pessoa.getRua());
            ps.setString(3, pessoa.getNumero());
            ps.setString(4, pessoa.getBairro());
            ps.setString(5, pessoa.getCidade());
            return ps;
        }, keyHolder);

        long generatedPessoaId = Objects.requireNonNull(keyHolder.getKey()).longValue();
        funcionarioDTO.getPessoa().setId_pessoa(generatedPessoaId);
        funcionarioDTO.getFuncionario().setId_pessoa(generatedPessoaId);

        // 2. Salvar na tabela Funcionario
        String funcionarioSql = "INSERT INTO funcionario (id_pessoa, matricula, salario, cargo, setor, id_supervisor) VALUES (?, ?, ?, ?, ?, ?)";
        Funcionario funcionario = funcionarioDTO.getFuncionario();
        jdbcTemplate.update(funcionarioSql,
                funcionario.getId_pessoa(),
                funcionario.getMatricula(),
                funcionario.getSalario(),
                funcionario.getCargo(),
                funcionario.getSetor(),
                funcionario.getId_supervisor()
        );

        // 3. Salvar o Telefone
        if (funcionarioDTO.getTelefone() != null && !funcionarioDTO.getTelefone().isEmpty()) {
            String telefoneSql = "INSERT INTO Telefone (id_pessoa, numero) VALUES (?, ?)";
            jdbcTemplate.update(telefoneSql, generatedPessoaId, funcionarioDTO.getTelefone());
        }

        return funcionarioDTO;
    }

    public List<FuncionarioDTO> search(Long id, String cargo) {
        StringBuilder sql = new StringBuilder(
                "SELECT " +
                        "p.id_pessoa, p.nome, p.rua, p.numero, p.bairro, p.cidade, " +
                        "f.matricula, f.salario, f.cargo, f.setor, f.id_supervisor, " +
                        "t.numero as telefone " +
                        "FROM Pessoa p " +
                        "JOIN funcionario f ON p.id_pessoa = f.id_pessoa " +
                        "LEFT JOIN Telefone t ON p.id_pessoa = t.id_pessoa"
        );

        List<Object> params = new ArrayList<>();
        StringBuilder whereClause = new StringBuilder();

        if (id != null) {
            whereClause.append("p.id_pessoa = ?");
            params.add(id);
        }

        if (cargo != null && !cargo.trim().isEmpty()) {
            if (whereClause.length() > 0) whereClause.append(" AND ");
            whereClause.append("LOWER(f.cargo) LIKE ?");
            params.add("%" + cargo.trim().toLowerCase() + "%");
        }

        if (whereClause.length() > 0) {
            sql.append(" WHERE ").append(whereClause);
        }
        sql.append(" ORDER BY p.nome;");

        return jdbcTemplate.query(sql.toString(), params.toArray(), new FuncionarioDTORowMapper());
    }

    private static class FuncionarioDTORowMapper implements RowMapper<FuncionarioDTO> {
        @Override
        public FuncionarioDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            Pessoa pessoa = new Pessoa();
            pessoa.setId_pessoa(rs.getLong("id_pessoa"));
            pessoa.setNome(rs.getString("nome"));
            // ... preencher resto dos dados da pessoa

            Funcionario funcionario = new Funcionario();
            funcionario.setId_pessoa(rs.getLong("id_pessoa"));
            funcionario.setMatricula(rs.getString("matricula"));
            // ... preencher resto dos dados do funcionario

            FuncionarioDTO dto = new FuncionarioDTO();
            dto.setPessoa(pessoa);
            dto.setFuncionario(funcionario);
            dto.setTelefone(rs.getString("telefone"));

            return dto;
        }
    }

    /**
     * Atualiza os dados de Pessoa, Funcionario e Telefone em uma única transação.
     * @param funcionarioDTO O DTO com os dados a serem atualizados.
     * @return O DTO atualizado.
     */
    @Transactional
    public FuncionarioDTO update(FuncionarioDTO funcionarioDTO) {
        Pessoa pessoa = funcionarioDTO.getPessoa();
        Funcionario funcionario = funcionarioDTO.getFuncionario();
        Long id = pessoa.getId_pessoa();

        if (id == null) {
            throw new IllegalArgumentException("ID da pessoa não pode ser nulo para atualização.");
        }
        funcionario.setId_pessoa(id);

        // 1. Atualizar a tabela Pessoa
        String pessoaSql = "UPDATE Pessoa SET nome = ?, rua = ?, numero = ?, bairro = ?, cidade = ? WHERE id_pessoa = ?";
        jdbcTemplate.update(pessoaSql, pessoa.getNome(), pessoa.getRua(), pessoa.getNumero(), pessoa.getBairro(), pessoa.getCidade(), id);

        // 2. Atualizar a tabela Funcionario
        String funcionarioSql = "UPDATE funcionario SET matricula = ?, salario = ?, cargo = ?, setor = ?, id_supervisor = ? WHERE id_pessoa = ?";
        jdbcTemplate.update(funcionarioSql,
                funcionario.getMatricula(),
                funcionario.getSalario(),
                funcionario.getCargo(),
                funcionario.getSetor(),
                funcionario.getId_supervisor(),
                id
        );

        // 3. Atualizar/Inserir o Telefone
        if (funcionarioDTO.getTelefone() != null && !funcionarioDTO.getTelefone().isEmpty()) {
            String telefoneUpdateSql = "UPDATE Telefone SET numero = ? WHERE id_pessoa = ?";
            int rowsAffected = jdbcTemplate.update(telefoneUpdateSql, funcionarioDTO.getTelefone(), id);

            if (rowsAffected == 0) {
                String telefoneInsertSql = "INSERT INTO Telefone (id_pessoa, numero) VALUES (?, ?)";
                jdbcTemplate.update(telefoneInsertSql, id, funcionarioDTO.getTelefone());
            }
        }

        return funcionarioDTO;
    }

    // DELETE
    public void deleteById(Long id) {
        String sql = "DELETE FROM Pessoa WHERE id_pessoa = ?";
        jdbcTemplate.update(sql, id);
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
