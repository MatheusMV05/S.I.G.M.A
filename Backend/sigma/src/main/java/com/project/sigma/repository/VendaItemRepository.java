package com.project.sigma.repository;

import com.project.sigma.model.VendaItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Repository
public class VendaItemRepository implements BaseRepository<VendaItem, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO VendaItem (id_venda, id_produto, quantidade, preco_unitario_venda, desconto_item, subtotal) " +
        "VALUES (?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM VendaItem WHERE id_venda_item = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM VendaItem";

    private static final String UPDATE_SQL =
        "UPDATE VendaItem SET id_venda = ?, id_produto = ?, quantidade = ?, preco_unitario_venda = ?, desconto_item = ?, subtotal = ? " +
        "WHERE id_venda_item = ?";

    private static final String DELETE_SQL =
        "DELETE FROM VendaItem WHERE id_venda_item = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM VendaItem WHERE id_venda_item = ?";

    @Override
    public VendaItem save(VendaItem vendaItem) {
        if (vendaItem.getId_venda_item() == null) {
            return insert(vendaItem);
        } else {
            return update(vendaItem);
        }
    }

    private VendaItem insert(VendaItem vendaItem) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_venda_item"});
            ps.setLong(1, vendaItem.getId_venda());
            ps.setLong(2, vendaItem.getId_produto());
            ps.setInt(3, vendaItem.getQuantidade());
            ps.setBigDecimal(4, vendaItem.getPreco_unitario_venda());
            ps.setBigDecimal(5, vendaItem.getDesconto_item());
            ps.setBigDecimal(6, vendaItem.getSubtotal());
            return ps;
        }, keyHolder);

        vendaItem.setId_venda_item(keyHolder.getKey().longValue());
        return vendaItem;
    }

    private VendaItem update(VendaItem vendaItem) {
        jdbcTemplate.update(UPDATE_SQL,
            vendaItem.getId_venda(),
            vendaItem.getId_produto(),
            vendaItem.getQuantidade(),
            vendaItem.getPreco_unitario_venda(),
            vendaItem.getDesconto_item(),
            vendaItem.getSubtotal(),
            vendaItem.getId_venda_item());
        return vendaItem;
    }

    @Override
    public Optional<VendaItem> findById(Long id) {
        try {
            VendaItem vendaItem = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, vendaItemRowMapper(), id);
            return Optional.ofNullable(vendaItem);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<VendaItem> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, vendaItemRowMapper());
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

    public List<VendaItem> findByVenda(Long idVenda) {
        return jdbcTemplate.query(
            "SELECT * FROM VendaItem WHERE id_venda = ?",
            vendaItemRowMapper(),
            idVenda);
    }

    public List<VendaItem> findByProduto(Long idProduto) {
        return jdbcTemplate.query(
            "SELECT * FROM VendaItem WHERE id_produto = ?",
            vendaItemRowMapper(),
            idProduto);
    }

    public void deleteByVenda(Long idVenda) {
        jdbcTemplate.update("DELETE FROM VendaItem WHERE id_venda = ?", idVenda);
    }

    private RowMapper<VendaItem> vendaItemRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            VendaItem vendaItem = new VendaItem();
            vendaItem.setId_venda_item(rs.getLong("id_venda_item"));
            vendaItem.setId_venda(rs.getLong("id_venda"));
            vendaItem.setId_produto(rs.getLong("id_produto"));
            vendaItem.setQuantidade(rs.getInt("quantidade"));
            vendaItem.setPreco_unitario_venda(rs.getBigDecimal("preco_unitario_venda"));
            vendaItem.setDesconto_item(rs.getBigDecimal("desconto_item"));
            vendaItem.setSubtotal(rs.getBigDecimal("subtotal"));
            return vendaItem;
        };
    }
}
