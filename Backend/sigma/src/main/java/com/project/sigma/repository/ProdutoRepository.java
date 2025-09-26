package com.project.sigma.repository;

import com.project.sigma.model.Produto;
import com.project.sigma.dto.EstoqueCategoriaDTO;
import com.project.sigma.dto.EstoqueMarcaDTO;
import com.project.sigma.dto.ValorEstoqueCategoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;


@Repository
public class ProdutoRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProdutoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //Métodos de visualização de dados com sql:

    private final RowMapper<Produto> produtoRowMapper = (ResultSet rs, int rowNum) -> {
        Produto produto = new Produto();
        produto.setIdProduto(rs.getInt("id_produto"));
        produto.setNome(rs.getString("nome"));
        produto.setMarca(rs.getString("marca"));
        produto.setQuantEmEstoque(rs.getInt("quant_em_estoque"));
        produto.setValorUnitario(rs.getBigDecimal("valor_unitario"));

        // Verifica se a data de validade não é nula antes de a obter

        if (rs.getDate("data_validade") != null) {
            produto.setDataValidade(rs.getDate("data_validade").toLocalDate());
        }
        produto.setIdCategoria(rs.getInt("id_categoria"));
        //Novos campos:
        produto.setDescricao(rs.getString("descricao"));
        produto.setEstoqueMinimo(rs.getInt("estoque_minimo"));
        produto.setEstoqueMaximo(rs.getInt("estoque_maximo"));

        return produto;
    };

    private static final String COLUNAS_PRODUTO = "id_produto, nome, marca, quant_em_estoque, valor_unitario, data_validade, id_categoria, descricao, estoque_minimo, estoque_maximo";


    /**
     * Busca todos os produtos cadastrados no banco de dados.
     * @return Uma lista de objetos Produto.
     */
    public List<Produto> findAll() {
        // SQL explícito para selecionar todos os produtos
        String sql = "SELECT " + COLUNAS_PRODUTO + " FROM Produto";        // O jdbcTemplate executa a consulta e usa o nosso rowMapper para transformar cada linha em um objeto Produto
        return jdbcTemplate.query(sql, produtoRowMapper);
    }

    //Método para retornar um unico produto pelo id:
    public Optional<Produto> findById(Integer id) {
        String sql = "SELECT " + COLUNAS_PRODUTO + " FROM Produto WHERE id_produto = ?";
        try {
            Produto produto = jdbcTemplate.queryForObject(sql, new Object[]{id}, produtoRowMapper);
            return Optional.ofNullable(produto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Busca a soma total do estoque de produtos, agrupada por categoria.
     * Esta consulta utiliza um JOIN com a tabela Categoria.
     * @return Uma lista de DTOs contendo o nome da categoria e o total em estoque.
     */
    public List<EstoqueCategoriaDTO> findEstoqueAgrupadoPorCategoria() {
        String sql = """
            SELECT
                c.nome AS categoria,
                SUM(p.quant_em_estoque) AS total_estoque
            FROM
                Produto p
            JOIN
                Categoria c ON p.id_categoria = c.id_categoria
            GROUP BY
                c.nome
            ORDER BY
                total_estoque DESC
        """;

        // Para este resultado customizado, criamos um RowMapper específico dentro do método.
        RowMapper<EstoqueCategoriaDTO> rowMapper = (rs, rowNum) -> {
            EstoqueCategoriaDTO dto = new EstoqueCategoriaDTO();
            dto.setCategoria(rs.getString("categoria"));
            dto.setTotalEstoque(rs.getBigDecimal("total_estoque"));
            return dto;
        };

        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Busca produtos cuja data de validade está nos próximos 7 dias.
     * Esta é uma regra de negócio fixa para o relatório de validade.
     * @return Uma lista de objetos Produto que estão próximos de vencer.
     */
    public List<Produto> findProdutosProximosVencimento() {
        // SQL explícito para selecionar produtos com data_validade
        // entre a data de hoje (CURDATE()) e a data de hoje + 7 dias.
        String sql = """
            SELECT
                id_produto, nome, marca, quant_em_estoque, valor_unitario, data_validade, id_categoria
            FROM
                Produto
            WHERE
                data_validade IS NOT NULL
                AND data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
            ORDER BY
                data_validade ASC
        """;

        // Como o número de dias é fixo, não precisamos mais de passar parâmetros.
        // Reutilizamos o mesmo rowMapper, pois o resultado é uma lista de Produtos.
        return jdbcTemplate.query(sql, produtoRowMapper);
    }

    /**
     * Busca a soma total do estoque de produtos, agrupada por marca.
     * Filtra as marcas que são nulas ou vazias para um relatório mais limpo.
     * @return Uma lista de DTOs contendo o nome da marca e o total em estoque.
     */
    public List<EstoqueMarcaDTO> findEstoqueAgrupadoPorMarca() {
        String sql = """
            SELECT
                marca,
                SUM(quant_em_estoque) AS total_estoque
            FROM
                Produto
            WHERE
                marca IS NOT NULL AND marca <> ''
            GROUP BY
                marca
            ORDER BY
                total_estoque DESC
        """;

        RowMapper<EstoqueMarcaDTO> rowMapper = (rs, rowNum) -> {
            EstoqueMarcaDTO dto = new EstoqueMarcaDTO();
            dto.setMarca(rs.getString("marca"));
            dto.setTotalEstoque(rs.getBigDecimal("total_estoque"));
            return dto;
        };

        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Calcula o valor monetário total de todo o estoque.
     * A consulta soma o resultado de (quantidade * valor_unitario) para todos os produtos.
     * @return Um BigDecimal representando o valor total do estoque.
     */
    public BigDecimal findValorTotalEstoque() {
        String sql = "SELECT SUM(quant_em_estoque * valor_unitario) FROM Produto";

        // Usamos queryForObject quando esperamos um único valor como resultado.
        // Se a tabela estiver vazia, o SUM pode retornar NULL, então tratamos esse caso.
        BigDecimal valorTotal = jdbcTemplate.queryForObject(sql, BigDecimal.class);
        return valorTotal == null ? BigDecimal.ZERO : valorTotal;
    }

    /**
     * Calcula o valor monetário do estoque, agrupado por categoria.
     * @return Uma lista de DTOs contendo o nome da categoria e o seu valor de estoque total.
     */
    public List<ValorEstoqueCategoriaDTO> findValorEstoqueAgrupadoPorCategoria() {
        String sql = """
            SELECT
                c.nome AS categoria,
                SUM(p.quant_em_estoque * p.valor_unitario) AS valor_total
            FROM
                Produto p
            JOIN
                Categoria c ON p.id_categoria = c.id_categoria
            GROUP BY
                c.nome
            ORDER BY
                valor_total DESC
        """;

        RowMapper<ValorEstoqueCategoriaDTO> rowMapper = (rs, rowNum) -> {
            ValorEstoqueCategoriaDTO dto = new ValorEstoqueCategoriaDTO();
            dto.setCategoria(rs.getString("categoria"));
            dto.setValorTotal(rs.getBigDecimal("valor_total"));
            return dto;
        };

        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Busca produtos que estão com estoque baixo ou esgotado.
     * A regra de negócio considera "estoque baixo". Este estoque baixo depende do valor MINIMO!
     * @return Uma lista de objetos Produto que precisam de atenção.
     */
    public List<Produto> findProdutosComEstoqueBaixo() {
        String sql = "SELECT " + COLUNAS_PRODUTO + """
             FROM Produto
             WHERE quant_em_estoque <= estoque_minimo
             ORDER BY quant_em_estoque ASC
        """;
        return jdbcTemplate.query(sql, produtoRowMapper);
    }

    //Método para adição de novos produtos ou alteração (update):
    public Produto save(Produto produto) {
        if (produto.getIdProduto() == null) {
            // Inserir novo produto
            String sql = """
                INSERT INTO Produto (nome, marca, quant_em_estoque, valor_unitario, data_validade, id_categoria, descricao, estoque_minimo, estoque_maximo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
            jdbcTemplate.update(sql, produto.getNome(), produto.getMarca(), produto.getQuantEmEstoque(),
                    produto.getValorUnitario(), produto.getDataValidade(), produto.getIdCategoria(),
                    produto.getDescricao(), produto.getEstoqueMinimo(), produto.getEstoqueMaximo());
        } else {
            // Atualizar produto existente
            String sql = """
                UPDATE Produto
                SET nome = ?, marca = ?, quant_em_estoque = ?, valor_unitario = ?, data_validade = ?, id_categoria = ?, descricao = ?, estoque_minimo = ?, estoque_maximo = ?
                WHERE id_produto = ?
            """;
            jdbcTemplate.update(sql, produto.getNome(), produto.getMarca(), produto.getQuantEmEstoque(),
                    produto.getValorUnitario(), produto.getDataValidade(), produto.getIdCategoria(),
                    produto.getDescricao(), produto.getEstoqueMinimo(), produto.getEstoqueMaximo(),
                    produto.getIdProduto()); // Erro do getId() corrigido aqui!
        }
        return produto;
    }

    //Método para remover um produto do banco de dados:
    /**
     * Exclui um produto do banco de dados com base no seu ID.
     * @param id O ID do produto a ser excluído.
     * @return O número de linhas afetadas.
     */
    public void deleteById(Integer id) { // Alterado para Integer para manter padrão
        String sql = "DELETE FROM Produto WHERE id_produto = ?";
        jdbcTemplate.update(sql, id);
    }
}
