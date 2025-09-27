package com.project.sigma.repository;

import com.project.sigma.model.Pessoa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

@Repository
public class PessoaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    //Para criar e salvar uma pessoa!
    public Pessoa salvar(Pessoa pessoa) {
        String sql = "INSERT INTO Pessoa (nome, rua, numero, bairro, cidade) VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, pessoa.getNome());
            ps.setString(2, pessoa.getRua());
            ps.setString(3, pessoa.getNumero());
            ps.setString(4, pessoa.getBairro());
            ps.setString(5, pessoa.getCidade());
            return ps;
        }, keyHolder);

        // Pega o ID gerado pelo banco e o define no objeto pessoa
        if (keyHolder.getKey() != null) {
            pessoa.setId_pessoa(keyHolder.getKey().longValue());
        }

        return pessoa;
    }

    //Buscar (ó precisamos da busca simples por id para as funcionalidades futuras reaproveitarem)
    public Optional<Pessoa> buscarPorId(Long id) {
        String sql = "SELECT * FROM Pessoa WHERE id_pessoa = ?";
        try {
            Pessoa pessoa = jdbcTemplate.queryForObject(sql, new Object[]{id}, new PessoaRowMapper());
            return Optional.ofNullable(pessoa);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    // UPDATE
    public int atualizar(Pessoa pessoa) {
        String sql = "UPDATE Pessoa SET nome = ?, rua = ?, numero = ?, bairro = ?, cidade = ? WHERE id_pessoa = ?";
        return jdbcTemplate.update(sql,
                pessoa.getNome(),
                pessoa.getRua(),
                pessoa.getNumero(),
                pessoa.getBairro(),
                pessoa.getCidade(),
                pessoa.getId_pessoa());
    }

    // DELETE
    public int deletarPorId(Long id) {
        String sql = "DELETE FROM Pessoa WHERE id_pessoa = ?";
        return jdbcTemplate.update(sql, id);
    }

    // Classe auxiliar para mapear o resultado do SELECT para um objeto Pessoa
    private static class PessoaRowMapper implements RowMapper<Pessoa> {
        @Override
        public Pessoa mapRow(ResultSet rs, int rowNum) throws SQLException {
            Pessoa pessoa = new Pessoa();
            pessoa.setId_pessoa(rs.getLong("id_pessoa"));
            pessoa.setNome(rs.getString("nome"));
            pessoa.setRua(rs.getString("rua"));
            pessoa.setNumero(rs.getString("numero"));
            pessoa.setBairro(rs.getString("bairro"));
            pessoa.setCidade(rs.getString("cidade"));
            return pessoa;
        }
    }
}