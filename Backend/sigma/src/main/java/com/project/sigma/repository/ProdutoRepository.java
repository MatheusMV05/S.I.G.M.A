package com.project.sigma.repository;

import com.project.sigma.dto.PaginatedResponseDTO;
import com.project.sigma.dto.ProdutoResponseDTO;
import com.project.sigma.model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
public class ProdutoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String COLUNAS_PRODUTO =
        "p.id_produto, p.nome, p.marca, p.quant_em_estoque, p.valor_unitario, " +
        "p.data_validade, p.id_categoria, p.descricao, p.estoque_minimo, p.estoque_maximo, " +
        "p.preco_custo, p.status, p.codigo_barras, p.unidade, p.peso, " +
        "p.data_criacao, p.data_atualizacao, " +
        "c.id_categoria as categoria_id, c.nome as categoria_nome";

    private final RowMapper<ProdutoResponseDTO> produtoResponseMapper = (ResultSet rs, int rowNum) -> {
        ProdutoResponseDTO dto = new ProdutoResponseDTO();

        // Campos básicos
        dto.setId_produto(rs.getInt("id_produto"));
        dto.setNome(rs.getString("nome"));
        dto.setMarca(rs.getString("marca"));
        dto.setDescricao(rs.getString("descricao"));

        // Mapeamento de nomes
        dto.setEstoque(rs.getInt("quant_em_estoque"));
        dto.setPreco_venda(rs.getBigDecimal("valor_unitario"));
        dto.setEstoque_minimo(rs.getInt("estoque_minimo"));
        dto.setEstoque_maximo(rs.getInt("estoque_maximo"));

        // Novos campos
        dto.setPreco_custo(rs.getBigDecimal("preco_custo"));
        dto.setStatus(rs.getString("status"));
        dto.setCodigo_barras(rs.getString("codigo_barras"));
        dto.setUnidade(rs.getString("unidade"));
        dto.setPeso(rs.getDouble("peso"));

        // Datas
        if (rs.getDate("data_validade") != null) {
            dto.setData_validade(rs.getDate("data_validade").toLocalDate());
        }

        if (rs.getTimestamp("data_criacao") != null) {
            dto.setData_criacao(rs.getTimestamp("data_criacao").toLocalDateTime().toString());
        }

        if (rs.getTimestamp("data_atualizacao") != null) {
            dto.setData_atualizacao(rs.getTimestamp("data_atualizacao").toLocalDateTime().toString());
        }

        // Categoria aninhada
        if (rs.getInt("categoria_id") > 0) {
            ProdutoResponseDTO.CategoriaSimpleDTO categoria = new ProdutoResponseDTO.CategoriaSimpleDTO();
            categoria.setId(rs.getInt("categoria_id"));
            categoria.setNome(rs.getString("categoria_nome"));
            dto.setCategory(categoria);
        }

        return dto;
    };

    public PaginatedResponseDTO<ProdutoResponseDTO> findAllWithPagination(
        int page, int size, String search, Integer categoryId, String status) {

        System.out.println("🔍 Buscando produtos - page: " + page + ", size: " + size + ", search: " + search + ", categoryId: " + categoryId + ", status: " + status);

        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ").append(COLUNAS_PRODUTO)
           .append(" FROM Produto p ")
           .append("LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria ")
           .append("WHERE 1=1 ");

        List<Object> params = new ArrayList<>();

        // Filtros dinâmicos
        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (p.nome LIKE ? OR p.marca LIKE ? OR p.codigo_barras LIKE ?) ");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        if (categoryId != null) {
            sql.append("AND p.id_categoria = ? ");
            params.add(categoryId);
        }

        if (status != null && !status.equals("all")) {
            sql.append("AND p.status = ? ");
            params.add(status);
        }

        System.out.println("📊 SQL de contagem: " + sql.toString());

        // Contagem total
        String countSql = "SELECT COUNT(*) FROM (" + sql.toString() + ") as countQuery";
        Long total;
        try {
            total = jdbcTemplate.queryForObject(countSql, params.toArray(), Long.class);
            System.out.println("📈 Total de produtos encontrados: " + total);
        } catch (Exception e) {
            System.err.println("❌ Erro na contagem: " + e.getMessage());
            total = 0L;
        }

        // Paginação
        sql.append("ORDER BY p.nome LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);

        System.out.println("📊 SQL final: " + sql.toString());
        System.out.println("📊 Parâmetros: " + params);

        // Busca dados
        List<ProdutoResponseDTO> content;
        try {
            content = jdbcTemplate.query(sql.toString(), params.toArray(), produtoResponseMapper);
            System.out.println("✅ Produtos recuperados: " + content.size());
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar produtos: " + e.getMessage());
            e.printStackTrace();
            content = new ArrayList<>();
        }

        // Monta resposta paginada
        PaginatedResponseDTO<ProdutoResponseDTO> response = new PaginatedResponseDTO<>();
        response.setContent(content);
        response.setPage(page);
        response.setSize(size);
        response.setTotalElements(total);
        response.setTotalPages((int) Math.ceil((double) total / size));
        response.setFirst(page == 0);
        response.setLast(page >= response.getTotalPages() - 1);
        response.setNumber(page);

        System.out.println("📤 Resposta final: " + content.size() + " produtos de " + total + " total");

        return response;
    }

    public ProdutoResponseDTO findByIdComplete(Integer id) {
        String sql = "SELECT " + COLUNAS_PRODUTO +
                    " FROM Produto p " +
                    "LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria " +
                    "WHERE p.id_produto = ?";

        List<ProdutoResponseDTO> result = jdbcTemplate.query(sql, produtoResponseMapper, id);
        return result.isEmpty() ? null : result.get(0);
    }

    @Transactional
    public Produto save(Produto produto) {
        if (produto.getIdProduto() == null) {
            // Inserir - definir valores padrão
            if (produto.getDataCriacao() == null) {
                produto.setDataCriacao(LocalDateTime.now());
            }
            if (produto.getStatus() == null) {
                produto.setStatus("ATIVO");
            }
            produto.setDataAtualizacao(LocalDateTime.now());

            String sql = """
                INSERT INTO Produto (nome, marca, quant_em_estoque, valor_unitario, data_validade, 
                                   id_categoria, descricao, estoque_minimo, estoque_maximo,
                                   preco_custo, status, codigo_barras, unidade, peso, 
                                   data_criacao, data_atualizacao)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, produto.getNome());
                ps.setString(2, produto.getMarca());
                ps.setInt(3, produto.getQuantEmEstoque());
                ps.setBigDecimal(4, produto.getValorUnitario());
                ps.setDate(5, produto.getDataValidade() != null ? java.sql.Date.valueOf(produto.getDataValidade()) : null);
                ps.setInt(6, produto.getIdCategoria());
                ps.setString(7, produto.getDescricao());
                ps.setInt(8, produto.getEstoqueMinimo());

                // Tratar estoque_maximo null
                if (produto.getEstoqueMaximo() != null) {
                    ps.setInt(9, produto.getEstoqueMaximo());
                } else {
                    ps.setNull(9, java.sql.Types.INTEGER);
                }

                ps.setBigDecimal(10, produto.getPrecoCusto());
                ps.setString(11, produto.getStatus());
                ps.setString(12, produto.getCodigoBarras());
                ps.setString(13, produto.getUnidade());
                ps.setDouble(14, produto.getPeso());
                ps.setTimestamp(15, java.sql.Timestamp.valueOf(produto.getDataCriacao()));
                ps.setTimestamp(16, java.sql.Timestamp.valueOf(produto.getDataAtualizacao()));
                return ps;
            }, keyHolder);

            produto.setIdProduto(Objects.requireNonNull(keyHolder.getKey()).intValue());
        } else {
            // Atualizar
            System.out.println("=== DEBUG REPOSITORY UPDATE ===");
            System.out.println("Produto ID: " + produto.getIdProduto());
            System.out.println("valor_unitario no repository: " + produto.getValorUnitario());
            System.out.println("quant_em_estoque no repository: " + produto.getQuantEmEstoque());
            System.out.println("id_categoria no repository: " + produto.getIdCategoria());
            System.out.println("preco_custo no repository: " + produto.getPrecoCusto());
            System.out.println("status no repository: " + produto.getStatus());

            produto.setDataAtualizacao(LocalDateTime.now());

            String sql = """
                UPDATE Produto SET nome = ?, marca = ?, quant_em_estoque = ?, valor_unitario = ?, 
                                 data_validade = ?, id_categoria = ?, descricao = ?, 
                                 estoque_minimo = ?, estoque_maximo = ?, preco_custo = ?,
                                 status = ?, codigo_barras = ?, unidade = ?, peso = ?,
                                 data_atualizacao = ?
                WHERE id_produto = ?
            """;

            System.out.println("SQL a ser executado: " + sql);
            System.out.println("Parâmetros do SQL:");
            System.out.println("1. nome: " + produto.getNome());
            System.out.println("2. marca: " + produto.getMarca());
            System.out.println("3. quant_em_estoque: " + produto.getQuantEmEstoque());
            System.out.println("4. valor_unitario: " + produto.getValorUnitario());
            System.out.println("5. data_validade: " + produto.getDataValidade());
            System.out.println("6. id_categoria: " + produto.getIdCategoria());
            System.out.println("7. descricao: " + produto.getDescricao());
            System.out.println("8. estoque_minimo: " + produto.getEstoqueMinimo());
            System.out.println("9. estoque_maximo: " + produto.getEstoqueMaximo());
            System.out.println("10. preco_custo: " + produto.getPrecoCusto());
            System.out.println("11. status: " + produto.getStatus());
            System.out.println("12. codigo_barras: " + produto.getCodigoBarras());
            System.out.println("13. unidade: " + produto.getUnidade());
            System.out.println("14. peso: " + produto.getPeso());
            System.out.println("15. data_atualizacao: " + produto.getDataAtualizacao());
            System.out.println("16. id_produto (WHERE): " + produto.getIdProduto());
            System.out.println("================================");

            jdbcTemplate.update(sql,
                produto.getNome(), produto.getMarca(), produto.getQuantEmEstoque(),
                produto.getValorUnitario(), produto.getDataValidade(), produto.getIdCategoria(),
                produto.getDescricao(), produto.getEstoqueMinimo(), produto.getEstoqueMaximo(),
                produto.getPrecoCusto(), produto.getStatus(), produto.getCodigoBarras(),
                produto.getUnidade(), produto.getPeso(), produto.getDataAtualizacao(),
                produto.getIdProduto()
            );

            System.out.println("✅ UPDATE executado com sucesso!");
        }
        return produto;
    }

    @Transactional
    public void deleteById(Integer id) {
        String sql = "DELETE FROM Produto WHERE id_produto = ?";
        jdbcTemplate.update(sql, id);
    }
}