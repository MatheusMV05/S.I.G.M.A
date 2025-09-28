package com.project.sigma.repository;

import com.project.sigma.model.Telefone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class TelefoneRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Telefone save(Telefone telefone) {
        String sql = "INSERT INTO Telefone (numero, id_pessoa) VALUES (?, ?)";
        jdbcTemplate.update(sql, telefone.getNumero(), telefone.getId_pessoa());
        return telefone; // Em uma implementação real, você poderia buscar o ID gerado e retorná-lo.
    }

    public Optional<Telefone> findByNumero(String numero) {
        String sql = "SELECT * FROM Telefone WHERE numero = ?";
        try {
            Telefone telefone = jdbcTemplate.queryForObject(sql, new Object[]{numero}, (rs, rowNum) ->
                    new Telefone(
                            rs.getLong("telefone_id"),
                            rs.getString("numero"),
                            rs.getLong("id_pessoa")
                    )
            );
            return Optional.ofNullable(telefone);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
