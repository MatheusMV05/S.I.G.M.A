package com.project.sigma.repository;

import com.project.sigma.model.Pessoa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class PessoaRepository implements BaseRepository<Pessoa, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO Pessoa (nome, email, rua, numero, bairro, cidade, cep, data_cadastro) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT * FROM Pessoa WHERE id_pessoa = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT * FROM Pessoa";

    private static final String UPDATE_SQL =
            "UPDATE Pessoa SET nome = ?, email = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, cep = ? " +
                    "WHERE id_pessoa = ?";

    private static final String DELETE_SQL =
            "DELETE FROM Pessoa WHERE id_pessoa = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM Pessoa WHERE id_pessoa = ?";

    @Override
    public Pessoa save(Pessoa pessoa) {
        if (pessoa.getId_pessoa() == null) {
            return insert(pessoa);
        } else {
            return update(pessoa);
        }
    }

    private Pessoa insert(Pessoa pessoa) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_pessoa"});
            ps.setString(1, pessoa.getNome());
            ps.setString(2, pessoa.getEmail());
            ps.setString(3, pessoa.getRua());
            ps.setString(4, pessoa.getNumero());
            ps.setString(5, pessoa.getBairro());
            ps.setString(6, pessoa.getCidade());
            ps.setString(7, pessoa.getCep());
            ps.setTimestamp(8, Timestamp.valueOf(pessoa.getData_cadastro() != null ?
                    pessoa.getData_cadastro() : LocalDateTime.now()));
            return ps;
        }, keyHolder);

        pessoa.setId_pessoa(keyHolder.getKey().longValue());
        return pessoa;
    }

    private Pessoa update(Pessoa pessoa) {
        jdbcTemplate.update(UPDATE_SQL,
                pessoa.getNome(),
                pessoa.getEmail(),
                pessoa.getRua(),
                pessoa.getNumero(),
                pessoa.getBairro(),
                pessoa.getCidade(),
                pessoa.getCep(),
                pessoa.getId_pessoa());
        return pessoa;
    }

    @Override
    public Optional<Pessoa> findById(Long id) {
        try {
            Pessoa pessoa = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, pessoaRowMapper(), id);
            return Optional.ofNullable(pessoa);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Pessoa> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, pessoaRowMapper());
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

    public Optional<Pessoa> findByEmail(String email) {
        try {
            Pessoa pessoa = jdbcTemplate.queryForObject(
                    "SELECT * FROM Pessoa WHERE email = ?",
                    pessoaRowMapper(),
                    email);
            return Optional.ofNullable(pessoa);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private RowMapper<Pessoa> pessoaRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Pessoa pessoa = new Pessoa();
            pessoa.setId_pessoa(rs.getLong("id_pessoa"));
            pessoa.setNome(rs.getString("nome"));
            pessoa.setEmail(rs.getString("email"));
            pessoa.setRua(rs.getString("rua"));
            pessoa.setNumero(rs.getString("numero"));
            pessoa.setBairro(rs.getString("bairro"));
            pessoa.setCidade(rs.getString("cidade"));
            pessoa.setCep(rs.getString("cep"));

            Timestamp timestamp = rs.getTimestamp("data_cadastro");
            if (timestamp != null) {
                pessoa.setData_cadastro(timestamp.toLocalDateTime());
            }

            return pessoa;
        };
    }
}