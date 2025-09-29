package com.project.sigma.repository;

import com.project.sigma.model.ClienteFisico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class ClienteFisicoRepository implements BaseRepository<ClienteFisico, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO ClienteFisico (id_pessoa, cpf, data_nascimento) VALUES (?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM ClienteFisico WHERE id_pessoa = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM ClienteFisico";

    private static final String UPDATE_SQL =
        "UPDATE ClienteFisico SET cpf = ?, data_nascimento = ? WHERE id_pessoa = ?";

    private static final String DELETE_SQL =
        "DELETE FROM ClienteFisico WHERE id_pessoa = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM ClienteFisico WHERE id_pessoa = ?";

    @Override
    public ClienteFisico save(ClienteFisico clienteFisico) {
        if (existsById(clienteFisico.getId_pessoa())) {
            return update(clienteFisico);
        } else {
            return insert(clienteFisico);
        }
    }

    private ClienteFisico insert(ClienteFisico clienteFisico) {
        jdbcTemplate.update(INSERT_SQL,
            clienteFisico.getId_pessoa(),
            clienteFisico.getCpf(),
            clienteFisico.getData_nascimento() != null ? Date.valueOf(clienteFisico.getData_nascimento()) : null);
        return clienteFisico;
    }

    private ClienteFisico update(ClienteFisico clienteFisico) {
        jdbcTemplate.update(UPDATE_SQL,
            clienteFisico.getCpf(),
            clienteFisico.getData_nascimento() != null ? Date.valueOf(clienteFisico.getData_nascimento()) : null,
            clienteFisico.getId_pessoa());
        return clienteFisico;
    }

    @Override
    public Optional<ClienteFisico> findById(Long id) {
        try {
            ClienteFisico clienteFisico = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, clienteFisicoRowMapper(), id);
            return Optional.ofNullable(clienteFisico);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ClienteFisico> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, clienteFisicoRowMapper());
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

    public Optional<ClienteFisico> findByCpf(String cpf) {
        try {
            ClienteFisico clienteFisico = jdbcTemplate.queryForObject(
                "SELECT * FROM ClienteFisico WHERE cpf = ?",
                clienteFisicoRowMapper(),
                cpf);
            return Optional.ofNullable(clienteFisico);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private RowMapper<ClienteFisico> clienteFisicoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            ClienteFisico clienteFisico = new ClienteFisico();
            clienteFisico.setId_pessoa(rs.getLong("id_pessoa"));
            clienteFisico.setCpf(rs.getString("cpf"));

            Date dataNascimento = rs.getDate("data_nascimento");
            if (dataNascimento != null) {
                clienteFisico.setData_nascimento(dataNascimento.toLocalDate());
            }

            return clienteFisico;
        };
    }
}
