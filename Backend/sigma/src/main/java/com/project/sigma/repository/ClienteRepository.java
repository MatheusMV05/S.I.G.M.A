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
import java.util.ArrayList;

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

    /**
     * Constrói a cláusula WHERE dinâmica e popula a lista de parâmetros.
     * Precisamos de JOINs para pesquisar em tabelas relacionadas.
     */
    private String buildWhereClause(String searchTerm, String tipoCliente, Boolean status, List<Object> params) {
        StringBuilder whereSql = new StringBuilder(" WHERE 1=1");

        // Filtro por Tipo de Cliente
        if (tipoCliente != null && !tipoCliente.isEmpty()) {
            whereSql.append(" AND c.tipo_pessoa = ?");
            // Mapeia do frontend ("INDIVIDUAL" / "COMPANY") para o DB ("FISICA" / "JURIDICA")
            if ("INDIVIDUAL".equalsIgnoreCase(tipoCliente)) {
                params.add(Cliente.TipoPessoa.FISICA.name());
            } else if ("COMPANY".equalsIgnoreCase(tipoCliente)) {
                params.add(Cliente.TipoPessoa.JURIDICA.name());
            } else {
                // Fallback para o formato antigo (PF/PJ) se necessário
                params.add(tipoCliente);
            }
        }

        // Filtro por Status
        if (status != null) {
            whereSql.append(" AND c.ativo = ?");
            params.add(status);
        }

        // Filtro por Termo de Busca (SearchTerm)
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String likeTerm = "%" + searchTerm.toLowerCase() + "%";
            whereSql.append(" AND (");
            whereSql.append("LOWER(p.nome) LIKE ? OR ");
            whereSql.append("LOWER(p.email) LIKE ? OR ");
            whereSql.append("t.numero LIKE ? OR ");
            whereSql.append("cf.cpf LIKE ? OR ");
            whereSql.append("cj.cnpj LIKE ?");
            whereSql.append(")");

            params.add(likeTerm); // p.nome
            params.add(likeTerm); // p.email
            params.add(likeTerm); // t.numero
            params.add(likeTerm); // cf.cpf
            params.add(likeTerm); // cj.cnpj
        }

        return whereSql.toString();
    }

    public List<Cliente> findWithFiltersAndPagination(String searchTerm, String tipoCliente, Boolean status, int page, int size) {
        List<Object> params = new ArrayList<>();

        // O SELECT base precisa dos JOINs para os filtros
        String baseSql = "SELECT DISTINCT c.*, p.nome " +
                "FROM Cliente c " +
                "LEFT JOIN Pessoa p ON c.id_pessoa = p.id_pessoa " +
                "LEFT JOIN Telefone t ON c.id_pessoa = t.id_pessoa " +
                "LEFT JOIN ClienteFisico cf ON c.id_pessoa = cf.id_pessoa " +
                "LEFT JOIN ClienteJuridico cj ON c.id_pessoa = cj.id_pessoa";

        String whereSql = buildWhereClause(searchTerm, tipoCliente, status, params);

        // Ordena por nome da pessoa (Juntado de 'p')
        String orderBySql = " ORDER BY p.nome ASC";

        // Adiciona paginação
        String paginationSql = " LIMIT ? OFFSET ?";
        params.add(size);
        params.add(page * size);

        String finalSql = baseSql + whereSql + orderBySql + paginationSql;

        return jdbcTemplate.query(finalSql, clienteRowMapper(), params.toArray());
    }

    public int countWithFilters(String searchTerm, String tipoCliente, Boolean status) {
        List<Object> params = new ArrayList<>();

        // O SELECT de contagem também precisa dos JOINs para o WHERE
        String baseSql = "SELECT COUNT(DISTINCT c.id_pessoa) " +
                "FROM Cliente c " +
                "LEFT JOIN Pessoa p ON c.id_pessoa = p.id_pessoa " +
                "LEFT JOIN Telefone t ON c.id_pessoa = t.id_pessoa " +
                "LEFT JOIN ClienteFisico cf ON c.id_pessoa = cf.id_pessoa " +
                "LEFT JOIN ClienteJuridico cj ON c.id_pessoa = cj.id_pessoa";

        String whereSql = buildWhereClause(searchTerm, tipoCliente, status, params);

        String finalSql = baseSql + whereSql;

        Integer count = jdbcTemplate.queryForObject(finalSql, Integer.class, params.toArray());
        return (count != null) ? count : 0;
    }

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

    /**
     * Feature #3: Classifica cliente VIP usando função SQL
     */
    public String classificarCliente(Long idCliente) {
        String sql = """
            SELECT fn_classificar_cliente(
                (SELECT COALESCE(total_gasto, 0) FROM Cliente WHERE id_pessoa = ?)
            ) AS classificacao
            """;
        return jdbcTemplate.queryForObject(sql, String.class, idCliente);
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
