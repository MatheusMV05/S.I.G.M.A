package com.project.sigma.service;

import com.project.sigma.model.Produto;
import com.project.sigma.model.MovimentacaoEstoque;
import com.project.sigma.model.Usuario; // Assumindo que você tem esse model
import com.project.sigma.repository.ProdutoRepository;
import com.project.sigma.repository.MovimentacaoEstoqueRepository;
import com.project.sigma.repository.UsuarioRepository; // Assumindo que você tem
import com.project.sigma.dto.*;
import com.project.sigma.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.project.sigma.dto.InventoryRequestDTO;
import com.project.sigma.dto.MovementReportDTO;
import com.project.sigma.dto.PaginatedResponseDTO;
import com.project.sigma.dto.StockMovementDTO;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class StockService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; // Para buscar o ID do usuário

    /**
     * Busca movimentações de estoque com paginação e filtros
     */
    public PaginatedResponseDTO<StockMovementDTO> getStockMovements(
            Integer page, Integer size, Long productId, String type,
            Long userId, String startDate, String endDate) {

        int pageNum = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;

        // Converter tipo para o enum do backend, se necessário
        String typeEnum = null;
        if (type != null && !type.isEmpty()) {
            typeEnum = MovimentacaoEstoque.TipoMovimentacao.valueOf(type.toUpperCase()).name();
        }

        return movimentacaoEstoqueRepository.findWithFiltersAndPagination(
                productId, typeEnum, userId, startDate, endDate, pageNum, pageSize
        );
    }

    /**
     * Busca histórico de estoque de um produto
     */
    public PaginatedResponseDTO<StockMovementDTO> getProductStockHistory(
            Long productId, Integer page, Integer size, String startDate, String endDate) {

        int pageNum = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;

        // Aqui, productId é obrigatório
        return movimentacaoEstoqueRepository.findWithFiltersAndPagination(
                productId, null, null, startDate, endDate, pageNum, pageSize
        );
    }

    /**
     * Realiza inventário de produtos
     */
    @Transactional
    public Map<String, Object> performInventory(InventoryRequestDTO dto) {
        List<MovimentacaoEstoque> adjustments = new ArrayList<>();
        int totalAdjustments = 0;
        int totalDiscrepancies = 0;
        int positiveAdjustments = 0;
        int negativeAdjustments = 0;

        for (InventoryRequestDTO.InventoryItemDTO item : dto.getProducts()) {
            Produto produto = produtoRepository.findById(item.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + item.getProductId()));

            int currentStock = produto.getEstoque();
            int countedQuantity = item.getCountedQuantity();

            if (currentStock != countedQuantity) {
                totalAdjustments++;
                int discrepancy = countedQuantity - currentStock;
                totalDiscrepancies += Math.abs(discrepancy);

                if (discrepancy > 0) {
                    positiveAdjustments++;
                } else {
                    negativeAdjustments++;
                }

                // Reutilizar o método createStockMovement que já criamos
                CreateStockMovementRequest adjustmentRequest = new CreateStockMovementRequest();
                adjustmentRequest.setProductId(item.getProductId());
                adjustmentRequest.setType("ADJUSTMENT");
                adjustmentRequest.setQuantity(discrepancy);
                adjustmentRequest.setReason("Ajuste de Inventário");

                MovimentacaoEstoque movimentacao = this.createStockMovement(adjustmentRequest);
                adjustments.add(movimentacao);
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAdjustments", totalAdjustments);
        summary.put("totalDiscrepancies", totalDiscrepancies);
        summary.put("positiveAdjustments", positiveAdjustments);
        summary.put("negativeAdjustments", negativeAdjustments);

        Map<String, Object> response = new HashMap<>();
        response.put("adjustments", adjustments);
        response.put("summary", summary);

        return response;
    }

    /**
     * Busca relatório de movimentação por período
     */
    public MovementReportDTO getMovementReport(String startDate, String endDate) {
        // Define o formato e o início/fim do dia
        LocalDateTime start = LocalDate.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE).atTime(23, 59, 59);

        MovementReportDTO report = new MovementReportDTO();

        report.setSummary(movimentacaoEstoqueRepository.getMovementSummaryByDateRange(start, end));
        report.setTopProducts(movimentacaoEstoqueRepository.getTopMovingProductsByDateRange(start, end));
        report.setMovementsByDay(movimentacaoEstoqueRepository.getMovementsByDayByDateRange(start, end));

        return report;
    }

    /**
     * Cria uma movimentação de estoque e ATUALIZA o estoque do produto.
     * Este é o método central para todas as entradas/saídas manuais.
     */
    @Transactional
    public MovimentacaoEstoque createStockMovement(CreateStockMovementRequest dto) {
        // Obter usuário logado (exemplo, ajuste conforme sua implementação de segurança)
        // Long userId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long userId = 1L; // Placeholder - Substitua pela lógica real de usuário logado

        Produto produto = produtoRepository.findById(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + dto.getProductId()));

        MovimentacaoEstoque.TipoMovimentacao tipo = MovimentacaoEstoque.TipoMovimentacao.valueOf(dto.getType().toUpperCase());
        int quantidade = dto.getQuantity();
        int estoqueAnterior = produto.getEstoque();
        int estoqueAtual;
        int quantidadeMovimentada = 0;

        switch (tipo) {
            case IN:
            case RETURN:
                estoqueAtual = estoqueAnterior + quantidade;
                quantidadeMovimentada = quantidade;
                break;

            case OUT:
            case LOSS:
            case SALE:
                if (estoqueAnterior < quantidade) {
                    throw new IllegalArgumentException("Estoque insuficiente para " + produto.getNome() +
                            ". Disponível: " + estoqueAnterior + ", Solicitado: " + quantidade);
                }
                estoqueAtual = estoqueAnterior - quantidade;
                quantidadeMovimentada = -quantidade; // Negativo para saídas
                break;

            case ADJUSTMENT:
                // 'quantidade' agora é o delta (ex: -5 ou +10)
                estoqueAtual = estoqueAnterior + quantidade;
                quantidadeMovimentada = quantidade; // Salva o delta
                break;

            default:
                throw new IllegalArgumentException("Tipo de movimentação inválido: " + dto.getType());
        }

        // 1. Atualizar o produto
        produto.setEstoque(estoqueAtual);
        produtoRepository.save(produto);

        // 2. Salvar o registro da movimentação
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setId_produto(produto.getId_produto());
        movimentacao.setId_usuario(userId);
        movimentacao.setData_movimentacao(LocalDateTime.now());
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidadeMovimentada); // Salva o delta
        movimentacao.setEstoque_anterior(estoqueAnterior);
        movimentacao.setEstoque_atual(estoqueAtual);
        movimentacao.setObservacao(dto.getReason());

        return movimentacaoEstoqueRepository.save(movimentacao);
    }

    public List<Produto> getLowStockProducts() {
        // Adicionar este método em ProdutoRepository
        return produtoRepository.findLowStockProducts();
    }

    public List<Produto> getOutOfStockProducts() {
        // Adicionar este método em ProdutoRepository
        return produtoRepository.findOutOfStockProducts();
    }

    public StockSummaryDTO getStockSummary() {
        StockSummaryDTO summary = new StockSummaryDTO();

        // Adicionar estes métodos em ProdutoRepository e MovimentacaoEstoqueRepository
        summary.setTotalProducts(produtoRepository.countActiveProducts());
        summary.setTotalValue(produtoRepository.findTotalStockValue());
        summary.setLowStockCount(produtoRepository.countLowStockProducts());
        summary.setOutOfStockCount(produtoRepository.countOutOfStockProducts());
        summary.setTotalMovementsToday(movimentacaoEstoqueRepository.countMovementsSince(LocalDate.now().atStartOfDay()));

        return summary;
    }

    public ValidateStockResponseDTO validateStockAvailability(ValidateStockRequestDTO dto) {
        Produto produto = produtoRepository.findById(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + dto.getProductId()));

        boolean available = produto.getEstoque() >= dto.getQuantity();
        return new ValidateStockResponseDTO(available, produto.getEstoque());
    }
}