package com.project.sigma.repository;

import com.project.sigma.model.Telefone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Repository
public class TelefoneRepository implements BaseRepository<Telefone, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO Telefone (id_pessoa, numero, tipo) VALUES (?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT * FROM Telefone WHERE id_telefone = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT * FROM Telefone";

    private static final String UPDATE_SQL =
            "UPDATE Telefone SET id_pessoa = ?, numero = ?, tipo = ? WHERE id_telefone = ?";

    private static final String DELETE_SQL =
            "DELETE FROM Telefone WHERE id_telefone = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM Telefone WHERE id_telefone = ?";

    @Override
    public Telefone save(Telefone telefone) {
        if (telefone.getId_telefone() == null) {
            return insert(telefone);
        } else {
            return update(telefone);
        }
    }

    private Telefone insert(Telefone telefone) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_telefone"});
            ps.setLong(1, telefone.getId_pessoa());
            ps.setString(2, telefone.getNumero());
            ps.setString(3, telefone.getTipo().name());
            return ps;
        }, keyHolder);

        telefone.setId_telefone(keyHolder.getKey().longValue());
        return telefone;
    }

    private Telefone update(Telefone telefone) {
        jdbcTemplate.update(UPDATE_SQL,
                telefone.getId_pessoa(),
                telefone.getNumero(),
                telefone.getTipo().name(),
                telefone.getId_telefone());
        return telefone;
    }

    @Override
    public Optional<Telefone> findById(Long id) {
        try {
            Telefone telefone = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, telefoneRowMapper(), id);
            return Optional.ofNullable(telefone);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Telefone> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, telefoneRowMapper());
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

    public List<Telefone> findByPessoa(Long idPessoa) {
        return jdbcTemplate.query(
                "SELECT * FROM Telefone WHERE id_pessoa = ?",
                telefoneRowMapper(),
                idPessoa);
    }

    public void deleteByPessoa(Long idPessoa) {
        jdbcTemplate.update("DELETE FROM Telefone WHERE id_pessoa = ?", idPessoa);
    }

    private RowMapper<Telefone> telefoneRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Telefone telefone = new Telefone();
            telefone.setId_telefone(rs.getLong("id_telefone"));
            telefone.setId_pessoa(rs.getLong("id_pessoa"));
            telefone.setNumero(rs.getString("numero"));
            telefone.setTipo(Telefone.TipoTelefone.valueOf(rs.getString("tipo")));
            return telefone;
        };
    }
}
