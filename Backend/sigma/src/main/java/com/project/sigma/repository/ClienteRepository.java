package com.project.sigma.repository;

import com.project.sigma.model.Cliente;
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
public class ClienteRepository implements BaseRepository<Cliente, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO Cliente (id_pessoa, tipo_pessoa, ativo, ranking, total_gasto, data_ultima_compra) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT * FROM Cliente WHERE id_pessoa = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT * FROM Cliente ORDER BY ranking DESC";

    private static final String UPDATE_SQL =
            "UPDATE Cliente SET tipo_pessoa = ?, ativo = ?, ranking = ?, total_gasto = ?, data_ultima_compra = ? " +
                    "WHERE id_pessoa = ?";

    private static final String DELETE_SQL =
            "DELETE FROM Cliente WHERE id_pessoa = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM Cliente WHERE id_pessoa = ?";

    @Override
    public Cliente save(Cliente cliente) {
        if (existsById(cliente.getId_pessoa())) {
            return update(cliente);
        } else {
            return insert(cliente);
        }
    }

    private Cliente insert(Cliente cliente) {
        jdbcTemplate.update(INSERT_SQL,
                cliente.getId_pessoa(),
                cliente.getTipo_pessoa().name(),
                cliente.getAtivo(),
                cliente.getRanking(),
                cliente.getTotal_gasto(),
                cliente.getData_ultima_compra() != null ? Date.valueOf(cliente.getData_ultima_compra()) : null);
        return cliente;
    }

    private Cliente update(Cliente cliente) {
        jdbcTemplate.update(UPDATE_SQL,
                cliente.getTipo_pessoa().name(),
                cliente.getAtivo(),
                cliente.getRanking(),
                cliente.getTotal_gasto(),
                cliente.getData_ultima_compra() != null ? Date.valueOf(cliente.getData_ultima_compra()) : null,
                cliente.getId_pessoa());
        return cliente;
    }

    @Override
    public Optional<Cliente> findById(Long id) {
        try {
            Cliente cliente = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, clienteRowMapper(), id);
            return Optional.ofNullable(cliente);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Cliente> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, clienteRowMapper());
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

    public List<Cliente> findByTipo(Cliente.TipoPessoa tipo) {
        return jdbcTemplate.query(
                "SELECT * FROM Cliente WHERE tipo_pessoa = ? ORDER BY ranking DESC",
                clienteRowMapper(),
                tipo.name());
    }

    public List<Cliente> findAtivos() {
        return jdbcTemplate.query(
                "SELECT * FROM Cliente WHERE ativo = true ORDER BY ranking DESC",
                clienteRowMapper());
    }

    public void updateTotalGasto(Long idCliente, BigDecimal totalGasto, LocalDate dataUltimaCompra) {
        jdbcTemplate.update(
                "UPDATE Cliente SET total_gasto = ?, data_ultima_compra = ? WHERE id_pessoa = ?",
                totalGasto, Date.valueOf(dataUltimaCompra), idCliente);
    }

    private RowMapper<Cliente> clienteRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Cliente cliente = new Cliente();
            cliente.setId_pessoa(rs.getLong("id_pessoa"));
            cliente.setTipo_pessoa(Cliente.TipoPessoa.valueOf(rs.getString("tipo_pessoa")));
            cliente.setAtivo(rs.getBoolean("ativo"));
            cliente.setRanking(rs.getInt("ranking"));
            cliente.setTotal_gasto(rs.getBigDecimal("total_gasto"));

            Date dataUltimaCompra = rs.getDate("data_ultima_compra");
            if (dataUltimaCompra != null) {
                cliente.setData_ultima_compra(dataUltimaCompra.toLocalDate());
            }

            return cliente;
        };
    }
}
