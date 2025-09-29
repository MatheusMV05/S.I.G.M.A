package com.project.sigma.repository;

import com.project.sigma.model.ClienteJuridico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Repository
public class ClienteJuridicaRepository implements BaseRepository<ClienteJuridico, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO ClienteJuridico (id_pessoa, cnpj, razao_social, inscricao_estadual) VALUES (?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM ClienteJuridico WHERE id_pessoa = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM ClienteJuridico";

    private static final String UPDATE_SQL =
        "UPDATE ClienteJuridico SET cnpj = ?, razao_social = ?, inscricao_estadual = ? WHERE id_pessoa = ?";

    private static final String DELETE_SQL =
        "DELETE FROM ClienteJuridico WHERE id_pessoa = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM ClienteJuridico WHERE id_pessoa = ?";

    @Override
    public ClienteJuridico save(ClienteJuridico clienteJuridico) {
        if (existsById(clienteJuridico.getId_pessoa())) {
            return update(clienteJuridico);
        } else {
            return insert(clienteJuridico);
        }
    }

    private ClienteJuridico insert(ClienteJuridico clienteJuridico) {
        jdbcTemplate.update(INSERT_SQL,
            clienteJuridico.getId_pessoa(),
            clienteJuridico.getCnpj(),
            clienteJuridico.getRazao_social(),
            clienteJuridico.getInscricao_estadual());
        return clienteJuridico;
    }

    private ClienteJuridico update(ClienteJuridico clienteJuridico) {
        jdbcTemplate.update(UPDATE_SQL,
            clienteJuridico.getCnpj(),
            clienteJuridico.getRazao_social(),
            clienteJuridico.getInscricao_estadual(),
            clienteJuridico.getId_pessoa());
        return clienteJuridico;
    }

    @Override
    public Optional<ClienteJuridico> findById(Long id) {
        try {
            ClienteJuridico clienteJuridico = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, clienteJuridicoRowMapper(), id);
            return Optional.ofNullable(clienteJuridico);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ClienteJuridico> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, clienteJuridicoRowMapper());
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

    public Optional<ClienteJuridico> findByCnpj(String cnpj) {
        try {
            ClienteJuridico clienteJuridico = jdbcTemplate.queryForObject(
                "SELECT * FROM ClienteJuridico WHERE cnpj = ?",
                clienteJuridicoRowMapper(),
                cnpj);
            return Optional.ofNullable(clienteJuridico);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private RowMapper<ClienteJuridico> clienteJuridicoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            ClienteJuridico clienteJuridico = new ClienteJuridico();
            clienteJuridico.setId_pessoa(rs.getLong("id_pessoa"));
            clienteJuridico.setCnpj(rs.getString("cnpj"));
            clienteJuridico.setRazao_social(rs.getString("razao_social"));
            clienteJuridico.setInscricao_estadual(rs.getString("inscricao_estadual"));
            return clienteJuridico;
        };
    }
}
