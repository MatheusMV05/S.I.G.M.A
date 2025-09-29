package com.project.sigma.service;

import com.project.sigma.model.Categoria;
import com.project.sigma.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        return categoriaRepository.findAll();
    }

    /**
     * Busca uma categoria específica pelo seu ID.
     * @param id O ID da categoria a ser buscada.
     * @return Um Optional contendo a Categoria se encontrada, ou vazio caso contrário.
     */
    public Optional<Categoria> buscarPorId(Long id) {
        return categoriaRepository.findById(id);
    }
}
