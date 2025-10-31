package com.project.sigma.service;

import com.project.sigma.dto.*;
import com.project.sigma.model.MovimentacaoEstoque;
import com.project.sigma.model.Produto;
import com.project.sigma.model.Pessoa;
import com.project.sigma.repository.MovimentacaoEstoqueRepository;
import com.project.sigma.repository.ProdutoRepository;
import com.project.sigma.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovimentacaoEstoqueService {

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    /**
     * Lista todas as movimentações com paginação e filtros
     */
    public PaginatedResponseDTO<MovimentacaoEstoqueDTO> findAll(
            int page, int size, Long productId, String type, Long userId,
            String startDate, String endDate) {

        // Buscar todas as movimentações (sem filtros de data no repository por enquanto)
        List<MovimentacaoEstoque> allMovements = movimentacaoRepository.findAll();

        // Aplicar filtros
        List<MovimentacaoEstoque> filtered = allMovements.stream()
                .filter(m -> productId == null || m.getId_produto().equals(productId))
                .filter(m -> type == null || m.getTipo().name().equals(type))
                .filter(m -> userId == null || (m.getId_usuario() != null && m.getId_usuario().equals(userId)))
                .filter(m -> {
                    if (startDate == null) return true;
                    LocalDate start = LocalDate.parse(startDate);
                    return !m.getData_movimentacao().toLocalDate().isBefore(start);
                })
                .filter(m -> {
                    if (endDate == null) return true;
                    LocalDate end = LocalDate.parse(endDate);
                    return !m.getData_movimentacao().toLocalDate().isAfter(end);
                })
                .sorted((a, b) -> b.getData_movimentacao().compareTo(a.getData_movimentacao()))
                .collect(Collectors.toList());

        // Paginar
        int start = page * size;
        int end = Math.min(start + size, filtered.size());
        List<MovimentacaoEstoque> paginated = filtered.subList(start, end);

        // Converter para DTO
        List<MovimentacaoEstoqueDTO> dtos = paginated.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        // Montar resposta paginada
        PaginatedResponseDTO<MovimentacaoEstoqueDTO> response = new PaginatedResponseDTO<>();
        response.setContent(dtos);
        response.setTotalElements((long) filtered.size());
        response.setTotalPages((int) Math.ceil((double) filtered.size() / size));
        response.setPage(page);
        response.setSize(size);
        response.setNumber(page);
        response.setFirst(page == 0);
        response.setLast(end >= filtered.size());

        return response;
    }

    /**
     * Busca movimentação por ID
     */
    public MovimentacaoEstoqueDTO findById(Long id) {
        MovimentacaoEstoque movimentacao = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada: " + id));
        return toDTO(movimentacao);
    }

    /**
     * Cria nova movimentação
     */
    @Transactional
    public MovimentacaoEstoqueDTO create(CreateMovimentacaoRequest request) {
        // 1. Buscar produto
        Produto produto = produtoRepository.findById(request.getId_produto())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + request.getId_produto()));

        // 2. Converter string para enum
        MovimentacaoEstoque.TipoMovimentacao tipo;
        try {
            tipo = MovimentacaoEstoque.TipoMovimentacao.valueOf(request.getTipo());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tipo de movimentação inválido: " + request.getTipo() + 
                ". Valores aceitos: IN, OUT, ADJUSTMENT, LOSS, RETURN, SALE");
        }

        // 3. Calcular estoque anterior e novo
        int estoqueAnterior = produto.getEstoque();
        int quantidade = request.getQuantidade();
        int estoqueNovo;

        // Tipos que aumentam o estoque
        if (tipo == MovimentacaoEstoque.TipoMovimentacao.IN || 
            tipo == MovimentacaoEstoque.TipoMovimentacao.RETURN) {
            estoqueNovo = estoqueAnterior + quantidade;
        }
        // Tipos que diminuem o estoque
        else if (tipo == MovimentacaoEstoque.TipoMovimentacao.OUT || 
                 tipo == MovimentacaoEstoque.TipoMovimentacao.SALE || 
                 tipo == MovimentacaoEstoque.TipoMovimentacao.LOSS) {
            if (quantidade > estoqueAnterior) {
                throw new IllegalArgumentException("Estoque insuficiente. Disponível: " + estoqueAnterior);
            }
            estoqueNovo = estoqueAnterior - quantidade;
            quantidade = -quantidade; // Negativo para saída
        }
        // ADJUSTMENT pode ser positivo ou negativo
        else if (tipo == MovimentacaoEstoque.TipoMovimentacao.ADJUSTMENT) {
            estoqueNovo = estoqueAnterior + quantidade;
        }
        else {
            throw new IllegalArgumentException("Tipo de movimentação não tratado: " + request.getTipo());
        }

        // 3. Atualizar estoque do produto
        produto.setEstoque(estoqueNovo);
        produtoRepository.save(produto);

        // 4. Criar movimentação
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setId_produto(produto.getId_produto());
        movimentacao.setId_usuario(null); // TODO: Pegar do contexto de segurança
        movimentacao.setData_movimentacao(LocalDateTime.now());
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setEstoque_anterior(estoqueAnterior);
        movimentacao.setEstoque_atual(estoqueNovo);
        movimentacao.setObservacao(request.getObservacao());

        MovimentacaoEstoque saved = movimentacaoRepository.save(movimentacao);

        return toDTO(saved);
    }

    /**
     * Atualiza movimentação existente
     */
    @Transactional
    public MovimentacaoEstoqueDTO update(Long id, CreateMovimentacaoRequest request) {
        // 1. Buscar movimentação existente
        MovimentacaoEstoque movimentacaoExistente = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada: " + id));

        // 2. Reverter o efeito da movimentação antiga no estoque
        Produto produto = produtoRepository.findById(movimentacaoExistente.getId_produto())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + movimentacaoExistente.getId_produto()));

        int estoqueAtual = produto.getEstoque();
        int quantidadeAntiga = movimentacaoExistente.getQuantidade();

        // Reverter a movimentação antiga
        int estoqueRevertido = estoqueAtual - quantidadeAntiga;
        produto.setEstoque(estoqueRevertido);

        // 3. Aplicar nova movimentação
        Produto novoProduto = produtoRepository.findById(request.getId_produto())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + request.getId_produto()));

        // Converter string para enum
        MovimentacaoEstoque.TipoMovimentacao tipo;
        try {
            tipo = MovimentacaoEstoque.TipoMovimentacao.valueOf(request.getTipo());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tipo de movimentação inválido: " + request.getTipo() + 
                ". Valores aceitos: IN, OUT, ADJUSTMENT, LOSS, RETURN, SALE");
        }

        int estoqueAnterior = novoProduto.getEstoque();
        int quantidade = request.getQuantidade();
        int estoqueNovo;

        // Tipos que aumentam o estoque
        if (tipo == MovimentacaoEstoque.TipoMovimentacao.IN || 
            tipo == MovimentacaoEstoque.TipoMovimentacao.RETURN) {
            estoqueNovo = estoqueAnterior + quantidade;
        }
        // Tipos que diminuem o estoque
        else if (tipo == MovimentacaoEstoque.TipoMovimentacao.OUT || 
                 tipo == MovimentacaoEstoque.TipoMovimentacao.SALE || 
                 tipo == MovimentacaoEstoque.TipoMovimentacao.LOSS) {
            if (quantidade > estoqueAnterior) {
                throw new IllegalArgumentException("Estoque insuficiente. Disponível: " + estoqueAnterior);
            }
            estoqueNovo = estoqueAnterior - quantidade;
            quantidade = -quantidade;
        }
        // ADJUSTMENT pode ser positivo ou negativo
        else if (tipo == MovimentacaoEstoque.TipoMovimentacao.ADJUSTMENT) {
            estoqueNovo = estoqueAnterior + quantidade;
        }
        else {
            throw new IllegalArgumentException("Tipo de movimentação não tratado: " + request.getTipo());
        }

        novoProduto.setEstoque(estoqueNovo);
        produtoRepository.save(novoProduto);

        // 4. Atualizar movimentação
        movimentacaoExistente.setId_produto(novoProduto.getId_produto());
        movimentacaoExistente.setTipo(tipo);
        movimentacaoExistente.setQuantidade(quantidade);
        movimentacaoExistente.setEstoque_anterior(estoqueAnterior);
        movimentacaoExistente.setEstoque_atual(estoqueNovo);
        movimentacaoExistente.setObservacao(request.getObservacao());

        MovimentacaoEstoque updated = movimentacaoRepository.save(movimentacaoExistente);

        return toDTO(updated);
    }

    /**
     * Deleta movimentação e reverte o estoque
     */
    @Transactional
    public void delete(Long id) {
        // 1. Buscar movimentação
        MovimentacaoEstoque movimentacao = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada: " + id));

        // 2. Reverter efeito no estoque
        Produto produto = produtoRepository.findById(movimentacao.getId_produto())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + movimentacao.getId_produto()));

        int estoqueAtual = produto.getEstoque();
        int quantidadeMovimentacao = movimentacao.getQuantidade();

        // Reverter: subtrair a quantidade que foi adicionada (ou adicionar a que foi subtraída)
        int estoqueRevertido = estoqueAtual - quantidadeMovimentacao;

        produto.setEstoque(estoqueRevertido);
        produtoRepository.save(produto);

        // 3. Deletar movimentação
        movimentacaoRepository.deleteById(id);
    }

    /**
     * Converte MovimentacaoEstoque para DTO
     */
    private MovimentacaoEstoqueDTO toDTO(MovimentacaoEstoque movimentacao) {
        MovimentacaoEstoqueDTO dto = new MovimentacaoEstoqueDTO();
        dto.setId_movimentacao(movimentacao.getId_movimentacao());
        dto.setId_produto(movimentacao.getId_produto());
        dto.setId_usuario(movimentacao.getId_usuario());
        dto.setData_movimentacao(movimentacao.getData_movimentacao());
        
        // Retornar o tipo diretamente como string do enum
        dto.setTipo(movimentacao.getTipo().name());

        dto.setQuantidade(movimentacao.getQuantidade());
        dto.setEstoque_anterior(movimentacao.getEstoque_anterior());
        dto.setEstoque_atual(movimentacao.getEstoque_atual());
        dto.setObservacao(movimentacao.getObservacao());

        // Buscar produto
        produtoRepository.findById(movimentacao.getId_produto()).ifPresent(produto -> {
            ProdutoSimplificadoDTO produtoDTO = new ProdutoSimplificadoDTO();
            produtoDTO.setId_produto(produto.getId_produto());
            produtoDTO.setNome(produto.getNome());
            produtoDTO.setCodigo_barras(produto.getCodigo_barras());
            dto.setProduto(produtoDTO);
        });

        // Buscar usuário
        if (movimentacao.getId_usuario() != null) {
            pessoaRepository.findById(movimentacao.getId_usuario()).ifPresent(pessoa -> {
                UsuarioSimplificadoDTO usuarioDTO = new UsuarioSimplificadoDTO();
                usuarioDTO.setId_pessoa(pessoa.getId_pessoa());
                usuarioDTO.setNome(pessoa.getNome());
                dto.setUsuario(usuarioDTO);
            });
        }

        return dto;
    }
}