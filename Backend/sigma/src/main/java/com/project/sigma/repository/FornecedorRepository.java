package com.project.sigma.repository;

import com.project.sigma.model.Fornecedor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class FornecedorRepository implements BaseRepository<Fornecedor, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO Fornecedor (id_pessoa, nome_fantasia, razao_social, cnpj, email, telefone, " +
            "rua, numero, bairro, cidade, estado, cep, contato_principal, condicoes_pagamento, " +
            "prazo_entrega_dias, avaliacao, status, data_cadastro) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE_SQL =
            "UPDATE Fornecedor SET id_pessoa = ?, nome_fantasia = ?, razao_social = ?, cnpj = ?, " +
            "email = ?, telefone = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, " +
            "cep = ?, contato_principal = ?, condicoes_pagamento = ?, prazo_entrega_dias = ?, " +
            "avaliacao = ?, status = ? WHERE id_fornecedor = ?";

    private static final String SELECT_BY_ID_SQL =
            "SELECT * FROM Fornecedor WHERE id_fornecedor = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT * FROM Fornecedor ORDER BY nome_fantasia";

    private static final String DELETE_SQL =
            "DELETE FROM Fornecedor WHERE id_fornecedor = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM Fornecedor WHERE id_fornecedor = ?";

    private static final String SELECT_BY_CNPJ_SQL =
            "SELECT * FROM Fornecedor WHERE cnpj = ?";

    private static final String SELECT_BY_STATUS_SQL =
            "SELECT * FROM Fornecedor WHERE status = ? ORDER BY nome_fantasia";

    private static final String SEARCH_SQL =
            "SELECT * FROM Fornecedor WHERE " +
            "(nome_fantasia LIKE ? OR razao_social LIKE ? OR cnpj LIKE ?) " +
            "ORDER BY nome_fantasia";

    private static final String COUNT_PRODUTOS_SQL =
            "SELECT COUNT(DISTINCT id_produto) FROM Produto WHERE id_fornecedor = ?";

    private static final String SUM_COMPRAS_SQL =
            "SELECT COALESCE(SUM(quantidade_recebida * valor_de_compra), 0) " +
            "FROM Fornece WHERE id_fornecedor = ?";

    @Override
    public Fornecedor save(Fornecedor fornecedor) {
        if (fornecedor.getId_fornecedor() != null && existsById(fornecedor.getId_fornecedor())) {
            return update(fornecedor);
        } else {
            return insert(fornecedor);
        }
    }

    private Fornecedor insert(Fornecedor fornecedor) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            int idx = 1;
            ps.setObject(idx++, fornecedor.getId_pessoa());
            ps.setString(idx++, fornecedor.getNome_fantasia());
            ps.setString(idx++, fornecedor.getRazao_social());
            ps.setString(idx++, fornecedor.getCnpj());
            ps.setString(idx++, fornecedor.getEmail());
            ps.setString(idx++, fornecedor.getTelefone());
            ps.setString(idx++, fornecedor.getRua());
            ps.setString(idx++, fornecedor.getNumero());
            ps.setString(idx++, fornecedor.getBairro());
            ps.setString(idx++, fornecedor.getCidade());
            ps.setString(idx++, fornecedor.getEstado());
            ps.setString(idx++, fornecedor.getCep());
            ps.setString(idx++, fornecedor.getContato_principal());
            ps.setString(idx++, fornecedor.getCondicoes_pagamento());
            ps.setObject(idx++, fornecedor.getPrazo_entrega_dias());
            ps.setBigDecimal(idx++, fornecedor.getAvaliacao());
            ps.setString(idx++, fornecedor.getStatus().name());
            ps.setTimestamp(idx++, fornecedor.getData_cadastro() != null ? 
                Timestamp.valueOf(fornecedor.getData_cadastro()) : null);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            fornecedor.setId_fornecedor(key.longValue());
        }
        
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
                fornecedor.getRua(),
                fornecedor.getNumero(),
                fornecedor.getBairro(),
                fornecedor.getCidade(),
                fornecedor.getEstado(),
                fornecedor.getCep(),
                fornecedor.getContato_principal(),
                fornecedor.getCondicoes_pagamento(),
                fornecedor.getPrazo_entrega_dias(),
                fornecedor.getAvaliacao(),
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

    public Optional<Fornecedor> findByCnpj(String cnpj) {
        try {
            Fornecedor fornecedor = jdbcTemplate.queryForObject(SELECT_BY_CNPJ_SQL, fornecedorRowMapper(), cnpj);
            return Optional.ofNullable(fornecedor);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Fornecedor> findByStatus(Fornecedor.StatusFornecedor status) {
        return jdbcTemplate.query(SELECT_BY_STATUS_SQL, fornecedorRowMapper(), status.name());
    }

    public List<Fornecedor> search(String searchTerm) {
        String search = "%" + searchTerm + "%";
        return jdbcTemplate.query(SEARCH_SQL, fornecedorRowMapper(), search, search, search);
    }

    public Integer countProdutos(Long idFornecedor) {
        return jdbcTemplate.queryForObject(COUNT_PRODUTOS_SQL, Integer.class, idFornecedor);
    }

    public BigDecimal sumCompras(Long idFornecedor) {
        return jdbcTemplate.queryForObject(SUM_COMPRAS_SQL, BigDecimal.class, idFornecedor);
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
            fornecedor.setRua(rs.getString("rua"));
            fornecedor.setNumero(rs.getString("numero"));
            fornecedor.setBairro(rs.getString("bairro"));
            fornecedor.setCidade(rs.getString("cidade"));
            fornecedor.setEstado(rs.getString("estado"));
            fornecedor.setCep(rs.getString("cep"));
            fornecedor.setContato_principal(rs.getString("contato_principal"));
            fornecedor.setCondicoes_pagamento(rs.getString("condicoes_pagamento"));
            fornecedor.setPrazo_entrega_dias(rs.getObject("prazo_entrega_dias", Integer.class));
            fornecedor.setAvaliacao(rs.getBigDecimal("avaliacao"));
            fornecedor.setStatus(Fornecedor.StatusFornecedor.valueOf(rs.getString("status")));
            
            Timestamp dataCadastro = rs.getTimestamp("data_cadastro");
            if (dataCadastro != null) {
                fornecedor.setData_cadastro(dataCadastro.toLocalDateTime());
            }
            
            return fornecedor;
        };
    }
}
