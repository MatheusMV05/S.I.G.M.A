package com.project.sigma.service;

import com.project.sigma.dto.CreateCategoriaRequest;
import com.project.sigma.dto.UpdateCategoriaRequest;
import com.project.sigma.dto.CategoriaResponse;
import com.project.sigma.exception.EntityNotFoundException;
import com.project.sigma.model.Categoria;
import com.project.sigma.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Busca todas as categorias ativas no sistema.
     * @return Uma lista de objetos Categoria.
     */
    public List<Categoria> listarTodas() {
        System.out.println("🔍 Service: Buscando todas as categorias ativas");
        try {
            List<Categoria> categorias = categoriaRepository.findAll();
            System.out.println("✅ Service: Encontradas " + categorias.size() + " categorias");
            return categorias;
        } catch (Exception e) {
            System.out.println("❌ Service: Erro ao buscar categorias - " + e.getMessage());
            throw e;
        }
    }

    /**
     * Busca uma categoria específica pelo seu ID.
     * @param id O ID da categoria a ser buscada.
     * @return Um Optional contendo a Categoria se encontrada, ou vazio caso contrário.
     */
    public Optional<Categoria> buscarPorId(Long id) {
        System.out.println("🔍 Service: Buscando categoria por ID: " + id);
        try {
            Optional<Categoria> categoria = categoriaRepository.findById(id);
            if (categoria.isPresent()) {
                System.out.println("✅ Service: Categoria encontrada - " + categoria.get().getNome());
            } else {
                System.out.println("❌ Service: Categoria não encontrada com ID: " + id);
            }
            return categoria;
        } catch (Exception e) {
            System.out.println("❌ Service: Erro ao buscar categoria por ID - " + e.getMessage());
            throw e;
        }
    }

    /**
     * Cria uma nova categoria no sistema.
     * @param request Os dados da categoria a ser criada.
     * @return A categoria criada.
     * @throws IllegalArgumentException Se já existir uma categoria com o mesmo nome.
     */
    public CategoriaResponse criarCategoria(CreateCategoriaRequest request) {
        // Validações manuais
        if (request.getNome() == null || request.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (request.getNome().length() > 100) {
            throw new IllegalArgumentException("Nome deve ter no máximo 100 caracteres");
        }
        if (request.getDescricao() != null && request.getDescricao().length() > 500) {
            throw new IllegalArgumentException("Descrição deve ter no máximo 500 caracteres");
        }

        // Validar se nome já existe
        if (categoriaRepository.findByNomeIgnoreCase(request.getNome()).isPresent()) {
            throw new IllegalArgumentException("Categoria com este nome já existe");
        }

        Categoria categoria = new Categoria();
        categoria.setNome(request.getNome().trim());
        categoria.setDescricao(request.getDescricao());
        categoria.setStatus(booleanToStatus(request.getAtivo() != null ? request.getAtivo() : true));

        Categoria saved = categoriaRepository.save(categoria);
        return toResponse(saved);
    }

    /**
     * Atualiza uma categoria existente.
     * @param id O ID da categoria a ser atualizada.
     * @param request Os novos dados da categoria.
     * @return A categoria atualizada.
     * @throws EntityNotFoundException Se a categoria não for encontrada.
     * @throws IllegalArgumentException Se o nome já estiver em uso por outra categoria.
     */
    public CategoriaResponse atualizarCategoria(Long id, UpdateCategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        // Validar nome duplicado (exceto para a própria categoria)
        if (request.getNome() != null && !request.getNome().trim().isEmpty()) {
            // Validações manuais
            if (request.getNome().length() > 100) {
                throw new IllegalArgumentException("Nome deve ter no máximo 100 caracteres");
            }

            Optional<Categoria> existing = categoriaRepository.findByNomeIgnoreCase(request.getNome());
            if (existing.isPresent() && !existing.get().getId_categoria().equals(id)) {
                throw new IllegalArgumentException("Categoria com este nome já existe");
            }
            categoria.setNome(request.getNome().trim());
        }

        if (request.getDescricao() != null) {
            if (request.getDescricao().length() > 500) {
                throw new IllegalArgumentException("Descrição deve ter no máximo 500 caracteres");
            }
            categoria.setDescricao(request.getDescricao());
        }

        if (request.getAtivo() != null) {
            categoria.setStatus(booleanToStatus(request.getAtivo()));
        }

        Categoria saved = categoriaRepository.save(categoria);
        return toResponse(saved);
    }

    /**
     * Exclui uma categoria do sistema.
     * @param id O ID da categoria a ser excluída.
     * @throws EntityNotFoundException Se a categoria não for encontrada.
     * @throws IllegalStateException Se a categoria possuir produtos vinculados.
     */
    public void excluirCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        // Verificar se categoria está sendo usada por produtos
        if (categoriaRepository.temProdutosVinculados(id)) {
            // Remover a categoria dos produtos antes de excluir
            categoriaRepository.removerCategoriaDosProdutos(id);
        }

        categoriaRepository.delete(categoria);
    }

    /**
     * Altera o status (ativo/inativo) de uma categoria.
     * @param id O ID da categoria.
     * @param ativo O novo status da categoria.
     * @return A categoria com o status atualizado.
     * @throws EntityNotFoundException Se a categoria não for encontrada.
     */
    public CategoriaResponse alterarStatus(Long id, Boolean ativo) {
        if (ativo == null) {
            throw new IllegalArgumentException("Campo 'ativo' é obrigatório");
        }

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        categoria.setStatus(booleanToStatus(ativo));
        Categoria saved = categoriaRepository.save(categoria);

        return toResponse(saved);
    }

    /**
     * Busca categorias por status.
     * @param ativo Status das categorias a serem buscadas.
     * @return Lista de categorias com o status especificado.
     */
    public List<CategoriaResponse> listarPorStatus(Boolean ativo) {
        return categoriaRepository.findByAtivo(ativo)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Busca categorias por nome e status.
     * @param nome Parte do nome a ser buscada.
     * @param ativo Status das categorias.
     * @return Lista de categorias que atendem aos critérios.
     */
    public List<CategoriaResponse> buscarPorNomeEStatus(String nome, Boolean ativo) {
        return categoriaRepository.findByNomeContainingIgnoreCaseAndAtivo(nome, ativo)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Converte uma entidade Categoria para CategoriaResponse.
     * @param categoria A entidade a ser convertida.
     * @return O DTO de resposta.
     */
    private CategoriaResponse toResponse(Categoria categoria) {
        CategoriaResponse response = new CategoriaResponse();
        response.setIdCategoria(categoria.getId_categoria());
        response.setNome(categoria.getNome());
        response.setDescricao(categoria.getDescricao());
        response.setAtivo(statusToBoolean(categoria.getStatus()));
        // Note: dataCriacao and dataAtualizacao are not available in the current model
        // These would need to be added to the Categoria model if needed
        response.setDataCriacao(null);
        response.setDataAtualizacao(null);
        return response;
    }

    /**
     * Converte Boolean para StatusCategoria.
     * @param ativo Status como boolean.
     * @return StatusCategoria correspondente.
     */
    private Categoria.StatusCategoria booleanToStatus(Boolean ativo) {
        return (ativo != null && ativo) ? Categoria.StatusCategoria.ATIVA : Categoria.StatusCategoria.INATIVA;
    }

    /**
     * Converte StatusCategoria para Boolean.
     * @param status Status como enum.
     * @return Boolean correspondente.
     */
    private Boolean statusToBoolean(Categoria.StatusCategoria status) {
        return status == Categoria.StatusCategoria.ATIVA;
    }
}
