package com.project.sigma.controller;

import com.project.sigma.dto.LogAuditoriaDTO;
import com.project.sigma.dto.PaginatedResponseDTO;
import com.project.sigma.dto.ProdutoRequestDTO;
import com.project.sigma.dto.ProdutoResponseDTO;
import com.project.sigma.model.Produto;
import com.project.sigma.repository.LogAuditoriaRepository;
import com.project.sigma.repository.ProdutoRepository;
import com.project.sigma.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<ProdutoResponseDTO>> getProdutos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        PaginatedResponseDTO<ProdutoResponseDTO> response = produtoService.getProdutosPaginados(
                nome, status, categoriaId, page, size
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<?> getLowStockProducts() {
        System.out.println("⚠️ GET /api/products/estoque-baixo - Buscando produtos com baixo estoque");

        try {
            return ResponseEntity.ok(produtoService.buscarProdutosComBaixoEstoque());
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar produtos com baixo estoque: " + e.getMessage());
            return ResponseEntity.ok(new Object[0]);
        }
    }

    @GetMapping("/{id:[0-9]+}")  // CORRIGIDO: especifica que id deve ser numérico
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable Long id) {
        return produtoService.buscarProdutoCompletoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody ProdutoRequestDTO dto) {
        System.out.println("=== DEBUG PRODUTO CREATE ===");
        System.out.println("DTO recebido do frontend para CRIAR:");
        System.out.println("nome: " + dto.getNome());
        System.out.println("marca: " + dto.getMarca());
        System.out.println("quantEmEstoque: " + dto.getQuantEmEstoque());
        System.out.println("valorUnitario: " + dto.getValorUnitario());
        System.out.println("dataValidade: " + dto.getDataValidade());
        System.out.println("idCategoria: " + dto.getIdCategoria());
        System.out.println("descricao: " + dto.getDescricao());
        System.out.println("estoqueMinimo: " + dto.getEstoqueMinimo());
        System.out.println("estoqueMaximo: " + dto.getEstoqueMaximo());
        System.out.println("precoCusto: " + dto.getPrecoCusto());
        System.out.println("status: " + dto.getStatus());
        System.out.println("codigoBarras: " + dto.getCodigoBarras());

        // Validação básica do DTO antes da conversão
        if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
            System.err.println("❌ ERRO: Nome do produto está null ou vazio no DTO");
            return ResponseEntity.badRequest().build();
        }

        // Convert DTO to entity using new schema field names
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setEstoque(dto.getQuantEmEstoque() != null ? dto.getQuantEmEstoque() : 0);
        produto.setPreco_venda(dto.getValorUnitario());
        produto.setData_validade(dto.getDataValidade());
        produto.setId_categoria(dto.getIdCategoria());
        produto.setDescricao(dto.getDescricao());
        produto.setEstoque_minimo(dto.getEstoqueMinimo() != null ? dto.getEstoqueMinimo() : 0);
        // CORRIGIDO: garantir que estoque_maximo nunca seja null
        produto.setEstoque_maximo(dto.getEstoqueMaximo() != null ? dto.getEstoqueMaximo() : 1000);
        produto.setPreco_custo(dto.getPrecoCusto());

        // CORRIGIDO: tratar status null com valor padrão
        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            try {
                produto.setStatus(Produto.StatusProduto.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                System.err.println("❌ Status inválido: " + dto.getStatus() + ". Usando ATIVO como padrão.");
                produto.setStatus(Produto.StatusProduto.ATIVO);
            }
        } else {
            produto.setStatus(Produto.StatusProduto.ATIVO);
        }

        produto.setCodigo_barras(dto.getCodigoBarras());

        System.out.println("Produto convertido antes de enviar para service:");
        System.out.println("nome: " + produto.getNome());
        System.out.println("preco_venda: " + produto.getPreco_venda());
        System.out.println("estoque: " + produto.getEstoque());
        System.out.println("preco_custo: " + produto.getPreco_custo());
        System.out.println("status: " + produto.getStatus());
        System.out.println("estoque_maximo: " + produto.getEstoque_maximo());
        System.out.println("===============================");

        try {
            Produto novoProduto = produtoService.criarProduto(produto);
            System.out.println("✅ Produto criado com sucesso");
            return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar produto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody ProdutoRequestDTO dto) {
        System.out.println("=== DEBUG PRODUTO UPDATE ===");
        System.out.println("ID recebido: " + id);
        System.out.println("ID Categoria recebido: " + dto.getIdCategoria());

        // Convert DTO to entity using new schema field names
        Produto produto = new Produto();
        produto.setId_produto(id);
        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setEstoque(dto.getQuantEmEstoque());
        produto.setPreco_venda(dto.getValorUnitario());
        produto.setData_validade(dto.getDataValidade());
        
        // CORRIGIDO: Permitir que id_categoria seja null se não fornecido
        // Isso evita foreign key constraint error quando categoria não é alterada
        if (dto.getIdCategoria() != null && dto.getIdCategoria() > 0) {
            produto.setId_categoria(dto.getIdCategoria());
        } else {
            // Buscar a categoria atual do produto para manter
            Optional<Produto> produtoAtual = produtoRepository.findById(id);
            if (produtoAtual.isPresent()) {
                produto.setId_categoria(produtoAtual.get().getId_categoria());
            }
        }
        
        produto.setDescricao(dto.getDescricao());
        produto.setEstoque_minimo(dto.getEstoqueMinimo());
        // CORRIGIDO: garantir que estoque_maximo nunca seja null
        produto.setEstoque_maximo(dto.getEstoqueMaximo() != null ? dto.getEstoqueMaximo() : 1000);
        produto.setPreco_custo(dto.getPrecoCusto());
        produto.setStatus(Produto.StatusProduto.valueOf(dto.getStatus()));
        produto.setCodigo_barras(dto.getCodigoBarras());

        System.out.println("Produto antes de enviar para service:");
        System.out.println("preco_venda: " + produto.getPreco_venda());
        System.out.println("estoque: " + produto.getEstoque());
        System.out.println("id_categoria: " + produto.getId_categoria());
        System.out.println("estoque_maximo: " + produto.getEstoque_maximo());
        System.out.println("===============================");

        Produto produtoAtualizado = produtoService.atualizarProduto(produto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Calcula desconto progressivo baseado no valor total da compra
     * GET /api/products/calcular-desconto-progressivo?valorTotal={valor}
     * Utiliza a função fn_calcular_desconto_progressivo do banco
     * 
     * @param valorTotal Valor total da compra
     * @return JSON com valor original, desconto aplicado, percentual e valor final
     */
    @GetMapping("/calcular-desconto-progressivo")
    public ResponseEntity<Map<String, Object>> calcularDescontoProgressivo(
            @RequestParam BigDecimal valorTotal) {
        
        System.out.println("💰 GET /api/products/calcular-desconto-progressivo - Valor: R$ " + valorTotal);
        
        try {
            // A função SQL retorna o PERCENTUAL (0.05, 0.10, 0.15)
            BigDecimal percentualDecimal = produtoService.calcularDescontoProgressivo(valorTotal);
            
            // Converter percentual para valor absoluto
            BigDecimal descontoAplicado = valorTotal.multiply(percentualDecimal);
            BigDecimal valorFinal = valorTotal.subtract(descontoAplicado);
            
            // Converter percentual decimal para porcentagem (0.05 -> 5.0)
            BigDecimal percentualPorcentagem = percentualDecimal.multiply(new BigDecimal("100"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("valorOriginal", valorTotal);
            response.put("descontoAplicado", descontoAplicado.setScale(2, RoundingMode.HALF_UP));
            response.put("percentualDesconto", percentualPorcentagem.setScale(2, RoundingMode.HALF_UP));
            response.put("valorFinal", valorFinal.setScale(2, RoundingMode.HALF_UP));
            response.put("economizado", descontoAplicado.setScale(2, RoundingMode.HALF_UP));
            
            System.out.println("✅ Desconto calculado: R$ " + descontoAplicado.setScale(2, RoundingMode.HALF_UP) 
                + " (" + percentualPorcentagem.setScale(1, RoundingMode.HALF_UP) + "%)");
            
            return ResponseEntity.ok(response);
        } catch (SQLException e) {
            System.err.println("❌ Erro ao calcular desconto progressivo: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("valorOriginal", valorTotal);
            errorResponse.put("descontoAplicado", BigDecimal.ZERO);
            errorResponse.put("percentualDesconto", BigDecimal.ZERO);
            errorResponse.put("valorFinal", valorTotal);
            errorResponse.put("economizado", BigDecimal.ZERO);
            errorResponse.put("erro", "Erro ao calcular desconto");
            
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * Reajusta preços em massa de todos os produtos de uma categoria
     * POST /api/products/reajustar-precos
     * Utiliza o procedimento sp_reajustar_precos_categoria do banco
     * 
     * Body JSON:
     * {
     *   "categoriaId": 1,
     *   "percentual": 10.5,     // 10.5% de aumento ou -5 para desconto de 5%
     *   "aplicarCusto": true     // true = reajusta preço de custo também
     * }
     * 
     * @return JSON com resultado do reajuste
     */
    @PostMapping("/reajustar-precos")
    public ResponseEntity<Map<String, Object>> reajustarPrecos(@RequestBody Map<String, Object> request) {
        
        System.out.println("📊 POST /api/products/reajustar-precos - Reajuste em massa iniciado");
        
        try {
            Long categoriaId = Long.valueOf(request.get("categoriaId").toString());
            BigDecimal percentual = new BigDecimal(request.get("percentual").toString());
            Boolean aplicarCusto = Boolean.valueOf(request.get("aplicarCusto").toString());
            
            System.out.println("   Categoria ID: " + categoriaId);
            System.out.println("   Percentual: " + percentual + "%");
            System.out.println("   Aplicar no custo: " + aplicarCusto);
            
            Map<String, Object> resultado = produtoService.reajustarPrecosCategoria(
                categoriaId, percentual, aplicarCusto
            );
            
            System.out.println("✅ Reajuste aplicado com sucesso!");
            
            return ResponseEntity.ok(resultado);
        } catch (SQLException e) {
            System.err.println("❌ Erro SQL ao reajustar preços: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("erro", e.getMessage());
            errorResponse.put("mensagem", "Erro ao reajustar preços da categoria");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            System.err.println("❌ Erro ao reajustar preços: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("erro", e.getMessage());
            errorResponse.put("mensagem", "Erro ao processar requisição de reajuste");
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Busca histórico de auditoria de um produto específico
     * GET /api/products/{id}/historico
     * Utiliza a tabela AuditoriaLog populada pelo trigger trg_auditoria_produto_update
     * 
     * Retorna todas as alterações feitas no produto ordenadas por data (mais recente primeiro)
     * 
     * @param id ID do produto
     * @return Lista de logs de auditoria do produto
     */
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<LogAuditoriaDTO>> getHistoricoProduto(@PathVariable Long id) {
        System.out.println("📜 GET /api/products/" + id + "/historico - Buscando histórico de auditoria");
        
        try {
            List<LogAuditoriaDTO> historico = logAuditoriaRepository.buscarPorRegistro("Produto", id.intValue());
            
            System.out.println("✅ Encontrados " + historico.size() + " registros de auditoria para o produto ID " + id);
            
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar histórico do produto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // Retorna lista vazia em caso de erro
        }
    }
}