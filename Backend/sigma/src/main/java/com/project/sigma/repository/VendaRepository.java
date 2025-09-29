package com.project.sigma.repository;

import com.project.sigma.model.Venda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class VendaRepository implements BaseRepository<Venda, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO Venda (id_cliente, id_funcionario, data_venda, valor_total, desconto, valor_final, metodo_pagamento, status, observacoes) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM Venda WHERE id_venda = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM Venda ORDER BY data_venda DESC";

    private static final String UPDATE_SQL =
        "UPDATE Venda SET id_cliente = ?, id_funcionario = ?, data_venda = ?, valor_total = ?, desconto = ?, valor_final = ?, metodo_pagamento = ?, status = ?, observacoes = ? " +
        "WHERE id_venda = ?";

    private static final String DELETE_SQL =
        "DELETE FROM Venda WHERE id_venda = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM Venda WHERE id_venda = ?";

    @Override
    public Venda save(Venda venda) {
        if (venda.getId_venda() == null) {
            return insert(venda);
        } else {
            return update(venda);
        }
    }

    private Venda insert(Venda venda) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_venda"});
            ps.setObject(1, venda.getId_cliente());
            ps.setLong(2, venda.getId_funcionario());
            ps.setTimestamp(3, Timestamp.valueOf(venda.getData_venda() != null ? venda.getData_venda() : LocalDateTime.now()));
            ps.setBigDecimal(4, venda.getValor_total());
            ps.setBigDecimal(5, venda.getDesconto());
            ps.setBigDecimal(6, venda.getValor_final());
            ps.setString(7, venda.getMetodo_pagamento());
            ps.setString(8, venda.getStatus().name());
            ps.setString(9, venda.getObservacoes());
            return ps;
        }, keyHolder);

        venda.setId_venda(keyHolder.getKey().longValue());
        return venda;
    }

    private Venda update(Venda venda) {
        jdbcTemplate.update(UPDATE_SQL,
            venda.getId_cliente(),
            venda.getId_funcionario(),
            Timestamp.valueOf(venda.getData_venda()),
            venda.getValor_total(),
            venda.getDesconto(),
            venda.getValor_final(),
            venda.getMetodo_pagamento(),
            venda.getStatus().name(),
            venda.getObservacoes(),
            venda.getId_venda());
        return venda;
    }

    @Override
    public Optional<Venda> findById(Long id) {
        try {
            Venda venda = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, vendaRowMapper(), id);
            return Optional.ofNullable(venda);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Venda> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, vendaRowMapper());
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

    public List<Venda> findByCliente(Long idCliente) {
        return jdbcTemplate.query(
            "SELECT * FROM Venda WHERE id_cliente = ? ORDER BY data_venda DESC",
            vendaRowMapper(),
            idCliente);
    }

    public List<Venda> findByFuncionario(Long idFuncionario) {
        return jdbcTemplate.query(
            "SELECT * FROM Venda WHERE id_funcionario = ? ORDER BY data_venda DESC",
            vendaRowMapper(),
            idFuncionario);
    }

    public List<Venda> findByStatus(Venda.StatusVenda status) {
        return jdbcTemplate.query(
            "SELECT * FROM Venda WHERE status = ? ORDER BY data_venda DESC",
            vendaRowMapper(),
            status.name());
    }

    public List<Venda> findByPeriod(LocalDateTime inicio, LocalDateTime fim) {
        return jdbcTemplate.query(
            "SELECT * FROM Venda WHERE data_venda BETWEEN ? AND ? ORDER BY data_venda DESC",
            vendaRowMapper(),
            Timestamp.valueOf(inicio),
            Timestamp.valueOf(fim));
    }

    private RowMapper<Venda> vendaRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Venda venda = new Venda();
            venda.setId_venda(rs.getLong("id_venda"));
            venda.setId_cliente(rs.getObject("id_cliente", Long.class));
            venda.setId_funcionario(rs.getLong("id_funcionario"));

            Timestamp timestamp = rs.getTimestamp("data_venda");
            if (timestamp != null) {
                venda.setData_venda(timestamp.toLocalDateTime());
            }

            venda.setValor_total(rs.getBigDecimal("valor_total"));
            venda.setDesconto(rs.getBigDecimal("desconto"));
            venda.setValor_final(rs.getBigDecimal("valor_final"));
            venda.setMetodo_pagamento(rs.getString("metodo_pagamento"));
            venda.setStatus(Venda.StatusVenda.valueOf(rs.getString("status")));
            venda.setObservacoes(rs.getString("observacoes"));

            return venda;
        };
    }
}
