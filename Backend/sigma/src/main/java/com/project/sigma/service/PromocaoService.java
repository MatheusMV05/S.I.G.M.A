package com.project.sigma.service;

import com.project.sigma.dto.CreatePromocaoRequest;
import com.project.sigma.dto.PromocaoDTO;
import com.project.sigma.exception.EntityNotFoundException;
import com.project.sigma.model.Produto;
import com.project.sigma.model.Promocao;
import com.project.sigma.model.PromocaoProduto;
import com.project.sigma.repository.ProdutoRepository;
import com.project.sigma.repository.PromocaoProdutoRepository;
import com.project.sigma.repository.PromocaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromocaoService {

    @Autowired
    private PromocaoRepository promocaoRepository;

    @Autowired
    private PromocaoProdutoRepository promocaoProdutoRepository;

    @Autowired
    private ProdutoRepository produtoRepository; // Precisamos para buscar os produtos

    public PromocaoDTO findById(Long id) {
        Promocao promocao = promocaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Promoção não encontrada com ID: " + id));

        // Lógica para atualizar status ao buscar (garante consistência)
        updateStatusIfNeeded(promocao);

        // Buscar os produtos associados
        List<Long> produtoIds = promocaoProdutoRepository.findProdutoIdsByPromocaoId(id);
        List<Produto> produtos = produtoIds.stream()
                .map(produtoId -> produtoRepository.findById(produtoId).orElse(null))
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());

        promocao.setProdutos(produtos);

        return PromocaoDTO.fromEntity(promocao);
    }

    // TODO: Implementar getPromotions (com filtros e paginação - mais complexo)
    public List<PromocaoDTO> findAll() {
        LocalDate hoje = LocalDate.now();
        return promocaoRepository.findAll().stream()
                .peek(this::updateStatusIfNeeded) // Atualiza o status de cada promoção
                .map(promo -> {
                    // Popula produtos (pode ser otimizado para não fazer N+1 queries)
                    List<Long> produtoIds = promocaoProdutoRepository.findProdutoIdsByPromocaoId(promo.getId_promocao());
                    List<Produto> produtos = produtoIds.stream()
                            .map(produtoId -> produtoRepository.findById(produtoId).orElse(null))
                            .filter(java.util.Objects::nonNull)
                            .collect(Collectors.toList());
                    promo.setProdutos(produtos);
                    return PromocaoDTO.fromEntity(promo);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public PromocaoDTO create(CreatePromocaoRequest request) {
        Promocao promocao = new Promocao();
        promocao.setNome(request.getNome());
        promocao.setDescricao(request.getDescricao());
        promocao.setTipo_desconto(request.getTipo_desconto());
        promocao.setValor_desconto(request.getValor_desconto());
        promocao.setData_inicio(request.getData_inicio());
        promocao.setData_fim(request.getData_fim());

        // Define o status inicial
        promocao.setStatus(determineStatus(LocalDate.now(), request.getData_inicio(), request.getData_fim()));

        // 1. Salva a Promoção
        Promocao savedPromocao = promocaoRepository.save(promocao);
        Long promocaoId = savedPromocao.getId_promocao();

        // 2. Salva os links em PROMOCAO_PRODUTO
        if (request.getProdutoIds() != null && !request.getProdutoIds().isEmpty()) {
            for (Long produtoId : request.getProdutoIds()) {
                // TODO: Adicionar verificação se o produto existe
                promocaoProdutoRepository.save(new PromocaoProduto(promocaoId, produtoId));
            }
        }

        // Retorna o DTO completo
        return findById(promocaoId);
    }

    @Transactional
    public PromocaoDTO update(Long id, CreatePromocaoRequest request) {
        // 1. Verifica se a promoção existe
        Promocao existingPromocao = promocaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Promoção não encontrada com ID: " + id));

        // 2. Atualiza os dados
        existingPromocao.setNome(request.getNome());
        existingPromocao.setDescricao(request.getDescricao());
        existingPromocao.setTipo_desconto(request.getTipo_desconto());
        existingPromocao.setValor_desconto(request.getValor_desconto());
        existingPromocao.setData_inicio(request.getData_inicio());
        existingPromocao.setData_fim(request.getData_fim());
        existingPromocao.setStatus(determineStatus(LocalDate.now(), request.getData_inicio(), request.getData_fim()));

        promocaoRepository.update(existingPromocao);

        // 3. Atualiza os produtos (Abordagem: deleta todos e insere os novos)
        promocaoProdutoRepository.deleteByPromocaoId(id);
        if (request.getProdutoIds() != null && !request.getProdutoIds().isEmpty()) {
            for (Long produtoId : request.getProdutoIds()) {
                promocaoProdutoRepository.save(new PromocaoProduto(id, produtoId));
            }
        }

        return findById(id);
    }

    @Transactional
    public void delete(Long id) {
        if (!promocaoRepository.findById(id).isPresent()) {
            throw new EntityNotFoundException("Promoção não encontrada com ID: " + id);
        }
        // O ON DELETE CASCADE no SQL cuidará da tabela PROMOCAO_PRODUTO
        promocaoRepository.deleteById(id);
    }

    // ----- Lógica de Status -----

    /**
     * Atualiza o status de uma promoção no banco se a data atual mudou seu estado.
     */
    private void updateStatusIfNeeded(Promocao promocao) {
        LocalDate hoje = LocalDate.now();
        Promocao.StatusPromocao newStatus = determineStatus(hoje, promocao.getData_inicio(), promocao.getData_fim());

        if (promocao.getStatus() != newStatus) {
            promocao.setStatus(newStatus);
            promocaoRepository.updateStatus(promocao.getId_promocao(), newStatus);
        }
    }

    /**
     * Determina o status correto baseado nas datas.
     */
    private Promocao.StatusPromocao determineStatus(LocalDate hoje, LocalDate inicio, LocalDate fim) {
        if (hoje.isBefore(inicio)) {
            return Promocao.StatusPromocao.AGENDADA;
        } else if (hoje.isAfter(fim)) {
            return Promocao.StatusPromocao.INATIVA; // Expirada
        } else {
            return Promocao.StatusPromocao.ATIVA;
        }
    }
}