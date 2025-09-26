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
        produto.setId(rs.getLong("id_produto"));
        produto.setNome(rs.getString("nome"));
        produto.setMarca(rs.getString("marca"));
        produto.setQuantEmEstoque(rs.getInt("quant_em_estoque"));
        produto.setValorUnitario(rs.getBigDecimal("valor_unitario"));

        // Verifica se a data de validade não é nula antes de a obter

        if (rs.getDate("data_validade") != null) {
            produto.setDataValidade(rs.getDate("data_validade").toLocalDate());
        }
        produto.setIdCategoria(rs.getInt("id_categoria"));
        return produto;
    };

    /**
     * Busca todos os produtos cadastrados no banco de dados.
     * @return Uma lista de objetos Produto.
     */
    public List<Produto> findAll() {
        // SQL explícito para selecionar todos os produtos
        String sql = "SELECT id_produto, nome, marca, quant_em_estoque, valor_unitario, data_validade, id_categoria FROM Produto";
        // O jdbcTemplate executa a consulta e usa o nosso rowMapper para transformar cada linha em um objeto Produto
        return jdbcTemplate.query(sql, produtoRowMapper);
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
     * A regra de negócio considera "estoque baixo" como 15 unidades ou menos.
     * @return Uma lista de objetos Produto que precisam de atenção.
     */
    public List<Produto> findProdutosComEstoqueBaixo() {
        String sql = """
            SELECT
                id_produto, nome, marca, quant_em_estoque, valor_unitario, data_validade, id_categoria
            FROM
                Produto
            WHERE
                quant_em_estoque <= 15
            ORDER BY
                quant_em_estoque ASC
        """;

        // Reutilizamos o nosso produtoRowMapper e não precisamos de parâmetros.
        return jdbcTemplate.query(sql, produtoRowMapper);
    }

    //Método para adição de novos produtos:
    /**
     * Salva um novo produto no banco de dados (operação de Inserção).
     * @param produto O objeto Produto a ser inserido.
     * @return O número de linhas afetadas (deve ser 1 em caso de sucesso).
     */
    public int save(Produto produto) {
        String sql = """
            INSERT INTO Produto (nome, marca, quant_em_estoque, valor_unitario, data_validade, id_categoria)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                produto.getNome(),
                produto.getMarca(),
                produto.getQuantEmEstoque(),
                produto.getValorUnitario(),
                produto.getDataValidade(),
                produto.getIdCategoria()
        );
    }

    //Método para atualização de dados em relação a um produto:
    /**
     * Atualiza um produto existente no banco de dados.
     * @param produto O objeto Produto com os dados atualizados. O ID do produto deve estar preenchido.
     * @return O número de linhas afetadas.
     */
    public int update(Produto produto) {
        String sql = """
            UPDATE Produto
            SET nome = ?, marca = ?, quant_em_estoque = ?, valor_unitario = ?, data_validade = ?, id_categoria = ?
            WHERE id_produto = ?
        """;
        return jdbcTemplate.update(sql,
                produto.getNome(),
                produto.getMarca(),
                produto.getQuantEmEstoque(),
                produto.getValorUnitario(),
                produto.getDataValidade(),
                produto.getIdCategoria(),
                produto.getId()
        );
    }

    //Método para remover um produto do banco de dados:
    /**
     * Exclui um produto do banco de dados com base no seu ID.
     * @param id O ID do produto a ser excluído.
     * @return O número de linhas afetadas.
     */
    public int deleteById(Long id) {
        String sql = "DELETE FROM Produto WHERE id_produto = ?";
        return jdbcTemplate.update(sql, id);
    }
}
