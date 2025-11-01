package com.project.sigma.service;

import com.project.sigma.dto.ClienteVIPDTO;
import com.project.sigma.dto.ProdutoAcimaMediaDTO;
import com.project.sigma.dto.ProdutoNuncaVendidoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class RelatorioAvancadoService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ================================================================
    // ANTI JOIN: Produtos que NUNCA foram vendidos
    // ================================================================
    public List<ProdutoNuncaVendidoDTO> buscarProdutosNuncaVendidos(Integer limit) {
        String sql = """
            SELECT 
                p.id_produto,
                p.nome AS produto_nome,
                p.marca,
                p.preco_venda,
                p.estoque,
                c.nome AS categoria_nome,
                f.nome_fantasia AS fornecedor_nome,
                (p.preco_custo * p.estoque) AS valor_investido,
                (p.preco_venda * p.estoque) AS valor_potencial_venda,
                DATEDIFF(CURDATE(), p.data_cadastro) AS dias_sem_venda
            FROM Produto p
            LEFT JOIN VendaItem vi ON p.id_produto = vi.id_produto
            LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor
            WHERE vi.id_venda_item IS NULL
              AND p.status = 'ATIVO'
            ORDER BY valor_investido DESC, dias_sem_venda DESC
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, this::mapProdutoNuncaVendido, limit);
    }

    private ProdutoNuncaVendidoDTO mapProdutoNuncaVendido(ResultSet rs, int rowNum) throws SQLException {
        ProdutoNuncaVendidoDTO dto = new ProdutoNuncaVendidoDTO();
        dto.setIdProduto(rs.getInt("id_produto"));
        dto.setProdutoNome(rs.getString("produto_nome"));
        dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
        dto.setQuantidadeEstoque(rs.getInt("estoque"));
        dto.setCategoriaNome(rs.getString("categoria_nome"));
        dto.setValorEstoqueParado(rs.getBigDecimal("valor_potencial_venda"));
        return dto;
    }

    // ================================================================
    // SUBCONSULTA: Produtos com Preço Acima da Média da Categoria
    // ================================================================
    public List<ProdutoAcimaMediaDTO> buscarProdutosAcimaMedia(Integer limit) {
        String sql = """
            SELECT 
                p.id_produto,
                p.nome AS produto_nome,
                p.marca,
                p.preco_venda,
                p.preco_custo,
                p.margem_lucro,
                c.nome AS categoria_nome,
                (SELECT ROUND(AVG(p2.preco_venda), 2) 
                 FROM Produto p2 
                 WHERE p2.id_categoria = p.id_categoria 
                   AND p2.status = 'ATIVO') AS preco_medio_categoria,
                ROUND(p.preco_venda - (SELECT AVG(p2.preco_venda) 
                                       FROM Produto p2 
                                       WHERE p2.id_categoria = p.id_categoria 
                                         AND p2.status = 'ATIVO'), 2) AS diferenca_media,
                ROUND(((p.preco_venda / (SELECT AVG(p2.preco_venda) 
                                         FROM Produto p2 
                                         WHERE p2.id_categoria = p.id_categoria 
                                           AND p2.status = 'ATIVO')) - 1) * 100, 2) AS percentual_acima_media
            FROM Produto p
            INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
            WHERE p.preco_venda > (SELECT AVG(p2.preco_venda) 
                                   FROM Produto p2 
                                   WHERE p2.id_categoria = p.id_categoria 
                                     AND p2.status = 'ATIVO')
              AND p.status = 'ATIVO'
            ORDER BY percentual_acima_media DESC
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, this::mapProdutoAcimaMedia, limit);
    }

    private ProdutoAcimaMediaDTO mapProdutoAcimaMedia(ResultSet rs, int rowNum) throws SQLException {
        ProdutoAcimaMediaDTO dto = new ProdutoAcimaMediaDTO();
        dto.setIdProduto(rs.getInt("id_produto"));
        dto.setProdutoNome(rs.getString("produto_nome"));
        dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
        dto.setCategoriaNome(rs.getString("categoria_nome"));
        dto.setDiferencaMedia(rs.getBigDecimal("diferenca_media"));
        dto.setPercentualAcimaMedia(rs.getBigDecimal("percentual_acima_media"));
        return dto;
    }

    // ================================================================
    // SUBCONSULTA: Clientes VIP (Gasto Acima da Média)
    // ================================================================
    public List<ClienteVIPDTO> buscarClientesVIP(Integer limit) {
        String sql = """
            SELECT 
                c.id_pessoa,
                p.nome AS cliente_nome,
                p.email AS cliente_email,
                c.tipo_pessoa,
                c.ranking,
                c.total_gasto,
                c.data_ultima_compra,
                COUNT(v.id_venda) AS total_compras,
                ROUND(c.total_gasto / NULLIF(COUNT(v.id_venda), 0), 2) AS ticket_medio,
                (SELECT ROUND(AVG(total_gasto), 2) 
                 FROM Cliente 
                 WHERE ativo = TRUE) AS media_gasto_geral,
                ROUND(c.total_gasto - (SELECT AVG(total_gasto) 
                                       FROM Cliente 
                                       WHERE ativo = TRUE), 2) AS diferenca_media,
                ROUND(((c.total_gasto / (SELECT AVG(total_gasto) 
                                         FROM Cliente 
                                         WHERE ativo = TRUE)) - 1) * 100, 2) AS percentual_acima_media
            FROM Cliente c
            INNER JOIN Pessoa p ON c.id_pessoa = p.id_pessoa
            LEFT JOIN Venda v ON c.id_pessoa = v.id_cliente AND v.status = 'CONCLUIDA'
            WHERE c.ativo = TRUE
              AND c.total_gasto > (SELECT AVG(total_gasto) 
                                   FROM Cliente 
                                   WHERE ativo = TRUE)
            GROUP BY c.id_pessoa, p.nome, p.email, c.tipo_pessoa, c.ranking, 
                     c.total_gasto, c.data_ultima_compra
            HAVING COUNT(v.id_venda) > 0
            ORDER BY c.total_gasto DESC, total_compras DESC
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, this::mapClienteVIP, limit);
    }

    private ClienteVIPDTO mapClienteVIP(ResultSet rs, int rowNum) throws SQLException {
        ClienteVIPDTO dto = new ClienteVIPDTO();
        dto.setIdCliente(rs.getInt("id_pessoa"));
        dto.setClienteNome(rs.getString("cliente_nome"));
        dto.setCpf(rs.getString("cliente_email")); // Usando email no lugar de CPF
        dto.setTelefone(rs.getString("tipo_pessoa"));  // Usando tipo_pessoa como placeholder
        dto.setTotalCompras(rs.getLong("total_compras"));
        dto.setTicketMedio(rs.getBigDecimal("ticket_medio"));
        dto.setValorTotalGasto(rs.getBigDecimal("total_gasto"));
        dto.setMediaComprasGeral(rs.getBigDecimal("media_gasto_geral"));
        return dto;
    }
}
