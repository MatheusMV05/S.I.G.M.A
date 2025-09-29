package com.project.sigma.repository;

import com.project.sigma.model.Fornecedor;
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
public class FornecedorRepository implements BaseRepository<Fornecedor, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO Fornecedor (id_pessoa, nome_fantasia, razao_social, cnpj, email, telefone, endereco_completo, contato_principal, status) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM Fornecedor WHERE id_fornecedor = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM Fornecedor ORDER BY nome_fantasia";

    private static final String UPDATE_SQL =
        "UPDATE Fornecedor SET id_pessoa = ?, nome_fantasia = ?, razao_social = ?, cnpj = ?, email = ?, telefone = ?, endereco_completo = ?, contato_principal = ?, status = ? " +
        "WHERE id_fornecedor = ?";

    private static final String DELETE_SQL =
        "DELETE FROM Fornecedor WHERE id_fornecedor = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM Fornecedor WHERE id_fornecedor = ?";

    @Override
    public Fornecedor save(Fornecedor fornecedor) {
        if (fornecedor.getId_fornecedor() == null) {
            return insert(fornecedor);
        } else {
            return update(fornecedor);
        }
    }

    private Fornecedor insert(Fornecedor fornecedor) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_fornecedor"});
            ps.setObject(1, fornecedor.getId_pessoa());
            ps.setString(2, fornecedor.getNome_fantasia());
            ps.setString(3, fornecedor.getRazao_social());
            ps.setString(4, fornecedor.getCnpj());
            ps.setString(5, fornecedor.getEmail());
            ps.setString(6, fornecedor.getTelefone());
            ps.setString(7, fornecedor.getEndereco_completo());
            ps.setString(8, fornecedor.getContato_principal());
            ps.setString(9, fornecedor.getStatus().name());
            return ps;
        }, keyHolder);

        fornecedor.setId_fornecedor(keyHolder.getKey().longValue());
        return fornecedor;
    }

    private Fornecedor update(Fornecedor fornecedor) {
        jdbcTemplate.update(UPDATE_SQL,
            fornecedor.getId_pessoa(),
            fornecedor.getNome_fantasia(),
            fornecedor.getRazao_social(),
            fornecedor.getCnpj(),
            fornecedor.getEmail(),
            fornecedor.getTelefone(),
            fornecedor.getEndereco_completo(),
            fornecedor.getContato_principal(),
            fornecedor.getStatus().name(),
            fornecedor.getId_fornecedor());
        return fornecedor;
    }

    @Override
    public Optional<Fornecedor> findById(Long id) {
        try {
            Fornecedor fornecedor = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, fornecedorRowMapper(), id);
            return Optional.ofNullable(fornecedor);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Fornecedor> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, fornecedorRowMapper());
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

    public List<Fornecedor> findByStatus(Fornecedor.StatusFornecedor status) {
        return jdbcTemplate.query(
            "SELECT * FROM Fornecedor WHERE status = ? ORDER BY nome_fantasia",
            fornecedorRowMapper(),
            status.name());
    }

    public Optional<Fornecedor> findByCnpj(String cnpj) {
        try {
            Fornecedor fornecedor = jdbcTemplate.queryForObject(
                "SELECT * FROM Fornecedor WHERE cnpj = ?",
                fornecedorRowMapper(),
                cnpj);
            return Optional.ofNullable(fornecedor);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private RowMapper<Fornecedor> fornecedorRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Fornecedor fornecedor = new Fornecedor();
            fornecedor.setId_fornecedor(rs.getLong("id_fornecedor"));
            fornecedor.setId_pessoa(rs.getObject("id_pessoa", Long.class));
            fornecedor.setNome_fantasia(rs.getString("nome_fantasia"));
            fornecedor.setRazao_social(rs.getString("razao_social"));
            fornecedor.setCnpj(rs.getString("cnpj"));
            fornecedor.setEmail(rs.getString("email"));
            fornecedor.setTelefone(rs.getString("telefone"));
            fornecedor.setEndereco_completo(rs.getString("endereco_completo"));
            fornecedor.setContato_principal(rs.getString("contato_principal"));
            fornecedor.setStatus(Fornecedor.StatusFornecedor.valueOf(rs.getString("status")));
            return fornecedor;
        };
    }
}
