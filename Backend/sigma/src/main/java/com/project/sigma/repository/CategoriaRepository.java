package com.project.sigma.repository;

import com.project.sigma.model.Categoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class CategoriaRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CategoriaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final class CategoriaRowMapper implements RowMapper<Categoria> {
        @Override
        public Categoria mapRow(ResultSet rs, int rowNum) throws SQLException {
            Categoria categoria = new Categoria();
            categoria.setId_categoria(rs.getInt("id_categoria"));  // INT em vez de Long
            categoria.setNome(rs.getString("nome"));
            categoria.setDescricao(rs.getString("descricao"));
            categoria.setAtivo(rs.getBoolean("ativo"));
            categoria.setData_criacao(rs.getTimestamp("data_criacao").toLocalDateTime());
            categoria.setData_atualizacao(rs.getTimestamp("data_atualizacao").toLocalDateTime());
            return categoria;
        }
    }

    // BUSCAR TODAS as categorias
    public List<Categoria> findAll() {
        String sql = "SELECT * FROM Categoria WHERE ativo = TRUE ORDER BY nome ASC";
        System.out.println("🔍 Repository: Executando query: " + sql);
        try {
            List<Categoria> result = jdbcTemplate.query(sql, new CategoriaRowMapper());
            System.out.println("✅ Repository: " + result.size() + " categorias encontradas");
            if (!result.isEmpty()) {
                System.out.println("📋 Primeira categoria: " + result.get(0).getNome() + " (ID: " + result.get(0).getId_categoria() + ")");
            }
            return result;
        } catch (Exception e) {
            System.out.println("❌ Repository: Erro na query - " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // BUSCAR UMA categoria por ID
    public Optional<Categoria> findById(Integer id) {  // Integer em vez de Long
        String sql = "SELECT * FROM categoria WHERE id_categoria = ?";
        try {
            Categoria categoria = jdbcTemplate.queryForObject(sql, new Object[]{id}, new CategoriaRowMapper());
            return Optional.ofNullable(categoria);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // BUSCAR categoria por nome (para validar duplicatas)
    public Optional<Categoria> findByNomeIgnoreCase(String nome) {
        String sql = "SELECT * FROM categoria WHERE LOWER(nome) = LOWER(?)";
        try {
            Categoria categoria = jdbcTemplate.queryForObject(sql, new Object[]{nome}, new CategoriaRowMapper());
            return Optional.ofNullable(categoria);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // CRIAR nova categoria
    public Categoria save(Categoria categoria) {
        if (categoria.getId_categoria() == null) {
            return inserir(categoria);
        } else {
            return atualizar(categoria);
        }
    }

    private Categoria inserir(Categoria categoria) {
        String sql = "INSERT INTO categoria (nome, descricao, ativo, data_criacao, data_atualizacao) VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime agora = LocalDateTime.now();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, categoria.getNome());
            ps.setString(2, categoria.getDescricao());
            ps.setBoolean(3, categoria.getAtivo() != null ? categoria.getAtivo() : true);
            ps.setObject(4, agora);
            ps.setObject(5, agora);
            return ps;
        }, keyHolder);

        categoria.setId_categoria(keyHolder.getKey().intValue());  // intValue() em vez de longValue()
        categoria.setData_criacao(agora);
        categoria.setData_atualizacao(agora);

        return categoria;
    }

    private Categoria atualizar(Categoria categoria) {
        String sql = "UPDATE categoria SET nome = ?, descricao = ?, ativo = ?, data_atualizacao = ? WHERE id_categoria = ?";

        LocalDateTime agora = LocalDateTime.now();

        jdbcTemplate.update(sql,
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getAtivo(),
                agora,
                categoria.getId_categoria()
        );

        categoria.setData_atualizacao(agora);
        return categoria;
    }

    // DELETAR categoria
    public void delete(Categoria categoria) {
        String sql = "DELETE FROM categoria WHERE id_categoria = ?";
        jdbcTemplate.update(sql, categoria.getId_categoria());
    }

    // VERIFICAR se categoria tem produtos vinculados
    public boolean temProdutosVinculados(Integer idCategoria) {  // Integer em vez de Long
        String sql = "SELECT COUNT(*) FROM produto WHERE id_categoria = ?";  // Corrigir nome do campo
        try {
            Integer count = jdbcTemplate.queryForObject(sql, new Object[]{idCategoria}, Integer.class);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    // ATUALIZAR produtos órfãos (quando categoria é excluída)
    public void removerCategoriaDosProdutos(Integer idCategoria) {  // Integer em vez de Long
        String sql = "UPDATE produto SET id_categoria = NULL WHERE id_categoria = ?";  // Corrigir nome do campo
        jdbcTemplate.update(sql, idCategoria);
    }

    // BUSCAR categorias por status
    public List<Categoria> findByAtivo(Boolean ativo) {
        String sql = "SELECT * FROM categoria WHERE ativo = ? ORDER BY nome ASC";
        return jdbcTemplate.query(sql, new Object[]{ativo}, new CategoriaRowMapper());
    }

    // BUSCAR categorias com filtro de nome
    public List<Categoria> findByNomeContainingIgnoreCaseAndAtivo(String nome, Boolean ativo) {
        String sql = "SELECT * FROM categoria WHERE LOWER(nome) LIKE LOWER(?) AND ativo = ? ORDER BY nome ASC";
        String nomePattern = "%" + nome + "%";
        return jdbcTemplate.query(sql, new Object[]{nomePattern, ativo}, new CategoriaRowMapper());
    }
}
