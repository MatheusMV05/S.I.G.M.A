package com.project.sigma.service;

import com.project.sigma.dto.FornecedorDTO;
import com.project.sigma.model.Fornecedor;
import com.project.sigma.repository.FornecedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Serviço para Fornecedor
 * Contém lógica de negócio para gerenciamento de fornecedores
 */
@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    /**
     * Cria um novo fornecedor
     */
    @Transactional
    public FornecedorDTO criarFornecedor(FornecedorDTO fornecedorDTO) {
        // Validações
        validarFornecedor(fornecedorDTO);
        
        // Verificar se CNPJ já existe
        if (fornecedorRepository.findByCnpj(fornecedorDTO.getCnpj()).isPresent()) {
            throw new IllegalArgumentException("Já existe um fornecedor cadastrado com este CNPJ.");
        }
        
        Fornecedor fornecedor = convertToEntity(fornecedorDTO);
        fornecedor.setData_cadastro(LocalDateTime.now());
        fornecedor.setStatus(Fornecedor.StatusFornecedor.ATIVO);
        
        fornecedor = fornecedorRepository.save(fornecedor);
        
        return convertToDTO(fornecedor);
    }

    /**
     * Busca todos os fornecedores com filtros opcionais
     */
    public List<FornecedorDTO> buscarFornecedores(String search, String status) {
        List<Fornecedor> fornecedores;
        
        if (StringUtils.hasText(search)) {
            fornecedores = fornecedorRepository.search(search);
        } else if (StringUtils.hasText(status)) {
            fornecedores = fornecedorRepository.findByStatus(Fornecedor.StatusFornecedor.valueOf(status));
        } else {
            fornecedores = fornecedorRepository.findAll();
        }
        
        return fornecedores.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca fornecedor por ID
     */
    public Optional<FornecedorDTO> buscarPorId(Long id) {
        return fornecedorRepository.findById(id)
                .map(this::convertToDTO);
    }

    /**
     * Busca fornecedor por CNPJ
     */
    public Optional<FornecedorDTO> buscarPorCnpj(String cnpj) {
        return fornecedorRepository.findByCnpj(cnpj)
                .map(this::convertToDTO);
    }

    /**
     * Busca apenas fornecedores ativos
     */
    public List<FornecedorDTO> buscarFornecedoresAtivos() {
        return fornecedorRepository.findByStatus(Fornecedor.StatusFornecedor.ATIVO)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza um fornecedor existente
     */
    @Transactional
    public FornecedorDTO atualizarFornecedor(Long id, FornecedorDTO fornecedorDTO) {
        Optional<Fornecedor> fornecedorOpt = fornecedorRepository.findById(id);
        if (fornecedorOpt.isEmpty()) {
            throw new IllegalArgumentException("Fornecedor não encontrado com ID: " + id);
        }
        
        validarFornecedor(fornecedorDTO);
        
        // Verificar se CNPJ já existe em outro fornecedor
        Optional<Fornecedor> fornecedorCnpj = fornecedorRepository.findByCnpj(fornecedorDTO.getCnpj());
        if (fornecedorCnpj.isPresent() && !fornecedorCnpj.get().getId_fornecedor().equals(id)) {
            throw new IllegalArgumentException("Já existe outro fornecedor cadastrado com este CNPJ.");
        }
        
        Fornecedor fornecedor = fornecedorOpt.get();
        atualizarEntidade(fornecedor, fornecedorDTO);
        
        fornecedor = fornecedorRepository.save(fornecedor);
        
        return convertToDTO(fornecedor);
    }

    /**
     * Deleta um fornecedor
     */
    @Transactional
    public void deletarFornecedor(Long id) {
        if (!fornecedorRepository.existsById(id)) {
            throw new IllegalArgumentException("Fornecedor não encontrado com ID: " + id);
        }
        
        // Verificar se tem produtos associados
        Integer totalProdutos = fornecedorRepository.countProdutos(id);
        if (totalProdutos > 0) {
            throw new IllegalStateException(
                "Não é possível excluir o fornecedor pois existem " + totalProdutos + 
                " produtos associados a ele. Inative o fornecedor ao invés de excluí-lo."
            );
        }
        
        fornecedorRepository.deleteById(id);
    }

    /**
     * Ativa/Desativa um fornecedor
     */
    @Transactional
    public FornecedorDTO alterarStatus(Long id, boolean ativo) {
        Optional<Fornecedor> fornecedorOpt = fornecedorRepository.findById(id);
        if (fornecedorOpt.isEmpty()) {
            throw new IllegalArgumentException("Fornecedor não encontrado com ID: " + id);
        }
        
        Fornecedor fornecedor = fornecedorOpt.get();
        fornecedor.setStatus(ativo ? Fornecedor.StatusFornecedor.ATIVO : Fornecedor.StatusFornecedor.INATIVO);
        
        fornecedor = fornecedorRepository.save(fornecedor);
        
        return convertToDTO(fornecedor);
    }

    /**
     * Validações de negócio
     */
    private void validarFornecedor(FornecedorDTO dto) {
        if (!StringUtils.hasText(dto.getNome_fantasia())) {
            throw new IllegalArgumentException("O nome fantasia é obrigatório.");
        }
        
        if (!StringUtils.hasText(dto.getCnpj())) {
            throw new IllegalArgumentException("O CNPJ é obrigatório.");
        }
        
        // Validar formato CNPJ (básico)
        String cnpj = dto.getCnpj().replaceAll("[^0-9]", "");
        if (cnpj.length() != 14) {
            throw new IllegalArgumentException("CNPJ inválido. Deve conter 14 dígitos.");
        }
        
        if (dto.getAvaliacao() != null && (dto.getAvaliacao().compareTo(BigDecimal.ZERO) < 0 || 
            dto.getAvaliacao().compareTo(new BigDecimal("5")) > 0)) {
            throw new IllegalArgumentException("A avaliação deve estar entre 0 e 5.");
        }
    }

    /**
     * Converte Entity para DTO
     */
    private FornecedorDTO convertToDTO(Fornecedor fornecedor) {
        FornecedorDTO dto = new FornecedorDTO();
        
        dto.setId_fornecedor(fornecedor.getId_fornecedor());
        dto.setId_pessoa(fornecedor.getId_pessoa());
        dto.setNome_fantasia(fornecedor.getNome_fantasia());
        dto.setRazao_social(fornecedor.getRazao_social());
        dto.setCnpj(fornecedor.getCnpj());
        dto.setEmail(fornecedor.getEmail());
        dto.setTelefone(fornecedor.getTelefone());
        dto.setRua(fornecedor.getRua());
        dto.setNumero(fornecedor.getNumero());
        dto.setBairro(fornecedor.getBairro());
        dto.setCidade(fornecedor.getCidade());
        dto.setEstado(fornecedor.getEstado());
        dto.setCep(fornecedor.getCep());
        dto.setContato_principal(fornecedor.getContato_principal());
        dto.setCondicoes_pagamento(fornecedor.getCondicoes_pagamento());
        dto.setPrazo_entrega_dias(fornecedor.getPrazo_entrega_dias());
        dto.setAvaliacao(fornecedor.getAvaliacao());
        dto.setStatus(fornecedor.getStatus().name());
        dto.setData_cadastro(fornecedor.getData_cadastro());
        
        // Buscar informações adicionais
        try {
            dto.setTotal_produtos(fornecedorRepository.countProdutos(fornecedor.getId_fornecedor()));
            dto.setValor_total_compras(fornecedorRepository.sumCompras(fornecedor.getId_fornecedor()));
        } catch (Exception e) {
            dto.setTotal_produtos(0);
            dto.setValor_total_compras(BigDecimal.ZERO);
        }
        
        return dto;
    }

    /**
     * Converte DTO para Entity
     */
    private Fornecedor convertToEntity(FornecedorDTO dto) {
        Fornecedor fornecedor = new Fornecedor();
        
        fornecedor.setId_fornecedor(dto.getId_fornecedor());
        fornecedor.setId_pessoa(dto.getId_pessoa());
        fornecedor.setNome_fantasia(dto.getNome_fantasia());
        fornecedor.setRazao_social(dto.getRazao_social());
        fornecedor.setCnpj(dto.getCnpj());
        fornecedor.setEmail(dto.getEmail());
        fornecedor.setTelefone(dto.getTelefone());
        fornecedor.setRua(dto.getRua());
        fornecedor.setNumero(dto.getNumero());
        fornecedor.setBairro(dto.getBairro());
        fornecedor.setCidade(dto.getCidade());
        fornecedor.setEstado(dto.getEstado());
        fornecedor.setCep(dto.getCep());
        fornecedor.setContato_principal(dto.getContato_principal());
        fornecedor.setCondicoes_pagamento(dto.getCondicoes_pagamento());
        fornecedor.setPrazo_entrega_dias(dto.getPrazo_entrega_dias());
        fornecedor.setAvaliacao(dto.getAvaliacao());
        
        if (StringUtils.hasText(dto.getStatus())) {
            fornecedor.setStatus(Fornecedor.StatusFornecedor.valueOf(dto.getStatus()));
        } else {
            fornecedor.setStatus(Fornecedor.StatusFornecedor.ATIVO);
        }
        
        return fornecedor;
    }

    /**
     * Atualiza entidade com dados do DTO
     */
    private void atualizarEntidade(Fornecedor fornecedor, FornecedorDTO dto) {
        fornecedor.setNome_fantasia(dto.getNome_fantasia());
        fornecedor.setRazao_social(dto.getRazao_social());
        fornecedor.setCnpj(dto.getCnpj());
        fornecedor.setEmail(dto.getEmail());
        fornecedor.setTelefone(dto.getTelefone());
        fornecedor.setRua(dto.getRua());
        fornecedor.setNumero(dto.getNumero());
        fornecedor.setBairro(dto.getBairro());
        fornecedor.setCidade(dto.getCidade());
        fornecedor.setEstado(dto.getEstado());
        fornecedor.setCep(dto.getCep());
        fornecedor.setContato_principal(dto.getContato_principal());
        fornecedor.setCondicoes_pagamento(dto.getCondicoes_pagamento());
        fornecedor.setPrazo_entrega_dias(dto.getPrazo_entrega_dias());
        fornecedor.setAvaliacao(dto.getAvaliacao());
        
        if (StringUtils.hasText(dto.getStatus())) {
            fornecedor.setStatus(Fornecedor.StatusFornecedor.valueOf(dto.getStatus()));
        }
    }
}
