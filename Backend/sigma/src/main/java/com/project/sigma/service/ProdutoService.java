package com.project.sigma.service;

import com.project.sigma.dto.PaginatedResponseDTO;
import com.project.sigma.dto.ProdutoResponseDTO;
import com.project.sigma.model.Categoria;
import com.project.sigma.model.Produto;
import com.project.sigma.repository.CategoriaRepository;
import com.project.sigma.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.project.sigma.dto.PaginatedResponseDTO;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private DataSource dataSource;

    // Novo método para paginação com DTO
    public PaginatedResponseDTO<ProdutoResponseDTO> buscarProdutosComPaginacao(
        int page, int size, String search, Long categoryId, String status) {

        // Usar o método otimizado que já traz a categoria
        List<Produto> produtos = produtoRepository.findAllWithCategory();

        // CORRIGIDO: Aplicar filtros nos produtos
        List<Produto> produtosFiltrados = produtos.stream()
            .filter(produto -> {
                // Filtro por texto de busca (nome, marca, descrição)
                if (search != null && !search.trim().isEmpty()) {
                    String searchLower = search.toLowerCase().trim();
                    boolean matchNome = produto.getNome() != null && produto.getNome().toLowerCase().contains(searchLower);
                    boolean matchMarca = produto.getMarca() != null && produto.getMarca().toLowerCase().contains(searchLower);
                    boolean matchDescricao = produto.getDescricao() != null && produto.getDescricao().toLowerCase().contains(searchLower);

                    if (!matchNome && !matchMarca && !matchDescricao) {
                        return false;
                    }
                }

                // Filtro por categoria
                if (categoryId != null && !categoryId.equals(produto.getId_categoria())) {
                    return false;
                }

                // Filtro por status
                if (status != null && !status.trim().isEmpty()) {
                    if (!status.equalsIgnoreCase(produto.getStatus().name())) {
                        return false;
                    }
                }

                return true;
            })
            .collect(Collectors.toList());

        // Calcular paginação
        int totalElements = produtosFiltrados.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalElements);

        // Aplicar paginação
        List<Produto> produtosPaginados = produtosFiltrados.subList(startIndex, endIndex);

        List<ProdutoResponseDTO> produtosDTOs = produtosPaginados.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        PaginatedResponseDTO<ProdutoResponseDTO> response = new PaginatedResponseDTO<>();
        response.setContent(produtosDTOs);
        response.setPage(page);
        response.setSize(size);
        response.setTotalPages(totalPages);
        response.setTotalElements(totalElements);
        response.setFirst(page == 0);
        response.setLast(page >= totalPages - 1);
        response.setNumber(page);

        return response;
    }

    public Optional<ProdutoResponseDTO> buscarProdutoCompletoPorId(Long id) {
        return produtoRepository.findByIdWithCategory(id)
                .map(this::convertToResponseDTO);
    }

    /**
     * Obtém produtos de forma paginada com filtros.
     */
    public PaginatedResponseDTO<ProdutoResponseDTO> getProdutosPaginados(
            String nome, String status, Long categoriaId, Integer page, Integer size) {

        int pageNum = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;

        // 1. Chame o repositório (agora retorna PaginatedResponseDTO<Produto>)
        PaginatedResponseDTO<Produto> paginatedResult = produtoRepository.findWithFiltersAndPagination(
                nome, status, categoriaId, pageNum, pageSize
        );

        // 2. Converta a lista de Produto para ProdutoResponseDTO
        // (Assumindo que você tem o método 'converterParaDTO' no seu service)
        List<ProdutoResponseDTO> dtoList = paginatedResult.getContent().stream()
                .map(this::converterParaDTO) // Use seu conversor de DTO existente
                .collect(Collectors.toList());

        // 3. Crie um novo PaginatedResponseDTO com o conteúdo convertido
        return new PaginatedResponseDTO<ProdutoResponseDTO>(
                dtoList,                        // 1. content
                paginatedResult.getPage(),      // 2. page
                paginatedResult.getSize(),      // 3. size
                paginatedResult.getTotalPages(), // 4. totalPages
                paginatedResult.getTotalElements(), // 5. totalElements
                paginatedResult.isFirst(),      // 6. first
                paginatedResult.isLast(),       // 7. last
                paginatedResult.getNumber()     // 8. number (Este era o 'getNumberOfElements')
        );
    }

    private ProdutoResponseDTO converterParaDTO(Produto produto) {
        ProdutoResponseDTO dto = new ProdutoResponseDTO();
        dto.setId_produto(produto.getId_produto());
        dto.setNome(produto.getNome());
        dto.setMarca(produto.getMarca());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco_custo(produto.getPreco_custo());
        dto.setPreco_venda(produto.getPreco_venda());
        dto.setEstoque(produto.getEstoque());
        dto.setEstoque_minimo(produto.getEstoque_minimo());
        dto.setEstoque_maximo(produto.getEstoque_maximo());
        dto.setStatus(produto.getStatus() != null ? produto.getStatus().name() : "ATIVO");
        dto.setCodigo_barras(produto.getCodigo_barras());
        dto.setData_validade(produto.getData_validade());

        // Carregar categoria se disponível
        if (produto.getCategoria() != null) {
            ProdutoResponseDTO.CategoriaSimpleDTO categoriaDTO = new ProdutoResponseDTO.CategoriaSimpleDTO();
            categoriaDTO.setId(produto.getCategoria().getId_categoria());
            categoriaDTO.setNome(produto.getCategoria().getNome());
            dto.setCategory(categoriaDTO);
        }

        return dto;
    }

    /**
     * Orquestra a criação de um novo produto.
     * @param produto O produto a ser criado.
     * @return O produto salvo com seu novo ID.
     */
    public Produto criarProduto(Produto produto) {
        if (!StringUtils.hasText(produto.getNome())) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }
        if (produto.getPreco_venda() == null || produto.getPreco_venda().doubleValue() <= 0) {
            throw new IllegalArgumentException("O preço de venda deve ser maior que zero.");
        }
        if (produto.getEstoque() == null || produto.getEstoque() < 0) {
            throw new IllegalArgumentException("O estoque não pode ser negativo.");
        }

        // CORRIGIDO: Garantir valores padrão para campos opcionais
        if (produto.getEstoque_minimo() == null) {
            produto.setEstoque_minimo(0);
        }
        if (produto.getEstoque_maximo() == null) {
            produto.setEstoque_maximo(1000);
        }
        if (produto.getStatus() == null) {
            produto.setStatus(Produto.StatusProduto.ATIVO);
        }

        return produtoRepository.save(produto);
    }

    /**
     * Atualiza um produto existente.
     * @param produto O produto com os dados atualizados.
     * @return O produto atualizado.
     */
    public Produto atualizarProduto(Produto produto) {
        if (produto.getId_produto() == null) {
            throw new IllegalArgumentException("O ID do produto é obrigatório para atualização.");
        }
        if (!produtoRepository.existsById(produto.getId_produto())) {
            throw new IllegalArgumentException("Produto não encontrado com ID: " + produto.getId_produto());
        }

        // CORRIGIDO: Garantir valores padrão para campos opcionais na atualização também
        if (produto.getEstoque_minimo() == null) {
            produto.setEstoque_minimo(0);
        }
        if (produto.getEstoque_maximo() == null) {
            produto.setEstoque_maximo(1000);
        }
        if (produto.getStatus() == null) {
            produto.setStatus(Produto.StatusProduto.ATIVO);
        }

        return produtoRepository.save(produto);
    }

    /**
     * Deleta um produto pelo seu ID.
     * @param id O ID do produto a ser deletado.
     */
    public void deletarProduto(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O ID do produto não pode ser nulo para a exclusão.");
        }
        if (!produtoRepository.existsById(id)) {
            throw new IllegalArgumentException("Produto não encontrado com ID: " + id);
        }
        produtoRepository.deleteById(id);
    }

    /**
     * Busca produtos com baixo estoque.
     * @return Lista de produtos com estoque baixo.
     */
    public List<ProdutoResponseDTO> buscarProdutosComBaixoEstoque() {
        return produtoRepository.findByEstoqueBaixoWithCategory().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private ProdutoResponseDTO convertToResponseDTO(Produto produto) {
        ProdutoResponseDTO dto = new ProdutoResponseDTO();
        dto.setId_produto(produto.getId_produto());
        dto.setNome(produto.getNome());
        dto.setMarca(produto.getMarca());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco_custo(produto.getPreco_custo());
        dto.setPreco_venda(produto.getPreco_venda());
        dto.setEstoque(produto.getEstoque());
        dto.setEstoque_minimo(produto.getEstoque_minimo());
        dto.setEstoque_maximo(produto.getEstoque_maximo());
        dto.setStatus(produto.getStatus() != null ? produto.getStatus().name() : "ATIVO");
        dto.setCodigo_barras(produto.getCodigo_barras());
        dto.setData_validade(produto.getData_validade());

        // Usar a categoria já carregada pelo JOIN ou buscar separadamente se necessário
        if (produto.getCategoria() != null) {
            // Categoria já foi carregada pelo JOIN - mais eficiente
            ProdutoResponseDTO.CategoriaSimpleDTO categoriaDTO = new ProdutoResponseDTO.CategoriaSimpleDTO();
            categoriaDTO.setId(produto.getCategoria().getId_categoria());
            categoriaDTO.setNome(produto.getCategoria().getNome());
            dto.setCategory(categoriaDTO);
        } else if (produto.getId_categoria() != null) {
            // Fallback: buscar categoria separadamente se não foi carregada pelo JOIN
            Optional<Categoria> categoriaOpt = categoriaRepository.findById(produto.getId_categoria());
            if (categoriaOpt.isPresent()) {
                Categoria categoria = categoriaOpt.get();
                ProdutoResponseDTO.CategoriaSimpleDTO categoriaDTO = new ProdutoResponseDTO.CategoriaSimpleDTO();
                categoriaDTO.setId(categoria.getId_categoria());
                categoriaDTO.setNome(categoria.getNome());
                dto.setCategory(categoriaDTO);
            }
        }

        return dto;
    }

    // ================================================================
    // FUNÇÕES SQL (Etapa 05) - Integradas ao contexto de negócio
    // ================================================================

    /**
     * Calcula desconto progressivo baseado no valor total
     * Utiliza a função fn_calcular_desconto_progressivo do banco
     */
    public BigDecimal calcularDescontoProgressivo(BigDecimal valorTotal) throws SQLException {
        String sql = "SELECT fn_calcular_desconto_progressivo(?) AS desconto";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setBigDecimal(1, valorTotal);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getBigDecimal("desconto");
                }
            }
        }
        
        return BigDecimal.ZERO;
    }

    /**
     * Reajusta preços de produtos de uma categoria
     * Utiliza o procedimento sp_reajustar_precos_categoria do banco
     */
    public Map<String, Object> reajustarPrecosCategoria(Long idCategoria, BigDecimal percentual, 
                                                        boolean reajustarCusto) throws SQLException {
        String sql = "{CALL sp_reajustar_precos_categoria(?, ?, ?)}";
        
        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            
            stmt.setLong(1, idCategoria);
            stmt.setBigDecimal(2, percentual);
            stmt.setBoolean(3, reajustarCusto);
            
            stmt.execute();
            
            // Retornar informações do reajuste
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("idCategoria", idCategoria);
            resultado.put("percentualAplicado", percentual);
            resultado.put("reajustouCusto", reajustarCusto);
            resultado.put("dataHora", LocalDateTime.now());
            resultado.put("mensagem", "Preços reajustados com sucesso");
            
            return resultado;
        }
    }
}
