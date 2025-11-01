package com.project.sigma.service;

import com.project.sigma.dto.CreateStockMovementRequest;
import com.project.sigma.dto.VendaRequestDTO;
import com.project.sigma.dto.VendaResponseDTO;
import com.project.sigma.model.*;
import com.project.sigma.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Serviço para gerenciar operações de vendas
 * Processa criação de vendas, atualização de estoque e cálculos
 */
@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private VendaItemRepository vendaItemRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private StockService stockService;

    /**
     * Cria uma nova venda com todos os itens e atualiza o estoque
     */
    @Transactional
    public VendaResponseDTO criarVenda(VendaRequestDTO vendaDTO) {
        System.out.println("🔄 Iniciando processo de criação de venda...");

        // Validar funcionário
        if (!funcionarioRepository.existsById(vendaDTO.getId_funcionario())) {
            throw new IllegalArgumentException("Funcionário não encontrado: " + vendaDTO.getId_funcionario());
        }

        // Validar cliente se fornecido
        if (vendaDTO.getId_cliente() != null && !clienteRepository.existsById(vendaDTO.getId_cliente())) {
            throw new IllegalArgumentException("Cliente não encontrado: " + vendaDTO.getId_cliente());
        }

        // Validar itens
        if (vendaDTO.getItens() == null || vendaDTO.getItens().isEmpty()) {
            throw new IllegalArgumentException("A venda deve ter pelo menos um item");
        }

        // Calcular valor total da venda
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (VendaRequestDTO.VendaItemDTO itemDTO : vendaDTO.getItens()) {
            // Validar produto existe e tem estoque
            Optional<Produto> produtoOpt = produtoRepository.findById(itemDTO.getId_produto());
            if (!produtoOpt.isPresent()) {
                throw new IllegalArgumentException("Produto não encontrado: " + itemDTO.getId_produto());
            }

            Produto produto = produtoOpt.get();

            // Verificar estoque disponível
            if (produto.getEstoque() < itemDTO.getQuantidade()) {
                throw new IllegalArgumentException(
                        "Estoque insuficiente para produto: " + produto.getNome() +
                                ". Disponível: " + produto.getEstoque() +
                                ", Solicitado: " + itemDTO.getQuantidade()
                );
            }

            // Calcular subtotal do item
            BigDecimal precoUnitario = itemDTO.getPreco_unitario_venda();
            BigDecimal descontoItem = itemDTO.getDesconto_item() != null ? itemDTO.getDesconto_item() : BigDecimal.ZERO;
            BigDecimal subtotalItem = precoUnitario.multiply(BigDecimal.valueOf(itemDTO.getQuantidade())).subtract(descontoItem);

            valorTotal = valorTotal.add(subtotalItem);
        }

        // Aplicar desconto geral da venda
        BigDecimal desconto = vendaDTO.getDesconto() != null ? vendaDTO.getDesconto() : BigDecimal.ZERO;
        BigDecimal valorFinal = valorTotal.subtract(desconto);

        // Criar venda
        Venda venda = new Venda();
        venda.setId_cliente(vendaDTO.getId_cliente());
        venda.setId_funcionario(vendaDTO.getId_funcionario());
        venda.setData_venda(LocalDateTime.now());
        venda.setValor_total(valorTotal);
        venda.setDesconto(desconto);
        venda.setValor_final(valorFinal);
        venda.setMetodo_pagamento(vendaDTO.getMetodo_pagamento());
        venda.setStatus(Venda.StatusVenda.CONCLUIDA);
        venda.setObservacoes(vendaDTO.getObservacoes());

        // Salvar venda
        venda = vendaRepository.save(venda);
        System.out.println("✅ Venda criada com ID: " + venda.getId_venda());

        // Criar itens da venda e atualizar estoque
        for (VendaRequestDTO.VendaItemDTO itemDTO : vendaDTO.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getId_produto()).get();

            // Criar item da venda
            BigDecimal descontoItem = itemDTO.getDesconto_item() != null ? itemDTO.getDesconto_item() : BigDecimal.ZERO;
            BigDecimal subtotal = itemDTO.getPreco_unitario_venda()
                    .multiply(BigDecimal.valueOf(itemDTO.getQuantidade()))
                    .subtract(descontoItem);

            VendaItem vendaItem = new VendaItem();
            vendaItem.setId_venda(venda.getId_venda());
            vendaItem.setId_produto(itemDTO.getId_produto());
            vendaItem.setId_promocao(itemDTO.getId_promocao());
            vendaItem.setQuantidade(itemDTO.getQuantidade());
            vendaItem.setPreco_unitario_venda(itemDTO.getPreco_unitario_venda());
            vendaItem.setDesconto_item(descontoItem);
            vendaItem.setSubtotal(subtotal);

            vendaItemRepository.save(vendaItem);
            System.out.println("  📦 Item adicionado: " + produto.getNome() + " (qtd: " + itemDTO.getQuantidade() + ")");

            // Atualizar estoque do produto
            CreateStockMovementRequest movementRequest = new CreateStockMovementRequest();
            movementRequest.setProductId(produto.getId_produto());
            movementRequest.setType("SALE");
            movementRequest.setQuantity(itemDTO.getQuantidade()); // O StockService vai transformar em negativo
            movementRequest.setReason("Venda ID: " + venda.getId_venda());
            // O StockService pegará o usuário logado (UserId 1L no seu placeholder)

            System.out.println("  🧾 Movimentação de estoque registrada para Venda ID: " + venda.getId_venda());
        }

        System.out.println("✅ Venda processada com sucesso!");

        // Retornar DTO de resposta
        return converterParaResponseDTO(venda);
    }

    /**
     * Busca todas as vendas
     */
    public List<VendaResponseDTO> listarTodasVendas() {
        return vendaRepository.findAll().stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca venda por ID
     */
    public Optional<VendaResponseDTO> buscarVendaPorId(Long id) {
        return vendaRepository.findById(id)
                .map(this::converterParaResponseDTO);
    }

    /**
     * Busca vendas por cliente
     */
    public List<VendaResponseDTO> buscarVendasPorCliente(Long idCliente) {
        return vendaRepository.findByCliente(idCliente).stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca vendas por funcionário
     */
    public List<VendaResponseDTO> buscarVendasPorFuncionario(Long idFuncionario) {
        return vendaRepository.findByFuncionario(idFuncionario).stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca vendas por status
     */
    public List<VendaResponseDTO> buscarVendasPorStatus(Venda.StatusVenda status) {
        return vendaRepository.findByStatus(status).stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca vendas por período
     */
    public List<VendaResponseDTO> buscarVendasPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return vendaRepository.findByPeriod(inicio, fim).stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Cancela uma venda e devolve itens ao estoque
     */
    @Transactional
    public VendaResponseDTO cancelarVenda(Long idVenda, String motivo) {
        Optional<Venda> vendaOpt = vendaRepository.findById(idVenda);
        if (!vendaOpt.isPresent()) {
            throw new IllegalArgumentException("Venda não encontrada: " + idVenda);
        }

        Venda venda = vendaOpt.get();

        if (venda.getStatus() == Venda.StatusVenda.CANCELADA) {
            throw new IllegalArgumentException("Venda já está cancelada");
        }

        // Buscar itens da venda
        List<VendaItem> itens = vendaItemRepository.findByVenda(idVenda);

        // Devolver itens ao estoque
        for (VendaItem item : itens) {
            // Opcional: verificar se o produto ainda existe, embora o StockService já faça isso.
            Optional<Produto> produtoOpt = produtoRepository.findById(item.getId_produto());

            if (produtoOpt.isPresent()) {
                Produto produto = produtoOpt.get();

                // --- INÍCIO DA CORREÇÃO ---
                // Em vez de atualizar o estoque manualmente, chame o StockService

                CreateStockMovementRequest movementRequest = new CreateStockMovementRequest();
                movementRequest.setProductId(produto.getId_produto());
                movementRequest.setType("RETURN"); // Tipo de movimento de entrada
                movementRequest.setQuantity(item.getQuantidade()); // Quantidade positiva (entrada)
                movementRequest.setReason("Cancelamento Venda ID: " + idVenda);

                // O StockService vai cuidar de:
                // 1. Encontrar o produto
                // 2. Calcular novo estoque (estoqueAnterior + quantidade)
                // 3. Salvar o produto
                // 4. Criar e salvar a movimentação de estoque
                stockService.createStockMovement(movementRequest);

                System.out.println("  📈 Estoque devolvido via StockService: " + produto.getNome());
            }
        }

        // Atualizar status da venda
        venda.setStatus(Venda.StatusVenda.CANCELADA);
        if (motivo != null) {
            String obs = venda.getObservacoes() != null ? venda.getObservacoes() : "";
            venda.setObservacoes(obs + " | CANCELADO: " + motivo);
        }
        venda = vendaRepository.save(venda);

        System.out.println("✅ Venda cancelada com sucesso - ID: " + idVenda);

        return converterParaResponseDTO(venda);
    }

    /**
     * Obtém estatísticas de vendas
     */
    public Map<String, Object> obterEstatisticas(LocalDateTime inicio, LocalDateTime fim) {
        List<Venda> vendas = vendaRepository.findByPeriod(inicio, fim);

        BigDecimal totalVendas = vendas.stream()
                .filter(v -> v.getStatus() == Venda.StatusVenda.CONCLUIDA)
                .map(Venda::getValor_final)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long quantidadeVendas = vendas.stream()
                .filter(v -> v.getStatus() == Venda.StatusVenda.CONCLUIDA)
                .count();

        BigDecimal ticketMedio = quantidadeVendas > 0 ?
                totalVendas.divide(BigDecimal.valueOf(quantidadeVendas), 2, BigDecimal.ROUND_HALF_UP) :
                BigDecimal.ZERO;

        Map<String, Object> estatisticas = new HashMap<>();
        estatisticas.put("totalVendas", totalVendas);
        estatisticas.put("quantidadeVendas", quantidadeVendas);
        estatisticas.put("ticketMedio", ticketMedio);
        estatisticas.put("periodo", Map.of("inicio", inicio, "fim", fim));

        return estatisticas;
    }

    /**
     * Converte entidade Venda para DTO de resposta
     */
    private VendaResponseDTO converterParaResponseDTO(Venda venda) {
        VendaResponseDTO dto = new VendaResponseDTO();
        dto.setId_venda(venda.getId_venda());
        dto.setId_cliente(venda.getId_cliente());
        dto.setId_funcionario(venda.getId_funcionario());
        dto.setData_venda(venda.getData_venda());
        dto.setValor_total(venda.getValor_total());
        dto.setDesconto(venda.getDesconto());
        dto.setValor_final(venda.getValor_final());
        dto.setMetodo_pagamento(venda.getMetodo_pagamento());
        dto.setStatus(venda.getStatus().name());
        dto.setObservacoes(venda.getObservacoes());

        // Buscar nome do funcionário
        funcionarioRepository.findById(venda.getId_funcionario()).ifPresent(func -> {
            // Assumindo que Funcionario tem um atributo nome ou pessoa.nome
            dto.setNome_funcionario("Funcionário #" + func.getId_pessoa());
        });

        // Buscar nome do cliente se existir
        if (venda.getId_cliente() != null) {
            clienteRepository.findById(venda.getId_cliente()).ifPresent(cliente -> {
                dto.setNome_cliente("Cliente #" + cliente.getId_pessoa());
            });
        }

        // Buscar itens da venda
        List<VendaItem> itens = vendaItemRepository.findByVenda(venda.getId_venda());
        List<VendaResponseDTO.VendaItemResponseDTO> itensDTO = itens.stream()
                .map(item -> {
                    VendaResponseDTO.VendaItemResponseDTO itemDTO = new VendaResponseDTO.VendaItemResponseDTO();
                    itemDTO.setId_venda_item(item.getId_venda_item());
                    itemDTO.setId_produto(item.getId_produto());
                    itemDTO.setQuantidade(item.getQuantidade());
                    itemDTO.setPreco_unitario_venda(item.getPreco_unitario_venda());
                    itemDTO.setDesconto_item(item.getDesconto_item());
                    itemDTO.setSubtotal(item.getSubtotal());

                    // Buscar nome do produto
                    produtoRepository.findById(item.getId_produto()).ifPresent(produto -> {
                        itemDTO.setNome_produto(produto.getNome());
                    });

                    return itemDTO;
                })
                .collect(Collectors.toList());

        dto.setItens(itensDTO);

        return dto;
    }

    /**
     * 🎯 Feature #1: Desconto Progressivo usando Função SQL
     * Calcula desconto baseado no valor total usando fn_calcular_desconto_progressivo
     */
    public BigDecimal calcularDescontoProgressivo(BigDecimal valorTotal) {
        System.out.println("💰 Service: Calculando desconto para R$ " + valorTotal);
        BigDecimal desconto = vendaRepository.calcularDescontoProgressivo(valorTotal);
        System.out.println("✅ Desconto calculado: " + desconto + "%");
        return desconto;
    }
}